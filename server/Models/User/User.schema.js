const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, required: true }
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;