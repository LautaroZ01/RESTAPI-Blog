import { Router } from "express";
import { PostController } from "../Controllers/Posts.js";
import { auth } from '../Middlewares/auth.js'
import { authorMiddleware } from "../Middlewares/author.js";
import { upload } from "../Middlewares/upload.js";

export const postRouter = Router();

postRouter.get('/', PostController.getAll);
postRouter.post('/', [auth, authorMiddleware], PostController.create);
postRouter.post('/upload/:id_post/:id_type?', [auth, authorMiddleware, upload.fields([{name: 'photo', maxCount: 1}])], PostController.upload);

postRouter.get('/categories',PostController.getAllCategories);
postRouter.get('/estados', [auth, authorMiddleware],PostController.getAllStates);
postRouter.get('/:id', PostController.getById);
