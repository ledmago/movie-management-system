export const configuration = () => ({
  privateKey: process.env.PRIVATE_KEY || 'secretKey002',
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/movieapp',
    retryAttempts: 10,
  },
  rabbitmq: {
    uri: process.env.RABBIT_URL || 'amqp://guest:guest@127.0.0.1:5672',
  },
  redis: {
    type: 'single',
    url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
  },
});
