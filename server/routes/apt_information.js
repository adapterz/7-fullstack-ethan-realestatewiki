import express from "express";
import * as aptInformationController from "../controllers/apt_information.js";
import { getIpAndMoment } from "../middlewares/console.js";

const router = express.Router();

// 아파트 검색 (by 아파트 이름)
router.get("/", getIpAndMoment, aptInformationController.getAptInfoByAptName);
// 아파트 상세 조회 (by 아파트 id)
router.get("/:id", getIpAndMoment, aptInformationController.getAptInfoById);

export default router;
