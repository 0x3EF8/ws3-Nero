const fs = require('fs');
const path = require('path');

function loadCommands() {
  const basePath = path.join(__dirname, '../commands');
  let commands = {};

  const categories = fs
    .readdirSync(basePath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  categories.forEach((category) => {
    const categoryPath = path.join(basePath, category);
    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith('.js'));

    files.forEach((file) => {
      const command = require(path.join(categoryPath, file));
      const commandName = file.replace('.js', '').toLowerCase();
      commands[commandName] = {
        run: command.run || command,
        category,
        description: command.description || 'No description available',
        usage: command.usage || commandName,
      };
    });
  });
  return commands;
}

function getCommandList() {
  const commands = loadCommands();
  let adminCommands = [];
  let userCommands = [];

  for (const [name, cmd] of Object.entries(commands)) {
    if (cmd.category === 'admin') {
      adminCommands.push({ name, ...cmd });
    } else {
      userCommands.push({ name, ...cmd });
    }
  }

  return { adminCommands, userCommands };
}

module.exports = { loadCommands, getCommandList };
