/**
 * Command: debug
 * ----------------
 * Description: Toggle or display the current debug (maintenance) mode state.
 *              When debug mode is ON, only admin commands will be processed.
 * Usage: debug <on|off|status>
 *
 * Examples:
 *  - debug on
 *  - debug off
 *  - debug status
 */
module.exports = {
  name: 'debug',
  description:
    'Toggle or display debug mode (maintenance mode). Only admins can use commands while debug mode is on.',
  category: 'admin',
  usage: 'debug <on|off|status>',
  run: function (api, event, args) {
    if (!args || args.length === 0) {
      return api.sendMessage('Usage: debug <on|off|status>', event.threadID);
    }
    const action = args[0].toLowerCase();
    if (action === 'on') {
      global.debugMode = true;
      return api.sendMessage(
        'Debug mode enabled. Only admin commands will be processed.',
        event.threadID,
      );
    } else if (action === 'off') {
      global.debugMode = false;
      return api.sendMessage(
        'Debug mode disabled. All commands are now available.',
        event.threadID,
      );
    } else if (action === 'status') {
      return api.sendMessage(
        `Debug mode is currently ${global.debugMode ? 'ON' : 'OFF'}.`,
        event.threadID,
      );
    } else {
      return api.sendMessage(
        "Invalid argument. Use 'on', 'off', or 'status'.",
        event.threadID,
      );
    }
  },
};
