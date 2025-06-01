const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const signup = require('./routes/auth/signup');
const verifyOTP = require('./services/verifyOTP');
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
const {rateLimiter, addLogLimiter, passwordLimiter } = require('./services/ratelimiter');



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
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); //used to accept data from requests under req.body etc






//routes
app.post('/auth/signup', rateLimiter, signup);
app.post('/auth/verify-otp', verifyOTP);
app.post('/auth/login', rateLimiter, login);
app.post('/addlog',addLogLimiter, addLog);
app.post('/fetchLogs', fetchUserLogs);
app.post('/addcomment',rateLimiter,addComment);
app.post('/fetchcomments', fetchComments);
app.post('/addreaction',rateLimiter, addReaction);
app.post('/fetchreactions', fetchReactions);
app.post('/userbadges', fetchUserBadges);
app.post('/searchUsers', searchUsers);
app.post('/friendship/send-request', rateLimiter,handleSendRequest);
app.post('/friendship/accept-request', rateLimiter, handleAcceptRequest);
app.post('/friendship/reject-request',rateLimiter, handleRejectRequest);
app.post('/friendship/friend-requests', handleGetFriendRequests);
app.post('/friendship/status', handleGetFriendshipStatus);
app.post('/friendship/friends', handleGetFriends);
app.post('/auth/forgot-password', passwordLimiter ,forgotPassword);
app.post('/auth/reset-password', passwordLimiter , resetPassword);
app.post('/upload-from-url', uploadImageFromUrl);

app.get('/users', getAllUsers);
app.get('/user/:userId', getUser);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;