import { connection } from "../../Database/postgres.js"

export class RolesModule{
    static async create (){

    }

    static async getAll(){
        try {
            const res = await connection.query('select * from roles;')
            if(res.rowCount == 0){
                return false
            }

            return res.rows
        } catch (error) {
            console.log(error)
            return false
        }
    }
}