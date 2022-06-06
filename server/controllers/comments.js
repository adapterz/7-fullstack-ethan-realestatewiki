import db from "../db.js";
import * as commentRepository from "../models/comments.js";

// 댓글 검색 (by 댓글 번호)
export async function getCommentById(req, res) {
  if (!req.session.isLogined) {
    return res
      .status(401)
      .json({ message: `Unauthorized : login is required.` });
  }
  const id = req.params.id;
  const comment = await commentRepository.getCommentById(id);
  console.log(comment);
  if (comment[0] === undefined) {
    return res
      .status(404)
      .json({ message: `Not Found : comment doesn't exist` });
  }
  return res.status(200).json(comment);
}

// 댓글 검색 (by 유저아이디 or 키워드)
export async function searchComments(req, res) {
  const isLogined = req.session.isLogined;
  console.log(`isLogined = ${isLogined}`);
  if (!isLogined) {
    return res.status(401).json({ message: "Unauthorized Login is required." });
  }
  if (!req.query.userId && !req.query.keyword) {
    return res.status(400).json({ message: "Please enter your search term." });
  }
  if (!req.query.userId) {
    const keyword = req.query.keyword;
    const comment = await commentRepository.getCommentByKeyword(keyword);
    if (comment[0] === undefined) {
      return res.status(404).json({ message: "comment doesn't exist" });
    }
    return res.status(200).json(comment);
  }
  const userId = req.query.userId;
  console.log(`userid:${userId}`);
  const comment = await commentRepository.getCommentByUserId(userId);
  if (comment[0] === undefined) {
    return res.status(404).json({ message: "comment doesn't exist" });
  }
  return res.status(200).json(comment);
}

// 댓글 조회 (by 관련 게시글 인덱스 번호)
export async function getCommentsByPostId(req, res) {
  const isLogined = req.session.isLogined;
  console.log(`isLogined = ${isLogined}`);
  if (!isLogined) {
    return res.status(401).json({ message: "Unauthorized Login is required." });
  }
  const postId = req.params.id;
  if (isNaN(postId)) {
    return res.status(400).json({ message: `correct post number is required` });
  }
  const comment = await commentRepository.getCommentByPostId(postId);
  if (comment[0] === undefined) {
    return res.status(404).json({ message: "comment doesn't exist" });
  }
  return res.status(200).json(comment);
}

// 댓글 조회 (by 아파트 인덱스 번호)
export async function getCommentsByAptId(req, res) {
  const isLogined = req.session.isLogined;
  console.log(`isLogined = ${isLogined}`);
  if (!isLogined) {
    return res.status(401).json({ message: "Unauthorized Login is required." });
  }
  const aptId = req.params.id;
  if (isNaN(aptId)) {
    return res.status(400).json({ message: `correct post number is required` });
  }
  const comment = await commentRepository.getCommentByAptId(aptId);
  if (comment[0] === undefined) {
    return res.status(404).json({ message: "comment doesn't exist" });
  }
  return res.status(200).json(comment);
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
