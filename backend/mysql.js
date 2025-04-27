const mysql = require("mysql2");
require("dotenv").config();

// Create a connection 
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // MySQL host
  user: process.env.DB_USER, //  MySQL username
  password: process.env.DB_PASSWORD, //  MySQL password
  database: process.env.DB_NAME, //  database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return ;
  }
  console.log("Connected to MySQL");
});


module.exports = connection;
