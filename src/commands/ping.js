module.exports = function(api, event, args) {
    api.sendMessage("pong", event.threadID);
  };
  