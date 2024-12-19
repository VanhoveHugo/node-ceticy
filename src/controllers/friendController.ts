import { Request, Response } from "express";
import { validateField } from "../utils/validateField";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { validateNumber } from "../utils/validateData";
import { customerServiceFindByEmail } from "../services/customerService";
import {
  friendServiceCreate,
  friendServiceFindByIds,
  friendServiceHandleStatus,
} from "../services/friendService";
``
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      manager: boolean;
    };
    file?: any;
  }
}

export const getFriends = (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};

export const getFriendRequests = (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};

export const addFriendRequest = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  try {
    const targetUser: any = await customerServiceFindByEmail(email);

    let targerId = targetUser[0]?.id;

    if (!targetUser || !req.user?.id)
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.invalidCredentials("form") });

    if (targerId === req.user?.id)
      return res
        .status(400)
        .json({ message: ERROR_MESSAGES.contentInvalid("email") });

    const existingFriendRequest = await friendServiceFindByIds(
      req.user?.id,
      targerId
    );

    if (existingFriendRequest)
      return res
        .status(400)
        .json({ message: ERROR_MESSAGES.contentDuplicate("email") });

    const existingFriendRequestReverse = await friendServiceFindByIds(
      targerId,
      req.user?.id
    );

    // If the target already sent a friend request, accept it
    if (existingFriendRequestReverse) {
      const friendRequest = await friendServiceHandleStatus(
        existingFriendRequestReverse[0].id,
        "accept"
      );

      if (!friendRequest) throw new Error("Friend request not accepted");

      return res.status(201).json({ message: "Friend request accepted" });
    }

    const friendRequest = await friendServiceCreate(req.user?.id, targerId);

    if (!friendRequest) throw new Error("Friend request not created");

    return res.status(201).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Error during friend request creation:", error);
    res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const updateFriendRequest = (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};

export const deleteFriendRequest = (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};
