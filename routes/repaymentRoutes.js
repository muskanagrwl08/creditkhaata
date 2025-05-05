const express = require("express");
const router = express.Router();
const { addRepayment } = require("../controllers/repaymentController");

router.post("/", addRepayment);

module.exports = router;

