import { connection } from "../../Database/postgres.js";

export class AuthorModule {
    static async getById({ id }) {

        try {
            const res = await connection.query('select a.id, a.description, a.bio, u.username, u.surname, u.email, u.address, u.birthdate, u.photo from authors a inner join users u on a.id_user = u.id where a.id_user = $1;', [id]);            
            
            if(res.rowCount == 0){
                return false
            }

            return res.rows[0];
            
        } catch (error) {
            return false
        }
    }

    static async edit({id, input}){
        const fields = Object.keys(input);
        const values = Object.values(input);

        if (fields.length === 0) {
            return false
        }

        try {
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            values.push(id);

            const query = `UPDATE authors SET ${setClause} WHERE id_user = $${fields.length + 1};`;

            const res = await connection.query(query, values);
            
            if (res.rowCount == 0) {
                return false
            }

            const author = await this.getById({ id })

            return author;
        } catch (error) {
            return false
        }
    }
}