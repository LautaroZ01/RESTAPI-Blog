import { Router } from "express";
import { CommentController } from "../Controllers/Comment.js";
import { auth } from "../Middlewares/auth.js";
import { adminMiddleware } from "../Middlewares/admin.js";


export const commentRouter = Router()

commentRouter.get('/', (req, res) => {
    return res.send('Hola comentarios')
})
commentRouter.get('/:id', CommentController.getByPost)

commentRouter.post('/', auth, CommentController.create)
commentRouter.delete('/', auth, CommentController.delete)
commentRouter.patch('/private', [auth, adminMiddleware], CommentController.changeState)
commentRouter.get('/private/:id', [auth, adminMiddleware], CommentController.getByAdmin)
commentRouter.patch('/', auth, CommentController.edit)