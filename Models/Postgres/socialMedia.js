import { connection } from "../../Database/postgres.js";

export class SocialMediaModule {
    static async getAllForAuthor({ id }) {
        try {
            const res = await connection.query('select id, type, name, link from social_medials where id_author = $1 order by id', [id])

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
            const res = await connection.query('select * from social_medials where id = $1 order by id', [id]);

            if (res.rowCount == 0) {
                return false
            }

            return res.rows[0];
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async create({ input }) {
        const { type, name, link, id_author } = input

        try {
            const query = `INSERT INTO social_medials (type, name, link, id_author) VALUES ($1, $2, $3, $4) RETURNING *;`;

            const res = await connection.query(query, [type, name, link, id_author]);

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

            const query = `UPDATE social_medials SET ${setClause} WHERE id = $${fields.length + 1};`;

            const res = await connection.query(query, values)

            if (res.rowCount == 0) {
                return false
            }

            const social_media = await this.getById({ id });

            return social_media;

        } catch (error) {
            return false
        }
    }

    static async delete({ id, id_author }) {
        try {
            const res = await connection.query('delete from social_medials where id = $1 and id_author = $2', [id, id_author])

            if (res.rowCount == 0) {
                return false
            }

            return true

        } catch (error) {
            return false
        }
    }
}