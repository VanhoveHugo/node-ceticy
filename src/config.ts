const version = process.env.npm_package_version || "1.0.0";

export const config = {
  JWT_SECRET: process.env.JWT_SECRET ?? "secret",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  SWAGGER_OPTIONS: {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Ceticy",
        version: version,
        description: "API documentation for Ceticy Application",
        contact: {
          name: "Hugo V.",
          url: "https://vanhovehugo.dev",
          email: "contact@vanhovehugo.dev"
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
  },
};
