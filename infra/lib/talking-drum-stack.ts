import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as cwActions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as budgets from 'aws-cdk-lib/aws-budgets';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export class TalkingDrumStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const siteUrl = this.node.tryGetContext('siteUrl');
    if (!siteUrl) throw new Error('pass -c siteUrl=https://...');

    const table = new ddb.Table(this, 'Drums', {
      partitionKey: { name: 'pk', type: ddb.AttributeType.STRING },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const topic = new sns.Topic(this, 'Telegraph', { topicName: 'drum-telegraph' });
    topic.addSubscription(new subs.EmailSubscription('josuefotseu02@gmail.com'));
    const queue = new sqs.Queue(this, 'Archive', {
      queueName: 'village-archive',
      encryption: sqs.QueueEncryption.SQS_MANAGED,
      retentionPeriod: cdk.Duration.days(4),
    });
    topic.addSubscription(new subs.SqsSubscription(queue, { rawMessageDelivery: true }));

    const fn = new NodejsFunction(this, 'DrumFn', {
      entry: 'lambda/drum.ts',
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 128,
      timeout: cdk.Duration.seconds(3),
      logGroup: new logs.LogGroup(this, 'DrumLogs', {
        retention: logs.RetentionDays.TWO_WEEKS,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
      environment: { TABLE_NAME: table.tableName, TOPIC_ARN: topic.topicArn },
      bundling: { forceDockerBundling: false },
    });
    table.grant(fn, 'dynamodb:GetItem', 'dynamodb:UpdateItem');
    topic.grantPublish(fn);

    const api = new apigw.HttpApi(this, 'DrumApi', {
      corsPreflight: {
        allowOrigins: [siteUrl, 'http://localhost:3000', 'http://localhost:4321'],
        allowMethods: [apigw.CorsHttpMethod.GET, apigw.CorsHttpMethod.POST],
        allowHeaders: ['content-type'],
      },
    });
    const integration = new HttpLambdaIntegration('DrumInt', fn);
    api.addRoutes({ path: '/drum', methods: [apigw.HttpMethod.GET, apigw.HttpMethod.POST], integration });
    (api.defaultStage!.node.defaultChild as apigw.CfnStage).defaultRouteSettings = {
      throttlingRateLimit: 2,
      throttlingBurstLimit: 10,
    };

    // Monitoring
    const ops = new sns.Topic(this, 'OpsAlerts', { topicName: 'ops-alerts' });
    ops.addSubscription(new subs.EmailSubscription('ops@example.com'));
    const alarmAction = new cwActions.SnsAction(ops);

    const canary = new synthetics.Canary(this, 'SiteCanary', {
      canaryName: 'drum-site-heartbeat',
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_13_0,
      schedule: synthetics.Schedule.expression('rate(1 hour)'),
      test: synthetics.Test.custom({
        handler: 'index.handler',
        code: synthetics.Code.fromInline(`
const synthetics = require('Synthetics');
exports.handler = async () => {
  const page = await synthetics.getPage();
  const res = await page.goto(${JSON.stringify(siteUrl)}, { waitUntil: 'domcontentloaded', timeout: 30000 });
  if (!res || res.status() !== 200) throw new Error('unexpected status ' + (res && res.status()));
  const html = await page.content();
  if (!html.includes('The drum has a message for you')) throw new Error('marker text missing');
};`),
      }),
      artifactsBucketLifecycleRules: [{ expiration: cdk.Duration.days(7) }],
    });
    canary.metricSuccessPercent({ period: cdk.Duration.hours(1) })
      .createAlarm(this, 'CanaryFailing', {
        threshold: 100, evaluationPeriods: 1,
        comparisonOperator: cw.ComparisonOperator.LESS_THAN_THRESHOLD,
        treatMissingData: cw.TreatMissingData.NOT_BREACHING,
      }).addAlarmAction(alarmAction);
    fn.metricErrors({ period: cdk.Duration.minutes(5) })
      .createAlarm(this, 'LambdaErrors', {
        threshold: 1, evaluationPeriods: 1,
        comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: cw.TreatMissingData.NOT_BREACHING,
      }).addAlarmAction(alarmAction);

    const budgetSub = [{ subscriptionType: 'EMAIL', address: 'budget@example.com' }];
    const notif = (notificationType: string, threshold: number) => ({
      notification: { notificationType, comparisonOperator: 'GREATER_THAN', threshold, thresholdType: 'PERCENTAGE' },
      subscribers: budgetSub,
    });
    new budgets.CfnBudget(this, 'MonthlyBudget', {
      budget: {
        budgetName: 'talking-drum-monthly',
        budgetType: 'COST',
        timeUnit: 'MONTHLY',
        budgetLimit: { amount: 5, unit: 'USD' },
      },
      notificationsWithSubscribers: [notif('ACTUAL', 20), notif('ACTUAL', 100), notif('FORECASTED', 100)],
    });

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.apiEndpoint });
    new cdk.CfnOutput(this, 'QueueUrl', { value: queue.queueUrl });
  }
}
