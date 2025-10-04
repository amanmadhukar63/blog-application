import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import blogRouter from './routes/blog.route.js';
import uploadRouter from './routes/upload.route.js';
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();

const corsOptions = {
  origin: 'https://blog-aman-app.vercel.app',
  headers: ["Content-Type", "authorization"],
  credentials: true,
};

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json({limit: "16kb"}));

app.use(cors(corsOptions));

app.use(cookieParser());

app.use('/auth', userRouter);

app.use('/blogs', blogRouter);

app.use('/upload', uploadRouter);

export default app;