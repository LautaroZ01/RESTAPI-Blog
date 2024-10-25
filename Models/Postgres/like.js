import { connection } from "../../Database/postgres.js"

export class LikeModel {
    static async Save({ id_post, id_user }) {
        try {
            const res = await connection.query('insert into post_likes (id_post, id_user) values ($1,$2);', [id_post, id_user])
            if (res.rowCount == 0) {
                return false;
            }

            return true

        } catch (error) {
            return false
        }
    }

    static async Delete({ id_post, id_user }) {
        try {
            const res = await connection.query('delete from post_likes where id_post = $1 and id_user = $2;', [id_post, id_user])
            if (res.rowCount == 0) {
                return false;
            }

            return true

        } catch (error) {
            return false
        }
    }

    static async getLike({ id_post, id_user }) {

        try {
            const res = await connection.query('select * from post_likes pl where id_post = $1 and id_user = $2;', [id_post, id_user])
            if (res.rowCount == 0) {
                return false;
            }

            return true

        } catch (error) {
            return false
        }
    }
}