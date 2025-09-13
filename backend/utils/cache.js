const NodeCache = require('node-cache');

// Create cache instance with 5 minute TTL
const cache = new NodeCache({ stdTTL: 300 });

const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data) {
      cache.set(key, data, duration);
      return originalJson.call(this, data);
    };
    
    next();
  };
};

module.exports = { cache, cacheMiddleware };