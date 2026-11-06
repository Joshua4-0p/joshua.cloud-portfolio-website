import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
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
    table.grantReadWriteData(fn);
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

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.apiEndpoint });
    new cdk.CfnOutput(this, 'QueueUrl', { value: queue.queueUrl });
  }
}
