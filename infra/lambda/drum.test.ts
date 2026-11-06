import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { makeHandler } from './drum';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sns = new SNSClient({});
const ddbMock = mockClient(ddb);
const snsMock = mockClient(sns);
let now = 120_000; // minute 2
const handler = makeHandler({ ddb, sns, tableName: 't', topicArn: 'arn:topic', now: () => now });

const ev = (method: string, path: string, body?: string, isBase64Encoded = false) =>
  ({ routeKey: `${method} ${path}`, requestContext: { http: { method, path } }, body, isBase64Encoded }) as any;
const post = (body?: string, b64 = false) => handler(ev('POST', '/drum', b64 && body ? Buffer.from(body).toString('base64') : body, b64)) as Promise<any>;

beforeEach(() => { ddbMock.reset(); snsMock.reset(); now = 120_000; });

describe('drum handler', () => {
  it('GET returns count 0 when item missing', async () => {
    ddbMock.on(GetCommand).resolves({});
    const r: any = await handler(ev('GET', '/drum'));
    expect(r.statusCode).toBe(200);
    expect(r.headers['content-type']).toBe('application/json');
    expect(JSON.parse(r.body)).toEqual({ count: 0 });
  });

  it('POST LLHL increments, publishes ●●○●, returns count and messageId', async () => {
    ddbMock.on(UpdateCommand).resolves({ Attributes: { count: 6, minute: 1 } });
    snsMock.on(PublishCommand).resolves({ MessageId: 'm-1' });
    const r = await post('{"phrase":"LLHL"}');
    expect(r.statusCode).toBe(200);
    expect(JSON.parse(r.body)).toEqual({ count: 7, messageId: 'm-1' });
    const input = snsMock.commandCalls(PublishCommand)[0].args[0].input;
    expect(input.Message).toContain('●●○●');
    expect(input.Message).toContain('#7');
    expect(input.Subject).toBe('Someone just drummed at you');
    expect(input.MessageAttributes!.phrase.StringValue).toBe('LLHL');
    expect(input.MessageAttributes!.email.StringValue).toBe('yes');
  });

  it('email attribute is no within the same minute, yes in a new minute, and first drum is #1', async () => {
    snsMock.on(PublishCommand).resolves({ MessageId: 'm' });
    const emailAttr = async (old: any) => {
      snsMock.resetHistory();
      ddbMock.on(UpdateCommand).resolves(old);
      const r = await post('{"phrase":"LLHL"}');
      expect(r.statusCode).toBe(200);
      return { r: JSON.parse(r.body), a: snsMock.commandCalls(PublishCommand)[0].args[0].input.MessageAttributes!.email.StringValue };
    };
    expect((await emailAttr({ Attributes: { count: 3, minute: 2 } })).a).toBe('no');
    expect((await emailAttr({ Attributes: { count: 3, minute: 1 } })).a).toBe('yes');
    const first = await emailAttr({});
    expect(first.a).toBe('yes');
    expect(first.r.count).toBe(1);
    const call = ddbMock.commandCalls(UpdateCommand)[0].args[0].input;
    expect(call.ReturnValues).toBe('ALL_OLD');
    expect(call.ExpressionAttributeValues).toMatchObject({ ':one': 1, ':m': 2 });
  });

  it('rejects an oversized base64 body before decoding it', async () => {
    const spy = vi.spyOn(Buffer, 'from');
    const r = await handler(ev('POST', '/drum', 'A'.repeat(401), true)) as any;
    const decoded = spy.mock.calls.some((c) => c[1] === 'base64');
    spy.mockRestore();
    expect(r.statusCode).toBe(400);
    expect(decoded).toBe(false);
  });

  it('accepts a base64-encoded valid body', async () => {
    ddbMock.on(UpdateCommand).resolves({ Attributes: { count: 1 } });
    snsMock.on(PublishCommand).resolves({ MessageId: 'm-2' });
    const r = await post('{"phrase":"LLHL"}', true);
    expect(r.statusCode).toBe(200);
    expect(JSON.parse(r.body)).toEqual({ count: 2, messageId: 'm-2' });
  });

  it.each(['not json', '{}', '{"phrase":"llhl"}', '{"phrase":"LLHLL"}', '{"phrase":"LXHL"}', 'x'.repeat(10000), undefined])(
    'rejects invalid body %#  without side effects',
    async (body) => {
      const r = await post(body as any);
      expect(r.statusCode).toBe(400);
      expect(JSON.parse(r.body)).toEqual({ error: 'invalid phrase' });
      expect(ddbMock.calls()).toHaveLength(0);
      expect(snsMock.calls()).toHaveLength(0);
    },
  );

  it('unknown route → 404', async () => {
    const r: any = await handler(ev('DELETE', '/drum'));
    expect(r.statusCode).toBe(404);
  });

  it('SNS failure → 500 internal', async () => {
    ddbMock.on(UpdateCommand).resolves({ Attributes: { count: 1 } });
    snsMock.on(PublishCommand).rejects(new Error('boom'));
    const r = await post('{"phrase":"LLHL"}');
    expect(r.statusCode).toBe(500);
    expect(JSON.parse(r.body)).toEqual({ error: 'internal' });
  });
});
