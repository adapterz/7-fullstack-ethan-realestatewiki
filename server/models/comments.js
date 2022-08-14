import { getSql } from "../middlewares/console.js";
import pool from "../middlewares/pool.js";

// 전체 댓글 게수 조회 (by 관련 게시글 인덱스 번호)
export function getCommentsCountByPostId(postId) {
  const sql = `SELECT count(*) FROM comment_post WHERE comment_post.post_id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, postId, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 전체 댓글 게수 조회 (by 관련 아파트 인덱스 번호)
export function getCommentsCountByAptId(aptId) {
  const sql = `SELECT count(*) FROM comment_apt WHERE comment_apt.apt_id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, aptId, function (error, result) {
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
export function getCommentsByPostId(postId) {
  const sql = `SELECT comment_post.id, comment_post.post_id, comment_post.user_id, comment_post.content, DATE_FORMAT(comment_post.datetime_updated, '%y-%m-%d') as datetime_updated, user.id, user.user_id, user.image FROM comment_post left join user on comment_post.user_id = user.id WHERE comment_post.post_id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, postId, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 게시글 관련 댓글 검색 (by 유저 인덱스 번호)
export function getPostCommentsByUserIndex(id) {
  const sql = `SELECT comment_post.id, comment_post.post_id, comment_post.user_id, comment_post.content, DATE_FORMAT(comment_post.datetime_updated, '%y-%m-%d') as datetime_updated, user.id, user.user_id, user.image FROM comment_post left join user on comment_post.user_id = user.id WHERE comment_post.user_id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, id, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 아파트 관련 댓글 검색 (by 유저 인덱스 번호)
export function getAptCommentsByUserIndex(id) {
  const sql = `SELECT comment_apt.id, comment_apt.user_id, comment_apt.apt_id, comment_apt.content, DATE_FORMAT(comment_apt.datetime_updated, '%y-%m-%d') AS datetime_updated, apartment_information.name, user.id, user.image, user.user_id FROM comment_apt left join user on comment_apt.user_id = user.id left join apartment_information on comment_apt.apt_id = apartment_information.id WHERE comment_apt.user_id = ?`;
  getSql(`sql : ${sql}`);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, id, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 댓글 검색 (by 관련 게시글 인덱스 번호) (by 페이지네이션)
export function getCommentsByPostIdByPagenation(id, start, pageSize) {
  const sql = `SELECT comment_post.id, comment_post.user_id, comment_post.post_id, comment_post.content, DATE_FORMAT(comment_post.datetime_updated, '%y-%m-%d') as datetime_updated, user.id as user_index, user.user_id, user.image FROM comment_post left join user on comment_post.user_id = user.id WHERE comment_post.post_id = ? ORDER BY comment_post.datetime_updated DESC LIMIT ?, ?`;
  getSql(`getComment ${sql}`);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [id, start, pageSize], function (error, result) {
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
export function getCommentsByAptId(aptId) {
  const sql = `SELECT comment_apt.id, apartment_information.name, comment_apt.user_id, user.image, comment_apt.apt_id, comment_apt.content, DATE_FORMAT(comment_apt.datetime_updated, '%y-%m-%d') AS datetime_updated, user.id, user.user_id FROM comment_apt left join user on comment_apt.user_id = user.id left join apartment_information on comment_apt.apt_id = apartment_information.id WHERE apt_id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, aptId, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 댓글 검색 (by 관련 아파트 인덱스 번호) (by pagination)
export function getCommentsByAptIdByPagenation(id, start, pageSize) {
  const sql = `SELECT comment_apt.id as comment_index, apartment_information.name, comment_apt.user_id, user.image, comment_apt.apt_id as apt_index, comment_apt.content, DATE_FORMAT(comment_apt.datetime_updated, '%y-%m-%d') AS datetime_updated, user.id as user_index, user.user_id FROM comment_apt left join user on comment_apt.user_id = user.id left join apartment_information on comment_apt.apt_id = apartment_information.id WHERE apt_id = ? ORDER BY comment_apt.datetime_updated DESC LIMIT ?, ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [id, start, pageSize], function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 댓글 검색 (by 댓글 번호)
export function getPostCommentById(id) {
  const sql = `SELECT user_id, post_id, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), DATE_FORMAT(datetime_updated, '%Y-%M-%D %H:%i:%s') FROM comment_post WHERE id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, id, function (error, result) {
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
  const sql = `SELECT user_id, apt_id, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), DATE_FORMAT(datetime_updated, '%Y-%M-%D %H:%i:%s') FROM comment_apt WHERE id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, id, function (error, result) {
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
  const sql = `SELECT comment_post.user_id, comment_post.post_id, comment_post.content, DATE_FORMAT(comment_post.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.id, user.user_id FROM comment_post left join user on comment_post.user_id = user.id WHERE content LIKE CONCAT( '%',?,'%')`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, keyword, function (error, result) {
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
  const sql = `SELECT comment_post.user_id, comment_post.post_id, comment_post.content, DATE_FORMAT(comment_post.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.id, user.user_id FROM comment_post left join user on comment_post.user_id = user.id WHERE content LIKE CONCAT( '%',?,'%') ORDER BY comment_post.datetime_updated DESC LIMIT ?, ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        sql,
        [keyword, start, pageSize],
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

// 댓글 검색 (by 유저아이디)
export function getPostCommentByUserId(userId) {
  const sql = `select comment_post.id, comment_post.user_id, comment_post.post_id, comment_post.content, DATE_FORMAT(comment_post.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.id, user.user_id from comment_post inner join user on comment_post.user_id = user.id where user.user_id LIKE CONCAT( '%',?,'%') ORDER BY comment_post.datetime_updated`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, userId, function (error, result) {
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
  const sql = `select comment_post.id, comment_post.user_id, comment_post.post_id, comment_post.content, DATE_FORMAT(comment_post.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.id, user.user_id from comment_post inner join user on comment_post.user_id = user.id where user.user_id LIKE CONCAT( '%',?,'%') ORDER BY comment_post.datetime_updated LIMIT ?, ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        sql,
        [userId, start, pageSize],
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

// 게시글에 달린 댓글 검색 (by 키워드)
export function getAptCommentsByKeyword(keyword) {
  const sql = `SELECT comment_apt.user_id, comment_apt.apt_id, comment_apt.content, DATE_FORMAT(comment_apt.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.id, user.user_id FROM comment_apt left join user on comment_apt.user_id = user.id WHERE content LIKE CONCAT( '%',?,'%')`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, keyword, function (error, result) {
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
  const sql = `SELECT comment_apt.user_id, comment_apt.apt_id, comment_apt.content, DATE_FORMAT(comment_apt.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.id, user.user_id FROM comment_apt left join user on comment_apt.user_id = user.id WHERE content LIKE CONCAT( '%',?,'%') ORDER BY comment_apt.datetime_updated DESC LIMIT ?, ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        sql,
        [keyword, start, pageSize],
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

// 댓글 검색 (by 유저아이디)
export function getAptCommentByUserId(userId) {
  const sql = `select comment_apt.id, comment_apt.user_id, comment_apt.apt_id, comment_apt.content, DATE_FORMAT(comment_apt.datetime_updated, '%Y-%M-%D %H:%i:%s'), user.id, user.user_id from comment_apt inner join user on comment_apt.user_id = user.id where user.user_id LIKE CONCAT( '%',?,'%') ORDER BY comment_apt.datetime_updated`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, userId, function (error, result) {
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
  const sql = `select comment_apt.id, comment_apt.user_id, comment_apt.apt_id, comment_apt.content, DATE_FORMAT(comment_apt.datetime_updated, '%Y-%M-%D %H:%i:%s'),  user.id, user.user_id from comment_apt inner join user on comment_apt.user_id = user.id where user.user_id LIKE CONCAT( '%',?,'%') ORDER BY comment_apt.datetime_updated LIMIT ?, ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        sql,
        [userId, start, pageSize],
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
  const sql = `UPDATE comment_post SET content = ? WHERE id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [comment.content, id], function (error, result) {
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
  const sql = `UPDATE comment_apt SET content = ? WHERE id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [comment.content, id], function (error, result) {
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
  const sql = `DELETE FROM comment_post WHERE id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, id, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 게시판 댓글 삭제 (게시글 삭제 시)
export function deleteTargetPostComment(id) {
  const sql = `DELETE FROM comment_post WHERE post_id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, id, function (error, result) {
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
  const sql = `DELETE FROM comment_apt WHERE id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, id, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 게시판 댓글 삭제 (댓글 아파트)
export function deleteAptCommentByUserId(id) {
  const sql = `DELETE FROM comment_apt WHERE user_id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, id, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 게시판 댓글 삭제 (댓글 게시글)
export function deletePostCommentByUserId(id) {
  const sql = `DELETE FROM comment_post WHERE user_id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, id, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}
