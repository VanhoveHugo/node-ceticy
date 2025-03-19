import { connection } from "../utils/configDatabase";

export const managerServiceCreate = async (
  email: string,
  password: string
) => {
  if (!connection) return;
  try {
    const res: any = await connection
      .promise()
      .query("INSERT INTO managers (email, password) VALUES (?, ?)", [
        email,
        password,
      ]);

    return res[0].insertId;
  } catch (error: string | unknown) {
    console.error("Error during manager registration:", error);
  }
};

export const managerServiceFindByEmail = async (email: string) => {
  if (!connection) return;
  try {
    const res : any = await connection
      .promise()
      .query(
        "SELECT id, email, password FROM managers WHERE email = ? LIMIT 1",
        [email]
      );

    if (res[0].length === 0) {
      return null;
    }
    
    return res[0];
  } catch (error: string | unknown) {
    console.error("Error during manager registration:", error);
  }
};

export const managerServiceFindById = async (id: number) => {
  if (!connection) return;
  try {
    const res = await connection
      .promise()
      .query(`SELECT * FROM managers WHERE id = ?`, [id]);

    return res[0];
  } catch (error: string | unknown) {
    console.error("Error during manager registration:", error);
  }
};

export const managerServiceDelete = async (id: number) => {
  if (!connection) return;
  try {
    const res = await connection
      .promise()
      .query(`DELETE FROM managers WHERE id = ?`, [id]);

    return res[0];
  } catch (error: string | unknown) {
    console.error(error);
  }
};
