import { getSql } from "../middlewares/console.js";
import db from "../middlewares/db.js";

// 아파트 거래 내역 조회(by 아파트 이름, 법정동)
export function getAptTranactionListByAptNameAndDong(aptName, dong) {
  const sql = `SELECT 아파트, 법정동, 년, 월, 일, 거래금액 FROM transaction WHERE 아파트 LIKE '%${aptName}%' and 법정동 LIKE '%${dong}%'`;
  getSql(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject("database", `${error.message}`);
      }
      resolve(result);
    });
  });
}
