import express, {
  Express,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { router } from "./routes/apiRouter";
import { config } from "./config";
import { connection } from "./utils/database";
import { ERROR_MESSAGES } from "./utils/errorMessages";
dotenv.config();

const app: Express = express();
const swaggerDocs = swaggerJsDoc(config.SWAGGER_OPTIONS);

// Middleware for parsing incoming requests
app.use(express.urlencoded({ extended: true }) as RequestHandler);
app.use(express.json() as RequestHandler);

// Security and configuration middlewares
app.use(
  helmet({
    contentSecurityPolicy: config.NODE_ENV === "production" ? undefined : false,
    crossOriginEmbedderPolicy: false,
  }) as RequestHandler
);
app.use(cors() as RequestHandler);
app.use(compression() as RequestHandler);

// Log requests in development mode
if (config.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.info(
      `${req.method}:${req.originalUrl} ${JSON.stringify(req.body)}`
    );
    next();
  });
}

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

if (connection) {
  app.use("/", router);
}

// Error-handling middleware without the unused next parameter
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  console.error(err.stack);
  res.status(500).json(ERROR_MESSAGES.serverError("unknown"));
});

app.listen(3000);
