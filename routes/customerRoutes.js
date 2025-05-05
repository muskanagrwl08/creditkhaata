// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

router.use(authMiddleware); // Protect all routes below

router.post('/', createCustomer);
router.get('/', getCustomers);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.get('/report/pdf', generateCustomerPDF);


module.exports = router;

