import { createLogger, format, transports } from 'winston';

// Define custom log formats
const { combine, timestamp, printf, colorize } = format;

// Custom format for console logs
const consoleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger instance
const logger = createLogger({
  level: 'info', // Default log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamps
    colorize(), // Add color to logs (for console output)
    consoleFormat // Apply custom format
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({
      filename: 'logs/app.log', // Log to a file
      level: 'info', // File logging level
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`)
      ),
    }),
  ],
});

// Export the logger instance
export default logger;
