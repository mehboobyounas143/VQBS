const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, verificationLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.forbloging19@gmail.com,
        pass: process.env.lzgnkrpmhijfkrwl,
      },
    });

    await transporter.sendMail({
      from: `"Virtual Question Bank" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - VQBS',
      html: `
        <h3>Email Verification</h3>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    });

    console.log('✅ Verification email sent');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

module.exports = { sendVerificationEmail };
