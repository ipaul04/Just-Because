const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5050; // Or any other port you prefer

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the React app
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// PostgreSQL Connection Pool
const pool = new Pool({
  user: 'irenepaul', // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'justBecause', // Replace with your PostgreSQL database name
  password: '4002', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// API Endpoint to save survey responses
app.post('/api/survey', async (req, res) => {
  const { feeling, smile, message } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO survey_responses(feeling, smile, message) VALUES($1, $2, $3) RETURNING *;',
      [feeling, smile, message]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving survey response', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
