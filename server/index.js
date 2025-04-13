const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const signup=require('./routes/auth/signup')
const login=require('./routes/auth/login')
const travelLog = require('./routes/database/addlog');
const generateImage = require('./routes/ai/image/generateimg');
const fetchUserLogs = require('./routes/database/fetchuserlog');
const proxyImage = require('./routes/ai/image/utils/proxyimage');

const app = express();
const port = 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));
app.use(express.json());
//used to accept data from requests under req.body etc
app.use(express.urlencoded({ extended: true }));

//routes
app.post('/auth/signup', signup);
app.post('/auth/login',login);
app.post('/addlog', travelLog);
app.post('/generateAIimage', generateImage);
app.post('/fetchLogs', fetchUserLogs);
app.get('/proxy-image', proxyImage);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;