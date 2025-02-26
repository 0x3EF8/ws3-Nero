/**
 * Command: cmd
 * ------------
 * Description: Displays a professional, organized list of available commands.
 *
 * Flags:
 *   -admin  : Show admin commands instead of user commands.
 *   -info   : Show detailed information (description & usage).
 *
 * Examples:
 *   cmd              -> Shows a simple list of user commands.
 *   cmd -info        -> Shows detailed info for user commands.
 *   cmd -admin       -> Shows a simple list of admin commands.
 *   cmd -admin -info -> Shows detailed info for admin commands.
 */
module.exports = {
  name: 'cmd',
  description: 'Shows a list of available commands.',
  category: 'user',
  usage: 'cmd [-admin] [-info]',
  run: function (api, event, args) {
    const { getCommandList } = require('../../lib/commandManager');
    const { adminCommands, userCommands } = getCommandList();
    const adminFlag = args.some((arg) => arg.toLowerCase() === '-admin');
    const helpFlag = args.some((arg) => arg.toLowerCase() === '-info');
    const commandsToShow = adminFlag ? adminCommands : userCommands;
    const headerText = adminFlag ? 'Admin Commands' : 'User Commands';
    let header = `=== ${headerText} ===\n\n`;
    let body = '';
    if (helpFlag) {
      commandsToShow.forEach((cmd) => {
        body += `Command: ${cmd.name}\n`;
        body += `   Description: ${cmd.description}\n`;
        body += `   Usage: ${cmd.usage}\n`;
        body += `-----------------------------------\n`;
      });
    } else {
      commandsToShow.forEach((cmd) => {
        body += `• ${cmd.name}\n`;
      });
    }
    const finalMessage = header + body;
    api.sendMessage(finalMessage.trim(), event.threadID);
  },
};
