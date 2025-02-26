/**
 * Command: post (BETA)
 * ---------------------
 * Description: Create a post on your Facebook feed.
 *              This command sends your message to Facebook to create a post and returns the post URL.
 * Usage: post <message>
 *
 * Example:
 *   post Hello, world!
 */
module.exports = {
  name: 'post',
  description: 'Create a post on your Facebook feed.',
  category: 'admin',
  usage: 'post <message>',
  run: function (api, event, args) {
    if (!args || args.length === 0) {
      return api.sendMessage(
        'Please provide a message for your post.',
        event.threadID,
      );
    }
    const postMessage = args.join(' ');
    api
      .createPost({ body: postMessage })
      .then((url) => {
        if (url) {
          return api.sendMessage(
            `Post created successfully!\nPost URL: ${url}`,
            event.threadID,
          );
        } else {
          return api.sendMessage(
            'Post created, but no URL was returned.',
            event.threadID,
          );
        }
      })
      .catch((error) => {
        if (
          error &&
          error.data &&
          error.data.story_create &&
          error.data.story_create.story &&
          error.data.story_create.story.url
        ) {
          return api.sendMessage(
            `Post created successfully!\nPost URL: ${error.data.story_create.story.url}\n(Note: Post created with server warnings)`,
            event.threadID,
          );
        }
        let errorMessage = 'An unknown error occurred.';
        if (
          error &&
          error.errors &&
          Array.isArray(error.errors) &&
          error.errors.length > 0
        ) {
          errorMessage = error.errors.map((e) => e.message).join(' ');
        } else if (error.message) {
          errorMessage = error.message;
        }
        return api.sendMessage(
          `Error creating post: ${errorMessage}`,
          event.threadID,
        );
      });
  },
};
