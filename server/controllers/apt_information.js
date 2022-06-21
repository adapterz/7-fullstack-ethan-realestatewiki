import * as aptInfoRepository from "../models/apt_information.js";

// 아파트 검색 (by 아파트 이름)
export async function getAptInfoByAptName(req, res) {
  const aptName = req.query.aptName;
  const apt = await aptInfoRepository.getAptInfoByAptName(aptName);
  if (apt[0] === undefined) {
    return res.status(404).json({ message: `Not Found : apt doesn't exist` });
  }
  return res.status(200).send(apt);
}

// 아파트 상세 조회 (by 아파트 id)
export async function getAptInfoById(req, res) {
  const id = req.params.id;
  const apt = await aptInfoRepository.getAptInfoById(id);
  if (apt[0] === undefined) {
    return res.status(404).json({ message: `Not Found : apt doesn't exist` });
  }
  return res.status(200).send(apt);
}
