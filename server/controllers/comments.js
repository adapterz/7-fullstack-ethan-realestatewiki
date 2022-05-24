import db from "../db.js";

// 유저가 작성한 댓글 조회 (유저 인덱스 이용)
export function getCommentsByUserId(req, res) {
  const id = req.params.id;
  const sql = `SELECT id, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), post_id FROM comment WHERE user_id = ${id}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

// 게시글 관련 댓글 조회 (게시글 인덱스 번호 이용)
export function getCommentsByPostId(req, res) {
  const id = req.params.id;
  const sql = `SELECT id, user_id, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), user_id FROM comment WHERE post_id = ${id}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

// 유저가 작성한 댓글 조회 (아파트 번호 인덱스 이용)
export function getCommentsByAptId(req, res) {
  const id = req.params.id;
  const sql = `SELECT id, user_id, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), user_id FROM comment WHERE apt_id = ${id}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

// 게시글에 새로운 댓글 달기
export function makeNewComment(req, res) {
  const user_id = req.body.user_id;
  const post_id = req.body.post_id;
  const apt_id = req.body.apt_id;
  const content = req.body.content;
  const datetime_created = req.body.datetime_created;

  const sql =
    "INSERT INTO comment(user_id, post_id, content, datetime_created, apt_id) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [user_id, post_id, content, datetime_created, apt_id],
    function (error, result) {
      if (error) throw error;
      res.send(result);
    }
  );
}

// 댓글 수정하기
export function updateComment(req, res) {
  const id = req.params.id;
  const content = req.body.content;
  const datetime_created = req.body.datetime_created;

  const sql = `UPDATE comment SET content = "${content}", datetime_created = "${datetime_created}" WHERE id = "${id}"`;
  console.log(sql);
  db.query(sql, function (error, result) {
    if (error) throw error;
    res.send(result);
  });
}
