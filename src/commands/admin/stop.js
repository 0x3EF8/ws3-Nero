module.exports = {
  name: 'stop',
  description: 'Shutdown the bot (Admin only)',
  category: 'admin',

  run: function (api, event, args) {
    api.sendMessage('Shutting down...', event.threadID, () => {
      process.exit(0);
    });
  },
};
