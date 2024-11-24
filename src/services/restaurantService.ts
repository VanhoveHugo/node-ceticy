import { connection } from "../utils/database";

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

export const restaurantServiceGetList = async () => {
  if (!connection) return;
  try {
    const res = await connection.promise().query("SELECT * FROM restaurants");

    return res[0];
  } catch (error: string | unknown) {
    console.error("Error during restaurant creation:", error);
  }
};
