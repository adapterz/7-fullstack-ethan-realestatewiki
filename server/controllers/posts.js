import db from "../db.js";

// GET posts/:id, 게시글 인덱스 번호로 게시글 정보 조회
export function getPostById(req, res) {
  const id = req.params.id;
  const sql = `SELECT author_id, title, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), views, recommended_number, use_enabled, comments_enabled FROM post WHERE id = ${id}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

// GET posts/my-page/:id, 유저가 작성한 게시글 조회
export function getPostByUserId(req, res) {
  const id = req.params.id;
  console.log(`id:${id}`);
  const sql = `SELECT id, title, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), views, recommended_number, use_enabled, comments_enabled FROM post WHERE author_id = ${id}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

// GET posts/my-page/:id, 유저가 작성한 게시글 조회
export function getPostByKeyword(req, res) {
  const keyword = req.query.keyword;
  console.log(`keyword:${req.query.keyword}`);
  const sql = `SELECT id, title, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), views, recommended_number, use_enabled, comments_enabled FROM post WHERE title LIKE '%${keyword}%' OR content LIKE '%${keyword}%'`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

// POST /posts 새로운 게시글 작성
export function makeNewPost(req, res) {
  const author_id = req.body.author_id;
  const title = req.body.title;
  const content = req.body.content;
  const datetime_created = req.body.datetime_created;
  const use_enabled = req.body.use_enabled;
  const comments_enabled = req.body.comments_enabled;

  const sql =
    "INSERT INTO post(author_id, title, content, datetime_created, use_enabled, comments_enabled) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      author_id,
      title,
      content,
      datetime_created,
      use_enabled,
      comments_enabled,
    ],
    function (error, result) {
      if (error) throw error;
      res.send(result);
    }
  );
}

// 게시글 데이터 수정
export function updatePost(req, res) {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  const datetime_created = req.body.datetime_created;
  const use_enabled = req.body.use_enabled;
  const comments_enabled = req.body.comments_enabled;

  const sql = `UPDATE post SET title = "${title}", content = "${content}", datetime_created = "${datetime_created}", use_enabled="${use_enabled}", comments_enabled="${comments_enabled}" WHERE id = "${id}"`;
  console.log(sql);
  db.query(sql, function (error, result) {
    if (error) throw error;
    res.send(result);
  });
}

// 게시글 삭제
export function deletePost(req, res) {
  const id = req.params.id;
  const sql = `delete from realestatewiki.post where id= ${id}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

// // Get All posts
// export function getAllPosts(req, res) {
//   const sql = "select * from post";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     res.send(result);
//   });
// }
