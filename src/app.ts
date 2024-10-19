import express, { Express, Request, Response, NextFunction } from "express";
import router from "./routes/apiRouter";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";

// Load environment variables from a .env file (if present)
dotenv.config();

// Create an instance of the Express application
const app: Express = express();

// Middleware for parsing incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Security and configuration middlewares
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(compression());

// API routing middleware
app.use("/", router);

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
