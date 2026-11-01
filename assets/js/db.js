const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'karen1965OAoa!',
    database: 'project'
});
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }

  console.log('Connected to database');

  // Insert data into database
  const query = 'INSERT INTO info (skills, qualifications, personality_type, eq_summary) VALUES (?, ?, ?, ?)';
  const values = [skills, qualifications, personalityType, eqSummary];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting data into database:', err);
      return;
    }

    console.log('Data inserted successfully');
  });
});
