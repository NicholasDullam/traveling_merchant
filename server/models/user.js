const mongoose = require('mongoose');

const User = new mongoose.Schema({
    acct_id: String,
    cust_id: String,
    first: String,
    last: String,
    email: String,
    password: String,
    profile_img: String,
    acct_details_submitted: Boolean,
    admin: Boolean,
    banned: Boolean,
    status: String,
    exp: { type: Number, default: 0 },
    lvl: { type: Number, default: 0 },
    settings: {
        /* ... */
    }
}, { 
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('User', User);