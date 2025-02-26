/**
 * Command: stop
 * ------------
 * Description: Shutdown the bot.
 *              This command terminates the bot process immediately.
 * Usage: stop
 */
module.exports = {
  name: 'stop',
  description: 'Shutdown the bot (Admin only).',
  category: 'admin',
  usage: 'stop',
  run: function (api, event, args) {
    return api.sendMessage('Shutting down...', event.threadID, () => {
      process.exit(0);
    });
  },
};
