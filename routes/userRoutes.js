// routes/userRoutes.js

const express = require('express');
const { registerUser, loginUser} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Welcome user ID ${req.user.id}! This is protected data.` });
});


router.post('/register', registerUser);
router.post('/login', loginUser); 

module.exports = router;
