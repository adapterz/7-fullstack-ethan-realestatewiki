import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize } = winston.format;

// logs 폴더 하위에 로그 파일 저장
const logDirectory = "server/logs/";

const logFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  transports: [
    //info 레벨 로그 저장할 파일 설정
    new winstonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDirectory,
      // file이름 : 날짜.log,
      filename: `%DATE%.log`,
      // 30일치 로그 파일 저장
      maxFiles: 30,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: "warn",
      datePattern: "YYYY-MM-DD",
      dirname: logDirectory + "/warn",
      // file이름 : 날짜.log,
      filename: `%DATE%.warn.log`,
      // 30일치 로그 파일 저장 , 30일 후 로그 파일 삭제
      maxFiles: 30,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDirectory + "/error",
      // file이름 : 날짜.log,
      filename: `%DATE%.error.log`,
      // 30일치 로그 파일 저장
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

// morgan wiston 설정
logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

// Production 환경이 아닌 경우(dev 등) 배포 환경에서는 최대한 자원을 안잡아 먹는 로그를 출력해야함
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(
        // console에 출력할 로그 컬러 설정 적용
        colorize({ all: true }),
        // 로그 포맷 적용
        logFormat
      ),
    })
  );
}

export default logger;
