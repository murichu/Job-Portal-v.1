import express from 'express';
import { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';


const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
userRouter.post('/verify-account', userAuth, verifyEmail);
userRouter.post('/is-auth', userAuth, isAuthenticated);


export default userRouter; 
