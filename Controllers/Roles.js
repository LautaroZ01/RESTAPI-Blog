import { RolesModule } from "../Models/Postgres/roles.js"
import { validatParcialRoles, validatRoles } from "../Schemas/roles.js";

export class RoleController {
    static async getAll(req, res) {
        try {
            const roles = await RolesModule.getAll();

            if (!roles) {
                return res.status(400).json({
                    status: "error",
                    error: 'No hay roles'
                })
            }

            return res.json({
                status: 'success',
                roles
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 'error',
                error: 'Se produjo un error al intentar traer todos los roles'
            })
        }
    }

    static async getById(req, res) {
        const { id } = req.params

        try {
            const roles = await RolesModule.getById({ id });

            if (!roles) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Ese rol no existe'
                })
            }

            return res.json({
                status: 'success',
                roles
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async create(req, res) {
        const newRol = validatRoles(req.body)

        if (newRol.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(newRol.error.message)
            })
        }

        try {
            const rol = await RolesModule.create({ input: newRol.data })

            if (!rol) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear el rol'
                })
            }

            return res.status(201).json({
                status: 'success',
                rol
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async edit(req, res) {
        const result = validatParcialRoles(req.body)
        const { id } = req.params

        if (result.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(result.error.message)
            })
        }

        try {

            const rol = await RolesModule.edit({ id, input: result.data });

            if (!rol) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo actualizar el rol'
                })
            }

            return res.json({
                status: 'success',
                rol
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

        try {
            const deleteRol = await RolesModule.delete({ id })

            if (!deleteRol) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo eliminar el rol'
                })
            }

            return res.json({
                status: 'success',
                message: 'El rol se elimino exitosamente'
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }
}