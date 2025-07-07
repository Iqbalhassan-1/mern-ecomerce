import express from "express";
import { registerUser, loginUser, adminLogin } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser); 
// User login route
userRouter.post("/login", loginUser);
// Get user admin user login route
userRouter.post("/admin",adminLogin)

export default userRouter;