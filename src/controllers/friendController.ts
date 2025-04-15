import e, { Request, Response } from "express";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { customerServiceFindByEmail } from "../services/customerService";
import {
  friendServiceCreate,
  friendServiceFindByIds,
  friendServiceGetAll,
  friendServiceHandleStatus,
  friendServiceGetPendingRequests,
  friendServiceDeleteRequest,
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
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const getFriendRequests = async (req: Request, res: Response) => {
  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  try {
    const requests = await friendServiceGetPendingRequests(req.user.id);

    if (!requests)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(200).json(requests);
  } catch (error: unknown) {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const addFriendRequest = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("email"));
  }

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

      if (!friendRequest) return res.status(400).json(ERROR_MESSAGES.contentInvalid("email"));

      return res.status(201).json(friendRequest);
    }

    const friendRequest = await friendServiceCreate(req.user.id, targerId);

    if (!friendRequest) 
      return res.status(400).json(ERROR_MESSAGES.contentInvalid("email"));

    return res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const updateFriendRequest = async (req: Request, res: Response) => {
  const { requestId, status } = req.body;

  if (!requestId || !status)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("requestId or status"));

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  try {
    const friendRequest = await friendServiceHandleStatus(Number(requestId), status);

    if (!friendRequest)
      return res.status(400).json(ERROR_MESSAGES.contentInvalid("requestId"));

    return res.status(200).json(friendRequest);
  } catch (error: unknown) {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const deleteFriendRequest = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  if (!requestId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("requestId"));

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  try {
    const result = await friendServiceDeleteRequest(Number(requestId));

    if (!result)
      return res.status(400).json(ERROR_MESSAGES.contentInvalid("requestId"));

    return res.status(200).json({ message: "Friend request deleted successfully" });
  } catch (error: unknown) {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};
