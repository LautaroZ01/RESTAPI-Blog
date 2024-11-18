import { CommentModel } from "../Models/Postgres/comment.js"
import { validatComments, validatParcialComments } from "../Schemas/comment.js"

export class CommentController {
    static async create(req, res) {
        const { id } = req.auth
        const comment = validatComments(req.body)

        if (comment.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(comment.error.message)
            })
        }

        const { id_post, content, status } = comment.data

        try {

            const newComment = await CommentModel.Create({ id_post, id_user: id, content, status })

            if (!newComment) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear el comentario en este post'
                })
            }

            return res.status(201).json({
                status: 'success',
                comment: newComment
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor'
            })
        }


    }

    static async edit(req, res) {
        const { id } = req.auth
        const comment = validatParcialComments(req.body)

        if (comment.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(comment.error.message)
            })
        }

        const { id_comment, content } = comment.data

        try {
            const commentEdit = await CommentModel.Edit({ id_comment, id_user: id, content })

            if (!commentEdit) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se logro editar el comentario'
                })
            }

            return res.json({
                status: 'success',
                comment: commentEdit
            })

        } catch (error) {

        }
    }

    static async getByPost(req, res) {
        const { id } = req.params

        try {
            const comments = await CommentModel.getById({ id_post: id })

            if (!comments) {
                return res.status(200).json({
                    status: 'error',
                    error: 'Este post no tiene comentarios'
                })
            }

            return res.json({
                status: 'success',
                comments
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor'
            })
        }
    }

    static async getByAdmin(req, res) {
        const { id } = req.params

        try {
            const comments = await CommentModel.getById({ id_post: id, isAdmin: true })

            if (!comments) {
                return res.status(200).json({
                    status: 'error',
                    error: 'Este post no tiene comentarios'
                })
            }

            return res.json({
                status: 'success',
                comments
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor'
            })
        }
    }

    static async delete(req, res) {
        const { id } = req.auth

        const { id_comment } = req.body

        try {
            const deleteCommente = await CommentModel.Delete({ id_comment, id_user: id })

            if (!deleteCommente) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo eliminar el comentario de este post'
                })
            }

            return res.json({
                status: 'success',
                message: 'Comentario eliminado exitosamente'
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor'
            })
        }
    }

    static async changeState(req, res) {
        const { id, status } = req.body

        try {
            const comment = await CommentModel.ChangeState({ id, status });

            if (!comment) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo deshabilitar el comentario de este post'
                })
            }

            return res.json({
                status: 'success',
                message: 'Comentario deshabilitado exitosamente'
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor'
            })
        }
    }
}