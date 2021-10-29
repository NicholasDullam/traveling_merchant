var mongoose = require('mongoose');

// Login model

const Login = new mongoose.Schema({
    id: { type: mongoose.Types.ObjectId, ref: 'User' },
    cust_id: { type: mongoose.Types.ObjectId, ref: 'User' },
    acct_id: { type: mongoose.Types.ObjectId, ref: 'User' },
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