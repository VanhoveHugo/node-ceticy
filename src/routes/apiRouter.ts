import { Router } from "express";
import { authRouter } from "./authRoutes";
import { friendsRouter } from "./friendRoutes";
import { restaurantRouter } from "./restaurantRoutes";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication routes
 */
router.use("/auth", authRouter);

/**
 * @swagger
 * tags:
 *   - name: Friends
 *     description: Manage friends
 */
router.use("/friends", friendsRouter);

/**
 * @swagger
 * tags:
 *   - name: Restaurants
 *     description: Manage restaurants
 */
router.use("/restaurants", restaurantRouter);

/**
 * @swagger
 * tags:
 *   - name: Todo
 *     description: Features come soon
 */

export { router };
