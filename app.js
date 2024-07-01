const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 8080;

// MySQL database connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Vm252',
  database: 'resume',
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON in the request body
app.use(express.json());

// POST endpoint to insert data into the resume table
app.post('/api/resume_details', (req, res) => {
  const { name, address, phone_number, college_name, email, skills } = req.body;

  // Insert data into the resume_details table
  const query = 'INSERT INTO resume_details (name, address, phone_number, college_name, email, skills) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [name, address, phone_number, college_name, email, skills], (err, result) => {
    if (err) {
      console.error('Error inserting data into the resume_details table:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ id: result.insertId, message: 'Resume data inserted successfully' });
  });
});

// GET endpoint to retrieve data from the resume table by ID
app.get('/api/resume_details/:id', (req, res) => {
  const resumeId = req.params.id;

  const query = 'SELECT * FROM resume_details WHERE id = ?';
  db.query(query, [resumeId], (err, results) => {
    if (err) {
      console.error('Error retrieving data from the resume_details table:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
