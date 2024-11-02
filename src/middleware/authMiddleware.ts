import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config";

interface JwtPayload {
  id: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Récupérer le token Bearer

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Check if the JWT is valid
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    // Stock if the decoded JWT has an id
    req.userId = parseInt(decoded.id);

    if (!req.userId) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    next();
  } catch (err) {
    console.error("Token is not valid");
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Extend the Request interface to include userId
declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}
