import { Router } from "express";
import { auth } from "../Middlewares/auth.js";
import { authorMiddleware } from "../Middlewares/author.js";
import { AuthorController } from "../Controllers/Author.js";
import { SocialMediaController } from "../Controllers/SocialMedia.js";
import { ContactController } from "../Controllers/Contact.js";

export const authorRouter = Router()

authorRouter.get('/:id', AuthorController.getById);
authorRouter.patch('/', [auth, authorMiddleware],AuthorController.edit);

authorRouter.get('/social/:id', SocialMediaController.getAllForAuthor);
authorRouter.post('/social', [auth, authorMiddleware],SocialMediaController.create);
authorRouter.patch('/social/:id', [auth, authorMiddleware],SocialMediaController.edit);
authorRouter.delete('/social', [auth, authorMiddleware],SocialMediaController.delete);

authorRouter.get('/contact/:id', ContactController.getAllForAuthor);
authorRouter.post('/contact', [auth, authorMiddleware],ContactController.create);
authorRouter.patch('/contact/:id', [auth, authorMiddleware],ContactController.edit);
authorRouter.delete('/contact', [auth, authorMiddleware],ContactController.delete);