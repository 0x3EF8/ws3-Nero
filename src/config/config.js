/**
 * Bot Configuration
 * -----------------
 * This module exports the configuration settings for the bot.
 *
 * botName:         The name of the bot.
 * version:         The current version of the bot.
 * admins:          Array of Facebook User IDs that are considered admins.
 *
 * options:         API options for ws3-fca:
 *                    - listenEvents: Enable listening to Facebook events.
 *                    - selfListen:   Process messages sent by the bot itself.
 *                    - randomUserAgent: Use a random User-Agent (set to false here).
 *                    - bypassRegion: Bypass region restrictions (e.g., 'PRN').
 *
 * commandPrefix:   The prefix for user commands. Set to false to disable prefixing.
 * selfPrefix:      The prefix used when the bot sends its own messages.
 *
 * appState:        The saved session state loaded from 'appstate.json'.
 *
 * Adjust these settings as needed.
 */
module.exports = {
  botName: 'Nero',
  version: '1.0.0',

  admins: ['100044343889036', '100025665999358'],

  options: {
    listenEvents: true,
    selfListen: true,
    randomUserAgent: false,
    bypassRegion: 'PRN',
  },

  commandPrefix: false,

  selfPrefix: '$',

  appState: require('./appstate.json'),
};
