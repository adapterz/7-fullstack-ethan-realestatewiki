import { getSql } from "../middlewares/console.js";
import pool from "../middlewares/pool.js";

// 아파트 거래 내역 조회(by 아파트 이름, 법정동)
export function getAptTranactionListByAptNameAndDong(aptName, dong) {
  const sql = `SELECT 아파트, 법정동, 년, 월, 일, 거래금액 FROM transaction WHERE 아파트 LIKE CONCAT( '%',?,'%') and 법정동 LIKE CONCAT( '%',?,'%')`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [aptName, dong], function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 아파트 거래 내역 조회(by 아파트 이름, 법정동)
export function getRecentPrice(aptName, dong) {
  const sql = `SELECT 아파트, 법정동, 년, 월, 일, 거래금액, 층, 전용면적 FROM transaction WHERE 아파트 LIKE CONCAT( '%',?,'%') and 법정동 LIKE CONCAT( '%',?,'%') ORDER BY cast(년 as UNSIGNED) DESC, cast(월 as UNSIGNED) DESC, cast(일 as UNSIGNED) DESC LIMIT 0, 1`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, [aptName, dong], function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}
