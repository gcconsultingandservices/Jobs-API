// JOBS CONTROLLER
const JobModel = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index')


// Get all jobs
const getAllJobs = async(req, res)=>{
    // Here we will want to get only the jobs that are associated with the current user
    const jobs = await JobModel.find({ createdBy: req.user.userId }).sort()
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

// Get a single job
const getJob = async(req, res)=>{
    // destructuring the userId from the user object that is passed by the authentication middleware
    // destructuring the jobId from the params
    const { user: {userId}, params: {id:jobId} } = req

    // finding the job, we'll check both the userId and the jobId
    const job = await JobModel.findOne({ _id: jobId, createdBy: userId })

    // throw an error if no job is found
    if(!job){
        throw new NotFoundError(`No job found with id: ${jobId}`)
    }

    // responding with the actual job
    res.status(StatusCodes.OK).json({ job })
}


// Create a job
const createJob = async(req, res)=>{
    // associating a job with a user id
    // adding a createdBy property to the job object that is passed in the request object

    // console.log(req.user)

    req.body.createdBy = req.user.userId

    // create a job
    const job = await JobModel.create(req.body)

    // response
    res.status(StatusCodes.CREATED).json({job})
}

// Update a Job
const updateJob = async(req, res)=>{
    // destructuring the request
    const{
        body: {company, position},
        user: {userId},
        params: {id:jobId}

    } = req

    // checking if company or position is empty
    if(company === '' || position === ''){
        throw new BadRequestError('Company or position fields cannot be empty')
    }

    // finding the job and updating it
    const job = await JobModel.findByIdAndUpdate({_id:jobId, createdBy:userId}, req.body, {new: true, returnValidators:true})

    // if job is not found, throw an error
    if(!job){
        throw new NotFoundError(`No job found with id: ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})
}

// Delete a Job
const deleteJob = async(req, res)=>{
    // accessing the required details
    const{
        user: {userId},
        params: {id: jobId}
    } = req

    // deleting the job
    const job = await JobModel.findByIdAndRemove({
        _id:jobId,
        createdBy:userId
    })

    // if job is not found, throw an error
    if(!job){
        throw new NotFoundError(`No job was found with id: ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job, success: "Job Deleted Successfully"})
}




// exporting the controllers
module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}