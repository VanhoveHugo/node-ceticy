import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addPoll, deletePoll, getPolls, updatePoll } from "../controllers/pollController";

const pollRouter = Router();

pollRouter.use(authMiddleware);

/**
 * @swagger
 * /polls:
 *   get:
 *     tags: [Todo]
 *     summary: Get all polls
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200  :
 *         description: "{ list of polls }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
pollRouter.get("/", getPolls);

/**
 * @swagger
 * /polls:
 *   post:
 *     tags: [Polls]
 *     summary: Get all polls
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
 *                 example: Romantique
 *     responses:
 *       201  :
 *         description: "{ pollId }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
pollRouter.post("/", addPoll);

/**
 * @swagger
 * /polls/:
 *   put:
 *     tags: [Polls]
 *     summary: Update a poll
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
 *                 example: Chill
 *               pollId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200  :
 *         description: "{ pollId }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
pollRouter.put("/", updatePoll);

/**
 * @swagger
 * /polls/:
 *   delete:
 *     tags: [Polls]
 *     summary: Delete a poll
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pollId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200  :
 *         description: "{ pollId }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
pollRouter.delete("/", deletePoll);

export { pollRouter };
