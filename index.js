import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import { userRouter } from './Routes/users.js';
import { corsMiddleware } from './Middlewares/cors.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import cookieSession from 'cookie-session';


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

import './Config/passport.js';  // Archivo donde configurarás Passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Hola mundo')
})

app.use('/api/user', userRouter);


app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto: http://localhost:${PORT}`)
})