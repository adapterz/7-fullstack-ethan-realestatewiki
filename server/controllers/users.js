import * as userRepository from "../models/users.js";

// 나의 정보 조회 (로그인 후 나의 정보 조회)
export async function getUserById(req, res) {
  // id 변수에 인증 시 저장 해놓은 유저 인덱스 번호 지정
  const id = req.index_check;
  const user = await userRepository.getUserById(id);
  // user가 존재하지 않을 때
  if (user[0] === undefined) {
    return res.status(404).json({ message: `user doesn't exist` });
  }
  console.log(
    `유저 인덱스가 ${id}이고 닉네임이 ${user[0].nickname}인 유저의 정보를 조회합니다.`
  );
  return res.status(200).json(user);
}

// 회원 가입
export async function makeUser(req, res) {
  const userData = req.body;
  const checkUserId = await userRepository.duplicatescheckUserId(
    userData.user_id
  );
  // UserId가 중복될 때,
  if (!isEmptyArr(checkUserId)) {
    return res.status(400).json({ message: `Duplicate user ID` });
  }

  const checkNickname = await userRepository.duplicatescheckNickname(
    userData.nickname
  );
  // Nickname이 중복될 때,
  if (!isEmptyArr(checkNickname)) {
    return res.status(400).json({ message: `Duplicate nickname` });
  }

  const checkEmail = await userRepository.duplicatescheckEmail(userData.email);
  // email이 중복될 때,
  if (!isEmptyArr(checkEmail)) {
    return res.status(400).json({ message: `Duplicate email` });
  }

  const checkPhoneNumber = await userRepository.duplicatescheckPhoneNumber(
    userData.phone_number
  );
  //핸드폰 번호가 중복될 때
  if (!isEmptyArr(checkPhoneNumber)) {
    return res.status(400).json({ message: `Duplicate phonenumber` });
  }

  const user = await userRepository.makeUser(userData);
  //회원 가입 실패 시
  if (!user) {
    return res.status(400).json({ message: `signup failed` });
  }
  return res.status(200).json({ message: `signup success` });
}

// 유저 정보 수정
// XXX 변경값을 동일하게 입력시 오류 발생, 유저가 원래와 동일한 회원정보를 입력할 수도 있다. 체크할 것.
export async function updateUser(req, res) {
  const id = req.index_check;
  const userData = req.body;
  console.log(`id : ${id}`);
  console.log(userData);

  // 기존 사용하던 닉네임과 현재 수정 요청한 닉네임이 다를 경우
  if (req.nickname_check !== userData.nickname) {
    // 중복되는 닉네임이 있는지 찾는다.
    const checkNickname = await userRepository.duplicatescheckNickname(
      userData.nickname
    );
    // 중복되는 닉네임이 있다면, 오류 발생
    if (!isEmptyArr(checkNickname)) {
      return res.status(400).json({ message: `Duplicate nickname` });
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
      return res.status(400).json({ message: `Duplicate email1` });
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
      return res.status(400).json({ message: `Duplicate phonenumber1` });
    }
  }

  const user = await userRepository.updateUser(id, userData);
  // console.log(user);
  if (!user) {
    return res.status(404).json({ message: `update failure` });
  }
  return res.status(200).json({ message: `update failure` });
}

// 유저 정보 삭제
export async function deleteUser(req, res) {
  // session에 들어가 있는 유저 인덱스를 id변수에 넣는다.
  const id = req.index_check;
  // id 파라메터가 숫자로 입력되지 않았을 때,
  // 음수일 수도 있으므로 그 부분 추가
  if (isNaN(id)) {
    return res.status(400).json({ message: `correct user number is required` });
  }
  const user = await userRepository.deleteUser(id);
  console.log(user);
  // 영향을 받는 행이 없을 때,
  if (user["affectedRows"] == 0) {
    return res
      .status(404)
      .json({ message: `cannot delete user. user doesn't exist.` });
  }
  // TODO 삭제할 때 200번이 맞는지?
  return res.status(200).json({ message: `user delete success` });
}

// 비어있는 배열인지 확인
function isEmptyArr(arr) {
  if (Array.isArray(arr) && arr.length === 0) {
    return true;
  }
  return false;
}

// async function duplicatescheck(req, res) {
//   const checkUserId = await userRepository.duplicatescheckUserId(
//     req.body.user_id
//   );
//   if (!isEmptyArr(checkUserId)) {
//     return res.status(400).json({ message: `Duplicate user ID` });
//   }

//   const checkNickname = await userRepository.duplicatescheckNickname(
//     req.body.nickname
//   );
//   if (!isEmptyArr(checkNickname)) {
//     return res.status(400).json({ message: `Duplicate nickname` });
//   }

//   const checkEmail = await userRepository.duplicatescheckEmail(req.body.email);
//   if (!isEmptyArr(checkEmail)) {
//     return res.status(400).json({ message: `Duplicate email` });
//   }

//   const checkPhoneNumber = await userRepository.duplicatescheckPhoneNumber(
//     req.body.phone_number
//   );
//   if (!isEmptyArr(checkPhoneNumber)) {
//     return res.status(400).json({ message: `Duplicate phonenumber` });
//   }
// }
