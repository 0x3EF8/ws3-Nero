/**
 * PM2 Configuration File - ws3-nero
 * -----------------------------------
 * This file configures PM2 to manage the ws3-nero chatbot, ensuring 
 * reliable uptime, automatic restarts, and efficient resource usage.
 *
 * Features:
 * - Runs the application in fork mode with a single instance.
 * - Automatically restarts on crashes or unexpected failures.
 * - Limits memory usage to 512MB before restarting to prevent leaks.
 * - Ensures smooth deployment in a production environment.
 * - Disables file watching to prevent infinite restart loops.
 *
 * Usage:
 * - Start the bot: `pm2 start ecosystem.config.js`
 * - Stop the bot:  `pm2 stop ws3-nero`
 * - Restart the bot: `pm2 restart ws3-nero`
 * - View logs: `pm2 logs ws3-nero`
 * - Check status: `pm2 list`
 */

module.exports = {
    apps: [
        {
            name: "ws3-nero", 
            script: "index.js", 
            instances: 1,
            exec_mode: "fork", 
            watch: false, 
            autorestart: true, 
            max_memory_restart: "512M",
            env: {
                NODE_ENV: "production"
            }
        }
    ]
};
