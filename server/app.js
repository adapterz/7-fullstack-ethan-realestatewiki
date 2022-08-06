import express from "express";
import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cookieParser from "cookie-parser";
import session from "express-session";
import expressMysqlSession from "express-mysql-session";
import pool from "./middlewares/pool.js";
import helmet from "helmet";
import timeout from "connect-timeout";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";
import aptTransactionRouter from "./routes/apt_transaction.js";
import aptInformationRouter from "./routes/apt_information.js";
import { config } from "../server/middlewares/config.js";
import morgan from "morgan";
import logger from "./middlewares/winston.js";
import cors from "cors";

const combined =
  ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
// 기존 combined 포멧에서 timestamp만 제거
const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : combined; // NOTE: morgan 출력 형태 server.env에서 NODE_ENV 설정 production : 배포 dev : 개발
console.log(morganFormat);

const app = express();

if (process.env.NODE_ENV == "production") {
  app.use(function (req, res, next) {
    console.log(req.secure);
    if (!req.secure) {
      res.redirect("https://" + "api.realestatewiki.kr" + req.url);
    } else {
      next();
    }
  });
}
app.use("/*", function (req, res, next) {
  console.log("access");
  res.header("Access-Control-Allow-Origin", "http://localhost:443");
  // res.header("Access-Control-Allow-Origin", "https://localhost:443");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(
  cors({
    origin: "http://localhost:443",
    credentials: true,
    methods: "PUT, GET, POST, DELETE, OPTIONS",
  })
);
app.use(
  cors({
    origin: "https://localhost:443",
    credentials: true,
    methods: "PUT, GET, POST, DELETE, OPTIONS",
  })
);
app.use(cors(["localhost:443"]));
app.use(cors(["https://realestatewiki.kr"]));
app.use(morgan(morganFormat, { stream: logger.stream })); // morgan 로그 설정
app.use(timeout("5s"));
// app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..")));
// app.use(express.static(`${__dirname}`));
console.log(__dirname);
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
    cookie: {
      httpOnly: false,
      maxAge: 30 * 60 * 1000,
      secure: false,
    },
  })
);

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

console.log(`HTTPS 적용 여부 : ${process.env.HTTPS}`);

let chain;
let key;
let cert;

try {
  chain = fs.readFileSync(
    path.resolve(
      "/etc",
      "letsencrypt",
      "live",
      "api.realestatewiki.kr",
      "fullchain.pem"
    )
  );
  key = fs.readFileSync(
    path.resolve(
      "/etc",
      "letsencrypt",
      "live",
      "api.realestatewiki.kr",
      "privkey.pem"
    )
  );
  cert = fs.readFileSync(
    path.resolve(
      "/etc",
      "letsencrypt",
      "live",
      "api.realestatewiki.kr",
      "cert.pem"
    )
  );
} catch (err) {
  console.log(chain);
  console.log(key);
  console.log(cert);
  console.log(err);
  console.log("SSL 인증서가 없습니다. 로컬 환경 입니다.");
}

const SSLoptions = {
  ca: chain,
  key: key,
  cert: cert,
};

if (SSLoptions.cert != undefined) {
  http.createServer(app).listen(80, () => {
    console.log(`server is listening ${process.env.PORT_NUM_PROD}`);
  });
  https.createServer(SSLoptions, app).listen(443, () => {
    console.log(`server is listening ${process.env.PORT_NUM}`);
  });
} else {
  http.createServer(app).listen(process.env.PORT_NUM, () => {
    console.log(`server is listening ${process.env.PORT_NUM}`);
  });
}

function haltOnTimedout(req, res, next) {
  // req.timedout 시간 초과 발생 시 : true, 그 외 : false
  if (!req.timedout) next();
}
