import nodemailer from "nodemailer";
import { createDirectEnquiryHandler } from "@/lib/directEnquiry.js";

export const config = {
  api: {
    bodyParser: { sizeLimit: "16kb" },
  },
};

const handler = createDirectEnquiryHandler({
  sendMail: async (message) => {
    const port = Number.parseInt(process.env.SMTP_PORT || "587", 10);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    return transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      ...message,
    });
  },
});

export default handler;
