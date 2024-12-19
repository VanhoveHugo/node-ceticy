import { Request, Response } from "express";
import {
  restaurantServiceCreate,
  restaurantServiceGetByManagerId,
  restaurantServiceGetList,
  restaurantServiceHandleSwipe,
} from "../services/restaurantService";
import { RestaurantCreateBody } from "../utils/interfacesRequest";
import { photoServiceCreate } from "../services/photoService";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      manager: boolean;
    };
    file?: any;
  }
}

export const getListOfRestaurants = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ message: "User not found" });
    // Get a list of restaurants
    const restaurants = await restaurantServiceGetList(req.user.id);

    return res.status(200).json(restaurants);
  } catch (error: unknown) {
    console.error("Error during restaurant creation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurantsByManagerId = async (req: Request, res: Response) => {
  if(!req.user) return res.status(400).json({ message: "User not found" });
  let managerId = req.user.id;
  if (!managerId) return res.status(400).json({ message: "Manager ID not found" });

  let data = await restaurantServiceGetByManagerId(managerId);
  if (!data) return res.status(500).json({ message: "Internal server error" });

  return res.status(200).json(data);
};

export const addRestaurant = async (req: Request, res: Response) => {
  const {
    name,
    description,
    averagePrive,
    averageService,
    phoneNumber,
  }: RestaurantCreateBody = req.body;
  const file = req.file;

  if (!req.user) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    // TODO: Handle Data Validation

    // TODO: Check if manager can add a restaurant FREE or PREMIUM

    const restaurantId = await restaurantServiceCreate(
      name,
      req.user.id,
      description,
      averagePrive,
      averageService,
      phoneNumber
    );

    if(file) {
      let thumbnailId = await photoServiceCreate(restaurantId, file.path);

      if (!thumbnailId) {
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    return res.status(201).json(restaurantId);
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

export const handleRestaurantSwipe = (req: Request, res: Response) => {
  const { action, restaurantId } = req.body;

  if (!req.user) return res.status(400).json({ message: "User not found" });

  if (!restaurantId) return res.status(400).json({ message: "Restaurant ID not found" });

  let data = restaurantServiceHandleSwipe(restaurantId, req.user.id, action == "like");

  if (!data) return res.status(500).json({ message: "Internal server error" });

  return res.status(201).json(data);
};