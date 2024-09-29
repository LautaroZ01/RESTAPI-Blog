import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


export const auth = (req, res, next) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado'
        })
    }

    try {
        const data = jwt.verify(token, process.env.SECRET)
        req.auth = data.user
    } catch (error) {
        return res.status(401).send({
            status: 'error',
            message: 'Acceso denegado por el servidor'
        })
    }

    next();
}