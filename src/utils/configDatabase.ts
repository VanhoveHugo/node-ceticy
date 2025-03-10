require("dotenv").config();
import mysql, { Connection, QueryError } from "mysql2";
import { configureLogger } from "./configLogger";

const logs = configureLogger();
let connection: Connection | null = null;

const connectWithRetry = () => {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_NAME;

  if (!host || !user || !password || !database) {
    logs.error("[API] Missing required database environment variables.");
    return;
  }

  connection = mysql.createConnection({
    host,
    user,
    password,
    database,
  });

  // Try to connect to the database
  connection.connect((err: QueryError | null) => {
    if (err) {
      logs.error("[API].connect : ", err);
      setTimeout(connectWithRetry, 10000);
    } else {
      logs.info("[API] Connected to MySQL");
      keepAlive();
    }
  });

  // Handle errors
  connection.on("error", (err: QueryError) => {
    logs.error("[API].on('error') : ", err);
    setTimeout(connectWithRetry, 10000);
  });
};

// Check if the connection is still active
const keepAlive = () => {
  setInterval(() => {
    if (connection) {
      connection.ping((err: QueryError | null) => {
        if (err) {
          logs.error("[API] Ping error: ", err);
          connectWithRetry();
        }
      });
    }
  }, 30000);
};

connectWithRetry();

export { connection };
