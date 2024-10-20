import express, { Express, Request, Response } from "express";
import { router } from "./routes/apiRouter";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";

// Load environment variables from a .env file (if present)
dotenv.config();

// Create an instance of the Express application
const app: Express = express();

// Middleware for parsing incoming requests
app.use(express.urlencoded({ extended: true }) as express.RequestHandler);
app.use(express.json() as express.RequestHandler);

// Security and configuration middlewares
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
    crossOriginEmbedderPolicy: false,
  }) as express.RequestHandler
);
app.use(cors() as express.RequestHandler);
app.use(compression() as express.RequestHandler);

// API routing middleware
app.use("/", router);

// Error-handling middleware without the unused next parameter
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export { app };
