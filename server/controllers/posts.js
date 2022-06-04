import db from "../db.js";
import * as postRepository from "../models/posts.js";

// 게시글 번호로 게시글 찾기
export async function getPostById(req, res) {
  const isLogined = req.session.isLogined;
  console.log(isLogined);
  if (!isLogined) {
    return res.status(401).json("로그인이 필요합니다.");
  }
  const id = req.params.id;
  const post = await postRepository.getPostById(id);
  if (post[0] === undefined) {
    res.status(404).json({ message: `post doesn't exist` });
  } else {
    res.status(200).send(post);
  }
}

// 유저 아이디 또는 검색어로 게시글 찾기
export async function getPost(req, res) {
  const isLogined = req.session.isLogined;
  console.log(`isLogined = ${isLogined}`);
  if (!isLogined) {
    return res.status(401).json("로그인이 필요합니다.");
  }
  if (!req.query.userId && !req.query.keyword) {
    return res.send({ message: "검색어 입력이 필요합니다." });
  }
  if (!req.query.userId) {
    const keyword = req.query.keyword;
    const post = await postRepository.getPostByKeyword(keyword);
    if (post[0] === undefined) {
      res.status(404).json({ message: `post doesn't exist` });
    } else {
      res.status(200).send(post);
    }
  } else {
    const userId = req.query.userId;
    console.log(`userid:${userId}`);
    const post = await postRepository.getPostByUserId(userId);
    if (post[0] === undefined) {
      res.status(404).json({ message: `post doesn't exist` });
    } else {
      res.status(200).send(post);
    }
  }
}

// POST /posts 새로운 게시글 작성
export async function makeNewPost(req, res) {
  const postData = req.body;
  const post = await postRepository.makeNewPost(postData);
  if (post.insertId === undefined) {
    res.status(404).json({ message: `creating post failure` });
  } else {
    res
      .status(200)
      .send({ message: `creating post success(postid : ${post.insertId})` });
  }
}

// 게시글 데이터 수정
export async function updatePost(req, res) {
  const id = req.params.id;
  const postData = req.body;
  const post = await postRepository.updatePost(id, postData);
  if (post.insertId === undefined) {
    res.status(404).json({ message: `creating post failure` });
  }
  if (post.changedRows === 0) {
    res.status(200).send({
      message: `there is no change have been made in your update request`,
    });
  } else {
    res
      .status(200)
      .send({ message: `updating post success(postid : ${post.message})` });
  }
}

// 게시글 삭제
export async function deletePost(req, res) {
  const id = req.params.id;
  const post = await postRepository.deletePost(id);
  console.log(post);
  if (post.affectedRows !== 1) {
    res.status(404).json({ message: `cannot delete post` });
  } else {
    res.status(200).send({ message: `delete post success` });
  }
}

// // Get All posts
// export function getAllPosts(req, res) {
//   const sql = "select * from post";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     res.send(result);
//   });
// }

// // 유저 아이디로 게시글 찾기
// export function getPostByUserId(req, res) {
//   const isLogined = req.session.isLogined;
//   console.log(isLogined);
//   if (!isLogined) {
//     return res.status(401).json("로그인이 필요합니다.");
//   }
//   const userId = req.query.userId;
//   console.log(`userid:${userId}`);
//   const sql = `select post.id, post.author_id, post.title, post.content, post.datetime_created, post.views, post.recommended_number, post.use_enabled, post.comments_enabled, user.user_id from post inner join user on post.author_id = user.id where user_id = "${userId}"`;
//   db.query(sql, function (err, result) {
//     if (err) throw err;
//     res.send(result);
//   });
// }

// // 키워드로 게시글 찾기
// export function getPostByKeyword(req, res) {
//   const isLogined = req.session.isLogined;
//   console.log(isLogined);
//   if (!isLogined) {
//     return res.status(401).json("로그인이 필요합니다.");
//   }
//   const keyword = req.query.keyword;
//   console.log(`keyword:${req.query.keyword}`);
//   const sql = `SELECT id, title, content, DATE_FORMAT(datetime_created, '%Y-%M-%D %H:%i:%s'), views, recommended_number, use_enabled, comments_enabled FROM post WHERE title LIKE '%${keyword}%' OR content LIKE '%${keyword}%'`;
//   db.query(sql, function (err, result) {
//     if (err) throw err;
//     res.send(result);
//   });
// }
