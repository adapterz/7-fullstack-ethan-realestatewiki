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

// 댓글 작성
export async function makeComment(req, res) {
  req.body.user_id = req.index_check;
  const commentData = req.body;
  // 어떤 댓글을 달지 나타내는 body값이 주어지지 않았을 때
  if (
    (commentData.apt_id && commentData.post_id) ||
    (!commentData.apt_id && !commentData.post_id)
  ) {
    return res
      .status(400)
      .json({ message: `Choose which comment you want to post` });
  }
  // 받은 데이터에 아파트 아이디 데이터가 없다면
  if (!commentData.apt_id) {
    const comment = await commentRepository.makePostComment(commentData);
    if (comment.insertId === undefined) {
      return res.status(404).json({ message: `creating post_comment failure` });
    }
    return res.status(200).json({
      message: `creating post_comment success(postid : ${comment.insertId})`,
    });
  }
  const comment = await commentRepository.makeAptComment(commentData);
  if (comment.insertId === undefined) {
    return res.status(404).json({ message: `creating apt_comment failure` });
  }
  return res.status(200).json({
    message: `creating apt_comment success(postid : ${comment.insertId})`,
  });
}

// 댓글 수정
export async function updateComment(req, res) {
  if (!req.session.isLogined) {
    return res
      .status(401)
      .json({ message: `Unauthorized : login is required.` });
  }
  const id = req.params.id;
  const commentData = req.body;
  const comment = await commentRepository.updateComment(id, commentData);
  if (comment.insertId === undefined) {
    return res.status(404).json({ message: `creating comment failure` });
  }
  if (comment.changedRows === 0) {
    return res.status(200).json({
      message: `there is no change have been made in your update request`,
    });
  }
  return res.status(200).json({
    message: `updating comment success(comment id : ${comment.message})`,
  });
}

// 댓글 삭제
export async function deleteComment(req, res) {
  if (!req.session.isLogined) {
    return res
      .status(401)
      .json({ message: `Unauthorized : login is required.` });
  }
  const id = req.params.id;
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: `correct comment number is required` });
  }
  const comment = await commentRepository.deleteComment(id);
  if (comment.affectedRows !== 1) {
    return res
      .status(404)
      .json({ message: `cannot delete comment. comment doesn't exist.` });
  }
  return res.status(200).json({ message: `comment delete success` });
}
