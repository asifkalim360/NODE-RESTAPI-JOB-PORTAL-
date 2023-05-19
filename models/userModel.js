import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create SCHEMA
const userSchema = new mongoose.Schema({
    firstname:{
        type:String, 
        require:[true, 'Name Is Require']
    },
    lastname:{
        type:String, 
        require:[true, 'Name Is Require']
    },
    email:{
        type:String, 
        require:[true, 'Email Is Require'], 
        unique:true, 
        validate:validator.isEmail
    },
    password:{
        type:String,
        require:[true, 'password is require'],
        minlength:[6, 'Password length should be greater than 6 character'],
        select:true,
    },
    location:{
        type:String,
        default:"India"
    },
},
    { timestamps: true }
);

// // create middleware for password hashing
userSchema.pre('save', async function () {
    if (!this.isModified) return;  // if password is updated then create this line ok
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// // CREATE MIDDLEWARE FOR JSON-WEB-TOKEN---
userSchema.methods.createJWT = function ()
{
    return jwt.sign({ userId : this._id }, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})
}

// CREATE COMPARE PASSWORD METHOD---
userSchema.methods.comparePassword = async function(userPassword)
{
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
}

export default mongoose.model('User', userSchema);