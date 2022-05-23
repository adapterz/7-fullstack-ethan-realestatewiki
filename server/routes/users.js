import express from "express";
import * as usersController from "../controllers/users.js";

const router = express.Router();

// 유저 아이디에 맞는 유저 데이터 조회
router.get("/my-page/:id", usersController.getUserById);
// 새로운 유저 추가
router.post("/", usersController.makeNewUser);
// 유저 정보 수정
router.put("/:id", usersController.updateUser);
// 유저 정보 삭제
router.delete("/:id", usersController.deleteUser);

export default router;

// // 전체 유저 조회
// router.get("/", usersController.getUsers);
