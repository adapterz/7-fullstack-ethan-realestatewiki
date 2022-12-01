import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  //요청 레코드를 메모리에 보관하는 시간(ms)을 지정한다. 기본값은 60000
  windowMs: 3 * 1000,
  // 지정한 시간(windowMS 밀리초) 동안의 최대 요청 가능 수
  max: 1,
  // 제한 시간 초과 시 콜백 함수
  handler(req, res) {
    return res.status(this.statusCode).json({
      // 최대값을 초과할 때 반환되는 HTTP 상태 코드 값을 할당 (기본값 429)
      code: this.statusCode,
      // 최대값을 초과할 때, 사용자에게 전송되는 오류 메시지를 할당한다.
      message: "3초에 한 번만 요청할 수 있습니다.",
    });
  },
});

export default limiter;
