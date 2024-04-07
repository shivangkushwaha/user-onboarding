const winston = require("winston");
const util = require("util");

let level;
if (process.env.NODE_ENV === "production") {
  level = "http";
} else {
  level = "silly";
}

function transform(info) {
  const args = info[Symbol.for("splat")];
  if (args) {
    info.message = util.format(info.message, ...args);
  }
  return info;
}

function utilFormatter() {
  return { transform };
}
const winstonLog = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    utilFormatter(),
    winston.format.colorize(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(
      ({ level, message, label, timestamp, err }) =>
        `${timestamp} ${label || "-"} ${level}: ${message} `
    )
  ),
  transports: [
    new winston.transports.Stream({
      stream: process.stderr,
      level: level,
    }),
  ],
});

module.exports = winstonLog;
