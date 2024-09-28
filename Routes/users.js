import { Router } from "express";
import { UserController } from "../Controllers/Users.js";
import { auth } from '../Middlewares/auth.js'


export const userRouter = Router();


userRouter.get('/', auth, UserController.getAll)
userRouter.get('/logout', UserController.logout)
userRouter.get('/profile', auth, UserController.profile)

userRouter.post('/registro', UserController.register)
userRouter.post('/login', UserController.login)