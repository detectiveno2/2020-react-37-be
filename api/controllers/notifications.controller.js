const db = require('../../lowdb');

module.exports.index = (req, res) => {
  const { userName } = req.user;
  const notifications = db
    .get('notifications')
    .filter({ owner: userName })
    .value();
  res.json(notifications);
};
