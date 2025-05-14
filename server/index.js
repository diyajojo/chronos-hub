const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const signup = require('./routes/auth/signup');
const login = require('./routes/auth/login');
const { addLog, fetchUserLogs } = require('./routes/database/logs');
const generateImage = require('./routes/ai/image/generateimg');
const proxyImage = require('./routes/ai/image/utils/proxyimage');
const { addComment, fetchComments } = require('./routes/database/comments');
const { addReaction, fetchReactions } = require('./routes/database/reactions');
const { fetchUserBadges } = require('./routes/database/badges');
const { searchUsers } = require('./routes/database/users');
const { getUser } = require('./routes/database/profilefetch');
const { 
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriendshipStatus,
  getFriends
} = require('./routes/database/friendship');

const app = express();
const port = 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://chronos-hub.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));
app.use(express.json());
//used to accept data from requests under req.body etc
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.post('/auth/signup', signup);
app.post('/auth/login', login);
app.post('/addlog', addLog);
app.post('/fetchLogs', fetchUserLogs);
app.post('/generateAIimage', generateImage);
app.get('/proxy-image', proxyImage);
app.post('/addcomment', addComment);
app.post('/fetchcomments', fetchComments);
app.post('/addreaction', addReaction);
app.post('/fetchreactions', fetchReactions);
app.post('/userbadges', fetchUserBadges);
app.post('/searchUsers', searchUsers);
app.get('/user/:userId', getUser);
app.post('/friendship/send-request', sendFriendRequest);
app.post('/friendship/accept-request', acceptFriendRequest);
app.post('/friendship/reject-request', rejectFriendRequest);
app.post('/friendship/friend-requests', getFriendRequests);
app.post('/friendship/status', getFriendshipStatus);
app.post('/friendship/friends', getFriends);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;