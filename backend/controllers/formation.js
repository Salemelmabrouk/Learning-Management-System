import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import Training from '../models/formation.js';
import dotenv from 'dotenv';

dotenv.config();

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
const createFormation = async (req, res) => {
  try {
    const { name, startDate, endDate, description, place, trainingLevel, trainingCategory, curriculum, requirements } = req.body;

    if (!name || !startDate || !endDate || !place || !trainingCategory) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    let parsedCurriculum = [];
    let parsedRequirements = [];
    try {
      parsedCurriculum = JSON.parse(curriculum || '[]');
      parsedRequirements = JSON.parse(requirements || '[]');
    } catch (error) {
      return res.status(400).json({ message: 'Invalid JSON format for curriculum or requirements' });
    }

    const trainingData = {
      name,
      startDate,
      endDate,
      description,
      place,
      trainingLevel,
      trainingCategory,
      curriculum: parsedCurriculum,
      requirements: parsedRequirements,
    };

    // Handle image upload
    if (req.file) {
      trainingData.image = req.file.path;  // Cloudinary URL as string
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newTraining = new Training(trainingData);
    await newTraining.save();
    res.status(201).json(newTraining);

  } catch (error) {
    console.error('Error creating training:', error);
    res.status(500).json({ message: 'Error creating training', error });
  }
};


// Get all training sessions
const getAllTrainings = async (req, res) => {
  // Default values for pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

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

const addParticipant = async (req, res) => {
  try {
    const { formationId, participantId } = req.params;

    // Validate IDs
    if (!formationId || !participantId) {
      return res.status(400).json({ error: "Formation ID and Participant ID are required." });
    }

    // Find the training session by ID
    const training = await Training.findById(formationId);
    if (!training) {
      return res.status(404).json({ error: "Training session not found." });
    }

    // Log the current training document for debugging
    console.log('Current Training:', training);

    // Check if participant is already added
    if (training.participants.includes(participantId)) {
      return res.status(400).json({ error: "Participant already added." });
    }

    // Add participant to the training session
    training.participants.push(participantId);

    // Save the updated training document
    await training.save();

    // Optionally, you can populate participant details if needed
    // const populatedTraining = await Training.findById(formationId).populate('participants');

    res.status(200).json(training);
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


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

export {
  createFormation,
  getAllTrainings,
  getTrainingById,
  getAllParticipants,
  addParticipant,
  updateTrainingById,
  deleteTrainingById,
  getAllParticipantsInAllTrainings,
  getTrainingsByTrainerId,
  updateUserRoleToFormateur,
  getTrainerByTrainingId
};
