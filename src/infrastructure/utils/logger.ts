import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, ...meta }) => {
  let formattedMessage = message;

  if(meta[Symbol.for('splat')]) {
    const args: any[] = meta[Symbol.for('splat')] as any;
    const formattedArgs = args.map(arg => Buffer.isBuffer(arg) ? `Buffer(${arg.toString('hex')})` : arg);
    console.log(formattedArgs);
    formattedMessage += ` ${formattedArgs.join(' ')}`;
  }

  return `[${timestamp}] ${level}: ${formattedMessage}`;
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  level: 'debug',
});

export default logger;
