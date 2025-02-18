module.exports = {
    name: 'post',
    description: 'Create a post on your Facebook feed',
    category: 'user',
    usage: 'post <message>',
  
    run: function(api, event, args) {
      if (!args || args.length === 0) {
        return api.sendMessage('Please provide a message for your post.', event.threadID,
        );
      }
  
      const postMessage = args.join(' ');
  
      api.createPost(postMessage)
        .then(result => {
          if (result && result.id) {
            api.sendMessage(
              `Post created successfully! Post ID: ${result.id}`,
              event.threadID,
            );
          } else {
            api.sendMessage(
              'Failed to create the post. Please try again.',
              event.threadID,
            );
          }
        })
        .catch(error => {
          console.error('Error creating post:', error);
        });
    },
  };