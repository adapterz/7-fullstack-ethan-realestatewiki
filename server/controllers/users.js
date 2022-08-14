import * as userRepository from "../models/users.js";
import * as commentRepository from "../models/comments.js";
import * as postRepository from "../models/posts.js";
import * as sessionRepository from "../models/session.js";
import bcrypt from "bcrypt";
import { deletefileOfInvalidClient } from "../middlewares/multer.js";
import { isEmptyArr } from "../utils/utils.js";

// 회원 가입
export async function makeUser(req, res) {
  try {
    // 이미 로그인 되어 있을 때
    if (req.index_check !== undefined) {
      const error = new Error("`Forbidden : you already logined");
      error.name = "alreadyLoginedError";
      throw error;
    }
    const userData = req.body;
    console.log(userData);
    let userImage = null;
    const saltRound = 10;
    userData.user_pw = await bcrypt.hash(userData.user_pw, saltRound);
    // 이미지가 첨부되지 않았을 때 회원 가입 방법
    if (req.file == undefined) {
      //TODO 추후 메서드명 직관적으로 변경 ex)read, write 이용
      //TODO 프리티어 규칙 변경
      const checkUserId = await userRepository.duplicatescheckUserId(
        userData.user_id
      );
      // UserId가 중복될 때,
      if (!isEmptyArr(checkUserId)) {
        const error = new Error("`Conflict : Duplicate user ID");
        error.name = "duplicatedIdError";
        throw error;
      }

      // Nickname이 중복될 때,
      const checkNickname = await userRepository.duplicatescheckNickname(
        userData.nickname
      );
      if (!isEmptyArr(checkNickname)) {
        const error = new Error("`Conflict : Duplicate nickname");
        error.name = "duplicatedNicknameError";
        throw error;
      }

      // email이 중복될 때,
      // 한 유저가 같은 이메일로 다른 아이디를 만들고 싶을 때는?
      const checkEmail = await userRepository.duplicatescheckEmail(
        userData.email
      );
      if (!isEmptyArr(checkEmail)) {
        const error = new Error("`Conflict : Duplicate email");
        error.name = "duplicatedEmailError";
        throw error;
      }

      //핸드폰 번호가 중복될 때
      const checkPhoneNumber = await userRepository.duplicatescheckPhoneNumber(
        userData.phone_number
      );
      if (!isEmptyArr(checkPhoneNumber)) {
        const error = new Error("`Conflict : Duplicate phonenumber");
        error.name = "duplicatedPhonenumberError";
        throw error;
      }
      //TODO null인데 왜 넘겨?
      // const user = await userRepository.makeUser(userData, userImage);
      userImage = "server/basic_profile.jpg";
      await userRepository.makeUser(userData, userImage);
      return res.status(201).json({ message: `Created : signup success` });
    }

    // 이미지가 첨부되었을 때 회원 가입
    // 첨부된 이미지의 형식이 잘못되었을 때,
    // multer라이브러리를 사용한 이미지 업로드 처리 중 발생한 이미지 형식 오류
    //TODO : 같이 이미지 넘기면?
    //TODO : 이미지 있든 없든, 한번에 회원 가입 로직을 쓰는 방법을 적용 (조건을 걸어서)
    if (req.fileValidationError) {
      return res
        .status(400)
        .json({ message: `Bad Request : you can upload only image file` });
    }

    userImage = `${req.file.destination}${req.file.filename}`;
    console.log(`userImage = ${userImage}`);
    const checkUserId = await userRepository.duplicatescheckUserId(
      userData.user_id
    );
    // UserId가 중복될 때,
    if (!isEmptyArr(checkUserId)) {
      deletefileOfInvalidClient(userImage);
      return res.status(409).json({ message: `Conflict : Duplicate user ID` });
    }

    // Nickname이 중복될 때,
    const checkNickname = await userRepository.duplicatescheckNickname(
      userData.nickname
    );
    if (!isEmptyArr(checkNickname)) {
      deletefileOfInvalidClient(userImage);
      return res.status(409).json({ message: `Conflict : Duplicate nickname` });
    }

    // email이 중복될 때,
    const checkEmail = await userRepository.duplicatescheckEmail(
      userData.email
    );
    if (!isEmptyArr(checkEmail)) {
      deletefileOfInvalidClient(userImage);
      return res.status(409).json({ message: `Conflict : Duplicate email` });
    }

    //핸드폰 번호가 중복될 때
    const checkPhoneNumber = await userRepository.duplicatescheckPhoneNumber(
      userData.phone_number
    );
    if (!isEmptyArr(checkPhoneNumber)) {
      deletefileOfInvalidClient(userImage);
      return res
        .status(409)
        .json({ message: `Conflict : Duplicate phonenumber` });
    }
    const user = await userRepository.makeUser(userData, userImage);
    return res.status(201).json({ message: `Created : signup success` });
  } catch (error) {
    if (error.name === "alreadyLoginedError") {
      return res
        .status(403)
        .json({ message: `Forbidden : you already logined` });
    }
    if (error.name === "duplicatedIdError") {
      return res.status(409).json({ message: `Conflict : Duplicate user ID` });
    }
    if (error.name === "duplicatedNicknameError") {
      return res.status(409).json({ message: `Conflict : Duplicate nickname` });
    }
    if (error.name === "duplicatedEmailError") {
      return res.status(409).json({ message: `Conflict : Duplicate email` });
    }
    if (error.name === "duplicatedPhonenumberError") {
      return res
        .status(409)
        .json({ message: `Conflict : Duplicate phonenumber` });
    }
  }
}

