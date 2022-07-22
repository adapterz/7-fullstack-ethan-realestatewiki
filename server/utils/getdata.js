import { config } from "../server/config.js";
import axios from "axios";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: config.DB.host,
  user: config.DB.user,
  password: config.DB.pw,
  database: config.DB.dbname,
});
// 11000, 11110, 11140, 11170, 11200, 11215, 11230, 11260, 11290, 11305, 11320,
//   11350, 11380, 11410, 11440, 11470, 11500, 11530, 11545, 11560, 11590, 11620,
//   11650, 11680, 11710, 11740,41000, 41010, 41011, 41012, 41013, 41014, 41050,
const dong = [
  41110, 41111, 41113, 41115, 41117, 41130, 41131, 41133, 41135, 41150, 41170,
  41171, 41173, 41190, 41191, 41193, 41195, 41197, 41199, 41210, 41220, 41230,
  41250, 41270, 41271, 41273, 41280, 41281, 41283, 41285, 41287, 41290, 41310,
  41330, 41350, 41360, 41370, 41390, 41410, 41430, 41450, 41460, 41461, 41463,
  41465, 41480, 41500, 41550, 41570, 41590, 41610, 41630, 41650, 41670, 41710,
  41720, 41730, 41740, 41750, 41760, 41770, 41780, 41790, 41800, 41810, 41820,
  41830, 41840, 41850, 41860, 41870, 41880, 41890,
];

const yearAndMonth = [
  202101, 202102, 202103, 202104, 202105, 202106, 202107, 202108, 202109,
  202110, 202111, 202112,
];

// 201512, 201601, 201602, 201603, 201604, 201605, 201606, 201607, 201608,
//   201609, 201610, 201611, 201612, 201701, 201702, 201703, 201704, 201705,
//   201706, 201707, 201708, 201709, 201710, 201711, 201712, 201801, 201802,
//   201803, 201804, 201805, 201806, 201807, 201808, 201809, 201810, 201811,
//   201812, 201901, 201902, 201903, 201904, 201905, 201906, 201907, 201908,
//   201909, 201910, 201911, 201912, 202001, 202002, 202003, 202004, 202005,
//   202006, 202007, 202008, 202009, 202010, 202011, 202012,

const serviceKey = config.DATA.serviceKey;
async function getData(dong, ym) {
  try {
    const url = `http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade?LAWD_CD=${dong}&DEAL_YMD=${ym}&serviceKey=${serviceKey}`;
    const response = await axios.get(url);
    // console.log(response);
    const data = response.data.response.body;
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
const sql =
  "INSERT INTO transaction(거래금액, 거래유형, 건축년도, 년, 법정동, 아파트, 월, 일, 전용면적, 중개사소재지, 지번, 지역코드, 층, 해제사유발생일, 해제여부) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

const insertData = async (dong, ym) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const data = await getData(dong, ym);
      for (let i = 0; i < data.length; i++) {
        let 거래금액 = data[i]["거래금액"];
        let 거래유형 = data[i]["거래유형"];
        let 건축년도 = data[i]["건축년도"];
        let 년 = data[i]["년"];
        let 법정동 = data[i]["법정동"];
        let 아파트 = data[i]["아파트"];
        let 월 = data[i]["월"];
        let 일 = data[i]["일"];
        let 전용면적 = data[i]["전용면적"];
        let 중개사소재지 = data[i]["중개사소재지"];
        let 지번 = data[i]["지번"];
        let 지역코드 = data[i]["지역코드"];
        let 층 = data[i]["층"];
        let 해제사유발생일 = data[i]["해제사유발생일"];
        let 해제여부 = data[i]["해제여부"];
        await connection.query(sql, [
          거래금액,
          거래유형,
          건축년도,
          년,
          법정동,
          아파트,
          월,
          일,
          전용면적,
          중개사소재지,
          지번,
          지역코드,
          층,
          해제사유발생일,
          해제여부,
        ]);
      }
      connection.release();
    } catch (error) {
      console.log(error);
      connection.release();
      return false;
    }
  } catch (error) {
    console.log("DB Error");
    return false;
  }
};

dong.forEach((dong) => {
  yearAndMonth.forEach((ym) => {
    insertData(dong, ym);
    setTimeout(() => console.log("대기중"), 5000);
  });
});

//Math.ceil() 함수는 주어진 숫자보다 크거나 같은 숫자 중 가장 작은 숫자를 integer 로 반환합니다.
// // const 총페이지수 = Math.ceil(전체게시글수 / 한페이지당나타낼게시글수);
// const 총페이지수ex = Math.ceil(23 / 20);
// // const 화면에보여질페이지그룹 = Math.ceil(현재페이지 / 한화면에나타낼페이지수);
// const 화면에보여질페이지그룹ex = Math.ceil(2 / 10);

// console.log(총페이지수ex); //3
// console.log(화면에보여질페이지그룹ex); //1

// // 전체페이지수
// const totalPage = Math.ceil(totalContent / contentPerPage);
// // 현재 페이지 그룹
// const pageGroup = Math.ceil(currentPage / pagePerScreen);
// // 전체게시글수
// const totalContent = 512;
// // 한페이지당게시글수
// const contentPerPage = 20;
// // 한화면에보여줄페이지수

// const pagePerScreen = 10;
// const currentPage = 1;

// // 마지막 페이지 수
// const lastPage = pageGroup * pagePerScreen;
// if (lastPage > totalPage) last = totalPage;
// const firstPage =
//   lastPage - (pagePerScreen - 1) <= 0 ? 1 : last - (pagePerScreen - 1);
