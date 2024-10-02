import { connection } from "../../Database/postgres.js";

export class UsersModule {
    static async getByGoogleId({ googleId }) {
        try {
            // Modificar la base de datos y agregar la columno googleId en users
            const res = await connection.query('select u.id, u.username, u.surname, u.email, u.address, u.birthdate, u.photo, r.name as rol from users u inner join roles r on u.id_rol = r.id where u.googleId like $1;', [googleId])
            return res.rows[0]
        } catch (error) {

            return false
        }
    }

    static async getAll() {
        try {
            const res = await connection.query('select u.id, u.username, u.surname, u.email, u.address, u.birthdate, u.photo, r.name as rol from users u inner join roles r on u.id_rol = r.id');
            return res.rows
        } catch (error) {
            return false
        }
    }

    static async getById({ id }) {
        try {
            const res = await connection.query('select u.id, u.username, u.surname, u.email, u.address, u.birthdate, u.photo, r.name as rol from users u inner join roles r on u.id_rol = r.id where u.id = $1;', [id])
            return res.rows[0]
        } catch (error) {
            return false
        }
    }


    static async getByUsername({ username }) {
        try {
            const res = await connection.query('select u.id, u.username, u.surname, u.email, u.address, u.birthdate, u.photo, r.name as rol from users u inner join roles r on u.id_rol = r.id where u.username like $1;', [username])
            return res.rows[0]
        } catch (error) {
            return false
        }
    }

    static async create({ input }) {
        try {
            const { username, surname, email, password, address, birthdate, photo, created_at, id_rol, googleId } = input
            const isUser = await connection.query('SELECT * FROM users WHERE username like $1', [username])

            if (isUser.rows.length != 0) {
                return false
            }

            if (googleId != '') {
                const res = await connection.query('INSERT INTO users (googleid, username, surname, email, password, address, birthdate, photo, created_at, id_rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [googleId, username, surname, email, password, address, birthdate, photo, created_at, id_rol]);

            } else {
                const res = await connection.query('INSERT INTO users (username, surname, email, password, address, birthdate, photo, created_at, id_rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [username, surname, email, password, address, birthdate, photo, created_at, id_rol]);
            }

            const user = await connection.query('SELECT * FROM users WHERE username like $1', [username])
            return user.rows[0]
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async login({ username }) {
        try {
            const res = await connection.query('select u.id, u.username, u.email, u.password, u.photo, r.name as rol from users u inner join roles r on u.id_rol = r.id where u.username like $1 OR u.email like $2', [username, username])
            if (res.rows.length == 0) {
                return false
            }

            return res.rows[0]
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
            // Crear la parte dinámica del SET
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            values.push(id);

            const query = `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1};`;
    
            const res = await connection.query(query, values);
            const userEdited = await connection.query('select u.id, u.username, u.surname, u.email, u.address, u.birthdate, u.photo, r.name as rol from users u inner join roles r on u.id_rol = r.id where u.id = $1;', [id])

            if (res.rowCount == 0) {
                return false
            }

            return userEdited.rows[0]

        } catch (error) {
            return false
        }
    }
}