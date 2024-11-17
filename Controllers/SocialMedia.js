import { SocialMediaModule } from "../Models/Postgres/socialMedia.js"
import { validatParcialSocial, validatSocial } from "../Schemas/socialMedia.js";

export class SocialMediaController {
    static async getAllForAuthor(req, res) {
        const { id } = req.params

        try {
            const socialMedials = await SocialMediaModule.getAllForAuthor({ id });

            if (!socialMedials) {
                return res.status(400).json({
                    status: "error",
                    error: 'No hay redes sociales disponibles'
                })
            }

            return res.json({
                status: 'success',
                socialMedials
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async create(req, res) {
        const social = validatSocial(req.body)

        if (social.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(social.error.message)
            })
        }

        try {
            const newSocial = await SocialMediaModule.create({ input: social.data })

            if (!newSocial) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear la red social'
                })
            }

            return res.status(201).json({
                status: 'success',
                social: newSocial
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async edit(req, res) {
        const result = validatParcialSocial(req.body);
        const { id } = req.params

        if (result.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(result.error.message)
            })
        }

        try {
            const social = await SocialMediaModule.edit({ id, input: result.data })

            if (!social) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo actualizar la red social'
                })
            }

            return res.json({
                status: 'success',
                social
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async delete(req, res) {
        const { id } = req.body
        const id_author = req.auth.id

        try {
            const deleteSocial = await SocialMediaModule.delete({id, id_author})

            if (!deleteSocial) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo eliminar la red social'
                })
            }

            return res.json({
                status: 'success',
                message: 'La red social se elimino exitosamente'
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }
}