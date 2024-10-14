import { connection } from "../../Database/postgres.js";

export class AuthroModule {
    static async getById({ id }) {

        try {
            const res = await connection.query('select * from authors a where a.id_user = $1;', [id]);            
            
            if(res.rowCount == 0){
                return false
            }

            return res.rows[0];
            
        } catch (error) {
            return false
        }
    }
}