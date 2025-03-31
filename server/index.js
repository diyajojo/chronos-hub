const express = require('express');
const cors = require('cors');
require('dotenv').config();
const signup=require('./routes/auth/signup')
const login=require('./routes/auth/login')

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(express.json());
//used to accept data from requests under req.body etc
app.use(express.urlencoded({ extended: true }));

//routes
app.post('/auth/signup', signup);
app.post('/auth/login',login);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;