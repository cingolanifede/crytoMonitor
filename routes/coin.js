const express = require('express');
const router = express.Router();
const CoinController = require('../controllers/coin');
const Mdw = require('../middleware/custom');

router.post('/add/:username', Mdw.verifyAuthenticated, Mdw.verifyUser, CoinController.addCoin);
router.get('/topN/:username', Mdw.verifyAuthenticated, Mdw.verifyUser, CoinController.getTopN);
router.get('/list/:username', Mdw.verifyAuthenticated, Mdw.verifyUser, CoinController.getUserCoin);
router.get('/crypto/:id', Mdw.verifyAuthenticated, Mdw.verifyUser, CoinController.getCoinById);

module.exports = router;