import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import Training from '../models/formation.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
import asyncHandler from 'express-async-handler';
const app = express();

// Increase the body size limit for the request
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'TRAININGS',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage }).single('image');

// Create formation controller
const createFormation = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, description, place, trainingLevel, trainingCategory, curriculum, requirements } = req.body;

  if (!name || !startDate || !endDate || !place || !trainingCategory) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  const trainerId = req.user.id;
  const parsedCurriculum = JSON.parse(curriculum || '[]');
  const parsedRequirements = JSON.parse(requirements || '[]');

  const trainingData = {
    name, startDate, endDate, description, place, trainingLevel, trainingCategory,
    curriculum: parsedCurriculum, requirements: parsedRequirements, trainer: trainerId
  };

  if (req.file) {
    trainingData.image = req.file.path;
  } else {
    return res.status(400).json({ message: 'Image is required' });
  }

  const newTraining = new Training(trainingData);
  await newTraining.save();
  res.status(201).json(newTraining);
});



// Get all training sessions 
const getAllTrainings = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit, 10) || 10; // Default to limit 10

  if (page <= 0 || limit <= 0) {
    return res.status(400).json({ error: 'Page and limit must be positive integers.' });
  }

  try {
    const trainings = await Training.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const count = await Training.countDocuments();

    res.status(200).json({
      trainings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalItems: count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch training sessions.' });
  }
};






// Get a single training session by ID
const getTrainingById = async (req, res) => {
  try {
    const trainingId = req.params.id;
    const training = await Training.findById(trainingId);
    if (!training) {
      return res.status(404).json({ error: "Training session not found." });
    }
    res.status(200).json(training);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the training session." });
  }
};

// Get all participants of a training session
const getAllParticipants = async (req, res) => {
  try {
    const trainingId = req.params.id;
    const training = await Training.findById(trainingId).populate({
      path: "participants",
      model: "User",
      select: ["username", "Participants_institution"],
    });

    if (!training) {
      return res.status(404).json({ error: "Training session not found." });
    }
    
    res.status(200).json(training.participants);
  } catch (error) {
    res.status(500).json({ error: `Error fetching participants: ${error.message}` });
  }
};

// controllers/formation.js

const assignParticipant = asyncHandler(async (req, res) => {
  const { formationId } = req.params;
  const userId = req.user.id;

  try {
    const formation = await Training.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }

    if (formation.participants.includes(userId)) {
      return res.status(400).json({ message: 'User is already assigned' });
    }

    formation.participants.push(userId);
    await formation.save();

    res.status(200).json({ message: 'Participant added successfully', formation });
  } catch (error) {
    res.status(500).json({ message: `Error adding participant: ${error.message}` });
  }
});

const desassignParticipant = asyncHandler(async (req, res) => {
  const { formationId } = req.params;
  const userId = req.user.id;

  try {
    const formation = await Training.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }

    if (!formation.participants.includes(userId)) {
      return res.status(400).json({ message: 'User is not assigned to this formation' });
    }

    formation.participants = formation.participants.filter(participant => participant.toString() !== userId);
    await formation.save();

    res.status(200).json({ message: 'Participant removed successfully', formation });
  } catch (error) {
    res.status(500).json({ message: `Error removing participant: ${error.message}` });
  }
});


const checkParticipantAssignment = asyncHandler(async (req, res) => {
  const { formationId } = req.params;
  const userId = req.user.id;

  try {
    const formation = await Training.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }

    const isAssigned = formation.participants.includes(userId);

    res.status(200).json({ assigned: isAssigned });
  } catch (error) {
    res.status(500).json({ message: `Error checking participant assignment: ${error.message}` });
  }
});

// Update a training session by ID
const updateTrainingById = async (req, res) => {
  try {
    const trainingId = req.params.id;
    const { name, startDate, endDate, description, participants } = req.body;

    const updatedTraining = await Training.findByIdAndUpdate(
      trainingId,
      { name, startDate, endDate, description, participants },
      { new: true }
    );

    if (!updatedTraining) {
      return res.status(404).json({ error: "Training session not found." });
    }
    res.status(200).json(updatedTraining);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the training session." });
    console.error('Error details:', error.message, error.stack);
  }
};

// Delete a training session by ID
const deleteTrainingById = async (req, res) => {
  try {
    const trainingId = req.params.id;
    const deletedTraining = await Training.findByIdAndDelete(trainingId);

    if (!deletedTraining) {
      return res.status(404).json({ error: "Training session not found." });
    }
    res.status(200).json(deletedTraining);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the training session." });
  }
};

// Get all participants in all trainings
const getAllParticipantsInAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find({})
      .populate({
        path: "participants",
        model: "User",
        select: ["username"]
      });
    
    const results = trainings.map(training => ({
      ...training._doc,
      participantCount: training.participants.length
    }));

    const totalParticipants = results.reduce((sum, training) => sum + training.participantCount, 0);

    res.status(200).json({ trainings: results, totalParticipants });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch training sessions with participant counts." });
  }
};

