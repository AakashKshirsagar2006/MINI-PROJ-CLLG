const nodemailer = require("nodemailer");

/**
 * * @param {string} to - Recipient email address
 * @param {string} subject - Subject line of the email
 * @param {string} text - Plain text body
 * @param {string} [html] - Optional HTML body
 * @returns {Promise} - Resolves when email is sent
 */
async function sendEmail(to, subject, text, html = null) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      }
    });
    
    const mailOptions = {
      from:`"FCRIT Canteen" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = sendEmail;

