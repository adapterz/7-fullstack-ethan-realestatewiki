import db from "../db.js";
import bcrypt from "bcrypt";

export function getUserById(id) {
  const sql = `SELECT user_id, nickname, DATE_FORMAT(datetime_signup, '%Y-%M-%D %H:%i:%s'), email, phone_number, image FROM user WHERE id = ${id}`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject("database", `${error.message}`);
      }
      resolve(result);
    });
  });
}

export function findByUserid(user_id) {
  const sql = `SELECT id, user_pw, nickname, DATE_FORMAT(datetime_signup, '%Y-%M-%D %H:%i:%s'), email, phone_number, image FROM user WHERE user_id = "${user_id}"`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

export async function makeNewUser(user) {
  // 회원 가입시 사용자가 입력한 암호의 암호화.
  // salt 글자수 지정
  const saltRound = 10;
  // salt 생성
  const salt = await bcrypt.genSalt(saltRound);
  // salt를 가지고 암호화된 패스워드 생성
  const hashedPw = await bcrypt.hash(user.user_pw, salt);
  const sql =
    "INSERT INTO user(user_id, user_pw, nickname, datetime_signup, email, phone_number, image) VALUES (?,?,?,?,?,?,?)";
  // query 다양한 예제 보고 할 것
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        user.user_id,
        hashedPw,
        user.nickname,
        user.datetime_signup,
        user.email,
        user.phone_number,
        user.image,
      ],
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });
}

export function updateUser(id, user) {
  const sql = `UPDATE user SET user_id = "${user.user_id}", user_pw = "${user.user_pw}", nickname = "${user.nickname}", datetime_signup = "${user.datetime_signup}", email="${user.email}", phone_number="${user.phone_number}", image="${user.image}" WHERE id = "${id}"`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}
