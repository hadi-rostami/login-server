require("dotenv").config();
const mysql = require("mysql");

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database : process.env.DB_NAME
};

const connection = mysql.createConnection(connectionConfig);

connection.connect((err) => console.error(err));

// صادر کردن اتصال دیتابیس
module.exports = connection;
