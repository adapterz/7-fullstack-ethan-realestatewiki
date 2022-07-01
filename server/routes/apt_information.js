import express from "express";
import * as aptInformationController from "../controllers/apt_information.js";
import { getIpAndMoment } from "../middlewares/console.js";
import limiter from "../middlewares/ratelimit.js";

const router = express.Router();

// 아파트 검색 (by 아파트 이름)
router.get(
  "/",
  limiter,
  getIpAndMoment,
  aptInformationController.getAptInfoByAptName
);
// 아파트 상세 조회 (by 아파트 id)
router.get(
  "/:id",
  limiter,
  getIpAndMoment,
  aptInformationController.getAptInfoById
);

export default router;
