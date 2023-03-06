// @ts-ignore
import { createLogger, format, transports } from './../../node_modules/winston';
/*import createLogger = require('winston');
import format = require('winston');
import transports = require('winston');*/
import * as path from 'path';

// @ts-ignore
const winstonlogger = createLogger({
    level: 'info',
    // @ts-ignore
    format: format.combine(
        // format.colorize({all: false}),
        // @ts-ignore
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        // @ts-ignore
        format.errors({ stack: true }),
        // @ts-ignore
        format.splat(),
        // @ts-ignore
        format.json()
    ),
    defaultMeta: { service: 'SOAS' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `quick-start-combined.log`.
        // - Write all logs error (and below) to `quick-start-error.log`.
        //
        // @ts-ignore
        new transports.File({ filename: path.join(__dirname, '../../logs/app-log-errors.log'), level: 'error' }),
        // new transports.File({ filename: path.join(__dirname, '../../logs/app-log-warnings.log'), level: 'warn' }),
        // @ts-ignore
        new transports.File({ filename: path.join(__dirname, '../../logs/app-log-combined.log') })
    ]
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    winstonlogger.add(new transports.Console({
        // @ts-ignore
        format: format.combine(
            // format.colorize(),
            // @ts-ignore
            format.json()
        )
    }));
}

module.exports = winstonlogger;
module.exports.stream = {
    write: function (message: any, encoding: any) {
        // use the 'info' log  level so the output will be picked up by both transports
        // (file and console)
        winstonlogger.info(message)
    }
}
