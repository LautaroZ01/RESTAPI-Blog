import { connection } from "../../Database/postgres.js"

export class TagModule {
    static async Create({ input }) {
        const { name } = input

        try {
            const res = await connection.query('insert into tags (name) values ($1) returning *;', [name])

            if (res.rowCount == 0) {
                return false
            }

            return res.rows[0]
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async getById({id}) {
        try {
            const res = await connection.query('select * from tags where id = $1', [id])

            if(res.rowCount == 0) {
                return false
            }

            return res.rows[0]

        } catch (error) {
            return false
        }
    }

    static async Edit({id, input}) {
        const {name} = input

        try {
            const res = await connection.query('update tags set name = $1 where id = $2', [name, id])

            if(res.rowCount == 0) {
                return false
            }

            const tag = await this.getById({id})

            return tag

        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async Delete ({id}) {
        try {
            const res = await connection.query('delete from tags where id = $1', [id])

            if(res.rowCount == 0) {
                return false
            }

            return true

        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async CreateTagPost({ input }) {
        const { id_post, id_tag } = input

        try {
            const res = await connection.query('insert into post_tags (id_post, id_tag) values ($1, $2) returning *;', [id_post, id_tag])

            if (res.rowCount == 0) {
                return false
            }

            return res.rows[0]
        } catch (error) {
            return false
        }
    }

    static async GetByPostId({ id }) {
        try {
            const res = await connection.query(`
                select t.id, t.name from post_tags pt 
                inner join posts p on p.id = pt.id_post 
                inner join tags t on t.id = pt.id_tag 
                where p.id = $1;
                `, [id]);

            if (res.rowCount == 0) {
                return false
            }

            return res.rows

        } catch (error) {
            return false
        }
    }

    static async getAll() {
        try {
            const res = await connection.query('select * from tags order by id;')

            // if (res.rowCount == 0) {
            //     return false
            // }

            return res.rows

        } catch (error) {
            return false
        }
    }

    static async DeleteTagPost ({id}) {
        try {
            const res = await connection.query('delete from post_tags where id_post = $1', [id])

            return true

        } catch (error) {
            return false
        }
    }
}
