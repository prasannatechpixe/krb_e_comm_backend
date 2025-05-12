const nodemailer = require("nodemailer");
const mail = require("@sendgrid/mail");
require("dotenv").config();

const sendEmail = async ({ to, subject, text }) => {
    try {
        if (!to || !subject || !text) {
            throw new Error("Missing required email fields (to, subject, text)");
        }

        // Create a transporter object using your Gmail SMTP details
        // Create a transporter object using the provided SMTP details
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',                // SMTP host from PHP (smtp.gmail.com)
            port: 465,                             // SMTP port (465 is used for SSL encryption)
            secure: true,                          // Use SSL (true for port 465, as per your settings)
            auth: {
                user: 'krbdetectors@gmail.com',     // SMTP username (your Gmail address)
                pass: 'dpfr ufnh holh esqu',         // SMTP password (App Password if using 2FA)
            },
            tls: {
                rejectUnauthorized: false            // To bypass SSL certificate verification (use cautiously)
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html: text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent via Gmail SMTP:", info.messageId);
        return { success: true, provider: "Gmail", messageId: info.messageId };

    } catch (error) {
        console.error("❌ Error sending email:", error.message);
        return { success: false, error: error.message };
    }
};

module.exports = sendEmail;