// Get trainings by trainer ID
const getTrainingsByTrainerId = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const trainings = await Training.find({ "trainer.id": trainerId });

    if (trainings.length === 0) {
      return res.status(404).json({ message: "No training sessions found for this trainer." });
    }

    res.status(200).json(trainings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch training sessions for the trainer." });
  }
};

// Update user role to 'formateur'
const updateUserRoleToFormateur = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, { role: 'formateur' });
    console.log('User role updated to formateur');
  } catch (error) {
    console.error('Error updating user role', error);
  }
};

// Get trainer by training ID
const getTrainerByTrainingId = async (req, res) => {
  try {
    const trainingId = req.params.id;
    const training = await Training.findById(trainingId).populate({
      path: 'trainer.id',
      select: 'username email role',
    });

    if (!training) {
      return res.status(404).json({ error: "Training session not found." });
    }

    const trainer = training.trainer.id;

    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found." });
    }

    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trainer information." });
  }
};

// Add a review
const addReview = asyncHandler(async (req, res) => {
  const { trainingId } = req.params;
  const { rating, review } = req.body;
  const userId = req.user.id;

  if (!rating || !review) {
    return res.status(400).json({ message: 'Rating and review are required.' });
  }

  const training = await Training.findById(trainingId);
  if (!training) {
    return res.status(404).json({ message: 'Training session not found.' });
  }

  const newReview = { user: userId, rating, review };
  training.reviews.push(newReview);
  await training.save();

  res.status(201).json(newReview);
});

// Update a review
const updateReview = asyncHandler(async (req, res) => {
  const { trainingId, reviewId } = req.params;
  const { rating, review } = req.body;

  const training = await Training.findById(trainingId);
  if (!training) {
    return res.status(404).json({ message: 'Training session not found.' });
  }

  const reviewToUpdate = training.reviews.id(reviewId);
  if (!reviewToUpdate) {
    return res.status(404).json({ message: 'Review not found.' });
  }

  reviewToUpdate.rating = rating !== undefined ? rating : reviewToUpdate.rating;
  reviewToUpdate.review = review !== undefined ? review : reviewToUpdate.review;
  await training.save();

  res.status(200).json(reviewToUpdate);
});

// Delete a review
const deleteReview = asyncHandler(async (req, res) => {
  const { trainingId, reviewId } = req.params;

  const training = await Training.findById(trainingId);
  if (!training) {
    return res.status(404).json({ message: 'Training session not found.' });
  }

  const reviewToDelete = training.reviews.id(reviewId);
  if (!reviewToDelete) {
    return res.status(404).json({ message: 'Review not found.' });
  }

  reviewToDelete.remove();
  await training.save();

  res.status(200).json({ message: 'Review deleted successfully.' });
});

// Get all reviews for a training session
const getReviews = asyncHandler(async (req, res) => {
  const { trainingId } = req.params;

  const training = await Training.findById(trainingId).populate('reviews.user', 'username');
  if (!training) {
    return res.status(404).json({ message: 'Training session not found.' });
  }

  res.status(200).json(training.reviews);
});

// Add to Wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { trainingId } = req.params;
  const userId = req.user.id;

  try {
    const training = await Training.findById(trainingId);
    if (!training) {
      return res.status(404).json({ message: 'Training session not found' });
    }

    if (training.wishlist.includes(userId)) {
      return res.status(400).json({ message: 'Training already in wishlist' });
    }

    training.wishlist.push(userId);
    await training.save();

    res.status(200).json({ message: 'Added to wishlist', training });
  } catch (error) {
    res.status(500).json({ message: `Error adding to wishlist: ${error.message}` });
  }
});

// Remove from Wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { trainingId } = req.params;
  const userId = req.user.id;

  try {
    const training = await Training.findById(trainingId);
    if (!training) {
      return res.status(404).json({ message: 'Training session not found' });
    }

    if (!training.wishlist.includes(userId)) {
      return res.status(400).json({ message: 'Training not in wishlist' });
    }

    training.wishlist = training.wishlist.filter(id => id.toString() !== userId);
    await training.save();

    res.status(200).json({ message: 'Removed from wishlist', training });
  } catch (error) {
    res.status(500).json({ message: `Error removing from wishlist: ${error.message}` });
  }
});



export {
  createFormation,
  getAllTrainings,
  getTrainingById,
  getAllParticipants,
  assignParticipant,
 
  desassignParticipant,
  updateTrainingById,
  deleteTrainingById,
  getAllParticipantsInAllTrainings,
  getTrainingsByTrainerId,
  updateUserRoleToFormateur,
  getTrainerByTrainingId,
  checkParticipantAssignment,addReview,
  updateReview,
  deleteReview,
  getReviews,
  addToWishlist,
  removeFromWishlist
};
