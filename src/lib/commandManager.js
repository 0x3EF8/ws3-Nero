const fs = require('fs');
const path = require('path');

function loadCommands() {
  const commands = {};
  const commandsPath = path.join(__dirname, '../commands');
  const files = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of files) {
    const command = require(path.join(commandsPath, file));
    const commandName = file.replace('.js', '').toLowerCase();
    commands[commandName] = command;
  }
  return commands;
}

module.exports = { loadCommands };
