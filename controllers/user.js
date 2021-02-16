const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const Joi = require('@hapi/joi');

//Validations
const schemaRegister = Joi.object({
  firstName: Joi.string().empty().required(),
  lastName: Joi.string().empty().required(),
  username: Joi.string().empty().required(),
  password: Joi.string().empty().required(),
  currency: Joi.string().max(3).empty().required()
});

const schemaLogin = Joi.object({
  username: Joi.string().empty().required(),
  password: Joi.string().empty().required()
});

let controller = {
  register: async (req, res, next) => {
    try {
      const {
        error
      } = schemaRegister.validate(req.body);

      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      const username = req.body.username;
      const password = req.body.password;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const currency = req.body.currency;
      const isEmailExist = await User.findOne({
        username
      });

      if (isEmailExist) {
        return res.status(400).json({
          error: 'Username already exists'
        });
      } else {
        const user = await User.create({
          username,
          password,
          firstName,
          lastName,
          currency
        });
        const result = {
          message: 'Signup successful',
          user
        };
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          response: result
        });
      }
    } catch (error) {
      next(err);
    }
  },
  login: (req, res, next) => {
    passport.authenticate('local', {
      session: false
    }, (error, user) => {
      if (error || !user) {
        return res.status(400).json({
          error: 'User login fail'
        });
      } else {
        const {
          error
        } = schemaLogin.validate(req.body);

        if (error) {
          return res.status(400).json({
            error: error.details[0].message
          });
        }

        const payload = {
          sub: user._id,
          exp: Date.now() + parseInt(config.JWT_LIFETIME),
          username: user.username
        };

        const token = jwt.sign(JSON.stringify(payload), config.JWT_KEY, {
          algorithm: config.JWT_ALGORITHM
        });
        res.status(200).json({
          data: {
            token: token
          }
        });
      }
    })(req, res);
  },
  profile: async (req, res, next) => {
    const user = await User.findOne({
      username: req.params.username
    });
    if (!user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      data: user
    });
  }
};

module.exports = controller;