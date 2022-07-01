import "request-ip";
import "colors";
import moment from "moment";
import "moment-timezone";
import { getClientIp } from "request-ip";

export const getIpAndMoment = async (req, res, next) => {
  console.log(
    `client IP : ${getClientIp(req)}, moment : ${moment().tz("Asia/Seoul")}`
      .blue
  );
  next();
};

export function getSql(sql) {
  console.log(`sql : ${sql}`.red);
}
