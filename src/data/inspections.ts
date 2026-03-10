import { RES } from "@/data/resources";
import { _mids, _sIds, _sysMap } from "@/data/systems";
import type { Inspection, InspectionSchedule, SpecialInspection } from "@/types/inspection";

const _clNms = ["서버 상태점검표", "WEB 상태점검표", "WAS 상태점검표", "DBMS 상태점검표", "네트워크 상태점검표", "보안 상태점검표", "스토리지 상태점검표", "백업 상태점검표"];
const _kinds = ["상태점검", "상태점검", "유효성점검", "상태점검", "서비스점검", "상태점검", "유효성점검", "서비스점검"];
const _sts = ["요청", "중단", "지연", "완료"];
const _insps = ["최점검", "정담당", "박유지보수", "최점검", "정담당", "최점검", "정담당", "박유지보수"];
const _subKinds: Record<string, string[]> = {
  상태점검: ["서버상태", "네트워크상태", "보안상태", "스토리지상태", "WEB상태", "WAS상태", "DBMS상태", "백업상태"],
  유효성점검: ["계정유효성", "설정유효성", "서비스유효성"],
  서비스점검: ["서비스가용성", "응답시간", "연결상태"],
};
const _autoRes = ["정상", "정상", "정상", "비정상", "정상", "정상", "정상", "비정상", "오류", "정상"];
const _eyeRes = ["정상", "정상", "비정상", "정상", "정상", "정상", "비정상", "정상", "-", "정상"];

export const mockInspections: Inspection[] = (() => {
  const arr: Inspection[] = [];

  for (let i = 0; i < 40; i += 1) {
    const si = i % 10;
    const res = RES[(i * 7) % RES.length];
    const day = String(1 + (i % 28)).padStart(2, "0");
    const st = _sts[i % 4];
    const kind = _kinds[i % 8];
    const subs = _subKinds[kind] || [];
    const sub = subs[i % subs.length] || "";
    const isComp = st === "완료";
    const freqList = ["상시", "매일", "매주", "매월", "분기", "반기", "연간"];
    const freq = freqList[i % freqList.length];
    const rptTypes = ["일일", "주간", "월간", "분기", "반기", "연간", "상시"];
    const rptType = isComp ? rptTypes[i % rptTypes.length] : "";
    const normalCnt = Math.floor(((i * 7) + 3) % 10 + 2);
    const abnCnt = Math.floor(((i * 3) + 1) % 4);
    const note = i % 5 === 0 ? "일부 항목 임계치 근접" : (i % 7 === 0 ? "재점검 필요" : "");
    const execDt = `2026-02-${day} ${String(9 + (i % 8)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`;

    arr.push({
      id: i + 1,
      sysNm: _sysMap[_sIds[si]],
      resNm: res.nm,
      mid: res.mid,
      clNm: _clNms[i % 8],
      kind,
      sub,
      freq,
      due: `2026-02-${day}`,
      st,
      insp: _insps[i % 8],
      execDt,
      summary: isComp ? ["CPU 정상", "메모리 정상", "디스크 정상", "서비스 정상"][i % 4] : "-",
      autoRes: isComp ? _autoRes[i % _autoRes.length] : (i % 3 !== 1 ? _autoRes[i % _autoRes.length] : "-"),
      eyeRes: isComp ? _eyeRes[i % _eyeRes.length] : (i % 3 !== 0 ? _eyeRes[i % _eyeRes.length] : "-"),
      submitDt: isComp ? `2026-03-${String((i % 3) + 4).padStart(2, "0")} ${String(10 + (i % 8)).padStart(2, "0")}:30` : "-",
      memo: isComp && i % 5 === 0 ? "특이사항 없음" : "",
      hasFile: isComp && i % 3 === 0,
      eyeItemPhotos: (isComp && i % 3 === 0) ? {
        e1: i % 6 === 0 ? [{ id: 1, label: "서버_전면.jpg", color: "#E8F0FE" }, { id: 2, label: "서버_후면.jpg", color: "#E8F5EC" }] : [{ id: 1, label: "외관점검.jpg", color: "#E8F0FE" }],
        e3: [{ id: 3, label: "LED_상태.jpg", color: "#FEF3C7" }],
      } : {},
      recheck: isComp && i % 7 === 0 ? "Y" : "N",
      normalCnt,
      abnCnt,
      note,
      rptType,
    });
  }

  return arr;
})();

