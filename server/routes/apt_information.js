import express from "express";
import * as aptInformationController from "../controllers/apt_information.js";

const router = express.Router();

// 아파트 검색 (by 아파트 이름)
router.get("/", aptInformationController.getAptInfoByAptName);
// 아파트 상세 조회 (by 아파트 id)
router.get("/:id", aptInformationController.getAptInfoById);

export default router;
