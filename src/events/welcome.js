module.exports = {
  name: 'welcome',
  description: 'Sends a welcome message when a new user joins the chat',
  eventTypes: ['event', 'log:subscribe'],

  handler: function (api, event) {
    if (
      event.logMessageType === 'log:subscribe' &&
      event.logMessageData &&
      Array.isArray(event.logMessageData.addedParticipants)
    ) {
      event.logMessageData.addedParticipants.forEach((participant) => {
        const name = participant.fullName || participant.name || 'new member';
        api.sendMessage(`Welcome to the chat, ${name}!`, event.threadID);
      });
    }
  },
};
