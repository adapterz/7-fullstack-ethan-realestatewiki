import { getSql } from "../middlewares/console.js";
import pool from "../middlewares/pool.js";

// 아파트 검색 (by 아파트 이름)
export function getAptInfoByAptName(aptName) {
  const sql = `select id, name, address from realestatewiki.apartment_information WHERE name LIKE '%${aptName}%'`;
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

export function getAptInfoByAptNameByPagenation(aptName, start, pageSize) {
  const sql = `select id, name, address from realestatewiki.apartment_information WHERE name LIKE '%${aptName}%' LIMIT ${start}, ${pageSize} `;
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

// 아파트 상세 조회 (by 아파트 id)
export function getAptInfoById(id) {
  const sql = `SELECT name, address, households_count, parking_spaces_count, all_dong_count, approval_date, datetime_updated FROM apartment_information WHERE id = ${id}`;
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
