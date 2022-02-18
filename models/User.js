const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile_number: {
        type: Number,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    isVerified: {
        type: Boolean,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;