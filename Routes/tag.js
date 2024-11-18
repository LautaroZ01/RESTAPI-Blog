import { Router } from "express";
import { auth } from "../Middlewares/auth.js";
import { authorMiddleware } from "../Middlewares/author.js";
import { TagController } from "../Controllers/Tag.js";
import { adminMiddleware } from "../Middlewares/admin.js";

export const tagRoute = Router();

tagRoute.get('/', TagController.getAll);

tagRoute.post('/', [auth, authorMiddleware], TagController.create)
tagRoute.patch('/:id', [auth, adminMiddleware], TagController.edit)
tagRoute.delete('/', [auth, adminMiddleware], TagController.delete)

tagRoute.get('/post/:id', TagController.getByPostId);

tagRoute.post('/post', [auth, authorMiddleware], TagController.createTagPost)
tagRoute.patch('/post/:id', TagController.editTagPost);