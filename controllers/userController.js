// controllers/userController.js

const bcrypt = require('bcryptjs');
const db = require('../db/database');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (row) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Insert new user
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function (err) {
        if (err) {
            console.error('Register Error:', err.message); 
          return res.status(500).json({ error: 'Failed to register user' });
        }

        const userId = this.lastID;
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: 'User registered successfully', token });
      }
    );
  });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Login Error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Create token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(200).json({ message: 'Login successful', token });
    });
  };
  
 
  
module.exports = { registerUser, loginUser };
