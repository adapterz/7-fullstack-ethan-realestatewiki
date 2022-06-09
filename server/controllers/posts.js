import * as postRepository from "../models/posts.js";

// 게시글 검색 (by 게시글 번호)
export async function getPostById(req, res) {
  const id = req.params.id;
  const post = await postRepository.getPostById(id);
  // console.log(post);
  if (post[0] === undefined) {
    return res.status(404).json({ message: `Not Found : post doesn't exist` });
  }
  return res.status(200).json(post);
}

// 게시글 검색 (by 유저아이디 or 키워드)
export async function searchPost(req, res) {
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
  if (!req.session.isLogined) {
    return res
      .status(401)
      .json({ message: `Unauthorized : login is required.` });
  }
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
  if (!req.session.isLogined) {
    return res
      .status(401)
      .json({ message: `Unauthorized : login is required.` });
  }
  const id = req.params.id;
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
  if (!req.session.isLogined) {
    return res
      .status(401)
      .json({ message: `Unauthorized : login is required.` });
  }
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: `correct post number is required` });
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
