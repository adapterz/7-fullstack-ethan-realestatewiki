import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let envPath;

// PM2 실행 시, NODE_ENV 값에 따라서, 참조할 ENV 파일 선택
switch (process.env.NODE_ENV) {
  // NODE_ENV 값이 production일 때
  case "production":
    console.log("env : production");
    envPath = path.join(__dirname, "..", "..", ".env.prod");
    break;

  // NODE_ENV 값이 development일 때
  case "development":
    console.log("env : development");
    envPath = path.join(__dirname, "..", "..", ".env.dev");
    break;
}

console.log(`envPath : ${envPath}`);
dotenv.config({ path: envPath });

export const config = {
  DB: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pw: process.env.DB_PW,
    dbname: process.env.DB_DBNAME,
  },
  PORT: {
    portNumber: process.env.PORT_NUM,
  },
  DATA: {
    serviceKey: process.env.DATA_SERVICEKEY,
  },
  SESSION: {
    secretKey: process.env.SESSION_SECRETKEY,
  },
  URL: {
    frontendUrl: process.env.URL_FRONTEND,
    backendUrl: process.env.URL_BACKEND,
  },
};
