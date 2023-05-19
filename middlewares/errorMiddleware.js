// error middleware  || NEXT function  

// // error handling with all fields-----
// const errorMiddleware = (err,req,res,next) => {
//     console.log(err)
//     res.status(500).send({
//         success: false,
//         message: "Something Went Wrong",
//         err,
//     })
// }

// // error handling with seperate field-----
const errorMiddleware = (err,req,res,next) => {
    console.log(err)
    const defaultErrors = {
        statusCode : 500,
        message : err,
    }
    //missing filles error 
    if(err.name ==="ValidationError")
    {
        defaultErrors.statusCode = 400;
        defaultErrors.message = Object.values(err.errors).map((item)=> item.message).join(',');
    }
    //Duplicate Errors 
    if(err.code && err.code ===11000)
    {
        defaultErrors.statusCode = 400;
        defaultErrors.message = `${Object.keys(err.keyValue)} field has to be unique`;
    }
    res.status(defaultErrors.statusCode).json({ message:defaultErrors.message})
}


export default errorMiddleware;
