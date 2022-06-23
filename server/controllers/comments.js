import * as commentRepository from "../models/comments.js";
import { isEmptyArr, pagenation } from "../utils/utils.js";

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

//TODO : 댓글 검색에 대해서 , query를 하나 더 받아서, 아파트 정보 댓글 검색할지? 게시글 댓글 검색할지? 정할 수 있도록 만들기 그래서 댓글 검색 미들웨어를 하나로 줄이는 것이 좋을 것 같다.
// 게시글에 달린 댓글 검색 (by 유저아이디 or 키워드)
export async function searchPostComments(req, res) {
  let page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);
  // 검색어 입력이 되지 않았을 때,
  if (!req.query.userId && !req.query.keyword) {
    return res
      .status(400)
      .json({ message: "Bad Request : Please enter your search term." });
  }
  // 검색어가 두 종류 전부 입력 되었을 때,
  if (req.query.userId && req.query.keyword) {
    return res.status(400).json({
      message: "Bad Request : Please enter only one type of search term.",
    });
  }
  // keyword 검색
  if (!req.query.userId) {
    console.log("키워드 검색 시작");
    const keyword = req.query.keyword;
    const comment = await commentRepository.getPostCommentsByKeyword(keyword);
    console.log(comment.length);
    if (comment[0] === undefined) {
      return res
        .status(404)
        .json({ message: "Not Found : comment doesn't exist" });
    }
    let startItemNumber = await pagenation(page, pageSize, comment.length);
    console.log(startItemNumber);
    const commentByKeyword =
      await commentRepository.getPostCommentsByKeywordByPagenation(
        keyword,
        startItemNumber[1],
        pageSize
      );
    return res.status(200).json(commentByKeyword);
  }

  // userId 검색(keyword 검색어 미입력 시)
  console.log("userId 검색");
  const userId = req.query.userId;
  const comment = await commentRepository.getPostCommentByUserId(userId);
  if (comment[0] === undefined) {
    return res
      .status(404)
      .json({ message: "Not Found : comment doesn't exist" });
  }
  let startItemNumber = await pagenation(page, pageSize, comment.length);
  const commentByUserId =
    await commentRepository.getPostCommentByUserIdByPagenation(
      userId,
      startItemNumber[1],
      pageSize
    );
  return res.status(200).json(commentByUserId);
}

// 아파트 정보에 달린 댓글 검색 (by 유저아이디 or 키워드)
export async function searchAptComments(req, res) {
  let page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);
  // 검색어 입력이 되지 않았을 때,
  if (!req.query.userId && !req.query.keyword) {
    return res
      .status(400)
      .json({ message: "Bad Request : Please enter your search term." });
  }
  // 검색어가 두 종류 전부 입력 되었을 때,
  if (req.query.userId && req.query.keyword) {
    return res.status(400).json({
      message: "Bad Request : Please enter only one type of search term.",
    });
  }
  // keyword 검색
  if (!req.query.userId) {
    console.log("키워드 검색 시작");
    const keyword = req.query.keyword;
    const comment = await commentRepository.getAptCommentsByKeyword(keyword);
    console.log(comment.length);
    if (comment[0] === undefined) {
      return res
        .status(404)
        .json({ message: "Not Found : comment doesn't exist" });
    }
    let startItemNumber = await pagenation(page, pageSize, comment.length);
    console.log(startItemNumber);
    const commentByKeyword =
      await commentRepository.getAptCommentsByKeywordByPagenation(
        keyword,
        startItemNumber[1],
        pageSize
      );
    return res.status(200).json(commentByKeyword);
  }

  // userId 검색(keyword 검색어 미입력 시)
  console.log("userId 검색");
  const userId = req.query.userId;
  const comment = await commentRepository.getAptCommentByUserId(userId);
  if (comment[0] === undefined) {
    return res
      .status(404)
      .json({ message: "Not Found : comment doesn't exist" });
  }
  let startItemNumber = await pagenation(page, pageSize, comment.length);
  const commentByUserId =
    await commentRepository.getAptCommentByUserIdByPagenation(
      userId,
      startItemNumber[1],
      pageSize
    );
  return res.status(200).json(commentByUserId);
}

// 댓글 조회 (by 관련 게시글 인덱스 번호)
export async function getCommentsByPostId(req, res) {
  const postId = req.params.id;
  if (isNaN(postId)) {
    return res
      .status(400)
      .json({ message: `Bad Request : correct post number is required` });
  }
  const comment = await commentRepository.getCommentByPostId(postId);
  if (comment[0] === undefined) {
    return res
      .status(404)
      .json({ message: "Not Found : comment doesn't exist" });
  }
  return res.status(200).json(comment);
}

// 댓글 조회 (by 아파트 인덱스 번호)
export async function getCommentsByAptId(req, res) {
  const aptId = req.params.id;
  if (isNaN(aptId)) {
    return res
      .status(400)
      .json({ message: `Bad Request : correct post number is required` });
  }
  const comment = await commentRepository.getCommentByAptId(aptId);
  if (comment[0] === undefined) {
    return res
      .status(404)
      .json({ message: "Not Found : comment doesn't exist" });
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
      .json({ message: `Bad Request : Choose which comment you want to post` });
  }
  // 받은 데이터에 아파트 아이디 데이터가 없다면
  if (!commentData.apt_id) {
    const comment = await commentRepository.makePostComment(commentData);
    if (comment.insertId === undefined) {
      return res.status(500).json({
        message: `Internal Server Error : creating post_comment failure`,
      });
    }
    return res.status(201).json({
      message: `Created : creating post_comment success(postid : ${comment.insertId})`,
    });
  }
  const comment = await commentRepository.makeAptComment(commentData);
  if (comment.insertId === undefined) {
    return res.status(500).json({
      message: `Internal Server Error : ccreating apt_comment failure`,
    });
  }
  return res.status(201).json({
    message: `Created creating apt_comment success(postid : ${comment.insertId})`,
  });
}

