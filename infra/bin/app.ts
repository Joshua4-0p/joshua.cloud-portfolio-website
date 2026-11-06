import * as cdk from 'aws-cdk-lib';
import { TalkingDrumStack } from '../lib/talking-drum-stack';

new TalkingDrumStack(new cdk.App(), 'TalkingDrumStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
});
