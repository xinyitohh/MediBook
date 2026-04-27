// ═══════════════════════════════════════════════════════════════
//  MediBook — Serverless Email Service (AWS Lambda + Resend)
//  Triggered via Amazon API Gateway (HTTP POST)
//
//  Payload:  { "toEmail": "...", "subject": "...", "body": "..." }
//  Returns:  200 on success, 500 on error
// ═══════════════════════════════════════════════════════════════

import { Resend } from "resend";

// ── Verified sender address ────────────────────────────────────
// In Resend, this needs to be a verified domain (e.g. onboarding@resend.dev or your domain)
const SENDER_EMAIL = process.env.SENDER_EMAIL || "MediBook <noreply@medibook.xinyitoh.com>";

export const handler = async (event) => {
  // Initialize Resend inside handler to ensure we always get the latest env var
  // .trim() prevents issues if an invisible space was accidentally copied
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const resend = new Resend(apiKey);

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

  // ── Send the email via Resend ────────────────────────────────
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [toEmail],
      subject: subject,
      html: body,
    });

    if (error) {
      console.error("Resend API returned an error:", error);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          message: "Failed to send email via Resend",
          error: error.message,
        }),
      };
    }

    console.log("Resend email success. ID:", data.id);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Email sent successfully",
        messageId: data.id,
      }),
    };
  } catch (err) {
    console.error("Resend SendEmail failed:", err.message);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "Failed to send email via Resend",
        error: err.message,
      }),
    };
  }
};
