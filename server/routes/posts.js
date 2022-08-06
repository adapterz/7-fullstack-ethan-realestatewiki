import express from "express";
import * as postsController from "../controllers/posts.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { isAuth } from "../middlewares/auth.js";
import { getIpAndMoment } from "../middlewares/console.js";
import limiter from "../middlewares/ratelimit.js";

const router = express.Router();

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:443");
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader("Set-Cookie", "key=value; HttpOnly; SameSite=None");
  next();
});

// 게시글 콘텐츠 유효성 검사 옵션
const postContentOption = [
  body("title")
    .notEmpty()
    .withMessage("게시글 제목은 1~50자 이내로 작성되어야 합니다.")
    .bail()
    .isLength({ min: 1, max: 50 })
    .withMessage("게시글 제목은 1~50자 이내로 작성되어야 합니다."),
  body("content")
    .notEmpty()
    .withMessage("게시글 내용은 1~2000자 이내로 작성되어야 합니다. (필수)")
    .isLength({ min: 1, max: 2000 })
    .withMessage("게시글 내용은 1~2000자 이내로 작성되어야 합니다. (필수)"),
  body("use_enabled")
    .trim()
    .notEmpty()
    .withMessage(
      "게시글 숨김 여부는 반드시 0(숨김) 또는 1(표시)로 작성되어야 합니다."
    )
    .isInt({ min: 0, max: 1 })
    .withMessage(
      "게시글 숨김 여부는 반드시 0(숨김) 또는 1(표시)로 작성되어야 합니다."
    ),
  body("comments_enabled")
    .trim()
    .notEmpty()
    .withMessage(
      "게시글 숨김 여부는 반드시 0(숨김) 또는 1(표시)로 작성되어야 합니다."
    )
    .isInt({ min: 0, max: 1 })
    .withMessage(
      "게시글 숨김 여부는 반드시 0(숨김) 또는 1(표시)로 작성되어야 합니다."
    ),
  validate,
];

// 인기 게시글 검색
router.get("/popular", getIpAndMoment, postsController.getPopularPost);

// 전체 게시글 숫자 구하기
router.get("/all", postsController.getAllPostCount);

// 게시글 리스트 불러오기
router.get("/lists", getIpAndMoment, postsController.getAllPost);

// 게시글 검색 (by 아파트이름)
router.get(
  "/by-aptname",
  // limiter,
  getIpAndMoment,
  postsController.searchPostByAptName
);

// 게시글 상세 조회 (by 게시글 인덱스 번호)
router.get("/:id", limiter, getIpAndMoment, postsController.getPostById);

// 게시글 검색 (by 키워드 or 유저아이디)
router.get("/", limiter, getIpAndMoment, postsController.searchPost);

// 게시글 검색 (by 유저인덱스)
router.get(
  "/user-post/data",
  isAuth,
  getIpAndMoment,
  postsController.searchUserPost
);

// 게시글 개수 검색 (by 유저인덱스)
router.get("/user-post/count", isAuth, postsController.searchUserPostCount);

// 게시글 작성
router.post(
  "/",
  getIpAndMoment,
  isAuth,
  postContentOption,
  postsController.makePost
);

// 게시글 수정
router.put(
  "/:id",
  getIpAndMoment,
  isAuth,
  postContentOption,
  postsController.updatePost
);

// 게시글 삭제
router.delete("/:id", getIpAndMoment, isAuth, postsController.deletePost);

// 좋아요 설정하기 / 취소하기
router.get(
  "/like/:id",
  limiter,
  getIpAndMoment,
  isAuth,
  postsController.likePostById
);

export default router;
