const jwt = require('jsonwebtoken');

module.exports.checkAuth = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];

  if (token === 'null') {
    res.status(401).send('Not auth.');
    return;
  }

  try {
    const authToken = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = authToken;
  } catch (err) {
    res.status(403).send('Invalid token.');
    return;
  }

  next();
};
