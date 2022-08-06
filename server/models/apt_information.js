import { getSql } from "../middlewares/console.js";
import pool from "../middlewares/pool.js";

// 인기 아파트 가져오기 (홈화면)
export function getPopularApt() {
  const sql = `SELECT id, name, address, adress_gu, adress_dong,  number_searched FROM realestatewiki.apartment_information ORDER BY number_searched DESC LIMIT 0, 10`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

// 아파트 검색 (by 아파트 이름)
export function getAptInfoByAptName(aptName) {
  const sql = `select id, name, number_searched, address from realestatewiki.apartment_information WHERE name LIKE CONCAT( '%',?,'%')`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, aptName, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

export function getAptInfoByAptNameByPagenation(aptName, start, pageSize) {
  const sql = `select id, name, address, number_searched from realestatewiki.apartment_information WHERE name LIKE CONCAT( '%',?,'%') LIMIT ?, ? `;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        sql,
        [aptName, start, pageSize],
        function (error, result) {
          if (error) {
            return reject("database", `${error.message}`);
          }
          connection.release();
          resolve(result);
        }
      );
    });
  });
}

// 아파트 상세 조회 (by 아파트 id)
export function getAptInfoById(id) {
  const sql = `SELECT name, address, adress_gu, adress_dong, households_count, parking_spaces_count, all_dong_count,  FROM_UNIXTIME(approval_date/1000, '%y-%m-%d') as approval_date,  FROM_UNIXTIME(datetime_updated/1000, '%y-%m-%d') as datetime_updated FROM apartment_information WHERE id = ?`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql, id, function (error, result) {
        if (error) {
          return reject("database", `${error.message}`);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}
