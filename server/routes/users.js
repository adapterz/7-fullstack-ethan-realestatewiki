import express from "express";
import * as usersController from "../controllers/users.js";
import { body } from "express-validator";
import { validate } from "../validate.js";

const router = express.Router();

const passwordOption = {
  // 최소 길이 8
  minLength: 8,
  // 최소 소문자 개수 1
  minLowercase: 1,
  // 대문자 사용 불가
  minUppercase: 0,
  // 최소 숫자 개수 1
  minNumbers: 1,
  // 특수문자 최소 1개 사용
  minSymbols: 1,
  // 점수 계산 기능 사용 하지 않음
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
};

//isEmail(str [, options]) - check if the string is an email. options is an object which defaults to
//If allow_display_name is set to true, the validator will also match Display Name <email-address>.
//If allow_utf8_local_part is set to false, the validator will not allow any non-English UTF8 character in email address' local part.
//If require_tld is set to false, e-mail addresses without having TLD in their domain will also be matched.
//https://www.npmjs.com/package/validator/v/4.2.1
const emailOption = {
  allow_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true,
};

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
    body("user_pw")
      .trim()
      .isStrongPassword(passwordOption)
      .isLowercase()
      .isLength({ min: 5, max: 15 })
      .withMessage(
        "비밀번호는 8~15자의 영문 소문자, 숫자, 특수문자의 조합으로 구성되어야 합니다."
      ),
    body("nickname")
      .trim()
      .isLength({ min: 5, max: 10 })
      .withMessage(
        "닉네임은 3자 ~ 10자로 구성되어야 합니다.( 영문소문자, 대문자, 한글 사용 가능 )"
      ),
    body("datetime_signup").trim(),
    body("email")
      .trim()
      .isEmail()
      .withMessage(
        "이메일은 이메일 형식으로 입력되어야 합니다. ex)아이디@도메인주소"
      ),
    body("phone_number")
      .trim()
      .isMobilePhone("ko-KR")
      .withMessage("한국 핸드폰 번호를 통해서만 가입 가능합니다."),
    body("image").trim(),
    validate,
  ],
  // (req, res) => {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ message: errors.array() });
  //   }
  usersController.makeNewUser
);
// 유저 정보 수정
router.put("/:id", usersController.updateUser);
// 유저 정보 삭제
router.delete("/:id", usersController.deleteUser);

export default router;

// // 전체 유저 조회
// router.get("/", usersController.getUsers);
