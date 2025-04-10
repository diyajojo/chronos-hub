const express = require('express');
const cors = require('cors');
require('dotenv').config();
const signup=require('./routes/auth/signup')
const login=require('./routes/auth/login')
const travelLog = require('./routes/database/addlog');
const generateImage = require('./routes/ai/generateimg');
const rateStory = require('./routes/ai/ratelog');
const fetchUserLogs = require('./routes/database/fetchuserlog');

const app = express();
const port = 8000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
//used to accept data from requests under req.body etc
app.use(express.urlencoded({ extended: true }));

//routes
app.post('/auth/signup', signup);
app.post('/auth/login',login);
app.post('/addlog', travelLog);
app.post('/generateAIimage', generateImage);
app.post('/rateStory', rateStory);
app.post('/fetchLogs', fetchUserLogs);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;