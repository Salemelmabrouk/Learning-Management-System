// routes/formationRoute.js

import express from 'express';
import authenticateToken from '../middlewares/authRoutes.js';
import { upload } from '../config/cloudinary.js';
import {
  createFormation,
  deleteTrainingById,
  getAllParticipants,
  getAllTrainings,
  getTrainingById,
  updateTrainingById,
  getAllParticipantsInAllTrainings,
  getTrainingsByTrainerId,
  assignParticipant,
  getTrainerByTrainingId,
  checkParticipantAssignment,
  desassignParticipant,addReview,
  updateReview,
  deleteReview,
  getReviews,  addToWishlist,
  removeFromWishlist
} from '../controllers/formation.js';

const router = express.Router();

// Define your routes
router.post('/create', authenticateToken, upload.single('image'), createFormation);
router.get('/all', authenticateToken, getAllTrainings);
router.get('/:id', authenticateToken, getTrainingById);
router.get('/:id/participants', authenticateToken, getAllParticipants);
router.get('/:formationId/participants/check/:participantId', authenticateToken, checkParticipantAssignment);
router.post('/:formationId/assign/:userId', authenticateToken, assignParticipant);

router.put('/:id/title', authenticateToken, updateTrainingById);
router.post('/:formationId/desassign/:userId', authenticateToken, desassignParticipant);

router.delete('/delete/:id', authenticateToken, deleteTrainingById);
router.get('/participants/all', authenticateToken, getAllParticipantsInAllTrainings);
router.get('/trainings/:id', authenticateToken, getTrainingsByTrainerId);
router.get('/trainer/:id', authenticateToken, getTrainerByTrainingId);
router.post('/:trainingId/reviews', authenticateToken, addReview);
 
// Update review
router.put('/:trainingId/reviews/:reviewId', authenticateToken, updateReview);

// Delete review
router.delete('/:trainingId/reviews/:reviewId', authenticateToken, deleteReview);

// Get all reviews for a training session
router.get('/:trainingId/reviews', authenticateToken, getReviews);


router.post('/:trainingId/wishlist', authenticateToken, addToWishlist);
router.delete('/:trainingId/wishlist', authenticateToken, removeFromWishlist);

export default router;
