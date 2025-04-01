import {
  authMiddleware,
  managerMiddleware,
} from "@/middlewares/authMiddleware";
import { ERROR_MESSAGES } from "@/utils/errorMessages";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

jest.mock("jsonwebtoken");

const mockRequest = (): Request =>
  ({
    headers: {},
    // ajoute d'autres champs si nécessaire
  } as unknown as Request);


describe("authMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = mockRequest();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if no token provided", () => {
    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.accessDenied("unauthenticated")
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    req.headers = req.headers || {};
    req.headers.authorization = "Bearer invalidtoken";
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("invalid");
    });

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.accessDenied("unauthorized")
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should decode token and call next if valid", () => {
    req.headers = req.headers || {};
    req.headers.authorization = "Bearer validtoken";
    (jwt.verify as jest.Mock).mockReturnValue({ id: "42", scope: "manager" });

    authMiddleware(req as Request, res as Response, next);

    expect(req.user).toEqual({ id: 42, manager: true });
    expect(next).toHaveBeenCalled();
  });

  it("should handle decoded token without user", () => {
    req.headers = req.headers || {};
    req.headers.authorization = "Bearer validtoken";
    (jwt.verify as jest.Mock).mockReturnValue(undefined); // simulate empty result

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.accessDenied("unauthorized")
    );
  });

  it("should return 401 if user is not found in decoded token", () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: undefined });
    authMiddleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.accessDenied("unauthenticated")
    );
    expect(next).not.toHaveBeenCalled();
  });
});

describe("managerMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if user is not manager", () => {
    req = { user: { id: 1, manager: false } };

    managerMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.accessDenied("unauthorized")
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if user is manager", () => {
    req = { user: { id: 1, manager: true } };

    managerMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });
});
