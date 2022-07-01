import { getSql } from "../middlewares/console.js";
import pool from "../middlewares/pool.js";

// 좋아요 하기
export function likePost(post_id, user_id) {
  const sql = `INSERT INTO likes(user_id, post_id) VALUES (?, ?)`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [post_id, user_id], function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 좋아요 취소 하기
export function dislikePost(post_id, user_id) {
  const sql = `DELETE FROM likes WHERE post_id = ? AND user_id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [post_id, user_id], function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 게시글에 기존에 좋아요가 표시 되어 있었는지 확인하기
export function checkLikeStatusInLikes(post_id, user_id) {
  const sql = `SELECT id, user_id, post_id, datetime_updated  FROM likes WHERE post_id = ? AND user_id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [post_id, user_id], function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}
