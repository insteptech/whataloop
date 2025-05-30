// // src/config/redis.js
// const redis = require("redis");

// const client = redis.createClient({
//   host: process.env.REDIS_HOST || "127.0.0.1",
//   port: process.env.REDIS_PORT || 6379,
// });

// client.on("error", (err) => {
//   console.error("Redis error:", err);
// });

// module.exports = client;


const { createClient } = require('redis');

// You can put the URL or options here
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Only connect ONCE
(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis client connected");
  }
})();

module.exports = redisClient;
