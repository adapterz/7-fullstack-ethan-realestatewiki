import { getSql } from "../middlewares/console.js";
import pool from "../middlewares/pool.js";

// 댓글 검색 (by 댓글 번호)
export function getPostCommentById(id) {
  const sql = `SELECT user_id, post_id, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), DATE_FORMAT(datetime_updated, '%Y-%M-%D %H:%i:%s') FROM comment_post WHERE id = ${id}`;
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

export function getAptCommentById(id) {
  const sql = `SELECT user_id, apt_id, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), DATE_FORMAT(datetime_updated, '%Y-%M-%D %H:%i:%s') FROM comment_apt WHERE id = ${id}`;
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

// 게시글에 달린 댓글 검색 (by 키워드)
export function getPostCommentsByKeyword(keyword) {
  const sql = `SELECT comment_post.user_id, comment_post.post_id, comment_post.content, DATE_FORMAT(comment_post.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.user_id FROM comment_post left join user on comment_post.user_id = user.id WHERE content LIKE '%${keyword}%'`;
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

// 게시글에 달린 댓글 검색 (by 키워드, 페이지네이션)
export function getPostCommentsByKeywordByPagenation(keyword, start, pageSize) {
  const sql = `SELECT comment_post.user_id, comment_post.post_id, comment_post.content, DATE_FORMAT(comment_post.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.user_id FROM comment_post left join user on comment_post.user_id = user.id WHERE content LIKE '%${keyword}%' ORDER BY comment_post.datetime_updated DESC LIMIT ${start}, ${pageSize}`;
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

// 댓글 검색 (by 유저아이디)
export function getPostCommentByUserId(userId) {
  const sql = `select comment_post.id, comment_post.user_id, comment_post.post_id, comment_post.content, DATE_FORMAT(comment_post.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.user_id from comment_post inner join user on comment_post.user_id = user.id where user.user_id LIKE "%${userId}%" ORDER BY comment_post.datetime_updated`;
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

// 댓글 검색 (by 유저아이디)
export function getPostCommentByUserIdByPagenation(userId, start, pageSize) {
  const sql = `select comment_post.id, comment_post.user_id, comment_post.post_id, comment_post.content, DATE_FORMAT(comment_post.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.user_id from comment_post inner join user on comment_post.user_id = user.id where user.user_id LIKE "%${userId}%" ORDER BY comment_post.datetime_updated LIMIT ${start}, ${pageSize}`;
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

// 게시글에 달린 댓글 검색 (by 키워드)
export function getAptCommentsByKeyword(keyword) {
  const sql = `SELECT comment_apt.user_id, comment_apt.apt_id, comment_apt.content, DATE_FORMAT(comment_apt.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.user_id FROM comment_apt left join user on comment_apt.user_id = user.id WHERE content LIKE '%${keyword}%'`;
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

// 게시글에 달린 댓글 검색 (by 키워드, 페이지네이션)
export function getAptCommentsByKeywordByPagenation(keyword, start, pageSize) {
  const sql = `SELECT comment_apt.user_id, comment_apt.apt_id, comment_apt.content, DATE_FORMAT(comment_apt.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.user_id FROM comment_apt left join user on comment_apt.user_id = user.id WHERE content LIKE '%${keyword}%' ORDER BY comment_apt.datetime_updated DESC LIMIT ${start}, ${pageSize}`;
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

// 댓글 검색 (by 유저아이디)
export function getAptCommentByUserId(userId) {
  const sql = `select comment_apt.id, comment_apt.user_id, comment_apt.apt_id, comment_apt.content, DATE_FORMAT(comment_apt.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.user_id from comment_apt inner join user on comment_apt.user_id = user.id where user.user_id LIKE "%${userId}%" ORDER BY comment_apt.datetime_updated`;
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

// 댓글 검색 (by 유저아이디)
export function getAptCommentByUserIdByPagenation(userId, start, pageSize) {
  const sql = `select comment_apt.id, comment_apt.user_id, comment_apt.apt_id, comment_apt.content, DATE_FORMAT(comment_apt.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.user_id from comment_apt inner join user on comment_apt.user_id = user.id where user.user_id LIKE "%${userId}%" ORDER BY comment_apt.datetime_updated LIMIT ${start}, ${pageSize}`;
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

// 댓글 검색 (by 관련 게시글 인덱스 번호)
export function getCommentByPostId(postId) {
  const sql = `SELECT comment.id, comment.post_id, comment.user_id, comment.content, DATE_FORMAT(comment.datetime_created, '%Y-%M-%D %H:%i:%s'), user.user_id FROM comment left join user on comment.user_id = user.id WHERE post_id = "${postId}"`;
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

// 댓글 검색 (by 관련 아파트 인덱스 번호)
export function getCommentByAptId(aptId) {
  const sql = `SELECT comment.id, comment.post_id, comment.user_id, comment.apt_id, comment.content, DATE_FORMAT(comment.datetime_created, '%Y-%M-%D %H:%i:%s'), user.user_id FROM comment left join user on comment.user_id = user.id WHERE apt_id = "${aptId}"`;
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

// 게시판 댓글 작성
export function makePostComment(comment) {
  const sql =
    "INSERT INTO comment_post(user_id, post_id, content) VALUES (?, ?, ?)";
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        sql,
        [comment.user_id, comment.post_id, comment.content],
        function (error, result) {
          if (error) {
            return reject("database", `${error.message}`);
          }
          connection.release();
          resolve(result);
        }
      );
    });
  });
}

// 아파트 정보 댓글 작성
export function makeAptComment(comment) {
  const sql =
    "INSERT INTO comment_apt(user_id, apt_id, content) VALUES (?, ?, ?)";
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        sql,
        [comment.user_id, comment.apt_id, comment.content],
        function (error, result) {
          if (error) {
            return reject("database", `${error.message}`);
          }
          connection.release();
          resolve(result);
        }
      );
    });
  });
}

// 게시글 하단 댓글 수정
export function updatePostComment(id, comment) {
  const sql = `UPDATE comment_post SET content = "${comment.content}" WHERE id = "${id}"`;
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

// 아파트 정보 하단 댓글 수정
export function updateAptComment(id, comment) {
  const sql = `UPDATE comment_apt SET content = "${comment.content}" WHERE id = "${id}"`;
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

// 게시판 댓글 삭제
export function deletePostComment(id) {
  const sql = `DELETE FROM comment_post WHERE id = '${id}'`;
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

// 게시판 댓글 삭제
export function deleteAptComment(id) {
  const sql = `DELETE FROM comment_apt WHERE id = '${id}'`;
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
