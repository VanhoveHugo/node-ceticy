import { Router } from "express";
import {
  authMiddleware,
  managerMiddleware,
} from "../middleware/authMiddleware";
import {
  addRestaurant,
  deleteRestaurant,
  getListOfRestaurants,
  updateRestaurant,
} from "../controllers/restaurantController";

const restaurantRouter = Router();

restaurantRouter.use(authMiddleware);

/**
 * @swagger
 * /restaurants/:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get a selection of restaurants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200  :
 *         description: "{ list of restaurants }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
restaurantRouter.get("/", getListOfRestaurants);

// Manager Only

restaurantRouter.use(managerMiddleware);

/**
 * @swagger
 * /restaurants/:
 *   post:
 *     tags: [Restaurants]
 *     summary: Create a restaurant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pirate Burger
 *               description:
 *                 type: string
 *                 example: "description"
 *               averagePrice:
 *                 type: number
 *                 format: number
 *                 example: 2
 *               averageService:
 *                 type: number
 *                 format: number
 *                 example: 1
 *               phoneNumber:
 *                 type: number
 *                 format: number
 *                 example: "0612345678"
 *     responses:
 *       201:
 *         description: "{ restaurant }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
restaurantRouter.post("/", addRestaurant);

/**
 * @swagger
 * /restaurants/:
 *   put:
 *     tags: [Todo]
 *     summary: Manager can update their restaurant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: number
 *                 format: number
 *                 example: 1
 *               status:
 *                 type: string
 *                 format: string
 *                 example: "accepted"
 *     responses:
 *       201:
 *         description: "{ success }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
restaurantRouter.put("/", updateRestaurant);

/**
 * @swagger
 * /restaurants/:
 *   delete:
 *     tags: [Todo]
 *     summary: Manager can delete their restaurant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: number
 *                 format: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: "{ success }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
restaurantRouter.delete("/", deleteRestaurant);

export { restaurantRouter };
