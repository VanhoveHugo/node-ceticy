import { connection } from "../utils/database";
import { photoServiceGetByRestaurantId } from "./photoService";

export const restaurantServiceCreate = async (
  name: string,
  ownerId: number,
  description?: string,
  averagePrice?: number,
  averageService?: number,
  phoneNumber?: string
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(
        "INSERT INTO restaurants (name, ownerId, description, averagePrice, averageService, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)",
        [name, ownerId, description, averagePrice, averageService, phoneNumber]
      );

    return res[0].insertId;
  } catch (error: string | unknown) {
    console.error("Error during restaurant creation:", error);
  }
};

export const restaurantServiceGetList = async (customerId: number) => {
  if (!connection) return;
  try {
    const res = await connection.promise().query(
      `SELECT r.id, r.name, r.description, r.averagePrice, r.averageService, r.phoneNumber
        FROM restaurants r
        LEFT JOIN swipes s ON r.id = s.restaurantId AND s.userId = ?
        WHERE s.userId IS NULL
        LIMIT 20`,
      [customerId]
    );

    let data: any = res[0];

    data = await Promise.all(
      data.map(async (restaurant: any) => {
        const photos = await photoServiceGetByRestaurantId(restaurant.id);
        return { ...restaurant, photos };
      })
    );

    return data;
  } catch (error: string | unknown) {
    console.error("Error during restaurant creation:", error);
  }
};

export const restaurantServiceGetByManagerId = async (managerId: number) => {
  if (!connection) return;
  try {
    const res = await connection
      .promise()
      .query("SELECT * FROM restaurants WHERE ownerId = ?", [managerId]);

    let data: any = res[0];

    data = await Promise.all(
      data.map(async (restaurant: any) => {
        const photos = await photoServiceGetByRestaurantId(restaurant.id);
        return { ...restaurant, photos };
      })
    );

    return data;
  } catch (error: string | unknown) {
    console.error("Error during restaurant creation:", error);
  }
};

export const restaurantServiceHandleSwipe = async (
  restaurantId: number,
  customerId: number,
  liked: boolean
) => {
  if (!connection) return;
  try {
    await connection
      .promise()
      .query(
        "INSERT INTO swipes (restaurantId, userId, liked) VALUES (?, ?, ?)",
        [restaurantId, customerId, liked]
      );

    return true;
  } catch (error: string | unknown) {
    console.error("Error during swipe:", error);
    return false;
  }
};

export const restaurantServiceGetCount = async (customerId: number) => {
  if (!connection) return;
  try {
    const [res]: any = await connection
      .promise()
      .query(
        `SELECT COUNT(*) as count FROM swipes WHERE userId = ? AND liked = 1`,
        [customerId]
      );

    return res[0].count;
  } catch (error: string | unknown) {
    console.error("Error during restaurant count:", error);
  }
};

export const restaurantServiceGetLike = async (customerId: number) => {
  if (!connection) return;
  try {
    const res = await connection.promise().query(
      `SELECT * FROM restaurants r
        JOIN swipes s ON r.id = s.restaurantId
        WHERE s.userId = ?
        AND s.liked = 1
        ORDER BY s.timestamp DESC`,
      [customerId]
    );

    let data: any = res[0];

    data = await Promise.all(
      data.map(async (restaurant: any) => {
        const photos = await photoServiceGetByRestaurantId(
          restaurant.restaurantId
        );
        return { ...restaurant, photos };
      })
    );

    return data;
  } catch (error: string | unknown) {
    console.error("Error during restaurant creation:", error);
  }
};

export const restaurantServiceGetById = async (restaurantId: number) => {
  if (!connection) return;
  try {
    const res = await connection
      .promise()
      .query("SELECT * FROM restaurants WHERE id = ?", [restaurantId]);

    let data: any = res[0];

    if (Array.isArray(data) && data.length > 0) {
      let restaurant = data[0];

      const photos = await photoServiceGetByRestaurantId(restaurant.id);
      restaurant = { ...restaurant, photos };

      return restaurant;
    }

    return null;
  } catch (error: string | unknown) {
    console.error("Error during restaurant creation:", error);
  }
};