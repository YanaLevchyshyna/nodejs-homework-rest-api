import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config(); // Завантажити змінні середовища з файлу .env

const { UKR_NET_PASS, UKR_NET_EMAIL } = process.env;

// console.log('process.env :', process.env);
// console.log('UKR-NET_USER:', UKR_NET_EMAIL);
// console.log('UKR-NET-PASS', UKR_NET_PASS);

const config = {
  host: 'smtp.ukr.net',
  port: 2525, //(якщо з'єднання за 465-м портом заблоковано, можна використовувати порт 2525);
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASS,
  },
};

const transporter = nodemailer.createTransport(config); //  обʼєкт який відсилає лист

// const data = {
//   to: 'cexerax130@qianhost.com',
//   subject: 'Test email',
//   html: '<strong>Test email</strong>',
// };

const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_EMAIL };
  return transporter.sendMail(email);
};

export default sendEmail;
