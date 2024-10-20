import dotenv from "dotenv";

dotenv.config() as unknown;

export const config = {
  PORT: process.env.PORT ?? 3000,
  JWT_SECRET: process.env.JWT_SECRET ?? "secret",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  SWAGGER_OPTIONS: {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Ceticy",
        version: "1.0.0",
        description: "API documentation for Ceticy Application",
        contact: {
          name: "Hugo V.",
          url: "https://vanhovehugo.dev",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development",
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
  },
};
