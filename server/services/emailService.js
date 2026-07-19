const nodemailer = require("nodemailer");

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASSWORD is missing in .env"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser.trim(),
      pass: emailPassword.replace(/\s/g, ""),
    },
  });
};

const sendPasswordResetOtpEmail = async ({
  email,
  name,
  otp,
}) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from:
      process.env.EMAIL_FROM ||
      `"CricEDGE" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "Reset your CricEDGE password",

    text: `Hi ${name}, your CricEDGE password reset OTP is ${otp}. It expires in 10 minutes.`,

    html: `
      <div style="margin:0;padding:32px;background:#07101f;font-family:Arial,sans-serif;color:#ffffff">
        <div style="max-width:560px;margin:auto;background:#0d1729;border:1px solid #24324d;border-radius:18px;padding:32px">
          <h1 style="margin:0 0 8px;color:#60a5fa;font-size:28px">
            CricEDGE
          </h1>

          <h2 style="margin:24px 0 12px;font-size:22px">
            Reset your password
          </h2>

          <p style="color:#a9b7d4;line-height:1.6">
            Hi ${name},
          </p>

          <p style="color:#a9b7d4;line-height:1.6">
            Use the following verification code to reset your CricEDGE password.
          </p>

          <div style="margin:28px 0;text-align:center">
            <span style="display:inline-block;padding:16px 28px;background:#111f36;border:1px solid #3b82f6;border-radius:12px;font-size:32px;font-weight:700;letter-spacing:8px;color:#ffffff">
              ${otp}
            </span>
          </div>

          <p style="color:#a9b7d4;line-height:1.6">
            This OTP expires in
            <strong style="color:#ffffff">
              10 minutes
            </strong>.
          </p>

          <p style="color:#6b7db3;font-size:13px;line-height:1.5">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendPasswordResetOtpEmail,
};