export let SI: SpecialInspection[] = [
  { id: 1, sysNm: "고객관리시스템", title: "2026년 상반기 이중화 점검", kind: "이중화점검", due: "2026-02-28", st: "중단", reg: "2026-02-01", regUser: "김시스템", resources: ["CRM-SVR-01", "CRM-SVR-02"], insp: "최점검", planFile: true, purpose: "서버 이중화 절체 테스트", content: "주요 서버 이중화 구성 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 2, sysNm: "고객관리시스템", title: "성능 개선 점검", kind: "성능점검", due: "2026-03-15", st: "요청", reg: "2026-02-05", regUser: "이기관", resources: ["CRM-WEB-01"], insp: "정담당", planFile: false, purpose: "성능 병목 구간 분석", content: "CPU/메모리 부하 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 3, sysNm: "인사관리시스템", title: "업무집중기간 사전점검", kind: "업무집중기간점검", due: "2026-03-01", st: "요청", reg: "2026-02-08", regUser: "이기관", resources: ["HR-SVR-01", "HR-DB-01"], insp: "박유지보수", planFile: true, purpose: "업무집중기간 안정성 확보", content: "인사시스템 전반 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 4, sysNm: "전자결재시스템", title: "전자결재 오프라인 점검", kind: "오프라인점검", due: "2026-02-20", st: "완료", reg: "2026-02-01", regUser: "김시스템", resources: ["GW-SVR-01"], insp: "최점검", planFile: true, purpose: "결재시스템 오프라인 테스트", content: "오프라인 절체 후 서비스 복구 확인", execDt: "2026-02-20", submitDt: "2026-02-20 17:30", resultContent: "정상 복구 확인. 복구 소요시간 12분.", resultFile: true, recheck: "N" },
  { id: 5, sysNm: "재무회계시스템", title: "회계 마감기간 성능점검", kind: "성능점검", due: "2026-02-25", st: "중단", reg: "2026-02-10", regUser: "이기관", resources: ["FIN-DB-01", "FIN-WAS-01"], insp: "정담당", planFile: true, purpose: "마감기간 성능 이슈 사전 예방", content: "DB 쿼리 성능 및 WAS 부하 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 6, sysNm: "보안관제시스템", title: "보안장비 이중화 절체 테스트", kind: "이중화점검", due: "2026-03-10", st: "요청", reg: "2026-02-11", regUser: "김시스템", resources: ["SEC-NET-01", "SEC-NET-02"], insp: "박유지보수", planFile: false, purpose: "보안장비 이중화 검증", content: "방화벽 절체 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 7, sysNm: "홈페이지", title: "홈페이지 대외 서비스 점검", kind: "오프라인점검", due: "2026-02-15", st: "완료", reg: "2026-02-01", regUser: "이기관", resources: ["WEB-WEB-01"], insp: "최점검", planFile: true, purpose: "대외 서비스 점검", content: "홈페이지 전체 페이지 점검", execDt: "2026-02-15", submitDt: "2026-02-15 16:00", resultContent: "전체 페이지 정상. 일부 이미지 깨짐 확인.", resultFile: true, recheck: "Y" },
  { id: 8, sysNm: "물류관리시스템", title: "물류 업무집중기간 점검", kind: "업무집중기간점검", due: "2026-03-20", st: "요청", reg: "2026-02-09", regUser: "박유지보수", resources: ["LOG-SVR-01", "LOG-WAS-01"], insp: "정담당", planFile: false, purpose: "물류 피크기간 안정성 확보", content: "물류 처리 집중 구간 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 9, sysNm: "메일시스템", title: "메일서버 성능 부하 테스트", kind: "성능점검", due: "2026-02-18", st: "지연", reg: "2026-02-03", regUser: "김시스템", resources: ["MAIL-SVR-01"], insp: "박유지보수", planFile: true, purpose: "메일 발송 지연 원인 분석", content: "메일 큐 및 SMTP 성능 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 10, sysNm: "공유자원", title: "네트워크 이중화 절체 점검", kind: "이중화점검", due: "2026-02-22", st: "중단", reg: "2026-02-05", regUser: "이기관", resources: ["SHR-NET-01", "SHR-NET-02"], insp: "최점검", planFile: true, purpose: "네트워크 이중화 검증", content: "L3 스위치 절체 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 11, sysNm: "빅데이터분석시스템", title: "BDA 스토리지 성능 점검", kind: "성능점검", due: "2026-03-05", st: "요청", reg: "2026-02-10", regUser: "김시스템", resources: ["BDA-STG-01"], insp: "정담당", planFile: false, purpose: "스토리지 I/O 성능 검증", content: "대용량 데이터 처리 성능 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 12, sysNm: "고객관리시스템", title: "CRM DR 훈련 오프라인 점검", kind: "오프라인점검", due: "2026-03-25", st: "요청", reg: "2026-02-11", regUser: "김시스템", resources: ["CRM-SVR-01", "CRM-DB-01"], insp: "박유지보수", planFile: true, purpose: "DR 훈련 목적 오프라인 점검", content: "재해복구 시나리오 기반 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
];

export const mockSpecialInspections = SI;

export const mockInspectionSchedules: InspectionSchedule[] = [
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

export const _dailyMenu = [
  { label: "전체현황", value: null },
  {
    label: "상태점검",
    sub: ["서버", "WEB", "WAS", "DBMS", "네트워크", { label: "보안장비", value: "보안" }, "스토리지", "백업"],
  },
  { label: "유효성점검" },
  { label: "서비스점검" },
];

export const _specMenu = [
  { label: "이중화점검" },
  { label: "성능점검" },
  { label: "업무집중기간점검" },
  { label: "오프라인점검" },
];

export const DI_INIT = mockInspections;
export const SCH = mockInspectionSchedules;
