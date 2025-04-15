import { Router } from "express";
import {
  addFriendRequest,
  deleteFriendRequest,
  getFriendRequests,
  getFriends,
  updateFriendRequest,
} from "../controllers/friendController";
import { authMiddleware } from "../middlewares/authMiddleware";

const friendsRouter = Router();

friendsRouter.use(authMiddleware);

/**
 * @swagger
 * /friends/:
 *   get:
 *     tags: [Friends]
 *     summary: Get all friends of the user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200  :
 *         description: "{ friends }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
friendsRouter.get("/", getFriends);

/**
 * @swagger
 * /friends/requests/:
 *   get:
 *     tags: [Friends]
 *     summary: Get friends requests of the user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200  :
 *         description: "{ friendsRequests }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
friendsRouter.get("/requests", getFriendRequests);

/**
 * @swagger
 * /friends/:
 *   post:
 *     tags: [Friends]
 *     summary: Send a friend request user only
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *     responses:
 *       201:
 *         description: "{ token }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
friendsRouter.post("/", addFriendRequest);

/**
 * @swagger
 * /friends/:
 *   put:
 *     tags: [Friends]
 *     summary: Update a friend request (accept or refuse)
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
friendsRouter.put("/", updateFriendRequest);

/**
 * @swagger
 * /friends/:
 *   delete:
 *     tags: [Friends]
 *     summary: Delete a friend request
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
friendsRouter.delete("/", deleteFriendRequest);

export { friendsRouter };
