import { connection } from "../../Database/postgres.js"

export class CategoryModule {
    static async getAll() {
        try {
            const res = await connection.query('select * from categories c order by id;')

            if (res.rowCount == 0) {
                return false
            }

            return res.rows;
        } catch (error) {
            return false
        }
    }

    static async getById({ id }) {

        try {
            const res = await connection.query('select * from categories c where id = $1;', [id])

            if (res.rowCount == 0) {
                return false
            }

            return res.rows[0];
        } catch (error) {
            return false
        }
    }

    // crear una categoria
    static async create({ input }) {
        const { name, description } = input;

        try {
            const res = await connection.query('insert into categories (name, description) values ($1, $2) returning *', [name, description])

            if (res.rowCount == 0) {
                return false
            }

            return res.rows[0]

        } catch (error) {
            return false
        }
    }
    
    // editar
    static async edit({ id, input }) {
        const fields = Object.keys(input);
        const values = Object.values(input);

        if (fields.length === 0) {
            return false
        }

        try {
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            values.push(id);

            const query = `UPDATE categories SET ${setClause} WHERE id = $${fields.length + 1};`;


            const res = await connection.query(query, values)

            if (res.rowCount == 0) {
                return false
            }

            const category = await this.getById({ id });

            return category;
        } catch (error) {
            console.log(error)
            return false
        }
    }

    // eliminar
    static async delete({ id }) {
        try {
            const res = await connection.query('delete from categories where id = $1;', [id])

            if (res.rowCount == 0) {
                return false
            }

            return true

        } catch (error) {
            return false
        }
    }
}