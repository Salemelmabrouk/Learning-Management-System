// userRoute.js
import express from 'express';
import { signupUser, loginUser, logoutUser, deleteUser, updateUser, getAllUsers, getUserById,getUserFormations , getUserByRole,addToWishlist,    removeFromWishlist,
    getWishlist ,getWishlistAndCheckFormation} from '../controllers/user.js';
import authenticateToken from '../middlewares/authRoutes.js';

const router = express.Router();

// User authentication routes
router.post('/signup', signupUser); // User signup
router.post('/login', loginUser); // User login
router.post('/logout', logoutUser); // User logout

// User management routes
router.delete('/:id', authenticateToken, deleteUser); // Delete user by ID
router.put('/:id', authenticateToken, updateUser); // Update user by ID
router.get('/all', authenticateToken, getAllUsers); // Get all users
router.get('/:id', authenticateToken, getUserById); // Get user by ID
router.get('/:id/formations', authenticateToken, getUserFormations); // Get formations by user ID
router.get('/by-role/:role', authenticateToken, getUserByRole); // Get users by role

// Wishlist management routes
router.post('/wishlist/add/:formationId', authenticateToken, addToWishlist); // Add formation to wishlist
router.post('/wishlist/remove/:formationId', authenticateToken, removeFromWishlist); // Remove formation from wishlist
router.get('/wishlist', authenticateToken, getWishlist); // Get user's wishlist
router.get('/wishlist/check/:formationId', authenticateToken, getWishlistAndCheckFormation); // Check if formation is in wishlist

router.get('/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    console.log('Received user ID:', userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('Invalid user ID format');
        return res.status(400).json({ message: 'Invalid user ID format' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

 

export default router;

