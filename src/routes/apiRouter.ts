import { Router } from "express";
import { authRouter } from "./authRoutes";
import { friendsRouter } from "./friendRoutes";
import { restaurantRouter } from "./restaurantRoutes";
import { pollRouter } from "./pollRoutes";

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
 *   - name: Polls
 *     description: Manage polls
 */
router.use("/polls", pollRouter);

/**
 * @swagger
 * tags:
 *   - name: Todo
 *     description: Features come soon
 */

router.get("/version", (req, res) => {
  res.json({ version: process.env.npm_package_version });
});

export { router };
