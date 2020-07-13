const db = require('../../lowdb');

module.exports.index = (req, res) => {
  const posts = db.get('posts').value();
  const user = req.user;
  res.json({ posts, user });
};
