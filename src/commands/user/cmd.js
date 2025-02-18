module.exports = {
  name: 'cmd',
  description: 'Shows list of available commands',
  category: 'user',

  run: function (api, event, args) {
    const { getCommandList } = require('../../lib/commandManager');
    const { adminCommands, userCommands } = getCommandList();

    // const userCommandsText = userCommands.map(cmd => `${cmd.name}: ${cmd.description}`).join('\n');
    // const adminCommandsText = adminCommands.map(cmd => `${cmd.name}: ${cmd.description}`).join('\n');

    const userCommandsText = userCommands
      .map((cmd) => `- ${cmd.name}`)
      .join('\n');
    const adminCommandsText = adminCommands
      .map((cmd) => `- ${cmd.name}`)
      .join('\n');

    const helpText = `
Command Flow Map

User Commands:
${userCommandsText}

Admin Commands:
${adminCommandsText}
    `;

    api.sendMessage(helpText.trim(), event.threadID);
  },
};
