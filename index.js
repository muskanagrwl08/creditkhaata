// index.js
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const loanRoutes = require('./routes/loanRoutes');
const repaymentRoutes = require('./routes/repaymentRoutes');

require('dotenv').config();
const express = require('express');
const db = require('./db/database');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON
app.use('/api', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/loans', loanRoutes);
app.use("/repayments", repaymentRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('CrediKhaata Backend Running ✅');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});