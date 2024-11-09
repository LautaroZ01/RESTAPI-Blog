import { RolesModule } from "../Models/Postgres/roles.js"

export class RoleController {
    static async getAll(req, res){
        try {
            const roles = await RolesModule.getAll();

            if(!roles){
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
}