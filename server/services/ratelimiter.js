const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3 , 
  handler: function (req, res) {
    console.log(`[Rate Limit Hit] Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'GET LOST YOU JOBLESS LUNATIC! STOP SPAMMING MY SERVER 💢\n',
      details: 'Watch out, your IP has been logged and you will be reported for abuse 💢.\n'
    });
  }
});

// Rate limiter for 2 requests per hour
const addLogLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2, // limit each IP to 2 requests
  handler: function (req, res) {
    console.log(`[Strict Rate Limit Hit] Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'GET LOST YOU JOBLESS LUNATIC! STOP SPAMMING MY SERVER 💢\n',
      details: 'Watch out, your IP has been logged and you will be reported for abuse 💢.\n'
    });
  }
});

const passwordLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 2, // limit each IP to 2 requests
  handler: function (req, res) {
    console.log(`[Strict Rate Limit Hit] Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'GET LOST YOU JOBLESS LUNATIC! STOP SPAMMING MY SERVER 💢\n',
      details: 'Watch out, your IP has been logged and you will be reported for abuse 💢.\n'
    });
  }
});

module.exports = { rateLimiter, addLogLimiter ,passwordLimiter }; 