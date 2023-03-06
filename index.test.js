process.env.SLACK_WEBHOOK_URL = "test";

const axios = require("axios");
const notify = require("./index.js");

jest.mock("axios");

describe("notify.handler", () => {
  test("should send a Slack alert when receiving a spam notification", async () => {
    axios.post.mockImplementation(() => Promise.resolve());

    const mockEvent = {
      body: JSON.stringify({
        RecordType: "Bounce",
        Type: "SpamNotification",
        TypeCode: 512,
        Name: "Spam notification",
        Tag: "",
        MessageStream: "outbound",
        Description:
          "The message was delivered, but was either blocked by the user, or classified as spam, bulk mail, or had rejected content.",
        Email: "zaphod@example.com",
        From: "notifications@example.com",
        BouncedAt: "2023-02-27T21:41:30Z",
      }),
    };

    const response = await notify.handler(mockEvent);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body).message).toEqual("Slack alert sent successfully");
  });

  test("should NOT send a Slack alert when receiving anything else", async () => {
    const mockEvent = {
      body: JSON.stringify({
        RecordType: "Bounce",
        MessageStream: "outbound",
        Type: "HardBounce",
        TypeCode: 1,
        Name: "Hard bounce",
        Tag: "Test",
        Description:
          "The server was unable to deliver your message (ex: unknown user, mailbox not found).",
        Email: "arthur@example.com",
        From: "notifications@example.com",
        BouncedAt: "2019-11-05T16:33:54.9070259Z",
      }),
    };

    const response = await notify.handler(mockEvent);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body).message).toEqual("No action taken");
  });

  test("should return an error when given an invalid JSON payload", async () => {
    const mockEvent = {
      body: "{invalid json}",
    };

    const response = await notify.handler(mockEvent);
    expect(response.statusCode).toEqual(500);
    expect(JSON.parse(response.body).message).toEqual("Error parsing JSON payload");
  });

  test("should return an error when the POST to the Slack webhook URL fails", async () => {
    axios.post.mockImplementation(() => Promise.reject());

    const mockEvent = {
      body: JSON.stringify({
        Type: "SpamNotification",
      }),
    };

    const response = await notify.handler(mockEvent);
    expect(response.statusCode).toEqual(500);
    expect(JSON.parse(response.body).message).toEqual(
      "There was a problem sending the message to Slack"
    );
  });
});
