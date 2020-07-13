const shortid = require('shortid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../../lowdb');

module.exports.index = (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];

  if (token === 'null') {
    return res.status(400).send('Not auth.');
  }

  try {
    const authToken = jwt.verify(token, process.env.JWT_TOKEN);
    if (authToken) {
      return res.status(200).send('User is auth.');
    }
  } catch (err) {
    return res.status(403).send('Invalid token.');
  }
};

module.exports.postRegister = async (req, res) => {
  const { email, userName, password, rePassword } = req.body;
  const users = db.get('users').value();

  // Check if user has already existed.
  const existedUser = users.find((user) => user.email === email);
  if (existedUser) {
    return res.status(400).send('Email has already existed.');
  }

  // Check if userName has already existed.
  const existedUserName = users.find((user) => user.userName === userName);
  if (existedUserName) {
    return res.status(400).send('User name has already existed.');
  }

  // Check if password and repassword are not the same
  if (password !== rePassword) {
    return res
      .status(400)
      .send('Password and retype password must be the same.');
  }

  // Hash password
  try {
    const salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(password, salt);
  } catch (err) {
    return res.status(400).send('Have some errors, please try again.');
  }

  // Create new user
  const newUser = {
    id: shortid.generate(),
    email,
    userName,
    password: hashedPassword,
  };

  db.get('users').push(newUser).write();

  // Generate JWT token
  const payload = {
    id: newUser.id,
    email: newUser.email,
    userName: newUser.userName,
  };
  const token = jwt.sign(payload, process.env.JWT_TOKEN);

  res.json(token);
};

module.exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const users = db.get('users').value();

  // Check if user does not existed.
  const authUser = users.find((user) => user.email === email);
  if (!authUser) {
    return res.status(400).send('User does not existed.');
  }

  //Check password.
  const authPassword = await bcrypt.compare(password, authUser.password);
  if (!authPassword) {
    return res.status(400).send('Wrong password, please try again.');
  }

  // Generate JWT token
  const payload = {
    id: authUser.id,
    email: authUser.email,
    userName: authUser.userName,
  };
  const token = jwt.sign(payload, process.env.JWT_TOKEN);

  res.json(token);
};
