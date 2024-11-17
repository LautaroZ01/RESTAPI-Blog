import { connection } from "../../Database/postgres.js"

export class ContactModule {
    static async getAllForAuthor({ id }) {
        try {
            const res = await connection.query('select id, type, name, description from contacts where id_author = $1 order by id', [id])

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
            const res = await connection.query('select * from contacts where id = $1 order by id', [id])

            if (res.rowCount == 0) {
                return false
            }

            return res.rows[0];

        } catch (error) {
            return false
        }
    }

    static async create({ input }) {
        const { type, name, description, id_author } = input

        try {
            const query = `INSERT INTO contacts (type, name, description, id_author) VALUES ($1, $2, $3, $4) RETURNING *;`;

            const res = await connection.query(query, [type, name, description, id_author]);

            if (res.rowCount == 0) {
                return false;
            }

            return res.rows[0];

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

            const query = `UPDATE contacts SET ${setClause} WHERE id = $${fields.length + 1};`;

            const res = await connection.query(query, values)

            if (res.rowCount == 0) {
                return false
            }

            const contact = await this.getById({ id });

            return contact;

        } catch (error) {
            return false
        }
    }

    static async delete({ id, id_author }) {
        try {
            const res = await connection.query('delete from contacts where id = $1 and id_author = $2', [id, id_author])

            if (res.rowCount == 0) {
                return false
            }

            return true

        } catch (error) {
            return false
        }
    }
}