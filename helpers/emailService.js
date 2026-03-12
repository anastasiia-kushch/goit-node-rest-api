import nodemailer from 'nodemailer';

const {
  SMTP_HOST = 'smtp.ukr.net',
  SMTP_PORT = 465,
  SMTP_SECURE = 'true',
  SMTP_USER,
  SMTP_PASS,
  BASE_URL = 'http://localhost:3000',
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendVerificationEmail(email, token) {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error(
      'Email service not configured. Set SMTP_USER and SMTP_PASS.',
    );
  }

  const verifyLink = `${BASE_URL}/api/auth/verify/${token}`;

  const mailOptions = {
    from: SMTP_USER,
    to: email,
    subject: 'Verify your email',
    html: `<p>Welcome! Please verify your email by clicking the link below:</p>
      <a href="${verifyLink}">Verify email</a>
      <p>If you did not request this, please ignore.</p>`,
  };

  return transporter.sendMail(mailOptions);
}
