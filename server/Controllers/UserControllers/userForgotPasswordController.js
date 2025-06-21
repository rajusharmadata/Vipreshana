const sendMail = require("../../Utils/sendMail");

const sanitize = (str) => {
    return str?.trim().replace(/[<>"'\/]/g, '');
};

const forgotPasswordController = async (req, res) => {
    const { email } = req.body;
    const sanitizedEmail = sanitize(email);

    if (!sanitizedEmail) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const mailData = {
        to: sanitizedEmail,
        subject: 'Reset Your Password - Vipreshana',
        html: `
            <p>Hello,</p>
            <p>You requested to reset your password. Click the link below:</p>
            <a href="https://vipreshana-2.vercel.app/reset-password" style="color: blue;">Reset Password</a>
            <p>If you didn't request this, just ignore this email.</p>
            <p>– Vipreshana Team</p>
        `
    };

    sendMail(mailData, (error, info) => {
        if (error) {
            console.error('Email send error:', error);
            return res.status(500).json({ message: 'Failed to send email' });
        } else {
            return res.status(200).json({ message: 'Reset link sent successfully' });
        }
    });
};

module.exports = forgotPasswordController;
