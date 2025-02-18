module.exports = {
  name: 'ping',
  description: 'Check if bot is responding',
  category: 'user',

  run: function (api, event, args) {
    api.sendMessage('pong', event.threadID);
  },
};
