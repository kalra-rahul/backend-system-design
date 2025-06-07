// utils/redisClient.js
const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.connect().catch(console.error);

module.exports = redisClient;
