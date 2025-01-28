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
import { managerServiceCreate, managerServiceFindByEmail } from "../services/managerService";
import { friendServiceGetCount } from "../services/friendService";
import { restaurantServiceGetCount } from "../services/restaurantService";

export const authRegister = async (
  req: Request<object, object, AuthRegisterBody>,
  res: Response
) => {
  const { email, password, name, scope }: AuthRegisterBody = req.body;

  try {
    // Check if all required fields are present and valid
    if (
      !validateField(email, validateEmail, "email", res) ||
      !validateField(password, validatePassword, "password", res) ||
      !validateField(name, validateName, "name", res)
    ) {
      return;
    }

    if (scope !== "user" && scope !== "manager") {
      return res.status(400).json(ERROR_MESSAGES.contentInvalid("scope"));
    }

    // let emailExists = null;

    // if (scope === "user") {
    //   emailExists = await customerServiceFindByEmail(email);
    // } else if (scope === "manager") {
    //   emailExists = await managerServiceFindByEmail(email);
    // }

    // if (emailExists) {
    //   return res.status(409).json(ERROR_MESSAGES.contentDuplicate("email"));
    // }

    // Hash the password
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 14,
      timeCost: 2,
      parallelism: 1,
      hashLength: 32,
    });
    if (!hash) throw new Error("HashError");

    // Create the user or manager
    let user = null;

    if (scope === "user") {
      user = await customerServiceCreate(email, hash);
    } else if (scope === "manager") {
      user = await managerServiceCreate(email, hash);
    }

    if (!user) throw new Error("UserCreationError");

    res.status(201).json({ email });
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
  const { email, password, scope }: AuthLoginBody = req.body;

  try {
    // Check if all required fields are present and valid
    if (
      !validateField(email, validateEmail, "email", res) ||
      !validateField(password, validatePassword, "password", res)
    ) {
      return;
    }

    if (scope !== "user" && scope !== "manager") {
      return res.status(400).json(ERROR_MESSAGES.contentInvalid("scope"));
    }

    let emailExists = null;

    if (scope === "user") {
      // Check if the user already exists
      emailExists = await customerServiceFindByEmail(email);
    } else if (scope === "manager") {
      // Check if the manager already exists
      emailExists = await managerServiceFindByEmail(email);
    }

    if (!emailExists) {
      return res.status(401).json(ERROR_MESSAGES.invalidCredentials("form"));
    }

    const user = emailExists[0];
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
      { id: user.id, email: user.email, scope: scope },
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

export const authAccount = async (
  req: Request<object, object>,
  res: Response
) => {
  // Take token in bearer header
  if(!req.headers.authorization) return res.status(400).json(ERROR_MESSAGES.contentInvalid("token"));
  const token = req.headers.authorization.split(" ")[1];

  try {
    // Check if all required fields are present and valid
    if (!validateField(token, (value: string) => typeof value === "string", "token", res)) {
      return;
    }

    // Check if the JWT secret is set
    if (!config.JWT_SECRET) {
      throw new Error("MissingJWT");
    }

    // Verify the JWT token
    const decoded : any = jwt.verify(token, config.JWT_SECRET);
    if (!decoded) throw new Error("TokenError");

    // Find the user or manager
    let user = null;

    if (decoded.scope === "user") {
      user = await customerServiceFindByEmail(decoded.email);
    } else if (decoded.scope === "manager") {
      user = await managerServiceFindByEmail(decoded.email);
    }

    user = user[0];
    user.password = undefined;
    user.scope = decoded.scope;

    user.currentFriendCount = await friendServiceGetCount(user.id);
    user.currentLikeCount = await restaurantServiceGetCount(user.id);

    res.status(200).json(user);
  } catch (error: unknown) {
    console.error("Error during account information:", error);

    if (error instanceof Error) {
      if (error.message === "MissingJWT") {
        return res.status(500).json(ERROR_MESSAGES.serverError("jwt"));
      }
      if (error.message === "TokenError") {
        return res.status(401).json(ERROR_MESSAGES.invalidCredentials("token"));
      }
    }

    res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
}
