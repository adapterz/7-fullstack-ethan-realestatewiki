import * as userRepository from "../models/users.js";

// 유저 조회 (by 유저 인덱스 번호)
export async function getUserById(req, res) {
  async function auth(req, res) {
    const sessionId = req.headers.cookie;
  }
  if (!req.session.isLogined) {
    return res
      .status(401)
      .json({ message: `Unauthorized : login is required.` });
  }
  const id = req.params.id;
  const user = await userRepository.getUserById(id);
  if (user[0] === undefined) {
    return res.status(404).json({ message: `user doesn't exist` });
  }
  return res.status(200).json(user);
}

// 회원 가입
export async function makeUser(req, res) {
  const userData = req.body;
  const user = await userRepository.makeUser(userData);
  console.log(user);
  if (!user) {
    return res.status(400).json({ message: `signup failed` });
  }
  return res.status(200).json({ message: `signup success` });
}

// 유저 정보 수정
export async function updateUser(req, res) {
  const id = req.params.id;
  const userData = req.body;
  const user = await userRepository.updateUser(id, userData);
  console.log(user);
  if (!user) {
    return res.status(404).json({ message: `update failure` });
  }
  return res.status(200).json(`${user.userId}' data is updated`);
}

// 유저 정보 삭제
export async function deleteUser(req, res) {
  if (!req.session.isLogined) {
    return res
      .status(401)
      .json({ message: `Unauthorized : login is required.` });
  }
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: `correct user number is required` });
  }
  const user = await userRepository.deleteUser(id);
  console.log(user);
  if (user["affectedRows"] == 0) {
    return res
      .status(404)
      .json({ message: `cannot delete user. user doesn't exist.` });
  }
  return res.status(200).json({ message: `user delete success` });
}
