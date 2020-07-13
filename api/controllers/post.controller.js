const shortid = require('shortid');

const db = require('../../lowdb');

module.exports.uploadPost = (req, res) => {
  const { caption } = req.body;
  const user = req.user;

  let imageUrl = '';

  try {
    imageUrl = `http://localhost:5400/${req.file.path
      .split('/')
      .slice(1)
      .join('/')}`;
  } catch (err) {
    return res.status(500).send('Something wrong, please try again.');
  }

  const post = {
    id: shortid.generate(),
    author: user.userName,
    caption,
    imageUrl,
    likes: [],
    comments: [],
  };

  db.get('posts').unshift(post).write();

  const posts = db.get('posts').value();

  res.json(posts);
};

module.exports.postLike = (req, res) => {
  const { idPost } = req.params;
  const { userName } = req.user;

  // Toggle like.
  let liked;

  const post = db.get('posts').find({ id: idPost }).value();

  if (post.likes.includes(userName)) {
    // Unlike if user has already liked.

    for (let i = 0; i < post.likes.length; i++) {
      if (post.likes[i] === userName) {
        post.likes.splice(i, 1);
        liked = false;
      }
    }
  } else {
    // Like if user has not liked.

    post.likes.push(userName);
    liked = true;
  }
  db.get('posts').write();

  // Generate notification

  if (post.author !== userName) {
    const notification = {
      owner: post.author,
      content: `${userName} liked your photo.`,
      isRead: false,
    };

    db.get('notifications').push(notification).write();
  }

  return res.json({ post, liked });
};

module.exports.postComment = (req, res) => {
  const { idPost } = req.params;
  const { content } = req.body;
  const { userName } = req.user;

  // Generate comment

  const comment = {
    id: shortid.generate(),
    author: userName,
    content,
  };

  const post = db.get('posts').find({ id: idPost }).value();
  post.comments.push(comment);
  db.get('posts').write();

  // Generate notification

  if (post.author !== userName) {
    const notification = {
      owner: post.author,
      content: `${userName} commented about your photo.`,
      isRead: false,
    };

    db.get('notifications').push(notification).write();
  }

  return res.json(post);
};
