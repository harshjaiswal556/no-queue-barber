// middleware/httpLogger.js
const morgan = require('morgan');
const logger = require('../utils/winston');

const httpLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream: { write: (msg) => logger.info(msg.trim()) } }
);

module.exports = httpLogger;
