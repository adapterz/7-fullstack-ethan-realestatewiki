// 비어있는 배열인지 확인
export function isEmptyArr(arr) {
  if (Array.isArray(arr) && arr.length === 0) {
    return true;
  }
  return false;
}

// 페이지네이션, 오프셋 계산
export async function pagenation(page, pageSize, allItemCount) {
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
