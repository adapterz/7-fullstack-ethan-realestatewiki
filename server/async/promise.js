"use strict";

// Promise is a JavaScript object for asynchronous operation.
// 1. state(성공과 실패)를 이해
// 2. producing consumer의 차이점을 이해
// State: pending -> fulfilled or rejected
// Producer vs Consumer

// 1. Producer
// when new promise is created, the executor runs automatically
// promise 객체를 생성하는 순간, excute라는 콜백함수가 바로 실행된다.
// 1. 네트워크 요청을 사용자가 요구시에만 해야하는 경우라면 불필요한 네트워크 통신이 일어날 수 있다.
// promise 오브젝트 생성
const promise = new Promise((resolve, reject) => {
  // doing some heavy work (network, read files)
  console.log("doing something...");
  setTimeout(() => {
    resolve("ellie");
    // reject(new Error("no network"));
  }, 2000);
});

// 2. Consumer : Then, catch, finally
// then 프로미스가 정상적으로 실행되었을 때, 실행.
promise
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    console.log("finally");
  });

//   3. Promise Chaining
const fetchNumber = new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000);
});

//then에서는 값을 바로 전달해도되고, promise를 전달해도된다.
fetchNumber
  .then((num) => num * 2)
  .then((num) => num * 3)
  .then((num) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(num - 1), 1000);
    });
  })
  .then((num) => console.log(num));

//4. Error Handling
const getHen = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve("암탉"), 1000);
  });
const getEgg = (hen) =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error(`error ${hen} => 알`), 1000));
    // setTimeout(() => resolve(`${hen} => 알`), 1000);
  });
const cook = (egg) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(`${egg} => 요리`, 1000));
  });

getHen()
  // 한가지만 받아와서 그대로 인자로 주면 생략 가능
  // .then((hen) => getEgg(hen))
  .then(getEgg)
  .catch((error) => {
    return "다른 재료";
  })
  .then(cook)
  .then(console.log)
  .catch(console.log);
//   .then((egg) => cook(egg))
//   .then((meal) => console.log(meal));
