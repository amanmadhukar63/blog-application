import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';

dotenv.config();
const app = express();

const corsOptions = {
  origin: ["*"],
  headers: ["Content-Type"],
  credentials: true,
};

app.use(express.json({limit: "16kb"}));

app.use('/auth', userRouter);

export default app;