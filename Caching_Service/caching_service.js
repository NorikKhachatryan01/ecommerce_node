const redis = require('redis');
const client = redis.createClient();

function cache(key, value) {
  client.set(key, JSON.stringify(value));
}

function getCache(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        reject(err);
      } else if (data) {
        resolve(JSON.parse(data));
      } else {
        resolve(null);
      }
    });
  });
}

function clearCache(key) {
  client.del(key);
}

module.exports = { cache, getCache, clearCache };
