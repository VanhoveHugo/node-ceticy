import { Router } from "express";

const router: Router = Router();

// Welcome message
router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Try middleware Error
router.get("/e", (req, res, next) => {
  try {
    throw new Error("Woops");
  } catch (error) {
    next(error);
  }
});

export { router };
