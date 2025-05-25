const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
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
const { forgotPassword } = require('./routes/auth/password/forgot');
const  { resetPassword }= require('./routes/auth/password/reset');
const uploadImageFromUrl = require('./routes/uploadimage');

const app = express();
const port = 8000;

// Middleware
const allowedOrigins = ['http://localhost:3000', 'https://chronos-hub.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
//used to accept data from requests under req.body etc
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



const signupLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // limit each IP to 3 requests
  handler: function (req, res) {
    res.status(429).json({
      error: 'Too many signup attempts. Please try again in 10 minutes.'
    });
  }
});


//routes
app.post('/auth/signup', signupLimiter, signup);
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
app.post('/auth/forgot-password', forgotPassword);
app.post('/auth/reset-password', resetPassword);

app.post('/upload-from-url', uploadImageFromUrl);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;