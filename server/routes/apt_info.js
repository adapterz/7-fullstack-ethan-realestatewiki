import express from "express";
import * as aptInfoController from "../controllers/apt_info.js";

const router = express.Router();

// 아파트 인덱스 번호에 맞는 아파트 정보 조회
// router.get("/getbyid/:id", aptInfoController.getAptInfoById);
router.get("/:id", aptInfoController.getAptInfoById);
// 키워드로 게시글 데이터 검색
// router.get("/search", aptInfoController.getAptInfoByKeyword);
router.get("/", aptInfoController.getAptInfoByKeyword);

export default router;

// // 전체 유저 조회
// router.get("/", usersController.getUsers);
