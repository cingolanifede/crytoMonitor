const express = require('express');
const router = express.Router();
const CoinController = require('../controllers/coin');
const Mdw = require('../middleware/custom');

router.get('/', Mdw.verifyAuthenticated, CoinController.getAll);
router.post('/add', Mdw.verifyAuthenticated, CoinController.addCoin);
router.get('/topN', Mdw.verifyAuthenticated, CoinController.getTopN);
router.get('/list', Mdw.verifyAuthenticated, CoinController.getUserCoin);
router.get('/crypto/:id', Mdw.verifyAuthenticated, CoinController.getCoinById);

module.exports = router;