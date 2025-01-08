import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { router } from "./routes/apiRouter";
import { config } from "./config";
import { connection } from "./utils/database";
// Load environment variables from a .env file (if present)
dotenv.config();

// Create an instance of the Express application
const app: Express = express();

// Swagger configuration
const swaggerDocs = swaggerJsDoc(config.SWAGGER_OPTIONS);

// Middleware for parsing incoming requests
app.use(express.urlencoded({ extended: true }) as express.RequestHandler);
app.use(express.json() as express.RequestHandler);

// Security and configuration middlewares
app.use(
  helmet({
    contentSecurityPolicy: config.NODE_ENV === "production" ? undefined : false,
    crossOriginEmbedderPolicy: false,
  }) as express.RequestHandler
);
app.use(cors() as express.RequestHandler);
app.use(compression() as express.RequestHandler);

app.use((req, res, next) => {
  console.info(`${req.method}:${req.originalUrl} ${JSON.stringify(req.body)}`);
  next();
});

// Set up Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API routing middleware
if (connection) {
  app.use("/", router)
}

// Error-handling middleware without the unused next parameter
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export { app };
