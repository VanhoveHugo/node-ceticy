import { connection } from "../utils/database";

export const pollServiceCreate = async(name: string, creatorId: number) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`INSERT INTO polls (name, creatorId) VALUES (?, ?)`, [
        name,
        creatorId,
      ]);

    if (res[0].length === 0) return null;
    return res[0];
  }
  catch (error: string | unknown) {
    console.error(error);
  }
}

export const pollServiceUpdate = async (pollId: number, name: string, creatorId: number) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`UPDATE polls SET name = ? WHERE id = ? AND creatorId = ?`, [
        name,
        pollId,
        creatorId,
      ]);

    if (res[0].length === 0) return null;
    return res[0];
  }
  catch (error: string | unknown) {
    console.error(error);
  }
}

export const pollServiceDelete = async (pollId: number, creatorId: number) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`DELETE FROM polls WHERE id = ? AND creatorId = ?`, [
        pollId,
        creatorId,
      ]);

    if (res[0].length === 0) return null;
    return res[0];
  }
  catch (error: string | unknown) {
    console.error(error);
  }
}

export const pollServiceCount = async (creatorId: number) => {
  if (!connection) return;
  try {
    const [res]: any = await connection
      .promise()
      .query(`SELECT COUNT(*) as count FROM polls WHERE creatorId = ?`, [
        creatorId,
      ]);

    return res[0].count;
  }
  catch (error: string | unknown) {
    console.error(error);
  }
}