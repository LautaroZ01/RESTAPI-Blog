import { AuthorModule } from "../Models/Postgres/author.js";
import { ContactModule } from "../Models/Postgres/contact.js";
import { SocialMediaModule } from "../Models/Postgres/socialMedia.js";
import { validatParcialAuthors } from "../Schemas/author.js";

export class AuthorController {
    static async edit(req, res) {
        const author = validatParcialAuthors(req.body)
        const { id } = req.auth

        if (author.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(author.error.message)
            })
        }

        try {
            const editedAuthor = await AuthorModule.edit({ id, input: author.data })

            if (!editedAuthor) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo actualizar el autor'
                })
            }

            return res.json({
                status: 'success',
                author: editedAuthor
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async getById(req, res) {
        const { id } = req.params

        try {
            const author = await AuthorModule.getById({ id });

            if (!author) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo obtener el autor'
                })
            }

            const id_author = author.id

            const socialMedials = await SocialMediaModule.getAllForAuthor({ id: id_author })
            const contacts = await ContactModule.getAllForAuthor({ id: id_author })

            return res.json({
                status: 'success',
                author,
                socialMedials,
                contacts
            })

        } catch (error) {

        }
    }
}