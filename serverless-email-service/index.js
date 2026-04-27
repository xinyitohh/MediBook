// ═══════════════════════════════════════════════════════════════
//  MediBook — Serverless Email Service (AWS Lambda + SES)
//  Triggered via Amazon API Gateway (HTTP POST)
//
//  Payload:  { "toEmail": "...", "subject": "...", "body": "..." }
//  Returns:  200 on success, 500 on error
// ═══════════════════════════════════════════════════════════════

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// SES client — uses the Lambda execution role credentials automatically
const sesClient = new SESClient({ region: process.env.AWS_REGION || "us-east-1" });

// ── Verified sender address (must be verified in SES) ──────────
const SENDER_EMAIL = process.env.SENDER_EMAIL || "oscarlow2002@gmail.com";

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // ── Parse the incoming payload ───────────────────────────────
  let payload;
  try {
    // API Gateway may pass the body as a string or already-parsed object
    payload = typeof event.body === "string" ? JSON.parse(event.body) : event.body || event;
  } catch (parseError) {
    console.error("Failed to parse request body:", parseError.message);
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "Invalid JSON in request body",
      }),
    };
  }

  // ── Validate required fields ─────────────────────────────────
  const { toEmail, subject, body } = payload;

  if (!toEmail || !subject || !body) {
    console.error("Missing required fields:", { toEmail, subject, bodyPresent: !!body });
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "Missing required fields: toEmail, subject, and body are all required.",
      }),
    };
  }

  // ── Build SES SendEmail command ──────────────────────────────
  const params = {
    Source: SENDER_EMAIL,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: body,
          Charset: "UTF-8",
        },
      },
    },
  };

  // ── Send the email via SES ───────────────────────────────────
  try {
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);

    console.log("SES SendEmail success. MessageId:", result.MessageId);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Email sent successfully",
        messageId: result.MessageId,
      }),
    };
  } catch (sesError) {
    console.error("SES SendEmail failed:", sesError.message);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "Failed to send email via SES",
        error: sesError.message,
      }),
    };
  }
};
