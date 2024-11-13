export const authorMiddleware = (req, res, next) => {
    const { rol } = req.auth

    if (rol == 'Usuario') {
        return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado'
        })
    }

    next();
}