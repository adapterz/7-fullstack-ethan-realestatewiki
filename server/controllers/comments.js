import * as commentRepository from "../models/comments.js";

// 댓글 검색 (by 댓글 번호)
export async function getCommentById(req, res) {
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
    (!commentData.apt_id && !commentData.post_id) ||
    commentData.apt_id == 0 ||
    commentData.post_id == 0
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

// 게시글 하단 댓글 수정
export async function updatePostComment(req, res) {
  // 코멘트 아이디를 파라메터로 받는다.
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: `correct post number is required` });
  }

  const checkComment = await commentRepository.getPostCommentById(id);
  console.log(checkComment);
  // 요청한 댓글 번호에 해당하는 댓글이 없다면,
  if (isEmptyArr(checkComment)) {
    return res.status(400).json({ message: `comment doesn't exist` });
  }
  // 요청한 댓글을 작성자가 현재 사용자와 일치하지 않는다면,
  if (checkComment[0].user_id !== parseInt(req.index_check)) {
    return res
      .status(400)
      .json({ message: `cannot update other client's comment` });
  }
  // 수정할 댓글 내용을 body로 받아서 수정한다.
  const commentData = req.body;
  const comment = await commentRepository.updatePostComment(id, commentData);

  // 댓글 수정 사항이 이전과 동일하다면,
  if (comment.changedRows === 0) {
    return res.status(200).json({
      message: `there is no change have been made in your update request`,
    });
  }
  // 댓글 수정이 완료된다면,
  return res.status(200).json({
    message: `updating comment success(comment id : ${comment.message})`,
  });
}

// 아파트 정보 하단 댓글 수정
export async function updateAptComment(req, res) {
  // 코멘트 아이디를 파라메터로 받는다.
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: `correct post number is required` });
  }

  const checkComment = await commentRepository.getAptCommentById(id);
  console.log(checkComment);
  // 요청한 댓글 번호에 해당하는 댓글이 없다면,
  if (isEmptyArr(checkComment)) {
    return res.status(400).json({ message: `comment doesn't exist` });
  }
  // 요청한 댓글을 작성자가 현재 사용자와 일치하지 않는다면,
  if (checkComment[0].user_id !== parseInt(req.index_check)) {
    return res
      .status(400)
      .json({ message: `cannot update other client's comment` });
  }
  // 수정할 댓글 내용을 body로 받아서 수정한다.
  const commentData = req.body;
  const comment = await commentRepository.updateAptComment(id, commentData);

  // 댓글 수정 사항이 이전과 동일하다면,
  if (comment.changedRows === 0) {
    return res.status(200).json({
      message: `there is no change have been made in your update request`,
    });
  }
  // 댓글 수정이 완료된다면,
  return res.status(200).json({
    message: `updating comment(aptinfo) success(comment id : ${comment.message})`,
  });
}

// 게시글 하단 댓글 삭제
export async function deletePostComment(req, res) {
  const id = req.params.id;
  // 삭제 요청한 댓글 번호가 숫자가 아니라면,
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: `correct comment number is required` });
  }
  const checkComment = await commentRepository.getPostCommentById(id);
  // 삭제 요청한 댓글이 없다면,
  if (isEmptyArr(checkComment)) {
    return res.status(400).json({ message: `comment doesn't exist` });
  }
  // 삭제 요청한 댓글의 작성자가 현재 사용자와 일치하지 않는다면,
  if (checkComment[0].user_id !== parseInt(req.index_check)) {
    return res
      .status(400)
      .json({ message: `cannot delete other client's comment` });
  }
  const comment = await commentRepository.deletePostComment(id);
  // 없는 댓글을 삭제했을 때,
  if (comment.affectedRows !== 1) {
    return res
      .status(404)
      .json({ message: `cannot delete comment. comment doesn't exist.` });
  }
  return res.status(200).json({ message: `comment delete success` });
}

// 게시판 댓글 삭제
export async function deleteAptComment(req, res) {
  const id = req.params.id;
  // 삭제 요청한 댓글 번호가 숫자가 아니라면,
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: `correct comment number is required` });
  }
  const checkComment = await commentRepository.getPostCommentById(id);
  // 삭제 요청한 댓글이 없다면,
  if (isEmptyArr(checkComment)) {
    return res.status(400).json({ message: `comment doesn't exist` });
  }
  // 삭제 요청한 댓글의 작성자가 현재 사용자와 일치하지 않는다면,
  if (checkComment[0].user_id !== parseInt(req.index_check)) {
    return res
      .status(400)
      .json({ message: `cannot delete other client's comment` });
  }
  const comment = await commentRepository.deleteAptComment(id);
  // 없는 댓글을 삭제했을 때,
  if (comment.affectedRows !== 1) {
    return res
      .status(404)
      .json({ message: `cannot delete comment. comment doesn't exist.` });
  }
  return res.status(200).json({ message: `comment delete success` });
}

// 비어있는 배열인지 확인
function isEmptyArr(arr) {
  if (Array.isArray(arr) && arr.length === 0) {
    return true;
  }
  return false;
}
