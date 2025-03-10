import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { configureLogger } from "./utils/configLogger";
import { corsOptions } from "./middleware/corsMiddleware";
import { rateLimiter } from "./middleware/rateLimiter";
import { ERROR_MESSAGES } from "./utils/errorMessages";
import { router } from "./routes/apiRouter";
import { connection } from "./utils/configDatabase";

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

// Log each request
app.use((req, res, next) => {
  logs.info(`Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Log each error
app.use(
  (
    err: { message: any; stack: any },
    req: any,
    res: any,
    next: (arg0: any) => void
  ) => {
    logs.error(`Error: ${err.message} - ${err.stack}`);
    res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
  }
);

// If a database connection exists, use the router to handle requests
if (connection) {
  app.use("/", router);
}

export { app };
