import { connection } from "../utils/connectionDatabase";

export const pollServiceGetAll = async (creatorId: number) => {
  if (!connection) return;
  try {
    // polls.creatorId or poll_participants.userId
    const [res]: any = await connection.promise().query(
      `SELECT
          polls.id,
          polls.name,
          polls.creatorId,
          GROUP_CONCAT(DISTINCT poll_participants.userId) AS participants,
          GROUP_CONCAT(DISTINCT poll_options.restaurantId) AS options
      FROM polls
      LEFT JOIN poll_participants ON polls.id = poll_participants.pollId
      LEFT JOIN poll_options ON polls.id = poll_options.pollId
      WHERE polls.creatorId = ? OR poll_participants.userId = ?
      GROUP BY polls.id, polls.name, polls.creatorId;
      `,
      [creatorId, creatorId]
    );

    return res;
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const pollServiceCreate = async (name: string, creatorId: number) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`INSERT INTO polls (name, creatorId) VALUES (?, ?)`, [
        name,
        creatorId,
      ]);

    if (res[0].length === 0) return null;
    return res[0].insertId;
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const pollServiceUpdate = async (
  pollId: number,
  name: string,
  creatorId: number
) => {
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
  } catch (error: string | unknown) {
    console.error(error);
  }
};

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
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const pollServiceCount = async (creatorId: number) => {
  if (!connection) return;
  try {
    const [res]: any = await connection
      .promise()
      .query(`SELECT COUNT(*) as count FROM polls WHERE creatorId = ?`, [
        creatorId,
      ]);

    return res[0].count;
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const pollServiceCheckIsCreator = async (
  pollId: number,
  creatorId: number
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`SELECT * FROM polls WHERE id = ? AND creatorId = ?`, [
        pollId,
        creatorId,
      ]);

    if (res[0].length === 0) return null;
    return res[0];
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const pollServiceCheckIsValidParticipant = async (userId: number) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`SELECT * FROM users WHERE id = ?`, [userId]);

    if (res[0].length === 0) return null;
    return res[0];
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const pollServiceParticipantAdd = async (
  pollId: number,
  userId: number
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`INSERT INTO poll_participants (pollId, userId) VALUES (?, ?)`, [
        pollId,
        userId,
      ]);

    if (res[0].length === 0) return null;
    return res[0];
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const pollServiceRestaurantsAdd = async (
  pollId: number,
  restaurantId: number
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`INSERT INTO poll_options (pollId, restaurantId) VALUES (?, ?)`, [
        pollId,
        restaurantId,
      ]);

    if (res[0].length === 0) return null;
    return res[0];
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const pollServiceParticipantRemove = async (
  pollId: number,
  userId: number
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(`DELETE FROM poll_participants WHERE pollId = ? AND userId = ?`, [
        pollId,
        userId,
      ]);

    if (res[0].affectedRows === 0) return null;
    return res[0];
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const pollServiceVoteAdd = async (
  pollId: number,
  userId: number,
  optionId: number,
  vote: boolean
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query(
        `INSERT INTO poll_votes (pollId, userId, optionId, vote) VALUES (?, ?, ?, ?)`,
        [pollId, userId, optionId, vote]
      );

    if (res[0].length === 0) return null;
    return res[0];
  } catch (error: string | unknown) {
    console.error(error);
  }
};