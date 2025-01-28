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
 */
router.use("/auth", authRouter);

/**
 * @swagger
 * tags:
 *   - name: Friends
 */
router.use("/friends", friendsRouter);

/**
 * @swagger
 * tags:
 *   - name: Restaurants
 */
router.use("/restaurants", restaurantRouter);


/**
 * @swagger
 * tags:
 *   - name: Polls
 */
router.use("/polls", pollRouter);

/**
 * @swagger
 * tags:
 *   - name: Todo
 */

router.get("/version", (req, res) => {
  res.json({ version: process.env.npm_package_version });
});

export { router };
