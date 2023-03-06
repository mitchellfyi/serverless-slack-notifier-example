"use strict";

const axios = require("axios");
jest.mock("axios");

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

module.exports.handler = async (event) => {
  if (!slackWebhookUrl || !event?.body) return;

  let report;

  try {
    report = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error parsing JSON payload" }),
    };
  }

  if (report.Type === "SpamNotification") {
    const to = report.Email;
    const from = report.From;
    const message = `New spam notification for ${to} (from ${from}))`;

    try {
      await axios.post(slackWebhookUrl, { text: message });
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Slack alert sent successfully" }),
      };
    } catch (error) {
      return {
        statusCode: 500,
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
