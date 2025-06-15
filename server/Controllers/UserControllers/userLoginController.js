const Models = require("../../Models/index.models");
const bcrypt = require('bcryptjs');

const userLoginController = async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await Models.UserSchema.findOne({ phone });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        let redirectUrl = '/logindashboard';
        if (user.role === 'admin') redirectUrl = '/admin';
        else if (user.role === 'driver') redirectUrl = '/driver';

        res.status(200).json({ message: "Login successful", redirectUrl });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: "Failed to log in" });
    }
}

module.exports = userLoginController;