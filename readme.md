# CrediKhaata

CrediKhaata is a backend project for managing credit sales, repayments, and overdue alerts. Built using Node.js, Express.js, and SQLite.

## Features

- User Registration & Login
- Customer Management (CRUD)
- Credit Loan Creation with Due Dates
- Repayment Tracking
- Overdue Alerts
- watsapp reminder
- pdf generator

## Tech Stack

- Node.js
- Express.js
- SQLite (with SQLite3)
- JWT for Authentication
- Moment.js for Date Handling
- pdfkit for pdf generator

## Setup

1. Clone the repo
2. Run npm install
3. Set up .env file with your JWT secret (if needed)
4. Run the server: node index.js

## API Endpoints


- /register – Register a new user
- /login – Login and get token
- /customers – Add/View/Edit/Delete customers
- /loans – Create/View loans
- /repayments – Record repayments
- /overdues – View overdue customers

---

