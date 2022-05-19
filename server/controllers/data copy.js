import * as fs from "node:fs";

import mysql from "mysql";

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "realestatewiki",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
});

// 코드안에서 json 데이터 생성해서, 해보기
export function showData(req, res) {
  const sql = "select * from user where id = 8";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
    console.log(typeof result);
  });

  // res.status(201).send("GET: /users");
  // fs.readFile(
  //   "C:/Users/AHNSEONGMO/IdeaProjects/7-fullstack-ethan-realestatewiki/server/models/express.json",
  //   (error, data) => {
  //     if (error) {
  //       console.log("Something went wrong");
  //     } else {
  //       // express.json 파일 내 데이터를 파싱해서 Data에 넣는다. 그러면 데이터에 접근가능해진다.
  //       const Data = JSON.parse(data.toString());
  //       // Data를 반환한다.
  //       return res.json(Data);
  //     }
  //   }
  // );
}
// export function makeNewData(req, res) {
//   const sql = "insert into user values ()";
//   con.query(sql, function (err, result, fields) {
//     if (err) throw err;
//     res.send(result);
//     console.log(typeof result);
//     // newPeople이라는 변수에 post 요청된 내용을 할당한다.
//     // const newPeople = {
//     //   name: req.body.name,
//     //   animal: req.body.animal,
//     //   animalNumber: req.body.animalNumber,
//     // };
//     // // data 변수에 express.json 파일 데이터를 할당한다.
//     // // readFile 과 readFileSync의 차이 readFile은 비동기(명령을 전부 내리고 되는 완료 순서대로 진행), readFileSync는 동기(순서대로 코드가 진행)
//     // let data = fs.readFileSync(
//     //   "C:/Users/AHNSEONGMO/IdeaProjects/7-fullstack-ethan-realestatewiki/server/models/express.json"
//     // );
//     // // data는 buffer 형식으로 저장되기 때문에 문자열로 바꾼뒤에
//     // data = data.toString();
//     // // parsing 해준다.
//     // let Data = JSON.parse(data);
//     // // 새로운 사람의 id는 데이터 전체 길이 + 1
//     // newPeople.id = Data.length + 1;
//     // // 배열에 집어 넣는다.
//     // Data.push(newPeople);
//     // // fs.writeFileSync(경로, 파일명, 확장자명 / 파일에 기록될 데이터 양식 / options)
//     // // stringify 메서드는 javascript 값이나 객체를 json 문자열로 변환한다.
//     // fs.writeFileSync(
//     //   "C:/Users/AHNSEONGMO/IdeaProjects/7-fullstack-ethan-realestatewiki/server/models/express.json",
//     //   JSON.stringify(Data, null, 2)
//     // );
//     // return res.json(Data);
//   });
// }

export function changeAllData(req, res) {
  let id = req.params.id - 1;

  let jsonData = fs.readFileSync(
    "C:/Users/AHNSEONGMO/IdeaProjects/7-fullstack-ethan-realestatewiki/server/models/express.json"
  );
  let data = JSON.parse(jsonData);

  data[id]["name"] = req.body.name;
  data[id]["animal"] = req.body.animal;
  data[id]["animalNumber"] = req.body.animalNumber;

  fs.writeFileSync("express.json", JSON.stringify(data, null, 2));
  res.json(data);
}

export function deleteData(req, res) {
  let idForDelete = req.params.id - 1;
  let jsonData = fs.readFileSync(
    "C:/Users/AHNSEONGMO/IdeaProjects/7-fullstack-ethan-realestatewiki/server/models/express.json"
  );
  let data = JSON.parse(jsonData);
  delete data[idForDelete];
  res.json(data);
}

export function patchData(req, res) {
  let id = req.params.id - 1;

  let jsonData = fs.readFileSync(
    "C:/Users/AHNSEONGMO/IdeaProjects/7-fullstack-ethan-realestatewiki/server/models/express.json"
  );
  let data = JSON.parse(jsonData);

  if (req.body.name != null) {
    data[id]["name"] = req.body.name;
    console.log(id + ": name change done!");
  }
  if (req.body.animal != null) {
    data[id]["animal"] = req.body.animal;
    console.log(id + ": animal change done!");
  }
  if (req.body.animalNumber != null) {
    data[id]["animalNumber"] = req.body.animalNumber;
    console.log(id + ": animalNumber change done!");
  }

  fs.writeFileSync("express.json", JSON.stringify(data, null, 2));
  res.json(data);
}
