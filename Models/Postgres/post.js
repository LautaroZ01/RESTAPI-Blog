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
                    SELECT 
                        u.username AS author,
                        u.surname,
                        u.photo,
                        a.description,
                        p.id,
                        s.name,
                        p.title,
                        p.content,
                        p.created_at,
                        pi2.image_url,
                        c.name AS category,
                        COALESCE(cant_comment.count, 0) AS comment_count,
                        COALESCE(cant_like.count, 0) AS like_count
                    FROM posts p
                    INNER JOIN authors a ON p.id_author = a.id
                    LEFT JOIN post_image pi2 ON p.id = pi2.id_post
                    INNER JOIN users u ON a.id_user = u.id 
                    INNER JOIN categories c ON p.id_category = c.id
                    inner join states s on p.id_state = s.id
                    LEFT JOIN (SELECT id_post, COUNT(*) AS count FROM comments GROUP BY id_post) AS cant_comment ON p.id = cant_comment.id_post
                    LEFT JOIN (SELECT id_post, COUNT(*) AS count FROM post_likes GROUP BY id_post) AS cant_like ON p.id = cant_like.id_post
                    WHERE p.id = $1;
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