// 게시글 하단 댓글 수정
export async function updatePostComment(req, res) {
  // 코멘트 아이디를 파라메터로 받는다.
  const id = req.params.id;
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: `Bad Request : correct post number is required` });
  }

  const checkComment = await commentRepository.getPostCommentById(id);
  console.log(checkComment);
  // 요청한 댓글 번호에 해당하는 댓글이 없다면,
  if (isEmptyArr(checkComment)) {
    return res
      .status(404)
      .json({ message: `Not Found : comment doesn't exist` });
  }
  // 요청한 댓글을 작성자가 현재 사용자와 일치하지 않는다면,
  if (checkComment[0].user_id !== parseInt(req.index_check)) {
    return res
      .status(403)
      .json({ message: `Forbidden : cannot update other client's comment` });
  }
  // 수정할 댓글 내용을 body로 받아서 수정한다.
  const commentData = req.body;
  const comment = await commentRepository.updatePostComment(id, commentData);

  // 댓글 수정 사항이 이전과 동일하다면,
  if (comment.changedRows === 0) {
    return res.status(204).json({
      message: `No Content : there is no change have been made in your update request`,
    });
  }
  // 댓글 수정이 완료된다면,
  return res.status(201).json({
    message: `Created : updating comment success(comment id : ${comment.message})`,
  });
}

// 아파트 정보 하단 댓글 수정
export async function updateAptComment(req, res) {
  // 코멘트 아이디를 파라메터로 받는다.
  const id = req.params.id;
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: `Bad Request : correct post number is required` });
  }

  const checkComment = await commentRepository.getAptCommentById(id);
  console.log(checkComment);
  // 요청한 댓글 번호에 해당하는 댓글이 없다면,
  if (isEmptyArr(checkComment)) {
    return res
      .status(404)
      .json({ message: `Not Found : comment doesn't exist` });
  }
  // 요청한 댓글을 작성자가 현재 사용자와 일치하지 않는다면,
  if (checkComment[0].user_id !== parseInt(req.index_check)) {
    return res
      .status(403)
      .json({ message: `Forbidden : cannot update other client's comment` });
  }
  // 수정할 댓글 내용을 body로 받아서 수정한다.
  const commentData = req.body;
  const comment = await commentRepository.updateAptComment(id, commentData);

  // 댓글 수정 사항이 이전과 동일하다면,
  if (comment.changedRows === 0) {
    return res.status(204).json({
      message: `No Content : there is no change have been made in your update request`,
    });
  }
  // 댓글 수정이 완료된다면,
  return res.status(201).json({
    message: `Created : updating comment(aptinfo) success(comment id : ${comment.message})`,
  });
}

// 게시글 하단 댓글 삭제
export async function deletePostComment(req, res) {
  const id = req.params.id;
  // 삭제 요청한 댓글 번호가 숫자가 아니라면,
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: `Bad Request : correct comment number is required` });
  }
  const checkComment = await commentRepository.getPostCommentById(id);
  // 삭제 요청한 댓글이 없다면,
  if (isEmptyArr(checkComment)) {
    return res
      .status(404)
      .json({ message: `Not Found : comment doesn't exist` });
  }
  // 삭제 요청한 댓글의 작성자가 현재 사용자와 일치하지 않는다면,
  if (checkComment[0].user_id !== parseInt(req.index_check)) {
    return res
      .status(403)
      .json({ message: `Forbidden : cannot delete other client's comment` });
  }
  const comment = await commentRepository.deletePostComment(id);
  // 없는 댓글을 삭제했을 때,
  if (comment.affectedRows !== 1) {
    return res
      .status(500)
      .json({ message: `Internal Server Error : cannot delete comment.` });
  }
  return res
    .status(204)
    .json({ message: `No Content : comment delete success` });
}

// 아파트 정보 게시판 댓글 삭제
export async function deleteAptComment(req, res) {
  const id = req.params.id;
  // 삭제 요청한 댓글 번호가 숫자가 아니라면,
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: `Bad Request : correct comment number is required` });
  }
  const checkComment = await commentRepository.getPostCommentById(id);
  // 삭제 요청한 댓글이 없다면,
  if (isEmptyArr(checkComment)) {
    return res
      .status(404)
      .json({ message: `Not Found : comment doesn't exist` });
  }
  // 삭제 요청한 댓글의 작성자가 현재 사용자와 일치하지 않는다면,
  if (checkComment[0].user_id !== parseInt(req.index_check)) {
    return res
      .status(403)
      .json({ message: `Forbidden : cannot delete other client's comment` });
  }
  const comment = await commentRepository.deleteAptComment(id);
  // 없는 댓글을 삭제했을 때,
  if (comment.affectedRows !== 1) {
    return res
      .status(500)
      .json({ message: `Internal Server Error : cannot delete comment.` });
  }
  return res
    .status(204)
    .json({ message: `No Content : comment delete success` });
}
