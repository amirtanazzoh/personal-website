import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';
import * as moment from 'moment-timezone';

const logDir = path.join(process.cwd(), 'logs');

const filterOnly = (level: string) =>
  winston.format((info) => (info.level === level ? info : false))();

const globalConfig = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

export const winstonLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      const localTime = moment(timestamp as any)
        .tz('Asia/Tehran')
        .format('YYYY-MM-DD HH:mm:ss');
      return `[${localTime}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      ...globalConfig,
      level: 'error',
      filename: `${logDir}/%DATE%/error.log`,
      format: winston.format.combine(filterOnly('error')),
    }),

    new winston.transports.DailyRotateFile({
      ...globalConfig,
      level: 'info',
      filename: `${logDir}/%DATE%/info.log`,
      format: winston.format.combine(filterOnly('info')),
    }),

    new winston.transports.DailyRotateFile({
      ...globalConfig,
      level: 'debug',
      filename: `${logDir}/%DATE%/debug.log`,
      format: winston.format.combine(filterOnly('debug')),
    }),

    new winston.transports.DailyRotateFile({
      ...globalConfig,
      level: 'warn',
      filename: `${logDir}/%DATE%/warn.log`,
      format: winston.format.combine(filterOnly('warn')),
    }),

    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        nestWinstonModuleUtilities.format.nestLike('MyApp', {
          prettyPrint: true,
        }),
      ),
    }),
  ],
});
