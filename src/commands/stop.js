module.exports = function(api, event, args) {
    api.sendMessage("Shutting down...", event.threadID, () => {
      process.exit(0);
    });
  };
  