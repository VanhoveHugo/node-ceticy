import request from "supertest";
import express from "express";
import { rateLimiter } from "@/conf/limiter";

describe("rateLimiter middleware", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(rateLimiter);
    app.get("/", (req, res) => res.send("OK"));
  });

  it("should allow requests under the limit", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");
  });

  it("should block requests over the limit", async () => {
    // Simuler 50 requêtes
    for (let i = 0; i < 50; i++) {
      await request(app).get("/");
    }

    const res = await request(app).get("/");
    expect(res.status).toBe(429);
    expect(res.text).toBe("Too many requests, please try again later.");
  });
});
