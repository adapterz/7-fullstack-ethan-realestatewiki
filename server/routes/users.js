import express from "express";
import * as usersController from "../controllers/users.js";
import { body } from "express-validator";
import { validate } from "../validate.js";
import { isAuth } from "../auth.js";
import multer from "multer";
// Multer는 파일 업로드를 위해 사용되는 multipart/form-data
// 를 다루기 위한 node.js의 미들웨어이다.
// Multer는 multipart(multipart/form-data)가 아닌 폼에서는 동작하지 않는다.
// dest : 파일을 어디로 업로드할 지 결정
// const upload = multer({ dest: "server/uploads/" });

const fileFilter = (req, file, cb) => {
  // 확장자 필터링
  if (
    file.mimetype !== "image/png" ||
    file.mimetype !== "image/jpg" ||
    file.mimetype !== "image/jpeg" ||
    file.mimetype !== "image/gif"
  ) {
    // 다른 mimetype은 저장되지 않음
    req.fileValidationError = "jpg,jpeg,png,gif,webp 파일만 업로드 가능합니다.";
    return cb(null, false, req.fileValidationError);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "server/uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname.split(".")[0] +
        Date.now() +
        "." +
        file.originalname.split(".")[1]
    );
  },
  limits: {
    filesize: 20 * 1024 * 1024,
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

function imageExtensionErrorHandler(req, res, next) {
  if (req.fileValidationError) {
    return res.status(400).json({ msg: `${req.fileValidationError}` });
  }
  next();
}

const router = express.Router();

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

// 유저 조회 (by 유저 인덱스 번호)
router.get("/", isAuth, usersController.getUserById);
// 회원 가입
router.post(
  "/",
  upload.single("image"),
  imageExtensionErrorHandler,
  userInputOption,
  usersController.makeUser
);
// 유저 정보 수정
router.put(
  "/",
  isAuth,
  upload.single("image"),
  imageExtensionErrorHandler,
  userInputOptionForUpdate,
  usersController.updateUser
);
// 유저 정보 삭제
router.delete("/:id", isAuth, usersController.deleteUser);

export default router;
