import { Router } from "express";
import { customerRouter } from "./customerRoutes";

const authRouter: Router = Router();

authRouter.use("/users", customerRouter);

export { authRouter };
