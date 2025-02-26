/**
 * Command: setguard
 * -----------------
 * Description: Toggle your profile guard on or off.
 *              Only admin commands can execute this command.
 * Usage: setguard <on|off>
 *
 * Examples:
 *  - setguard on
 *  - setguard off
 */
module.exports = {
  name: 'setguard',
  description: 'Toggle your profile guard (on/off).',
  category: 'admin',
  usage: 'setguard <on|off>',
  run: function (api, event, args) {
    if (!args || args.length === 0) {
      return api.sendMessage(
        "Please specify 'on' or 'off'. Usage: setguard <on|off>",
        event.threadID,
      );
    }
    let guardArg = args[0].toLowerCase();
    let guard;
    if (guardArg === 'on' || guardArg === 'true') {
      guard = true;
    } else if (guardArg === 'off' || guardArg === 'false') {
      guard = false;
    } else {
      return api.sendMessage(
        "Invalid argument. Use 'on' or 'off'.",
        event.threadID,
      );
    }
    api.setProfileGuard(guard, (err) => {
      if (err) {
        console.error('Error setting profile guard:', err);
        let errorMsg = err.error ? err.error : 'An unknown error occurred.';
        return api.sendMessage(
          `Failed to set profile guard: ${errorMsg}`,
          event.threadID,
        );
      }
      return api.sendMessage(
        `Profile guard has been turned ${guard ? 'ON' : 'OFF'}.`,
        event.threadID,
      );
    });
  },
};
