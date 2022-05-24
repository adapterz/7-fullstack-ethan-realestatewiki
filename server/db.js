import mysql from "mysql";
import { config } from "../server/config.js";

export const db = mysql.createConnection({
  host: config.DB.host,
  user: config.DB.user,
  password: config.DB.pw,
  database: config.DB.dbname,
});

export default db;
