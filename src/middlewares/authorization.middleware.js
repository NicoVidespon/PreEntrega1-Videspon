export const authorization = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: 'Usuario no autenticado' });
        }

        if (req.user.role !== role) {
            return res.status(403).send({ error: 'No tienes permisos para acceder a este recurso' });
        }

        next();
    };
};
