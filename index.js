/**
 * main
 * --------
 * Main entry point for the bot.
 * - Initializes the API client.
 * - Loads commands and events.
 * - Listens for incoming messages and dispatches commands.
 */

const { initClient } = require('./src/lib/fbClient');
const { loadCommands, getCommandList } = require('./src/lib/commandManager');
const { loadEvents } = require('./src/lib/eventManager');
const config = require('./src/config/config');

// Log unhandled promise rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", promise, "reason:", reason);
});


// Global debug flag (when true, only admins can run commands)
global.debugMode = false;

// Helper: Check if a sender is an admin
const isAdmin = (senderID) =>
  Array.isArray(config.admins) && config.admins.includes(senderID);

(async () => {
  try {
    const api = await initClient();
    console.log(`${config.botName} v${config.version} logged in successfully.`);

    // Load commands and events once at startup
    const commands = loadCommands();
    const events = loadEvents();
    const myUserId =
      typeof api.getCurrentUserID === 'function'
        ? api.getCurrentUserID()
        : null;

    api.listenMqtt((err, event) => {
      if (err) return console.error('Listen error:', err);

      // Mark thread as read (non-blocking)
      api.markAsRead(event.threadID, (err) => {
        if (err) console.error('Mark read error:', err);
      });

      // Process any events that match the event type
      events.forEach((e) => {
        if (Array.isArray(e.eventTypes) && e.eventTypes.includes(event.type)) {
          try {
            e.handler(api, event);
          } catch (ex) {
            console.error(`Error in event ${e.name}:`, ex);
          }
        }
      });

      // Only process text messages
      if (event.type === 'message' && event.body) {
        let messageText = event.body.trim();
        const isSelf = myUserId && event.senderID === myUserId;

        // If selfListen is enabled, require selfPrefix on own messages
        if (isSelf && config.options.selfListen) {
          if (!messageText.startsWith(config.selfPrefix)) return;
          messageText = messageText.slice(config.selfPrefix.length).trim();
        }

        // Process Admin Commands (no prefix required)
        let adminExecuted = false;
        const { adminCommands } = getCommandList();
        for (const adminCmd of adminCommands) {
          const regex = new RegExp(`^${adminCmd.name}(\\s|$)`, 'i');
          if (regex.test(messageText)) {
            const argsStr = messageText.replace(regex, '').trim();
            const args = argsStr ? argsStr.split(/\s+/) : [];
            if (args.includes('-help')) {
              return api.sendMessage(
                `Command: ${adminCmd.name}\nDescription: ${adminCmd.description}\nCategory: ${adminCmd.category}\nUsage: ${adminCmd.usage}`,
                event.threadID,
              );
            }
            if (!isAdmin(event.senderID)) {
              return api.sendMessage(
                "You don't have permission to use this command.",
                event.threadID,
              );
            }
            try {
              adminCmd.run(api, event, args);
            } catch (ex) {
              console.error(`Admin command error (${adminCmd.name}):`, ex);
              return api.sendMessage(
                'Error executing command.',
                event.threadID,
              );
            }
            adminExecuted = true;
            break;
          }
        }
        if (adminExecuted) return;

        // Block non-admin commands in debug mode
        if (global.debugMode && !isAdmin(event.senderID)) {
          return api.sendMessage(
            'Bot is in debug (maintenance) mode. Please try later.',
            event.threadID,
          );
        }

        // Process User Commands (require prefix if configured)
        if (config.commandPrefix) {
          if (!messageText.startsWith(config.commandPrefix)) return;
          messageText = messageText.slice(config.commandPrefix.length).trim();
        }
        const argsArr = messageText.split(/\s+/);
        const commandName = argsArr.shift().toLowerCase();
        const command = commands[commandName];
        if (command && command.category === 'user') {
          if (argsArr.includes('-help')) {
            return api.sendMessage(
              `Command: ${commandName}\nDescription: ${command.description}\nCategory: ${command.category}\nUsage: ${command.usage}`,
              event.threadID,
            );
          }
          try {
            command.run(api, event, argsArr);
          } catch (ex) {
            console.error(`User command error (${commandName}):`, ex);
            return api.sendMessage('Error executing command.', event.threadID);
          }
        }
      }
    });
  } catch (err) {
    console.error('Initialization error:', err);
  }
})();