// 유저 정보 수정
// XXX 변경값을 동일하게 입력시 오류 발생, 유저가 원래와 동일한 회원정보를 입력할 수도 있다. 체크할 것.
export async function updateUser(req, res) {
  console.log("updateUser 컨트롤러 실행");
  const id = req.index_check;
  const userData = req.body;
  let userImage = null;
  // 사진 파일이 첨부되어 있지 않은 경우
  if (req.file == undefined) {
    if (req.nickname_check !== userData.nickname) {
      // 중복되는 닉네임이 있는지 찾는다.
      const checkNickname = await userRepository.duplicatescheckNickname(
        userData.nickname
      );
      // 중복되는 닉네임이 있다면, 오류 발생
      if (!isEmptyArr(checkNickname)) {
        return res
          .status(409)
          .json({ message: `Conflict : Duplicate nickname` });
      }
    }
    // 기존 사용하던 이메일과 현재 수정 요청한 이메일이 다를 경우
    if (req.email_check !== userData.email) {
      // 중복되는 이메일이 있는지 찾는다.
      const checkEmail = await userRepository.duplicatescheckEmail(
        userData.email
      );
      // 중복되는 이메일이 있다면, 오류 발생
      if (!isEmptyArr(checkEmail)) {
        return res.status(409).json({ message: `Conflict : Duplicate email` });
      }
    }
    // 기존 사용하던 핸드폰번호과 현재 수정 요청한 핸드폰번호이 다를 경우
    if (req.phone_number_check !== userData.phone_number) {
      // 중복되는 핸드폰번호이 있는지 찾는다.
      const checkPhoneNumber = await userRepository.duplicatescheckPhoneNumber(
        userData.phone_number
      );
      // 중복되는 핸드폰번호이 있다면, 오류 발생
      if (!isEmptyArr(checkPhoneNumber)) {
        return res
          .status(409)
          .json({ message: `Conflict : Duplicate phonenumber` });
      }
    }

    // 기존의 이미지 경로를 가져와서, 유저 이미지 데이터에 넣는다.
    const userDataFromDB = await userRepository.getUserById(id);
    userImage = userDataFromDB[0].image;
    console.log("이미지 첨부 안되어 있을 때");
    console.log(userImage);
    const user = await userRepository.updateUser(id, userData, userImage);
    // 세션 data 정보 변경
    req.session.nickname = userData.nickname;
    req.session.email = userData.email;
    req.session.phone_number = userData.phone_number;
    await req.session.save();

    // TODO : 업데이트 인데 상태코드 201??
    return res.status(201).json({ message: `Created : update success` });
  }

  // 사진 파일이 첨부되어 있는 경우
  // 기존 사용하던 닉네임과 현재 수정 요청한 닉네임이 다를 경우
  if (req.nickname_check !== userData.nickname) {
    // 중복되는 닉네임이 있는지 찾는다.
    const checkNickname = await userRepository.duplicatescheckNickname(
      userData.nickname
    );
    // 중복되는 닉네임이 있다면, 오류 발생
    if (!isEmptyArr(checkNickname)) {
      deletefileOfInvalidClient(req.file.path);
      return res
        .status(409)
        .json({ message: `Conflict : Duplicate nickname100` });
    }
  }
  // 기존 사용하던 이메일과 현재 수정 요청한 이메일이 다를 경우
  if (req.email_check !== userData.email) {
    // 중복되는 이메일이 있는지 찾는다.
    const checkEmail = await userRepository.duplicatescheckEmail(
      userData.email
    );
    // 중복되는 이메일이 있다면, 오류 발생
    if (!isEmptyArr(checkEmail)) {
      deletefileOfInvalidClient(req.file.path);
      return res.status(409).json({ message: `Conflict : Duplicate email1` });
    }
  }
  // 기존 사용하던 핸드폰번호과 현재 수정 요청한 핸드폰번호이 다를 경우
  if (req.phone_number_check !== userData.phone_number) {
    // 중복되는 핸드폰번호이 있는지 찾는다.
    const checkPhoneNumber = await userRepository.duplicatescheckPhoneNumber(
      userData.phone_number
    );
    // 중복되는 핸드폰번호이 있다면, 오류 발생
    if (!isEmptyArr(checkPhoneNumber)) {
      deletefileOfInvalidClient(req.file.path);
      return res
        .status(409)
        .json({ message: `Conflict : Duplicate phonenumber1` });
    }
  }

  // 기존에 저장된 이미지 파일의 경로를 priorUserImage에 지정
  const userDataFromDB = await userRepository.getUserById(id);
  const priorUserImage = userDataFromDB[0].image;
  console.log(`priorUserImage : ${priorUserImage}`);
  // 기존 저장된 이미지 파일 삭제
  deletefileOfInvalidClient(priorUserImage);
  // 새롭게 요청된 이미지 파일 DB에 업데이트 하기
  userImage = `${req.file.destination}${req.file.filename}`;
  console.log(userImage);
  const user = await userRepository.updateUser(id, userData, userImage);
  if (!user) {
    return res
      .status(500)
      .json({ message: `Internal Server Error : update failure` });
  }

  // 세션 data 정보 변경
  req.session.nickname = userData.nickname;
  req.session.email = userData.email;
  req.session.phone_number = userData.phone_number;
  await req.session.save();

  return res.status(201).json({ message: `Created : update success` });
}

