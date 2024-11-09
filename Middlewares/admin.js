export const adminMiddleware = (req, res, next) => {
    const { rol } = req.auth

    if (rol != 'Administrador') {
        return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado'
        })
    }

    next();
}