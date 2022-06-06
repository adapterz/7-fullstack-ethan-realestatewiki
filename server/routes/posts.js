import express from "express";
import * as postsController from "../controllers/posts.js";
import { body } from "express-validator";
import { validate } from "../validate.js";

const router = express.Router();

// 게시글 콘텐츠 검사 옵션
const postContentOption = [
  body("author_id")
    .trim()
    .notEmpty()
    .withMessage("작성자 번호(author_id)는 숫자로 작성되어야 합니다.")
    .bail()
    .isNumeric()
    .withMessage("작성자 번호(author_id)는 숫자로 작성되어야 합니다."),
  body("title")
    .notEmpty()
    .withMessage("게시글 제목은 1~50자 이내로 작성되어야 합니다.")
    .bail()
    .isLength({ min: 1, max: 50 })
    .withMessage("게시글 제목은 1~50자 이내로 작성되어야 합니다."),
  body("content")
    .notEmpty()
    .isLength({ min: 1, max: 2000 })
    .withMessage("게시글 내용은 1~2000자 이내로 작성되어야 합니다."),
  body("datetime_created").trim(),
  body("use_enabled")
    .trim()
    .isInt({ min: 0, max: 1 })
    .withMessage(
      "게시글 숨김 여부는 반드시 0(숨김) 또는 1(표시)로 작성되어야 합니다."
    ),
  body("comments_enabled")
    .trim()
    .isInt({ min: 0, max: 1 })
    .withMessage(
      "게시글 숨김 여부는 반드시 0(숨김) 또는 1(표시)로 작성되어야 합니다."
    ),
  validate,
];

// 게시글 번호로 게시글 데이터 조회
router.get("/:id", postsController.getPostById);
// 키워드 또는 유저 아이디로 게시글 데이터 조회
router.get("/", postsController.searchPost);
// 새로운 게시글 작성
router.post("/", postContentOption, postsController.makePost);
// 게시글 번호에 해당하는 게시글 수정
router.put("/:id", postContentOption, postsController.updatePost);
// 게시글 삭제
router.delete("/:id", postsController.deletePost);

export default router;
