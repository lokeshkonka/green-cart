import express from 'express'
import { register,LoginUser, Logout, IsAuth } from '../Controllers/UserController.js';
import authUser from '../Middleware/AuthUser.js';

const userRouter = express.Router();

userRouter.post('/register',register)
userRouter.post('/login',LoginUser)
userRouter.get('/is-auth',authUser,IsAuth)
userRouter.get('/logout',authUser,Logout)

export default userRouter