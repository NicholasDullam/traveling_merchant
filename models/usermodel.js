var mongoose = require('mongoose');

// User Schema

const userSchema = new mongoose.Schema({
    seller_id: String,
    customer_id: String,
    first: String,
    last: String,
    email: String,
    hash : String,
    salt : String,
    profile_img: String,
    settings: {
      // ...
    },
    created_at: Date,
    updated_at: Date
});
  
// Method to set salt and hash the password for a user 
UserSchema.methods.setPassword = function(password) { 
       
// Creating a unique salt for a particular user 
    this.salt = crypto.randomBytes(16).toString('hex'); 
     
    // Hashing user's salt and password with 1000 iterations, 
        
    this.hash = crypto.pbkdf2Sync(password, this.salt,  
    1000, 64, `sha512`).toString(`hex`); 
}; 
     
// Method to check the entered password is correct or not 
UserSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
}; 
  
userSchema.methods.init = function () {};
module.exports = mongoose.model('User', userSchema);