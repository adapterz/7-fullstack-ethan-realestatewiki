// async & await
// clear style of using promise;

// 1.async
// function fetchUser() {
//   // do network request in 10 sec
//   // promise 내가 언제 유저 데이터를 받아올지는 모르겠지만
//   //   약속할게, 이 객체를 가지고 있으면 then이라는 콜백함수를 등록해놓으면
//   //   준비되는데로 콜백함수 실행해줄게
//   return new Promise((resolve, reject) => {
//     resolve("ellie");
//   });
// }

// const user = fetchUser();
// user.then(console.log);

//async를 쓰면 코드 블록이 promise로 바뀐다.
async function fetchUser() {
  return "ellie";
}

const user = fetchUser();
user.then(console.log);

//2. await
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// await은 async가 붙은 함수 안에서만 쓸 수 있다.
// async 프로미스를 만드는 함수
async function getApple() {
  await delay(1000);
  return "사과";
}

async function getBanana() {
  await delay(2000);
  return "바나나";
}

// function getBanana(){
//     return delay(3000).then(()=>"바나나");
// }

async function pickFruits() {
  //병렬적으로 실행하기
  //프로미스는 만드는 순간, 실행되는 점을 이용
  const applePromise = getApple();
  const bananaPromise = getBanana();
  // 동기화를 시키기
  const apple = await applePromise;
  const banana = await bananaPromise;
  //   const apple = await getApple();
  //   const banana = await getBanana();
  return `${apple} + ${banana}`;
}

// function pickFruits() {
//   return getApple().then((apple) => {
//     return getBanana().then((banana) => `${apple} + ${banana}`);
//   });
// }

pickFruits().then(console.log);

//3. useful Promise APIs
function pickAllFruits() {
  return Promise.all([getApple(), getBanana()]).then((fruits) =>
    fruits.join(" + ")
  );
}

pickAllFruits().then(console.log);

function pickOnlyOne() {
  return Promise.race([getApple(), getBanana()]);
}

pickOnlyOne().then(console.log);
