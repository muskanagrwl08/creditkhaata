// routes/loanRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const authenticateToken = require('../middleware/authMiddleware');


const {
  createLoan,
  getLoansByCustomer,
  repayLoan,
  getOverdueLoans,
  getDashboardSummary,
  sendWhatsappReminders
} = require('../controllers/loanController');

router.use(authMiddleware);

router.post('/', createLoan); // Create a new loan
router.get('/:customerId', getLoansByCustomer); // Get loans for a customer
router.put('/repay/:loanId', repayLoan); // Repay loan
router.get('/overdue',authenticateToken, getOverdueLoans);
router.get('./summary',authenticateToken, getDashboardSummary)
router.post('/reminders', sendWhatsappReminders);



module.exports = router;