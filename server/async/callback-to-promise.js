"use strict";

// JavaScript is synchronous
// Execute the code block by order after hoisting
// hoisting : var, function declaration이 제일 위로 올라가는 것
// callback : 다시 불러줘 함수
console.log("1");
setTimeout(() => {
  console.log("2");
}, 1000);
console.log("3");

// Synchronous callback
// print라는 파라미터 인자를 받아서 콜백을 바로 실행
// 함수는 호이스팅 된다.
function printImmediately(print) {
  print();
}
printImmediately(() => console.log("hello"));

// Asychoronous callback
function printWithDelay(print, timeout) {
  setTimeout(print, timeout);
}

printWithDelay(() => console.log("async callback"), 2000);

// Callback Hell Example
class UserStorage {
  loginUser(id, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          (id === "ellie" && password === "dream") ||
          (id === "coder" && password === "academy")
        ) {
          resolve(id);
        } else {
          reject(new Error("not found"));
        }
      }, 2000);
    });
  }
  getRoles(user) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user === "ellie") {
          resolve({ name: "ellie", role: "admin" });
        } else {
          reject(new Error("no access"));
        }
      }, 1000);
    });
  }
}

const userStorage = new UserStorage();
const id = prompt("enter your id");
const password = prompt("enter your password");
userStorage
  .loginUser(id, password)
  .then((user) => userStorage.getRoles(user))
  .then((user) => alert(`Hello ${user.name}, you have a ${user.role}`))
  .catch(console.log);
