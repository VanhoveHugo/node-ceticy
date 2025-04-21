import { Request, Response } from "express";
import {
  restaurantServiceCreate,
  restaurantServiceGetByManagerId,
  restaurantServiceGetList,
  restaurantServiceGetLike,
  restaurantServiceHandleSwipe,
  restaurantServiceGetById,
  restaurantServiceUpdate,
  restaurantServiceDelete,
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

// -------------------- Helper --------------------
const getUserId = (req: Request): number | null => req.user?.id ?? null;

// -------------------- Restaurant Controllers --------------------

export const getListOfRestaurants = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  try {
    const restaurants = await restaurantServiceGetList(userId);
    return res.status(200).json(restaurants);
  } catch {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const id = Number(req.params?.id);
  const userId = getUserId(req);
  if (!userId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  try {
    const restaurant = await restaurantServiceGetById(id);
    return res.status(200).json(restaurant);
  } catch {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const getRestaurantsByManagerId = async (
  req: Request,
  res: Response
) => {
  const userId = getUserId(req);
  if (!userId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  try {
    const data = await restaurantServiceGetByManagerId(userId);
    if (!data)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(200).json(data);
  } catch {
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
  const userId = getUserId(req);

  if (!userId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  try {
    const restaurantId = await restaurantServiceCreate(
      name,
      userId,
      description,
      averagePrice,
      averageService,
      phoneNumber
    );
    if (!restaurantId)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    if (file) {
      const thumbnailId = await photoServiceCreate(restaurantId, file.path);
      if (!thumbnailId)
        return res.status(500).json(ERROR_MESSAGES.serverError("cloudinary"));
    }

    return res.status(201).json({ restaurantId });
  } catch {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  const restaurantId = Number(req.params?.id);
  const userId = req.user?.id;
  const file = req.file;

  if (!userId || !restaurantId) {
    return res
      .status(400)
      .json(ERROR_MESSAGES.contentInvalid("userId or restaurantId"));
  }

  try {
    const updated = await restaurantServiceUpdate(
      restaurantId,
      req.body,
      userId
    );

    if (!updated)
      return res.status(404).json(ERROR_MESSAGES.contentInvalid("restaurant"));

    if (file) {
      const photoCreated = await photoServiceCreate(restaurantId, file.path);
      if (!photoCreated) {
        return res.status(500).json(ERROR_MESSAGES.serverError("cloudinary"));
      }
    }

    return res.status(200).json(updated);
  } catch {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const id = Number(req.params?.id);

  if (!userId || !id)
    return res
      .status(400)
      .json(ERROR_MESSAGES.contentInvalid("userId or restaurantId"));

  try {
    const deleted = await restaurantServiceDelete(id, userId);
    if (!deleted || deleted.affectedRows === 0)
      return res.status(404).json(ERROR_MESSAGES.contentInvalid("restaurant"));

    return res.status(200).json({ deleted });
  } catch {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const handleRestaurantSwipe = async (req: Request, res: Response) => {
  const { action, restaurantId } = req.body;
  const userId = getUserId(req);

  if (!userId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));
  if (req.user?.manager)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));
  if (!restaurantId || !action)
    return res
      .status(400)
      .json(ERROR_MESSAGES.contentInvalid("restaurantId or action"));

  try {
    const data = await restaurantServiceHandleSwipe(
      restaurantId,
      userId,
      action === "like"
    );
    if (!data)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(201).json(data);
  } catch {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const getLikeRestaurants = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));

  try {
    const restaurants = await restaurantServiceGetLike(userId);
    return res.status(200).json(restaurants);
  } catch {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

// -------------------- Favorite Controllers --------------------

export const addFavoriteRestaurant = async (req: Request, res: Response) => {
  const { restaurantId } = req.body;
  const userId = getUserId(req);

  if (!userId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));
  if (req.user?.manager)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));
  if (!restaurantId)
    return res.status(400).json(ERROR_MESSAGES.contentMissing("restaurantId"));

  try {
    const alreadyExists = await favoriteServiceGetOne(userId, restaurantId);
    if (alreadyExists)
      return res
        .status(400)
        .json(ERROR_MESSAGES.contentDuplicate("restaurantId"));

    const data = await favoriteServiceCreate(userId, restaurantId);
    if (!data)
      return res.status(500).json(ERROR_MESSAGES.serverError("service"));

    return res.status(201).json(data);
  } catch {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const deleteFavoriteRestaurant = async (req: Request, res: Response) => {
  const { restaurantId } = req.body;
  const userId = getUserId(req);

  if (!userId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));
  if (req.user?.manager)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));
  if (!restaurantId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("restaurantId"));

  try {
    const data = await favoriteServiceDelete(userId, restaurantId);
    if (!data || data.affectedRows === 0)
      return res
        .status(404)
        .json(ERROR_MESSAGES.contentInvalid("restaurantId"));

    return res.status(200).json(data);
  } catch {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};

export const getFavoriteRestaurants = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId)
    return res.status(400).json(ERROR_MESSAGES.contentInvalid("userId"));
  if (req.user?.manager)
    return res.status(400).json(ERROR_MESSAGES.accessDenied("unauthorized"));

  try {
    const data = await favoriteServiceGet(userId);
    return res.status(200).json(data);
  } catch {
    return res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
};
