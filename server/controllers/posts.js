import * as postRepository from "../models/posts.js";
import * as likeRepository from "../models/likes.js";

// 게시글 검색 (by 게시글 번호)
export async function getPostById(req, res) {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(400).json({ message: `post number must be int` });
  }

  const post = await postRepository.getPostById(id);
  if (post[0] === undefined) {
    return res.status(404).json({ message: `Not Found : post doesn't exist` });
  }

  // 이전에 조회했던 게시글 정보
  const priorViewPost = req.cookies.viewPost;
  console.log(`조회해본 글 : ${priorViewPost}`);

  // 이 방식대로 쿠키에 대한 조회수 집계를 적용한다면, 백만단위 게시글 번호(id : 1000000) 기준, 쿠키당 480개 게시글에 대한 조회 여부 확인 가능
  // 이 방식의 문제점은, 앞부분의 게시글 조회 내역이 쿠키에 누적된다는 것임.
  // 1번 게시글을 누른뒤 15분이 지나도, 2번 게시글을 14분째에 눌렀다면, 그 이후부터 15분이 지나야 1번 게시글의 조회수가 오르게 된다.
  // 해결 방법, 시간이 지나면, 쿠키의 내용을 수정하는 방법 어떻게 할지 생각이 안남.
  // 이전에 조회했던 게시글 정보가 없다면, 조회수를 올리고, 쿠키 viewPost에 게시글 id 추가
  if (req.cookies.viewPost === undefined) {
    await postRepository.views(id);
    return res
      .status(200)
      .cookie("viewPost", id, { maxAge: 15 * 60 * 1000 })
      .json(post);
  }

  // 조회했던 게시글 정보의 배열
  const pageViewArray = req.cookies.viewPost.split(",");

  // 쿠키가 있을 때는, 쿠키에 포함된 이전에 본 페이지 데이터를 확인해서, 현재 페이지 인덱스가 포함되어 있으면 조회수를 올리지 않는다., 쿠키에 현재 페이지 미포함.
  if (
    pageViewArray.find((view) => parseInt(view) === parseInt(id)) ==
    parseInt(id)
  ) {
    return res
      .status(200)
      .cookie("viewPost", `${priorViewPost}`, { maxAge: 15 * 60 * 1000 })
      .json(post);
  }
  // 쿠키가 있을 때는, 쿠키에 포함된 이전에 본 페이지 데이터를 확인해서, 현재 페이지 인덱스가 포함되어 없으면 조회수를 올리고, 쿠키에 현재 페이지 포함.
  await postRepository.views(id);
  return res
    .status(200)
    .cookie("viewPost", `${priorViewPost},${id}`, { maxAge: 15 * 60 * 1000 })
    .json(post);
}

// 게시글 검색 (by 유저아이디 or 키워드)
export async function searchPost(req, res) {
  if (!req.query.userId && !req.query.keyword) {
    return res.status(400).json({ message: "Please enter your search term." });
  }
  if (!req.query.userId) {
    const keyword = req.query.keyword;
    const post = await postRepository.getPostByKeyword(keyword);
    if (post[0] === undefined) {
      return res.status(404).json({ message: "post doesn't exist" });
    }
    return res.status(200).json(post);
  }
  const userId = req.query.userId;
  console.log(`userid:${userId}`);
  const post = await postRepository.getPostByUserId(userId);
  if (post[0] === undefined) {
    return res.status(404).json({ message: "post doesn't exist" });
  }
  return res.status(200).json(post);
}

// 게시글 작성
export async function makePost(req, res) {
  req.body.author_id = req.index_check;
  const postData = req.body;
  if (!postData.author_id) {
    return res.status(400).json({ message: `creating post failure` });
  }
  const post = await postRepository.makePost(postData);
  if (post.insertId === undefined) {
    return res.status(404).json({ message: `creating post failure` });
  }
  return res
    .status(200)
    .json({ message: `creating post success(postid : ${post.insertId})` });
}

// 게시글 수정
export async function updatePost(req, res) {
  // 수정할 게시글의 ID
  const id = req.params.id;
  // id 파라메터를 숫자로 입력하지 않았을 때,
  if (isNaN(id)) {
    return res.status(400).json({ message: `correct post number is required` });
  }
  // 게시글의 id와 작성자의 index를 통해, 게시글이 해당 작성자의 것이 맞는지 확인
  const postCheck = await postRepository.checkPostForUpdateAndDelete(
    id,
    req.index_check
  );
  // 게시글이 현 사용자가 쓴 글이 아니라면,
  if (isEmptyArr(postCheck)) {
    return res
      .status(400)
      .json({ message: `cannot update other client's post` });
  }

  // 현재 로그인된 사용자의 아이디를 게시글 작성자로 지정
  req.body.author_id = req.index_check;
  // body로 요청된 데이터를 postData 변수에 대입
  const postData = req.body;
  const post = await postRepository.updatePost(id, postData);
  if (post.insertId === undefined) {
    return res.status(404).json({ message: `creating post failure` });
  }
  if (post.changedRows === 0) {
    return res.status(200).json({
      message: `there is no change have been made in your update request`,
    });
  }
  return res
    .status(200)
    .json({ message: `updating post success(postid : ${post.message})` });
}

// 게시글 삭제
export async function deletePost(req, res) {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: `post number must be int` });
  }
  // 게시글의 id와 작성자의 index를 통해, 게시글이 해당 작성자의 것이 맞는지 확인
  const postCheck = await postRepository.checkPostForUpdateAndDelete(
    id,
    req.index_check
  );
  // 게시글이 현 사용자가 쓴 글이 아니라면,
  if (isEmptyArr(postCheck)) {
    return res
      .status(400)
      .json({ message: `cannot delete other client's post` });
  }

  const post = await postRepository.deletePost(id);
  console.log(post);
  if (post.affectedRows !== 1) {
    return res
      .status(404)
      .json({ message: `cannot delete post. post doesn't exist.` });
  }
  return res.status(200).json({ message: `post delete success` });
}

// 게시글 좋아요 및 좋아요 취소 기능
export async function likePostById(req, res) {
  const postId = req.params.id;
  // 게시글 번호가 숫자 형식으로 입력되었는지 확인
  if (isNaN(postId)) {
    return res.status(400).json({ message: `post number must be int` });
  }

  // 게시글이 실제로 존재하는지 확인
  const checkPost = await postRepository.getPostById(postId);
  if (isEmptyArr(checkPost)) {
    return res.status(400).json({ message: `post doesn't exist` });
  }

  const userId = req.index_check;

  // 기존에 좋아요가 표시되었지는 확인
  const checkLikeStatus = await likeRepository.checkLikeStatusInLikes(
    postId,
    userId
  );

  // 만약 좋아요가 표시되어 있었다면 좋아요 취소
  if (!isEmptyArr(checkLikeStatus)) {
    await postRepository.dislikePost(postId);
    await likeRepository.dislikePost(postId, userId);
    return res.status(200).json({ message: `dislike post` });
  }

  // 만약 좋아요 표시가 되어 있지 않았다면 좋아요 설정
  await postRepository.likePost(postId);
  await likeRepository.likePost(postId, userId);
  return res.status(200).json({ message: `like post` });
}

// 비어있는 배열인지 확인
function isEmptyArr(arr) {
  if (Array.isArray(arr) && arr.length === 0) {
    return true;
  }
  return false;
}

// // 현재 시간 체크
// let today = new Date();
// let UTCstring = today.toUTCString(); // Wed, 14 Jun 2017 07:00:00 GMT
// console.log(UTCstring);
