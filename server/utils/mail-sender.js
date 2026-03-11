/**
 * @param {string} to - Recipient email address
 * @param {string} subject - Subject line of the email
 * @param {string} text - Plain text body
 * @param {string} [html] - Optional HTML body
 * @returns {Promise} - Resolves when email is sent
 */
async function sendEmail(to, subject, text, html = null) {
  try {
    // BREVO REST API PIPELINE
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY, // key
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: "The Hungry Pirates", // sender name
          email: process.env.EMAIL_USER // Brevo email
        },
        to: [
          {
            email: to // The student signing up
          }
        ],
        subject: subject,
        textContent: text,
        htmlContent: html ? html : text // Fallback to text if html is missing
      })
    });

    if (!response.ok) {
      // If Brevo rejects it, this will catch the exact reason why
      const errorData = await response.json();
      throw new Error(`Brevo API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Email sent successfully via Brevo HTTPS API:", data.messageId);
    return data;
    
  } catch (error) {
    console.error("Error sending email in mail-sender.js:", error.message);
    throw error;
  }
}

module.exports = sendEmail;