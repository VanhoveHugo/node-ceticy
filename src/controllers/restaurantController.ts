import { Request, Response } from "express";
import {
  restaurantServiceCreate,
  restaurantServiceGetList,
} from "../services/restaurantService";
import { RestaurantCreateBody } from "../utils/interfacesRequest";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      manager: boolean;
    };
  }
}

export const getListOfRestaurants = async (req: Request, res: Response) => {
  try {
    // Get a list of restaurants
    const restaurants = await restaurantServiceGetList();

    return res.status(200).json(restaurants);
  } catch (error: unknown) {
    console.error("Error during restaurant creation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurantsByManagerId = (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};

export const addRestaurant = async (req: Request, res: Response) => {
  const {
    name,
    description,
    averagePrive,
    averageService,
    phoneNumber,
  }: RestaurantCreateBody = req.body;
  if (!req.user) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    // TODO: Handle Data Validation

    // TODO: Check if manager can add a restaurant FREE or PREMIUM

    // Create a restaurant
    const restaurant = await restaurantServiceCreate(
      name,
      req.user.id,
      description,
      averagePrive,
      averageService,
      phoneNumber
    );

    return res.status(201).json(restaurant);
  } catch (error: unknown) {
    console.error("Error during restaurant creation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRestaurant = (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};

export const deleteRestaurant = (req: Request, res: Response) => {
  return res.status(200).json({ message: "in progress" });
};
