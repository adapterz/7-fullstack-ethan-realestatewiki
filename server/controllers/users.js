import db from "../db.js";
import * as userRepository from "../models/users.js";

// 회원 아이디로 유저 정보 조회하기
export async function getUserById(req, res) {
  const id = req.params.id;
  const user = await userRepository.getUserById(id);
  if (user[0] === undefined) {
    res.status(404).json({ message: `user doesn't exist` });
  } else {
    res.status(200).send(user);
  }
}

// 새로운 유저 데이터 추가, 회원 가입
export async function makeNewUser(req, res) {
  const user = req.body;
  const newUserData = await userRepository.makeNewUser(user);
  console.log(newUserData);
  if (!newUserData) {
    res.status(404).json({ message: `created failure` });
  } else {
    res.status(200).send(user);
  }
}

// 회원 정보 수정
export async function updateUser(req, res) {
  const id = req.params.id;
  const user = req.body;
  const newUserData = await userRepository.updateUser(id, user);
  console.log(newUserData);
  if (!newUserData) {
    res.status(404).json({ message: `update failure` });
  } else {
    res.status(200).send(`${user.userId}' data is updated`);
  }
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
