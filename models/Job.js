// Creating the Job Model
// We use mongoose.

const { required } = require('joi');
const mongoose = require('mongoose');

// set the job schema
const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide a position'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user']
    }
}, {timestamps: true})

// exporting the model and setting the collection that the schema will be applied to
module.exports = mongoose.model('Jobs', JobSchema)