const request = require('request');

const doRequest = (url) => {
  return new Promise(function (resolve, reject) {
    request(url, {
      json: true
    }, (err, res2, body) => {
      if (err) {
        reject(error);
      }
      resolve(body);
    });
  });
};

module.exports = {
  doRequest
};