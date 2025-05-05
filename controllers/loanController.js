// controllers/loanController.js
const db = require('../db/database');

// Create Loan
const createLoan = (req, res) => {
  const { customer_id, amount, due_date } = req.body;

  if (!customer_id || !amount || !due_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const remaining_balance = amount;

  db.run(
    `INSERT INTO loans (customer_id, amount, due_date, remaining_balance) VALUES (?, ?, ?, ?)`,
    [customer_id, amount, due_date, remaining_balance],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create loan' });

      res.status(201).json({
        id: this.lastID,
        customer_id,
        amount,
        due_date,
        remaining_balance,
        status: 'pending',
      });
    }
  );
};

// Get Loans by Customer ID
const getLoansByCustomer = (req, res) => {
  const { customerId } = req.params;

  db.all(`SELECT * FROM loans WHERE customer_id = ?`, [customerId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve loans' });

    res.json(rows);
  });
};

// Repay Loan (update remaining_balance and status)
const repayLoan = (req, res) => {
    const { loanId } = req.params;
    const { payment } = req.body;
  
    db.get(`SELECT * FROM loans WHERE id = ?`, [loanId], (err, loan) => {
      if (err || !loan) return res.status(404).json({ error: 'Loan not found' });
  
      const newBalance = loan.remaining_balance - payment;
      const status = newBalance <= 0 ? 'paid' : 'pending';
      const paid_at = new Date().toISOString().split('T')[0];
  
      // First insert repayment into history
      db.run(
        `INSERT INTO repayments (loan_id, payment, paid_at) VALUES (?, ?, ?)`,
        [loanId, payment, paid_at],
        function (repaymentErr) {
          if (repaymentErr) {
            return res.status(500).json({ error: 'Failed to log repayment' });
          }
  
          // Then update the loan record
          db.run(
            `UPDATE loans SET remaining_balance = ?, status = ? WHERE id = ?`,
            [newBalance, status, loanId],
            function (updateErr) {
              if (updateErr) {
                return res.status(500).json({ error: 'Failed to update loan' });
              }
  
              res.json({
                message: 'Payment recorded',
                remaining_balance: newBalance,
                status,
              });
            }
          );
        }
      );
    });
  };
  
//overdue loan 
const getOverdueLoans = (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
    const query = `
      SELECT loans.*, customers.name AS customer_name 
      FROM loans 
      JOIN customers ON loans.customer_id = customers.id
      WHERE due_date < ? AND remaining_balance > 0
    `;
  
    db.all(query, [today], (err, rows) => {
      if (err) {
        console.error('Overdue Loan Error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch overdue loans' });
      }
  
      res.json(rows);
    });
  };


// Dashboard Summary
const getDashboardSummary = (req, res) => {
    const summaryQuery = `
      SELECT 
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM loans) AS total_loans,
        (SELECT IFNULL(SUM(amount), 0) FROM loans) AS total_amount_loaned,
        (SELECT IFNULL(SUM(payment), 0) FROM repayments) AS total_amount_repaid,
        (SELECT IFNULL(SUM(remaining_balance), 0) FROM loans) AS total_remaining_balance
    `;
  
    db.get(summaryQuery, [], (err, row) => {
      if (err) {
        console.error("Summary Fetch Error:", err.message);
        return res.status(500).json({ error: "Failed to fetch dashboard summary" });
      }
      console.log("Summary Row:", row);

      res.json(row);
    });
  };
//watsapp alert  
const sendWhatsappReminders = (req, res) => {
    const query = `
      SELECT loans.id, loans.due_date, loans.remaining_balance, customers.name, customers.phone
      FROM loans
      JOIN customers ON loans.customer_id = customers.id
      WHERE loans.remaining_balance > 0 AND DATE(loans.due_date) < DATE('now')
    `;
  
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Reminder Error:", err.message);
        return res.status(500).json({ error: "Failed to send reminders" });
      }
  
      rows.forEach((loan) => {
        console.log(`📲 WhatsApp Reminder to ${loan.name} (${loan.phone}):
  "Dear ${loan.name}, your loan #${loan.id} is overdue. Remaining: ₹${loan.remaining_balance}. Please repay at the earliest."`);
      });
  
      res.json({ message: "Reminders sent (logged to console)", count: rows.length });
    });
  };
  
  
module.exports = {
  createLoan,
  getLoansByCustomer,
  repayLoan,
  getOverdueLoans,
  getDashboardSummary,
  sendWhatsappReminders
};
