import type { OpenAPIV3 } from "openapi-types";
import swaggerJsDoc from "swagger-jsdoc";

const isProd = process.env.NODE_ENV === "production";

export const swaggerDocs = swaggerJsDoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Ceticy",
      version: process.env.npm_package_version ?? "1.0.0",
      description: "API documentation for Ceticy Application",
      contact: {
        name: "Hugo V.",
        url: "https://vanhovehugo.dev",
        email: "contact@vanhovehugo.dev",
      },
    },
    servers: [
      isProd
        ? {
            url: "https://api.ceticy.fr",
            description: "Production",
          }
        : {
            url: "http://localhost:3000",
            description: "Development",
          },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
}) as OpenAPIV3.Document;
