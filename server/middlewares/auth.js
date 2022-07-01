import * as sessionRepository from "../models/session.js";
import { isEmptyArr } from "../utils/utils.js";

// 인증 여부 확인
export const isAuth = async (req, res, next) => {
  console.log(req.sessionID);
  // sessionID가 없을 때, 예외처리
  if (!req.sessionID) {
    return (
      res
        // 400 서버가 클라이언트 오류(예: 잘못된 요청 구문, 유효하지 않은 요청 메시지 프레이밍,
        // 또는 변조된 요청 라우팅) 를 감지해 요청을 처리할 수 없거나, 하지 않는다는 것을 의미합니다.
        // 401 클라이언트가 인증되지 않았거나, 유효한 인증 정보가 부족하여 요청이 거부되었음을 의미하는 상태값이다.
        // 즉, 클라이언트가 인증되지 않았기 때문에 요청을 정상적으로 처리할 수 없다고 알려주는 것이다.
        .status(401)
        .json({ message: `Unauthorized : login is required.` })
    );
  }
  // sessionID가 데이터베이스에 없을 때, 예외 처리
  const userSession = await sessionRepository.getDataBySessionId(req.sessionID);
  if (isEmptyArr(userSession)) {
    return res
      .status(401)
      .json({ message: `Unauthorized : login is required.` });
  }
  // 세션 데이터 내에서 user_id를 찾아서 userIdInSession 변수에 넣기
  const indexInSesssion = `${JSON.parse(userSession[0].data)["index"]}`;
  const userIdInSesssion = `${JSON.parse(userSession[0].data)["user_id"]}`;
  const nicknameInSesssion = `${JSON.parse(userSession[0].data)["nickname"]}`;
  const emailInSesssion = `${JSON.parse(userSession[0].data)["email"]}`;
  const phone_numberInSesssion = `${
    JSON.parse(userSession[0].data)["phone_number"]
  }`;

  req.index_check = indexInSesssion;
  req.user_id_check = userIdInSesssion;
  req.nickname_check = nicknameInSesssion;
  req.email_check = emailInSesssion;
  req.phone_number_check = phone_numberInSesssion;
  // req.body.user_id_check = userIdInSesssion;
  // req.body.nickname_check = nicknameInSesssion;
  // req.body.email_check = emailInSesssion;
  // req.body.phone_number_check = phone_numberInSesssion;
  // console.log(req);
  // 다음 미들 웨어 함수로 넘긴다.
  next();
};

// 로그인 후 즉시, 회원 가입 요청 시, 사용자의 sessionId 유무를 확인하는 코드
export const checkSessionIdForSignup = async (req, res, next) => {
  const userSession = await sessionRepository.getDataBySessionId(req.sessionID);
  if (!isEmptyArr(userSession)) {
    return res
      .status(403)
      .json({ message: `Forbidden : Already logined. Cannot signup.` });
  }
  next();
};
