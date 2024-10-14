import { Router } from "express";
import { PostController } from "../Controllers/Posts.js";
import { auth } from '../Middlewares/auth.js'

export const postRouter = Router();

postRouter.get('/', PostController.getAll);
postRouter.post('/', auth, PostController.create);
postRouter.get('/:id', PostController.getById);