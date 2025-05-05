const moment = require("moment");
const db = require('../db/database');

const addRepayment = (req, res) => {
  const { loan_id, payment } = req.body;
  const paymentDate = moment().format("YYYY-MM-DD");

  const insertQuery = `
    INSERT INTO repayments (loan_id, payment, payment_date)
    VALUES (?, ?, ?)
  `;

  db.run(insertQuery, [loan_id, payment, paymentDate], function (err) {
    if (err) {
      console.error("Repayment Error:", err.message);
      return res.status(500).json({ error: "Failed to record repayment" });
    }

    // Update loan remaining balance
    const updateQuery = `
      UPDATE loans
      SET remaining_balance = remaining_balance - ?
      WHERE id = ?
    `;

    db.run(updateQuery, [payment, loan_id], function (err) {
      if (err) {
        console.error("Balance Update Error:", err.message);
        return res.status(500).json({ error: "Failed to update loan balance" });
      }

      res.json({ message: "Repayment recorded successfully" });
    });
  });
};

module.exports = { addRepayment };

