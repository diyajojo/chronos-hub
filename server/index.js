const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const signup = require('./routes/auth/signup');
const login = require('./routes/auth/login');
const { addLog, fetchUserLogs } = require('./routes/database/logs');
const { addComment, fetchComments } = require('./routes/database/comments');
const { addReaction, fetchReactions } = require('./routes/database/reactions');
const { fetchUserBadges } = require('./routes/database/badges');
const { searchUsers, getAllUsers } = require('./routes/database/users');
const { getUser } = require('./routes/database/profilefetch');
const { 
  handleSendRequest,
  handleAcceptRequest,
  handleRejectRequest,
  handleGetFriendRequests,
  handleGetFriendshipStatus,
  handleGetFriends
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
app.post('/addcomment', addComment);
app.post('/fetchcomments', fetchComments);
app.post('/addreaction', addReaction);
app.post('/fetchreactions', fetchReactions);
app.post('/userbadges', fetchUserBadges);
app.post('/searchUsers', searchUsers);
app.get('/users', getAllUsers);
app.get('/user/:userId', getUser);

// Simplified friendship routes
app.post('/friendship/send-request', handleSendRequest);
app.post('/friendship/accept-request', handleAcceptRequest);
app.post('/friendship/reject-request', handleRejectRequest);
app.post('/friendship/friend-requests', handleGetFriendRequests);
app.post('/friendship/status', handleGetFriendshipStatus);
app.post('/friendship/friends', handleGetFriends);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;