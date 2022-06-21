import bcrypt from "bcrypt";
const saltRounds = 10;
const myPlaintextPassword = "123456";
const someOtherPlaintextPassword = "not_bacon";

const hash = bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
  console.log(hash); // Store hash in your password DB.
  // Load hash from your password DB.
  bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
    console.log(result);
  });
});

const b = bcrypt.compare(
  someOtherPlaintextPassword,
  hash,
  function (err, result) {
    // result == false
  }
);
// console.log(a);
// console.log(b);
