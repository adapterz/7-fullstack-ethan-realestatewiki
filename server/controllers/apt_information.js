import * as aptInfoRepository from "../models/apt_information.js";

// 아파트 검색 (by 아파트 이름)

export async function getAptInfoByAptName(req, res) {
  let page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);
  const aptName = req.query.aptName;
  // 페이지 미입력시 에러
  if (!page || !pageSize || isNaN(page) || isNaN(pageSize)) {
    return res.status(400).json({
      message:
        "Bad Request : Please enter correct page or pageSize(page and pageSize is number).",
    });
  }
  // 검색어 미입력시 에러
  if (!req.query.aptName) {
    return res
      .status(400)
      .json({ message: "Bad Request : Please enter your search term." });
  }
  const apt = await aptInfoRepository.getAptInfoByAptName(aptName);
  // 검색하려는 데이터가 존재하지 않을 때 에러
  if (apt[0] === undefined) {
    return res.status(404).json({ message: `Not Found : apt doesn't exist` });
  }
  console.log(`총 데이터 갯수 : ${apt.length}`);
  console.log(`총 페이지 갯수 : ${Math.round(apt.length / pageSize)}`);
  let startItemNumber = await pagenation(page, pageSize, apt.length);
  const aptInfoByKeyword =
    await aptInfoRepository.getAptInfoByAptNameByPagenation(
      aptName,
      startItemNumber[1],
      pageSize
    );
  return res.status(200).send(aptInfoByKeyword);
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

async function pagenation(page, pageSize, allItemCount) {
  let startItemNumber = 0;
  if (page <= 0) {
    console.log(`요청된 페이지 page : ${page}`);
    console.log("요청된 page가 음수입니다.");
    page = 1;
    startItemNumber = (page - 1) * pageSize;
    return [page, startItemNumber];
  }
  if (page > Math.round(allItemCount / pageSize)) {
    console.log(`요청된 페이지 page : ${page}`);
    console.log(
      `출력 가능한 페이지 page : ${Math.round(allItemCount / pageSize)}`
    );
    console.log("요청된 page가 전체 페이지 보다 큽니다.");
    page = 1;
    startItemNumber = (page - 1) * pageSize;
    return [page, startItemNumber];
  }
  startItemNumber = (page - 1) * pageSize;
  return [page, startItemNumber];

  // console.log(`postLength : ${post.length}`);
  // console.log(`keyword : ${keyword}`);
  // console.log(`page : ${startItemNumber[0]}`);
  // console.log(`pageSize : ${pageSize}`);
  // console.log(`startItemNumber : ${startItemNumber[1]}`);
}
