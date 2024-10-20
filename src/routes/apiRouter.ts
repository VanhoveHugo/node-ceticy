import { Router } from "express";
import { authRouter } from "./authRoutes";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication routes
 */
router.use("/auth", authRouter);

export { router };
