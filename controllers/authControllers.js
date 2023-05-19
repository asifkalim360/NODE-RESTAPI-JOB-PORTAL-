import userModel from "../models/userModel.js"

export const registerController = async(req,res,next) =>{
    try {
        const {firstname, email, password } = req.body
        // VALIDATE
        // if(!firstname){
        //     // return res.status(400).send({success:false, message:"Please Provide Your First Name"})
        //     next("Please Provide Your First Name")
        // }
        // if(!email){
        //     // return res.status(400).send({success:false, message:"Please Provide Your Email"})
        //     next("Please Provide Your Email")
        // }
        // if(!password){
        //     // return res.status(400).send({success:false, message:"Please Provide Your Password"})_
        //     next("Please Provide Your Password")
        // }
        // // check existing users.
        // const existingUser = await userModel.findOne({email})
        // if(existingUser){
        //     return res.status(200).send({success:false, message:'Email Allready Registered Please Login with Other Email'})
        // }
        //data created in database
        const user = await userModel.create({firstname, email, password})
        // // create token after create the userModel----
        const token = user.createJWT();
        res.status(201).send({
            // success:true,
            // message:"User Created Successfully",
            user:{
                firstname:user.firstname,
                lastname:user.lastname,
                email:user.email,
                location:user.location
            },
            token,
        });

        


    } catch (error) {
        // console.log(error)
        // res.status(400).send({
        //     message:'Error in Register controller',
        //     success:false,
        //     error
        // })
        next(error);
    }
}


export const loginController = async(req,res,next) => {
    const {email, password} = req.body;
    //validations
    if(!email || !password)
    {
        next('Please Provide All Fields');
    }
    //check if email exist
    const existingUser = await userModel.findOne({email}).select("+password");  // password ko select karna hai shoow nahi karne ke liye
    if(!existingUser)
    {
        next('Invalid Username or Password')
    }
    //compare password
    const isMatch = await existingUser.comparePassword(password)
    if(!isMatch)
    {
        next('Invalid Username or Password')
    }
    existingUser.password = undefined;    //esse password Undefined ho jayega or show nahi krega client ko
    //create token for this user
    const token = existingUser.createJWT();
    res.status(200).json({
        success:true,
        message:"User Logged In Successfully",
        existingUser,
        token, //token ko client site pe get karna hai or localstorage pe store karwana hai.
    })
}