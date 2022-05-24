import db from "../db.js";

export function getUserById(id) {
  const sql = `SELECT user_id, nickname, DATE_FORMAT(datetime_signup, '%Y-%M-%D %H:%i:%s'), email, phone_number, image FROM user WHERE id = ${id}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    return result;
  });
}

export function makeNewUser(user) {
  const sql =
    "INSERT INTO user(user_id, user_pw, nickname, datetime_signup, email, phone_number, image) VALUES (?, ?, ?,?,?,?,?)";
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
      if (error) throw error;
      const id = result.insertId;
      console.log(id);
      return result;
    }
  );
}
