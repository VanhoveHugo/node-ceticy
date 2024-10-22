import { Request, Response } from "express";
import { validateField } from "../utils/validateField";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { validateNumber } from "../utils/validateData";
import { usersServiceFindById } from "../services/usersService";
import {
  friendsServiceCreate,
  friendsServiceFindByIds,
} from "../services/friendsService";
import { FriendCreateBody } from "../utils/interfacesRequest";

export const getFriends = (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};

export const getFriendRequests = (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};

export const addFriendRequest = async (
  req: Request<object, object, FriendCreateBody>,
  res: Response
) => {
  const { friendId }: FriendCreateBody = req.body;

  if (!validateField(friendId, validateNumber, "friendId", res)) {
    return res
      .status(400)
      .json({ message: ERROR_MESSAGES.contentMissing("friendId") });
  }
  try {
    const targetUser = await usersServiceFindById(friendId);

    let targerId = Number(targetUser?.id);

    if (!targetUser || !req.userId)
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.invalidCredentials("form") });

    if (targerId === req.userId)
      return res
        .status(400)
        .json({ message: ERROR_MESSAGES.contentInvalid("id") });

    const existingFriendRequest = await friendsServiceFindByIds(
      req.userId,
      targerId
    );

    if (existingFriendRequest)
      return res
        .status(400)
        .json({ message: ERROR_MESSAGES.contentDuplicate("id") });

    const existingFriendRequestReverse = await friendsServiceFindByIds(
      targerId,
      req.userId
    ).catch((error) => null);

    if (existingFriendRequestReverse)
      return res
        .status(400)
        .json({ message: ERROR_MESSAGES.contentDuplicate("id") });

    const friendRequest = await friendsServiceCreate(req.userId, targerId);

    if (!friendRequest) throw new Error("Friend request not created");

    return res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const updateFriendRequest = (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};

export const deleteFriendRequest = (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};

// Extend the Request interface to include userId
declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}
