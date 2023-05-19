import mongoose from "mongoose";
import jobsModel from "../models/jobsModel.js";
import moment from "moment";
// jobs data insert into the database with help of create method.
export const createJobController = async(req, res, next) => {
    const {company, position} = req.body
    if(!company || !position)
    {
        next('Please Provide All Fields')
    }
    req.body.createdBy = req.existingUser.userId;
    const job = await jobsModel.create(req.body)
    res.status(201).json({message: 'Job Created Successfully', job: job})
}

// get jobs data into the database with the help of find method.
export const getAllJobsController = async (req, res, next) => {
    /*
    // get all data without filters.
    //const jobs = await jobsModel.find({createdBy : req.existingUser.userId});
    */

    // data filter with {status,workType, }etc. and using query string!!
    const {status, workType, search, sort} = req.query;
    //Conditions for searching filters.
    let queryObject = {
        createdBy: req.existingUser.userId,
    }
    //logic apply for the filters
    //data filter by the status
    if(status && status !== "all")
    {
        queryObject.status = status;
    }
    // data filter by the workType
    if(workType && workType !== "all")
    {
        queryObject.workType = workType;
    }
    // data searching by the keyword (ex:name,alphabets, etc)
    if(search)
    {
        queryObject.position = {$regex : search, $options: "i" };
    }

    // if status/workType/ is not provided then return all jobs.
    let queryResult = jobsModel.find(queryObject);

    // SORTING
    // data sorting by the keyword (ex:name,oldest,latest etc.)
    if(sort === "latest") {
        queryObject = queryResult.sort("-createdBy");
    }
    if(sort === "oldest") {
        queryObject = queryResult.sort("createdBy");
    }
    if(sort === "a-z") {
        queryObject = queryResult.sort("position");
    }
    if(sort === "z-a") {
        queryObject = queryResult.sort("-position");
    }

    // PAGINATION
    // if pagination is not provided then return all jobs.
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page -1) * limit;
    queryResult = queryResult.skip(skip).limit(limit);
    // jobs count
    const totalJobs = await jobsModel.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);

    const jobs = await queryResult;
    res.status(200).json({
            totalJobs,
            jobs,   
            numOfPage,          
        })       
}

//Update jobs data into the database with the help of findOneAndUpdate method.
export const updateJobController = async (req, res, next) => {
    const {id} = req.params;
    const {company, position} = req.body;
    //VALIDATIONS
    if(!company || !position){
        next('Please Provide All Fields');
    }
    //FIND JOB 
    const job = await jobsModel.findOne({_id:id});
    // VALIDATIONS
    if(!job){
        next(`No jobs found with this id ${id}`);
    }
    //MATCH BOTH ID 
    if(req.existingUser.userId !== job.createdBy.toString())
    {   
        next('You are not Authorized to update this job')
        return;
    }
    //UPDATE JOB
    const updateJob = await jobsModel.findOneAndUpdate({_id: id}, req.body, {
        new: true,
        runValidators: true,
    }); 
    // RESPONSE 
    res.status(200).json({ updateJob })

}


//Delete jobs data into the database with the help of REMOVE method.
export const deleteJobController = async(req, res, next) => {
    const {id} = req.params;
    // FIND jOB 
    const job = await jobsModel.findOne( {_id:id} );
    //Validation
    if(!job){
        next(`No jobs found with this is ${id}`)
    }
    //MATCH BOTH ID's
    if(req.existingUser.userId !== job.createdBy.toString())
    {
        next('You are Not Authorized to delete this job');
        return;
    }
    //REMOVE JOB 
    const removeJob = await jobsModel.deleteOne({_id: id});
    //RESPONSE 
    res.status(200).json({removeJob , message:"Successfully, job Deleted!"})
}


// JOBS STATS FILTER || GET data into the database with the help of  method.
export const statsJobController = async(req, res) => {
    const stats = await jobsModel.aggregate([
    // SEARCH BY USER JOBS
        {
            $match:{
                createdBy: new mongoose.Types.ObjectId(req.existingUser.userId),
            }
        },
        {
            $group: {
                _id: "$status",     // filter by status using schema field
                count: { $sum: 1}
            }
        }
    ]);

    // MONTHLY YEARLY STATS.
    let monthlyApplication = await jobsModel.aggregate([
        {
            $match:{
                createdBy: new mongoose.Types.ObjectId(req.existingUser.userId)
            }
        },
        {
            $group:{
                _id:{
                    year:{ $year : "$createdAt"},
                    month:{ $month : "$createdAt"}
                },
                count: { $sum:1},
            }
        }
    ]);
    monthlyApplication = monthlyApplication.map( (item) => {
        const {_id:{year,month}, count} = item
        const date = moment().format("dddd, DD-MM-YYYY")
        return { date, count }
    }).reverse();


    //DEFAULT STATS 
    const statsDefault = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0,
    }
    // RESPONSE
    res.status(200).json({totalJobs:stats.length, stats, statsDefault, monthlyApplication})
}