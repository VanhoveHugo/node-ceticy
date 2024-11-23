import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { validateField } from "../utils/validateField";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validateData";
import { config } from "../config";
import { AuthLoginBody, AuthRegisterBody } from "../utils/interfacesRequest";
import { customerServiceCreate, customerServiceFindByEmail } from "../services/customerService";

export const authRegister = async (
  req: Request<object, object, AuthRegisterBody>,
  res: Response
) => {
  const { email, password, name, manager }: AuthRegisterBody = req.body;

  try {
    // Check if all required fields are present and valid
    if (
      !validateField(email, validateEmail, "email", res) ||
      !validateField(password, validatePassword, "password", res) ||
      !validateField(name, validateName, "name", res)
    ) {
      return;
    }

    // Check if the user already exists
    const userExists = await customerServiceFindByEmail(email);

    if (userExists) {
      return res.status(409).json(ERROR_MESSAGES.contentDuplicate("email"));
    }

    // Hash the password
    const hash = await argon2.hash(password,
      {
        type: argon2.argon2id,
        memoryCost: 2 ** 14,
        timeCost: 2,
        parallelism: 1,
        hashLength: 32,
      }
    );
    if (!hash) throw new Error("HashError");

    // Create the user or manager
    const user = await customerServiceCreate(email, hash);
    if (!user) throw new Error("UserCreationError");

    res.status(201).json(user);
  } catch (error: unknown) {
    console.error("Error during user registration:", error);

    if (error instanceof Error) {
      if (error.message === "HashError") {
        return res.status(500).json(ERROR_MESSAGES.serverError("hash"));
      }
      if (error.message === "UserCreationError") {
        return res.status(500).json(ERROR_MESSAGES.serverError("user"));
      }
    }

    res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const authLogin = async (
  req: Request<object, object, AuthLoginBody>,
  res: Response
) => {
  const { email, password, manager }: AuthLoginBody = req.body;

  try {
    // Check if all required fields are present and valid
    if (
      !validateField(email, validateEmail, "email", res) ||
      !validateField(password, validatePassword, "password", res)
    ) {
      return;
    }

    // Check if the user is a manager
    const schema = null; //manager ? prisma.manager : prisma.user;

    // Find the user or manager
    const existingUser: any = await customerServiceFindByEmail(email);

    const user = existingUser[0];

    if (!user) {
      return res.status(401).json(ERROR_MESSAGES.invalidCredentials("form"));
    }

    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      return res.status(401).json(ERROR_MESSAGES.invalidCredentials("form"));
    }

    // Check if the JWT secret is set
    if (!config.JWT_SECRET) {
      throw new Error("MissingJWT");
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, scope: "manager" },
      config.JWT_SECRET
    );
    if (!token) throw new Error("TokenError");

    res.status(200).json({ token });
  } catch (error: unknown) {
    console.error("Error during login:", error);

    if (error instanceof Error) {
      if (error.message === "MissingJWT") {
        return res.status(500).json(ERROR_MESSAGES.serverError("jwt"));
      }
      if (error.message === "TokenError") {
        return res.status(500).json(ERROR_MESSAGES.serverError("token"));
      }
    }

    res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};
