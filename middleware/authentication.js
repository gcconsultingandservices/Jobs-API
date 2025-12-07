// importing jwt
const jwt = require('jsonwebtoken')

//importing the Unauthenticated Error
const { UnauthenticatedError } = require('../errors/index')

// setting up the auth middleware
const auth = async(req, res, next)=>{
    // check the header
    const authHeader = req.headers.authorization

    // If authHeader does not exist or it does not start with 'Bearer ', we throw an error
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError("Authentication Invalid")
    }

    // get the token
    const token = authHeader.split(' ')[1]

    // verifying the token
    try {
        // the return of the verify method is the payload that contains the user's details when signing the token i.e userId and user name
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        // create a user property with the current details and attach it to the request
        req.user = {
            userId: payload.userId,
            name: payload.name
        }

        // passing to the next middleware
        next()
        
    } catch (error) {
        throw new UnauthenticatedError("Authentication Invalid")
        
    }
}

// export the auth middleware
module.exports = auth