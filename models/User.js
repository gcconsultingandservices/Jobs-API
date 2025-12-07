// Creating a User Model
// we use mongoose (it creates the structure of our document)
// importing bcrypt
const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');

// generating our token. First, import jwt in the UserSchema
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6
    }
})

// Setting the middleware to perform operations before the data is saved
// middleware to hash the password
UserSchema.pre('save', async function(next){
    // hashing the password
    // generating the random bytes to use to hash the password
    const salt = await bcrypt.genSalt(10)

    // this will point to the documenrt and access its properties i.e password property
    this.password = await bcrypt.hash(this.password, salt)

    // passing to the next middleware
    next()

})

// comparing our password using the bcrypt library to ensure that it matches.
// its a one way, once the password has is generated, it can't be reversed. You can just compare your password with the hashed password and it checks if it matches.
// if the password is a match, we login the user
UserSchema.methods.comparePassword = async function(loginPassword){
    const isMatch = await bcrypt.compare(loginPassword, this.password)
    return isMatch
}

// A function to get a name wherever a user is created
// Hence we can generate the token using the instance method and return it wherever a user is created
// this helps us keep all our logic in the same place.
UserSchema.methods.getName = function(){
    return this.name
}

// Create a method to generated the token (after all other middlewares)
UserSchema.methods.createJWT = function(){
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

// exporting the schema and setting the collection to be applied and the schema
module.exports = mongoose.model('Users', UserSchema)