import { Router } from "express";
import { LikeController } from "../Controllers/Like.js";
import { auth } from "../Middlewares/auth.js";

export const likeRouter = Router()

likeRouter.get('/', (req, res) => {
    return res.send('Hola likes')
})
likeRouter.get('/:id_post', auth, LikeController.Controll);

likeRouter.post('/', auth, LikeController.Like);
likeRouter.delete('/', auth, LikeController.Dislike);