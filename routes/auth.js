// set up the router using express
const express = require("express")

// invoking the Router module
const router = express.Router()

// importing all the auth.js controller functions
const { login, register } = require("../controllers/auth")

// setting the routes
router.post('/login', login)
router.post('/register', register)

// then export the router
module.exports  = router