import swaggerJsDoc from "swagger-jsdoc";

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
      {
        url: "http://localhost:3000",
        description: "Development",
      },
      {
        url: "https://api.ceticy.fr",
        description: "Production",
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
});
