const { initClient } = require('./lib/fbClient');
const { loadCommands } = require('./lib/commandManager');
const { loadEvents } = require('./lib/eventManager');
const config = require('./config/config');

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', promise, 'reason:', reason);
});

initClient((err, api) => {
  if (err) return console.error('Login error:', err);

  console.log(`${config.botName} v${config.version} logged in successfully.`);

  const commands = loadCommands();
  const events = loadEvents();
  const myUserId = api.getCurrentUserID ? api.getCurrentUserID() : null;

  api.listenMqtt((err, event) => {
    if (err) return console.error('Listen error:', err);

    api.markAsRead(event.threadID, (err) => {
      if (err) console.error('Mark as read error:', err);
    });

    events.forEach((e) => {
      if (e.eventTypes && e.eventTypes.includes(event.type)) {
        try {
          e.handler(api, event);
        } catch (ex) {
          console.error(`Error in event handler ${e.name}:`, ex);
        }
      }
    });

    if (event.type === 'message' && event.body) {
      let messageText = event.body.trim();
      const isSelf = myUserId && event.senderID === myUserId;
      if (isSelf && config.options.selfListen) {
        if (!messageText.startsWith(config.selfPrefix)) return;
        messageText = messageText.slice(config.selfPrefix.length).trim();
      }

      let adminCommandMatched = false;
      for (const cmd in commands) {
        if (commands[cmd].category === 'admin') {
          const commandRegex = new RegExp(`^${cmd}(\\s|$)`, 'i');
          if (commandRegex.test(messageText)) {
            const rest = messageText.replace(commandRegex, '').trim();
            const args = rest.length > 0 ? rest.split(' ') : [];

            if (!config.admins.includes(event.senderID)) {
              api.sendMessage(
                "You don't have permission to use this command.",
                event.threadID,
              );
              adminCommandMatched = true;
              break;
            }

            try {
              commands[cmd].run(api, event, args);
            } catch (ex) {
              console.error(`Error executing admin command ${cmd}:`, ex);
              api.sendMessage(
                'An error occurred while executing the command.',
                event.threadID,
              );
            }
            adminCommandMatched = true;
            break;
          }
        }
      }
      if (adminCommandMatched) return;

      if (config.commandPrefix) {
        if (!messageText.startsWith(config.commandPrefix)) return;
        messageText = messageText.slice(config.commandPrefix.length).trim();
      }

      const args = messageText.split(' ');
      const commandName = args.shift().toLowerCase();

      for (const cmd in commands) {
        if (commands[cmd].category === 'user') {
          const commandRegex = new RegExp(`^${cmd}(\\s|$)`, 'i');
          if (commandRegex.test(commandName)) {
            try {
              commands[cmd].run(api, event, args);
            } catch (ex) {
              console.error(`Error executing user command ${cmd}:`, ex);
              api.sendMessage(
                'An error occurred while executing the command.',
                event.threadID,
              );
            }
            return;
          }
        }
      }
    }
  });
});
