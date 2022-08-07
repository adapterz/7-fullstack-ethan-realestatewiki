import express from "express";
import * as commentsController from "../controllers/comments.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { isAuth } from "../middlewares/auth.js";
import { getIpAndMoment } from "../middlewares/console.js";
import limiter from "../middlewares/ratelimit.js";

const router = express.Router();

router.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "https://realestatewiki.kr");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Set-Cookie", "key=value; HttpOnly; SameSite=None");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

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
router.get("/detail/:id", getIpAndMoment, commentsController.getCommentById);

// 게시판 댓글 검색 (by 키워드 or 유저아이디)
router.get(
  "/post-comments",
  // limiter,
  getIpAndMoment,
  commentsController.searchPostComments
);

// 아파트 정보 댓글 검색 (by 키워드 or 유저아이디)
router.get(
  "/apt-comments",
  // limiter,
  getIpAndMoment,
  commentsController.searchAptComments
);

// 전체 댓글 개수 조회 (by 관련 게시글 인덱스 번호)
router.get(
  "/Countbypostid/:id",
  // limiter,
  commentsController.getCommentsCountByPostId
);

// 전체 댓글 개수 조회 (by 관련 아파트 인덱스 번호)
router.get(
  "/CountbyAptid/:id",
  // limiter,
  commentsController.getCommentsCountByAptId
);

// 댓글 검색 (by 관련 게시글 인덱스 번호)
router.get(
  "/getbypostid/:id",
  // limiter,
  getIpAndMoment,
  commentsController.getCommentsByPostIdByPagenation
);

// 댓글 검색 (by 관련 아파트 인덱스 번호)
router.get(
  "/getbyaptid/:id",
  // limiter,
  getIpAndMoment,
  commentsController.getCommentsByAptIdByPagenation
);

// 게시글 관련 댓글 검색 (by 유저 인덱스 번호)
router.get(
  "/getbyuserIndex/post-comment",
  // limiter,
  // getIpAndMoment,
  isAuth,
  commentsController.getPostCommentByUserIndex
);

// 아파트 관련 댓글 검색 (by 유저 인덱스 번호)
router.get(
  "/getbyuserIndex/apt-comment",
  // limiter,
  // getIpAndMoment,
  isAuth,
  commentsController.getAptCommentByUserIndex
);

// 댓글 작성
router.post(
  "/",
  getIpAndMoment,
  isAuth,
  commentContentOption,
  commentsController.makeComment
);

// 게시글 하단 댓글 수정
router.put(
  "/commentinpost/:id",
  getIpAndMoment,
  isAuth,
  commentContentOption,
  commentsController.updatePostComment
);

// 아파트 정보 하단 댓글 수정
router.put(
  "/commentinaptinfo/:id",
  getIpAndMoment,
  isAuth,
  commentContentOption,
  commentsController.updateAptComment
);

// 게시글 하단 댓글 삭제
router.delete(
  "/commentinpost/:id",
  getIpAndMoment,
  isAuth,
  commentsController.deletePostComment
);
// 아파트 정보 하단 댓글 삭제
router.delete(
  "/commentinaptinfo/:id",
  getIpAndMoment,
  isAuth,
  commentsController.deleteAptComment
);

// 게시글 삭제 시, 하단에 있는 댓글 전체 삭제
router.delete(
  "/commentinpost/all-comment-in-post/:id",
  getIpAndMoment,
  commentsController.deleteAllPostComment
);

export default router;
