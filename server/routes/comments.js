import express from "express";
import * as commentsController from "../controllers/comments.js";

const router = express.Router();

// 댓글 조회 (게시글 id 이용) , GET /comments/post/:post_id
router.get("/getbypostid/:id", commentsController.getCommentsByPostId);
// 댓글 조회 (아파트 id 이용) , GET /comments/apt/:apt_id
router.get("/getbyaptid/:id", commentsController.getCommentsByAptId);
// 댓글 작성하기 POST /comments
router.post("/", commentsController.makeNewComment);
// 댓글 수정하기 PUT /comments
router.put("/:id", commentsController.updateComment);

export default router;
