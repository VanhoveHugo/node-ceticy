import { jest } from "@jest/globals";

const errorMock = jest.fn();
const infoMock = jest.fn();

jest.mock("@/utils/logger", () => ({
  configureLogger: () => ({
    info: infoMock,
    error: errorMock,
  }),
}));

let createConnectionMock: jest.Mock;
let connectCallback: Function;
let errorCallback: Function;
let pingCallback: Function;

beforeEach(() => {
  jest.resetModules();
  jest.useFakeTimers();
  errorMock.mockReset();
  infoMock.mockReset();

  connectCallback = () => {};
  errorCallback = () => {};
  pingCallback = () => {};

  createConnectionMock = jest.fn().mockReturnValue({
    connect: (cb: Function) => (connectCallback = cb),
    on: (event: string, cb: Function) => {
      if (event === "error") errorCallback = cb;
    },
    ping: (cb: Function) => (pingCallback = cb),
  });

  jest.doMock("mysql2", () => ({
    createConnection: createConnectionMock,
  }));
});

describe("connectionDatabase.ts", () => {
  it("should not call connectWithRetry in test env", () => {
    require("@/utils/connectionDatabase");
    expect(createConnectionMock).not.toHaveBeenCalled();
  });

it("should log error if required env vars are missing", () => {
  process.env.MYSQL_HOST = "";
  process.env.NODE_ENV = "dev";

  require("@/utils/connectionDatabase");

  expect(errorMock).toHaveBeenCalledWith(
    "[API] Missing required database environment variables."
  );
  expect(createConnectionMock).not.toHaveBeenCalled();
});

  it("should log error on connection failure and retry", () => {
    process.env.NODE_ENV = "dev";
    process.env.MYSQL_HOST = "localhost";
    process.env.MYSQL_USER = "root";
    process.env.MYSQL_PASSWORD = "pass";
    process.env.MYSQL_NAME = "test";

    require("@/utils/connectionDatabase");

    connectCallback({ code: "ECONNREFUSED", message: "fail" });

    expect(errorMock).toHaveBeenCalledWith("[API].connect : ", {
      code: "ECONNREFUSED",
      message: "fail",
    });

    jest.advanceTimersByTime(10000);
  });

  it("should log info on successful connection and start keepAlive", () => {
    process.env.NODE_ENV = "dev";
    process.env.MYSQL_HOST = "localhost";
    process.env.MYSQL_USER = "root";
    process.env.MYSQL_PASSWORD = "pass";
    process.env.MYSQL_NAME = "test";

    require("@/utils/connectionDatabase");

    connectCallback(null);

    expect(infoMock).toHaveBeenCalledWith("[API] Connected to MySQL");

    jest.advanceTimersByTime(30000);
    pingCallback(null);
    expect(errorMock).not.toHaveBeenCalledWith(
      expect.stringContaining("Ping error")
    );
  });

  it("should log and retry if ping fails", () => {
    process.env.NODE_ENV = "dev";
    process.env.MYSQL_HOST = "localhost";
    process.env.MYSQL_USER = "root";
    process.env.MYSQL_PASSWORD = "pass";
    process.env.MYSQL_NAME = "test";

    require("@/utils/connectionDatabase");

    connectCallback(null);
    jest.advanceTimersByTime(30000);

    pingCallback({ message: "ping failed" });

    expect(errorMock).toHaveBeenCalledWith("[API] Ping error: ", {
      message: "ping failed",
    });

    jest.advanceTimersByTime(10000);
  });

  it("should handle connection.on('error') and retry", () => {
    process.env.NODE_ENV = "dev";
    process.env.MYSQL_HOST = "localhost";
    process.env.MYSQL_USER = "root";
    process.env.MYSQL_PASSWORD = "pass";
    process.env.MYSQL_NAME = "test";

    require("@/utils/connectionDatabase");

    errorCallback({ code: "CONN_ERR", message: "Connection error" });

    expect(errorMock).toHaveBeenCalledWith("[API].on('error') : ", {
      code: "CONN_ERR",
      message: "Connection error",
    });

    jest.advanceTimersByTime(10000);
  });
});
