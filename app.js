require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit')




// connectDB
const connectDB = require('./db/connect')

// importing the routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')


// authentication middleware
const authenticateUser = require("./middleware/authentication")

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// creating the express server
const express = require('express');
const app = express();

// implementing the rate limiter (the number of requests to be made by the user)
app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60  * 1000, //15 minutes
  max: 100 //limit each IP to 100 request per 15 minutes
}))

// passing all the json data to be accessed in the request body
app.use(express.json());

// implementing security packages
app.use(helmet())
app.use(cors())
app.use(xss())

// extra packages

// mapping the routers to their routes using app.use
app.use('/api/v1/auth', authRouter)

// implementing the authentication middleware on the jobs route so that we can secure it
app.use('/api/v1/jobs', authenticateUser, jobsRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = 8080;

const start = async () => {
  try {

    await connectDB(process.env.MONGO_URI);
    
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
