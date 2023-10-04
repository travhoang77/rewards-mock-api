const express = require('express');
const cors = require("cors")
const { calculateRewardPoints } = require('./util/rewards')
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(cors(),express.json());

// Customer class definition (imported from customer.js)
const Customer = require('./models/customer');
// Transaction class definition (imported from transaction.js)
const Transaction = require('./models/transaction');
const req = require('express/lib/request');

// Initialize 3 mock customers
const mockCustomers = [
  new Customer('1', 'john.doe@company.com', 'John', 'Doe'),
  new Customer('2', 'jane.smith@company.com', 'Jane', 'Smith'),
  new Customer('3', 'bob.johnson@company.com', 'Bob', 'Johnson'),
];

// Sample array to store customer data (replace with a database in a real application)
const customers = [...mockCustomers];


// Function to generate a random date within a specified range
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

// Generate 20 mock transactions for each customer
const mockTransactions = [];
const startDate = new Date('2022-10-01');
const endDate = new Date('2022-12-31');


for (const customer of customers) {
const min1 = 1;        
const max1 = 200;    
const numberOfTransactions = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
  for (let i = 0; i < numberOfTransactions; i++) {
    const transactionDate = randomDate(startDate, endDate);
    const min2 = 1;        // Minimum value (inclusive)
    const max2 = 1000;     // Maximum value (inclusive)
    const amount = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
    const newTransaction = new Transaction(
      mockTransactions.length + 1,
      customer.id,
      transactionDate,
      Number(amount)
    );
    mockTransactions.push(newTransaction);
  }
}

// Create a new customer
app.post('/api/customers', (req, res) => {
  const { id, email, firstname, lastname } = req.body;

  // Check if a customer with the same email already exists
  const existingCustomer = customers.find((customer) => customer.email === email);
  if (existingCustomer) {
    return res.status(400).json({ error: 'Customer with the same email already exists.' });
  }

  const newCustomer = new Customer(id, email, firstname, lastname);
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

// Get all customers
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

// Create a new transaction
app.post('/api/transactions', (req, res) => {
    const { customer_id, createDate, amount } = req.body;
  
    const newTransaction = new Transaction(
      mockTransactions.length + 1,
      customer_id,
      createDate,
      amount
    );
    mockTransactions.push(newTransaction);
    res.status(201).json(newTransaction);
  });
  
  // Get all transactions
  app.get('/api/transactions', (req, res) => {
    res.json(mockTransactions);
  });

// Get total amount of transactions for a customer between two dates
app.get('/api/transactions/total', (req, res) => {
    const customerId = req.query.customer_id;
    const startDate = new Date(req.query.start_date);
    const endDate = new Date(req.query.end_date);
  
    // Filter transactions for the specified customer and date range
    const filteredTransactions = mockTransactions.filter(
      (transaction) =>
        transaction.customer_id === customerId &&
        transaction.createDate >= startDate &&
        transaction.createDate <= endDate
    );
  
    // Calculate the total amount
    const totalAmount = filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  
    res.json({ totalAmount });
  });
  
app.get('/api/transaction/reward', (req, res) => {
    const amount = req.query.amount;
    const reward = calculateRewardPoints(amount);

    res.json({ reward });
});
  
// Get total amount of transactions for a customer between two dates
app.get('/api/transactions/rewards', (req, res) => {
    const customerId = req.query.customer_id;
    const startDate = new Date(req.query.start_date);
    const endDate = new Date(req.query.end_date);
  
    // Filter transactions for the specified customer and date range
    const filteredTransactions = mockTransactions.filter(
      (transaction) =>
        transaction.customer_id === customerId &&
        transaction.createDate >= startDate &&
        transaction.createDate <= endDate
    );
  
    // Calculate the total amount
    const rewards = filteredTransactions.reduce(
      (sum, transaction) => sum + calculateRewardPoints(transaction.amount),
      0
    );
  
    res.json({ rewards });
  });

// Start the server
app.listen(port, () => {
  console.log(`Mock API server is running on port ${port}`);
});