import * as authenticationRepository from "../server/models/authentication.js";

// 인증 여부 확인
export const isAuth = async (req, res, next) => {
  console.log(req.sessionID);
  // sessionID가 없을 때, 예외처리
  if (!req.sessionID) {
    return res
      .status(401)
      .json({ message: `Unauthorized : login is required.` });
  }
  // sessionID가 데이터베이스에 없을 때, 예외 처리
  const userSession = await authenticationRepository.getDataBySessionId(
    req.sessionID
  );
  if (isEmptyArr(userSession)) {
    return res
      .status(401)
      .json({ message: `Unauthorized : login is required.` });
  }
  // 세션 데이터 내에서 user_id를 찾아서 userIdInSession 변수에 넣기
  const userIdInSesssion = `${JSON.parse(userSession[0].data)["user_id"]}`;
  req.body.user_id = userIdInSesssion;

  // 다음 미들 웨어 함수로 넘긴다.
  next();
};

// 비어있는 배열인지 확인
function isEmptyArr(arr) {
  if (Array.isArray(arr) && arr.length === 0) {
    return true;
  }
  return false;
}
