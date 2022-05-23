import express from "express";
import * as postsController from "../controllers/posts.js";

const router = express.Router();

// 게시글 번호로 게시글 데이터 조회
router.get("/getbyid/:id", postsController.getPostById);
// 유저 번호로 유저가 쓴 게시글 데이터 조회
router.get("/getbyuserid/:id", postsController.getPostByUserId);
// 키워드로 게시글 데이터 검색
router.get("/search", postsController.getPostByKeyword);
// 새로운 게시글 작성
router.post("/", postsController.makeNewPost);
// 게시글 번호에 해당하는 게시글 수정
router.put("/:id", postsController.updatePost);
// 게시글 삭제
router.delete("/:id", postsController.deletePost);

export default router;
