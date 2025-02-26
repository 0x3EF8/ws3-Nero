/**
 * Command: status
 * ----------------
 * Description: Displays the bot's uptime along with system resource usage and platform details.
 *              This includes process uptime, memory usage, CPU load averages, and OS information.
 * Category: user
 * Usage: uptime
 *
 * Example:
 *   uptime
 */
module.exports = {
  name: 'status',
  description:
    'Displays the bot uptime, memory usage, CPU load, and OS information.',
  category: 'admin',
  usage: 'status',
  run: function (api, event, args) {
    const os = require('os');
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    const formattedUptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const memoryUsage = process.memoryUsage();
    const rss = (memoryUsage.rss / (1024 * 1024)).toFixed(2);
    const heapTotal = (memoryUsage.heapTotal / (1024 * 1024)).toFixed(2);
    const heapUsed = (memoryUsage.heapUsed / (1024 * 1024)).toFixed(2);
    const external = (memoryUsage.external / (1024 * 1024)).toFixed(2);

    const loadAvg = os.loadavg();
    const cpuLoad = loadAvg.map((x) => x.toFixed(2)).join(', ');

    const totalMemGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
    const freeMemGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);

    const message = `
Uptime: ${formattedUptime}
Memory Usage:
  - RSS: ${rss} MB
  - Heap Total: ${heapTotal} MB
  - Heap Used: ${heapUsed} MB
  - External: ${external} MB
CPU Load Average (1, 5, 15 min): ${cpuLoad}
Platform: ${os.platform()} (${os.type()})
Total Memory: ${totalMemGB} GB
Free Memory: ${freeMemGB} GB
Process ID: ${process.pid}
    `.trim();

    return api.sendMessage(message, event.threadID);
  },
};
