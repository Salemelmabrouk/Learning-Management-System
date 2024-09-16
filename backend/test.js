import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import path from 'path';

dotenv.config(); // Load environment variables from .env file

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log(cloudinary.v2.config())
// Define the file path
const filePath = path.resolve('test.jpg');

// Upload a test image
cloudinary.v2.uploader.upload(filePath, (error, result) => {
  if (error) {
    console.error("Error uploading image:", error);
  } else {
    console.log("Upload successful:", result);
  }
});

