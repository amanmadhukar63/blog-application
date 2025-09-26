import express from 'express';
import userRouter from './routes/user.route.js';

const app = express();

const corsOptions = {
  origin: ["*"],
  headers: ["Content-Type"],
  credentials: true,
};

app.use(express.json({limit: "16kb"}));

app.use('/auth', userRouter);

export default app;