import winston from "winston";
import { configureLogger } from "@/utils/logger"; // adapte le chemin si besoin

describe("configureLogger", () => {
  it("should return a winston Logger instance", () => {
    const logger = configureLogger();
    expect(logger).toBeInstanceOf(winston.Logger);
  });

  it("should include Console transport", () => {
    const logger = configureLogger();
    const hasConsole = logger.transports.some(
      (t) => t instanceof winston.transports.Console
    );
    expect(hasConsole).toBe(true);
  });

  it("should include File transport with filename 'logs/api.log'", () => {
    const logger = configureLogger();
    const fileTransport = logger.transports.find(
      (t) => t instanceof winston.transports.File
    );

    expect(fileTransport).toBeDefined();
    expect(
      (fileTransport as winston.transports.FileTransportOptions).dirname
    ).toBe("logs");
    expect(
      (fileTransport as winston.transports.FileTransportOptions).filename
    ).toBe("api.log");
  });
});
