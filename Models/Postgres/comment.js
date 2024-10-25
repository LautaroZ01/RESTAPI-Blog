import { connection } from "../../Database/postgres.js";

export class CommentModel {
    static async Create({ id_post, id_user, content }) {
        try {
            const res = await connection.query('insert into comments (id_post , id_user, content) values ($1, $2, $3) RETURNING *;', [id_post, id_user, content])

            if (res.rowCount == 0) {
                return false;
            }
            const newComment = await connection.query(`
                select u.id as id_user, u.username, u.photo, c.id, c.content, c.create_at from comments c 
                inner join users u on c.id_user = u.id
                where c.id = $1;`, [res.rows[0].id])

            if (newComment.rowCount == 0) {
                return false;
            }

            return newComment.rows[0]

        } catch (error) {
            return false
        }
    }

    static async Edit({ id_comment, id_user, content }) {
        try {
            const res = await connection.query('update comments set content = $1 where id = $2 and id_user = $3', [content, id_comment, id_user])

            if (res.rowCount == 0) {
                return false;
            }

            const commentEdit = await connection.query('select content from comments where id = $1', [id_comment])

            if (commentEdit.rowCount == 0) {
                return false
            }

            return commentEdit.rows[0]

        } catch (error) {
            return false
        }
    }

    static async getById({ id_post }) {
        try {
            const res = await connection.query(`
                select u.id as id_user, u.username, u.photo, c.id, c.content, c.create_at from comments c 
                inner join users u on c.id_user = u.id
                where c.id_post = $1; `,
                [id_post]
            )

            if (res.rowCount == 0) {
                return false;
            }
            return res.rows

        } catch (error) {
            return false
        }
    }

    static async Delete({ id_comment, id_user }) {
        try {
            const res = await connection.query('delete from comments where id=$1 and id_user = $2', [id_comment, id_user])

            if (res.rowCount == 0) {
                return false;
            }

            return true;

        } catch (error) {
            return false
        }
    }
}