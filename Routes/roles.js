import { Router } from "express"
import { auth } from "../Middlewares/auth.js";
import { adminMiddleware } from "../Middlewares/admin.js";
import { RoleController } from "../Controllers/Roles.js";

export const roleRouter = Router();

roleRouter.get('/', [auth, adminMiddleware], RoleController.getAll)