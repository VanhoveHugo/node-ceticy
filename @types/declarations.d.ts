declare module "cors";
declare module "compression";
declare module "swagger-jsdoc";
declare module "swagger-ui-express";

declare const Express: () => void;
declare const dotenv: { config: () => void };
declare const cors: () => void;
declare const express: { urlencoded: () => void, json: () => void };
declare const helmet: () => void;
declare const swaggerJsDoc: () => void;
declare const compression: () => void;
declare const swaggerUi: { serve: void; setup: () => void };
declare const jwt: { sign: () => void };

declare const hashSync: () => void;
declare const compareSync: () => void;
