module.exports = function(api, event, args) {
    const helpText = `
  Available commands:
  - ping: Responds with "pong".
  - help: Displays this help message.
  - stop: Shuts down the bot.
    `;
    api.sendMessage(helpText, event.threadID);
  };
  