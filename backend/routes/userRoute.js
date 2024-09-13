// userRoute.js
import express from 'express';
import { signupUser, loginUser, logoutUser, deleteUser, updateUser, getAllUsers, getUserById,getUserFormations , getUserByRole } from '../controllers/user.js';
import authenticateToken from '../middlewares/authRoutes.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // Ensure this route exists

router.delete('/:id', authenticateToken, deleteUser); // Requires authentication
router.put('/:id', authenticateToken, updateUser);    // Requires authentication
router.get('/', authenticateToken, getAllUsers);      // Requires authentication
router.get('/:id', authenticateToken, getUserById);   // Requires authentication
router.get('/:id/formations', authenticateToken, getUserFormations);
router.get('/by-role/:role', authenticateToken, getUserByRole);
export default router;

