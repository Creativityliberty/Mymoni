/**
 * Structured logging utility
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

function log(level: LogLevel, message: string, context?: Record<string, any>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };

  const output = JSON.stringify(entry);

  switch (level) {
    case "error":
      console.error(output);
      break;
    case "warn":
      console.warn(output);
      break;
    case "debug":
      if (process.env.NODE_ENV === "development") {
        console.debug(output);
      }
      break;
    default:
      console.log(output);
  }
}

export const logger = {
  info: (message: string, context?: Record<string, any>) =>
    log("info", message, context),
  warn: (message: string, context?: Record<string, any>) =>
    log("warn", message, context),
  error: (message: string, context?: Record<string, any>) =>
    log("error", message, context),
  debug: (message: string, context?: Record<string, any>) =>
    log("debug", message, context),
};
