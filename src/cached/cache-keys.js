const cacheKeys = {
  user: (userId) => `user:${userId}`,
  account: (accountId) => `acc:${accountId}`,
};

module.exports = { cacheKeys };
