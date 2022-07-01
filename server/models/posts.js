import { getSql } from "../middlewares/console.js";
import db from "../middlewares/db.js";

// 게시글 검색 (by 게시글 번호)
export function getPostById(id) {
  const sql = `SELECT author_id, title, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), views, recommended_number, use_enabled, comments_enabled FROM post WHERE id = "${id}"`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 키워드가 포함된 게시글 검색
export function getPostByKeyword(keyword) {
  const sql = `SELECT id, title, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), views, recommended_number, use_enabled, comments_enabled FROM post WHERE title LIKE '%${keyword}%' OR content LIKE '%${keyword}%'`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 키워드가 포함된 게시글 검색
export function getPostByKeywordByPagenation(keyword, start, pageSize) {
  const sql = `SELECT id, title, content, DATE_FORMAT(datetime_updated, '%Y-%M-%D %H:%i:%s'), views, recommended_number, use_enabled, comments_enabled FROM post WHERE title LIKE '%${keyword}%' OR content LIKE '%${keyword}%' ORDER BY datetime_updated DESC LIMIT ${start}, ${pageSize} `;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 닉네임으로 게시글 검색
export function getPostByUserId(userId) {
  const sql = `select post.id, post.author_id, post.title, post.content, DATE_FORMAT(post.datetime_created, '%Y-%M-%D %H:%i:%s'), post.views, post.recommended_number, post.use_enabled, post.comments_enabled, user.user_id from post inner join user on post.author_id = user.id where user_id LIKE "%${userId}%"`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 닉네임으로 게시글 검색
export function getPostByUserIdByPagenation(userId, start, pageSize) {
  const sql = `select post.id, post.author_id, post.title, post.content, DATE_FORMAT(post.datetime_updated, '%Y-%M-%D %H:%i:%s'), post.views, post.recommended_number, post.use_enabled, post.comments_enabled, user.user_id from post inner join user on post.author_id = user.id where user_id LIKE "%${userId}%" ORDER BY post.datetime_updated DESC LIMIT ${start}, ${pageSize}`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 새로운 게시글 생성
export function makePost(post) {
  const sql =
    "INSERT INTO post(author_id, title, content, use_enabled, comments_enabled) VALUES (?, ?, ?, ?, ?)";
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(
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
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
}

// 게시글 업데이트
export function updatePost(id, post) {
  const sql = `UPDATE post SET author_id = "${post.author_id}", title = "${post.title}", content = "${post.content}", use_enabled="${post.use_enabled}", comments_enabled="${post.comments_enabled}" WHERE id = "${id}"`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 게시글 삭제
export function deletePost(id) {
  const sql = `DELETE FROM post WHERE id = '${id}'`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 게시글 좋아요
export function likePost(postId) {
  const sql = `UPDATE post SET recommended_number = post.recommended_number + 1 where id = '${postId}'`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 게시글 좋아요 취소
export function dislikePost(postId) {
  const sql = `UPDATE post SET recommended_number = post.recommended_number - 1 where id = '${postId}'`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      console.log(`dislikepost : ${result}`);
      resolve(result);
    });
  });
}

// 게시글 조회 시 조회수 증가
export function views(postId) {
  const sql = `UPDATE post SET views = post.views + 1 where id = '${postId}'`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

export function checkPostForUpdateAndDelete(id, userIndex) {
  const sql = `SELECT id, author_id, title, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), views, recommended_number, use_enabled, comments_enabled FROM post WHERE id = "${id}" AND author_id = ${userIndex}`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}
