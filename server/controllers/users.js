import mysql from "mysql";
import { config } from "../config.js";

const con = mysql.createConnection({
  host: config.DB.host,
  user: config.DB.user,
  password: config.DB.pw,
  database: config.DB.dbname,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
});

// 회원 아이디로 유저 정보 조회하기
export function getUserById(req, res) {
  const id = req.params.id;
  const sql = `SELECT user_id, nickname, DATE_FORMAT(datetime_signup, '%Y-%M-%D %H:%i:%s'), email, phone_number, image FROM user WHERE id = ${id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

// 새로운 유저 데이터 추가, 회원 가입
export function makeNewUser(req, res) {
  const user_id = req.body.user_id;
  const user_pw = req.body.user_pw;
  const nickname = req.body.nickname;
  const datetime_signup = req.body.datetime_signup;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const image = req.body.image;

  const sql =
    "INSERT INTO user(user_id, user_pw, nickname, datetime_signup, email, phone_number, image) VALUES (?, ?, ?,?,?,?,?)";
  con.query(
    sql,
    [user_id, user_pw, nickname, datetime_signup, email, phone_number, image],
    function (error, result) {
      if (error) throw error;
      res.send(result);
    }
  );
}

// 회원 정보 수정
export function updateUser(req, res) {
  const id = req.params.id;
  const user_id = req.body.user_id;
  const user_pw = req.body.user_pw;
  const nickname = req.body.nickname;
  const datetime_signup = req.body.datetime_signup;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const image = req.body.image;

  const sql = `UPDATE user SET user_id = "${user_id}", user_pw = "${user_pw}", nickname = "${nickname}", datetime_signup = "${datetime_signup}", email="${email}", phone_number="${phone_number}", image="${image}" WHERE id = "${id}"`;
  console.log(sql);
  con.query(sql, function (error, result) {
    if (error) throw error;
    res.send(result);
  });
}

// 유저 삭제
export function deleteUser(req, res) {
  const id = req.params.id;
  const sql = `delete from user where id= ${id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

// export function getUsers(req, res) {
//   const sql = "select * from user";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     res.send(result);
//   });
// }
