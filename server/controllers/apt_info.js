import mysql from "mysql";
import { config } from "../config.js";

const con = mysql.createConnection({
  host: config.DB.host,
  user: config.DB.user,
  password: config.DB.pw,
  database: config.DB.dbname,
});

// db에 접속
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
});

// 아파트 세부 정보 조회(아파트 인덱스 번호 이용)
export function getAptInfoById(req, res) {
  const id = req.params.id;
  const sql = `SELECT id, number_searched, name, address, households_number, number, area, image, DATE_FORMAT(approval_date, '%Y-%M-%D %H:%i:%s'), use_enabled, comments_enabled FROM apartment_information WHERE id = ${id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

export function getAptInfoByKeyword(req, res) {
  const keyword = req.query.keyword;
  console.log(`keyword:${req.query.keyword}`);
  const sql = `SELECT id, number_searched, name, address, households_number, number, area, image, DATE_FORMAT(approval_date, '%Y-%M-%D %H:%i:%s'), use_enabled, comments_enabled FROM apartment_information WHERE name LIKE '%${keyword}%' OR address LIKE '%${keyword}%'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}
