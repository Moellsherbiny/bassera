import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const mailFrom = process.env.MAIL_FROM;

if (!smtpHost || !smtpUser || !smtpPassword || !mailFrom) {
  throw new Error("Missing SMTP environment variables");
}

export const mailer = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  return mailer.sendMail({
    from: mailFrom,
    to,
    subject,
    html,
    text,
  });
}
