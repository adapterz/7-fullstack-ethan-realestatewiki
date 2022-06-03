import db from "../db.js";

// 아파트 세부 정보 조회(아파트 인덱스 번호 이용)
export function getAptInfoById(req, res) {
  const id = req.params.id;
  const sql = `SELECT id, number_searched, name, address, households_number, number, area, image, DATE_FORMAT(approval_date, '%Y-%M-%D %H:%i:%s'), 
  use_enabled, comments_enabled FROM apartment_information WHERE id = ${id}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

// 페이지 당 게시글수
const contentPerPage = 20;
// 화면 당 보여질 페이지네이션 버튼의 갯수??????????????????
const pagePerScreen = 10;

// 키워드로 아파트 정보 검색하기
export function getAptInfoByKeyword(req, res) {
  // 검색어
  const keyword = req.query.keyword;
  // 요청 페이지 번호
  let page = req.query.page;
  if (!page) {
    page = 1;
  }
  console.log(`keyword:${req.query.keyword}`);
  console.log(`page:${req.query.page}`);
  const sql = `SELECT DISTINCT 건축년도, 법정동, 아파트, 지번, 지역코드 FROM transaction WHERE 아파트 LIKE '%${keyword}%'`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    // console.log(`1번 ${result}`);
    const totalContent = result.length;
    // console.log(totalContent);
    const totalPage = Math.ceil(totalContent / contentPerPage);
    const pageGroup = Math.ceil(page / pagePerScreen);
    // const lastPage = pageGroup * pagePerScreen;
    // if (lastPage > totalPage) last = totalPage;
    // const firstPage =
    //   lastPage - (pagePerScreen - 1) <= 0 ? 1 : last - (pagePerScreen - 1);

    // sql이 들어가야하는가?
    const sqlByPagenation = `SELECT DISTINCT 건축년도, 법정동, 아파트, 지번, 지역코드 FROM transaction WHERE 아파트 LIKE '%${keyword}%' LIMIT ${contentPerPage} OFFSET ${
      (page - 1) * 20
    }`;
    db.query(sqlByPagenation, function (err, result) {
      if (err) throw err.code;
      const datas = [];
      for (let i = 0; i < result.length; i++) {
        datas.push(
          `검색결과번호 : ${i + 1}, 건축년도 : ${
            result[i]["건축년도"]
          }, 법정동 : ${result[i]["법정동"]}, 아파트명 : ${
            result[i]["아파트"]
          }, 지번 : ${result[i]["지번"]}, 지역코드 : ${result[i]["지역코드"]}}`
        );
      }
      console.log(datas);
      res.send(datas);
    });
  });
}

async function getDataByPage(req, res) {
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);
  const keyword = req.query.keyword;
  try {
    let start = 0;
    if (page <= 0) {
      page = 1;
    } else {
      start = (page - 1) * pageSize;
    }
    const cnt = getAptInfoByKeyword();
  } catch (error) {
    console.error();
  }
}
