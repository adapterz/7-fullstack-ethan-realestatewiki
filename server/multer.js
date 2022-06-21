import multer from "multer";

const fileFilter = (req, file, cb) => {
  // 첨부된 파일의 mimetype이 다를 때 저장 X
  if (
    !(
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif"
    )
  ) {
    req.fileValidationError = "jpg, jpeg, png, gif 파일만 업로드 가능합니다.";
    return cb(null, false, req.fileValidationError);
  }
  // mimetype이 올바를 때
  return cb(null, true);
};

const storage = multer.diskStorage({
  // 파일 저장 경로 설정
  destination: function (req, file, cb) {
    cb(null, "server/uploads/");
  },
  // 파일 이름 설정
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname.split(".")[0] +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
  limits: {
    filesize: 20 * 1024 * 1024,
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

// 이미지 mimetype이 다를 때 에러 발생시키는 메서드
export function imageExtensionErrorHandler(req, res, next) {
  if (req.fileValidationError) {
    return res.status(400).json({ msg: `${req.fileValidationError}` });
  }
  next();
}

export default upload;