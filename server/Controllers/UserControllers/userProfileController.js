const Models = require("../../Models/index.models");
const bcrypt = require('bcryptjs');


const sanitize = (str) => {
    return str?.trim().replace(/[<>"'\/]/g, '');
};

const getProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Models.UserSchema.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

const updateProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        let { name, email, phone } = req.body;

        // Sanitize inputs
        name = sanitize(name);
        email = sanitize(email);
        phone = phone?.trim();

        // Check if email/phone already exists for another user
        const existingUser = await Models.UserSchema.findOne({
            $and: [
                { _id: { $ne: userId } }, // Not the current user
                { $or: [{ email }, { phone }] }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: "Email or phone number already in use by another account" 
            });
        }

        const updatedUser = await Models.UserSchema.findByIdAndUpdate(
            userId,
            { name, email, phone },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ 
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

const changePasswordController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await Models.UserSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: "Failed to change password" });
    }
};

module.exports = {
    getProfileController,
    updateProfileController,
    changePasswordController
};