const fs = require('fs');
const path = require('path');

function loadEvents() {
  const events = [];
  const eventsPath = path.join(__dirname, '../events');
  const files = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));

  files.forEach((file) => {
    const eventModule = require(path.join(eventsPath, file));
    events.push(eventModule);
  });
  return events;
}

module.exports = { loadEvents };
