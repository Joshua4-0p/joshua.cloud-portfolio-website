import { describe, it, expect } from 'vitest';
import { App } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { TalkingDrumStack } from '../lib/talking-drum-stack';

const app = new App({ context: { siteUrl: 'https://example.com' } });
const t = Template.fromStack(new TalkingDrumStack(app, 'T', { env: { region: 'us-east-1', account: '123456789012' } }));

describe('TalkingDrumStack', () => {
  it('has email and sqs subscriptions', () => {
    t.resourceCountIs('AWS::SNS::Subscription', 3);
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
  it('ops-alerts topic emails the ops address', () => {
    t.resourceCountIs('AWS::SNS::Topic', 2);
    t.hasResourceProperties('AWS::SNS::Topic', { TopicName: 'ops-alerts' });
    t.hasResourceProperties('AWS::SNS::Subscription', { Protocol: 'email', Endpoint: 'ops@example.com' });
  });
  it('hourly canary with 7-day artifact lifecycle', () => {
    t.resourceCountIs('AWS::Synthetics::Canary', 1);
    t.hasResourceProperties('AWS::Synthetics::Canary', { Schedule: { Expression: 'rate(1 hour)' } });
    t.hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: { Rules: [Match.objectLike({ ExpirationInDays: 7, Status: 'Enabled' })] },
    });
  });
  it('two alarms to ops-alerts, notBreaching', () => {
    t.resourceCountIs('AWS::CloudWatch::Alarm', 2);
    t.hasResourceProperties('AWS::CloudWatch::Alarm', {
      MetricName: 'SuccessPercent', Threshold: 100, ComparisonOperator: 'LessThanThreshold', EvaluationPeriods: 1, TreatMissingData: 'notBreaching',
      AlarmActions: Match.anyValue(),
    });
    t.hasResourceProperties('AWS::CloudWatch::Alarm', {
      MetricName: 'Errors', Namespace: 'AWS/Lambda', Threshold: 1, Period: 300, ComparisonOperator: 'GreaterThanOrEqualToThreshold', TreatMissingData: 'notBreaching',
    });
  });
  it('budget $5 monthly with 3 notifications to budget email', () => {
    t.hasResourceProperties('AWS::Budgets::Budget', {
      Budget: Match.objectLike({ BudgetType: 'COST', TimeUnit: 'MONTHLY', BudgetLimit: { Amount: 5, Unit: 'USD' } }),
      NotificationsWithSubscribers: [
        Match.objectLike({ Notification: Match.objectLike({ NotificationType: 'ACTUAL', Threshold: 20 }), Subscribers: [{ SubscriptionType: 'EMAIL', Address: 'budget@example.com' }] }),
        Match.objectLike({ Notification: Match.objectLike({ NotificationType: 'ACTUAL', Threshold: 100 }) }),
        Match.objectLike({ Notification: Match.objectLike({ NotificationType: 'FORECASTED', Threshold: 100 }) }),
      ],
    });
  });
  it('lambda has least-privilege dynamodb actions', () => {
    const policies = Object.values(t.findResources('AWS::IAM::Policy')) as any[];
    const actions = policies.flatMap((p) => p.Properties.PolicyDocument.Statement)
      .flatMap((s: any) => [].concat(s.Action)).filter((a: string) => a.startsWith('dynamodb:'));
    expect(actions.sort()).toEqual(['dynamodb:GetItem', 'dynamodb:UpdateItem']);
  });
  it('cors origins, log retention, table retained, queue policy scoped to topic', () => {
    t.hasResourceProperties('AWS::ApiGatewayV2::Api', {
      CorsConfiguration: Match.objectLike({ AllowOrigins: ['https://example.com', 'http://localhost:3000', 'http://localhost:4321'] }),
    });
    t.hasResourceProperties('AWS::Logs::LogGroup', { RetentionInDays: 14 });
    t.hasResource('AWS::DynamoDB::Table', { DeletionPolicy: 'Retain' });
    t.hasResourceProperties('AWS::SQS::QueuePolicy', {
      PolicyDocument: { Statement: [Match.objectLike({ Condition: { ArnEquals: { 'aws:SourceArn': Match.anyValue() } } })] },
    });
  });
});
