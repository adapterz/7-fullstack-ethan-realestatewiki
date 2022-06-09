import db from "../db.js";

// 유저 조회 (by 유저 인덱스 번호)
export function getDataBySessionId(sessionId) {
  const sql = `SELECT session_id, expires, data FROM sessions WHERE session_id = "${sessionId}"`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}
