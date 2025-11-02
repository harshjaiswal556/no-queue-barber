const { createLogger, format, transports } = require('winston');
const path = require('path');
const ip = require('ip');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      const serverIp = ip.address();
      return stack
        ? `${timestamp} [${level}] ${message} - ${stack}`
        : `${timestamp} [${level}] ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join('logs', 'combined.log') })
  ],
});

module.exports = logger;
