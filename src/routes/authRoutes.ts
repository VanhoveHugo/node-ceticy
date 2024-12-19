import { Router } from "express";
import {
  authLogin,
  authRegister,
  authAccount,
} from "../controllers/authController";

const authRouter: Router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user or manager
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
 *               scope:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: "{ email }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
authRouter.post("/signup", authRegister);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     tags: [Auth]
 *     summary: Login a existing user or manager
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
 *               scope:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: "{ token }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
authRouter.post("/signin", authLogin);

/**
 * @swagger
 * /auth/account:
 *   get:
 *     tags: [Auth]
 *     summary: Show account information
*     responses:
 *       201:
 *         description: "{ user or manager }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
authRouter.get("/account", authAccount);


export { authRouter };
