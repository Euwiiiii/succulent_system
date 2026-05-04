const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Stored as plaintext for simplicity as requested
    role: { type: String, enum: ['Admin', 'Customer'], default: 'Customer' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
