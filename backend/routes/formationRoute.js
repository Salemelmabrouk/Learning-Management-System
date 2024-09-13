import express from "express";
import authenticateToken from '../middlewares/authRoutes.js';
 
import {
  createFormation,
  deleteTrainingById,
  getAllParticipants,
  getAllTrainings,
  getTrainingById,
  updateTrainingById,
  getAllParticipantsInAllTrainings,
  getTrainingsByTrainerId,
  addParticipant,
  getTrainerByTrainingId
} from "../controllers/formation.js";

const router = express.Router();

router.post('/create', authenticateToken, createFormation);
router.get('/all', authenticateToken,getAllTrainings);
router.get('/:id', authenticateToken,getTrainingById);
router.get('/:id/participants',authenticateToken, getAllParticipants);
router.post('/:formationId/assign/:participantId', authenticateToken,addParticipant);
router.put('/:id',authenticateToken, updateTrainingById);
router.delete('/delete/:id', authenticateToken,deleteTrainingById);
router.get('/participants/all',authenticateToken, getAllParticipantsInAllTrainings);
router.get('/trainings/:id', getTrainingsByTrainerId);
router.get('/trainer/:id', getTrainerByTrainingId);

export default router;
