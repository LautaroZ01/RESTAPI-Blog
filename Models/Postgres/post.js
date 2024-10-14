import { connection } from "../../Database/postgres.js";
import { AuthroModule } from "./author.js";

export class PostsModule {
    static async getAll({ category = '', limit = null }) {

        try {
            const res = await connection.query('select * from get_products($1, $2);', [category, limit])

            if (res.rowCount == 0) {
                return false
            }

            return res.rows;
        } catch (error) {
            return false;
        }
    }

    static async create({ input }) {
        const { id_author } = input

        try {
            const resAuthor = await AuthroModule.getById({ id: id_author })

            if (!resAuthor) {
                return false
            }

            const { id: idAuthor } = resAuthor;


            input.id_author = idAuthor

            const fields = Object.keys(input);
            const values = Object.values(input);

            if (fields.length === 0) {
                return false;
            }

            const columns = fields.join(', ');
            const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');

            const query = `INSERT INTO posts (${columns}) VALUES (${placeholders}) RETURNING *;`;

            const res = await connection.query(query, values);

            if (res.rowCount == 0) {
                return false;
            }

            return res.rows[0];

        } catch (error) {
            console.log(error)
            return false;
        }
    }

    static async getById({ id }) {
        try {

            const res = await connection.query(`
                select u.username as author, u.surname, u.photo, p.id, p.title, p.content, p.created_at as date, pi2.image_url, c.name as category from posts p
                inner join authors a on p.id_author = a.id
                inner join post_image pi2 on p.id = pi2.id_post
                inner join users u on a.id_user = u.id 
                inner join categories c on p.id_category = c.id where p.id = $1;
                `, [id])

            if (res.rowCount == 0) {
                return false
            }

            return res.rows[0]

        } catch (error) {
            return false
        }
    }

}