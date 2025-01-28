import { Router } from "express";
import {
  addFavoriteRestaurant,
  deleteFavoriteRestaurant,
  getFavoriteRestaurants,
} from "../controllers/restaurantController";
const favoriteRouter = Router();

/**
 * @swagger
 * /restaurants/favorites:
 *   get:
 *     tags: [Restaurants]
 *     summary: User can get a list of their favorite restaurants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "{ success }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
favoriteRouter.get("/", getFavoriteRestaurants);

/**
 * @swagger
 * /restaurants/favorites:
 *   post:
 *     tags: [Restaurants]
 *     summary: User can favorite a restaurant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurantId:
 *                 type: string
 *                 example: 10
 *     responses:
 *       201:
 *         description: "{ success }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
favoriteRouter.post("/", addFavoriteRestaurant);

/**
 * @swagger
 * /restaurants/favorites:
 *   delete:
 *     tags: [Restaurants]
 *     summary: User can unfavorite a restaurant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurantId:
 *                 type: string
 *                 example: 10
 *     responses:
 *       200:
 *         description: "{ success }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
favoriteRouter.delete("/", deleteFavoriteRestaurant);

export { favoriteRouter };
