import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./authRoutes";
import { friendsRouter } from "./friendRoutes";
import { restaurantRouter } from "./restaurantRoutes";
import { pollRouter } from "./pollRoutes";
import { swaggerDocs } from "../utils/configSwagger";

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

// Display the Swagger documentation in development
if (process.env.NODE_ENV === "development") {
  router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

export { router };
