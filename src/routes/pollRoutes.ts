import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addPoll, addPollParticipant, deletePoll, deletePollParticipant, getPolls, updatePoll } from "../controllers/pollController";

const pollRouter = Router();

pollRouter.use(authMiddleware);

/**
 * @swagger
 * /polls/:
 *   get:
 *     tags: [Todo]
 *     summary: User can get their polls
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
 * /polls/:
 *   post:
 *     tags: [Polls]
 *     summary: User can create a poll
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
 *     summary: User can update their poll
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
 *     summary: User can delete their poll
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

/**
 * @swagger
 * /polls/participants/:
 *   post:
 *     tags: [Polls]
 *     summary: User can add a participant to their poll
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
 *                 type: string
 *                 example: 1
 *               participantId:
 *                 type: string
 *                 example: 2
 *     responses:
 *       201  :
 *         description: "{ participantId }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
pollRouter.post("/participants", addPollParticipant);

/**
 * @swagger
 * /polls/participants/:
 *   delete:
 *     tags: [Polls]
 *     summary: User can add a participant to their poll
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
 *                 type: string
 *                 example: 1
 *               participantId:
 *                 type: string
 *                 example: 2
 *     responses:
 *       201  :
 *         description: "{ participantId }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
pollRouter.delete("/participants", deletePollParticipant);

export { pollRouter };
