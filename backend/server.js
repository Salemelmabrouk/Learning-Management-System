import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import feedbackRoute from './routes/feedbackRoute.js';
import formationRoute from './routes/formationRoute.js';
import userRoute from './routes/userRoute.js';
import authenticateToken from './middlewares/authRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true, // Allow cookies for authenticated requests
}));

// Routes
app.use('/api/users', userRoute);

// Apply authentication middleware before protected routes
app.use("/api/feedback",  feedbackRoute);
app.use("/api/formation", formationRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    status: 'error',
    message: 'Internal Server Error',
    error: err.message || 'Something broke!',
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
