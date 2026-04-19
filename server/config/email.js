const nodemailer = require('nodemailer');
 
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  // Force IPv4 because IPv6 may be blocked on Render
  family: 4,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});
 
module.exports = transporter;