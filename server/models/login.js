const mongoose = require('mongoose');

const Login = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    admin: Boolean,
    banned: Boolean,
    ip: String
}, { 
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Login', Login);