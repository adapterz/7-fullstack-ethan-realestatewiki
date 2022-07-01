import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import expressMysqlSession from "express-mysql-session";
import helmet from "helmet";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";
import aptTransactionRouter from "./routes/apt_transaction.js";
import aptInformationRouter from "./routes/apt_information.js";
import { config } from "../server/middlewares/config.js";
import pool from "./middlewares/pool.js";

const app = express();
app.use(helmet());
// mysqlsessionstore 적용
const MySQLStore = expressMysqlSession(session);
const options = {
  host: config.DB.host,
  port: config.PORT.portNumber,
  user: config.DB.user,
  password: config.DB.pw,
  database: config.DB.dbname,
};
// const sessionStore = new MySQLStore(options, db);
const sessionStore = new MySQLStore(options, pool);
app.use(
  session({
    // 역할 공부
    // 세션 쿠키 name
    key: "LoginSession",
    // 세션 쿠키 secret
    secret: config.SESSION.secretKey,
    // 외부 저장소에 연결하여 session 저장
    store: sessionStore,
    // 세션이 변경되지 않아도 저장할 것인지?
    resave: false,
    // 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장
    saveUninitialized: false,
  })
);

// body-parser는 내장되어있음.  json 파싱하기 위해서 설정만 추가
app.use(express.json());
app.use(cookieParser());
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/aptinfos", aptInformationRouter);
app.use("/aptTransaction", aptTransactionRouter);

//에러핸들러
// 다른 곳에서 에러가 발생하더라도, 마지막 미들웨어가 에러에 대해서 처리해준다.
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send("Error, preparing now");
});

app.listen(config.PORT.portNumber, () => {
  console.log("server is listening");
});
