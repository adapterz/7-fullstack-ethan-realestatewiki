import mysql from "mysql";
import { config } from "./config.js";

export const pool = mysql.createPool({
  //커넥션 pool 내 커넥션의 개수
  connectionLimit: 10,
  //커넥션이 되었을 때, 사용 시간 초과 발생하기 전 밀리초 (기본값 10000)
  acquireTimeout: 10000,
  //사용가능한 커넥션이 없고, 제한에 도달한 경우, 연결 요청을 대기열에 넣고, 사용가능할 때, 호출(default값 : true)
  waitForConnections: true,
  // 오류를 반환하기 전 대기열에 넣을 최대 연결 요청 수(기본값 0, 대기열에 들어갈 연결 요청 수 제한 없음)
  queueLimit: 0,
  host: config.DB.host,
  user: config.DB.user,
  password: config.DB.pw,
  database: config.DB.dbname,
});

export default pool;
