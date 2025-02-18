module.exports = {
  botName: 'Nero',
  version: '1.0.0',

  admins: ['100025665999358'],

  options: {
    listenEvents: true,
    selfListen: false,
    randomUserAgent: false,
    bypassRegion: 'PH',
  },

  commandPrefix: false,

  selfPrefix: '$',

  appState: require('./appstate.json'),
};
