/**
 * fbClient
 * -----------
 * Initializes the Facebook API client using ws3-fca.
 * Returns a Promise that resolves with the API object after applying settings.
 */
const login = require('ws3-fca');
const config = require('../config/config');

function initClient() {
  return new Promise((resolve, reject) => {
    login({ appState: config.appState }, (err, api) => {
      if (err) return reject(err);
      api.setOptions(config.options);
      resolve(api);
    });
  });
}

module.exports = { initClient };
