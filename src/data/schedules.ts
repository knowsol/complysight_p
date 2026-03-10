import type { Schedule } from "@/types/schedule";

export const SCH: Schedule[] = [
  { id: 1, sysNm: "고객관리시스템", nm: "CRM 서버 일간점검", clNm: "서버 상태점검표", freq: "매일", batchStartTime: "06:00", batchMin: 30, rptDdlnHr: 24, useYn: "Y", resCnt: 5, next: "2026-02-11 06:30" },
  { id: 2, sysNm: "고객관리시스템", nm: "CRM WEB 주간점검", clNm: "WEB 상태점검표", freq: "매주", batchStartTime: "07:00", batchMin: 20, rptDdlnHr: 48, useYn: "Y", resCnt: 3, next: "2026-02-16 07:20" },
  { id: 3, sysNm: "고객관리시스템", nm: "CRM DB 월간점검", clNm: "DBMS 상태점검표", freq: "매월", batchStartTime: "05:00", batchMin: 60, rptDdlnHr: 72, useYn: "Y", resCnt: 2, next: "2026-03-01 06:00" },
  { id: 4, sysNm: "인사관리시스템", nm: "HR 서버 일간점검", clNm: "서버 상태점검표", freq: "매일", batchStartTime: "06:00", batchMin: 30, rptDdlnHr: 24, useYn: "Y", resCnt: 4, next: "2026-02-11 06:30" },
  { id: 5, sysNm: "전자결재시스템", nm: "GW WAS 주간점검", clNm: "WAS 상태점검표", freq: "매주", batchStartTime: "06:30", batchMin: 45, rptDdlnHr: 48, useYn: "Y", resCnt: 3, next: "2026-02-16 07:15" },
  { id: 6, sysNm: "재무회계시스템", nm: "FIN DB 월간점검", clNm: "DBMS 상태점검표", freq: "매월", batchStartTime: "05:00", batchMin: 60, rptDdlnHr: 72, useYn: "Y", resCnt: 2, next: "2026-03-01 06:00" },
  { id: 7, sysNm: "물류관리시스템", nm: "LOG 서버 주간점검", clNm: "서버 상태점검표", freq: "매주", batchStartTime: "06:00", batchMin: 30, rptDdlnHr: 48, useYn: "Y", resCnt: 4, next: "2026-02-16 06:30" },
  { id: 8, sysNm: "홈페이지", nm: "WEB 서비스 일간점검", clNm: "WEB 상태점검표", freq: "매일", batchStartTime: "05:30", batchMin: 20, rptDdlnHr: 24, useYn: "Y", resCnt: 3, next: "2026-02-11 05:50" },
  { id: 9, sysNm: "보안관제시스템", nm: "SEC 보안 월간점검", clNm: "보안 상태점검표", freq: "매월", batchStartTime: "06:00", batchMin: 90, rptDdlnHr: 72, useYn: "Y", resCnt: 5, next: "2026-03-01 07:30" },
  { id: 10, sysNm: "메일시스템", nm: "MAIL WAS 주간점검", clNm: "WAS 상태점검표", freq: "매주", batchStartTime: "07:00", batchMin: 30, rptDdlnHr: 48, useYn: "Y", resCnt: 2, next: "2026-02-16 07:30" },
  { id: 11, sysNm: "공유자원", nm: "네트워크 장비 분기점검", clNm: "네트워크 상태점검표", freq: "분기", batchStartTime: "06:00", batchMin: 60, rptDdlnHr: 120, useYn: "Y", resCnt: 6, next: "2026-04-01 07:00" },
  { id: 12, sysNm: "빅데이터분석시스템", nm: "BDA 스토리지 반기점검", clNm: "스토리지 상태점검표", freq: "반기", batchStartTime: "06:00", batchMin: 120, rptDdlnHr: 168, useYn: "N", resCnt: 3, next: "—" },
  { id: 13, sysNm: "보안관제시스템", nm: "보안관제 상시모니터링", clNm: "보안 상태점검표", freq: "상시", batchStartTime: "00:00", batchMin: 10, rptDdlnHr: 4, useYn: "Y", resCnt: 6, next: "상시" },
  { id: 14, sysNm: "고객관리시스템", nm: "CRM 연간 종합점검", clNm: "서버 상태점검표", freq: "연간", batchStartTime: "06:00", batchMin: 180, rptDdlnHr: 240, useYn: "Y", resCnt: 8, next: "2027-01-01 06:00" },
];
