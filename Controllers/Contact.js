import { ContactModule } from "../Models/Postgres/contact.js"
import { validatContact, validatParcialContact } from "../Schemas/contact.js"

export class ContactController {
    static async getAllForAuthor(req, res) {
        const { id } = req.params

        try {
            const contact = await ContactModule.getAllForAuthor({ id })

            if (!contact) {
                return res.status(400).json({
                    status: "error",
                    error: 'No hay contactos disponibles'
                })
            }

            return res.json({
                status: 'success',
                contact
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async create(req, res) {
        const contact = validatContact(req.body)

        if (contact.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(contact.error.message)
            })
        }

        try {
            const newContact = await ContactModule.create({ input: contact.data })

            if (!newContact) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear el contacto'
                })
            }

            return res.status(201).json({
                status: 'success',
                contact: newContact
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async edit(req, res) {
        const result = validatParcialContact(req.body);
        const { id } = req.params

        if (result.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(result.error.message)
            })
        }

        try {
            const contact = await ContactModule.edit({ id, input: result.data })

            if (!contact) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo actualizar el contacto'
                })
            }

            return res.json({
                status: 'success',
                contact
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
            const deleteContact = await ContactModule.delete({id, id_author})

            if (!deleteContact) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo eliminar el contacto'
                })
            }

            return res.json({
                status: 'success',
                message: 'El contacto se elimino exitosamente'
            })
            
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }
}