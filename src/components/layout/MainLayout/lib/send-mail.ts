'use server';
import nodemailer from 'nodemailer';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_PORT = process.env.SMTP_PORT;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  }
});

type SendMailProps = {
  email?: string;
  sendTo?: string;
  subject?: string;
  text?: string;
  html?: string;
};

export async function sendMail({email, sendTo, subject, text, html}: SendMailProps ) {
  try {
    await transporter.verify();

  } catch (error) {
    console.log('Something Went Wraong', SMTP_USER, SMTP_PASS, error);
    return;
  }
  const info = await transporter.sendMail({
    from: email,
    to: sendTo || SITE_MAIL_RECIEVER,
    subject: subject,
    text: text,
    html: html ? html : '',
  });
  console.log('Message Sent', info.messageId);
  console.log('Mail sent to', SITE_MAIL_RECIEVER );
  return info;
}