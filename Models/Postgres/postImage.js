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
}