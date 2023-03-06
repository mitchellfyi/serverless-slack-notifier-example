# Serverless Slack Notifier Example

This demonstrates how to deploy a NodeJS function running on AWS Lambda using the Serverless Framework. 
The deployed function will accept a JSON payload as a POST request and send an alert to a Slack channel if the payload matches the desired criteria.

## Setup & Usage

1. Create an AWS account
2. [Create an IAM user](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) for deploying with serverless
3. Run `npm deploy` to push the code to Lambda
4. In AWS, add API Gateway as a trigger for your Lambda function
5. In your API Gateway, update the function route to POST
6. [Enable IAM authorisation](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-access-control-iam.html) for your API to control access
7. Setup Slack (see below)
8. Add your Slack webhook URL as an environment variable to your Lambda function

### Set up Slack Integration

Before we can send alerts to Slack, we need to set up an incoming webhook integration in Slack. To do this, follow the steps below:

1. Go to https://api.slack.com/apps and create a new app.
2. Under the "Features" tab, click on "Incoming Webhooks" and turn it on.
3. Click on "Add New Webhook to Workspace" and select the channel you want to post alerts to.
4. Copy the webhook URL.

### Local development

You can run the tests for this function locally:

```bash
npm run test
```