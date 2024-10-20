import { Router } from "express";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   - name: Debug
 *     description: Initial routes
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Debug]
 *     summary: Welcome message
 *     responses:
 *       200:
 *         description: Welcome to the API
 */
router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

/**
 * @swagger
 * /e:
 *   get:
 *     tags: [Debug]
 *     summary: Test error handling
 *     responses:
 *       200:
 *         description: Try middleware error handling
 */
router.get("/e", (req, res, next) => {
  try {
    throw new Error("Woops");
  } catch (error) {
    next(error);
  }
});

export { router };
