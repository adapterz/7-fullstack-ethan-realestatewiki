import { getSql } from "../middlewares/console.js";
import pool from "../middlewares/pool.js";

// 유저 조회 (by 유저 인덱스 번호)
export function getDataBySessionId(sessionId) {
  const sql = `SELECT session_id, expires, data FROM sessions WHERE session_id = "${sessionId}"`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}
