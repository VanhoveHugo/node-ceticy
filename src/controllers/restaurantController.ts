import { Request, Response } from "express";
import {
  restaurantServiceCreate,
  restaurantServiceGetByManagerId,
  restaurantServiceGetList,
  restaurantServiceGetLike,
  restaurantServiceHandleSwipe,
  restaurantServiceGetById,
} from "../services/restaurantService";
import { RestaurantCreateBody } from "../utils/interfacesRequest";
import { photoServiceCreate } from "../services/photoService";
import {
  favoriteServiceCreate,
  favoriteServiceDelete,
  favoriteServiceGet,
  favoriteServiceGetOne,
} from "../services/favoriteService";
import { ERROR_MESSAGES } from "../utils/errorMessages";

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
  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  try {
    const restaurants = await restaurantServiceGetList(req.user.id);

    return res.status(200).json(restaurants);
  } catch (error: unknown) {
    console.error("Error during restaurant creation:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  try {
    const restaurant = await restaurantServiceGetById(Number(id));

    return res.status(200).json(restaurant);
  } catch (error: unknown) {
    console.error("Error during restaurant creation:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
}

export const getRestaurantsByManagerId = async (
  req: Request,
  res: Response
) => {
  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  try {
    let data = await restaurantServiceGetByManagerId(req.user.id);

    if (!data)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(200).json(req.user.id);
  } catch (error: unknown) {
    console.error("Error during restaurant manager retrieval:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const addRestaurant = async (req: Request, res: Response) => {
  const {
    name,
    description,
    averagePrice,
    averageService,
    phoneNumber,
  }: RestaurantCreateBody = req.body;
  const file = req.file;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  try {
    // TODO: Handle Data Validation

    // TODO: Check if manager can add a restaurant FREE or PREMIUM

    const restaurantId = await restaurantServiceCreate(
      name,
      req.user.id,
      description,
      averagePrice,
      averageService,
      phoneNumber
    );

    if (!restaurantId) {
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));
    }

    if (file) {
      let thumbnailId = await photoServiceCreate(restaurantId, file.path);

      if (!thumbnailId) {
        return res.status(500).json(ERROR_MESSAGES.serverError("cloudinary"));
      }
    }

    return res.status(201).json(restaurantId);
  } catch (error: unknown) {
    console.error("Error during restaurant creation:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const updateRestaurant = (req: Request, res: Response) => {
  return res.status(400).json(ERROR_MESSAGES.notImplemented);
};

export const deleteRestaurant = (req: Request, res: Response) => {
  return res.status(400).json(ERROR_MESSAGES.notImplemented);
};

export const handleRestaurantSwipe = async (req: Request, res: Response) => {
  const { action, restaurantId } = req.body;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  if (!restaurantId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("restaurantId"));

  if (!action)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("action"));

  try {
    let data = await restaurantServiceHandleSwipe(
      restaurantId,
      req.user.id,
      action == "like"
    );

    if (!data)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(201).json(data);
  } catch (error: unknown) {
    console.error("Error during swipe handling:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const getLikeRestaurants = async (req: Request, res: Response) => {
  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  try {
    const restaurants = await restaurantServiceGetLike(req.user.id);

    return res.status(200).json(restaurants);
  } catch (error: unknown) {
    console.error("Error during restaurant creation:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const addFavoriteRestaurant = async (req: Request, res: Response) => {
  const { restaurantId } = req.body;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  if (!restaurantId)
    return res.status(400).json(ERROR_MESSAGES.contentMissing("restaurantId"));

  try {
    let alreadyExists = await favoriteServiceGetOne(
      req.user.id,
      req.body.restaurantId
    );

    if (alreadyExists)
      return res
        .status(400)
        .json(ERROR_MESSAGES.contentDuplicate("restaurantId"));

    let data = await favoriteServiceCreate(req.user.id, req.body.restaurantId);

    if (!data)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(201).json(data);
  } catch (error: unknown) {
    console.error("Error during favorite restaurant creation:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const deleteFavoriteRestaurant = async (req: Request, res: Response) => {
  const { restaurantId } = req.body;

  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  if (!restaurantId) {
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("restaurantId"));
  }

  try {
    let data = await favoriteServiceDelete(req.user.id, req.body.restaurantId);

    if (!data)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    if (data.affectedRows === 0)
      return res
        .status(404)
        .json(ERROR_MESSAGES.contentInvalid("restaurantId"));

    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error("Error during favorite restaurant deletion:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const getFavoriteRestaurants = async (req: Request, res: Response) => {
  if (!req.user?.id)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  if (req.user?.manager === true)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  try {
    let data = await favoriteServiceGet(req.user.id);

    if (!data)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error("Error during favorite restaurants retrieval:", error);
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};