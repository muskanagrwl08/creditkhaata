// db/database.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'credikhaata.db'), (err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to SQLite database 🗂️');
  }
});

// Create Users Table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
  
  // Create Customers Table
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      trust_score INTEGER DEFAULT 5,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  // Create Loans Table
  db.run(`
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      remaining_balance REAL NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);
  //repayments
  db.run(`
      CREATE TABLE IF NOT EXISTS repayments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loan_id INTEGER,
        payment INTEGER,
        payment_date TEXT,
        FOREIGN KEY (loan_id) REFERENCES loans(id)
      );


    `)
  

module.exports = db;
