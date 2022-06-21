import express from "express";
import * as postsController from "../controllers/posts.js";
import { body } from "express-validator";
import { validate } from "../validate.js";
import { isAuth } from "../auth.js";

const router = express.Router();

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

// 게시글 상세 조회 (by 게시글 인덱스 번호)
router.get("/:id", postsController.getPostById);

// 게시글 검색 (by 키워드 or 유저아이디)
router.get("/", postsController.searchPost2);

// 게시글 작성
router.post("/", isAuth, postContentOption, postsController.makePost);

// 게시글 수정
router.put("/:id", isAuth, postContentOption, postsController.updatePost);

// 게시글 삭제
router.delete("/:id", isAuth, postsController.deletePost);

// 좋아요 설정하기 / 취소하기
router.get("/like/:id", isAuth, postsController.likePostById);

export default router;
