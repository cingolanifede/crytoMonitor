const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/user');
const config = require('./config');

/** config de estrategia local de passport ******/
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false
}, async (username, password, done) => {
    try {
        const user = await User.findOne({
            username
        });
        if (!user) {
            return done(null, false); //el usuario no existe
        }
        const validPassword = await user.isValidPassword(password);
        if (!validPassword) {
            return done(null, false);
        }
        return done(null, user); //login ok
    } catch (error) {
        done(null, error); //login ok
    }
}));

/** config de estrategia jwt de passport ******/
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_KEY;
opts.algorithms = config.JWT_ALGORITHM;

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findOne({
            _id: jwt_payload.sub
        });
        if (!user) {
            return done(null, false); //el usuario no existe
        }
        return done(null, user); //login ok
    } catch (error) {
        done(null, data); //login ok
    }
}));