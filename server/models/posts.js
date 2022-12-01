import { getSql } from "../middlewares/console.js";
import pool from "../middlewares/pool.js";

// 모든 게시글의 갯수를 구하기
export function getAllPostCount() {
  // TODO : 날짜 포멧 바꾸기
  const sql = `SELECT count(*) FROM post `;
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

// 키워드가 포함된 게시글 검색
export function getAllPost() {
  // TODO : 날짜 포멧 바꾸기
  const sql = `SELECT post.id, author_id, title, content, DATE_FORMAT(datetime_created, '%y-%m-%d %H:%i:%s') as datetime_created, views, recommended_number, use_enabled, comments_enabled, comments_count FROM post `;
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

// 키워드가 포함된 게시글 검색
export function getAllPostByPagenation(start, pageSize) {
  // TODO : 날짜 포멧 바꾸기
  const sql = `SELECT post.id, user.user_Id, post.author_id, title, content, DATE_FORMAT(post.datetime_updated, '%y-%m-%d') as datetime_updated, views, recommended_number, use_enabled, comments_enabled, comments_count FROM post LEFT JOIN user ON post.author_id = user.id ORDER BY post.datetime_updated DESC LIMIT ?, ?`;
  getSql(`getPost ${sql}`);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [start, pageSize], function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 인기 게시글 가져오기(홈화면)
export function getPopularPost() {
  const sql = `SELECT post.id, author_id, user.user_id, title, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), views, recommended_number, use_enabled, comments_enabled FROM post LEFT JOIN user ON post.author_id = user.id ORDER BY post.views DESC LIMIT 0, 10`;
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

// 게시글 검색 (by 게시글 번호)
export function getPostById(id) {
  const sql = `SELECT post.id as post_index, post.id, post.author_id, user.user_id, user.nickname, user.image, title, content, DATE_FORMAT(post.datetime_updated, '%Y-%m-%d') as datetime_updated , views, recommended_number, use_enabled, comments_enabled FROM post LEFT JOIN user ON post.author_id = user.id WHERE post.id = ?`;
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

// 키워드가 포함된 게시글 검색
export function getPostByKeyword(keyword) {
  // TODO : 날짜 포멧 바꾸기
  const sql = `SELECT post.id, author_id, title, content, DATE_FORMAT(datetime_created, '%y-%m-%d %H:%i:%s') as datetime_created, views, recommended_number, use_enabled, comments_enabled FROM post WHERE title LIKE CONCAT( '%',?,'%') OR content LIKE CONCAT( '%',?,'%')`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [keyword, keyword], function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 키워드가 포함된 게시글 검색
export function getPostByKeywordByPagenation(keyword, start, pageSize) {
  // TODO : 날짜 포멧 바꾸기
  const sql = `SELECT post.id, user.user_Id, post.author_id, title, content, DATE_FORMAT(post.datetime_updated, '%y-%m-%d %H:%i:%s') as datetime_updated, views, recommended_number, use_enabled, comments_enabled FROM post LEFT JOIN user ON post.author_id = user.id WHERE title LIKE CONCAT( '%',?,'%') OR content LIKE CONCAT( '%',?,'%') ORDER BY datetime_updated DESC LIMIT ?, ?`;
  getSql(`getPost ${sql}`);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        sql,
        [keyword, keyword, start, pageSize],
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

// 닉네임으로 게시글 검색
export function getPostByUserId(userId) {
  const sql = `select post.id, post.author_id, post.title, post.content, DATE_FORMAT(post.datetime_created, '%Y-%M-%D %H:%i:%s'), post.views, post.recommended_number, post.use_enabled, post.comments_enabled, user.user_id from post inner join user on post.author_id = user.id where user_id LIKE CONCAT( '%',?,'%')`;
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

// 유저인덱스로 게시글 검색
export function getPostByUserIndexNumber(userIndex) {
  console.log(`userIndex: ${userIndex}`);
  const sql = `select post.id, post.author_id, post.title, post.content, DATE_FORMAT(post.datetime_created, '%Y-%m-%d') as datetime_created, post.views, post.recommended_number, post.use_enabled, post.comments_enabled, user.user_id from post inner join user on post.author_id = user.id where post.author_id  = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, userIndex, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 닉네임으로 게시글 검색
export function getPostByUserIdByPagenation(userId, start, pageSize) {
  const sql = `select post.id, post.author_id, post.title, post.content, DATE_FORMAT(post.datetime_updated, '%Y-%M-%D %H:%i:%s'), post.views, post.recommended_number, post.use_enabled, post.comments_enabled, user.user_id from post inner join user on post.author_id = user.id where user_id LIKE CONCAT( '%',?,'%') ORDER BY post.datetime_updated DESC LIMIT ?, ?`;
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

// 새로운 게시글 생성
export function makePost(post) {
  const sql =
    "INSERT INTO post(author_id, title, content, use_enabled, comments_enabled) VALUES (?, ?, ?, ?, ?)";
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        sql,
        [
          post.author_id,
          post.title,
          post.content,
          post.use_enabled,
          post.comments_enabled,
        ],
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

// 게시글 업데이트
export function updatePost(id, post) {
  const sql = `UPDATE post SET author_id = ?, title = ?, content = ?, use_enabled=?, comments_enabled=? WHERE id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        sql,
        [
          post.author_id,
          post.title,
          post.content,
          post.use_enabled,
          post.comments_enabled,
          id,
        ],
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

// 게시글 삭제
export function deletePost(id) {
  console.log(id);
  const sql = `DELETE FROM post WHERE id = ?`;
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

// 게시글 삭제
export function deletePostByUserId(id) {
  console.log(id);
  const sql = `DELETE FROM post WHERE author_id = ?`;
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

// 게시글 좋아요
export function likePost(postId) {
  const sql = `UPDATE post SET recommended_number = post.recommended_number + 1 where id = ?`;
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

// 게시글 좋아요 취소
export function dislikePost(postId) {
  const sql = `UPDATE post SET recommended_number = post.recommended_number - 1 where id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, postId, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        console.log(`dislikepost : ${result}`);
        connection.release();
        resolve(result);
      });
    });
  });
}

// 게시글 조회 시 조회수 증가
export function views(postId) {
  const sql = `UPDATE post SET views = post.views + 1 where id = ?`;
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

// 댓글 작성 시 댓글 개수 증가
export function plusCommentCount(postId) {
  const sql = `UPDATE post SET comments_count = post.comments_count + 1 where id = ?`;
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

// 댓글 삭제 시 댓글 개수 감소
export function minusCommentCount(postId) {
  const sql = `UPDATE post SET comments_count = post.comments_count - 1 where id = ?`;
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

export function checkPostForUpdateAndDelete(id, userIndex) {
  const sql = `SELECT id, author_id, title, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), views, recommended_number, use_enabled, comments_enabled FROM post WHERE id = ? AND author_id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [id, userIndex], function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}
