import { Router } from "express";
import { authLogin, authRegister } from "../controllers/authController";

const customerRouter: Router = Router();

/**
 * @swagger
 * /auth/users/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Add a new user to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: hugo
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Hugo123#
 *     responses:
 *       201:
 *         description: "{ user }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 */
customerRouter.post("/signup", authRegister);

/**
 * @swagger
 * /auth/users/signin:
 *   post:
 *     tags: [Auth]
 *     summary: Login a existing user
 *     description: Login a user and return a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Hugo123#
 *     responses:
 *       201:
 *         description: "{ token }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 */
customerRouter.post("/signin", authLogin);

export { customerRouter };
