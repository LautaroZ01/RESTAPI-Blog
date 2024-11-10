import { connection } from "../../Database/postgres.js"

export class RolesModule {
    static async getAll() {
        try {
            const res = await connection.query('select * from roles order by id;')
            if (res.rowCount == 0) {
                return false
            }

            return res.rows
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async getById({ id }) {
        try {
            const res = await connection.query('select * from roles where id = $1;', [id])

            if (res.rowCount == 0) {
                return false
            }

            return res.rows[0];
        } catch (error) {
            return false
        }
    }

    static async create({ input }) {
        const { name, description } = input;

        try {
            const res = await connection.query('insert into roles (name, description) values ($1, $2) returning *', [name, description])

            if (res.rowCount == 0) {
                return false
            }

            return res.rows[0]

        } catch (error) {
            return false
        }
    }

    static async edit({ id, input }) {
        const fields = Object.keys(input);
        const values = Object.values(input);

        if (fields.length === 0) {
            return false
        }

        try {
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            values.push(id);

            const query = `UPDATE roles SET ${setClause} WHERE id = $${fields.length + 1};`;


            const res = await connection.query(query, values)

            if (res.rowCount == 0) {
                return false
            }

            const roles = await this.getById({ id });

            return roles;
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async delete({ id }) {
        try {
            const res = await connection.query('delete from roles where id = $1;', [id])

            if (res.rowCount == 0) {
                return false
            }

            return true

        } catch (error) {
            return false
        }
    }
}