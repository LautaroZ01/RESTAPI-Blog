import { LikeModel } from "../Models/Postgres/like.js"
import { validatLikes } from "../Schemas/like.js"

export class LikeController {
    static async Like(req, res) {
        const id_user = req.auth.id
        const post = validatLikes(req.body)

        if (post.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(post.error.message)
            })
        }

        const { id_post } = post.data

        try {

            const like = await LikeModel.Save({ id_post, id_user });

            if (!like) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No puedes dar like a este post'
                })
            }

            return res.status(201).json({
                status: 'success',
                like,
                message: 'Le diste like a este post'
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal con el like'
            })
        }
    }

    static async Dislike(req, res) {
        const id_user = req.auth.id
        const post = validatLikes(req.body)

        if (post.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(post.error.message)
            })
        }

        const { id_post } = post.data

        try {

            const like = await LikeModel.Delete({ id_post, id_user });

            if (!like) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No puedes quitar el like de este post',
                    message: 'Le quitaste el like a este post'
                })
            }

            return res.status(201).json({
                status: 'success',
                like
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal al momento de quitar el like'
            })
        }
    }

    static async Controll(req, res) {
        const id_user = req.auth.id

        const id_post = parseInt(req.params.id_post)

        try {

            const like = await LikeModel.getLike({ id_post, id_user });

            if (!like) {
                return res.status(200).json({
                    status: 'error',
                    error: 'No se pudo verifical si el usuario le dio like'
                })
            }

            return res.status(201).json({
                status: 'success',
                like,
                message: 'Ya le diste like a este post'
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal al momento de verificar el like'
            })
        }
    }
}