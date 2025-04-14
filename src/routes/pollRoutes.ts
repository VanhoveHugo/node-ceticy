import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { addPoll, addPollVote, deletePoll, deletePollParticipant, getPolls, updatePoll } from "../controllers/pollController";

const pollRouter = Router();

pollRouter.use(authMiddleware);

/**
 * @swagger
 * /polls/:
 *   get:
 *     tags: [Polls]
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
 *               restaurantsList:
 *                 type: string
 *                 example: 1
 *               friendsList:
 *                 type: array
 *                 example: ["option1", "option2"]
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
 * /polls/vote:
 *   get:
 *     tags: [Polls]
 *     summary: User vote for a poll
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
 *               userId:
 *                 type: number
 *                 example: 1
 *               optionsList:
 *                 type: number
 *                 example: 1
 *               vote:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200  :
 *         description: "{ pollId }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
pollRouter.get("/vote", addPollVote);

/**
 * @swagger
 * /polls/vote:
 *   post:
 *     tags: [Polls]
 *     summary: User vote for a poll
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
 *               userId:
 *                 type: number
 *                 example: 1
 *               optionsList:
 *                 type: number
 *                 example: 1
 *               vote:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200  :
 *         description: "{ pollId }"
 *       400:
 *         description: "{ kind: error_code, content: invalid_field  }"
 *       500:
 *         description: "{ kind: 'server_error', content: reason }"
 */
pollRouter.post("/vote", addPollVote);

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
