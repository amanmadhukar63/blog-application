import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import blogRouter from './routes/blog.route.js';

dotenv.config();
const app = express();

const corsOptions = {
  origin: ["*"],
  headers: ["Content-Type"],
  credentials: true,
};

app.use(express.json({limit: "16kb"}));

app.use(cookieParser());

app.use('/auth', userRouter);

app.use('/blogs', blogRouter);

export default app;