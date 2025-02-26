/**
 * Event Manager
 * -------------
 * This module loads event handler modules from the '../events' directory.
 * If the directory does not exist, it returns an empty array.
 * Each event file should export an event handler module.
 */

const fs = require('fs');
const path = require('path');

function loadEvents() {
  const events = [];
  const eventsPath = path.join(__dirname, '../events');

  // Return empty array if the events directory does not exist
  if (!fs.existsSync(eventsPath)) return events;

  // Read only JavaScript files from the events directory
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    try {
      const eventModule = require(path.join(eventsPath, file));
      events.push(eventModule);
    } catch (err) {
      console.error(`Error loading event file ${file}:`, err);
    }
  }
  return events;
}

module.exports = { loadEvents };
