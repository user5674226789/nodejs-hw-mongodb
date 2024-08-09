// src/utils/sendMail.js

import nodemailer from 'nodemailer';

// import { env } from '../utils/env.js';

import { SMTP } from '../constants/index.js';

const transporter = nodemailer.createTransport({
  host: SMTP.SMTP_HOST,
  port: SMTP.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP.SMTP_USER,
    pass: SMTP.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({ from, to, subject, html }) => {
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  console.log('Message sent: %s', info.messageId);
};
