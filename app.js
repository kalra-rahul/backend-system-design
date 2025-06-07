// /app.js
const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const connectDB = require('./config/db');
// const { verifyToken, emergencyBypass } = require('./middleware/auth');
// const rateLimit = require('express-rate-limit');
// const RedisStore = require('rate-limit-redis').default;
// const { createClient } = require('redis');

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(express.json());

// // Redis client for distributed rate limiting
// const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });
// redisClient.on('connect', () => {
//   console.log('✅ Redis connected successfully');
// });
// redisClient.connect().catch(console.error);

// // Factory function for creating rate limiters based on role & limits
// const createRoleRateLimiter = (maxRequests, windowMs = 60 * 1000) =>
// rateLimit({
//     windowMs,
//     max: maxRequests,
//     standardHeaders: true,
//     legacyHeaders: false,
//     store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//     }),
//     keyGenerator: (req) => req.user?.id || req.ip,
//     handler: (req, res) => {
//     res.status(429).json({
//         message: 'Too many requests. Please try again later.',
//     });
//     },
// });
// // Define rate limiters per role and API group
// const rateLimiters = {
//   admin: createRoleRateLimiter(10), // 1000 req/min
//   nurse: createRoleRateLimiter(1),  // 100 req/min
//   guest: createRoleRateLimiter(1),   // 10 req/min
// };

// // Middleware to apply rate limits based on user role
// const rateLimiterMiddleware = (req, res, next) => {
//   // Skip if emergency bypass present
//   if (req.headers['x-emergency-token'] === process.env.EMERGENCY_BYPASS) {
//     return next();
//   }

//   const role = req.user?.role || 'guest';

//   // Admin bypass unlimited or highest limit
//   if (role === 'admin') return rateLimiters.admin(req, res, next);
//   if (role === 'nurse') return rateLimiters.nurse(req, res, next);
//   // guests or unknown users get guest limits
//   return rateLimiters.guest(req, res, next);
// };


// Routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));