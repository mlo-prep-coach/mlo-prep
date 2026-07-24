import { Resend } from "resend";

const ALERT_EMAIL = "getmloprep@gmail.com";
const FROM_ADDRESS = "MLO Prep Alerts <onboarding@resend.dev>";

let resendClient = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

// Fire-and-forget security/fraud alert email. Never throws — a failed alert
// should never break the request that triggered it.
export async function sendSecurityAlert(subject, lines) {
  const resend = getResend();
  if (!resend) {
    console.error("sendSecurityAlert skipped: RESEND_API_KEY is not set. Subject:", subject);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: ALERT_EMAIL,
      subject: `[MLO Prep Alert] ${subject}`,
      text: lines.join("\n"),
    });
  } catch (err) {
    console.error("sendSecurityAlert failed:", err);
  }
}
