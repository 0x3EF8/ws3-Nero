/**
 * Event: autoReact (For Testing)
 * ----------------
 * Automatically send an emoji when a message contains the text "haha".
 *
 * Trigger: "message" events.
 *
 * Example:
 *   If a user sends "haha that's funny", the bot responds with a 😄 emoji.
 */
module.exports = {
  name: 'autoReact',
  description: 'Automatically reacts when a message contains "haha".',
  eventTypes: ['message'],
  handler: function (api, event) {
    if (event.body && event.body.toLowerCase().includes('haha')) {
      api.sendMessage('😄', event.threadID);
    }
  },
};
