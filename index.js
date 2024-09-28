import express from 'express';
import dotenv from 'dotenv';
import { userRouter } from './Routes/users.js';
import { corsMiddleware } from './Middlewares/cors.js';
import cookieParser from 'cookie-parser';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(corsMiddleware())
app.use(cookieParser())


app.get('/', (req, res) => {
    res.send('Hola mundo')
})

app.use('/api/user', userRouter);

app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto: http://localhost:${PORT}`)
})