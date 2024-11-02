import { Router } from "express";
import { authLogin, authRegister } from "../controllers/authController";

const customerRouter: Router = Router();

export { customerRouter };
