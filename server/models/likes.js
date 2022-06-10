import db from "../db.js";

// 좋아요 하기
export function likePost(post_id, user_id) {
  const sql = `INSERT INTO likes(user_id, post_id) VALUES (${user_id}, ${post_id})`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

// 좋아요 취소 하기
export function dislikePost(post_id, user_id) {
  const sql = `DELETE FROM likes WHERE post_id = "${post_id}" AND user_id = "${user_id}"`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

// 게시글에 기존에 좋아요가 표시 되어 있었는지 확인하기
export function checkLikeStatusInLikes(post_id, user_id) {
  const sql = `SELECT id, user_id, post_id, datetime_updated  FROM likes WHERE post_id = "${post_id}" AND user_id = "${user_id}"`;
  console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}
