const passport = require('passport');
const error_types = require('../controllers/error_types');

let middlewares = {

    /*
    Este middleware va *antes* de las peticiones.
    passport.authenticate de jwt por defecto añade en req.user el objeto que devolvamos desde
    el callback de verificación de la estrategia jwt.
    En nuestro caso hemos personalizado el auth_callback de authenticate y
    aunque también inyectamos ese dato en req.user, aprovechamos y personalizaremos las respuestas
    para que sean tipo json.
    */
    verifyAuthenticated: (req, res, next) => {
        passport.authenticate('jwt', {
            session: false
        }, (err, user, info) => {
            console.log('Estrategia jwt');
            if (info) {
                return next(new error_types.Error401(info.message));
            }
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new error_types.Error403("You are not allowed to access."));
            }
            req.user = user;
            next();
        })(req, res, next);
    },
    verifyUser: (req, res, next) => {
        if (req.user.username !== req.params.username) {
            return res.status(400).json({
                error: 'User not allowed'
            });
        } else {
            next();
        }
    },
    /*
    Este middleware va al final de todos los middleware y rutas.
    middleware de manejo de errores.
    */
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

    /*
    Este middleware va al final de todos los middleware y rutas.
    middleware para manejar notFound
    */
    notFoundHandler: (req, res, next) => {
        res.status(404).json({
            error: 'endpoint not found'
        });
    }
};


module.exports = middlewares;