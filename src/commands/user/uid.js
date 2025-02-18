module.exports = {
  name: 'uid',
  description: 'Get your Facebook User ID',
  category: 'user',

  run: function (api, event, args) {
    const facebookUid = event.senderID;
    api.sendMessage(`Your Facebook UID is: ${facebookUid}`, event.threadID);
  },
};
