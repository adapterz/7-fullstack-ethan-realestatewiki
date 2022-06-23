import db from "../middlewares/db.js";
import bcrypt from "bcrypt";

// 유저 조회 (by 유저 인덱스 번호)
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

// 유저 검색 (by 유저 아이디)
export function findByUserid(user_id) {
  const sql = `SELECT id, user_id, user_pw, nickname, DATE_FORMAT(datetime_signup, '%Y-%M-%D %H:%i:%s'), email, phone_number, image FROM user WHERE user_id = "${user_id}"`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 회원 가입
export async function makeUser(user, userImage) {
  const sql =
    "INSERT INTO user(user_id, user_pw, nickname, datetime_signup, email, phone_number, image) VALUES (?,?,?,default,?,?,?)";
  // query 다양한 예제 보고 할 것
  return new Promise((resolve, reject) => {
    console.log(sql);
    db.query(
      sql,
      [
        user.user_id,
        user.user_pw,
        user.nickname,
        user.email,
        user.phone_number,
        userImage,
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

// 유저 정보 수정
export function updateUser(id, user, userImage) {
  const sql = `UPDATE user SET nickname = "${user.nickname}", email="${user.email}", phone_number="${user.phone_number}", image="${userImage}" WHERE id = ${id}`;
  console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}

// 유저 정보 삭제
export function deleteUser(id) {
  const sql = `delete from user where id= ${id}`;
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}

// 유저 아이디 중복 여부 확인
export function duplicatescheckUserId(user_id) {
  const checkUserId = `SELECT user_id FROM user WHERE user_id = "${user_id}"`;
  return new Promise((resolve, reject) => {
    db.query(checkUserId, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}

// 유저 닉네임 중복 여부 확인
export function duplicatescheckNickname(nickname) {
  const checkNickname = `SELECT nickname FROM user WHERE nickname = "${nickname}"`;
  return new Promise((resolve, reject) => {
    db.query(checkNickname, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}

// 유저 이메일 중복 여부 확인
export function duplicatescheckEmail(email) {
  const checkNickname = `SELECT email FROM user WHERE email = "${email}"`;
  return new Promise((resolve, reject) => {
    db.query(checkNickname, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}

// 유저 핸드폰번호 중복 여부 확인
export function duplicatescheckPhoneNumber(phone_number) {
  const checkPhoneNumber = `SELECT email FROM user WHERE phone_number = "${phone_number}"`;
  return new Promise((resolve, reject) => {
    db.query(checkPhoneNumber, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}
