import { connection } from "../utils/database";

export const friendServiceCreate = async (userId1: number, userId2: number) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`INSERT INTO friends (user1Id, user2Id) VALUES (?, ?)`, [
        userId1,
        userId2,
      ]);

    if (res[0].length === 0) return null;
    return res[0];
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
};

export const friendServiceFindByIds = async (
  userId1: number,
  userId2: number
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`SELECT * FROM friends WHERE user1Id = ? AND user2Id = ?`, [
        userId1,
        userId2,
      ]);

    if (res[0].length === 0) return null;
    return res[0];
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
};

export const friendServiceHandleStatus = async(
  friendRequestId: number,
  status: string
) => {
  if (!connection) return;
  try {
    const res: any = await
    connection.promise().query(
      `UPDATE friends SET status = ? WHERE id = ?`,
      [status, friendRequestId]
      );

    if (res[0].length === 0) return null;
    return res[0];
  }
  catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
}

export const friendServiceGetCount = async (userId: number) => {
  if (!connection) return;
  try {
    const [res]: any = await connection
      .promise()
      .query(`SELECT COUNT(*) as count FROM friends WHERE (user1Id = ? OR user2Id = ?) AND status = 'accept'`, [
        userId,
        userId,
      ]);

    return res[0].count;
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
}