import express from "express";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";
import aptinfoRouter from "./routes/apt_info.js";

const app = express();

app.use(express.json());

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/aptinfos", aptinfoRouter);

app.listen(8080, () => {
  console.log("server is listening");
});
