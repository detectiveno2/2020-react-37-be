require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const apiNewfeedsRoute = require('./api/routes/newfeeds.route');
const apiAuthRoute = require('./api/routes/auth.route');
const apiPostRoute = require('./api/routes/post.route');
const apiNotificationsRoute = require('./api/routes/notifications.route');

const authMiddleware = require('./api/middlewares/auth.middleware');

const app = express();
const port = 5400;

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/newfeeds', authMiddleware.checkAuth, apiNewfeedsRoute);
app.use('/api/auth', apiAuthRoute);
app.use('/api/post', authMiddleware.checkAuth, apiPostRoute);
app.use('/api/notifications', authMiddleware.checkAuth, apiNotificationsRoute);

app.get('/', (req, res) => {
  res.send('Gk3 nka');
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}.`);
});
