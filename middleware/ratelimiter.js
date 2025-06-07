// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const redisClient = require('../utils/redisClient');

// Factory to create limiter
const createRoleRateLimiter = (maxRequests, windowMs = 60 * 1000) =>
  rateLimit({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    keyGenerator: (req) => req.user?.id || req.ip,
    handler: (req, res) => {
      res.status(429).json({
        message: 'Too many requests. Please try again later.',
      });
    },
  });

// Define limiters per role
const rateLimiters = {
  admin: createRoleRateLimiter(1000),
  nurse: createRoleRateLimiter(100),
  guest: createRoleRateLimiter(10),
};

// Middleware function
const rateLimiterMiddleware = (req, res, next) => {
  const EMERGENCY_TOKEN = process.env.EMERGENCY_BYPASS;

  if (req.headers['x-emergency-token'] === EMERGENCY_TOKEN) {
    return next();
  }

  const role = req.user?.role || 'guest';

  if (role === 'admin') return rateLimiters.admin(req, res, next);
  if (role === 'nurse') return rateLimiters.nurse(req, res, next);

  return rateLimiters.guest(req, res, next);
};

module.exports = rateLimiterMiddleware;
