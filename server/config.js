import dotenv from "dotenv";
dotenv.config({
  path: "C:/Users/AHNSEONGMO/IdeaProjects/7-fullstack-ethan-realestatewiki/server/.env",
});

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
};
