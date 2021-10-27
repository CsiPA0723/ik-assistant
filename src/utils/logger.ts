import { createLogger, format, transports } from "winston";

const jsonLogFileFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.json()
);

const logger = createLogger({
  level: "info",
  format: jsonLogFileFormat,
  transports: [
    new transports.File({ filename: "error.log", level: "error", handleExceptions: true }),
    new transports.File({ filename: "combined.log", handleExceptions: true }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  const myFormat = format.printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `\x1b[36m${timestamp}\x1b[0m [${level}] : ${message}`;
    if (stack) msg += `\n${stack}`;
    if (metadata[Object.keys(metadata)[0]] !== undefined) msg += ` ${JSON.stringify(metadata)}`;
    return msg;
  });

  logger.add(
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        format.colorize(),
        myFormat
      ),
      handleExceptions: true,
      stderrLevels: ["error"],
      consoleWarnLevels: ["warn"],
    })
  );
}

export default logger;
