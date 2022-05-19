import * as fs from "node:fs";

import mysql from "mysql";

// con 변수에 mysql,createConnection 함수로 db접속 정보를 담는다.
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "realestatewiki",
});

// db에 접속
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
});

// 코드안에서 json 데이터 생성해서, 해보기

// 데이터 조회
export function showData(req, res) {
  // sql변수에 sql문 정의
  const sql = "select * from user";
  // con.query 함수
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.send(result[0].datetime_signup);
    console.log(typeof result);
  });
}

export function makeNewData(req, res) {
  const user_id = req.body.user_id;
  const user_pw = req.body.user_pw;
  const nickname = req.body.nickname;
  const datetime_signup = req.body.datetime_signup;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const image = req.body.image;

  const sql =
    "insert into user(user_id, user_pw, nickname, datetime_signup, email, phone_number, image) values (?, ?, ?,?,?,?,?)";
  con.query(
    sql,
    [user_id, user_pw, nickname, datetime_signup, email, phone_number, image],
    function (error, result) {
      if (error) throw error;
      res.send(result);
    }
  );
}

export function changeAllData(req, res) {
  let id = req.params.id - 1;

  let jsonData = fs.readFileSync(
    "C:/Users/AHNSEONGMO/IdeaProjects/7-fullstack-ethan-realestatewiki/server/models/express.json"
  );
  let data = JSON.parse(jsonData);

  data[id]["name"] = req.body.name;
  data[id]["animal"] = req.body.animal;
  data[id]["animalNumber"] = req.body.animalNumber;

  fs.writeFileSync("express.json", JSON.stringify(data, null, 2));
  res.json(data);
}

export function deleteData(req, res) {
  let idForDelete = req.params.id - 1;
  let jsonData = fs.readFileSync(
    "C:/Users/AHNSEONGMO/IdeaProjects/7-fullstack-ethan-realestatewiki/server/models/express.json"
  );
  let data = JSON.parse(jsonData);
  delete data[idForDelete];
  res.json(data);
}

export function patchData(req, res) {
  let id = req.params.id - 1;

  let jsonData = fs.readFileSync(
    "C:/Users/AHNSEONGMO/IdeaProjects/7-fullstack-ethan-realestatewiki/server/models/express.json"
  );
  let data = JSON.parse(jsonData);

  if (req.body.name != null) {
    data[id]["name"] = req.body.name;
    console.log(id + ": name change done!");
  }
  if (req.body.animal != null) {
    data[id]["animal"] = req.body.animal;
    console.log(id + ": animal change done!");
  }
  if (req.body.animalNumber != null) {
    data[id]["animalNumber"] = req.body.animalNumber;
    console.log(id + ": animalNumber change done!");
  }

  fs.writeFileSync("express.json", JSON.stringify(data, null, 2));
  res.json(data);
}
