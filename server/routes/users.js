import express from "express";
import * as usersController from "../controllers/users.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { checkSessionIdForSignup, isAuth } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { imageExtensionErrorHandler } from "../middlewares/multer.js";
import { getIpAndMoment } from "../middlewares/console.js";
import limiter from "../middlewares/ratelimit.js";

const router = express.Router();

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:443");
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader("Set-Cookie", "key=value; HttpOnly; SameSite=None");
  next();
});

// 비밀번호 유효성 검사 옵션
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
// 회원 정보 입력 관련 유효성 검사 옵션
// 안에 공백 허용 가능?
const userInputOption = [
  body("user_id")
    // .trim()
    .isLowercase()
    .withMessage(
      "아이디는 5~15자의 영문소문자와 숫자의 조합으로 구성되어야 합니다."
    )
    .isAlphanumeric()
    .withMessage(
      "아이디는 5~15자의 영문소문자와 숫자의 조합으로 구성되어야 합니다."
    )
    .isLength({ min: 5, max: 15 })
    .withMessage(
      "아이디는 5~15자의 영문소문자와 숫자의 조합으로 구성되어야 합니다."
    ),
  body("user_pw")
    .trim()
    .isLength({ min: 5, max: 15 })
    .withMessage(
      "비밀번호는 8~15자의 영문 소문자, 숫자, 특수문자의 조합으로 구성되어야 합니다."
    )
    .isStrongPassword(passwordOption)
    .withMessage(
      "비밀번호는 8~15자의 영문 소문자, 숫자, 특수문자의 조합으로 구성되어야 합니다."
    )
    .isLowercase()
    .withMessage(
      "비밀번호는 8~15자의 영문 소문자, 숫자, 특수문자의 조합으로 구성되어야 합니다."
    ),
  // TODO : 닉네임 유효성 검사 기준 재설정 필요.
  body("nickname")
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage(
      "닉네임은 5자 ~ 10자로 구성되어야 합니다.( 영문소문자, 대문자, 한글 사용 가능 )"
    ),
  body("email")
    .trim()
    .isEmail()
    .withMessage(
      "이메일은 이메일 형식으로 입력되어야 합니다. ex)아이디@도메인주소"
    ),
  body("phone_number")
    .trim()
    .isMobilePhone("ko-KR")
    .withMessage("핸드폰 번호 입력 형식이 맞지 않습니다."),
  body("image").trim(),
  validate,
];

const userInputOptionForUpdate = [
  body("nickname")
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage(
      "닉네임은 3자 ~ 10자로 구성되어야 합니다.( 영문소문자, 대문자, 한글 사용 가능 )"
    ),
  body("email")
    .trim()
    .isEmail()
    .withMessage(
      "이메일은 이메일 형식으로 입력되어야 합니다. ex)아이디@도메인주소"
    ),
  body("phone_number")
    .trim()
    .isMobilePhone("ko-KR")
    .withMessage("핸드폰 번호 입력 형식이 맞지 않습니다."),
  body("image").trim(),
  validate,
];

// 로그인
router.post("/signin", getIpAndMoment, usersController.signin);
// 로그 아웃
router.get("/logout", getIpAndMoment, usersController.logout);

// 유저 조회 (by 유저 인덱스 번호)
router.get("/", limiter, getIpAndMoment, isAuth, usersController.getUserById);

// 회원 가입
router.post(
  "/",
  getIpAndMoment,
  checkSessionIdForSignup,
  upload.single("image"),
  imageExtensionErrorHandler,
  userInputOption,
  usersController.makeUser
);

// 유저 정보 수정
router.put(
  "/",
  getIpAndMoment,
  isAuth,
  upload.single("image"),
  imageExtensionErrorHandler,
  userInputOptionForUpdate,
  usersController.updateUser
);

// 유저 정보 삭제
router.delete("/:id", getIpAndMoment, isAuth, usersController.deleteUser);

router.post("/id-check", usersController.checkUserId);
router.post("/nickname-check", usersController.checkNickname);
router.post("/phonenumber-check", usersController.checkPhoneNumber);
router.post("/email-check", usersController.checkEmail);

export default router;
