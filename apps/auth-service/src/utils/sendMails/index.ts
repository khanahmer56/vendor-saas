import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";

dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const renderEmailTemplate = async (templateName: string, data: any) => {
  const templatePath = path.join(
    process.cwd(),
    "apps",
    "auth-service",
    "src",
    "utils",
    "email-templates",
    `${templateName}.ejs`
  );
  const template = ejs.renderFile(templatePath, data);
  return template;
};

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: any
) => {
  try {
    const html = await renderEmailTemplate(templateName, data);
    const mailOptions = {
      from: `<${process.env.SMTP_USER}>`,
      to,
      subject,
      html: html as string,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
