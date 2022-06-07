import db from "../db.js";

// 아파트 검색 (by 아파트 이름)
export function getAptInfoByAptName(aptName) {
  const sql = `select id, name, address from realestatewiki.apartment_information WHERE name LIKE '%${aptName}%'`;
  return new Promise((resolve, reject) => {
    console.log(sql);
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// 아파트 상세 조회 (by 아파트 id)
export function getAptInfoById(id) {
  const sql = `SELECT name, address, households_count, parking_spaces_count, all_dong_count, approval_date, datetime_updated FROM apartment_information WHERE id = ${id}`;
  return new Promise((resolve, reject) => {
    console.log(sql);
    db.query(sql, function (error, result) {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}
