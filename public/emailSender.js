require('dotenv').config(); // Load environment variables from .env file
const nodemailer = require('nodemailer');

// Function to send an email
async function sendSignUpEmail(userEmail, userType) {
  // A transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, // Email user from environment variable
      pass: process.env.EMAIL_PASS  // App-specific password from environment variable
    }
  });

  // Email options
  let mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: userEmail,                // Recipient address
    subject: 'Welcome to Our Service!',
    text: `Hello,\n\nThank you for signing up as a ${userType}! We're glad to have you on board. If you have any questions, feel free to reach out.\n\nBest regards,\nThe Team`,
    html: `<p>Hello,</p><p>Thank you for signing up as a ${userType}! We're glad to have you on board. If you have any questions, feel free to reach out.</p><p>Best regards, <br>The Team</p>`
  };

  // Sending the email and handling potential errors
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { sendSignUpEmail };
