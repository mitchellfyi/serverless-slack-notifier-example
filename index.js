"use strict";

const axios = require("axios");

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

module.exports.handler = async (event) => {
  if (!slackWebhookUrl || !event?.body) return;

  try {
    const requestBody = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Not valid JSON" }),
    };
  }

  if (requestBody.Type === "SpamNotification") {
    const to = requestBody.Email;
    const from = requestBody.From;
    const message = `New spam notification for ${email}`;

    await axios.post(slackWebhookUrl, {
      text: message,
    });

    try {
      const response = await axios.post(slackWebhookUrl, { text: message });
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Alert sent to Slack" }),
      };
    } catch (error) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "There was a problem sending the message to Slack",
        }),
      };
    }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "No action taken" }),
    };
  }
};
