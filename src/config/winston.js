const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new DailyRotateFile({
            filename: 'logs/info-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
        }),
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error'
        }),
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

module.exports = logger