import express from "express";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";
import aptinfoRouter from "./routes/apt_info.js";

import cookieParser from "cookie-parser";
import session from "express-session";
import sessionFileStore from "session-file-store";
import db from "../server/db.js";
// initialize
const app = express();

db.connect(function (err) {
  if (err) throw err;
  console.log("DB Connected");
});

app.use(express.json());
app.use(cookieParser());

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

const FileStore = sessionFileStore(session);
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

app.get("/", (req, res) => {
  console.log(req.session);
  if (req.session.num === undefined) {
    req.session.num = 1;
  } else {
    req.session.num += 1;
  }

  res.send(`View: ${req.session.num}`);
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

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/aptinfos", aptinfoRouter);
app.post("/practice", (req, res, next) => {
  console.log(req.body);
});

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
app.listen(8080, () => {
  console.log("server is listening");
});
