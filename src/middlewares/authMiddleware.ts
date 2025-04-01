import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../utils/errorMessages";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      manager: boolean;
    };
  }
}
interface JwtPayload {
  scope: string;
  id: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json(ERROR_MESSAGES.accessDenied("unauthenticated"));
  }

  try {
    // Check if the JWT is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as JwtPayload;

    // Stock if the decoded JWT has an id
    req.user = {
      id: parseInt(decoded.id),
      manager: decoded.scope === "manager",
    };

    if (!req.user) {
      return res.status(401).json(ERROR_MESSAGES.accessDenied("unauthorized"));
    }

    next();
  } catch (err) {
    return res.status(401).json(ERROR_MESSAGES.accessDenied("unauthorized"));
  }
};

export const managerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.manager) {
    return res.status(401).json(ERROR_MESSAGES.accessDenied("unauthorized"));
  }
  next();
}