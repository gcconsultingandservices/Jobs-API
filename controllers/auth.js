// contains the controller used to authenticate the user into our application.

// importing the User model
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors")
const UserModel = require("../models/User")

// importing jwt
const jwt = require('jsonwebtoken')

// importing bcrypt to hash our password
const bcrypt = require('bcryptjs')


// Register controller
const register= async(req, res)=>{
    const { name, email, password } = req.body

    // validating whether the values are present
    if(!name){
        throw new BadRequestError("Please provide a name")
    }

    if(!email){
        throw new BadRequestError("Please provide an email")
    }

    if(!password){
        throw new BadRequestError("Please provide a password")
    }

    
    // creating the user
    const user = await UserModel.create(req.body)

    // getting the created token from the schema method
    const token = user.createJWT()

    // sending back the token and the user's name and the token
    res.status(StatusCodes.CREATED).json({user: {name: user?.name}, token})

}


// login controller
const login = async(req, res)=>{
    // the user needs to provide an email and password, if not, we throw a bad request error
    // we grab the email and password
    const { email, password } = req.body

    // check if email and password are present
    if(!email){
        throw new BadRequestError("Please provide an email")
    }

    if(!password){
        throw new BadRequestError("Please provide a password")
    }

    // check if the user is present by passing in the email
    const user = await UserModel.findOne({email})


    // if no user is found, we will throw an Unauthenticated Error
    if(!user){
        throw new UnauthenticatedError("Couldn't find your Account, please Register")
    }

    // Now access the compare password function and compare the password
    const isPasswordCorrect = await user.comparePassword(password)

    // throw and error if password doesn't match
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid Password")
    }

    // if user exists, create a JWT token
    // only create a JWT token after the password matches

    const token = user.createJWT()

    // sending back a json response
    res.status(StatusCodes.OK).json({ user: {name: user.name}, token })
}

module.exports = {
    register,
    login
}