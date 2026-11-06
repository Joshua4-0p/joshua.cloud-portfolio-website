import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

interface Deps { ddb: DynamoDBDocumentClient; sns: SNSClient; tableName: string; topicArn: string }

const json = (statusCode: number, body: unknown): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});
const invalid = () => json(400, { error: 'invalid phrase' });

export function makeHandler({ ddb, sns, tableName, topicArn }: Deps) {
  return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
      const route = `${event.requestContext.http.method} ${event.requestContext.http.path}`;
      if (route === 'GET /drum') {
        const { Item } = await ddb.send(new GetCommand({ TableName: tableName, Key: { pk: 'drums' } }));
        return json(200, { count: Item?.count ?? 0 });
      }
      if (route !== 'POST /drum') return json(404, { error: 'not found' });

      const raw = event.body ?? '';
      if (raw.length > 400) return invalid();
      const body = event.isBase64Encoded ? Buffer.from(raw, 'base64').toString('utf8') : raw;
      if (Buffer.byteLength(body) > 200) return invalid();
      let phrase: unknown;
      try { phrase = JSON.parse(body)?.phrase; } catch { return invalid(); }
      if (typeof phrase !== 'string' || !/^[LH]{4}$/.test(phrase)) return invalid();

      const { Attributes } = await ddb.send(new UpdateCommand({
        TableName: tableName,
        Key: { pk: 'drums' },
        UpdateExpression: 'ADD #c :one',
        ExpressionAttributeNames: { '#c': 'count' },
        ExpressionAttributeValues: { ':one': 1 },
        ReturnValues: 'UPDATED_NEW',
      }));
      const count = Attributes?.count;
      const notation = [...phrase].map((c) => (c === 'L' ? '●' : '○')).join('');
      const { MessageId } = await sns.send(new PublishCommand({
        TopicArn: topicArn,
        Subject: 'Someone just drummed at you',
        Message: `Someone just drummed at you: ${notation} (rhythm #${count})`,
        MessageAttributes: { phrase: { DataType: 'String', StringValue: phrase } },
      }));
      return json(200, { count, messageId: MessageId });
    } catch (err) {
      console.error(err);
      return json(500, { error: 'internal' });
    }
  };
}

export const handler = makeHandler({
  ddb: DynamoDBDocumentClient.from(new DynamoDBClient({})),
  sns: new SNSClient({}),
  tableName: process.env.TABLE_NAME!,
  topicArn: process.env.TOPIC_ARN!,
});
