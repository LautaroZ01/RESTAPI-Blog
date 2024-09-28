import { UsersModule } from "../Models/Postgres/user.js";
import { validatParcialUser, validatUsers } from "../Schemas/user.js";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

dotenv.config()

export class UserController {
    static async getAll(req, res) {
        try {
            const users = await UsersModule.getAll()

            if (!users) {
                return res.status(400).json({
                    status: "error",
                    error: 'No hay usuarios'
                })
            }

            return res.json({
                status: 'success',
                users
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Se produjo un error al intentar traer todos los usuarios'
            })
        }
    }

    static async register(req, res) {
        const result = validatUsers(req.body)

        if (result.error) {
            return res.status(400).json({
                status: "error",
                error: JSON.parse(result.error.message)
            })
        }

        const { data } = result;

        try {
            const hashPassword = await bcrypt.hash(data.password, parseInt(process.env.SALT_ROUNDS))

            data.password = hashPassword;

            const user = await UsersModule.create({ input: data })

            if (!user) {
                return res.status(400).json({
                    status: "error",
                    error: 'El usuario ya existe'
                })
            }

            const { password, ...publicUser } = user

            return res.status(201).json({
                status: 'success',
                user: publicUser
            })

        } catch (error) {
            return res.status(500).json({
                status: "error",
                error: "Algo salio mal"
            })
        }

    }

    static async login(req, res) {
        const result = validatParcialUser(req.body);

        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { username, password } = result.data


        try {
            const user = await UsersModule.login({ username });

            if (!user) {
                return res.status(400).json({
                    status: "error",
                    error: 'El usuario es incorrecto'
                })
            }

            const isValid = await bcrypt.compare(password, user.password)

            if (!isValid) {
                return res.status(400).json({
                    status: "error",
                    error: "Contraseña incorrecta"
                })
            }

            const { password: _, ...publicUser } = user

            const token = jwt.sign({ user: publicUser }, process.env.SECRET, {
                expiresIn: '24h'
            })

            return res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV == 'production', // la cookie solo se puede acceder en https
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60
            })
                .json({
                    status: 'success',
                    user: publicUser
                })

        } catch (error) {
            return res.status(500).json({
                status: "error",
                error: "Algo salio mal"
            })
        }
    }

    static async logout(req, res) {
        res.clearCookie('access_token').json({
            status: 'success',
            message: 'Sesion cerrada con exito'
        })
    }

    static async profile(req, res) {
        const { username } = req.session

        try {
            const user = await UsersModule.getByUsername({ username })
            if (!user) {
                return res.status(400).json({
                    status: "error",
                    error: 'El usuario no existe'
                })
            }
            return res.json({
                status: 'success',
                user: user
            })
        } catch (error) {
            return res.status(400).json({
                status: "error",
                error: 'El usuario no existe'
            })
        }
    }
}