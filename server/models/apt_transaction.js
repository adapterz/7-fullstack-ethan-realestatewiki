import db from "../db.js";

export function getAptTranactionListByAptName(aptName, dong) {
  const sql = `SELECT 아파트, 법정동, 년, 월, 일, 거래금액 FROM transaction WHERE 아파트 LIKE '%${aptName}%' and 법정동 LIKE '%${dong}%'`;
  console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, result) {
      if (error) {
        return reject("database", `${error.message}`);
      }
      resolve(result);
    });
  });
}
