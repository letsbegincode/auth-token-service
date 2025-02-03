const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost', // Default to localhost if not set in .env
  port: process.env.REDIS_PORT || 3000,       // Default to port 6379 if not set in .env
  password: process.env.REDIS_PASSWORD || '', // If your Redis server requires authentication
});

// Error handling for Redis client
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Redis client connection
redisClient.connect()
  .then(() => console.log('✅ Connected to Redis'))
  .catch((err) => console.error('❌ Redis connection error:', err));

module.exports = redisClient;
