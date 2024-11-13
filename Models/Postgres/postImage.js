import { connection } from "../../Database/postgres.js";

export class PostImageModel {
    static async create({ id_post, id_type, url }) {
        try {
            const res = await connection.query('insert into post_image(id_post, id_type, image_url) values ($1, $2, $3);', [id_post, id_type, url])
            if (res.rowCount == 0) {
                return false
            }
            return true
        } catch (error) {
            return false
        }
    }

    static async edit({ id, url }) {
        try {
            const res = await connection.query('update post_image set image_url = $1 where id = $2', [url, id])

            if (res.rowCount == 0) {
                return false
            }

            return true
        } catch (error) {
            return false
        }
    }
}