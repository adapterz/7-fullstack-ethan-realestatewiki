import express from "express";
import * as usersController from "../controllers/users.js";
import { body } from "express-validator";
import { validate } from "../validate.js";

const router = express.Router();

// 유저 아이디에 맞는 유저 데이터 조회
router.get("/my-page/:id", usersController.getUserById);

// 회원 가입
router.post(
  "/",
  [
    body("user_id")
      .trim()
      .isLowercase()
      .withMessage("소문자로만 작성해주세요.")
      .isAlphanumeric()
      .isLength({ min: 5, max: 15 })
      .withMessage("5~15자의 영문소문자와 숫자의 조합으로 구성되어야 합니다."),
    body("user_pw").trim().isStrongPassword(),
    // { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
    body("nickname").trim().isLowercase(),
    body("datetime_signup").trim().isDate(),
    body("email").trim().isEmail().isLowercase(),
    body("phone_number").trim().isMobilePhone(),
    body("image").trim(),
    validate,
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    usersController.makeNewUser;
  }
);
// 유저 정보 수정
router.put("/:id", usersController.updateUser);
// 유저 정보 삭제
router.delete("/:id", usersController.deleteUser);

export default router;

// // 전체 유저 조회
// router.get("/", usersController.getUsers);
