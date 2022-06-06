import db from "../db.js";

// 게시글 검색 (by 게시글 번호)
export function getPostById(id) {
  const sql = `SELECT author_id, title, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), views, recommended_number, use_enabled, comments_enabled FROM post WHERE id = "${id}"`;
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
  const sql = `select post.id, post.author_id, post.title, post.content, post.datetime_created, post.views, post.recommended_number, post.use_enabled, post.comments_enabled, user.user_id from post inner join user on post.author_id = user.id where user_id = "${userId}"`;
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
    "INSERT INTO post(author_id, title, content, datetime_created, use_enabled, comments_enabled) VALUES (?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        post.author_id,
        post.title,
        post.content,
        post.datetime_created,
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
  const sql = `UPDATE post SET author_id = "${post.author_id}", title = "${post.title}", content = "${post.content}", datetime_created = "${post.datetime_created}", use_enabled="${post.use_enabled}", comments_enabled="${post.comments_enabled}" WHERE id = "${id}"`;
  console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        post.author_id,
        post.title,
        post.content,
        post.datetime_created,
        post.use_enabled,
        post.comments_enabled,
      ],
      function (error, result) {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
}

// 게시글 삭제
export function deletePost(id) {
  const sql = `DELETE FROM post WHERE id = '${id}'`;
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
