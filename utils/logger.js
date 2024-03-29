const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    // winston.format.colorize(),
    winston.format.json()
  ),
  defaultMeta: { service: 'badging-program' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: `${__dirname}/../logs/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${__dirname}/../logs/debug.log`, level: 'debug' }),
    new winston.transports.File({ filename: `${__dirname}/../logs/info.log` }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple())
  }));
}


module.exports = logger