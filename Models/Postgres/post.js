import { connection } from "../../Database/postgres.js";
import { AuthroModule } from "./author.js";

export class PostsModule {
    static async getAll({ category = '', limit = null, status = 'publico' }) {

        try {
            const res = await connection.query('select * from get_products($1, $2, $3);', [category, limit, status])

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
                    s.name AS state,
                    p.title,
                    p.content,
                    p.created_at,
                    images.images,  -- Subquery de imágenes
                    c.name AS category,
                    COALESCE(cant_comment.count, 0) AS comment_count,
                    COALESCE(cant_like.count, 0) AS like_count
                FROM posts p
                INNER JOIN authors a ON p.id_author = a.id
                INNER JOIN users u ON a.id_user = u.id 
                INNER JOIN categories c ON p.id_category = c.id
                INNER JOIN states s ON p.id_state = s.id
                LEFT JOIN (
                    SELECT 
                        id_post, 
                        array_agg(jsonb_build_object('id', pi.id,'url', pi.image_url, 'type', it.name)) AS images
                    FROM post_image pi
                    LEFT JOIN img_type it ON pi.id_type = it.id
                    GROUP BY id_post
                ) AS images ON p.id = images.id_post
                LEFT JOIN (SELECT id_post, COUNT(*) AS count FROM comments GROUP BY id_post) AS cant_comment ON p.id = cant_comment.id_post
                LEFT JOIN (SELECT id_post, COUNT(*) AS count FROM post_likes GROUP BY id_post) AS cant_like ON p.id = cant_like.id_post
                WHERE p.id = $1;
                `, [id])

            if (res.rowCount == 0) {
                return false
            }

            return res.rows[0]

        } catch (error) {
            console.log(error)
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

            const query = `UPDATE posts SET ${setClause} WHERE id = $${fields.length + 1};`;

            const res = await connection.query(query, values);

            if (res.rowCount == 0) {
                return false
            }

            const post = await this.getById({ id })

            return post;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    static async delete({ id }) {
        try {
            const res = await connection.query('update posts set id_state = 4 where id = $1', [id])

            if(res.rowCount == 0) {
                return false
            }

            return true

        } catch (error) {
            return false
        }
    }

}