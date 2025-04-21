import request from "supertest";
import express from "express";

const infoMock = jest.fn();
const errorMock = jest.fn();
const ORIGINAL_ENV = process.env;

jest.mock("@/utils/logger", () => ({
  configureLogger: () => ({
    info: infoMock,
    error: errorMock,
  }),
}));

jest.mock("@/utils/connectionDatabase", () => ({
  connection: true,
}));

describe("app.ts", () => {
  let app: express.Express;

  beforeEach(() => {
    jest.resetModules();
    app = require("@/app").app;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("should log incoming requests", async () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("fr-FR");
    const formattedTime = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const expectedLog = `Request: [${formattedDate} à ${formattedTime}] GET /`;
    await request(app).get("/").expect(404);
    expect(infoMock).toHaveBeenCalledWith(expectedLog);
  });

  it("should not use router when connection is undefined", () => {
    jest.resetModules();
    jest.doMock("@/utils/connectionDatabase", () => ({
      connection: null,
    }));

    const freshApp = require("@/app").app;
    return request(freshApp).get("/").expect(404);
  });

  it("should parse URL-encoded and JSON bodies", async () => {
    const res = await request(app).get("/test");

    expect(res.status).toBe(200);
    expect(JSON.parse(res.text)).toEqual({ message: "router" });
  });

  it("should not expose /test endpoint in production", async () => {
    process.env.NODE_ENV = "production";
    jest.resetModules();
    const prodApp = require("@/app").app;
    const res = await request(prodApp).get("/test");
    expect(res.status).toBe(404);
  });
});
