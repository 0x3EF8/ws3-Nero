/**
 * Command: shell
 * ---------------
 * Description: Execute shell commands on the server.
 *              Use this command with caution. (Admin only)
 * Usage: shell <command>
 *
 * Example:
 *  - shell ping google.com
 */
module.exports = {
  name: 'shell',
  description: 'Execute shell commands (Admin only). Usage: shell <command>',
  category: 'admin',
  usage: 'shell <command>',
  run: function (api, event, args) {
    const { exec } = require('child_process');
    if (!args || args.length === 0) {
      return api.sendMessage('Usage: shell <command>', event.threadID);
    }
    const command = args.join(' ');
    exec(
      command,
      { timeout: 10000, maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          return api.sendMessage(`Error: ${error.message}`, event.threadID);
        }
        let output = stdout || stderr || 'Command executed with no output.';
        if (output.length > 1500) {
          output = output.slice(0, 1500) + '\n\n[Output truncated]';
        }
        return api.sendMessage(`Output:\n${output}`, event.threadID);
      },
    );
  },
};
