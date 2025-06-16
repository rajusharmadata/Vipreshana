const Models = require("../../Models/index.models");
const bcrypt = require('bcryptjs');

// Sanitization function
const sanitize = (str) => {
  return str?.trim().replace(/[<>"'\/]/g, '');
};

const userRegisterController = async (req, res) => {
    let { name, email, password, phone, role } = req.body;

    try {

            name = sanitize(name);
            email = sanitize(email);
            phone = phone?.trim();
            role = sanitize(role);

            const existingUser = await Models.UserSchema.findOne({ $or: [{ email }, { phone }] });
            if (existingUser) {
                return res.status(400).json({ error: "Email or Phone already registered" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newRegistration = new Models.UserSchema({ name, email, password: hashedPassword, phone, role });
            await newRegistration.save();

            res.status(200).json({ message: "Registration successful!" });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: "Failed to register user" });
    }
}

module.exports = userRegisterController;