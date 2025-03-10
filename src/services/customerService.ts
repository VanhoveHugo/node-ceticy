import { connection } from "../utils/database";

export const customerServiceCreate = async (
  email: string,
  password: string
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query("INSERT INTO users (email, password) VALUES (?, ?)", [
        email,
        password,
      ]);

    return res[0].insertId;
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const customerServiceFindByEmail = async (email: string) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query("SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1", [
        email,
      ]);

    if (res[0].length === 0) {
      return null;
    }

    return res[0];
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const customerServiceFindById = async (id: number) => {
  if (!connection) return;
  try {
    const res = await connection
      .promise()
      .query(`SELECT * FROM users WHERE id = ?`, [id]);

    return res[0];
  } catch (error: string | unknown) {
    console.error(error);
  }
};

export const customerServiceDelete = async (id: number) => {
  if (!connection) return;
  try {
    const res = await connection
      .promise()
      .query(`DELETE FROM users WHERE id = ?`, [id]);

    return res[0];
  } catch (error: string | unknown) {
    console.error(error);
  }
}
