const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const Mdw = require('../middleware/custom');

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/:username', Mdw.verifyAuthenticated, Mdw.verifyUser, UserController.profile);

module.exports = router;