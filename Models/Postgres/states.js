import { connection } from "../../Database/postgres.js"

export class StatesModule {
    static async getAll() {
        try {
            const res = await connection.query('select * from states s ;')

            if (res.rowCount == 0) {
                return false
            }

            return res.rows;
        } catch (error) {
            return false
        }
    }
}