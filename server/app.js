import express from "express";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
import session from "express-session";
import expressMysqlSession from "express-mysql-session";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";
import aptTransactionRouter from "./routes/apt_transaction.js";
import aptInformationRouter from "./routes/apt_information.js";
import authenticationRounter from "./routes/authentication.js";
import db from "../server/db.js";
import { config } from "../server/config.js";

const app = express();

// mysqlsessionstore 적용
const MySQLStore = expressMysqlSession(session);
const options = {
  host: config.DB.host,
  port: config.PORT.portNumber,
  user: config.DB.user,
  password: config.DB.pw,
  database: config.DB.dbname,
};
const sessionStore = new MySQLStore(options, db);
app.use(
  session({
    // 역할 공부
    // 세션 쿠키 name
    key: "LoginSession",
    // 세션 쿠키 secret
    secret: "secret key",
    // 외부 저장소에 연결하여 session 저장
    store: sessionStore,
    // 세션이 변경되지 않아도 저장할 것인지?
    resave: false,
    // 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/aptinfos", aptInformationRouter);
app.use("/aptTransaction", aptTransactionRouter);
app.use("/authentication", authenticationRounter);

// app.use((req, res, next) => {
//   bodyParser.json()(req, res, (err) => {
//     if (err) {
//       console.error(err);
//       return res.sendStatus(400); // Bad request
//     }
//     next();
//   });
// });
// 요청에 대해서 앞부분에서 처리 못했을 때.
app.use((req, res, next) => {
  res.status(404).send("Not available!");
});

//에러핸들러
// 다른 곳에서 에러가 발생하더라도, 마지막 미들웨어가 에러에 대해서 처리해준다.
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send("Error, preparing now");
});

app.listen(config.PORT.portNumber, () => {
  console.log("server is listening");
});

// const cookieConfig = {
//   maxAge: 30000,
// };
// app.get("/set", (req, res) => {
//   res.cookie("cookie-name", "cooke-content", cookieConfig);
//   res.send("set cookie");
// });
// app.get("/get", (req, res) => {
//   res.send(req.cookies);
// });

// memorystore 방식
// import { MemoryStore } from "express-session";
// app.use(
//   session({
//     secret: "secret key",
//     resave: false,
//     saveUninitialized: true,
//     store: new MemoryStore({
//       checkPeriod: 5000,
//     }),
//     cookie: { maxAge: 5000 },
//   })
// );

// file session store 방식
// import sessionFileStore from "session-file-store";
// const FileStore = sessionFileStore(session);
// app.use(
//   session({
//     secret: "secret key",
//     resave: false,
//     saveUninitialized: true,
//     store: new FileStore(),
//   })
// );

// const sessionStore = new mySQLStore(options);

// app.use(
//   session({
//     key: "LoginSession",
//     secret: "secret key",
//     resave: false,
//     saveUninitialized: true,
//     store: new mySQLStore({
//       host: config.DB.host,
//       port: config.PORT.portNumber,
//       user: config.DB.user,
//       password: config.DB.pw,
//       database: config.DB.dbname,
//     }),
//     cookie: {
//       maxAge: 60 * 1000,
//     },
//   })
// );

// app.get("/login1", function (req, res) {
//   const user = req.body;
//   console.log(user);
//   db.query(
//     "select nickname from user where user_id = ? and user_pw = ?",
//     [user.user_id, user.user_pw],
//     function (err, result) {
//       if (err) throw err;
//       if (result[0] !== undefined) {
//         req.session.uid = result[0].id;
//         req.session.author_id = result[0].author_id;
//         req.session.isLogined = true;
//         //세션 스토어가 이루어진 후 redirect를 해야함.
//         req.session.save(function () {
//           rsp.redirect("/");
//         });
//       }
//     }
//   );
// });

// app.get("/", (req, res) => {
//   console.log(req.session);
//   if (req.session.num === undefined) {
//     req.session.num = 1;
//   } else {
//     req.session.num += 1;
//   }

//   res.send(`View: ${req.session.num}`);
// });

// db.connect(function (err) {
//   if (err) throw err;
//   console.log("DB Connected");
// });
