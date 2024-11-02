import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hashSync, compareSync } from "bcrypt";
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

// Create a user or manager
async function createUserOrManager(schema: any, data: any) {
  return await schema.create({ data });
}

// Find a user or manager by email
async function findUserOrManager(schema: any, email: any) {
  return await schema.findFirst({ where: { email } });
}

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

    // Check if the user is a manager
    const schema = manager ? prisma.manager : prisma.user;

    // Check if the user already exists
    const userExists = await findUserOrManager(schema, email);
    if (userExists) {
      return res.status(409).json(ERROR_MESSAGES.contentDuplicate("email"));
    }

    // Hash the password
    const hash = hashSync(password, 10);
    if (!hash) throw new Error("HashError");

    // Create the user or manager
    const user = await createUserOrManager(schema, {
      email,
      password: hash,
      name,
    });
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
    const schema = manager ? prisma.manager : prisma.user;

    // Find the user or manager
    const existingUser = await findUserOrManager(schema, email);
    if (
      !existingUser?.password ||
      !compareSync(password, existingUser.password)
    ) {
      return res.status(401).json(ERROR_MESSAGES.invalidCredentials("form"));
    }

    // Check if the JWT secret is set
    if (!config.JWT_SECRET) {
      throw new Error("MissingJWT");
    }

    // Create a JWT token
    const token = jwt.sign({ id: existingUser.id, scope: manager ? "manager" : "user" }, config.JWT_SECRET);
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
