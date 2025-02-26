/**
 * Event: welcome (For Testing)
 * --------------
 * Sends a welcome message when a new participant joins a chat.
 *
 * Trigger: "event" and "log:subscribe" events.
 *
 * Example:
 *   When a new user joins, the bot sends "Welcome to the chat, [Name]!".
 */
module.exports = {
  name: 'welcome',
  description: 'Sends a welcome message when a new user joins the chat.',
  eventTypes: ['event', 'log:subscribe'],
  handler: function (api, event) {
    if (
      event.logMessageType === 'log:subscribe' &&
      event.logMessageData &&
      Array.isArray(event.logMessageData.addedParticipants)
    ) {
      event.logMessageData.addedParticipants.forEach(function (participant) {
        const name = participant.fullName || participant.name || 'new member';
        api.sendMessage(`Welcome to the chat, ${name}!`, event.threadID);
      });
    }
  },
};
