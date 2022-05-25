import db from "../db.js";

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

export function makeNewUser(user) {
  const sql =
    "INSERT INTO user(user_id, user_pw, nickname, datetime_signup, email, phone_number, image) VALUES (?, ?, ?,?,?,?,?)";
  // query 다양한 예제 보고 할 것
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        user.user_id,
        user.user_pw,
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
