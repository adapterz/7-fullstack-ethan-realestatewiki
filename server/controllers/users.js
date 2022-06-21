import * as userRepository from "../models/users.js";
import bcrypt from "bcrypt";
import fs from "fs";

// 나의 정보 조회 (로그인 후 나의 정보 조회)
export async function getUserById(req, res) {
  // id 변수에 로그인 시 저장 해놓은 유저 인덱스 번호 지정
  // req.index_check : auth.js에서 생성된 값
  const id = req.index_check;
  const user = await userRepository.getUserById(id);
  // user가 존재하지 않을 때
  if (user[0] === undefined) {
    return res.status(404).json({ message: `Not Found : user doesn't exist` });
  }
  console.log(
    `유저 인덱스가 ${id}이고 닉네임이 ${user[0].nickname}인 유저의 정보를 조회합니다.`
  );
  return res.status(200).json(user);
}

// 회원 가입
export async function makeUser(req, res) {
  // 이미 로그인 되어 있을 때
  if (req.index_check !== undefined) {
    return res.status(403).json({ message: `Forbidden : you already logined` });
  }
  const userData = req.body;
  let userImage = null;
  const saltRound = 10;
  userData.user_pw = await bcrypt.hash(userData.user_pw, saltRound);
  // 이미지가 첨부되지 않았을 때 회원 가입 방법
  if (req.file == undefined) {
    const checkUserId = await userRepository.duplicatescheckUserId(
      userData.user_id
    );
    // UserId가 중복될 때,
    if (!isEmptyArr(checkUserId)) {
      // TODO: 상태코드 업데이트 필요.
      return res.status(409).json({ message: `Conflict : Duplicate user ID` });
    }

    // Nickname이 중복될 때,
    const checkNickname = await userRepository.duplicatescheckNickname(
      userData.nickname
    );
    if (!isEmptyArr(checkNickname)) {
      // TODO: 상태코드 업데이트 필요.
      return res.status(409).json({ message: `Conflict : Duplicate nickname` });
    }

    // email이 중복될 때,
    // 한 유저가 같은 이메일로 다른 아이디를 만들고 싶을 때는?
    const checkEmail = await userRepository.duplicatescheckEmail(
      userData.email
    );
    if (!isEmptyArr(checkEmail)) {
      // TODO: 상태코드 업데이트 필요.
      return res.status(409).json({ message: `Conflict : Duplicate email` });
    }

    //핸드폰 번호가 중복될 때
    const checkPhoneNumber = await userRepository.duplicatescheckPhoneNumber(
      userData.phone_number
    );
    if (!isEmptyArr(checkPhoneNumber)) {
      // TODO: 상태코드 업데이트 필요.
      return res
        .status(409)
        .json({ message: `Conflict : Duplicate phonenumber` });
    }
    //회원 가입 실패 시
    const user = await userRepository.makeUser(userData, userImage);
    return res.status(201).json({ message: `Created : signup success` });
  }

  // 이미지가 첨부되었을 때 회원 가입
  // 첨부된 이미지의 형식이 잘못되었을 때,
  // multer라이브러리를 사용한 이미지 업로드 처리 중 발생한 이미지 형식 오류
  if (req.fileValidationError) {
    return res.status(400).json({ message: `you can upload only image file` });
  }

  userImage = `${req.file.destination}${req.file.filename}`;
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
  const checkEmail = await userRepository.duplicatescheckEmail(userData.email);
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

  //회원 가입 실패 시
  const user = await userRepository.makeUser(userData, userImage);
  return res.status(201).json({ message: `Created : signup success` });
}

// 유저 정보 수정
// XXX 변경값을 동일하게 입력시 오류 발생, 유저가 원래와 동일한 회원정보를 입력할 수도 있다. 체크할 것.
export async function updateUser(req, res) {
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
        return res
          .status(409)
          .json({ message: `Conflict : Duplicate phonenumber1` });
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
    return res.status(404).json({ message: `update failure` });
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
  const id = req.index_check;
  // id 파라메터가 숫자로 입력되지 않았을 때,
  // 음수일 수도 있으므로 그 부분 추가
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: `Bad Request : correct user number is required` });
  }
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

// util.js? 디렉토리 구조, 함수들만 모아놓는 폴더.
// 비어있는 배열인지 확인
function isEmptyArr(arr) {
  if (Array.isArray(arr) && arr.length === 0) {
    return true;
  }
  return false;
}

// multer로 인하여 미리 저장되었지만, 다른 유저 데이터의 유효성 검사 미통과로 인해, 저장된 파일을 삭제하는 메서드
function deletefileOfInvalidClient(userImagePath) {
  if (fs.existsSync(userImagePath)) {
    try {
      fs.unlinkSync(userImagePath);
      console.log("요청 실패 : image deleted");
    } catch (error) {
      console.log(error);
    }
  }
}
