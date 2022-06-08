import express from "express";
import * as commentsController from "../controllers/comments.js";
import { body } from "express-validator";
import { validate } from "../validate.js";

const router = express.Router();

// 댓글 작성 관련 유효성 검사 옵션
const commentContentption = [
  body("user_id")
    .trim()
    .notEmpty()
    .withMessage("댓글 작성자 번호(user_id)는 숫자로 작성되어야 합니다.")
    .bail()
    .isNumeric()
    .withMessage("댓글 작성자 번호(user_id)는 숫자로 작성되어야 합니다."),
  body("post_id")
    .trim()
    .notEmpty()
    .withMessage("관련 게시글 번호(post_id)는 숫자로 작성되어야 합니다.")
    .bail()
    .isNumeric()
    .withMessage("관련 게시글 번호(post_id)는 숫자로 작성되어야 합니다."),
  body("content")
    .notEmpty()
    .isLength({ min: 1, max: 200 })
    .withMessage("댓글 내용은 1~200자 이내로 작성되어야 합니다."),
  body("datetime_created").trim(),
  validate,
];

// 댓글 상세 조회 (by 댓글 인덱스 번호)
router.get("/detail/:id", commentsController.getCommentById);
// 댓글 검색 (by 키워드 or 유저아이디)
router.get("/", commentsController.searchComments);
// 댓글 검색 (by 관련 게시글 인덱스 번호)
router.get("/getbypostid/:id", commentsController.getCommentsByPostId);
// 댓글 검색 (by 관련 아파트 인덱스 번호)
router.get("/getbyaptid/:id", commentsController.getCommentsByAptId);
// 댓글 작성
router.post("/", commentContentption, commentsController.makeComment);
// 댓글 수정
router.put("/:id", commentContentption, commentsController.updateComment);
// 댓글 삭제
router.delete("/:id", commentsController.deleteComment);

export default router;
