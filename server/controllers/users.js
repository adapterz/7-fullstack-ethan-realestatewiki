import db from "../db.js";
import * as userRepository from "../models/users.js";

// 회원 아이디로 유저 정보 조회하기
export async function getUserById(req, res) {
  const id = req.params.id;
  const user = userRepository.getUserById(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: `user doesn't exist` });
  }
}

// 새로운 유저 데이터 추가, 회원 가입
export function makeNewUser(req, res) {
  const user = req.body;
  const newUserData = userRepository.makeNewUser(user);
  console.log(newUserData);
  if (newUserData) {
    res.status(200).json(newUserData);
  } else {
    res.status(404).json({ message: `created failure` });
  }
}

// 회원 정보 수정
export function updateUser(req, res) {
  const id = req.params.id;
  const user = req.body;
  const sql = `UPDATE user SET user_id = "${user.user_id}", user_pw = "${user.user_pw}", nickname = "${user.nickname}", datetime_signup = "${user.datetime_signup}", email="${user.email}", phone_number="${user.phone_number}", image="${user.image}" WHERE id = "${id}"`;
  console.log(sql);
  db.query(sql, function (error, result) {
    if (error) throw error;
    res.send(result);
  });
}

// 유저 삭제
export function deleteUser(req, res) {
  const id = req.params.id;
  const sql = `delete from user where id= ${id}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}
