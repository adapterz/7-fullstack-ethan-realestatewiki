import express from "express";
import dataRouter from "./routes/data.js";

const app = express();

//express.json 미들웨어를 사용하고
app.use(express.json());

//dataRouter 라는 경로가 있다.
app.use("/data", dataRouter);

app.listen(8080, () => {
  console.log("server is listening");
});
