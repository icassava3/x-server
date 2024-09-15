import Logger from "../helpers/logger";
import mysql from "mysql";

// const mysqlDB = mysql.createPool({
//   connectionLimit: 30,
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PWD,
//   database: process.env.MYSQL_DB,
// });

const mysqlDB = mysql.createPool({
  connectionLimit: 30,
  host: "localhost",
  user: "root",
  password: "root",
  database: "spiderdata",
});


mysqlDB.getConnection((err: any, connection: any) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      Logger.error("Database connection was closed.");
    } else if (err.code === "ER_CON_COUNT_ERROR") {
      Logger.error("Database has too many connections.");
    } else if (err.code === "ECONNREFUSED") {
      Logger.error("Database connection was refused.");
    } else Logger.error("error");
  } else {
    Logger.info("Sucessfully connected to the mySQL database!");
  }

  if (connection) connection.release();
  return;
});

module.exports = mysqlDB;
