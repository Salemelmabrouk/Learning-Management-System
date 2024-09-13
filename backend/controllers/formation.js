import Training from "../models/formation.js";
import User from '../models/userModel.js';

// Create a new training session
const createFormation = async (req, res) => {
  try {
    const formationData = req.body;
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const trainerId = req.user.id;
    const trainer = await User.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found." });
    }
    formationData.trainer = {
      id: trainerId,
      name: trainer.name
    };
    const newTraining = await Training.create(formationData);
    res.status(201).json({
      success: true,
      message: "Training created successfully",
      data: newTraining,
    });
  } catch (error) {
    console.error("Error creating training:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all training sessions
const getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find({});
    res.status(200).json(trainings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch training sessions." });
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

// Assign a participant to a training session
const addParticipant = async (req, res) => {
  try {
    const { formationId, participantId } = req.params;

    const training = await Training.findById(formationId);
    if (!training) {
      return res.status(404).json({ error: "Training session not found." });
    }

    if (training.participants.includes(participantId)) {
      return res.status(400).json({ error: "Participant already added." });
    }

    training.participants.push(participantId);
    await training.save();
    res.status(200).json(training);
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({ error: error.message });
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
