/**
 * Command: uid
 * ------------
 * Description: Retrieves and displays the Facebook User ID of the sender.
 * Usage: uid
 *
 * Example:
 *   uid
 */
module.exports = {
  name: 'uid',
  description: 'Get your Facebook User ID.',
  category: 'user',
  usage: 'uid',
  run: function (api, event, args) {
    const facebookUid = event.senderID;
    api.sendMessage(`Your Facebook UID is: ${facebookUid}`, event.threadID);
  },
};
