import { connection } from "../utils/connectionDatabase";
import { photoServiceGetByRestaurantId } from "./photoService";

// ------------------- Helpers -------------------
const getRestaurantWithPhotos = async (restaurant: any) => {
  const photos = await photoServiceGetByRestaurantId(restaurant.id);
  return { ...restaurant, photos };
};

// ------------------- CREATE -------------------
export const restaurantServiceCreate = async (
  name: string,
  ownerId: number,
  description?: string,
  averagePrice?: number,
  averageService?: number,
  phoneNumber?: string
) => {
  if (!connection) return null;

  try {
    const [result]: any = await connection.promise().query(
      `INSERT INTO restaurants (name, ownerId, description, averagePrice, averageService, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, ownerId, description, averagePrice, averageService, phoneNumber]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error during restaurant creation:", error);
    return null;
  }
};

// ------------------- GET LIST (filtered for swipes) -------------------
export const restaurantServiceGetList = async (customerId: number) => {
  if (!connection) return null;

  try {
    const [rows]: any = await connection.promise().query(
      `SELECT r.id, r.name, r.description, r.averagePrice, r.averageService, r.phoneNumber, r.address
       FROM restaurants r
       LEFT JOIN swipes s ON r.id = s.restaurantId AND s.userId = ?
       WHERE s.userId IS NULL
       ORDER BY r.id DESC
       LIMIT 20`,
      [customerId]
    );

    return await Promise.all(rows.map(getRestaurantWithPhotos));
  } catch (error) {
    console.error("Error getting restaurant list:", error);
    return null;
  }
};

// ------------------- GET BY MANAGER -------------------
export const restaurantServiceGetByManagerId = async (managerId: number) => {
  if (!connection) return null;

  try {
    const [rows]: any = await connection
      .promise()
      .query(`SELECT * FROM restaurants WHERE ownerId = ?`, [managerId]);

    return await Promise.all(rows.map(getRestaurantWithPhotos));
  } catch (error) {
    console.error("Error getting manager's restaurants:", error);
    return null;
  }
};

// ------------------- GET BY ID -------------------
export const restaurantServiceGetById = async (restaurantId: number) => {
  if (!connection) return null;

  try {
    const [rows]: any = await connection
      .promise()
      .query(`SELECT * FROM restaurants WHERE id = ?`, [restaurantId]);

    if (rows.length === 0) return null;

    return await getRestaurantWithPhotos(rows[0]);
  } catch (error) {
    console.error("Error getting restaurant by ID:", error);
    return null;
  }
};

// ------------------- GET LIKED -------------------
export const restaurantServiceGetLike = async (customerId: number) => {
  if (!connection) return null;

  try {
    const [rows]: any = await connection.promise().query(
      `SELECT r.* FROM restaurants r
       JOIN swipes s ON r.id = s.restaurantId
       WHERE s.userId = ? AND s.liked = 1
       ORDER BY s.timestamp DESC`,
      [customerId]
    );

    return await Promise.all(rows.map(getRestaurantWithPhotos));
  } catch (error) {
    console.error("Error getting liked restaurants:", error);
    return null;
  }
};

// ------------------- HANDLE SWIPE -------------------
export const restaurantServiceHandleSwipe = async (
  restaurantId: number,
  customerId: number,
  liked: boolean
) => {
  if (!connection) return false;

  try {
    await connection
      .promise()
      .query(
        `INSERT INTO swipes (restaurantId, userId, liked) VALUES (?, ?, ?)`,
        [restaurantId, customerId, liked]
      );

    return true;
  } catch (error) {
    console.error("Error during swipe:", error);
    return false;
  }
};

// ------------------- UPDATE -------------------
export const restaurantServiceUpdate = async (
  restaurantId: number,
  updatedData: Partial<{
    name: string;
    description: string;
    averagePrice: number;
    averageService: number;
    phoneNumber: string;
    address: string;
  }>,
  userId: number
) => {
  if (!connection) return null;

  const fields = Object.keys(updatedData);
  if (fields.length === 0) return null;

  const values = Object.values(updatedData);
  const setClause = fields.map((key) => `${key} = ?`).join(", ");

  try {
    const [res]: any = await connection
      .promise()
      .query(
        `UPDATE restaurants SET ${setClause} WHERE id = ? AND ownerId = ?`,
        [...values, restaurantId, userId]
      );

    if (res.affectedRows === 0) return null;

    return restaurantServiceGetById(restaurantId);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return null;
  }
};

// ------------------- DELETE -------------------
export const restaurantServiceDelete = async (
  restaurantId: number,
  userId: number
) => {
  if (!connection) return null;

  try {
    const [res]: any = await connection
      .promise()
      .query(`DELETE FROM restaurants WHERE id = ? AND ownerId = ?`, [
        restaurantId,
        userId,
      ]);

    return res;
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return null;
  }
};


export const restaurantServiceGetCount = async (customerId: number) => {
  if (!connection) return null;

  try {
    const [[{ count }]]: any = await connection
      .promise()
      .query(
        `SELECT COUNT(*) as count FROM swipes WHERE userId = ? AND liked = 1`,
        [customerId]
      );

    return count;
  } catch (error) {
    console.error("Error getting liked count:", error);
    return null;
  }
};
