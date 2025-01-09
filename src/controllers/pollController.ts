import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { pollServiceCount, pollServiceCreate, pollServiceDelete, pollServiceUpdate } from "../services/pollService";

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
  return res.status(200).json({ message: "in progress" });
};

export const getPollById = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};

export const addPoll = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ message: ERROR_MESSAGES.contentInvalid("name") });
  }

  if (!req.user?.id) {
    return res
      .status(400)
      .json({ message: ERROR_MESSAGES.contentInvalid("userId") });
  }

  let pollCounter: number = await pollServiceCount(req.user.id);

  if (pollCounter >= 5) {
    return res
      .status(400)
      .json({ message: ERROR_MESSAGES.contentLimit("polls") });
  }

  const poll = await pollServiceCreate(name, req.user.id);

  if (!poll) {
    return res.status(500).json({ message: ERROR_MESSAGES.serverError });
  }

  return res.status(201).json({ poll });
};

export const updatePoll = async (req: Request, res: Response) => {
  const { pollId, name } = req.body;

  if (!pollId) {
    return res
      .status(400)
      .json({ message: ERROR_MESSAGES.contentInvalid("pollId") });
  }

  if (!name) {
    return res
      .status(400)
      .json({ message: ERROR_MESSAGES.contentInvalid("name") });
  }

  if (!req.user?.id) {
    return res
      .status(400)
      .json({ message: ERROR_MESSAGES.contentInvalid("userId") });
  }

  let poll = await pollServiceUpdate(pollId, name, req.user.id);

  if (!poll) {
    return res.status(500).json({ message: ERROR_MESSAGES.serverError });
  }

  return res.status(200).json({ poll });
};

export const deletePoll = async (req: Request, res: Response) => {
  const { pollId } = req.body;

  if (!pollId) {
    return res
      .status(400)
      .json({ message: ERROR_MESSAGES.contentInvalid("pollId") });
  }

  if (!req.user?.id) {
    return res
      .status(400)
      .json({ message: ERROR_MESSAGES.contentInvalid("userId") });
  }

  const poll = await pollServiceDelete(pollId, req.user.id);

  if (!poll) {
    return res.status(500).json({ message: ERROR_MESSAGES.serverError });
  }

  return res.status(200).json({ poll });
};
