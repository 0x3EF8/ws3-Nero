const login = require('ws3-fca');
const config = require('../config/config');

function initClient(callback) {
  login({ appState: config.appState }, (err, api) => {
    if (err) return callback(err);
    api.setOptions(config.options);
    callback(null, api);
  });
}

module.exports = { initClient };
