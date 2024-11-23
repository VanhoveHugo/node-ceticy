import { connection } from "../utils/database";

export const customerServiceCreate = async (email: string, password: string) => {
  if (!connection) return
  try {
    const res: any = await connection
      .promise()
      .query("INSERT INTO users (email, password) VALUES (?, ?)", [email, password]);
    return res.insertId;
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
};

export const customerServiceFindByEmail = async (email: string) => {
  if (!connection) return;
  try {
    const res = await connection
      .promise()
      .query("SELECT id, email, password FROM users WHERE email = ? LIMIT 1", [email]);

    return res[0];
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
}

export const customerServiceFindById = async (id: number) => {
  if (!connection) return;
  try {
    const res = await connection
      .promise()
      .query(`SELECT * FROM users WHERE id = ?`, [id]);

    return res[0];
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
}