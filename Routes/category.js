import { Router } from "express";
import { CategoryController } from "../Controllers/Category.js";
import { auth } from "../Middlewares/auth.js";
import { adminMiddleware } from "../Middlewares/admin.js";

export const categoryRouter = Router()

categoryRouter.get('/', CategoryController.getAll)
categoryRouter.get('/:id', CategoryController.getById)
categoryRouter.post('/', [auth, adminMiddleware], CategoryController.create)
categoryRouter.patch('/:id', [auth, adminMiddleware], CategoryController.edit)
categoryRouter.delete('/', [auth, adminMiddleware], CategoryController.delete)