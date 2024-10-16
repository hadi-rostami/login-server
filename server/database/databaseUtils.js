require("dotenv").config();
const mysql = require("mysql");

const dbName = process.env.DB_NAME;

class DatabaseUtils {
  constructor() {
    this.connectionConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    };
  }

  createTables = async (dbConnection) => {
    const createTableQueries = [
      `CREATE TABLE IF NOT EXISTS codes (
        email varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
        code varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
        create_at bigint NOT NULL,
        type varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS users (
        id int NOT NULL AUTO_INCREMENT,
        email varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
        password varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        is_login tinyint(1) NOT NULL,
        PRIMARY KEY (id)
      )`,
    ];

    for (const query of createTableQueries) {
      try {
        await this.executeQuery(dbConnection, query);
        console.log("Table created or already exists");
      } catch (err) {
        console.error("Error creating table:", err);
        throw err;
      }
    }
  };

  // تابع برای اجرای کوئری‌ها
  executeQuery = (connection, query, params = []) => {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  };

  connectToDatabase = (config) => {
    return new Promise((resolve, reject) => {
      const dbConnection = mysql.createConnection(config);
      dbConnection.connect((err) => {
        if (err) {
          return reject(err);
        }
        console.log("Connected to MySQL server");
        resolve(dbConnection);
      });
    });
  };

  connect = async () => {
    try {
      const connection = await this.connectToDatabase(this.connectionConfig);

      // بررسی وجود دیتابیس
      const result = await this.executeQuery(
        connection,
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
        [dbName]
      );

      if (result.length === 0) {
        // ایجاد دیتابیس در صورت عدم وجود
        console.log(`Database '${dbName}' does not exist, creating database...`);
        await this.executeQuery(connection, `CREATE DATABASE \`${dbName}\``);
        console.log(`Database '${dbName}' created`);
        return true;
      }

      connection.end();
      return false;
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  };
}

module.exports = DatabaseUtils;
