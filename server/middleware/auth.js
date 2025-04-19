const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// this is a middleware function that checks if the user is authenticated
// it checks for the token in the request headers and verifies it
const authenticateToken = (req, res, next) => {
  try {
    // extracting token from cookie 
    const token = req.cookies.token;  // got it from cookie-parser middleware
     //checking if token is present 
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
     // verifing the token using jwt and decoded has the payload initially given while creating the token
    const decoded = jwt.verify(token, JWT_SECRET);
    // attaches the decoded user information to the request object , which can be accessed later 
    req.user = decoded;

    // procees to the next route after successful verification
    // this is important to call next() to move to the next middleware or route handler
    // if next() is not called, the request will hang and not proceed
    next();
  } 
  catch (error) 
  {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };
