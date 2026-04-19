const transporter = require('../config/email');

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
    to, subject, html,
  });
};

module.exports = sendEmail;