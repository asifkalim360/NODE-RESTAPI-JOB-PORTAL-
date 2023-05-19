import express from 'express';
import { registerController, loginController} from '../controllers/authControllers.js';
import userAuth from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit'

//IP LIMITER
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


//router object
const router = express.Router();

// /**
//  * @swagger
//  * components:
//  *  schemas:
//  *   User:
//  *    type: Object
//  *    required:
//  *     - first-name
//  *     - last-name
//  *     - email
//  *     - password
//  *     - location 
//  *    properties:
//  *     id:
//  *      type: string
//  *      description: The Auto-generated id of user collection
//  *     first-name:
//  *      type: string
//  *      description: User First Name
//  *     last-name:
//  *      type: string
//  *      description: User Last Name
//  *     email:
//  *      type: string
//  *      description: User Email Address
//  *     password:
//  *      type: string
//  *      description: User Password Should be greater then 6 character
//  *     location:
//  *      type: string
//  *      description: User Location and Country 
//  *     example:
//  *      id: YDHKSDUHNCIUHDHWDH
//  *      first-name: John
//  *      last-name: Doe
//  *      email: johndoe@gmail.com
//  *      password: test@123
//  *      location: delhi
//  */




// //ROUTES 
// register || post
router.post('/register', limiter, registerController);

// login || post
router.post('/login', limiter, loginController);

//test router
router.get('/test', userAuth,(req, res) =>{
    res.send('test route')
})




//EXPORT 
export default router;