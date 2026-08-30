import nodemailer from "nodemailer";
import type { SentMessageInfo, Transporter } from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type { Request } from "express";

const EMAIL_USER = process.env.EMAIL_USER?.trim();
const EMAIL_PASS = process.env.EMAIL_PASS?.trim();

export function isEmailConfigured(): boolean {
  return Boolean(
    EMAIL_USER &&
      EMAIL_PASS &&
      EMAIL_USER !== "your_email@gmail.com" &&
      !EMAIL_USER.startsWith("your_") &&
      !EMAIL_PASS.startsWith("your_") &&
      EMAIL_USER.includes("@")
  );
}

export function createTransporter(): Transporter | null {
  if (!isEmailConfigured()) {
    console.warn(
      "[email] EMAIL_USER / EMAIL_PASS are not configured correctly. " +
        "Emails will be skipped. See server/.env.sample for instructions."
    );
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER as string,
      pass: EMAIL_PASS as string,
    },
  });

  transporter.on("error", (err) => {
    console.error("Mail transport error:", err.message);
  });

  return transporter;
}

export function getTransporter(req: Request): Transporter | null {
  const transporter =
    (req.app.get("transporter") as Transporter | undefined) ?? null;
  return transporter;
}

export async function sendEmail(
  req: Request,
  mailOptions: Mail.Options
): Promise<boolean> {
  const transporter = getTransporter(req);
  if (!transporter) {
    console.warn(
      `[email] Skipped email to "${String(mailOptions.to)}" - transport not configured.`
    );
    return false;
  }

  try {
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.info(
      `[email] Sent "${mailOptions.subject ?? ""}" to "${String(
        mailOptions.to
      )}" (${info?.messageId || "no messageId"})`
    );
    return true;
  } catch (err) {
    const firstLine =
      (err as Error).message?.split("\n")[0] || "unknown SMTP error";
    console.error(
      `[email] Failed to send to "${String(mailOptions.to)}": ${firstLine}`
    );
    console.error(
      "[email] Fix: enable 2-Step Verification for the Google account in EMAIL_USER, " +
        "then create an App Password at https://myaccount.google.com/apppasswords " +
        "and put it in EMAIL_PASS (16 chars, no spaces)."
    );
    return false;
  }
}