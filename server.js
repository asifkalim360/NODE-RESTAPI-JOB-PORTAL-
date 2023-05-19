//IMPORTS
//API Documentation.
// import swaggerJSDoc from 'swagger-jsdoc';
// import  SwaggerUiOptions  from 'swagger-ui-express';

// const express = require("express"); // this is commonJS syntax eska use humlog module base me nahi kar sakte hain(ReferenceError: require is not defined in ES module scope) ye Error aayega---
import express from 'express';         // this is moduleJS syntax
import 'express-async-errors'
import dotenv from 'dotenv'; 
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';

// SECURITY PACKAGES.
import helmet from 'helmet';
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';

import connectDB from './config/db.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import authRouter from './routes/authRoutes.js';
import jobsRoute from './routes/jobsRoutes.js';
import userRoutes from './routes/userRoutes.js';



//DOT ENV CONFIG
dotenv.config()  // agr route pe .env file rhega to config aise hoga
// dotenv.config({path:'./config'})     // agar config file ke andar .env file raha to ye config hoga.

// mongoDB Connections.
connectDB();

// // SWAGGER API CONFIG.
// const options = {
//       definition: {
//             openapi: '3.0.0',
//             info: {
//                   title: "job Portal Application",
//                   description: "NodeJS ExpressJS Job Portal Application"
//             },
//             servers: [
//                   {
//                         url: "http://localhost:8080",
//                   },
//             ],
//       },
//       apis : ["./routes/*.js"]
// }

// const spec = swaggerJSDoc(options)


//REST OBJECT
const app = express();

// MIDDLEWARES.
app.use(helmet());
app.use(xss());
app.use(ExpressMongoSanitize())
app.use(express.json()); 
app.use(morgan('dev')); 
app.use(cors());


//ROUTES 
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoute);

//SWAGGER HONEROUTE ROOT.
// app.use("/api-doc", SwaggerUiOptions.serve, SwaggerUiOptions.setup(spec))

// VALIDATION MIDDLEWARE
app.use(errorMiddleware)

//PORT 
const PORT = process.env.PORT || 8080
//LISTENING
app.listen(PORT, () => {
      console.log(`Node Server is Running on ${process.env.DEV_MODE} mode on port no. ${PORT} :` .bgCyan.white, 'http://localhost:8080'.bgGreen.black )
})