// 유저 정보 삭제
export async function deleteUser(req, res) {
  // session에 들어가 있는 유저 인덱스를 id변수에 넣는다.
  // TODO : req.index_Check --> req.index_islogined
  // TODO : 403 추가
  const id = req.index_check;
  // id 파라메터가 숫자로 입력되지 않았을 때,
  // 음수일 수도 있으므로 그 부분 추가
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: `Bad Request : correct user number is required` });
  }
  await commentRepository.deleteAptCommentByUserId(id);
  await commentRepository.deletePostCommentByUserId(id);
  await postRepository.deletePostByUserId(id);
  const user = await userRepository.deleteUser(id);
  console.log(user);
  // 영향을 받는 행이 없을 때,
  if (user["affectedRows"] == 0) {
    return res
      .status(404)
      .json({ message: `Not Found : cannot delete user. user doesn't exist.` });
  }
  return res.status(204).json({ message: `No Content : user delete success` });
}

// 나의 정보 조회 (로그인 후 나의 정보 조회)
export async function getUserById(req, res) {
  try {
    // id 변수에 로그인 시 저장 해놓은 유저 인덱스 번호 지정
    // req.index_check : auth.js에서 생성된 값
    // TODO : req 라고 되어 있어서 헷갈리는 부분이 있다. (서버에서 가져온 것인지 모른다.)
    const id = req.index_check;
    const user = await userRepository.getUserById(id);
    // user가 존재하지 않을 때
    if (user[0] === undefined) {
      const error = new Error("Bad Request : Invalid user or password");
      error.name = "notExistingUserError";
      throw error;
    }
    return res.status(200).json(user);
  } catch (error) {
    if (error.name === "notExistingUserError") {
      return res
        .status(404)
        .json({ message: `Not Found : user doesn't exist` });
    }
  }
}

