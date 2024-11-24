import { connection } from "../utils/database";

export const photoServiceCreate = async (restaurantId: number, url: string) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query("INSERT INTO photos (restaurantId, url) VALUES (?, ?)", [
        restaurantId,
        url,
      ]);

    return res[0].insertId;
  } catch (error: string | unknown) {
    console.error("Error during photo creation:", error);
  }
};
