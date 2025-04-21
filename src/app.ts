import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { configureLogger } from "./utils/logger";
import { corsOptions } from "./conf/cors";
import { rateLimiter } from "./conf/limiter";
import { router } from "./routes/apiRouter";
import { connection } from "./utils/connectionDatabase";

const app: Express = express();
const logs = configureLogger();

// Parse incoming request bodies (URL-encoded and JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);

// Allowing cross-origin requests
app.use(cors(corsOptions));

// Minify responses
app.use(compression());

// Limit the number of requests
app.use(rateLimiter);

// Set the trust proxy to true to enable rate limiting based on the client's IP address
app.set("trust proxy", true);

// Log each request
app.use((req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("fr-FR");
  const formattedTime = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  logs.info(
    `Request: [${formattedDate} à ${formattedTime}] ${req.method} ${req.originalUrl}`
  );

  const ip = req.ip;

  console.log(
    `[${formattedDate} à ${formattedTime}] ${req.method} ${req.originalUrl} - IP: ${ip}`
  );

  next();
});

// If a database connection exists, use the router to handle requests
if (connection) {
  app.use("/", router);
}

if (process.env.NODE_ENV === "test") {
  app.get("/test", (req: Request, res: Response) => {
    res.status(200).json({ message: "router" });
  });
}

export { app };
