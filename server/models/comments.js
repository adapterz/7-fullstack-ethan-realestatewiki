import db from "../db.js";

// 댓글 검색 (by 댓글 번호)
export function getCommentById(id) {
  const sql = `SELECT user_id, post_id, apt_id content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s') FROM comment WHERE id = ${id}`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 댓글 검색 (by 키워드)
export function getCommentByKeyword(keyword) {
  const sql = `SELECT comment.user_id, comment.post_id, comment.apt_id, comment.content, DATE_FORMAT(comment.datetime_created, '%Y-%M-%D %H:%i:%s'), user.user_id FROM comment left join user on comment.user_id = user.id WHERE content LIKE '%${keyword}%'`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 댓글 검색 (by 유저아이디)
export function getCommentByUserId(userId) {
  const sql = `select comment.id, comment.user_id, comment.post_id, comment.content, DATE_FORMAT(comment.datetime_created, '%Y-%M-%D %H:%i:%s'), comment.apt_id, user.user_id from comment inner join user on comment.user_id = user.id where user.user_id = "${userId}"`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 댓글 검색 (by 관련 게시글 인덱스 번호)
export function getCommentByPostId(postId) {
  const sql = `SELECT comment.id, comment.post_id, comment.user_id, comment.content, DATE_FORMAT(comment.datetime_created, '%Y-%M-%D %H:%i:%s'), user.user_id FROM comment left join user on comment.user_id = user.id WHERE post_id = "${postId}"`;
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

// 댓글 검색 (by 관련 아파트 인덱스 번호)
export function getCommentByAptId(aptId) {
  const sql = `SELECT comment.id, comment.post_id, comment.user_id, comment.apt_id, comment.content, DATE_FORMAT(comment.datetime_created, '%Y-%M-%D %H:%i:%s'), user.user_id FROM comment left join user on comment.user_id = user.id WHERE apt_id = "${aptId}"`;
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

// 게시판 댓글 작성
export function makePostComment(comment) {
  const sql =
    "INSERT INTO comment_post(user_id, post_id, content) VALUES (?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [comment.user_id, comment.post_id, comment.content],
      function (error, result) {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
}

// 아파트 정보 댓글 작성
export function makeAptComment(comment) {
  const sql =
    "INSERT INTO comment_apt(user_id, apt_id, content) VALUES (?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [comment.user_id, comment.apt_id, comment.content],
      function (error, result) {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
}

// 댓글 수정
export function updateComment(id, comment) {
  const sql = `UPDATE comment SET user_id = "${comment.user_id}", post_id = "${comment.post_id}", apt_id = "${comment.apt_id}", content = "${comment.content}", datetime_created = "${comment.datetime_created}" WHERE id = "${id}"`;
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

// 댓글 삭제
export function deleteComment(id) {
  const sql = `DELETE FROM comment WHERE id = '${id}'`;
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
