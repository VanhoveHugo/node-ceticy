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
  handleRestaurantSwipe,
  getRestaurantsByManagerId,
  getLikeRestaurants,
} from "../controllers/restaurantController";
import upload from "../utils/configMulter";

const restaurantRouter = Router();

restaurantRouter.use(authMiddleware);

/**
 * @swagger
 * /restaurants/list:
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
restaurantRouter.get("/list", getListOfRestaurants);

/**
 * @swagger
 * /restaurants/swipe:
 *   post:
 *     tags: [Restaurants]
 *     summary: Handle a swipe on a restaurant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 example: like
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
restaurantRouter.post("/swipe", handleRestaurantSwipe);

/**
 * @swagger
 * /restaurants/like:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get all restaurants liked by the user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: "{ restaurants }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
restaurantRouter.get("/like", getLikeRestaurants);


// Manager Only

restaurantRouter.use(managerMiddleware);

/**
 * @swagger
 * /restaurants/:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get all restaurants of a manager
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
restaurantRouter.get("/", getRestaurantsByManagerId);

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
 *         multipart/form-data:
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
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: "{ restaurantId }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
restaurantRouter.post("/", upload.single("thumbnail"), addRestaurant);

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
 *                 example: "accept"
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
