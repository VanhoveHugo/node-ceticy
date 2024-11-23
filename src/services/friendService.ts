import { connection } from "../utils/database";

export const friendServiceCreate = async (userId1: number, userId2: number) => {
  if (!connection) return;
  try {
    return connection.query(
      `INSERT INTO friends (user1Id, user2Id) VALUES (?, ?)`,
      [userId1, userId2]
    );
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
};

export const friendServiceFindByIds = async (userId1: number, userId2: number) => {
  if (!connection) return;
  try {
    return connection.query(
      `SELECT * FROM friends WHERE user1Id = ? AND user2Id = ?`,
      [userId1, userId2]
    );
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
};
