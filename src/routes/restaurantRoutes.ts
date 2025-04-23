import { Router } from "express";
import {
  authMiddleware,
  managerMiddleware,
} from "../middlewares/authMiddleware";
import {
  addRestaurant,
  deleteRestaurant,
  getListOfRestaurants,
  updateRestaurant,
  handleRestaurantSwipe,
  getRestaurantsByManagerId,
  getLikeRestaurants,
  getRestaurantById,
} from "../controllers/restaurantController";
import upload from "../utils/storage";
import { favoriteRouter } from "./favoriteRoutes";

const restaurantRouter = Router();

restaurantRouter.use(authMiddleware);

/**
 * @swagger
 * /restaurants/list:
 *   get:
 *     tags: [Restaurants]
 *     summary: User can get a list of restaurants based on their preferences
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of restaurants the user hasn't swiped yet
 *       400:
 *         description: Missing or invalid userId
 *       500:
 *         description: Server error
 */
restaurantRouter.get("/list", getListOfRestaurants);

/**
 * @swagger
 * /restaurants/swipe:
 *   post:
 *     tags: [Restaurants]
 *     summary: User can swipe right or left on a restaurant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *               - restaurantId
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [like, dislike]
 *                 example: like
 *               restaurantId:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Swipe registered
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Server error
 */
restaurantRouter.post("/swipe", handleRestaurantSwipe);

restaurantRouter.use("/favorites", favoriteRouter);

/**
 * @swagger
 * /restaurants/like:
 *   get:
 *     tags: [Restaurants]
 *     summary: User can get a list of liked restaurants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns liked restaurants
 *       400:
 *         description: Invalid user
 *       500:
 *         description: Server error
 */
restaurantRouter.get("/like", getLikeRestaurants);

/**
 * @swagger
 * /restaurants/one/{id}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get one restaurant by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Returns a restaurant
 *       400:
 *         description: Invalid user or ID
 *       500:
 *         description: Server error
 */
restaurantRouter.get("/one/:id", getRestaurantById);

restaurantRouter.use(managerMiddleware);

/**
 * @swagger
 * /restaurants/manager:
 *   get:
 *     tags: [Restaurants]
 *     summary: Manager can get all of their restaurants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of restaurants managed by the user
 *       400:
 *         description: Invalid user
 *       500:
 *         description: Server error
 */
restaurantRouter.get("/manager", getRestaurantsByManagerId);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     tags: [Restaurants]
 *     summary: Manager can add a restaurant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pirate Burger
 *               description:
 *                 type: string
 *                 example: "Gros burgers et frites maison"
 *               averagePrice:
 *                 type: number
 *                 example: 2
 *               averageService:
 *                 type: number
 *                 example: 1
 *               phoneNumber:
 *                 type: string
 *                 example: "0612345678"
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Restaurant created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
restaurantRouter.post("/", upload.single("thumbnail"), addRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     tags: [Restaurants]
 *     summary: Manager can update one of their restaurants (image optional)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pirate Burger Deluxe
 *               description:
 *                 type: string
 *                 example: "Nouvelle version avec plus de bacon"
 *               averagePrice:
 *                 type: number
 *               averageService:
 *                 type: number
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: "Optional new image for the restaurant"
 *     responses:
 *       200:
 *         description: Restaurant updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Server error
 */
restaurantRouter.put("/:id", upload.single("thumbnail"), updateRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     tags: [Restaurants]
 *     summary: Manager can delete one of their restaurants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Restaurant deleted
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Server error
 */
restaurantRouter.delete("/:id", deleteRestaurant);

export { restaurantRouter };