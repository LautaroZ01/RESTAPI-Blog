import { UsersModule } from "../Models/Postgres/user.js";
import { validatParcialUser, validatUsers } from "../Schemas/user.js";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { uploadFile } from "../Models/Firebase/firebase.js";
import { email } from "../Config/email.js";

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
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(result.error.message)
            })
        }

        const { email, password } = result.data


        try {
            const user = await UsersModule.login({ email });

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

    static async upload(req, res) {
        const photo = req.files.photo

        const { id } = req.auth

        if (photo && photo.length > 0) {
            try {
                const { ref, downloadURL } = await uploadFile(photo[0], 600, 600)

                const userAvatar = await UsersModule.uploadAvatar({ id, fileURL: downloadURL })

                if (!userAvatar) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'No se pudo actualizar el Avatar'
                    })
                }

                return res.json({
                    status: 'success',
                    photo: userAvatar.photo
                })
            } catch (error) {
                return res.status(500).json({
                    status: "error",
                    error: "Algo salio mal en el servidor"
                })
            }
        }
    }

    static async getSession(req, res) {
        const user = req.auth

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'La sesion ha caducado'
            })
        }

        return res.json({
            status: 'success',
            user
        })
    }

    static async googleCallback(req, res) {

        const token = jwt.sign({ user: req.user }, process.env.SECRET, {
            expiresIn: '24h'
        })

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production', // la cookie solo se puede acceder en https
            maxAge: 1000 * 60 * 60
        })

        res.redirect('http://localhost:5173/')
    }

    static async profile(req, res) {
        const { id } = req.auth

        if (!id) {
            return res.status(400).json({
                status: 'error',
                error: 'Acceso no autorizado'
            })
        }

        try {
            const user = await UsersModule.getById({ id })

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
            return res.status(500).json({
                status: "error",
                error: 'El usuario no existe'
            })
        }
    }

    static async edit(req, res) {
        const result = validatParcialUser(req.body)
        const { id } = req.auth

        if (result.error) {
            return res.status(400).json({
                status: "error",
                error: JSON.parse(result.error.message)
            })
        }

        const { data } = result

        try {
            const userEdit = await UsersModule.edit({ id, input: data })

            if (!userEdit) {
                return res.status(400).json({
                    status: "error",
                    error: 'Ya existe un usuario con ese nombre'
                })
            }

            return res.json({
                status: 'success',
                user: userEdit
            })

        } catch (error) {
            return res.status(500).json({
                status: "error",
                error: "Algo salio mal"
            })
        }

    }

    static async editRol(req, res) {
        const { id_user, id_rol } = req.body;

        try {
            const rolUser = await UsersModule.editRol({ id_user, id_rol })

            if (!rolUser) {
                return res.status(400).json({
                    status: "error",
                    error: 'No se pudo actualizar el rol del usuario'
                })
            }

            return res.json({
                status: 'success',
                rol: rolUser
            })
        } catch (error) {
            return res.status(500).json({
                status: "error",
                error: "Algo salio mal en el servidor"
            })
        }
    }

    static async sendEmail(req, res) {
        const { subject, text } = req.body;

        try {
            let info = await email(subject, text);
            res.status(200).json({
                status: 'success',
                message: `Email sent: ${info.response}`
            });
        } catch (error) {
            res.status(500).send("Error sending email");
        }
    }
}