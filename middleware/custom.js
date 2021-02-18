const passport = require('passport');
const error_types = require('../controllers/error_types');

let middlewares = {
    verifyAuthenticated: (req, res, next) => {
        passport.authenticate('jwt', {
            session: false
        }, (err, user, info) => {
            // console.log('Estrategia jwt');
            //si hubo un error relacionado con la validez del token (error en su firma, caducado, etc)
            if (info) {
                return next(new error_types.Error401(info.message));
            }
            //si hubo un error en la consulta a la base de datos
            if (err) {
                return next(err);
            }
            //si el token está firmado correctamente pero no pertenece a un usuario existente
            if (!user) {
                return next(new error_types.Error403('You are not allowed to access.'));
            }
            //inyectamos los datos de usuario en la request
            req.user = user;
            next();
        })(req, res, next);
    },
    verifyUser: (req, res, next) => {
        if (req.user.username !== req.params.username) {
            return next(new error_types.Error403('You are not allowed to access.'));
        } else {
            next();
        }
    },
    errorHandler: (error, req, res, next) => {
        if (error instanceof error_types.InfoError)
            res.status(200).json({
                error: error.message
            });
        else if (error instanceof error_types.Error404)
            res.status(404).json({
                error: error.message
            });
        else if (error instanceof error_types.Error403)
            res.status(403).json({
                error: error.message
            });
        else if (error instanceof error_types.Error401)
            res.status(401).json({
                error: error.message
            });
        else if (error.name == "ValidationError") //de mongoose
            res.status(200).json({
                error: error.message
            });
        else if (error.message)
            res.status(500).json({
                error: error.message
            });
        else
            next();
    },
    notFoundHandler: (req, res, next) => {
        res.status(404).json({
            error: 'Endpoint not found.'
        });
    }
};


module.exports = middlewares;