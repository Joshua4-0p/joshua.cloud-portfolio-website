import { describe, it, expect } from 'vitest';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TalkingDrumStack } from '../lib/talking-drum-stack';

const app = new App({ context: { siteUrl: 'https://example.com' } });
const t = Template.fromStack(new TalkingDrumStack(app, 'T', { env: { region: 'us-east-1', account: '123456789012' } }));

describe('TalkingDrumStack', () => {
  it('has email and sqs subscriptions', () => {
    t.resourceCountIs('AWS::SNS::Subscription', 2);
    t.hasResourceProperties('AWS::SNS::Subscription', { Protocol: 'email', Endpoint: 'josuefotseu02@gmail.com' });
    t.hasResourceProperties('AWS::SNS::Subscription', { Protocol: 'sqs', RawMessageDelivery: true });
  });
  it('lambda is arm64 node22 3s', () => {
    t.hasResourceProperties('AWS::Lambda::Function', { Architectures: ['arm64'], Runtime: 'nodejs22.x', Timeout: 3, MemorySize: 128 });
  });
  it('table on demand', () => {
    t.hasResourceProperties('AWS::DynamoDB::Table', { BillingMode: 'PAY_PER_REQUEST' });
  });
  it('queue encrypted, 4 days', () => {
    t.hasResourceProperties('AWS::SQS::Queue', { SqsManagedSseEnabled: true, MessageRetentionPeriod: 345600 });
  });
  it('stage throttling 2/10', () => {
    t.hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      DefaultRouteSettings: { ThrottlingRateLimit: 2, ThrottlingBurstLimit: 10 },
    });
  });
});
