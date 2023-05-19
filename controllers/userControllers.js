import userModel from "../models/userModel.js";

export const updateUserController = async(req,res,next) => {
    const {firstname, email, lastname, location} = req.body;
    if(!firstname || !email || !lastname || !location)
    {
        next('Please Provide all Fields')
    }
    const user = await userModel.findOne({_id:req.existingUser.userId});
    user.firstname = firstname;
    user.email = email;
    user.lastname = lastname;
    user.location = location;

    await user.save();
    const token = user.createJWT();
    res.status(200).json({
        user,
        token,
    })

};