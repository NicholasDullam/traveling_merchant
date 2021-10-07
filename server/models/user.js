const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

// User Schema

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
    settings: {
      // ...
    }
}, { 
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
  
// Method to check the entered password is correct or not 
User.methods.validPassword = (password) => {
    console.log(this.password, password)
    return bcrypt.compare(this.password, password)
}
  
module.exports = mongoose.model('User', User);