// 로그인
export async function signin(req, res, next) {
  try {
    console.log(req.session.user_id);
    if (req.session.user_id) {
      console.log("세션 이미 존재");
      return res
        .status(403)
        .json({ message: "Forbidden : you already logined" });
    }
    const { user_id, user_pw } = req.body;
    const user = await userRepository.findByUserid(user_id);
    if (isEmptyArr(user)) {
      const error = new Error("Bad Request : Invalid user or password");
      error.name = "wrongIdError";
      throw error;
    }
    console.log(`userId : ${user[0]}`);
    // 사용자가 입력한 패스워드, db에 저장된 암호화된 패스워드를 비교
    const checkPw = await bcrypt.compare(user_pw, user[0].user_pw);
    if (!checkPw) {
      const error = new Error("Bad Request : Invalid user or password");
      error.name = "wrongPwError";
      throw error;
    }
    console.log(`checkPw : ${checkPw}`);
    // 암호일치 시 session 저장
    req.session.index = user[0].id;
    req.session.user_id = user[0].user_id;
    req.session.nickname = user[0].nickname;
    req.session.email = user[0].email;
    req.session.phone_number = user[0].phone_number;
    console.log(`req.session.index: ${req.session.index}`);
    await req.session.save();
    console.log("세션 저장 완료");
    const forCookie = [
      { Loginsession: req.sessionID },
      { user_id: req.session.user_id },
      { nickname: req.session.nickname },
    ];
    return (
      res
        .status(200)
        // .cookie("nickname", req.session.nickname, { maxAge: 30 * 60 * 1000 })
        // .cookie("user_id", req.session.user_id, { maxAge: 30 * 60 * 1000 })
        .send(forCookie)
    );
    // .json(`OK : ${req.session.user_id} 환영합니다.`);
  } catch (error) {
    if (error.name === "wrongIdError") {
      return res
        .status(400)
        .json({ message: "Bad Request : Invalid user or password" });
    }
    if (error.name === "wrongPwError") {
      return res
        .status(400)
        .json({ message: "Bad Request : Invalid user or password" });
    }
  }
}

//로그아웃
export function logout(req, res) {
  req.session.destroy();
  if (!req.session) {
    res
      .cookie("LoginSession", "", { maxAge: 0 })
      .status(200)
      .json(`OK : 로그아웃 되었습니다.`);
  }
}

// 아이디 중복 확인
export async function checkUserId(req, res) {
  const { user_id } = req.body;
  console.log(`user_id: ${user_id}`);
  // user_id로 해당 회원이 존재하는지 확인
  const user = await userRepository.duplicatescheckUserId(user_id);
  console.log(user);
  if (!isEmptyArr(user)) {
    return res.status(409).json({ message: `Conflict : Duplicate id` });
  }
  return res.status(200).json({ message: `OK : usable id` });
}

// 닉네임 중복 확인
export async function checkNickname(req, res) {
  const { nickname } = req.body;
  console.log(`nickname: ${nickname}`);
  // nickname로 해당 회원이 존재하는지 확인
  const user = await userRepository.duplicatescheckNickname(nickname);
  console.log(user);
  if (!isEmptyArr(user)) {
    return res.status(409).json({ message: `Conflict : Duplicate nickname` });
  }
  return res.status(200).json({ message: `OK : usable id` });
}

