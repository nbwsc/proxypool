const redis = require("promise-redis")();
const redisClient = redis.createClient();

module.exports = {
    db: redisClient,
    HashTableName: "ProxyHashTable"
};
