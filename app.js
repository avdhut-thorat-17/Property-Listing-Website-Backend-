import express from 'express';
import cors from 'cors'; // Import CORS middleware
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route.js';
import connectDB from './db.js';
import { configDotenv } from 'dotenv';

// Load environment variables from .env file
configDotenv();

const app = express();

connectDB();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoute);

app.listen(8800, () => {
    console.log("Server is running on 8800");
});
