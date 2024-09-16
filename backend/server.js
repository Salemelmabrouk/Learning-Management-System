import express from 'express';
import mongoose from 'mongoose';
import feedbackRoute from './routes/feedbackRoute.js';
import formationRoute from './routes/formationRoute.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import busboy from 'connect-busboy';
dotenv.config();

const app = express();

app.use(helmet());

const bb = busboy({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

app.use(bb);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(busboy());
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

// Routes
app.use('/api/users', userRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/formation", formationRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error object:", err); // Log the entire error object
  
  res.status(err.http_code || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    stack: err.stack || 'No stack trace available', // Provide fallback if stack is undefined
  });
});

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => {
    console.log('Database connected successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });
