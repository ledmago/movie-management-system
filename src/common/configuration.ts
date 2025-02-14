export const configuration = () => ({
  privateKey: process.env.PRIVATE_KEY || 'secretKey00009',
  database: {
    uri: process.env.DB_URL || 'mongodb://localhost:27017/adminPanel2',
    retryAttempts: 10,
  },
  rabbitmq: {
    uri: process.env.RABBIT_URL || 'amqp://guest:guest@127.0.0.1:5672',
  },
  redis: {
    type: 'single',
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
});
