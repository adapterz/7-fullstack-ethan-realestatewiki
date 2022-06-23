import express from "express";
import * as commentsController from "../controllers/comments.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

// 댓글 작성 관련 유효성 검사 옵션
const commentContentOption = [
  body("post_id")
    .trim()
    .bail()
    .isNumeric()
    .withMessage("관련 게시글 번호(post_id)는 숫자로 작성되어야 합니다.")
    .optional({ nullable: true }),
  body("apt_id")
    .trim()
    .bail()
    .isNumeric()
    .withMessage("관련 게시글 번호(apt_id)는 숫자로 작성되어야 합니다.")
    .optional({ nullable: true }),
  body("content")
    .notEmpty()
    .withMessage("댓글 내용은 1~200자 이내로 작성되어야 합니다.")
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
router.post("/", isAuth, commentContentOption, commentsController.makeComment);

// 게시글 하단 댓글 수정
router.put(
  "/commentinpost/:id",
  isAuth,
  commentContentOption,
  commentsController.updatePostComment
);

// 아파트 정보 하단 댓글 삭제
router.put(
  "/commentinaptinfo/:id",
  isAuth,
  commentContentOption,
  commentsController.updateAptComment
);

// 게시글 하단 댓글 삭제
router.delete(
  "/commentinpost/:id",
  isAuth,
  commentsController.deletePostComment
);
// 아파트 정보 하단 댓글 삭제
router.delete(
  "/commentinaptinfo/:id",
  isAuth,
  commentsController.deleteAptComment
);

export default router;
