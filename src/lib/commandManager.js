/**
 * Command Manager
 * ----------------
 * This module loads command modules from the '../commands' directory.
 * Commands are organized in subdirectories (e.g., 'admin' and 'user').
 * Each command is normalized to an object containing:
 *   - run: the function to execute the command,
 *   - category: command category,
 *   - description: brief info about the command,
 *   - usage: how to use the command,
 *   - aliases: alternative command names.
 *
 * getCommandList() separates commands into admin and user arrays,
 * ensuring duplicate aliases are filtered out.
 */

const fs = require('fs');
const path = require('path');

function loadCommands() {
  const basePath = path.join(__dirname, '../commands');
  let commands = {};

  // Read each subdirectory (category) in the commands folder
  const categories = fs
    .readdirSync(basePath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // Process each command file in every category
  for (const category of categories) {
    const categoryPath = path.join(basePath, category);
    const commandFiles = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
      try {
        // Import the command module
        const commandModule = require(path.join(categoryPath, file));
        // Normalize the command structure
        const command = {
          run: commandModule.run || commandModule,
          category,
          description: commandModule.description || 'No description available.',
          usage: commandModule.usage || file.replace('.js', ''),
          aliases: commandModule.aliases || [],
        };
        // Use file name (lowercase without .js) as the primary command name
        const commandName = file.replace('.js', '').toLowerCase();
        commands[commandName] = command;
        // Map each alias to the same command definition
        if (Array.isArray(command.aliases)) {
          for (const alias of command.aliases) {
            commands[alias.toLowerCase()] = command;
          }
        }
      } catch (err) {
        console.error(`Error loading command file ${file}:`, err);
      }
    }
  }
  return commands;
}

function getCommandList() {
  const commands = loadCommands();
  const adminCommands = [];
  const userCommands = [];

  // Filter primary commands to avoid duplicate alias entries
  Object.entries(commands).forEach(([name, cmd]) => {
    if (name === cmd.usage.toLowerCase() || !cmd.aliases.includes(name)) {
      if (cmd.category === 'admin') {
        adminCommands.push({ name, ...cmd });
      } else {
        userCommands.push({ name, ...cmd });
      }
    }
  });

  // Sort commands alphabetically
  adminCommands.sort((a, b) => a.name.localeCompare(b.name));
  userCommands.sort((a, b) => a.name.localeCompare(b.name));

  return { adminCommands, userCommands };
}

module.exports = { loadCommands, getCommandList };
