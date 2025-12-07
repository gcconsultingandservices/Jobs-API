// creating the router using express
const express = require("express")

// invoking the router module
const router = express.Router()


// importing all job controllers
const { getAllJobs, getJob, createJob, updateJob, deleteJob } = require("../controllers/jobs")

// setting the routes
router.route('/').post(createJob).get(getAllJobs)
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

// export the router
module.exports = router