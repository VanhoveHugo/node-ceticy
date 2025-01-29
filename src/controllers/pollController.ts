import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import {
  pollServiceCount,
  pollServiceCreate,
  pollServiceDelete,
  pollServiceUpdate,
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
  return res.status(400).json(ERROR_MESSAGES.notImplemented);
};

export const getPollById = async (req: Request, res: Response) => {
  return res.status(400).json(ERROR_MESSAGES.notImplemented);
};

export const addPoll = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  if (!name) return res.status(400).json(ERROR_MESSAGES.contentInvalid("name"));

  try {
    let pollCounter: number = await pollServiceCount(req.user.id);

    if (pollCounter >= 5)
      return res.status(400).json(ERROR_MESSAGES.contentLimit("polls"));

    const poll = await pollServiceCreate(name, req.user.id);

    if (!poll)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(201).json({ poll });
  } catch (error: unknown) {
    console.error("Error during poll creation:", error);
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
    console.error("Error during poll update:", error);
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
    console.error("Error during poll deletion:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const addPollParticipant = async (req: Request, res: Response) => {
  return res.status(400).json(ERROR_MESSAGES.notImplemented);
}

export const deletePollParticipant = async (req: Request, res: Response) => {
  return res.status(400).json(ERROR_MESSAGES.notImplemented);
}
