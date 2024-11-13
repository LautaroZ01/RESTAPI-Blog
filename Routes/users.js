import { Router } from "express";
import { UserController } from "../Controllers/Users.js";
import { auth } from '../Middlewares/auth.js'
import passport from "passport";
import { upload } from "../Middlewares/upload.js";
import { adminMiddleware } from "../Middlewares/admin.js";


export const userRouter = Router();


userRouter.get('/', [auth, adminMiddleware], UserController.getAll)
userRouter.post('/rol', [auth, adminMiddleware], UserController.editRol)
userRouter.get('/logout', UserController.logout) 
userRouter.get('/sesion', auth, UserController.getSession)
userRouter.get('/profile', auth, UserController.profile)

userRouter.post('/registro', UserController.register)
userRouter.post('/login', UserController.login)

userRouter.patch('/edit', auth, UserController.edit)
userRouter.post('/upload', [auth, upload.fields([{name: 'photo', maxCount: 1}])], UserController.upload)

userRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
userRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/user' }), UserController.googleCallback)

userRouter.post('/send-email', UserController.sendEmail);