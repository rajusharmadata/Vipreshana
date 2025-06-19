const sendMail = require("../../Utils/sendMail");

// Sanitization function
const sanitize = (str) => {
    return str?.trim().replace(/[<>"'\/]/g, '');
};

const forgotPasswordController = async (req, res) => {
    const { email } = req.body;
    // console.log("Received email:", email);
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const mailData = {
        to: email,
        subject: 'Reset Your Password',
        html: `<p>Click the link below to reset your password:</p>
               <a href="https://vipreshana-2.vercel.app/reset-password">Reset Password</a>`
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
