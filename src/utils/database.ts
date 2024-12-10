require("dotenv").config();
import mysql, { Connection, QueryError } from "mysql2";

let connection: Connection | null = null;

// Fonction de connexion avec tentative de reconnexion
const connectWithRetry = () => {
  // Vérification que les variables d'environnement sont définies
  const host = process.env.MYSQL_HOST;
  const user = "root";
  const password = process.env.MYSQL_ROOT_PASSWORD;
  const database = process.env.MYSQL_NAME;

  if (!host || !user || !password || !database) {
    console.error("[API] Missing required database environment variables.");
    return;
  }

  // Création de la connexion MySQL
  connection = mysql.createConnection({
    host,
    user,
    password,
    database,
  });

  connection.connect((err: QueryError | null) => {
    if (err) {
      console.error("[API] connection.connect() error: ", err);
      // Tentative de reconnexion après 10 secondes
      setTimeout(connectWithRetry, 10000);
    } else {
      console.info("[API] MySQL connected");
      keepAlive(); // Garde la connexion active
    }
  });

  // Gestion des erreurs de connexion
  connection.on("error", (err: QueryError) => {
    console.error("[API] connection.on('error') : ", err);
    // Tentative de reconnexion après 10 secondes
    setTimeout(connectWithRetry, 10000);
  });
};

// Maintenir la connexion en vie
const keepAlive = () => {
  setInterval(() => {
    if (connection) {
      connection.ping((err: QueryError | null) => {
        if (err) {
          console.warn("[API] Ping error: ", err);
          connectWithRetry(); // Reconnexion en cas d'erreur de ping
        }
      });
    }
  }, 30000); // Envoi de "ping" toutes les 30 secondes
};

// Initialiser la connexion avec une tentative de reconnexion
connectWithRetry();

export { connection };
