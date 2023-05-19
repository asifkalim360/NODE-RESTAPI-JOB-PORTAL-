import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { updateUserController } from "../controllers/userControllers.js";



//Router Object
const router = express.Router();


//ROUTERS
// GET USERS || GET



// UPDATE USERS || PUT 
router.put('/update-user', userAuth, updateUserController)

export default router;
