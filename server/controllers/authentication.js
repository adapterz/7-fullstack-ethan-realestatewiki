import * as userRepository from "../models/users.js";
import bcrypt from "bcrypt";

// 로그인
export async function signin(req, res) {
  const { user_id, user_pw } = req.body;
  // user_id로 해당 회원이 존재하는지 확인
  const user = await userRepository.findByUserid(user_id);
  if (!user) {
    return res.status(401).json({ message: "Invalid user or password1" });
  }
  // 사용자가 입력한 패스워드, db에 저장된 암호화된 패스워드를 비교
  const checkPw = await bcrypt.compare(user_pw, user[0].user_pw);
  if (!checkPw) {
    return res.status(401).json({ message: "Invalid user or password2" });
  }
  // 암호일치 시 session 저장
  req.session.index = user[0].id;
  req.session.user_id = user[0].user_id;
  req.session.nickname = user[0].nickname;
  req.session.email = user[0].email;
  req.session.phone_number = user[0].phone_number;
  await req.session.save();

  return res.status(200).json(`${req.session.nickname} 환영합니다.`);
}

//로그아웃
export function logout(req, res) {
  req.session.destroy();
  if (!req.session) {
    res.status(200).json(`로그아웃 되었습니다.`);
  }
}

// 로그인 (쿠키 버전)
export async function signin1(req, res) {
  const { user_id, user_pw } = req.body;
  // user_id로 해당 회원이 존재하는지 확인
  const user = await userRepository.findByUserid(user_id);
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: "Invalid user or password1" });
  }
  // 사용자가 입력한 패스워드, db에 저장된 암호화된 패스워드를 비교
  const checkPw = await bcrypt.compare(user_pw, user[0].user_pw);
  if (!checkPw) {
    return res.status(401).json({ message: "Invalid user or password2" });
  }
  // 쿠키를 생성해서 웹브라우저로 보낸다.
  return res
    .cookie("isLogined", "success")
    .cookie("isLogined2", "success2")
    .cookie("cookie", "delicious")
    .status(200)
    .json(`${user[0].nickname} 환영합니다.`);
}

//로그아웃 (쿠키 버전)
export function logout1(req, res) {
  console.log(req.headers.cookie);
  return res
    .clearCookie("isLogined")
    .clearCookie("cookie")
    .clearCookie("isLogined2")
    .status(200)
    .json(`로그아웃 되었습니다.`);
}

// 회원가입
export function signup(req, res) {}
//   export function signin(req, res) {
//     const user = req.body;
//     const user = await authenticationRepository.getUserById(id);
//     if (user[0] === undefined) {
//       res.status(404).json({ message: `user doesn't exist` });
//     } else {
//       res.status(200).send(user);
//     }
//   }