// 핸드폰번호 중복 확인
export async function checkPhoneNumber(req, res) {
  const { phonenumber } = req.body;
  console.log(`phonenumber: ${phonenumber}`);
  // nickname로 해당 회원이 존재하는지 확인
  const user = await userRepository.duplicatescheckPhoneNumber(phonenumber);
  console.log(user);
  if (!isEmptyArr(user)) {
    return res
      .status(409)
      .json({ message: `Conflict : Duplicate phonenumber` });
  }
  return res.status(200).json({ message: `OK : usable phonenumber` });
}

// 이메일 중복 확인
export async function checkEmail(req, res) {
  const { email } = req.body;
  console.log(`phonenumber: ${email}`);
  // nickname로 해당 회원이 존재하는지 확인
  const user = await userRepository.duplicatescheckEmail(email);
  console.log(user);
  if (!isEmptyArr(user)) {
    return res.status(409).json({ message: `Conflict : Duplicate email` });
  }
  return res.status(200).json({ message: `OK : usable email` });
}

// 비밀번호 일치 확인
export async function checkPassword(req, res) {
  console.log(req.session.user_id);
  if (!req.session.user_id) {
    return res.status(403).json({ message: "Forbidden : login is required" });
  }
  const { password } = req.body;
  console.log(`password: ${password}`);
  const user = await userRepository.findByUserid(req.session.user_id);
  console.log(`userPw : ${user[0].user_pw}`);
  // 사용자가 입력한 패스워드, db에 저장된 암호화된 패스워드를 비교
  const checkPw = await bcrypt.compare(user_pw, user[0].user_pw);
  if (!checkPw) {
    return res
      .status(400)
      .json({ message: "Bad Request : password is not matched" });
  }
  return res.status(204);
}

// 유저 비밀번호 수정
export async function updateUserPw(req, res) {
  console.log("updateUserPw 컨트롤러 실행");
  console.log(`req.index_check: ${req.index_check}`);
  console.log(`req.user_id: ${req.user_id_check}`);
  if (req.index_check == undefined) {
    return res.status(403).json({ message: "Forbidden : Login is required" });
  }
  const userPwData = req.body;
  console.log(userPwData.user_pw);
  console.log(userPwData.new_user_pw);

  const user = await userRepository.findByUserid(req.user_id_check);
  if (isEmptyArr(user)) {
    return res
      .status(500)
      .json({ message: "Server Error : user does not exist" });
  }
  console.log(`userPw : ${user[0].user_pw}`);
  const checkPw = await bcrypt.compare(userPwData.user_pw, user[0].user_pw);
  if (!checkPw) {
    return res
      .status(400)
      .json({ message: "Bad Request : Invalid user or password" });
  }
  console.log(`checkPw : ${checkPw}`);
  const saltRound = 10;
  const new_user_pw = await bcrypt.hash(userPwData.new_user_pw, saltRound);
  console.log(new_user_pw);

  const updateResponse = await userRepository.updateUserPw(
    req.index_check,
    new_user_pw
  );
  console.log(updateResponse);
  return res.status(201).json({ message: `Created : update success` });
}

export async function getUserInfo(req, res) {
  console.log(req.sessionID);
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
  const user_index = req.session.index;
  return res.status(200).json(user_index);
}

export async function updateUserImage(req, res) {
  console.log("updateUserImage 컨트롤러 실행");
  console.log(`req.index_check: ${req.index_check}`);
  console.log(`req.user_id: ${req.user_id_check}`);
  if (req.index_check == undefined) {
    return res.status(403).json({ message: "Forbidden : Login is required" });
  }
  if (req.fileValidationError) {
    return res
      .status(400)
      .json({ message: `Bad Request : you can upload only image file` });
  }
  const userImage = `${req.file.destination}${req.file.filename}`;
  console.log(`userImage = ${userImage}`);
  const user = await userRepository.updateUserImage(req.index_check, userImage);
  return res.status(201).json({ message: `Created : profile image changed` });
}
