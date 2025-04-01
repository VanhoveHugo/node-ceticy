import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: "Too many requests, please try again later.",
});
