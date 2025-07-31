const mongoose = require('mongoose');

const UserModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['barber', 'customer'],
        required: true,
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', UserModel);
module.exports = User;