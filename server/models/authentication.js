import db from "../db.js";

// 유저 조회 (by 유저 인덱스 번호)
export function getSessionIdByuserId(userId) {
  const sql = `SELECT session_id, DATE_FORMAT(expires, '%Y-%M-%D %H:%i:%s'), data FROM session WHERE data.userid = ${userId}`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject("database", `${error.message}`);
      }
      resolve(result);
    });
  });
}
