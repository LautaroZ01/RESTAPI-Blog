import { connection } from "../../Database/postgres.js"

export class CategoryModule {
    static async getById({ id }) {

        try {
            const res = await connection.query('select * from categories c where c.id like $1;', [id])

            if (res.rowCount == 0) {
                return false
            }

            return res.rows[0];
        } catch (error) {
            return false
        }
    }
}