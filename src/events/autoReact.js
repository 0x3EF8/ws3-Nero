module.exports = {
  name: 'autoReact',
  description: 'Automatically reacts when a message contains "haha"',
  eventTypes: ['message'],

  handler: function (api, event) {
    if (event.body && event.body.toLowerCase().includes('haha')) {
      api.sendMessage('😄', event.threadID);
    }
  },
};
