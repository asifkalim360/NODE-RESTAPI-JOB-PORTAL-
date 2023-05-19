import mongoose from 'mongoose';


const jobSchema = new mongoose.Schema({
    company:{
        type:String,
        require:[true, 'Company name is required']
    },
    position:{
        type:String,
        require:[true, 'Job Position is required'],
        maxlength:100
    },
    status:{
        type:String,
        enum:['pending', 'reject', 'interview'],
        default:'pending'
    },
    workType:{
        type:String,
        enum:['full-time','part-time','contract','internship'],
        default:'full-time'
    },
    workLocation:{
        type:String,
        default:'Delhi',
        require:[true, 'Work Location is required']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }

}, {timestamp:true});


export default mongoose.model('Job',jobSchema);