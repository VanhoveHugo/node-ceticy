import winston from "winston";

export const configureLogger = () => {
  return winston.createLogger({
    level: "info", // Niveau minimum de log
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "logs/api.log",
        level: "info",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
    ],
  });
};
