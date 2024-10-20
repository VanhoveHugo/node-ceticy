import { Router } from "express";
import { authLogin, authSignup } from "../controllers/authController";

const authRouter: Router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     responses:
 *       200:
 *         description: Try middleware error handling
 */
authRouter.post("/signup", authSignup);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     responses:
 *       200:
 *         description: Try middleware error handling
 */
authRouter.post("/signin", authLogin);

export { authRouter };
