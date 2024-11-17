import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import { userRouter } from './Routes/users.js';
import { postRouter } from './Routes/posts.js';
import { corsMiddleware } from './Middlewares/cors.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import './Config/passport.js';
import { likeRouter } from './Routes/likes.js';
import { commentRouter } from './Routes/comments.js';
import { roleRouter } from './Routes/roles.js';
import { categoryRouter } from './Routes/category.js';
import { authorRouter } from './Routes/author.js';


dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(corsMiddleware())
app.use(cookieParser())
app.use(urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));


app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Hola mundo')
})

app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/like', likeRouter);
app.use('/api/comment', commentRouter);
app.use('/api/rol', roleRouter);
app.use('/api/category', categoryRouter);
app.use('/api/author', authorRouter);


app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto: http://localhost:${PORT}`)
})