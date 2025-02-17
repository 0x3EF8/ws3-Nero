const { initClient } = require('./lib/fbClient');
const { loadCommands } = require('./lib/commandManager');

// Global error handling to catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

initClient((err, api) => {
  if (err) return console.error('Login error:', err);

  console.log('Facebook bot logged in successfully.');

  const commands = loadCommands();

  const stopListening = api.listenMqtt((err, event) => {
    if (err) return console.error('Listen error:', err);

    api.markAsRead(event.threadID, (err) => {
      if (err) console.error('Mark as read error:', err);
    });

    if (event.type === 'message' && event.body) {
      const args = event.body.trim().split(' ');
      const commandName = args[0].toLowerCase();

      if (commands[commandName]) {
        commands[commandName](api, event, args.slice(1));
      } else {
        api.sendMessage(`Echo: ${event.body}`, event.threadID);
      }
    }
  });
});
