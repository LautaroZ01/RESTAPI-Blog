import { Router } from "express";
import { PostController } from "../Controllers/Posts.js";
import { auth } from '../Middlewares/auth.js'
import { authorMiddleware } from "../Middlewares/author.js";
import { upload } from "../Middlewares/upload.js";

export const postRouter = Router();

postRouter.get('/', PostController.getAll);
postRouter.post('/', [auth, authorMiddleware], PostController.create);
postRouter.patch('/:id', [auth, authorMiddleware], PostController.edit);
postRouter.post('/upload/:id_post/:id_type?', [auth, authorMiddleware, upload.fields([{name: 'photo', maxCount: 1}])], PostController.upload);
postRouter.patch('/upload/:id', [auth, authorMiddleware, upload.fields([{name: 'photo', maxCount: 1}])], PostController.editUpload);

postRouter.get('/categories',PostController.getAllCategories);
postRouter.get('/estados', [auth, authorMiddleware],PostController.getAllStates);
postRouter.get('/:id', PostController.getById);

postRouter.delete('/', PostController.delete);
