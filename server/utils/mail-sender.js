
const nodemailer = require("nodemailer");

/**
 * @param {string} to - Recipient email address
 * @param {string} subject - Subject line of the email
 * @param {string} text - Plain text body
 * @param {string} [html] - Optional HTML body
 * @returns {Promise} - Resolves when email is sent
 */
async function sendEmail(to, subject, text, html = null) {
  try {
    // BREVO SMTP PIPELINE
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // false because we are using port 587
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.SMTP_KEY  // Brevo master key
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_FROM, 
      to,
      subject,
      text,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via Brevo:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email in mail-sender.js:", error);
    throw error;
  }
}

module.exports = sendEmail;