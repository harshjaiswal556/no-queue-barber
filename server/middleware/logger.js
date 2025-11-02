const morgan = require('morgan');
const ip = require('ip');

const logger = require('../utils/winston');

morgan.token('server-ip', () => ip.address());

const httpLogger = morgan(
  '[server-ip: :server-ip] :method :url :status :res[content-length] - :response-time ms',
  { stream: { write: (msg) => logger.info(msg.trim()) } }
);

module.exports = httpLogger;
