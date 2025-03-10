import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { customerServiceFindByEmail } from "../services/customerService";
import {
  friendServiceCreate,
  friendServiceFindByIds,
  friendServiceGetAll,
  friendServiceHandleStatus,
} from "../services/friendService";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      manager: boolean;
    };
    file?: any;
  }
}

export const getFriends = async (req: Request, res: Response) => {
  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  try {
    const polls = await friendServiceGetAll(req.user.id);

    if (!polls)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(201).json(polls);
  } catch (error: unknown) {
    console.error("Error during poll creation:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const getFriendRequests = (req: Request, res: Response) => {
  return res.status(400).json(ERROR_MESSAGES.notImplemented);
};

export const addFriendRequest = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  try {
    const targetUser: any = await customerServiceFindByEmail(email);

    let targerId = targetUser[0]?.id;

    if (!targetUser)
      return res.status(204).json(ERROR_MESSAGES.invalidCredentials("form"));

    if (targerId === req.user.id)
      return res.status(400).json(ERROR_MESSAGES.contentInvalid("email"));

    const existingFriendRequest = await friendServiceFindByIds(
      req.user.id,
      targerId
    );

    if (existingFriendRequest)
      return res.status(400).json(ERROR_MESSAGES.contentDuplicate("email"));

    const existingFriendRequestReverse = await friendServiceFindByIds(
      targerId,
      req.user.id
    );

    // If the target already sent a friend request, accept it
    if (existingFriendRequestReverse) {
      const friendRequest = await friendServiceHandleStatus(
        existingFriendRequestReverse[0].id,
        "accept"
      );

      if (!friendRequest) throw new Error("Friend request not accepted");

      return res.status(201).json(friendRequest);
    }

    const friendRequest = await friendServiceCreate(req.user.id, targerId);

    if (!friendRequest) throw new Error("Friend request not created");

    return res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error during friend request creation:", error);
    res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const updateFriendRequest = (req: Request, res: Response) => {
  return res.status(400).json(ERROR_MESSAGES.notImplemented);
};

export const deleteFriendRequest = (req: Request, res: Response) => {
  return res.status(400).json(ERROR_MESSAGES.notImplemented);
};
