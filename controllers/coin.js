const User = require('../models/user');
const Coin = require('../models/crypto');
const Joi = require('@hapi/joi');
const Helper = require('../helpers/helper');
const arraySort = require('array-sort');

const schemaCrypto = Joi.object({
  crypto: Joi.string().empty().required(),
  symbol: Joi.string().empty().required(),
  name: Joi.string().empty().required()
});


let controller = {
  addCoin: async (req, res) => {
    try {
      console.log(req.user.username);
      const username = req.user.username;
      const {
        error
      } = schemaCrypto.validate(req.body);

      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      const coin = await Coin.find({
        username,
        crypto: req.body.crypto
      });
      if (coin.length > 0) {
        return res.status(400).json({
          error: 'Crypto already exists'
        });
      }

      const newCoin = await Coin.create({
        crypto: req.body.crypto,
        symbol: req.body.symbol,
        name: req.body.name,
        username
      });
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        message: 'Coin added',
        data: newCoin
      });
    } catch (error) {
      res.status(400).json({
        error
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const url = 'https://api.coingecko.com/api/v3/coins/list';
      const response = await Helper.doRequest(url);

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        data: response,
        length: response.length
      });
    } catch (error) {
      return res.status(400).json({
        error
      });
    }
  },
  getTopN: async (req, res) => {
    try {
      const username = req.user.username;
      let n = req.query.n;
      let desc;
      if (typeof req.query.desc !== 'undefined') {
        desc = req.query.desc == 'true' ? true : false;
      } else {
        desc = true;
      }
      console.log('Desc == ', desc);
      const user = await User.findOne({
        username
      });
      if (!user) {
        return res.status(400).json({
          error: 'User not found'
        });
      }
      const defaultCurrency = user.currency;
      const currencies = await Coin.find({
        username
      });
      // console.log(currencies);
      let allData = [];

      for (let index = 0; index < currencies.length; index++) {
        const url = 'https://api.coingecko.com/api/v3/coins/' + currencies[index].crypto;
        const response = await Helper.doRequest(url);
        const market = response.market_data.current_price;
        // console.log(market);
        const newObj = {
          symbol: response.symbol,
          name: response.name,
          image: response.image,
          last_updated: response.last_updated,
          currency: {
            ars: market.ars,
            usd: market.usd,
            eur: market.eur
          }
        };
        allData.push(newObj);
      }
      const key = 'currency.' + defaultCurrency;
      const sorted = arraySort(allData, key, {
        reverse: desc
      });
      res.setHeader('Content-Type', 'application/json');
      if (typeof n !== 'undefined') {
        if (sorted.length > parseInt(n)) {
          const chop = sorted.slice(0, parseInt(n));
          return res.status(200).send(await Promise.all(chop));
        }
      }
      return res.status(200).send(await Promise.all(sorted));
    } catch (error) {
      return res.status(400).json({
        error: error.toString()
      });
    }
  },
  getUserCoin: async (req, res) => {
    try {
      const currencies = await Coin.find({
        username: req.params.username
      });
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        data: currencies
      });
    } catch (error) {
      return res.status(400).json({
        error: error.toString()
      });
    }
  },
  getCoinById: async (req, res) => {
    try {
      const coinType = req.query.currency;
      const url = 'https://api.coingecko.com/api/v3/coins/' + req.params.id;
      const response = await Helper.doRequest(url);

      const newObj = {
        symbol: response.symbol,
        name: response.name,
        image: response.image,
        price: {
          currency: coinTypse,
          value: response.market_data.current_price[coinType]
        }
      };
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        data: newObj
      });
    } catch (error) {
      res.status(400).json({
        error: error.toString()
      });
    }
  }
};

module.exports = controller;