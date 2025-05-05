// controllers/customerController.js
const db = require('../db/database');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create Customer
const createCustomer = (req, res) => {
  const { name, phone, trust_score = 5 } = req.body;
  const userId = req.user.id;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  db.run(
    `INSERT INTO customers (user_id, name, phone, trust_score) VALUES (?, ?, ?, ?)`,
    [userId, name, phone, trust_score],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create customer' });

      res.status(201).json({ id: this.lastID, name, phone, trust_score });
    }
  );
};

// Get All Customers for Logged-in User
const getCustomers = (req, res) => {
  const userId = req.user.id;

  db.all(`SELECT * FROM customers WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch customers' });

    res.json(rows);
  });
};

// Update Customer
const updateCustomer = (req, res) => {
  const { name, phone, trust_score } = req.body;
  const customerId = req.params.id;
  const userId = req.user.id;

  db.run(
    `UPDATE customers SET name = ?, phone = ?, trust_score = ? WHERE id = ? AND user_id = ?`,
    [name, phone, trust_score, customerId, userId],
    function (err) {
      if (err || this.changes === 0)
        return res.status(404).json({ error: 'Customer not found or not updated' });

      res.json({ message: 'Customer updated successfully' });
    }
  );
};

// Delete Customer
const deleteCustomer = (req, res) => {
  const customerId = req.params.id;
  const userId = req.user.id;

  db.run(`DELETE FROM customers WHERE id = ? AND user_id = ?`, [customerId, userId], function (err) {
    if (err || this.changes === 0)
      return res.status(404).json({ error: 'Customer not found or already deleted' });

    res.json({ message: 'Customer deleted successfully' });
  });
};

//pdf
const generateCustomerPDF = (req, res) => {
  const query = `SELECT * FROM customers`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("PDF Generation Error:", err.message);
      return res.status(500).json({ error: "Failed to generate PDF" });
    }

    const doc = new PDFDocument();
    const filePath = 'customers_report.pdf';
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text('Customer Report', { align: 'center' });
    doc.moveDown();

    rows.forEach((cust, index) => {
      doc.fontSize(12).text(
        `${index + 1}. Name: ${cust.name}, Phone: ${cust.phone}, Address: ${cust.address}`
      );
    });

    doc.end();

    doc.on('finish', () => {
      res.download(filePath, 'customers_report.pdf');
    });
  });
};

module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
};

