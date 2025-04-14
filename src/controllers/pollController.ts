import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import {
  pollServiceCreate,
  pollServiceDelete,
  pollServiceCheckIsCreator,
  pollServiceUpdate,
  pollServiceCheckIsValidParticipant,
  pollServiceParticipantAdd,
  pollServiceParticipantRemove,
  pollServiceGetAll,
  pollServiceRestaurantsAdd,
  pollServiceVoteAdd,
  pollServiceCount,
} from "../services/pollService";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      manager: boolean;
    };
    file?: any;
  }
}

export const getPolls = async (req: Request, res: Response) => {
  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  try {
    const polls = await pollServiceGetAll(req.user.id);

    if (!polls)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(201).json(polls);
  } catch (error: unknown) {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const getPollById = async (req: Request, res: Response) => {
  return res.status(400).json(ERROR_MESSAGES.notImplemented);
};

export const addPoll = async (req: Request, res: Response) => {
  const { name, friendsList, restaurantsList } = req.body;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  if (!name) return res.status(400).json(ERROR_MESSAGES.contentInvalid("name"));

  try {
    let pollCounter: number = await pollServiceCount(req.user.id);

    if (pollCounter >= 5)
      return res.status(400).json(ERROR_MESSAGES.contentLimit("polls"));

    const pollId = await pollServiceCreate(name, req.user.id);

    if (!pollId)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    if (friendsList) {
      if (!pollId)
        return res.status(400).json(ERROR_MESSAGES.contentInvalid("pollId"));

      friendsList.forEach(async (friend: number) => {
        if (typeof req.user == "undefined") return;
        await addPollParticipant(req.user.id, pollId, friend);
      });

      // V1 1 Restaurant per Poll
      let restaurantId = restaurantsList;
      await pollServiceRestaurantsAdd(pollId, restaurantId);
    }

    return res.status(201).json(pollId);
  } catch (error: unknown) {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const updatePoll = async (req: Request, res: Response) => {
  const { pollId, name } = req.body;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  if (!pollId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("pollId"));

  if (!name) return res.status(400).json(ERROR_MESSAGES.contentInvalid("name"));

  try {
    let poll = await pollServiceUpdate(pollId, name, req.user.id);

    if (!poll)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(200).json({ poll });
  } catch (error: unknown) {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const deletePoll = async (req: Request, res: Response) => {
  const { pollId } = req.body;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  if (!pollId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("pollId"));

  try {
    const poll = await pollServiceDelete(pollId, req.user.id);

    if (!poll)
      return res.status(500).json(ERROR_MESSAGES.contentMissing("poll"));

    return res.status(200).json({ poll });
  } catch (error: unknown) {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

const addPollParticipant = async (
  userId: number,
  pollId: number,
  participantId: number
) => {
  try {
    // if poll exist & user is the owner of the poll
    let pollExist = await pollServiceCheckIsCreator(pollId, userId);

    if (!pollExist) return;

    // if participant exist
    let participantExist = await pollServiceCheckIsValidParticipant(
      participantId
    );

    if (!participantExist) return;

    let data = await pollServiceParticipantAdd(pollId, participantId);

    if (!data) return;

    return true;
  } catch (error: unknown) {
    console.error("Error during adding poll participant:", error);
    return error;
  }
};

export const addPollVote = async (req: Request, res: Response) => {
  const { pollId, userId, optionsList, vote } = req.body;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  if (!pollId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("pollId"));

  try {
    let optionId = optionsList;
    let data = await pollServiceVoteAdd(pollId, userId, optionId, vote);

    if (!data) return;

    return true;
  } catch (error: unknown) {
    console.error("Error during adding poll participant:", error);
    return error;
  }
}

export const deletePollParticipant = async (req: Request, res: Response) => {
  const { pollId, participantId } = req.body;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user.id == participantId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("participantId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  if (!pollId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("pollId"));

  if (!participantId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("participantId"));

  try {
    let data = await pollServiceParticipantRemove(pollId, participantId);

    if (!data)
      return res.status(400).json(ERROR_MESSAGES.contentMissing("participant"));

    return res.status(200).json(participantId);
  } catch (error: unknown) {
    console.error("Error during removing poll participant:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};
