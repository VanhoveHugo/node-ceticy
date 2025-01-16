import { connection } from "../utils/database";

export const favoriteServiceCreate = async (
  userId: number,
  restaurantId: number
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`INSERT INTO favorites (userId, restaurantId) VALUES (?, ?)`, [
        userId,
        restaurantId,
      ]);

    if (res[0].length === 0) return null;
    return res[0];
  } catch (error: any) {
    console.error(error);
  }
};

export const favoriteServiceDelete = async (
  userId: number,
  restaurantId: number
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`DELETE FROM favorites WHERE userId = ? AND restaurantId = ?`, [
        userId,
        restaurantId,
      ]);

    if (res[0].length === 0) return null;
    return res[0];
  } catch (error: any) {
    console.error(error);
  }
};

export const favoriteServiceGet = async (userId: number) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`SELECT * FROM favorites WHERE userId = ?`, [userId]);

    return res[0];
  } catch (error: any) {
    console.error(error);
  }
};

export const favoriteServiceGetOne = async (
  userId: number,
  restaurantId: number
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`SELECT * FROM favorites WHERE userId = ? AND restaurantId = ?`, [
        userId,
        restaurantId,
      ]);

    if (res[0].length === 0) return null;
    return res[0];
  } catch (error: any) {
    console.error(error);
  }
};
