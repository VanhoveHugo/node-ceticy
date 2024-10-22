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



export const authRegister = async (
  req: Request<object, object, AuthRegisterBody>,
  res: Response
) => {
  const { email, password, name }: AuthRegisterBody = req.body;

  try {
    // Check if all required fields are present and valid
    if (
      !validateField(email, validateEmail, "email", res) ||
      !validateField(password, validatePassword, "password", res) ||
      (name && !validateField(name, validateName, "name", res))
    ) {
      return;
    }

    // Check if the email is already in use
    const userExists = await prisma.user.findFirst({ where: { email } });

    // Stop if the user already exists
    if (userExists) {
      return res.status(409).json(ERROR_MESSAGES.contentDuplicate("email"));
    }

    // Hash the password
    const hash = hashSync(password, 10);

    if (!hash) throw new Error("HashError");

    // Create the new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        name,
      },
    });

    // Check if the user was created
    if (!user) throw new Error("UserCreationError");

    res.status(201).json(user);
  } catch (error: string | unknown) {
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
  const { email, password }: AuthLoginBody = req.body;

  try {
    // Check if all required fields are present and valid
    if (
      !validateField(email, validateEmail, "email", res) ||
      !validateField(password, validatePassword, "password", res)
    ) {
      return; // Stop execution if validation fails
    }

    // Check if the email is already in use
    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (
      !existingUser?.password ||
      !compareSync(password, existingUser.password)
    ) {
      return res.status(401).json(ERROR_MESSAGES.invalidCredentials("form"));
    }

    // Check if the JWT secret is set
    if (!config.JWT_SECRET) {
      throw new Error("Missing JWT");
    }

    // Create a JWT token
    const token: string = jwt.sign({ id: existingUser.id }, config.JWT_SECRET);

    // Check if the token was created
    if (!token) {
      throw new Error("TokenError");
    }

    res.status(200).json({ token });
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);

    if (error instanceof Error) {
      if (error.message === "Missing JWT") {
        return res.status(500).json(ERROR_MESSAGES.serverError("jwt"));
      }

      if (error.message === "TokenError") {
        return res.status(500).json(ERROR_MESSAGES.serverError("token"));
      }
    }

    res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};
