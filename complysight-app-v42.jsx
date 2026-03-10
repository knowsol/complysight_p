import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowUpLeftFromSquare, PanelLeftClose } from "lucide-react";

/* ── 디자인 가이드 v1.0 컬러 시스템 ── */
/* ── 디자인 시스템 v1.0 컬러 토큰 (complysight-design-system.md 기준) ── */
const BASE = {
  /* Neutral Cool (레이아웃 배경용) */
  white:  "#fff",           /* color-white */
  bg:     "#F9FAFC",        /* neutral-c50  — 페이지/사이드바 배경 */
  bgSec:  "#E9ECF3",        /* neutral-c100 — 구분 영역 배경 */
  bgDis:  "#F7F7F7",        /* neutral-50   — 비활성 배경 */
  /* Border */
  brd:    "#EEEEEE",        /* neutral-300  — input/테이블 기본 구분선 */
  brdD:   "#D7D7D7",        /* neutral-400  — 섹션 구분선 */
  brdX:   "#BBBBBB",        /* neutral-500  — 보조 구분선 */
  /* Text */
  txH:    "#111111",        /* neutral-900  — 제목/강조 텍스트 */
  txt:    "#333333",        /* neutral-800  — 본문 텍스트 */
  txS:    "#666666",        /* neutral-700  — sub 텍스트 */
  txL:    "#929292",        /* neutral-600  — 보조/placeholder */
  txX:    "#BBBBBB",        /* neutral-500  — 비활성 텍스트 */
  /* Semantic */
  red:    "#E24949",        /* color-red */
  green:  "#19973C",        /* color-green */
};
const THEME = {
  m: {
    pri:     "#339CD5",     /* primary-500 (시안) */
    priL:    "#E6F3FA",     /* primary-300 */
    priD:    "#2580AF",     /* primary 진한 */
    sec:     "#457CE1",     /* secondary-500 (블루) */
    secL:    "#457CE11A",   /* secondary-100 */
    brand:   "#005CB9",     /* color-blue (브랜드) */
    brandD:  "#004A94",
    brandG:  "linear-gradient(135deg, #005cb9 0%, #339cd5 100%)",
    brandBg: "linear-gradient(160deg, #003e82 0%, #005CB9 60%, #0a2a5e 100%)",
    accent:  "#0C8CE9",     /* state2 */
  },
  s: {
    pri:     "#19973C",
    priL:    "#E8F5EC",
    priD:    "#147A30",
    sec:     "#19973C",
    secL:    "#19973C1A",
    brand:   "#15803D",
    brandD:  "#116632",
    brandG:  "linear-gradient(135deg, #15803D 0%, #19973C 100%)",
    brandBg: "linear-gradient(160deg, #0a4a20 0%, #15803D 60%, #0a3318 100%)",
    accent:  "#19973C",
  },
};
const sideTheme = {
  m: { active: "#339CD51A", activeTxt: "#339CD5" },
  s: { active: "#19973C1A", activeTxt: "#19973C" }
};
let C = { ...BASE, ...THEME.m };
const setTheme = (site) => { C = { ...BASE, ...(THEME[site] || THEME.m) }; };

/* 상태 칩 컬러 - 디자인 가이드 State 컬러 */
/* 상태 컬러 - 디자인 가이드 State 10색 체계 (light 스타일) */
const SC = {
  /* 점검/스케줄 상태 */
  "요청":      { b: "rgba(140,147,157,0.12)", t: "#6B7280" },  /* gray */
  "중단":      { b: "rgba(243,109,0,0.12)",   t: "#D15E00" },  /* state4 orange */
  "지연":      { b: "rgba(243,109,0,0.12)",   t: "#D15E00" },  /* state4 orange */
  "완료":      { b: "rgba(49,187,72,0.12)",   t: "#22882E" },  /* state3 green */
  "보류":      { b: "rgba(157,94,238,0.12)",  t: "#7C3CC8" },  /* state7 purple */
  "승인":      { b: "rgba(0,161,112,0.12)",   t: "#00805A" },  /* state9 teal */
  /* 점검 결과 */
  "정상":      { b: "rgba(51,156,213,0.12)",  t: "#339CD5" },  /* state1 primary */
  "비정상":    { b: "rgba(255,78,78,0.12)",   t: "#D93636" },  /* state5 red */
  "오류":      { b: "rgba(255,78,78,0.12)",   t: "#D93636" },  /* state5 red */
  "경고":      { b: "rgba(243,109,0,0.12)",   t: "#D15E00" },  /* state4 orange */
  /* 사용여부 */
  "사용":      { b: "rgba(51,156,213,0.12)",  t: "#339CD5" },  /* state1 */
  "미사용":    { b: "rgba(140,147,157,0.12)", t: "#6B7280" },  /* state10 gray */
  /* 자원로그 — 액션 */
  "등록":      { b: "rgba(49,187,72,0.12)",   t: "#16a34a" },  /* green */
  "수정":      { b: "rgba(37,99,235,0.12)",   t: "#1d4ed8" },  /* blue */
  "삭제":      { b: "rgba(220,38,38,0.12)",   t: "#dc2626" },  /* red */
  "조회":      { b: "rgba(3,105,161,0.12)",   t: "#0369a1" },  /* sky */
  "다운로드":  { b: "rgba(109,40,217,0.12)",  t: "#7c3aed" },  /* violet */
  "로그인":    { b: "rgba(71,85,105,0.12)",   t: "#475569" },  /* slate */
  "비활성":    { b: "rgba(100,116,139,0.12)", t: "#64748b" },  /* slate-500 */
  /* 점검로그 — 이벤트 */
  "점검 생성": { b: "rgba(37,99,235,0.12)",   t: "#2563eb" },  /* blue */
  "점검 수행": { b: "rgba(22,163,74,0.12)",   t: "#16a34a" },  /* green */
  "결과 보고": { b: "rgba(202,138,4,0.12)",   t: "#ca8a04" },  /* yellow */
  "상태 변경": { b: "rgba(147,51,234,0.12)",  t: "#9333ea" },  /* purple */
  /* 점검로그 — 점검유형 */
  "특별점검":  { b: "rgba(234,145,91,0.12)",  t: "#c97640" },  /* orange */
  "일상점검":  { b: "rgba(3,105,161,0.12)",   t: "#0369a1" },  /* sky */
  /* 접속로그 — 결과 */
  "성공":      { b: "rgba(22,163,74,0.12)",   t: "#16a34a" },  /* green */
  "실패":      { b: "rgba(220,38,38,0.12)",   t: "#dc2626" },  /* red */
  /* 접속로그 — 경로 */
  "웹":        { b: "rgba(37,99,235,0.12)",   t: "#2563eb" },  /* blue */
  "모바일":    { b: "rgba(109,40,217,0.12)",  t: "#7c3aed" },  /* violet */
  /* 에이전트 */
  "SSH":       { b: "rgba(37,99,235,0.12)",   t: "#2563eb" },
  "SNMP":      { b: "rgba(22,163,74,0.12)",   t: "#16a34a" },
  "WEB":       { b: "rgba(202,138,4,0.12)",   t: "#ca8a04" },
  "DB":        { b: "rgba(147,51,234,0.12)",  t: "#9333ea" },
  "LOCAL":     { b: "rgba(234,88,12,0.12)",   t: "#ea580c" },
  "PROMETHEUS":{ b: "rgba(234,88,12,0.12)",   t: "#ea580c" },
  "LOKI":      { b: "rgba(109,40,217,0.12)",  t: "#7c3aed" },
  "육안검수":  { b: "rgba(24,163,185,0.12)",  t: "#148A9E" },
  /* 연결 테스트 결과 */
  "미확인":    { b: "rgba(140,147,157,0.12)", t: "#6B7280" },
  /* 라이선스 상태 */
  "구독중":    { b: "rgba(22,163,74,0.12)",   t: "#16a34a" },
  "만료 예정": { b: "rgba(140,147,157,0.12)", t: "#929292" },
  "만료":      { b: "rgba(220,38,38,0.12)",   t: "#dc2626" },
  "해지":      { b: "rgba(100,116,139,0.12)", t: "#94a3b8" },
  /* 에러로그 — 오류유형 */
  "시스템":    { b: "rgba(220,38,38,0.12)",   t: "#dc2626" },
  "네트워크":  { b: "rgba(243,109,0,0.12)",   t: "#D15E00" },
  "인증":      { b: "rgba(147,51,234,0.12)",  t: "#9333ea" },
  "DB":        { b: "rgba(3,105,161,0.12)",   t: "#0369a1" },
  /* 에러로그 — 처리상태 */
  "미처리":    { b: "rgba(220,38,38,0.12)",   t: "#dc2626" },
  "처리 중":   { b: "rgba(243,109,0,0.12)",   t: "#D15E00" },
  "처리 완료": { b: "rgba(49,187,72,0.12)",   t: "#22882E" },
};

const INIT_USER_GROUPS = [
  { id: "GRP001", nm: "IT운영팀",   regDt: "2026-01-05" },
  { id: "GRP002", nm: "재무팀",     regDt: "2026-01-05" },
  { id: "GRP003", nm: "정보보안팀", regDt: "2026-01-10" },
  { id: "GRP004", nm: "경영지원팀", regDt: "2026-01-10" },
  { id: "GRP005", nm: "데이터팀",   regDt: "2026-01-15" },
];
// DB: user_m (사용자마스터) - is_admin, admin_auth, sntl_auth 분리
const USERS = [
  { userId: "admin",    userNm: "김시스템",  userRole: "시스템관리자", isAdmin: "Y", adminAuth: "시스템관리자", sntlAuth: "전체",     pwdErrCnt: 0, pwdChgDt: "2026-01-01 00:00", joinDt: "2025-01-10 09:00", email: "admin@cs.kr",    phone: "010-1234-5678", useYn: "Y", lastLoginDt: "2026-02-10 09:00", groupId: "GRP001" },
  { userId: "orgadmin", userNm: "이기관",    userRole: "기관관리자",   isAdmin: "Y", adminAuth: "기관관리자",   sntlAuth: "읽기",     pwdErrCnt: 0, pwdChgDt: "2026-01-15 10:00", joinDt: "2025-01-15 10:00", email: "org@cs.kr",      phone: "010-2345-6789", useYn: "Y", lastLoginDt: "2026-02-10 08:30", groupId: "GRP001" },
  { userId: "maintmgr", userNm: "박유지보수", userRole: "유지보수총괄", isAdmin: "N", adminAuth: "유지보수총괄", sntlAuth: "없음",     pwdErrCnt: 0, pwdChgDt: "2026-01-20 11:00", joinDt: "2025-02-01 09:00", email: "maint@cs.kr",   phone: "010-3456-7890", useYn: "Y", lastLoginDt: "2026-02-09 17:00", groupId: "GRP003" },
  { userId: "user01",   userNm: "최점검",    userRole: "사용자",       isAdmin: "N", adminAuth: "사용자",       sntlAuth: "없음",     pwdErrCnt: 0, pwdChgDt: "2026-01-25 09:00", joinDt: "2025-03-01 09:00", email: "user01@cs.kr",   phone: "010-4567-8901", useYn: "Y", lastLoginDt: "2026-02-10 08:00", groupId: "GRP002" },
  { userId: "user02",   userNm: "정담당",    userRole: "사용자",       isAdmin: "N", adminAuth: "사용자",       sntlAuth: "없음",     pwdErrCnt: 2, pwdChgDt: "2025-12-01 09:00", joinDt: "2025-04-01 09:00", email: "user02@cs.kr",   phone: "010-5678-9012", useYn: "Y", groupId: "GRP004" },
  { userId: "user03",   userNm: "한미사용",  userRole: "사용자",       isAdmin: "N", adminAuth: "사용자",       sntlAuth: "없음",     pwdErrCnt: 5, pwdChgDt: "2025-11-01 09:00", joinDt: "2025-05-01 09:00", email: "user03@cs.kr",   useYn: "N" },
];
// DB: sys_m (정보시스템마스터) - type/org는 DB 추가 필요, ref1/2/3/maintEndDate 추가
const SYS = [
  { id: "SYS001", nm: "고객관리시스템",      type: "업무", org: "IT운영팀",    useYn: "Y", mem: 8,  res: 42, maintEndDate: "2027-12-31", ref1: "CRM-PRJ-001", ref2: "",          ref3: "" },
  { id: "SYS002", nm: "인사관리시스템",      type: "업무", org: "IT운영팀",    useYn: "Y", mem: 5,  res: 28, maintEndDate: "2026-12-31", ref1: "HR-PRJ-001",  ref2: "",          ref3: "" },
  { id: "SYS003", nm: "전자결재시스템",      type: "서비스", org: "경영지원팀", useYn: "Y", mem: 6,  res: 35, maintEndDate: "2027-06-30", ref1: "GW-PRJ-001",  ref2: "GW-VND-001", ref3: "" },
  { id: "SYS004", nm: "재무회계시스템",      type: "업무", org: "재무팀",      useYn: "Y", mem: 4,  res: 30, maintEndDate: "2026-09-30", ref1: "FIN-PRJ-001", ref2: "",          ref3: "" },
  { id: "SYS005", nm: "물류관리시스템",      type: "업무", org: "물류팀",      useYn: "Y", mem: 5,  res: 32, maintEndDate: "2027-03-31", ref1: "LOG-PRJ-001", ref2: "",          ref3: "" },
  { id: "SYS006", nm: "홈페이지",            type: "서비스", org: "홍보팀",    useYn: "Y", mem: 3,  res: 22, maintEndDate: "2026-12-31", ref1: "",            ref2: "",          ref3: "" },
  { id: "SYS007", nm: "메일시스템",          type: "서비스", org: "IT운영팀",  useYn: "Y", mem: 4,  res: 25, maintEndDate: "2027-12-31", ref1: "MAIL-VND-001",ref2: "",          ref3: "" },
  { id: "SYS008", nm: "보안관제시스템",      type: "보안", org: "정보보안팀",  useYn: "Y", mem: 6,  res: 38, maintEndDate: "2028-06-30", ref1: "SEC-PRJ-001", ref2: "SEC-VND-001", ref3: "" },
  { id: "SYS009", nm: "빅데이터분석시스템",  type: "분석", org: "데이터팀",    useYn: "N", mem: 3,  res: 20, maintEndDate: "2026-06-30", ref1: "BDA-PRJ-001", ref2: "",          ref3: "" },
  { id: "SHARED", nm: "공유자원",            type: "기타", org: "IT운영팀",    useYn: "Y", mem: 4,  res: 28, maintEndDate: "",           ref1: "",            ref2: "",          ref3: "" },
];
const _sysMap = { SYS001: "고객관리시스템", SYS002: "인사관리시스템", SYS003: "전자결재시스템", SYS004: "재무회계시스템", SYS005: "물류관리시스템", SYS006: "홈페이지", SYS007: "메일시스템", SYS008: "보안관제시스템", SYS009: "빅데이터분석시스템", SHARED: "공유자원" };
const _sIds = ["SYS001","SYS002","SYS003","SYS004","SYS005","SYS006","SYS007","SYS008","SYS009","SHARED"];
const _mids = ["서버","WEB","WAS","DBMS","네트워크","보안","스토리지","백업","서비스","유효성"];
const _smalls = { "서버":["Linux","Windows","AIX"], "WEB":["Apache","Nginx","IIS"], "WAS":["Tomcat","WebLogic","JEUS"], "DBMS":["MySQL","PostgreSQL","Oracle","MariaDB"], "네트워크":["L2 Switch","L3 Switch","Router","Firewall"], "보안":["WAF","IPS","IDS"], "스토리지":["NAS","SAN"], "백업":["Backup Server","Tape"], "서비스":["URL 모니터링","API 모니터링","포트 모니터링"], "유효성":["인증서","라이선스","계정"] };
const _oss = ["CentOS 7","Ubuntu 22.04","RHEL 8","Windows Server 2022","Rocky Linux 9",""];
const _pfx = { SYS001:"CRM", SYS002:"HR", SYS003:"GW", SYS004:"FIN", SYS005:"LOG", SYS006:"WEB", SYS007:"MAIL", SYS008:"SEC", SYS009:"BDA", SHARED:"SHR" };
const _midCode = { "서버":"SVR","WEB":"WEB","WAS":"WAS","DBMS":"DB","네트워크":"NET","보안":"SEC","스토리지":"STG","백업":"BKP","서비스":"SVC","유효성":"VLD" };
const RES = (() => {
  const arr = []; let id = 1;
  _sIds.forEach(sid => {
    const cnt = sid === "SHARED" ? 28 : [42,28,35,30,32,22,25,38,20][_sIds.indexOf(sid)];
    for (let i = 0; i < cnt; i++) {
      const mi = _mids[i % _mids.length], sm = _smalls[mi][(i >> 3) % _smalls[mi].length];
      const seq = String(i + 1).padStart(2, "0");
      arr.push({ id: id++, sysId: sid, sysNm: _sysMap[sid], nm: `${_pfx[sid]}-${_midCode[mi]}-${seq}`, mid: mi, small: sm, st: id % 15 === 0 ? "미사용" : "사용", ip: `${10 + _sIds.indexOf(sid)}.${100 + (i >> 4)}.${(i % 16) * 10 + 1}.${(i % 254) + 1}`, os: mi === "서버" || mi === "WAS" ? _oss[i % _oss.length] : "", resourceId: `${_pfx[sid]}-${_midCode[mi]}-${seq}`, inspectors: [["user01","user02","admin"][i % 3]] });
    }
  });
  return arr;
})();
const _clNms = ["서버 상태점검표","WEB 상태점검표","WAS 상태점검표","DBMS 상태점검표","네트워크 상태점검표","보안 상태점검표","스토리지 상태점검표","백업 상태점검표"];
const _kinds = ["상태점검","상태점검","유효성점검","상태점검","서비스점검","상태점검","유효성점검","서비스점검"];
const _sts = ["요청","중단","지연","완료"];
const _insps = ["최점검","정담당","박유지보수","최점검","정담당","최점검","정담당","박유지보수"];
const _subKinds = { "상태점검": ["서버상태","네트워크상태","보안상태","스토리지상태","WEB상태","WAS상태","DBMS상태","백업상태"], "유효성점검": ["계정유효성","설정유효성","서비스유효성"], "서비스점검": ["서비스가용성","응답시간","연결상태"] };
const _autoRes = ["정상","정상","정상","비정상","정상","정상","정상","비정상","오류","정상"];
const _eyeRes = ["정상","정상","비정상","정상","정상","정상","비정상","정상","-","정상"];
const DI_INIT = (() => {
  const arr = [];
  for (let i = 0; i < 40; i++) {
    const si = i % 10, res = RES[i * 7 % RES.length];
    const day = String(1 + (i % 28)).padStart(2, "0");
    const st = _sts[i % 4];
    const kind = _kinds[i % 8];
    const subs = _subKinds[kind] || [];
    const sub = subs[i % subs.length] || "";
    const isComp = st === "완료";
    const freqList = ["상시","매일","매주","매월","분기","반기","연간"];
    const freq = freqList[i % freqList.length];
    const _rptTypes = ["일일","주간","월간","분기","반기","연간","상시"];
    const rptType = isComp ? _rptTypes[i % _rptTypes.length] : "";
    const normalCnt = Math.floor((i * 7 + 3) % 10 + 2);
    const abnCnt    = Math.floor((i * 3 + 1) % 4);
    const note      = i % 5 === 0 ? "일부 항목 임계치 근접" : (i % 7 === 0 ? "재점검 필요" : "");
    const execDt = `2026-02-${day} ${String(9 + (i % 8)).padStart(2,"0")}:${String(i % 60).padStart(2,"0")}`;
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
      summary: isComp ? ["CPU 정상","메모리 정상","디스크 정상","서비스 정상"][i % 4] : "-",
      autoRes: isComp ? _autoRes[i % _autoRes.length] : (i % 3 !== 1 ? _autoRes[i % _autoRes.length] : "-"),
      eyeRes:  isComp ? _eyeRes[i % _eyeRes.length]  : (i % 3 !== 0 ? _eyeRes[i % _eyeRes.length]  : "-"),
      submitDt: isComp ? `2026-03-${String((i % 3) + 4).padStart(2,"0")} ${String(10 + (i % 8)).padStart(2,"0")}:30` : "-",
      memo: isComp && i % 5 === 0 ? "특이사항 없음" : "",
      hasFile: isComp && i % 3 === 0,
      eyeItemPhotos: (isComp && i % 3 === 0) ? {
        e1: i % 6 === 0 ? [{ id:1, label:"서버_전면.jpg", color:"#E8F0FE" }, { id:2, label:"서버_후면.jpg", color:"#E8F5EC" }] : [{ id:1, label:"외관점검.jpg", color:"#E8F0FE" }],
        e3: [{ id:3, label:"LED_상태.jpg", color:"#FEF3C7" }],
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
const DIContext = React.createContext({ di: DI_INIT, addDI: () => {}, updateDI: () => {} });
const useDI = () => React.useContext(DIContext);
let SI = [
  { id: 1, sysNm: "고객관리시스템", title: "2026년 상반기 이중화 점검", kind: "이중화점검", due: "2026-02-28", st: "중단", reg: "2026-02-01", regUser: "김시스템", resources: ["CRM-SVR-01","CRM-SVR-02"], insp: "최점검", planFile: true, purpose: "서버 이중화 절체 테스트", content: "주요 서버 이중화 구성 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 2, sysNm: "고객관리시스템", title: "성능 개선 점검", kind: "성능점검", due: "2026-03-15", st: "요청", reg: "2026-02-05", regUser: "이기관", resources: ["CRM-WEB-01"], insp: "정담당", planFile: false, purpose: "성능 병목 구간 분석", content: "CPU/메모리 부하 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 3, sysNm: "인사관리시스템", title: "업무집중기간 사전점검", kind: "업무집중기간점검", due: "2026-03-01", st: "요청", reg: "2026-02-08", regUser: "이기관", resources: ["HR-SVR-01","HR-DB-01"], insp: "박유지보수", planFile: true, purpose: "업무집중기간 안정성 확보", content: "인사시스템 전반 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 4, sysNm: "전자결재시스템", title: "전자결재 오프라인 점검", kind: "오프라인점검", due: "2026-02-20", st: "완료", reg: "2026-02-01", regUser: "김시스템", resources: ["GW-SVR-01"], insp: "최점검", planFile: true, purpose: "결재시스템 오프라인 테스트", content: "오프라인 절체 후 서비스 복구 확인", execDt: "2026-02-20", submitDt: "2026-02-20 17:30", resultContent: "정상 복구 확인. 복구 소요시간 12분.", resultFile: true, recheck: "N" },
  { id: 5, sysNm: "재무회계시스템", title: "회계 마감기간 성능점검", kind: "성능점검", due: "2026-02-25", st: "중단", reg: "2026-02-10", regUser: "이기관", resources: ["FIN-DB-01","FIN-WAS-01"], insp: "정담당", planFile: true, purpose: "마감기간 성능 이슈 사전 예방", content: "DB 쿼리 성능 및 WAS 부하 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 6, sysNm: "보안관제시스템", title: "보안장비 이중화 절체 테스트", kind: "이중화점검", due: "2026-03-10", st: "요청", reg: "2026-02-11", regUser: "김시스템", resources: ["SEC-NET-01","SEC-NET-02"], insp: "박유지보수", planFile: false, purpose: "보안장비 이중화 검증", content: "방화벽 절체 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 7, sysNm: "홈페이지", title: "홈페이지 대외 서비스 점검", kind: "오프라인점검", due: "2026-02-15", st: "완료", reg: "2026-02-01", regUser: "이기관", resources: ["WEB-WEB-01"], insp: "최점검", planFile: true, purpose: "대외 서비스 점검", content: "홈페이지 전체 페이지 점검", execDt: "2026-02-15", submitDt: "2026-02-15 16:00", resultContent: "전체 페이지 정상. 일부 이미지 깨짐 확인.", resultFile: true, recheck: "Y" },
  { id: 8, sysNm: "물류관리시스템", title: "물류 업무집중기간 점검", kind: "업무집중기간점검", due: "2026-03-20", st: "요청", reg: "2026-02-09", regUser: "박유지보수", resources: ["LOG-SVR-01","LOG-WAS-01"], insp: "정담당", planFile: false, purpose: "물류 피크기간 안정성 확보", content: "물류 처리 집중 구간 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 9, sysNm: "메일시스템", title: "메일서버 성능 부하 테스트", kind: "성능점검", due: "2026-02-18", st: "지연", reg: "2026-02-03", regUser: "김시스템", resources: ["MAIL-SVR-01"], insp: "박유지보수", planFile: true, purpose: "메일 발송 지연 원인 분석", content: "메일 큐 및 SMTP 성능 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 10, sysNm: "공유자원", title: "네트워크 이중화 절체 점검", kind: "이중화점검", due: "2026-02-22", st: "중단", reg: "2026-02-05", regUser: "이기관", resources: ["SHR-NET-01","SHR-NET-02"], insp: "최점검", planFile: true, purpose: "네트워크 이중화 검증", content: "L3 스위치 절체 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 11, sysNm: "빅데이터분석시스템", title: "BDA 스토리지 성능 점검", kind: "성능점검", due: "2026-03-05", st: "요청", reg: "2026-02-10", regUser: "김시스템", resources: ["BDA-STG-01"], insp: "정담당", planFile: false, purpose: "스토리지 I/O 성능 검증", content: "대용량 데이터 처리 성능 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 12, sysNm: "고객관리시스템", title: "CRM DR 훈련 오프라인 점검", kind: "오프라인점검", due: "2026-03-25", st: "요청", reg: "2026-02-11", regUser: "김시스템", resources: ["CRM-SVR-01","CRM-DB-01"], insp: "박유지보수", planFile: true, purpose: "DR 훈련 목적 오프라인 점검", content: "재해복구 시나리오 기반 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
];
// DB: rgl_chck_sch_l (정기점검스케쥴목록) - rpt_ddln_hr(보고기한시간) 추가
const SCH = [
  { id: 1,  sysNm: "고객관리시스템",       nm: "CRM 서버 일간점검",      clNm: "서버 상태점검표",       freq: "매일",  batchStartTime: "06:00", batchMin: 30,  rptDdlnHr: 24,  useYn: "Y", resCnt: 5, next: "2026-02-11 06:30" },
  { id: 2,  sysNm: "고객관리시스템",       nm: "CRM WEB 주간점검",      clNm: "WEB 상태점검표",        freq: "매주",  batchStartTime: "07:00", batchMin: 20,  rptDdlnHr: 48,  useYn: "Y", resCnt: 3, next: "2026-02-16 07:20" },
  { id: 3,  sysNm: "고객관리시스템",       nm: "CRM DB 월간점검",       clNm: "DBMS 상태점검표",       freq: "매월",  batchStartTime: "05:00", batchMin: 60,  rptDdlnHr: 72,  useYn: "Y", resCnt: 2, next: "2026-03-01 06:00" },
  { id: 4,  sysNm: "인사관리시스템",       nm: "HR 서버 일간점검",       clNm: "서버 상태점검표",       freq: "매일",  batchStartTime: "06:00", batchMin: 30,  rptDdlnHr: 24,  useYn: "Y", resCnt: 4, next: "2026-02-11 06:30" },
  { id: 5,  sysNm: "전자결재시스템",       nm: "GW WAS 주간점검",       clNm: "WAS 상태점검표",        freq: "매주",  batchStartTime: "06:30", batchMin: 45,  rptDdlnHr: 48,  useYn: "Y", resCnt: 3, next: "2026-02-16 07:15" },
  { id: 6,  sysNm: "재무회계시스템",       nm: "FIN DB 월간점검",       clNm: "DBMS 상태점검표",       freq: "매월",  batchStartTime: "05:00", batchMin: 60,  rptDdlnHr: 72,  useYn: "Y", resCnt: 2, next: "2026-03-01 06:00" },
  { id: 7,  sysNm: "물류관리시스템",       nm: "LOG 서버 주간점검",      clNm: "서버 상태점검표",       freq: "매주",  batchStartTime: "06:00", batchMin: 30,  rptDdlnHr: 48,  useYn: "Y", resCnt: 4, next: "2026-02-16 06:30" },
  { id: 8,  sysNm: "홈페이지",            nm: "WEB 서비스 일간점검",    clNm: "WEB 상태점검표",        freq: "매일",  batchStartTime: "05:30", batchMin: 20,  rptDdlnHr: 24,  useYn: "Y", resCnt: 3, next: "2026-02-11 05:50" },
  { id: 9,  sysNm: "보안관제시스템",       nm: "SEC 보안 월간점검",      clNm: "보안 상태점검표",       freq: "매월",  batchStartTime: "06:00", batchMin: 90,  rptDdlnHr: 72,  useYn: "Y", resCnt: 5, next: "2026-03-01 07:30" },
  { id: 10, sysNm: "메일시스템",           nm: "MAIL WAS 주간점검",     clNm: "WAS 상태점검표",        freq: "매주",  batchStartTime: "07:00", batchMin: 30,  rptDdlnHr: 48,  useYn: "Y", resCnt: 2, next: "2026-02-16 07:30" },
  { id: 11, sysNm: "공유자원",             nm: "네트워크 장비 분기점검",  clNm: "네트워크 상태점검표",   freq: "분기",  batchStartTime: "06:00", batchMin: 60,  rptDdlnHr: 120, useYn: "Y", resCnt: 6, next: "2026-04-01 07:00" },
  { id: 12, sysNm: "빅데이터분석시스템",   nm: "BDA 스토리지 반기점검",  clNm: "스토리지 상태점검표",   freq: "반기",  batchStartTime: "06:00", batchMin: 120, rptDdlnHr: 168, useYn: "N", resCnt: 3, next: "—" },
  { id: 13, sysNm: "보안관제시스템",       nm: "보안관제 상시모니터링",     clNm: "보안 상태점검표",        freq: "상시",  batchStartTime: "00:00", batchMin: 10,  rptDdlnHr: 4,   useYn: "Y", resCnt: 6, next: "상시" },
  { id: 14, sysNm: "고객관리시스템",       nm: "CRM 연간 종합점검",        clNm: "서버 상태점검표",        freq: "연간",  batchStartTime: "06:00", batchMin: 180, rptDdlnHr: 240, useYn: "Y", resCnt: 8, next: "2027-01-01 06:00" },
];
const CL_INIT = [
  { id: 1, nm: "서버 상태점검표",      type: "일상점검", kind: "상태점검",   sub: "서버", useYn: "Y", items: 6, sch: 2, registrant: "관리자", regDt: "2026-01-10 09:00:00" },
  { id: 2, nm: "WEB 상태점검표",       type: "일상점검", kind: "상태점검",   sub: "WEB",  useYn: "Y", items: 4, sch: 1, registrant: "관리자", regDt: "2026-01-10 09:30:00" },
  { id: 3, nm: "DBMS 상태점검표",      type: "일상점검", kind: "상태점검",   sub: "DBMS", useYn: "Y", items: 5, sch: 1, registrant: "관리자", regDt: "2026-01-11 10:00:00" },
  { id: 4, nm: "서비스 유효성 점검표", type: "일상점검", kind: "유효성점검", sub: "",     useYn: "Y", items: 3, sch: 0, registrant: "관리자", regDt: "2026-01-15 10:00:00" },
];
const CLContext = React.createContext({ cl: CL_INIT, addCL: () => {} });
const useCL = () => React.useContext(CLContext);
const VC = [
  { id: "VC001", nm: "CPU 사용률", agent: "PROMETHEUS", val: "< 80%", desc: "전체 CPU 코어의 평균 사용률을 측정합니다.", useYn: "Y" },
  { id: "VC002", nm: "메모리 사용률", agent: "PROMETHEUS", val: "< 85%", desc: "물리 메모리 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC003", nm: "디스크 사용률", agent: "PROMETHEUS", val: "< 90%", desc: "마운트된 파티션별 디스크 사용 비율을 점검합니다.", useYn: "Y" },
  { id: "VC004", nm: "디스크 I/O 대기율", agent: "PROMETHEUS", val: "< 20%", desc: "I/O 대기로 인한 CPU 점유 비율을 측정합니다.", useYn: "Y" },
  { id: "VC005", nm: "스왑 사용률", agent: "PROMETHEUS", val: "< 50%", desc: "스왑 공간 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC006", nm: "네트워크 수신 트래픽", agent: "PROMETHEUS", val: "< 500Mbps", desc: "네트워크 인터페이스의 초당 수신 데이터량을 측정합니다.", useYn: "Y" },
  { id: "VC007", nm: "네트워크 송신 트래픽", agent: "PROMETHEUS", val: "< 500Mbps", desc: "네트워크 인터페이스의 초당 송신 데이터량을 측정합니다.", useYn: "Y" },
  { id: "VC008", nm: "패킷 손실률", agent: "PROMETHEUS", val: "0%", desc: "네트워크 패킷 손실 비율을 측정합니다.", useYn: "Y" },
  { id: "VC009", nm: "CPU 로드 평균(1m)", agent: "PROMETHEUS", val: "< 4.0", desc: "최근 1분간 평균 CPU 부하를 측정합니다.", useYn: "Y" },
  { id: "VC010", nm: "CPU 로드 평균(5m)", agent: "PROMETHEUS", val: "< 3.5", desc: "최근 5분간 평균 CPU 부하를 측정합니다.", useYn: "Y" },
  { id: "VC011", nm: "CPU 로드 평균(15m)", agent: "PROMETHEUS", val: "< 3.0", desc: "최근 15분간 평균 CPU 부하를 측정합니다.", useYn: "Y" },
  { id: "VC012", nm: "프로세스 수", agent: "PROMETHEUS", val: "< 500", desc: "실행 중인 전체 프로세스 수를 측정합니다.", useYn: "Y" },
  { id: "VC013", nm: "오픈 파일 디스크립터", agent: "PROMETHEUS", val: "< 1024", desc: "열려 있는 파일 디스크립터 수를 확인합니다.", useYn: "Y" },
  { id: "VC014", nm: "TCP 연결 수", agent: "PROMETHEUS", val: "< 1000", desc: "현재 ESTABLISHED 상태의 TCP 연결 수를 측정합니다.", useYn: "Y" },
  { id: "VC015", nm: "TIME_WAIT 소켓 수", agent: "PROMETHEUS", val: "< 200", desc: "TIME_WAIT 상태의 소켓 수를 측정합니다.", useYn: "Y" },
  { id: "VC016", nm: "CLOSE_WAIT 소켓 수", agent: "PROMETHEUS", val: "< 50", desc: "CLOSE_WAIT 상태의 비정상 소켓 수를 측정합니다.", useYn: "Y" },
  { id: "VC017", nm: "HTTP 응답 시간", agent: "PROMETHEUS", val: "< 500ms", desc: "HTTP 엔드포인트의 평균 응답 시간을 측정합니다.", useYn: "Y" },
  { id: "VC018", nm: "HTTP 에러율", agent: "PROMETHEUS", val: "< 1%", desc: "전체 HTTP 요청 중 4xx/5xx 응답 비율을 측정합니다.", useYn: "Y" },
  { id: "VC019", nm: "JVM 힙 사용률", agent: "PROMETHEUS", val: "< 80%", desc: "JVM 힙 메모리 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC020", nm: "JVM GC 빈도", agent: "PROMETHEUS", val: "< 10/min", desc: "단위 시간당 가비지 컬렉션 발생 횟수를 측정합니다.", useYn: "N" },
  { id: "VC021", nm: "JVM GC 소요시간", agent: "PROMETHEUS", val: "< 200ms", desc: "GC 수행에 소요된 평균 시간을 측정합니다.", useYn: "Y" },
  { id: "VC022", nm: "스레드 수", agent: "PROMETHEUS", val: "< 300", desc: "JVM 내 활성 스레드 수를 측정합니다.", useYn: "Y" },
  { id: "VC023", nm: "DB 커넥션 풀 사용률", agent: "PROMETHEUS", val: "< 80%", desc: "데이터베이스 커넥션 풀 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC024", nm: "DB 쿼리 응답 시간", agent: "PROMETHEUS", val: "< 100ms", desc: "데이터베이스 쿼리 평균 응답 시간을 측정합니다.", useYn: "Y" },
  { id: "VC025", nm: "DB 슬로우 쿼리 수", agent: "PROMETHEUS", val: "0건/min", desc: "설정 임계치를 초과한 슬로우 쿼리 발생 건수를 측정합니다.", useYn: "Y" },
  { id: "VC026", nm: "DB 복제 지연", agent: "PROMETHEUS", val: "< 5s", desc: "Primary-Replica 간 복제 지연 시간을 측정합니다.", useYn: "Y" },
  { id: "VC027", nm: "캐시 히트율", agent: "PROMETHEUS", val: "> 90%", desc: "캐시 요청 대비 히트 비율을 측정합니다.", useYn: "Y" },
  { id: "VC028", nm: "캐시 메모리 사용률", agent: "PROMETHEUS", val: "< 75%", desc: "캐시 서버의 메모리 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC029", nm: "큐 대기 메시지 수", agent: "PROMETHEUS", val: "< 100", desc: "메시지 큐에 대기 중인 미처리 메시지 수를 측정합니다.", useYn: "Y" },
  { id: "VC030", nm: "큐 처리 지연", agent: "PROMETHEUS", val: "< 10s", desc: "메시지 큐의 처리 지연 시간을 측정합니다.", useYn: "Y" },
  { id: "VC031", nm: "배치 작업 실행 시간", agent: "PROMETHEUS", val: "< 30min", desc: "스케줄된 배치 작업의 총 실행 시간을 측정합니다.", useYn: "Y" },
  { id: "VC032", nm: "배치 작업 오류율", agent: "PROMETHEUS", val: "0%", desc: "배치 작업 실행 중 발생한 오류 비율을 측정합니다.", useYn: "Y" },
  { id: "VC033", nm: "API 초당 요청 수", agent: "PROMETHEUS", val: "< 1000", desc: "API 게이트웨이의 초당 요청 처리량을 측정합니다.", useYn: "Y" },
  { id: "VC034", nm: "API 타임아웃율", agent: "PROMETHEUS", val: "< 0.1%", desc: "API 응답 타임아웃 발생 비율을 측정합니다.", useYn: "Y" },
  { id: "VC035", nm: "인증서 만료일", agent: "PROMETHEUS", val: "> 30일", desc: "TLS/SSL 인증서의 잔여 유효 기간을 확인합니다.", useYn: "Y" },
  { id: "VC036", nm: "SSL 핸드쉐이크 시간", agent: "PROMETHEUS", val: "< 200ms", desc: "SSL 핸드쉐이크에 소요되는 평균 시간을 측정합니다.", useYn: "Y" },
  { id: "VC037", nm: "파일시스템 inode 사용률", agent: "PROMETHEUS", val: "< 80%", desc: "사용 중인 inode 비율을 측정합니다.", useYn: "Y" },
  { id: "VC038", nm: "로그 디스크 사용률", agent: "PROMETHEUS", val: "< 85%", desc: "로그 저장 파티션의 디스크 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC039", nm: "백업 파일 크기", agent: "PROMETHEUS", val: "정상범위", desc: "최근 백업 파일 크기가 정상 범위 내인지 확인합니다.", useYn: "Y" },
  { id: "VC040", nm: "백업 소요시간", agent: "PROMETHEUS", val: "< 2h", desc: "백업 작업 완료에 소요된 시간을 측정합니다.", useYn: "N" },
  { id: "VC041", nm: "서비스 재시작 횟수", agent: "PROMETHEUS", val: "0회/day", desc: "서비스가 비정상 재시작된 횟수를 측정합니다.", useYn: "Y" },
  { id: "VC042", nm: "크론잡 실행 성공률", agent: "PROMETHEUS", val: "> 99%", desc: "예약된 크론잡의 정상 실행 비율을 측정합니다.", useYn: "Y" },
  { id: "VC043", nm: "컨테이너 재시작 횟수", agent: "PROMETHEUS", val: "0회/h", desc: "컨테이너 비정상 재시작 횟수를 측정합니다.", useYn: "Y" },
  { id: "VC044", nm: "컨테이너 CPU 사용률", agent: "PROMETHEUS", val: "< 70%", desc: "개별 컨테이너의 CPU 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC045", nm: "컨테이너 메모리 사용률", agent: "PROMETHEUS", val: "< 80%", desc: "개별 컨테이너의 메모리 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC046", nm: "파드 Ready 상태", agent: "PROMETHEUS", val: "Running", desc: "쿠버네티스 파드의 Ready 상태 여부를 확인합니다.", useYn: "Y" },
  { id: "VC047", nm: "노드 조건 상태", agent: "PROMETHEUS", val: "Ready", desc: "쿠버네티스 노드의 Ready 조건 상태를 확인합니다.", useYn: "Y" },
  { id: "VC048", nm: "클러스터 CPU 사용률", agent: "PROMETHEUS", val: "< 70%", desc: "쿠버네티스 클러스터 전체 CPU 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC049", nm: "클러스터 메모리 사용률", agent: "PROMETHEUS", val: "< 80%", desc: "쿠버네티스 클러스터 전체 메모리 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC050", nm: "PV 사용률", agent: "PROMETHEUS", val: "< 85%", desc: "퍼시스턴트 볼륨의 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC051", nm: "Ingress 응답 코드", agent: "PROMETHEUS", val: "2xx/3xx", desc: "Ingress 컨트롤러의 응답 코드 분포를 확인합니다.", useYn: "Y" },
  { id: "VC052", nm: "Ingress 응답 시간", agent: "PROMETHEUS", val: "< 300ms", desc: "Ingress 컨트롤러의 평균 응답 시간을 측정합니다.", useYn: "Y" },
  { id: "VC053", nm: "엔드포인트 가용성", agent: "PROMETHEUS", val: "> 99.9%", desc: "서비스 엔드포인트의 가용성을 측정합니다.", useYn: "Y" },
  { id: "VC054", nm: "서비스 업타임", agent: "PROMETHEUS", val: "> 99.9%", desc: "서비스의 연속 정상 운영 시간 비율을 측정합니다.", useYn: "Y" },
  { id: "VC055", nm: "알람 발생 건수", agent: "PROMETHEUS", val: "0건/day", desc: "임계치 초과로 발생한 알람 건수를 측정합니다.", useYn: "Y" },
  { id: "VC056", nm: "이상 탐지 스코어", agent: "PROMETHEUS", val: "< 0.3", desc: "ML 기반 이상 탐지 모델의 이상 스코어를 측정합니다.", useYn: "Y" },
  { id: "VC057", nm: "메트릭 수집 주기", agent: "PROMETHEUS", val: "< 60s", desc: "Prometheus 스크레이핑 주기 정상 여부를 확인합니다.", useYn: "Y" },
  { id: "VC058", nm: "모니터링 에이전트 상태", agent: "PROMETHEUS", val: "Active", desc: "모니터링 에이전트 프로세스 동작 여부를 확인합니다.", useYn: "Y" },
  { id: "VC059", nm: "대시보드 로딩 시간", agent: "PROMETHEUS", val: "< 3s", desc: "모니터링 대시보드 페이지 로딩 시간을 측정합니다.", useYn: "Y" },
  { id: "VC060", nm: "알림 발송 지연", agent: "PROMETHEUS", val: "< 30s", desc: "알림 이벤트 발생부터 발송까지 소요 시간을 측정합니다.", useYn: "N" },
  { id: "VC061", nm: "SSH 서비스 상태", agent: "SSH", val: "Active", desc: "SSH 데몬 프로세스의 동작 상태를 확인합니다.", useYn: "Y" },
  { id: "VC062", nm: "서버 접속 가능 여부", agent: "SSH", val: "SUCCESS", desc: "SSH를 통한 서버 접속 가능 여부를 확인합니다.", useYn: "Y" },
  { id: "VC063", nm: "서비스 포트 개방", agent: "SSH", val: "OPEN", desc: "지정된 서비스 포트의 개방 상태를 확인합니다.", useYn: "Y" },
  { id: "VC064", nm: "방화벽 서비스 상태", agent: "SSH", val: "Active", desc: "방화벽(iptables/firewalld) 서비스 동작 여부를 확인합니다.", useYn: "Y" },
  { id: "VC065", nm: "NTP 동기화 상태", agent: "SSH", val: "동기화", desc: "NTP 서버와의 시간 동기화 상태를 확인합니다.", useYn: "Y" },
  { id: "VC066", nm: "시간 오차", agent: "SSH", val: "< 1s", desc: "NTP 기준 서버 대비 시스템 시간 오차를 측정합니다.", useYn: "Y" },
  { id: "VC067", nm: "DNS 응답 확인", agent: "SSH", val: "정상", desc: "DNS 서버의 질의 응답 정상 여부를 확인합니다.", useYn: "Y" },
  { id: "VC068", nm: "호스트명 해석", agent: "SSH", val: "SUCCESS", desc: "서버 호스트명의 정방향/역방향 DNS 해석을 확인합니다.", useYn: "Y" },
  { id: "VC069", nm: "라우팅 테이블 상태", agent: "SSH", val: "정상", desc: "정적 라우팅 테이블의 정상 설정 여부를 확인합니다.", useYn: "Y" },
  { id: "VC070", nm: "네트워크 인터페이스", agent: "SSH", val: "UP", desc: "네트워크 인터페이스의 UP/DOWN 상태를 확인합니다.", useYn: "Y" },
  { id: "VC071", nm: "ARP 테이블 상태", agent: "SSH", val: "정상", desc: "ARP 캐시 테이블의 정상 여부를 확인합니다.", useYn: "Y" },
  { id: "VC072", nm: "커널 버전", agent: "SSH", val: "최신", desc: "적용된 커널 버전의 보안 업데이트 여부를 확인합니다.", useYn: "Y" },
  { id: "VC073", nm: "OS 보안 업데이트", agent: "SSH", val: "최신", desc: "OS 보안 패키지의 최신 적용 여부를 확인합니다.", useYn: "Y" },
  { id: "VC074", nm: "패키지 무결성", agent: "SSH", val: "정상", desc: "설치된 시스템 패키지의 무결성을 확인합니다.", useYn: "Y" },
  { id: "VC075", nm: "sudoers 설정", agent: "SSH", val: "정상", desc: "sudoers 파일의 보안 정책 준수 여부를 확인합니다.", useYn: "Y" },
  { id: "VC076", nm: "계정 잠금 정책", agent: "SSH", val: "적용", desc: "반복 로그인 실패 시 계정 잠금 정책 적용 여부를 확인합니다.", useYn: "Y" },
  { id: "VC077", nm: "패스워드 만료 정책", agent: "SSH", val: "적용", desc: "사용자 계정의 패스워드 만료 정책 적용 여부를 확인합니다.", useYn: "Y" },
  { id: "VC078", nm: "불필요 계정 존재", agent: "SSH", val: "없음", desc: "시스템 내 불필요한 계정의 존재 여부를 확인합니다.", useYn: "Y" },
  { id: "VC079", nm: "루트 직접 로그인", agent: "SSH", val: "차단", desc: "루트 계정의 직접 로그인 차단 설정을 확인합니다.", useYn: "Y" },
  { id: "VC080", nm: "SSH 포트 기본값 변경", agent: "SSH", val: "변경됨", desc: "SSH 기본 포트(22) 변경 여부를 확인합니다.", useYn: "N" },
  { id: "VC081", nm: "SSH 키 인증 방식", agent: "SSH", val: "허용", desc: "SSH 공개키 인증 방식 허용 여부를 확인합니다.", useYn: "Y" },
  { id: "VC082", nm: "패스워드 인증", agent: "SSH", val: "차단", desc: "SSH 패스워드 인증 방식 차단 여부를 확인합니다.", useYn: "Y" },
  { id: "VC083", nm: "PAM 설정 상태", agent: "SSH", val: "정상", desc: "PAM 모듈의 보안 정책 설정 상태를 확인합니다.", useYn: "Y" },
  { id: "VC084", nm: "SELinux/AppArmor", agent: "SSH", val: "Enforcing", desc: "SELinux 또는 AppArmor의 Enforcing 모드 동작을 확인합니다.", useYn: "Y" },
  { id: "VC085", nm: "감사 로그 상태", agent: "SSH", val: "Active", desc: "auditd 서비스의 동작 및 로그 수집 상태를 확인합니다.", useYn: "Y" },
  { id: "VC086", nm: "syslog 서비스 상태", agent: "SSH", val: "Active", desc: "syslog/rsyslog 서비스의 동작 상태를 확인합니다.", useYn: "Y" },
  { id: "VC087", nm: "로그 로테이션 설정", agent: "SSH", val: "적용", desc: "logrotate 설정의 정상 적용 여부를 확인합니다.", useYn: "Y" },
  { id: "VC088", nm: "코어 덤프 설정", agent: "SSH", val: "비활성", desc: "코어 덤프 생성의 비활성화 여부를 확인합니다.", useYn: "Y" },
  { id: "VC089", nm: "Crontab 무결성", agent: "SSH", val: "정상", desc: "시스템 crontab 파일의 무단 변경 여부를 확인합니다.", useYn: "Y" },
  { id: "VC090", nm: "불필요 서비스 실행", agent: "SSH", val: "없음", desc: "불필요한 백그라운드 서비스 실행 여부를 확인합니다.", useYn: "Y" },
  { id: "VC091", nm: "열린 포트 목록", agent: "SSH", val: "승인된 포트만", desc: "현재 열린 포트가 승인된 목록과 일치하는지 확인합니다.", useYn: "Y" },
  { id: "VC092", nm: "SNMP 커뮤니티 문자열", agent: "SSH", val: "변경됨", desc: "SNMP 커뮤니티 문자열 기본값 변경 여부를 확인합니다.", useYn: "Y" },
  { id: "VC093", nm: "FTP 서비스 상태", agent: "SSH", val: "중지", desc: "FTP 서비스(vsftpd/proftpd)의 중지 여부를 확인합니다.", useYn: "Y" },
  { id: "VC094", nm: "Telnet 서비스 상태", agent: "SSH", val: "중지", desc: "Telnet 서비스의 중지 여부를 확인합니다.", useYn: "Y" },
  { id: "VC095", nm: "X11 포워딩", agent: "SSH", val: "비활성", desc: "SSH X11 포워딩 비활성화 여부를 확인합니다.", useYn: "Y" },
  { id: "VC096", nm: "에이전트 포워딩", agent: "SSH", val: "비활성", desc: "SSH 에이전트 포워딩 비활성화 여부를 확인합니다.", useYn: "Y" },
  { id: "VC097", nm: "파일 권한 감사", agent: "SSH", val: "정상", desc: "주요 시스템 파일의 권한 설정 적정성을 확인합니다.", useYn: "Y" },
  { id: "VC098", nm: "SUID/SGID 파일", agent: "SSH", val: "승인된 목록", desc: "승인되지 않은 SUID/SGID 파일 존재 여부를 확인합니다.", useYn: "Y" },
  { id: "VC099", nm: "월드쓰기 권한 파일", agent: "SSH", val: "없음", desc: "world-writable 권한을 가진 파일 존재 여부를 확인합니다.", useYn: "Y" },
  { id: "VC100", nm: "/tmp 파티션 옵션", agent: "SSH", val: "noexec,nosuid", desc: "/tmp 파티션의 noexec/nosuid 마운트 옵션을 확인합니다.", useYn: "N" },
  { id: "VC101", nm: "umask 설정", agent: "SSH", val: "022", desc: "시스템 기본 umask 값의 적정성을 확인합니다.", useYn: "Y" },
  { id: "VC102", nm: "bash history 설정", agent: "SSH", val: "적용", desc: "bash history 크기 및 타임스탬프 설정을 확인합니다.", useYn: "Y" },
  { id: "VC103", nm: "환경변수 PATH", agent: "SSH", val: "정상", desc: "시스템 PATH 환경변수의 안전한 설정 여부를 확인합니다.", useYn: "Y" },
  { id: "VC104", nm: "LD_PRELOAD 변수", agent: "SSH", val: "미설정", desc: "LD_PRELOAD 환경변수의 미설정 여부를 확인합니다.", useYn: "Y" },
  { id: "VC105", nm: "hosts.allow 설정", agent: "SSH", val: "적용", desc: "TCP Wrapper hosts.allow 파일의 설정 상태를 확인합니다.", useYn: "Y" },
  { id: "VC106", nm: "TCP Wrapper 설정", agent: "SSH", val: "정상", desc: "TCP Wrapper를 통한 접근 제어 설정을 확인합니다.", useYn: "Y" },
  { id: "VC107", nm: "커널 파라미터 튜닝", agent: "SSH", val: "적용", desc: "sysctl을 통한 보안 관련 커널 파라미터 설정을 확인합니다.", useYn: "Y" },
  { id: "VC108", nm: "IP 포워딩", agent: "SSH", val: "비활성", desc: "IP 포워딩 기능의 비활성화 여부를 확인합니다.", useYn: "Y" },
  { id: "VC109", nm: "로그 에러 발생 건수", agent: "LOKI", val: "0건", desc: "수집된 로그에서 ERROR 레벨 이상 로그 건수를 집계합니다.", useYn: "Y" },
  { id: "VC110", nm: "Critical 로그 건수", agent: "LOKI", val: "0건", desc: "CRITICAL/FATAL 레벨의 로그 발생 건수를 집계합니다.", useYn: "Y" },
  { id: "VC111", nm: "Warning 로그 건수", agent: "LOKI", val: "< 10건/h", desc: "WARNING 레벨 로그의 시간당 발생 건수를 집계합니다.", useYn: "Y" },
  { id: "VC112", nm: "애플리케이션 예외", agent: "LOKI", val: "0건/h", desc: "애플리케이션에서 발생한 예외(Exception) 건수를 집계합니다.", useYn: "Y" },
  { id: "VC113", nm: "NullPointerException", agent: "LOKI", val: "0건", desc: "NullPointerException 발생 건수를 집계합니다.", useYn: "Y" },
  { id: "VC114", nm: "OutOfMemoryError", agent: "LOKI", val: "0건", desc: "OutOfMemoryError 발생 건수를 집계합니다.", useYn: "Y" },
  { id: "VC115", nm: "StackOverflowError", agent: "LOKI", val: "0건", desc: "StackOverflowError 발생 건수를 집계합니다.", useYn: "Y" },
  { id: "VC116", nm: "DB 연결 실패 로그", agent: "LOKI", val: "0건", desc: "데이터베이스 연결 실패 관련 로그 건수를 집계합니다.", useYn: "Y" },
  { id: "VC117", nm: "타임아웃 로그 건수", agent: "LOKI", val: "< 5건/h", desc: "응답 타임아웃 관련 로그의 시간당 발생 건수를 집계합니다.", useYn: "Y" },
  { id: "VC118", nm: "인증 실패 로그", agent: "LOKI", val: "< 3건/min", desc: "로그인/인증 실패 로그의 분당 발생 건수를 집계합니다.", useYn: "Y" },
  { id: "VC119", nm: "권한 거부 로그", agent: "LOKI", val: "< 5건/h", desc: "접근 권한 거부 로그의 시간당 발생 건수를 집계합니다.", useYn: "Y" },
  { id: "VC120", nm: "비정상 접근 시도", agent: "LOKI", val: "0건", desc: "비인가 접근 시도 패턴이 감지된 건수를 집계합니다.", useYn: "N" },
  { id: "VC121", nm: "SQL 인젝션 패턴", agent: "LOKI", val: "0건", desc: "SQL 인젝션 공격 패턴이 감지된 건수를 집계합니다.", useYn: "Y" },
  { id: "VC122", nm: "XSS 패턴 감지", agent: "LOKI", val: "0건", desc: "XSS 공격 패턴이 감지된 건수를 집계합니다.", useYn: "Y" },
  { id: "VC123", nm: "무차별 대입 시도", agent: "LOKI", val: "0건", desc: "Brute Force 공격 시도가 감지된 건수를 집계합니다.", useYn: "Y" },
  { id: "VC124", nm: "디렉토리 트래버설", agent: "LOKI", val: "0건", desc: "디렉토리 트래버설 공격 패턴 감지 건수를 집계합니다.", useYn: "Y" },
  { id: "VC125", nm: "로그 수집 지연", agent: "LOKI", val: "< 30s", desc: "로그 발생 시점부터 수집까지 소요 시간을 측정합니다.", useYn: "Y" },
  { id: "VC126", nm: "로그 누락 건수", agent: "LOKI", val: "0건", desc: "파이프라인 내 로그 누락 건수를 집계합니다.", useYn: "Y" },
  { id: "VC127", nm: "로그 파싱 오류", agent: "LOKI", val: "0건", desc: "로그 파싱 실패로 인한 오류 건수를 집계합니다.", useYn: "Y" },
  { id: "VC128", nm: "로그 용량 임계치", agent: "LOKI", val: "< 80%", desc: "로그 저장소 사용 비율을 측정합니다.", useYn: "Y" },
  { id: "VC129", nm: "배포 오류 로그", agent: "LOKI", val: "0건", desc: "CI/CD 배포 과정에서 발생한 오류 로그 건수를 집계합니다.", useYn: "Y" },
  { id: "VC130", nm: "롤백 이벤트", agent: "LOKI", val: "0건", desc: "배포 실패로 인한 롤백 이벤트 발생 건수를 집계합니다.", useYn: "Y" },
  { id: "VC131", nm: "서비스 중단 이벤트", agent: "LOKI", val: "0건", desc: "서비스 비정상 중단 이벤트 발생 건수를 집계합니다.", useYn: "Y" },
  { id: "VC132", nm: "장애 복구 시간", agent: "LOKI", val: "< 15min", desc: "장애 발생부터 정상 복구까지 소요 시간을 측정합니다.", useYn: "Y" },
  { id: "VC133", nm: "알림 누락 건수", agent: "LOKI", val: "0건", desc: "발생해야 할 알림이 누락된 건수를 집계합니다.", useYn: "Y" },
  { id: "VC134", nm: "중복 알림 건수", agent: "LOKI", val: "< 3건/h", desc: "동일 이벤트에 대해 중복 발송된 알림 건수를 집계합니다.", useYn: "Y" },
  { id: "VC135", nm: "API 에러 응답", agent: "LOKI", val: "< 1%", desc: "API 응답 중 에러 응답 비율을 집계합니다.", useYn: "Y" },
  { id: "VC136", nm: "결제 오류 로그", agent: "LOKI", val: "0건", desc: "결제 처리 중 발생한 오류 로그 건수를 집계합니다.", useYn: "Y" },
  { id: "VC137", nm: "세션 만료 오류", agent: "LOKI", val: "< 10건/h", desc: "세션 만료로 인한 오류 로그의 시간당 건수를 집계합니다.", useYn: "Y" },
  { id: "VC138", nm: "토큰 검증 실패", agent: "LOKI", val: "< 5건/h", desc: "JWT/OAuth 토큰 검증 실패 로그 건수를 집계합니다.", useYn: "Y" },
  { id: "VC139", nm: "파일 업로드 오류", agent: "LOKI", val: "0건", desc: "파일 업로드 처리 중 발생한 오류 건수를 집계합니다.", useYn: "Y" },
  { id: "VC140", nm: "이메일 발송 실패", agent: "LOKI", val: "0건", desc: "이메일 발송 실패 건수를 집계합니다.", useYn: "N" },
  { id: "VC141", nm: "SMS 발송 실패", agent: "LOKI", val: "0건", desc: "SMS 발송 실패 건수를 집계합니다.", useYn: "Y" },
  { id: "VC142", nm: "외부 API 호출 실패", agent: "LOKI", val: "< 1%", desc: "외부 API 호출 실패 비율을 집계합니다.", useYn: "Y" },
  { id: "VC143", nm: "감사 로그 연속성", agent: "LOKI", val: "정상", desc: "감사 로그의 연속성 및 무결성을 확인합니다.", useYn: "Y" },
  { id: "VC144", nm: "보안 이벤트 로그", agent: "LOKI", val: "정상", desc: "보안 관련 이벤트 로그의 정상 수집 여부를 확인합니다.", useYn: "Y" },
  { id: "VC145", nm: "컴플라이언스 로그", agent: "LOKI", val: "정상", desc: "컴플라이언스 요구사항 관련 로그의 수집 상태를 확인합니다.", useYn: "Y" },
  { id: "VC146", nm: "개인정보 접근 로그", agent: "LOKI", val: "정상", desc: "개인정보 데이터에 대한 접근 로그의 정상 기록 여부를 확인합니다.", useYn: "Y" },
  { id: "VC147", nm: "서버실 온도", agent: "육안검수", val: "18~27°C", desc: "서버실 내 온도가 적정 범위 내인지 육안으로 확인합니다.", useYn: "Y" },
  { id: "VC148", nm: "서버실 습도", agent: "육안검수", val: "40~60%", desc: "서버실 내 습도가 적정 범위 내인지 육안으로 확인합니다.", useYn: "Y" },
  { id: "VC149", nm: "UPS 상태", agent: "육안검수", val: "정상", desc: "UPS 장비의 정상 동작 여부를 육안으로 확인합니다.", useYn: "Y" },
  { id: "VC150", nm: "전원 이중화 상태", agent: "육안검수", val: "정상", desc: "전원 이중화 구성의 정상 동작 여부를 확인합니다.", useYn: "Y" },
  { id: "VC151", nm: "랙 케이블 정리 상태", agent: "육안검수", val: "정상", desc: "서버 랙 내 케이블 정리 및 라벨링 상태를 확인합니다.", useYn: "Y" },
  { id: "VC152", nm: "장비 LED 상태", agent: "육안검수", val: "정상(녹색)", desc: "서버/네트워크 장비의 LED 상태를 육안으로 확인합니다.", useYn: "Y" },
  { id: "VC153", nm: "소화 설비 상태", agent: "육안검수", val: "정상", desc: "서버실 내 소화 설비의 정상 동작 여부를 확인합니다.", useYn: "Y" },
  { id: "VC154", nm: "출입 통제 시스템", agent: "육안검수", val: "정상", desc: "서버실 출입 통제 시스템의 정상 동작 여부를 확인합니다.", useYn: "Y" },
  { id: "VC155", nm: "CCTV 동작 상태", agent: "육안검수", val: "정상", desc: "서버실 CCTV의 정상 녹화 동작 여부를 확인합니다.", useYn: "Y" },
  { id: "VC156", nm: "방진/방습 설비", agent: "육안검수", val: "정상", desc: "방진·방습 설비의 정상 동작 여부를 확인합니다.", useYn: "Y" },
  { id: "VC157", nm: "보안패치 적용 확인", agent: "육안검수", val: "", desc: "보안 취약점 패치의 적용 여부를 문서로 확인합니다.", useYn: "Y" },
  { id: "VC158", nm: "라이선스 만료일 확인", agent: "육안검수", val: "", desc: "소프트웨어 라이선스 만료일을 확인합니다.", useYn: "Y" },
  { id: "VC159", nm: "네트워크 다이어그램", agent: "육안검수", val: "최신", desc: "현재 운영 환경과 네트워크 다이어그램의 일치 여부를 확인합니다.", useYn: "Y" },
  { id: "VC160", nm: "자산 목록 일치 여부", agent: "육안검수", val: "일치", desc: "실제 운영 장비와 자산 목록의 일치 여부를 확인합니다.", useYn: "N" },
  { id: "VC161", nm: "비상연락망 최신 여부", agent: "육안검수", val: "최신", desc: "비상연락망 문서의 최신 업데이트 여부를 확인합니다.", useYn: "Y" },
  { id: "VC162", nm: "DR 훈련 결과", agent: "육안검수", val: "", desc: "재해복구 훈련 결과 및 RTO/RPO 달성 여부를 확인합니다.", useYn: "Y" },
  { id: "VC163", nm: "보안 정책 준수 여부", agent: "육안검수", val: "", desc: "정보보안 정책의 현장 준수 여부를 점검합니다.", useYn: "Y" },
  { id: "VC164", nm: "개인정보 처리 점검", agent: "육안검수", val: "", desc: "개인정보 처리 현황 및 보호 조치 적정성을 점검합니다.", useYn: "Y" },
  { id: "VC165", nm: "접근권한 정기 검토", agent: "육안검수", val: "", desc: "사용자별 시스템 접근권한의 적정성을 정기 검토합니다.", useYn: "Y" },
  { id: "VC166", nm: "취약점 스캔 결과", agent: "육안검수", val: "", desc: "정기 취약점 스캔 결과 및 조치 현황을 확인합니다.", useYn: "Y" },
];
let NT = [
  {
    id: 1,
    title: "2026년 1분기 정기점검 일정 안내",
    views: 145, user: "김시스템", dt: "2026-01-10", scope: "전체",
    file: "2026년_1분기_점검일정표.xlsx",
    content: `안녕하세요. 정보시스템 운영팀입니다.

2026년 1분기 정기점검 일정을 아래와 같이 안내드립니다.

■ 점검 기간
- 1차: 2026년 1월 15일(목) ~ 1월 17일(토)
- 2차: 2026년 2월 12일(목) ~ 2월 14일(토)
- 3차: 2026년 3월 12일(목) ~ 3월 14일(토)

■ 점검 대상 시스템
- 고객관리시스템(CRM)
- 인사관리시스템(HR)
- 재무회계시스템(FIN)
- 전자결재시스템(GW)
- 홈페이지(WEB)
- 보안관제시스템(SEC)

■ 점검 내용
각 시스템별 서버 상태, 네트워크 연결, DB 백업 상태, 보안 취약점 등을 종합적으로 점검합니다.

■ 협조 사항
- 점검 기간 중 해당 시스템 사용이 제한될 수 있습니다.
- 점검자는 사전에 배정된 점검표에 따라 점검을 수행해 주시기 바랍니다.
- 이상 발견 시 즉시 운영팀(내선 1234)으로 연락 바랍니다.

상세 일정은 첨부 파일을 참고해 주세요.
문의사항은 운영팀으로 연락 주시기 바랍니다.

감사합니다.`,
  },
  {
    id: 2,
    title: "시스템 업데이트 안내 (v2.1)",
    views: 98, user: "김시스템", dt: "2026-01-15", scope: "전체",
    file: "ComplySight_v2.1_릴리즈노트.pdf",
    content: `안녕하세요. ComplySight 운영팀입니다.

ComplySight v2.1 업데이트가 완료되었습니다.

■ 업데이트 일시
- 2026년 1월 15일(수) 새벽 02:00 ~ 04:00

■ 주요 변경사항

[신규 기능]
1. 특별점검 결과 보고 기능 추가
   - 센티널 앱에서 점검 결과를 직접 등록할 수 있습니다.
   - 점검보고서 PDF 첨부 및 결과 요약 입력 가능

2. 배치 점검 현황 타임라인 추가
   - 점검 스케줄 화면에서 24시간 배치 현황을 한눈에 확인

3. 라이선스 기반 정보시스템 수 제한
   - 플랜별 등록 가능한 정보시스템 수가 관리됩니다.

[개선 사항]
- 자원 패널 사용용도 셀렉트 방식으로 변경
- 점검표 미리보기 화면 레이아웃 최적화
- 대시보드 오늘의 보고 현황 항목 개선

[버그 수정]
- 점검스케줄 등록 시 간헐적으로 저장되지 않는 문제 수정
- 자원 삭제 시 연관 점검 데이터 정합성 오류 수정
- 모바일 환경에서 패널이 화면을 벗어나는 UI 오류 수정

■ 업데이트 중 불편을 드려 죄송합니다.
   문의사항은 고객센터(support@complysight.io)로 연락 주세요.

감사합니다.`,
  },
  {
    id: 3,
    title: "점검표 양식 변경 안내",
    views: 72, user: "이기관", dt: "2026-01-20", scope: "전체",
    content: `안녕하세요. 정보보호팀입니다.

2026년부터 점검표 양식이 일부 변경되었음을 안내드립니다.

■ 변경 배경
국가정보보호기본지침 개정(2025.12.01)에 따라 정보시스템 점검 기록 항목이 강화되었습니다.

■ 주요 변경 항목

[추가된 항목]
- 점검 수행자 서명란 추가
- 이상 발견 시 조치 결과 기록 필드 추가
- 다음 점검 예정일 기재란 추가

[삭제된 항목]
- 구형 보안 취약점 체크리스트 (신규 양식으로 대체)

[변경된 항목]
- 서버 상태 항목: 5단계 → 3단계 평가 방식으로 단순화
- 네트워크 점검 항목: 세부 항목 12개 추가

■ 적용 시점
- 2026년 2월 1일부터 신규 양식 사용 의무화
- 기존 양식은 1월 31일까지만 사용 가능

■ 양식 다운로드
시스템 내 [환경설정 > 점검표 관리] 메뉴에서 신규 양식을 확인하실 수 있습니다.

문의사항은 정보보호팀(내선 2345)으로 연락 주시기 바랍니다.

감사합니다.`,
  },
  {
    id: 4,
    title: "보안관제시스템 긴급 패치 안내",
    views: 210, user: "김시스템", dt: "2026-01-25", scope: "전체",
    file: "긴급패치_공문.pdf",
    content: `[긴급] 보안관제시스템 패치 적용 안내

안녕하세요. 보안관제팀입니다.

외부 보안취약점 발견에 따른 긴급 패치를 아래와 같이 적용하였습니다.

■ 패치 적용 일시
- 2026년 1월 25일(토) 02:30 ~ 03:10 (약 40분)

■ 취약점 내용 (CVE-2026-0078)
- 영향 범위: 보안관제시스템 웹 관리자 인터페이스
- 심각도: 높음 (CVSS 8.1)
- 내용: 인증 우회를 통한 관리자 권한 탈취 가능 취약점

■ 패치 내용
1. 인증 모듈 버전 업그레이드 (v3.2.1 → v3.2.4)
2. 세션 토큰 강화 및 만료 시간 재설정
3. 관리자 접근 IP 화이트리스트 점검

■ 사용자 조치 사항
- 현재 사용 중인 보안관제시스템 관리자 비밀번호를 즉시 변경해 주세요.
- 변경 기한: 2026년 1월 31일(토)까지
- 미변경 시 2월 1일부터 접속이 제한됩니다.

■ 비밀번호 변경 방법
[보안관제시스템 접속] > [설정] > [계정 관리] > [비밀번호 변경]

패치 적용으로 인한 불편을 드려 죄송합니다.
긴급 문의는 보안관제팀(내선 9999, 24시간 운영)으로 연락 주시기 바랍니다.

감사합니다.`,
  },
  { id: 5, title: "2월 휴무일 설정 완료 안내", views: 88, user: "이기관", dt: "2026-02-01", scope: "전체",
    content: `안녕하세요. 운영팀입니다.\n\n2026년 2월 휴무일이 시스템에 등록되었습니다.\n\n■ 2월 휴무일\n- 2월 9일(월) ~ 2월 11일(수): 설 연휴\n- 2월 16일(일), 2월 22일(토), 2월 28일(토): 주말 공휴일\n\n휴무일에는 자동점검 배치가 중단되며, 긴급 점검이 필요한 경우 담당자에게 직접 연락하시기 바랍니다.\n\n감사합니다.` },
  { id: 6, title: "점검자 배정 기준 변경 안내", views: 56, user: "박유지보수", dt: "2026-02-03", scope: "전체",
    content: `안녕하세요. 운영팀입니다.\n\n2026년 2월부터 점검자 배정 기준이 변경됩니다.\n\n■ 변경 내용\n- 기존: 팀장 수동 배정\n- 변경: 전문 분야 및 담당 시스템 기준 자동 배정\n\n■ 시행일: 2026년 2월 10일\n\n자세한 내용은 팀장에게 문의하시기 바랍니다.\n\n감사합니다.` },
  { id: 7, title: "네트워크 장비 교체 일정", views: 134, user: "김시스템", dt: "2026-02-05", scope: "전체",
    file: "네트워크_장비교체_계획서.xlsx",
    content: `안녕하세요. 인프라팀입니다.\n\n노후 네트워크 장비 교체 일정을 안내드립니다.\n\n■ 교체 대상\n- L3 스위치 4대 (IDC 서버룸)\n- 방화벽 2대 (DMZ 구간)\n\n■ 교체 일정\n- 2026년 2월 21일(토) 22:00 ~ 2월 22일(일) 06:00\n\n■ 영향 범위\n교체 작업 중 약 10~20분간 인터넷 및 내부망 일시 단절이 발생할 수 있습니다.\n\n감사합니다.` },
  { id: 8, title: "자동점검 코어 버전 업데이트", views: 67, user: "김시스템", dt: "2026-02-07", scope: "전체",
    content: `안녕하세요. 운영팀입니다.\n\n자동점검 엔진 코어가 v4.3.0으로 업데이트됩니다.\n\n■ 업데이트 일시: 2026년 2월 8일(일) 03:00 ~ 04:00\n\n■ 변경사항\n- 점검 수행 속도 약 30% 향상\n- 메모리 사용량 최적화\n- Python 3.12 기반으로 런타임 업그레이드\n- 신규 점검 항목 17개 추가 (서버 보안 관련)\n\n작업 중 자동점검이 일시 중단될 수 있습니다.\n\n감사합니다.` },
  { id: 9, title: "업무집중기간 점검 협조 요청", views: 92, user: "이기관", dt: "2026-02-08", scope: "전체",
    content: `안녕하세요. 운영팀입니다.\n\n3월 인사발령 시즌에 따른 업무집중기간 점검에 협조를 요청드립니다.\n\n■ 업무집중기간: 2026년 3월 1일 ~ 3월 15일\n■ 집중 점검 대상: 인사관리시스템, 전자결재시스템\n\n해당 기간 중 시스템 안정성 확보를 위해 변경작업을 최소화하고, 이상 발생 시 즉시 보고 바랍니다.\n\n감사합니다.` },
  { id: 10, title: "라이선스 갱신 안내 (2026년)", views: 43, user: "김시스템", dt: "2026-02-10", scope: "전체",
    file: "라이선스_갱신_견적서.pdf",
    content: `안녕하세요. 운영팀입니다.\n\nComplySight 연간 라이선스 갱신 시기가 도래하였습니다.\n\n■ 현재 플랜: Standard (정보시스템 최대 10개)\n■ 만료일: 2026년 3월 31일\n■ 갱신 비용: 견적서 참고\n\n3월 15일까지 갱신 신청을 완료해 주시기 바랍니다.\n미갱신 시 4월 1일부터 일부 기능이 제한될 수 있습니다.\n\n문의: 영업팀 02-1234-5678\n\n감사합니다.` },
  { id: 11, title: "신규 정보시스템 등록 가이드", views: 31, user: "김시스템", dt: "2026-02-11", scope: "전체",
    file: "정보시스템_등록_가이드v1.2.pdf",
    content: `안녕하세요. 운영팀입니다.\n\n신규 정보시스템 등록 절차 가이드가 업데이트되었습니다.\n\n■ 주요 변경사항\n- 자원 등록 시 '사용용도' 항목 필수 입력으로 변경\n- 공유자원 별도 분류 체계 적용\n- 등록 후 담당자 승인 프로세스 추가\n\n자세한 내용은 첨부 가이드 문서를 참고해 주세요.\n\n감사합니다.` },
];

/* ── SVG Icons ── */
const Ic = ({ n, s = 16, c = "currentColor" }) => {
  const d = {
    dash: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
    db: "M12 2C6.5 2 3 3.3 3 5v14c0 1.7 3.5 3 9 3s9-1.3 9-3V5c0-1.7-3.5-3-9-3zM3 12c0 1.7 3.5 3 9 3s9-1.3 9-3",
    search: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z",
    check: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01 9 11.01",
    alert: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v4M12 16h.01",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
    gear: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 3a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    cal: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
    menu: "M3 12h18M3 6h18M3 18h18",
    out: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
    down: "M6 9l6 6 6-6",
    right: "M9 18l6-6-6-6",
    file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8",
    server: "M2 2h20v8H2zM2 14h20v8H2zM6 6h.01M6 18h.01",
    clock: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
    info:    "M12 2a10 10 0 100 20 10 10 0 000-20zM12 16v-4M12 8h.01",
    comp:    "M4 6h16M4 12h16M4 18h7",
    palette: "M12 2a10 10 0 100 20 10 10 0 000-20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
    grid:    "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    layers:  "M2 12l10-8 10 8M4 10v10h16V10",
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d[n] || d.info} /></svg>;
};

/* ── UI Components ── */
/* state-chip: 디자인 가이드 상태 칩 */
const Badge = ({ status, label }) => {
  const s = SC[status] || { b: "rgba(140,147,157,0.12)", t: "#6B7280" };
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 500,
    lineHeight: "18px", whiteSpace: "nowrap", background: s.b, color: s.t }}>{status}</span>;
};
const YnBadge = ({ v }) => {
  const isY = v === "Y" || v === "사용";
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 500, lineHeight: "18px",
    background: isY ? "rgba(51,156,213,0.12)" : "rgba(140,147,157,0.12)",
    color: isY ? "#339CD5" : "#6B7280" }}>{isY ? "사용" : "미사용"}</span>;
};
const RoleBadge = ({ v }) => {
  const rc = {
    "시스템관리자": { b: "rgba(51,156,213,0.12)",  t: "#339CD5" },  /* state1 */
    "기관관리자":   { b: "rgba(0,161,112,0.12)",   t: "#00805A" },  /* state9 */
    "유지보수총괄": { b: "rgba(243,109,0,0.12)",   t: "#D15E00" },  /* state4 */
    "사용자":       { b: "rgba(140,147,157,0.12)", t: "#6B7280" },  /* state10 */
  };
  const s = rc[v] || { b: "rgba(140,147,157,0.12)", t: "#6B7280" };
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 500,
    lineHeight: "18px", background: s.b, color: s.t }}>{v}</span>;
};
/* ── 버튼 컴포넌트 - 디자인 가이드 4.8 Button ── */
/* Btn: primary(secondary색)/default(white+border)/danger/outline/outlineDanger */
const Btn = ({ children, primary, danger, success, outline, outlineDanger, ghost, sm, xs, small, onClick, style: cs, disabled }) => {
  const size = xs ? "xs" : (sm || small) ? "sm" : "md";
  const base = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
    cursor: disabled ? "not-allowed" : "pointer", border: "none", borderRadius: 4, lineHeight: 1,
    fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s ease", opacity: disabled ? 0.45 : 1,
    ...(size === "md" ? { padding: "10px 20px", fontSize: 13 } :
        size === "sm" ? { padding: "7px 14px", fontSize: 12 } :
                        { padding: "5px 10px", fontSize: 12 }),
    ...cs };
  if (primary)  return <button disabled={disabled} onClick={onClick} style={{ ...base, background: C.sec, color: "#fff" }}
    onMouseEnter={e => { if(!disabled) e.currentTarget.style.background="#3a6cc8"; }} onMouseLeave={e => e.currentTarget.style.background=C.sec}
    onFocus={e => { if(!disabled) e.currentTarget.style.background="#3a6cc8"; }} onBlur={e => e.currentTarget.style.background=C.sec}>{children}</button>;
  if (success)  return <button disabled={disabled} onClick={onClick} style={{ ...base, background: C.green, color: "#fff" }}
    onMouseEnter={e => { if(!disabled) e.currentTarget.style.background="#148132"; }} onMouseLeave={e => e.currentTarget.style.background=C.green}
    onFocus={e => { if(!disabled) e.currentTarget.style.background="#14813c"; }} onBlur={e => e.currentTarget.style.background=C.green}>{children}</button>;
  if (danger)   return <button disabled={disabled} onClick={onClick} style={{ ...base, background: "#E24949", color: "#fff" }}
    onMouseEnter={e => { if(!disabled) e.currentTarget.style.background="#c93d3d"; }} onMouseLeave={e => e.currentTarget.style.background="#E24949"}
    onFocus={e => { if(!disabled) e.currentTarget.style.background="#c93d3d"; }} onBlur={e => e.currentTarget.style.background="#E24949"}>{children}</button>;
  if (outline)    return <button disabled={disabled} onClick={onClick} style={{ ...base, background: "#fff", color: C.sec, border: "1px solid rgb(215,215,215)" }}
    onMouseEnter={e => { if(!disabled){ e.currentTarget.style.background="#eef3ff"; }}} onMouseLeave={e => { e.currentTarget.style.background="#fff"; }}
    onFocus={e => { if(!disabled) e.currentTarget.style.background="#eef3ff"; }} onBlur={e => e.currentTarget.style.background="#fff"}>{children}</button>;
  if (outlineDanger) return <button disabled={disabled} onClick={onClick} style={{ ...base, background: "#fff", color: "#E24949", border: "1px solid #E24949" }}
    onMouseEnter={e => { if(!disabled) e.currentTarget.style.background="#fff1f1"; }} onMouseLeave={e => e.currentTarget.style.background="#fff"}
    onFocus={e => { if(!disabled) e.currentTarget.style.background="#fff1f1"; }} onBlur={e => e.currentTarget.style.background="#fff"}>{children}</button>;
  if (ghost)         return <button disabled={disabled} onClick={onClick} style={{ ...base, background: "none", color: C.pri, border: `1px solid ${C.pri}` }}
    onMouseEnter={e => { if(!disabled) e.currentTarget.style.background="#eef3ff"; }} onMouseLeave={e => e.currentTarget.style.background="none"}
    onFocus={e => { if(!disabled) e.currentTarget.style.background="#eef3ff"; }} onBlur={e => e.currentTarget.style.background="none"}>{children}</button>;
  /* default */
  return <button disabled={disabled} onClick={onClick} style={{ ...base, background: "#fff", color: "#64748b", border: "1px solid #e2e8f0" }}
    onMouseEnter={e => { if(!disabled) e.currentTarget.style.background="#f1f5f9"; }} onMouseLeave={e => e.currentTarget.style.background="#fff"}
    onFocus={e => { if(!disabled) e.currentTarget.style.background="#f1f5f9"; }} onBlur={e => e.currentTarget.style.background="#fff"}>{children}</button>;
};
/* SearchBtn / RefreshBtn — 검색폼 전용 */
const SearchBtn = ({ onClick }) => <button onClick={onClick} style={{ background: "#fff", border: `1px solid ${C.sec}`, color: C.sec, borderRadius: 4, padding: "0 20px", fontSize: 15, fontWeight: 500, height: "100%", minHeight: 36, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s ease", whiteSpace: "nowrap" }}
  onMouseEnter={e => { e.currentTarget.style.background=C.sec; e.currentTarget.style.color="#fff"; }} onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.color=C.sec; }}>검색</button>;
const RefreshBtn = ({ onClick }) => <button onClick={onClick} title="초기화" style={{ width: 40, height: "100%", minHeight: 36, border: `1px solid ${C.pri}`, borderRadius: 4, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s ease" }}
  onMouseEnter={e => e.currentTarget.style.background=C.priL} onMouseLeave={e => e.currentTarget.style.background="#fff"}>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2v4h-4" stroke={C.pri} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 10a6 6 0 11-1.3-6.3L14 6" stroke={C.pri} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
</button>;
/* SecBtnO/SecBtnP — 섹션 헤더 버튼 (하위 호환 유지) */
const SecBtnO = ({ children, onClick }) => <Btn onClick={onClick} outline>{children}</Btn>;
const SecBtnP = ({ children, onClick, style:sx }) => <Btn onClick={onClick} primary style={sx}>{children}</Btn>;
const Card = ({ title, extra, children, style: cs, onClick }) => (
  <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.brd}`, ...cs }}>
    {(title || extra) && <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}><span onClick={onClick} style={{ fontSize: 15, fontWeight: 600, color: C.txH, cursor: onClick ? "pointer" : "inherit" }}>{title}{onClick && <span style={{fontSize:12,color:C.txL,fontWeight:400,marginLeft:6}}>→</span>}</span>{extra}</div>}
    <div style={{ padding: 20, ...(cs?.flexDirection === "column" ? { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto" } : {}) }}>{children}</div>
  </div>
);
const Stat = ({ label, value, color, icon, onClick }) => (
  <div onClick={onClick} style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.brd}`, padding: "20px 24px", flex: 1, minWidth: 140, cursor: onClick ? "pointer" : "default", transition: "box-shadow .2s" }} onMouseEnter={e => { if(onClick) e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.1)"; }} onMouseLeave={e => e.currentTarget.style.boxShadow=""}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 12, color: C.txL, marginBottom: 8, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: color || C.txH }}>{value}</div>
      </div>
      <div style={{ width: 46, height: 46, borderRadius: 10, background: (color || C.pri) + "18", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n={icon} s={22} c={color || C.pri} /></div>
    </div>
  </div>
);
/* PH: 페이지 헤더 + 브레드크럼 (title-layout) */
const PH = ({ title, bc, extra }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: C.txH, lineHeight: "32px" }}>{title}</h1>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {extra}
      {bc && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.txL }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 6l6-4 6 4v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" stroke="currentColor" strokeWidth="1.3"/><path d="M6 14V9h4v5" stroke="currentColor" strokeWidth="1.3"/></svg>
        {bc.split(" > ").map((b, i, arr) => <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {i > 0 && <span style={{ color: C.txX }}>›</span>}
          <span style={{ color: i === arr.length - 1 ? C.txS : C.txL }}>{b}</span>
        </span>)}
      </div>}
    </div>
  </div>
);
/* SB — 디자인 가이드 4.10 Searchform */
const SB = ({ ph = "검색어를 입력하세요", fields, onSearch, value, onChange, onReset, children, onSearchClick }) => {
  const [v, setV] = useState(value ?? "");
  const [fieldVals, setFieldVals] = useState({});
  useEffect(() => { if (value !== undefined) setV(value); }, [value]);
  const reset = () => {
    setV(""); setFieldVals({});
    onReset?.();
    onSearch?.({}, "");
  };
  const search = () => onSearch?.(fieldVals, v);
  const handleChange = (val) => { setV(val); onChange?.(val); };
  return (
    <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg,
      borderRadius: 6, padding: "16px 12px", display: "flex", gap: 24,
      marginTop: 0, marginBottom: 31, alignItems: "stretch" }}>
      {/* 필드 영역: 왼쪽 정렬, 콘텐츠 크기에 맞게 확장 */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
        {children ? children : (<>
        {/* 추가 필터 필드 */}
        {fields?.map((f, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", minWidth: 120 }}>
            <span style={{ ...LABEL_STYLE_SM }}>
              {f.label}{f.required && <span style={{ color: C.red, marginLeft: 2 }}>*</span>}
            </span>
            {f.type === "select" ? (
              <FSelect value={fieldVals[f.key] || ""} onChange={e => setFieldVals(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 15,
                  background: "#fff", color: C.txt, minWidth: 120, fontFamily: "inherit", outline: "none" }}>
                <option value="">전체</option>
                {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </FSelect>
            ) : (
              <FInput value={fieldVals[f.key] || ""} onChange={e => setFieldVals(p => ({ ...p, [f.key]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && search()}
                placeholder={f.placeholder || ""}
                style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4,
                  fontSize: 15, outline: "none", color: C.txt, background: "#fff",
                  minWidth: 120, fontFamily: "inherit" }} />
            )}
          </div>
        ))}
        {/* 기본 검색 입력 — 가장 오른쪽 */}
        <div style={{ display: "flex", flexDirection: "column", minWidth: 120 }}>
          <span style={{ ...LABEL_STYLE_SM }}>검색</span>
          <FInput value={v} onChange={e => handleChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder={ph}
            style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4,
              fontSize: 15, outline: "none", color: C.txt, background: "#fff",
              minWidth: 120, fontFamily: "inherit" }} />
        </div>
        </>)}
      </div>
      {/* 버튼: 항상 오른쪽, 세로 100% */}
      <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexShrink: 0, alignSelf: "stretch" }}>
        <SearchBtn onClick={onSearchClick || search} />
        <RefreshBtn onClick={reset} />
      </div>
    </div>
  );
};
/* Tbl: 디자인 가이드 data-table + sec-title 통합 */
const Tbl = ({ cols, data, onRow, pageSize = 10, noPaging, secTitle, secCount, secButtons, rowStyle }) => {
  const [pg, setPg] = useState(1);
  const total = data.length;
  const maxPg = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => { setPg(1); }, [data.length]);
  const rows = noPaging ? data : data.slice((pg - 1) * pageSize, pg * pageSize);
  const pBtn = (icon, disabled, onClick) => <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ width: 28, height: 28, background: "none", border: "none", cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: disabled ? C.txX : C.txS, padding: 0 }}>{icon}</button>;
  const pNum = (n) => <button key={n} onClick={() => setPg(n)} style={{ minWidth: 28, height: 28, padding: "0 6px", background: pg === n ? C.sec : "none", border: "none", cursor: "pointer", borderRadius: 4, fontSize: 15, fontWeight: pg === n ? 600 : 400, color: pg === n ? C.white : C.txS, fontFamily: "inherit" }}>{n}</button>;
  const pages = () => {
    const ps = [];
    let s = Math.max(1, pg - 2), e = Math.min(maxPg, pg + 2);
    if (e - s < 4) { s = Math.max(1, e - 4); e = Math.min(maxPg, s + 4); }
    for (let i = s; i <= e; i++) ps.push(pNum(i));
    return ps;
  };
  const ArrowIcon = ({ d }) => <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return <div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, borderBottom: `1px solid ${C.brdD}`, marginBottom: 0 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        {secTitle && <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{secTitle}</span>}
        {secCount != null && <span style={{ fontSize: 12, color: C.txL }}>{secCount}건</span>}
      </div>
      {secButtons && <div style={{ display: "flex", gap: 4, alignItems: "center" }}>{secButtons}</div>}
    </div>
    <div style={{ overflowX: "auto" }}>
      <table style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", borderBottom: `1px solid ${C.brd}` }}>
        {/* thead — 디자인 가이드: 상단 진한선(neutral-900), 하단 medium선(neutral-400) */}
        <thead style={{ borderTop: `1px solid ${C.txH}` }}>
          <tr>
            {cols.map((c, i) => (
              <th key={i} style={{ ...TH({ textAlign: c.align || "center", background: C.white,
                ...(c.w ? { width: c.w } : {}), ...(c.mw ? { minWidth: c.mw } : {}) }) }}>
                {c.t}
              </th>
            ))}
          </tr>
        </thead>
        {/* tbody — hover: secondary-100 (#457ce11a) */}
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={cols.length} style={{ padding: "56px 0", textAlign: "center" }}>
                <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 44, lineHeight: 1 }}>🔍</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.txH, marginTop: 2 }}>검색 결과가 없습니다</div>
                  <div style={{ fontSize: 13, color: C.txL }}>다른 검색어나 필터 조건을 사용해 보세요.</div>
                </div>
              </td></tr>
            : rows.map((r, ri) => (
                <tr key={ri} onClick={() => onRow?.(r)}
                  style={{ cursor: onRow ? "pointer" : "default", ...(rowStyle ? rowStyle(r) : {}) }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(69,124,225,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  {cols.map((c, ci) => (
                    <td key={ci} style={{ ...TD({ textAlign: c.align || "center", lineHeight: "24px",
                      ...(c.w ? { width: c.w } : {}), ...(c.mw ? { minWidth: c.mw } : {}) }) }}>
                      {c.r ? c.r(r[c.k], r) : (r[c.k] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
    {!noPaging && total > pageSize && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {pBtn(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, pg === 1, () => setPg(1))}
          {pBtn(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, pg === 1, () => setPg(pg - 1))}
        </div>
        <div style={{ display: "flex", gap: 2 }}>{pages()}</div>
        <div style={{ display: "flex", gap: 2 }}>
          {pBtn(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, pg === maxPg, () => setPg(pg + 1))}
          {pBtn(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, pg === maxPg, () => setPg(maxPg))}
        </div>
      </div>
    </div>}
  </div>;
};

/* GuiPag: 가이드 스타일 페이지네이션 */
const GuiPag = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;
  const ArrowIcon = ({ d }) => <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const pb = (icon, disabled, onClick) => <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ width: 28, height: 28, background: "none", border: "none", cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: disabled ? C.txX : C.txS, padding: 0 }}>{icon}</button>;
  const ps = [];
  let s = Math.max(1, page - 2), e = Math.min(totalPages, page + 2);
  if (e - s < 4) { s = Math.max(1, e - 4); e = Math.min(totalPages, s + 4); }
  for (let i = s; i <= e; i++) ps.push(i);
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {pb(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, page === 1, () => setPage(1))}
        {pb(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, page === 1, () => setPage(page - 1))}
      </div>
      <div style={{ display: "flex", gap: 2 }}>
        {ps.map(n => <button key={n} onClick={() => setPage(n)} style={{ minWidth: 28, height: 28, padding: "0 6px", background: page === n ? C.sec : "none", border: "none", cursor: "pointer", borderRadius: 4, fontSize: 15, fontWeight: page === n ? 600 : 400, color: page === n ? "#fff" : C.txS, fontFamily: "inherit" }}>{n}</button>)}
      </div>
      <div style={{ display: "flex", gap: 2 }}>
        {pb(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, page === totalPages, () => setPage(page + 1))}
        {pb(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, page === totalPages, () => setPage(totalPages))}
      </div>
    </div>
  </div>;
};


/* ══════════════════════════════════════════════
   DatePicker — 날짜 선택 컴포넌트
   props: value(YYYY-MM-DD), onChange, placeholder, disabled, readOnly, style
══════════════════════════════════════════════ */
const DatePicker = ({ value = "", onChange, placeholder = "YYYY-MM-DD", disabled, readOnly, style: sx }) => {
  const [open, setOpen]       = useState(false);
  const [viewYear, setViewYear] = useState(() => value ? +value.slice(0,4) : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? +value.slice(5,7)-1 : new Date().getMonth());
  const [yearMode, setYearMode] = useState(false);
  const [directInput, setDirectInput] = useState(""); // 직접입력 상태
  const [dropUp, setDropUp] = useState(false);
  const [dropLeft, setDropLeft] = useState(false);
  const ref = useRef(null);

  /* 달력 바깥 클릭 닫기 */
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  /* 열릴 때 상/하/좌/우 공간 계산 */
  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const calWidth = 240;
    const calHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    setDropUp(spaceBelow < calHeight && spaceAbove > spaceBelow);
    setDropLeft(spaceRight < calWidth);
  }, [open]);

  /* 달력 열릴 때 현재 값으로 뷰 맞추기 */
  const openCal = () => {
    if (disabled || readOnly) return;
    const now = new Date();
    const isValidDate = value && /^\d{4}-\d{2}-\d{2}/.test(value);
    if (isValidDate) {
      setViewYear(+value.slice(0,4));
      setViewMonth(+value.slice(5,7)-1);
    } else {
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth());
    }
    setYearMode(false);
    setDirectInput(isValidDate ? value : "");
    setOpen(true);
  };

  const daysInMonth = (y, m) => new Date(y, m+1, 0).getDate();
  const firstDay    = (y, m) => new Date(y, m, 1).getDay();
  const today = new Date(); const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const select = (d) => {
    const v = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    onChange?.(v); setOpen(false);
  };

  /* 직접입력 핸들러: 숫자만 허용, YYYYMMDD → YYYY-MM-DD 자동 포맷 */
  const handleDirectInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
    let formatted = raw;
    if (raw.length >= 5) formatted = raw.slice(0,4) + "-" + raw.slice(4);
    if (raw.length >= 7) formatted = raw.slice(0,4) + "-" + raw.slice(4,6) + "-" + raw.slice(6);
    setDirectInput(formatted);
  };

  /* 직접입력 확정 (Enter 또는 blur) */
  const applyDirectInput = () => {
    const raw = directInput.replace(/-/g, "");
    if (raw.length === 8) {
      const y = +raw.slice(0,4), m = +raw.slice(4,6), d = +raw.slice(6,8);
      const date = new Date(y, m-1, d);
      if (date.getFullYear()===y && date.getMonth()===m-1 && date.getDate()===d) {
        const v = `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        onChange?.(v);
        setViewYear(y); setViewMonth(m-1);
        setOpen(false);
      }
    }
  };

  const DAYS = ["일","월","화","수","목","금","토"];
  const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

  /* 연도 범위 (현재 기준 -10 ~ +10) */
  const yearStart = viewYear - (viewYear % 10);
  const years = Array.from({length:12}, (_,i) => yearStart + i);

  const inputStyle = {
    ...fInput, paddingRight: 36, cursor: disabled ? "not-allowed" : readOnly ? "default" : "pointer",
    background: disabled || readOnly ? C.bgDis : "#fff",
    color: value ? C.txt : C.txL, ...sx
  };

  return (
    <div ref={ref} style={{ position: "relative", width: sx?.width ?? "100%" }}>
      <div style={{ position: "relative" }}>
        <FInput readOnly value={value || ""} placeholder={placeholder}
          onClick={openCal} disabled={disabled}
          style={inputStyle} />
        <span onClick={openCal} style={{ position: "absolute", right: 10, top: "50%",
          transform: "translateY(-50%)", cursor: disabled || readOnly ? "default" : "pointer",
          display: "flex", alignItems: "center", pointerEvents: disabled || readOnly ? "none" : "auto" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" stroke={C.txL} strokeWidth="1.2"/>
            <path d="M1.5 6.5h13" stroke={C.txL} strokeWidth="1.2"/>
            <path d="M5 1v3M11 1v3" stroke={C.txL} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </span>
      </div>

      {open && (
        <div style={{ position: "absolute",
          ...(dropUp
            ? { bottom: "calc(100% + 4px)", top: "auto" }
            : { top: "calc(100% + 4px)", bottom: "auto" }),
          ...(dropLeft
            ? { right: 0, left: "auto" }
            : { left: 0, right: "auto" }),
          zIndex: 1200,
          background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,.12)", padding: 12, minWidth: 240, userSelect: "none" }}>
          {/* 헤더 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            {!yearMode ? (
              <>
                <button onClick={() => { if(viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }}
                  style={{ ...calNavBtn }}>&lt;</button>
                <span onClick={() => setYearMode(true)}
                  style={{ fontSize: 15, fontWeight: 600, color: C.txH, cursor: "pointer",
                    padding: "2px 8px", borderRadius: 4, transition: "background .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                  onMouseLeave={e=>e.currentTarget.style.background=""}>
                  {viewYear}년 {MONTHS[viewMonth]}
                </span>
                <button onClick={() => { if(viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }}
                  style={{ ...calNavBtn }}>&gt;</button>
              </>
            ) : (
              <>
                <button onClick={() => setViewYear(y => y-10)} style={{ ...calNavBtn }}>&lt;</button>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.txH }}>
                  {yearStart} – {yearStart+11}
                </span>
                <button onClick={() => setViewYear(y => y+10)} style={{ ...calNavBtn }}>&gt;</button>
              </>
            )}
          </div>

          {yearMode ? (
            /* 연도 선택 그리드 */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
              {years.map(y => (
                <button key={y} onClick={() => { setViewYear(y); setYearMode(false); }}
                  style={{ ...calDayBtn,
                    background: y === viewYear ? C.sec : "none",
                    color: y === viewYear ? "#fff" : C.txt, fontWeight: y === viewYear ? 600 : 400,
                    borderRadius: 6 }}>
                  {y}
                </button>
              ))}
            </div>
          ) : (
            <>
              {/* 요일 헤더 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
                {DAYS.map((d,i) => (
                  <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 600,
                    color: i===0?"#E24949":i===6?"#457CE1":C.txL, padding: "2px 0" }}>{d}</div>
                ))}
              </div>
              {/* 날짜 그리드 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {Array(Math.max(0, firstDay(viewYear, viewMonth) || 0)).fill(null).map((_,i) => <div key={"e"+i} />)}
                {Array(Math.max(1, daysInMonth(viewYear, viewMonth) || 28)).fill(null).map((_,i) => {
                  const d = i+1;
                  const ds = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                  const isSelected = ds === value;
                  const isToday    = ds === todayStr;
                  const dow = (firstDay(viewYear, viewMonth) + i) % 7;
                  return (
                    <button key={d} onClick={() => select(d)}
                      style={{ ...calDayBtn,
                        background: isSelected ? C.sec : "none",
                        color: isSelected ? "#fff" : dow===0 ? "#E24949" : dow===6 ? "#457CE1" : C.txt,
                        fontWeight: isSelected || isToday ? 600 : 400,
                        outline: isToday && !isSelected ? `2px solid ${C.sec}` : "none",
                        outlineOffset: -2 }}>
                      {d}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* 하단: 직접입력 + 오늘 버튼 */}
          <div style={{ borderTop: `1px solid ${C.brd}`, marginTop: 8, paddingTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <FInput
              value={directInput}
              onChange={handleDirectInput}
              onKeyDown={e => e.key === "Enter" && applyDirectInput()}
              onBlur={applyDirectInput}
              placeholder="YYYY-MM-DD"
              style={{ flex: 1, padding: "4px 8px", fontSize: 14, border: `1px solid ${C.brd}`,
                borderRadius: 4, outline: "none", fontFamily: "inherit", color: C.txt,
                boxSizing: "border-box" }}
            />
            <button onClick={() => { onChange?.(todayStr); setDirectInput(todayStr); setOpen(false); }}
              style={{ fontSize: 12, color: C.sec, background: "none", border: "none",
                cursor: "pointer", fontFamily: "inherit", fontWeight: 500, flexShrink: 0 }}>오늘</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── DatePicker 공용 버튼 스타일 ── */
const calNavBtn = {
  width: 24, height: 24, background: "none", border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  borderRadius: 4, fontSize: 13, color: C.txS, fontFamily: "inherit",
  transition: "background .15s",
};
const calDayBtn = {
  width: "100%", aspectRatio: "1", background: "none", border: "none", cursor: "pointer",
  borderRadius: 4, fontSize: 13, fontFamily: "inherit",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "background .15s",
};

/* ══════════════════════════════════════════════
   DateRangePicker — 날짜 범위 선택 컴포넌트
   props: from, to, onFromChange, onToChange, disabled
══════════════════════════════════════════════ */
const DateRangePicker = ({ from="", to="", onFromChange, onToChange, disabled }) => {
  const handleFromChange = (v) => {
    onFromChange(v);
    if (to && v > to) onToChange(v);
  };
  const handleToChange = (v) => {
    onToChange(v);
    if (from && v < from) onFromChange(v);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <DatePicker value={from} onChange={handleFromChange} placeholder="시작일" disabled={disabled} style={{ width: 130 }} />
      <span style={{ color: C.txL, fontSize: 15, flexShrink: 0 }}>~</span>
      <DatePicker value={to} onChange={handleToChange} placeholder="종료일" disabled={disabled} style={{ width: 130 }} />
    </div>
  );
};

/* ══════════════════════════════════════════════
   TimePicker — 시간 선택 컴포넌트
   props: value(HH:mm), onChange, placeholder, disabled, readOnly, withSeconds, style
══════════════════════════════════════════════ */
const TimePicker = ({ value="", onChange, placeholder="HH:MM", disabled, readOnly, withSeconds=false, style:sx }) => {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [dropLeft, setDropLeft] = useState(false);
  const ref = useRef(null);

  const parse = (v) => {
    if (!v) return { h:0, m:0, s:0 };
    const p = v.split(":"); return { h:+p[0]||0, m:+p[1]||0, s:+p[2]||0 };
  };
  const fmt = (h,m,s) => withSeconds
    ? `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`
    : `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;

  const { h: selH, m: selM, s: selS } = parse(value);

  useEffect(() => {
    if (!open) return;
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const calWidth = 220;
    const calHeight = 280;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    setDropUp(spaceBelow < calHeight && spaceAbove > spaceBelow);
    setDropLeft(spaceRight < calWidth);
  }, [open]);

  const inputStyle = {
    ...fInput, paddingRight: 36, cursor: disabled ? "not-allowed" : readOnly ? "default" : "pointer",
    background: disabled || readOnly ? C.bgDis : "#fff", color: value ? C.txt : C.txL, ...sx
  };

  const ColScroll = ({ label, items, selected, onSelect }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
      <div style={{ ...LABEL_STYLE }}>{label}</div>
      <div style={{ height: 180, overflowY: "auto", width: "100%",
        scrollbarWidth: "thin", scrollbarColor: `${C.brd} transparent` }}>
        {items.map(v => (
          <div key={v} onClick={() => onSelect(v)}
            style={{ padding: "6px 0", textAlign: "center", cursor: "pointer",
              fontSize: 15, fontFamily:"inherit", borderRadius: 4,
              background: v === selected ? C.sec : "none",
              color: v === selected ? "#fff" : C.txt,
              fontWeight: v === selected ? 600 : 400,
              transition: "background .1s" }}
            onMouseEnter={e => { if(v!==selected) e.currentTarget.style.background=C.secL; }}
            onMouseLeave={e => { if(v!==selected) e.currentTarget.style.background="none"; }}>
            {String(v).padStart(2,"0")}
          </div>
        ))}
      </div>
    </div>
  );

  const hours   = Array.from({length:24},(_,i)=>i);
  const minutes = Array.from({length:60},(_,i)=>i);
  const seconds = Array.from({length:60},(_,i)=>i);

  const now = new Date();
  const setNow = () => {
    onChange?.(fmt(now.getHours(), now.getMinutes(), withSeconds ? now.getSeconds() : 0));
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative", width: sx?.width ?? "100%" }}>
      <div style={{ position: "relative" }}>
        <FInput readOnly value={value || ""} placeholder={placeholder}
          onClick={() => { if (!disabled && !readOnly) setOpen(o=>!o); }}
          disabled={disabled}
          style={inputStyle} />
        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          display: "flex", alignItems: "center", pointerEvents: "none" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke={C.txL} strokeWidth="1.2"/>
            <path d="M8 4.5v4l2.5 2" stroke={C.txL} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </span>
      </div>

      {open && (
        <div style={{ position: "absolute",
          ...(dropUp
            ? { bottom: "calc(100% + 4px)", top: "auto" }
            : { top: "calc(100% + 4px)", bottom: "auto" }),
          ...(dropLeft
            ? { right: 0, left: "auto" }
            : { left: 0, right: "auto" }),
          zIndex: 1200,
          background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,.12)", padding: "12px 8px", minWidth: withSeconds ? 220 : 160,
          userSelect: "none" }}>
          {/* 스크롤 컬럼 */}
          <div style={{ display: "flex", gap: 4, alignItems: "flex-start",
            borderBottom: `1px solid ${C.brd}`, paddingBottom: 8, marginBottom: 8 }}>
            <ColScroll label="시" items={hours}   selected={selH}
              onSelect={h => onChange?.(fmt(h, selM, selS))} />
            <div style={{ width: 1, background: C.brd, alignSelf: "stretch", margin: "20px 0 0" }} />
            <ColScroll label="분" items={minutes} selected={selM}
              onSelect={m => onChange?.(fmt(selH, m, selS))} />
            {withSeconds && <>
              <div style={{ width: 1, background: C.brd, alignSelf: "stretch", margin: "20px 0 0" }} />
              <ColScroll label="초" items={seconds} selected={selS}
                onSelect={s => onChange?.(fmt(selH, selM, s))} />
            </>}
          </div>
          {/* 현재 시각 / 확인 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
            <button onClick={setNow}
              style={{ fontSize: 12, color: C.sec, background: "none", border: "none",
                cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>현재 시각</button>
            <button onClick={() => setOpen(false)}
              style={{ fontSize: 12, color: "#fff", background: C.sec, border: "none",
                borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* DateTimePicker — 날짜+시간 통합 */
const DateTimePicker = ({ value="", onChange, disabled, readOnly }) => {
  const [date, setDate] = useState(() => value ? value.slice(0,10) : "");
  const [time, setTime] = useState(() => value ? value.slice(11,16) : "");
  const update = (d, t) => { if (d && t) onChange?.(`${d} ${t}`); };
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <div style={{ flex: 3 }}>
        <DatePicker value={date} onChange={d => { setDate(d); update(d, time); }}
          disabled={disabled} readOnly={readOnly} />
      </div>
      <div style={{ flex: 2 }}>
        <TimePicker value={time} onChange={t => { setTime(t); update(date, t); }}
          disabled={disabled} readOnly={readOnly} />
      </div>
    </div>
  );
};

/* ── Modal & Form Components ── */
const Modal = ({ open, onClose, title, width = 580, children }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)" }} />
      <div style={{ position: "relative", background: C.white, borderRadius: 8, width, maxWidth: "92vw", maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.2)", animation: "modalIn .2s ease" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{title}</span>
          <div onClick={onClose} style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL, fontSize: 18 }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>✕</div>
        </div>
        <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(12px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
};

/* FormRow — 디자인 가이드 field-label 패턴 */
const FormRow = ({ label, required, children, half, style: sx }) => (
  <div style={{ marginBottom: 14, display: half ? "inline-flex" : "flex", flexDirection: "column", width: half ? "calc(50% - 6px)" : "100%", marginRight: half ? 12 : 0, verticalAlign: "top", ...sx }}>
    <label style={{ ...LABEL_STYLE, gap: 3 }}>
      {label}{required && <span style={{ color: C.red, fontSize: 12 }}>*</span>}
    </label>
    {children}
  </div>
);
/* 디자인 가이드 — 필드 레이블 공통 스타일 */
const LABEL_STYLE = { fontSize: 11, fontWeight: 600, color: C.txS, marginBottom: 4, display: "flex", alignItems: "center", lineHeight: 1.4, minHeight: 18 };
/* 검색 영역 전용 — Small 레이블 */
const LABEL_STYLE_SM = { ...LABEL_STYLE };
/* 검색 영역 전용 — Small 레이블 */
/* 검색 영역 전용 — Small 레이블 */
/* 디자인 가이드 — 필드 레이블 공통 스타일 */
/* 디자인 가이드 — 필드 레이블 공통 스타일 */
/* 디자인 가이드 input 스타일 */
const TH = (sx={}) => ({ padding:"9px 12px",  borderBottom:`1px solid ${C.brdD}`, fontSize:14, color:C.txL, fontWeight:400, verticalAlign:"middle", whiteSpace:"nowrap", textAlign:"center", ...sx });
const TD = (sx={}) => ({ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`,  fontSize:14, color:C.txt, verticalAlign:"middle", whiteSpace:"nowrap", ...sx });
const fInput = { width: "100%", padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: C.txt, fontFamily: "inherit", transition: "border-color .15s", minHeight: 36 };
/* SecTitle — 디자인 가이드 5.1 sec-title */
const SecTitle = ({ label, count, primary, buttons }) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
    <div style={{ display: "inline-block", fontSize: 14, fontWeight: 700, color: "#111111",
      paddingBottom: 5, borderBottom: `2px solid ${C.pri}`, minWidth: 60 }}>
      {label}{count != null && <span style={{ fontSize: 12, color: C.txL, fontWeight: 400, marginLeft: 6 }}>총 {count}건</span>}
    </div>
    {buttons && <div style={{ display: "flex", gap: 4 }}>{buttons}</div>}
  </div>
);
const PanelDeleteBtn = ({ onClick }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, marginTop: -6 }}>
    <Btn sm outlineDanger onClick={onClick}>삭제</Btn>
  </div>
);
/* PanelFooter — 디자인 가이드 버튼: 취소(white), 저장(secondary) */
const PanelFooter = ({ onCancel, onSave, saveLabel = "저장", extraLeft }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
    paddingTop: 16, marginTop: 8, borderTop: `1px solid ${C.brd}` }}>
    <div>{extraLeft}</div>
    <div style={{ display: "flex", gap: 8 }}>
      <Btn onClick={onCancel}>취소</Btn>
      <Btn primary onClick={onSave}>{saveLabel}</Btn>
    </div>
  </div>
);
const _chevron = "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWw0IDQgNC00IiBzdHJva2U9IiM5MjkyOTIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=\")";
const fSelect = { ...fInput, appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundImage: _chevron, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32, cursor: "pointer" };
const fTextarea = { ...fInput, minHeight: 72, resize: "vertical", fontFamily: "inherit" };

/* ── 포커스 테두리 통일 래퍼 ── */
const FInput = ({ style, ...props }) => (
  <input
    style={{ ...fInput, ...style }}
    onFocus={e => e.target.style.borderColor = C.sec}
    onBlur={e => e.target.style.borderColor = C.brd}
    {...props}
  />
);
const FSelect = ({ style, children, ...props }) => (
  <select
    style={{ ...fSelect, ...style }}
    onFocus={e => e.target.style.borderColor = C.sec}
    onBlur={e => e.target.style.borderColor = C.brd}
    {...props}
  >{children}</select>
);
const FTextarea = ({ style, ...props }) => (
  <textarea
    style={{ ...fTextarea, ...style }}
    onFocus={e => e.target.style.borderColor = C.sec}
    onBlur={e => e.target.style.borderColor = C.brd}
    {...props}
  />
);

/* readOnly select → input으로 렌더링 (사선 패턴 완전 제거) */
const RoSelect = ({ readOnly, value, onChange, style, children, placeholder }) => {
  if (readOnly) {
    let label = String(value || placeholder || "");
    const extract = (ch) => {
      if (!ch) return;
      if (Array.isArray(ch)) { ch.forEach(extract); return; }
      if (ch && ch.props) {
        if (ch.props.value !== undefined && String(ch.props.value) === String(value)) {
          if (typeof ch.props.children === "string") label = ch.props.children;
        }
        if (ch.props.children) extract(ch.props.children);
      }
    };
    try { extract(children); } catch(e) {}
    return React.createElement("input", { readOnly: true, value: label, style: { ...fInput, background: "#F9FAFC", color: C.txt, cursor: "default" } });
  }
  return React.createElement("select", { style: { ...style, backgroundImage: _chevron }, value, onChange }, children);
};

/* ── 정보시스템 추가 레이어 팝업 ── */
const AddSystemModal = ({ open, onClose, onSubmit, systems = SYS }) => {
  const genId = () => { const max = systems.reduce((m,s) => { const n=parseInt(s.id.replace(/[^0-9]/g,"")); return n>m?n:m; }, 0); return "SYS" + String(max+1).padStart(3,"0"); };
  const emptyForm = () => ({ systemNm: "", systemId: genId(), useYn: "Y", systemType: "", mgmtOrg: "", systemDesc: "", operStartDt: "", operEndDt: "", managerNm: "", managerPhone: "", contractInfo: "", memo: "", members: [] });
  const [form, setForm] = useState(() => emptyForm());
  const [errors, setErrors] = useState({});
  const [memberSearch, setMemberSearch] = useState("");

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };
  const mgmtOrgOptions = ["내부", "외부(업체)", "IT운영팀", "경영지원팀", "정보보안팀"];
  const systemTypeOptions = ["업무", "서비스", "솔루션", "기타"];

  const validate = () => {
    const e = {};
    if (!form.systemNm.trim()) e.systemNm = "정보시스템 명은 필수입니다.";

    if (!form.systemType) e.systemType = "시스템 유형을 선택해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) { onSubmit?.(form); setForm(emptyForm()); setErrors({}); setMemberSearch(""); onClose(); } };
  const handleClose = () => { setForm(emptyForm()); setErrors({}); setMemberSearch(""); onClose(); };
  const errStyle = (k) => errors[k] ? { borderColor: C.red } : {};

  return (
    <div style={{ display: open ? "block" : "none" }}>
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.25)", zIndex: 9998 }} onClick={handleClose} />
    <div style={{ position: "fixed", top: 0, right: 0, width: 620, height: "100%", background: "#fff", zIndex: 9999, boxShadow: "-4px 0 20px rgba(0,0,0,.12)", display: "flex", flexDirection: "column", transition: "transform .3s ease" }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: C.txH }}>정보시스템 추가</span>
        <button onClick={handleClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.txL }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      {/* 기본 정보 */}
      <div style={{ marginBottom: 20 }}>
        {<SecTitle label="기본 정보" primary />}
        <FormRow label="사용상태">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => set("useYn", form.useYn === "Y" ? "N" : "Y")}
              style={{ position: "relative", width: 44, height: 24, borderRadius: 12, cursor: "pointer",
                background: form.useYn === "Y" ? C.pri : "#D1D5DB", transition: "background .2s" }}>
              <div style={{ position: "absolute", top: 2, left: form.useYn === "Y" ? 22 : 2,
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .2s" }} />
            </div>
            <span style={{ fontSize: 13, color: form.useYn === "Y" ? C.pri : C.txL, fontWeight: 500 }}>
              {form.useYn === "Y" ? "사용" : "미사용"}
            </span>
          </div>
        </FormRow>
        <FormRow label="정보시스템 명" required>
          <FInput style={{ ...errStyle("systemNm") }} value={form.systemNm} onChange={e => set("systemNm", e.target.value)} placeholder="정보시스템 명을 입력하세요" maxLength={100} />
          {errors.systemNm && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.systemNm}</span>}
        </FormRow>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="시스템 ID" style={{ flex: 1 }}>
            <div style={{ position: "relative" }}>
              <FInput value={form.systemId} readOnly style={{ background: "#F9FAFC", color: C.txS, pointerEvents: "none", paddingRight: 64 }} />
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: C.txS, fontWeight: 600, background: C.bgSec, padding: "2px 7px", borderRadius: 3, pointerEvents: "none" }}>자동생성</span>
            </div>
          </FormRow>
          <FormRow label="시스템 유형" required style={{ flex: 1 }}>
            <FSelect style={{ ...errStyle("systemType") }} value={form.systemType} onChange={e => set("systemType", e.target.value)}>
              <option value="">선택하세요</option>
              {systemTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </FSelect>
            {errors.systemType && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.systemType}</span>}
          </FormRow>
          <FormRow label="관리주체" style={{ flex: 1 }}>
            <FSelect style={fSelect} value={form.mgmtOrg} onChange={e => set("mgmtOrg", e.target.value)}>
              <option value="">선택하세요</option>
              {mgmtOrgOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </FSelect>
          </FormRow>
        </div>
        <FormRow label="시스템 설명">
          <FTextarea style={fTextarea} value={form.systemDesc} onChange={e => set("systemDesc", e.target.value)} placeholder="시스템에 대한 설명을 입력하세요" maxLength={1000} />
        </FormRow>
      </div>

      {/* 운영 정보 */}
      <div style={{ marginBottom: 20 }}>
        {<SecTitle label="운영 정보" />}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="운영시작일" style={{ flex: 1 }}>
            <DatePicker value={form.operStartDt} onChange={v => set("operStartDt", v)} />
          </FormRow>
          <FormRow label="종료예정일" style={{ flex: 1 }}>
            <DatePicker value={form.operEndDt} onChange={v => set("operEndDt", v)} />
          </FormRow>
          <div style={{ flex: 1 }} />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="담당자" style={{ flex: 1 }}>
            <FInput value={form.managerNm} onChange={e => set("managerNm", e.target.value)} placeholder="담당자 이름" maxLength={50} />
          </FormRow>
          <FormRow label="담당자 연락처" style={{ flex: 1 }}>
            <FInput value={form.managerPhone} onChange={e => set("managerPhone", e.target.value)} placeholder="010-0000-0000" maxLength={20} />
          </FormRow>
          <div style={{ flex: 1 }} />
        </div>
        <FormRow label="계약정보">
          <FTextarea style={fTextarea} value={form.contractInfo} onChange={e => set("contractInfo", e.target.value)} placeholder="유지보수 계약 정보를 입력하세요" maxLength={500} />
        </FormRow>
        <FormRow label="비고">
          <FTextarea style={fTextarea} value={form.memo} onChange={e => set("memo", e.target.value)} placeholder="기타 메모 정보" maxLength={500} />
        </FormRow>
      </div>

      {/* 구성원 (MULTI SELECT + 검색) */}
      <div style={{ marginBottom: 20 }}>
        {<SecTitle label="구성원" />}
        {/* 선택된 태그 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8, minHeight: 32 }}>
          {form.members.map(uid => {
            const u = USERS.find(x => x.userId === uid);
            return u ? (
              <span key={uid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 14, background: C.priL, color: C.priD, fontSize: 12, fontWeight: 500 }}>
                {u.userNm} <span style={{ fontSize: 12, color: C.txL }}>({u.userRole})</span>
                <span onClick={() => set("members", form.members.filter(m => m !== uid))} style={{ cursor: "pointer", marginLeft: 2, fontSize: 15, lineHeight: 1, color: C.txL }}>×</span>
              </span>
            ) : null;
          })}
          {form.members.length === 0 && <span style={{ fontSize: 12, color: C.txL, lineHeight: "32px" }}>구성원이 없습니다. 아래에서 추가하세요.</span>}
        </div>
        {/* 검색 인풋 */}
        <div style={{ position: "relative", marginBottom: 6 }}>
          <FInput
            style={{ paddingLeft: 30, fontSize: 14, marginBottom: 0 }}
            placeholder="이름, 아이디, 역할로 검색..."
            value={memberSearch}
            onChange={e => setMemberSearch(e.target.value)}
          />
          <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <Ic n="search" s={14} c={C.txL} />
          </span>
          {memberSearch && (
            <span onClick={() => setMemberSearch("")}
              style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: C.txL, fontSize: 15, lineHeight: 1 }}>×</span>
          )}
        </div>
        {/* 체크박스 목록 */}
        <div style={{ border: `1px solid ${C.brd}`, borderRadius: 6, maxHeight: 180, overflowY: "auto" }}>
          {(() => {
            const q = memberSearch.trim().toLowerCase();
            const filtered = USERS.filter(u => u.useYn === "Y" && (
              !q || u.userNm.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q) || u.userRole.toLowerCase().includes(q)
            ));
            if (filtered.length === 0) return (
              <div style={{ padding: "14px", textAlign: "center", fontSize: 12, color: C.txL }}>
                {q ? `"${memberSearch}" 검색 결과가 없습니다.` : "사용자가 없습니다."}
              </div>
            );
            return filtered.map(u => {
              const checked = form.members.includes(u.userId);
              return (
                <div key={u.userId}
                  onClick={() => {
                    if (checked) set("members", form.members.filter(m => m !== u.userId));
                    else set("members", [...form.members, u.userId]);
                  }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer",
                    background: checked ? C.priL : "#fff", borderBottom: `1px solid ${C.brd}` }}
                  onMouseEnter={e => { if (!checked) e.currentTarget.style.background = "#F9FAFC"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = checked ? C.priL : "#fff"; }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, border: `2px solid ${checked ? C.pri : C.brd}`, background: checked ? C.pri : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize: 13, color: checked ? C.pri : C.txt, fontWeight: checked ? 600 : 400, flex: 1 }}>{u.userNm}</span>
                  <span style={{ fontSize: 12, color: C.txL }}>{u.userId}</span>
                  <span style={{ fontSize: 12, color: C.txS, background: "#F0F0F0", padding: "1px 6px", borderRadius: 8 }}>{u.userRole}</span>
                </div>
              );
            });
          })()}
        </div>
        <div style={{ fontSize: 12, color: C.txL, marginTop: 6 }}>{form.members.length}명 선택됨</div>
      </div>

      </div>
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Btn onClick={handleClose}>취소</Btn>
        <div style={{ flex: 1 }} />
        <Btn primary onClick={handleSubmit}>등록</Btn>
      </div>
    </div>
    </div>
  );
};

/* ── Panel View Mode (panel | modal) ── */
let _viewMode = "panel";
const getViewMode = () => _viewMode;
const setViewMode = (m) => { _viewMode = m; };

/* ── 미저장 확인 팝업 ── */
/* ── 쿠키 유틸 ── */
const setCookie = (name, value, days = 365) => {
  const exp = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${exp};path=/;SameSite=Lax`;
};
const getCookie = (name) => {
  const match = document.cookie.split("; ").find(r => r.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};
const COOKIE_SKIP_SUBMIT_CONFIRM = "cs_skip_submit_confirm";

/* ── 공통 ConfirmModal ── */
const ConfirmModal = ({ open, title, msg, onOk, onCancel, okLabel = "확인", danger = true }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:10001,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:12, padding:28, width:360,
        boxShadow:"0 8px 32px rgba(0,0,0,.2)" }}>
        <div style={{ fontSize:18, fontWeight:600, marginBottom:8,
          color: danger ? "#ef4444" : C.txH }}>{title}</div>
        <div style={{ fontSize:15, color:C.txS, marginBottom:24, lineHeight:1.7 }}>{msg}</div>
        <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
          <Btn onClick={onCancel}>취소</Btn>
          <Btn danger={danger} primary={!danger} onClick={onOk}>{okLabel}</Btn>
        </div>
      </div>
    </div>
  );
};

/* ── 공통 Toggle ── */
const Toggle = ({ on, onClick, disabled }) => (
  <div onClick={disabled ? undefined : onClick}
    style={{ width:44, height:24, borderRadius:12,
      background: on ? C.sec : C.brdD,
      position:"relative", cursor: disabled ? "not-allowed" : "pointer",
      flexShrink:0, opacity: disabled ? 0.5 : 1, transition:"background .2s" }}>
    <div style={{ position:"absolute", top:3, left: on ? 23 : 3,
      width:18, height:18, borderRadius:"50%", background:"#fff",
      boxShadow:"0 1px 3px rgba(0,0,0,.2)", transition:"left .2s" }} />
  </div>
);

/* ── 공통 Radio ── */
const Radio = ({ options = [["Y","사용"],["N","미사용"]], value, onChange, disabled }) => (
  <div style={{ display:"flex", gap:16 }}>
    {options.map(([v, l]) => (
      <label key={v} onClick={() => !disabled && onChange(v)}
        style={{ display:"flex", alignItems:"center", gap:6, fontSize:15,
          color: disabled ? C.txL : C.txH, cursor: disabled ? "not-allowed" : "pointer", userSelect:"none" }}>
        <div style={{ width:18, height:18, borderRadius:"50%", flexShrink:0,
          border:`2px solid ${value===v ? C.sec : C.brdD}`, background:"#fff",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          {value===v && <div style={{ width:10, height:10, borderRadius:"50%", background:C.sec }} />}
        </div>
        {l}
      </label>
    ))}
  </div>
);

/* ── 공통 FilterTab ── */
const FilterTab = ({ options = ["전체","사용","미사용"], value, onChange }) => (
  <div style={{ display:"flex", gap:2 }}>
    {options.map(v => (
      <button key={v} onClick={() => onChange(v)}
        style={{ padding:"4px 12px", fontSize:15, fontWeight: value===v ? 600 : 400,
          border:`1px solid ${value===v ? C.sec : C.brd}`, borderRadius:5,
          background: value===v ? C.sec : "#fff",
          color: value===v ? "#fff" : C.txS,
          cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
        {v}
      </button>
    ))}
  </div>
);


const UnsavedConfirm = ({ open, onDiscard, onSave }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: 10, padding: "28px 28px 22px", width: 360, boxShadow: "0 20px 60px rgba(0,0,0,.2)", textAlign: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 22 }}>⚠️</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>수정 사항을 저장하겠습니까?</div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 22 }}>저장하지 않으면 변경 내용이 사라집니다.</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Btn onClick={onDiscard}>저장 안함</Btn>
          <Btn primary onClick={onSave}>저장</Btn>
        </div>
      </div>
    </div>
  );
};

/* ── useEditPanel: editMode + 미저장 확인 공통 훅 ── */
const useEditPanel = (open, onClose) => {
  const [editMode, setEditMode] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  React.useEffect(() => { if (open) { setEditMode(false); setConfirmOpen(false); } }, [open]);
  const startEdit = () => setEditMode(true);
  const requestClose = (saveFn) => {
    if (editMode) { setConfirmOpen(true); }
    else onClose();
  };
  const handleDiscard = () => { setConfirmOpen(false); setEditMode(false); onClose(); };
  const handleSaveConfirm = (saveFn) => { setConfirmOpen(false); if (saveFn) saveFn(); setEditMode(false); };
  const handleSave = () => { setEditMode(false); };
  const handleCancel = () => { if (editMode) setConfirmOpen(true); else onClose(); };
  return { editMode, confirmOpen, startEdit, requestClose, handleDiscard, handleSaveConfirm, handleSave, handleCancel, setConfirmOpen };
};

/* ── Side Panel / Modal Hybrid ── */
const SidePanel = ({ open, onClose, onOverlayClick, title, width = 520, children, noScroll = false }) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mode, setMode] = useState(getViewMode());
  useEffect(() => {
    if (open) { setVisible(true); setClosing(false); setMode(getViewMode()); }
    else if (visible && !closing) { setVisible(false); }
  }, [open]);
  const handleClose = () => { if (closing) return; setClosing(true); setTimeout(() => { setVisible(false); setClosing(false); onClose(); }, 220); };
  const handleOverlayClick = () => { if (onOverlayClick) { onOverlayClick(); } else { handleClose(); } };
  const toggleMode = () => {
    const next = mode === "panel" ? "modal" : "panel";
    setMode(next); setViewMode(next);
  };
  if (!visible) return null;

  const modeIcon = mode === "panel"
    ? <ArrowUpLeftFromSquare size={16} />
    : <PanelLeftClose size={16} />;

  if (mode === "modal") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={handleOverlayClick} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", animation: closing ? "fadeOut .22s ease forwards" : "fadeIn .2s ease" }} />
        <div style={{ position: "relative", background: "#fff", borderRadius: 8, width, maxWidth: "92vw", maxHeight: "88vh", height: noScroll ? "88vh" : undefined, display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.2)", animation: closing ? "modalOut .22s ease forwards" : "modalIn .2s ease", transition: "width .25s ease" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{title}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <div onClick={toggleMode} title="사이드 패널로 전환" style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>{modeIcon}</div>
              <div onClick={handleOverlayClick} style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL, fontSize: 18 }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>✕</div>
            </div>
          </div>
          <div style={{ display: noScroll ? "flex" : "block", flexDirection: noScroll ? "column" : undefined, padding: noScroll ? "0" : "22px 24px", overflowY: noScroll ? "hidden" : "auto", flex: 1, minHeight: 0 }}>{children}</div>
        </div>
        <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}} @keyframes modalOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(12px) scale(.97)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes fadeOut{from{opacity:1}to{opacity:0}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={handleOverlayClick} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)", animation: closing ? "fadeOut .22s ease forwards" : "fadeIn .2s ease" }} />
      <div style={{ position: "relative", width, maxWidth: "94vw", height: "100vh", background: "#fff", display: "flex", flexDirection: "column", boxShadow: "-8px 0 30px rgba(0,0,0,.12)", animation: closing ? "slideOut .22s ease forwards" : "slideIn .25s ease" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{title}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <div onClick={toggleMode} title="레이어 팝업으로 전환" style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL }}
              onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>{modeIcon}</div>
            <div onClick={handleOverlayClick} style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL, fontSize: 18 }}
              onMouseEnter={e => e.currentTarget.style.background = "#F9FAFC"} onMouseLeave={e => e.currentTarget.style.background = ""}>✕</div>
          </div>
        </div>
        <div style={{ flex: 1, display: noScroll ? "flex" : "block", flexDirection: noScroll ? "column" : undefined, overflowY: noScroll ? "hidden" : "auto", padding: noScroll ? "0" : "20px 24px", minHeight:0 }}>{children}</div>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}} @keyframes slideOut{from{transform:translateX(0)}to{transform:translateX(100%)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes fadeOut{from{opacity:1}to{opacity:0}}`}</style>
    </div>
  );
};

/* ── 자원 추가/상세 사이드 패널 ── */
const ResourcePanel = ({ open, onClose, resource, onSubmit, onDelete, systems, defaultSysId = "", hasLinkedCL = false }) => {
  const isEdit = !!resource;
  const canDelete = !hasLinkedCL;
  const emptyForm = {
    nm: "", parentNm: "", large: "", mid: "", small: "", st: "사용", mgmtOrg: "", operType: "", importDt: "",
    firstUsage: "", virtualYn: "N", prevUsage: "", usage: "", resourceId: "", detailUsage: "",
    ip: "", serviceIp: "", manufacturer: "", model: "", os: "", serial: "", memory: "", cpuClock: "",
    cpuModel: "", cpuCore: "", cpuArch: "", localDisk: "", memo: "",
    serviceUrl: "", installPath: "", logPath: "",
    serviceUrls: [{ type: "https://", value: "" }], installPaths: [{ type: "/opt", value: "" }], logPaths: [{ type: "애플리케이션로그", value: "" }],
    port: "", snmpAccount: "", snmpVersion: "", snmpAuth: "", inspectors: [], sysId: defaultSysId, clId: "", version: ""
  };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [inspSearch, setInspSearch] = useState("");
  const [inspOpen, setInspOpen] = useState(false);
  const [clSearch,   setClSearch]   = useState("");

  const readOnly = isEdit && !editing;

  const prevResRef = useRef(null);
  useEffect(() => {
    if (open && resource && prevResRef.current !== resource.id) {
      prevResRef.current = resource.id;
      setForm({
        nm: resource.nm || "", parentNm: resource.parentNm || "", large: resource.large || "", mid: resource.mid || "", small: resource.small || "",
        st: resource.st || "사용", mgmtOrg: resource.mgmtOrg || "", operType: resource.operType || "", importDt: resource.importDt || "",
        firstUsage: resource.firstUsage || "", virtualYn: resource.virtualYn || "N", prevUsage: resource.prevUsage || "",
        usage: resource.usage || "", resourceId: resource.resourceId || "", detailUsage: resource.detailUsage || "",
        ip: resource.ip || "", serviceIp: resource.serviceIp || "", manufacturer: resource.manufacturer || "",
        model: resource.model || "", os: resource.os || "", serial: resource.serial || "", memory: resource.memory || "",
        cpuClock: resource.cpuClock || "", cpuModel: resource.cpuModel || "", cpuCore: resource.cpuCore || "",
        cpuArch: resource.cpuArch || "", localDisk: resource.localDisk || "", memo: resource.memo || "",
        serviceUrl: resource.serviceUrl || "", installPath: resource.installPath || "", logPath: resource.logPath || "",
        serviceUrls: resource.serviceUrls || [{ type: "https://", value: resource.serviceUrl || "" }],
        installPaths: resource.installPaths || [{ type: "/opt", value: resource.installPath || "" }],
        logPaths: resource.logPaths || [{ type: "애플리케이션로그", value: resource.logPath || "" }],
        port: resource.port || "", snmpAccount: resource.snmpAccount || "", snmpVersion: resource.snmpVersion || "",
        snmpAuth: resource.snmpAuth || "", inspectors: resource.inspectors || ["user01"], sysId: resource.sysId || "", clId: resource.clId || "", version: resource.version || ""
      });
      setEditing(false);
      setErrors({});
    }
    if (open && !resource && prevResRef.current !== "__new__") {
      prevResRef.current = "__new__";
      setForm({ ...emptyForm, sysId: defaultSysId });
      setEditing(false);
      setErrors({});
    }
    if (!open) { prevResRef.current = null; }
  }, [open, resource]);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const largeOptions = ["하드웨어", "소프트웨어"];
  const midOptions = ["서버", "WEB", "WAS", "DBMS", "네트워크", "보안", "스토리지", "백업", "클라우드", "기타"];
  const smallByMid = { "서버": ["Linux", "Windows", "AIX", "HP-UX"], "WEB": ["Apache", "Nginx", "IIS"], "WAS": ["Tomcat", "WebLogic", "JBoss", "JEUS"], "DBMS": ["MySQL", "PostgreSQL", "Oracle", "MSSQL", "MariaDB"], "네트워크": ["L2 Switch", "L3 Switch", "Router", "Firewall"], "보안": ["WAF", "IPS", "IDS", "방화벽"], "스토리지": ["NAS", "SAN", "DAS"], "백업": ["Backup Server", "Tape"], "클라우드": ["AWS", "Azure", "GCP", "NCP"], "기타": ["기타"] };
  const mgmtOrgOptions = ["IT운영팀", "경영지원팀", "재무팀", "물류팀", "홍보팀", "정보보안팀", "데이터팀"];
  const operTypeOptions = ["운영", "개발", "테스트", "DR"];
  const cpuArchOptions = ["x86_64", "ARM64", "SPARC", "POWER"];
  const snmpVersionOptions = ["v1", "v2c", "v3"];

  const validate = () => {
    const e = {};
    if (!form.nm.trim()) e.nm = "자원명은 필수입니다.";
    if (!form.sysId) e.sysId = "정보시스템을 선택해주세요.";
    if (!form.large) e.large = "대분류를 선택해주세요.";
    if (!form.mid) e.mid = "중분류를 선택해주세요.";
    if (!form.small) e.small = "소분류를 선택해주세요.";

    // 중분류별 조건부 필수
    const m = form.mid;
    const needIp      = ["서버","네트워크","보안","WEB","DBMS","WAS"].includes(m);
    const needVersion = ["서버","네트워크","보안","WEB","DBMS","WAS"].includes(m);
    const needOS      = ["서버"].includes(m);
    const needPort    = ["WEB","DBMS","WAS"].includes(m);
    const needSnmpAcc = ["네트워크","보안","DBMS"].includes(m);
    const needSnmpVer = ["네트워크","보안"].includes(m);
    const needSvcUrl  = ["WAS"].includes(m);
    const needInstall = ["WEB","DBMS","WAS"].includes(m);
    const needLog     = ["WEB","DBMS","WAS"].includes(m);

    if (needIp      && !form.ip.trim())                                             e.ip = "장비 IP는 필수입니다.";
    if (needVersion && !form.version.trim())                                        e.version = "버전은 필수입니다.";
    if (needOS      && !form.os.trim())                                             e.os = "OS는 필수입니다.";
    if (needPort    && !form.port.trim())                                           e.port = "포트는 필수입니다.";
    if (needSnmpAcc && !form.snmpAccount.trim())                                    e.snmpAccount = "SNMP 계정정보는 필수입니다.";
    if (needSnmpVer && !form.snmpVersion)                                           e.snmpVersion = "SNMP 버전은 필수입니다.";
    if (needSvcUrl  && !form.serviceUrls.some(u => u.value.trim()))                 e.serviceUrl = "서비스 URL은 필수입니다.";
    if (needInstall && !form.installPaths.some(p => p.value.trim()))               e.installPath = "설치경로는 필수입니다.";
    if (needLog     && !form.logPaths.some(p => p.value.trim()))                   e.logPath = "로그경로는 필수입니다.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit?.(form, isEdit ? resource.id : null);
      if (isEdit) {
        setEditing(false); // 수정모드 종료, 패널 유지
      } else {
        prevResRef.current = null; setForm(emptyForm); setErrors({}); setEditing(false);
        setInspSearch(""); setInspOpen(false); setClSearch(""); onClose();
      }
    }
  };
  const handleClose = () => { if (editing) { setConfirmOpen(true); return; } prevResRef.current = null; setForm(emptyForm); setErrors({}); setEditing(false); setInspSearch(""); setInspOpen(false); setClSearch(""); onClose(); };
  const forceClose = () => { prevResRef.current = null; setForm(emptyForm); setErrors({}); setEditing(false); setInspSearch(""); setInspOpen(false); setClSearch(""); setConfirmOpen(false); onClose(); };
  const handleSaveAndStay = () => {
    if (validate()) {
      onSubmit?.(form, isEdit ? resource.id : null);
      setEditing(false);
      setConfirmOpen(false);
    }
  };

  const errS = (k) => errors[k] ? { borderColor: C.red } : {};
  const roStyle = readOnly ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", cursor: "default" } : {};
  const roSelect = readOnly ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", cursor: "default", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundImage: "none" } : {};

  return (
    <>
    <UnsavedConfirm open={confirmOpen} onDiscard={forceClose} onSave={handleSaveAndStay} />
    <SidePanel open={open} onClose={handleClose} onOverlayClick={() => editing ? setConfirmOpen(true) : handleClose()} title={isEdit ? (editing ? "자원 수정" : "자원 상세") : "자원 추가"} width={580} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

      {/* ── 기본 정보 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="기본 정보" primary />}

        {/* 사용유무 */}
        <FormRow label="사용유무">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => !readOnly && set("st", form.st === "사용" ? "미사용" : "사용")}
              style={{ position: "relative", width: 44, height: 24, borderRadius: 12,
                cursor: readOnly ? "default" : "pointer", opacity: readOnly ? 0.6 : 1,
                background: form.st === "사용" ? C.pri : "#D1D5DB", transition: "background .2s" }}>
              <div style={{ position: "absolute", top: 2, left: form.st === "사용" ? 22 : 2,
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .2s" }} />
            </div>
            <span style={{ fontSize: 13, color: form.st === "사용" ? C.pri : C.txL, fontWeight: 500, opacity: readOnly ? 0.6 : 1 }}>
              {form.st === "사용" ? "사용" : "미사용"}
            </span>
          </div>
        </FormRow>

        {/* 1단: 자원명 */}
        <FormRow label="자원명" required>
          <FInput style={{ ...errS("nm"), ...roStyle }} value={form.nm} onChange={e => set("nm", e.target.value)} placeholder="자원명을 입력하세요" readOnly={readOnly} maxLength={100} />
          {errors.nm && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.nm}</span>}
        </FormRow>

        {/* 3단: 자원 ID, 소속 정보시스템, 상위자원명 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="자원 ID" style={{ flex: 1 }}>
            <div style={{ position: "relative" }}>
              <FInput style={{ background: "#F9FAFC", color: C.txS, pointerEvents: "none", paddingRight: 80 }}
                value={isEdit ? (form.resourceId || resource?.resourceId || "") : "저장 시 자동생성"}
                readOnly />
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: C.txL, background: "#EEEEEE", padding: "2px 6px", borderRadius: 3, pointerEvents: "none" }}>자동생성</span>
            </div>
          </FormRow>
          <FormRow label="소속 정보시스템" required style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect, ...errS("sysId") }} value={form.sysId} onChange={e => set("sysId", e.target.value)}>
              <option value="">선택하세요</option>
              {(systems || SYS).map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
            </RoSelect>
            {errors.sysId && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.sysId}</span>}
          </FormRow>
          <FormRow label="상위 자원명" style={{ flex: 1 }}>
            <FInput style={{ ...roStyle }} value={form.parentNm} onChange={e => set("parentNm", e.target.value)} placeholder="상위 자원명" readOnly={readOnly} maxLength={100} />
          </FormRow>
        </div>

        {/* 3단: 대분류, 중분류, 소분류 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="대분류" required style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect, ...errS("large") }} value={form.large} onChange={e => set("large", e.target.value)}>
              <option value="">선택하세요</option>
              {largeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
            {errors.large && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.large}</span>}
          </FormRow>
          <FormRow label="중분류" required style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect, ...errS("mid") }} value={form.mid} onChange={e => { set("mid", e.target.value); set("small", ""); }}>
              <option value="">선택하세요</option>
              {midOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </RoSelect>
            {errors.mid && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.mid}</span>}
          </FormRow>
          <FormRow label="소분류" required style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect, ...errS("small") }} value={form.small} onChange={e => set("small", e.target.value)}>
              <option value="">선택하세요</option>
              {(smallByMid[form.mid] || []).map(s => <option key={s} value={s}>{s}</option>)}
            </RoSelect>
            {errors.small && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.small}</span>}
          </FormRow>
        </div>

        {/* 3단: 관리주체, 운영/개발구분, 도입일 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="관리주체" style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect }} value={form.mgmtOrg} onChange={e => set("mgmtOrg", e.target.value)}>
              <option value="">선택하세요</option>
              {mgmtOrgOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
          <FormRow label="운영/개발 구분" style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect }} value={form.operType} onChange={e => set("operType", e.target.value)}>
              <option value="">선택하세요</option>
              {operTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
          <FormRow label="도입일" style={{ flex: 1 }}>
            <DatePicker value={form.importDt} onChange={v => set("importDt", v)} readOnly={readOnly} />
          </FormRow>
        </div>

        {/* 3단: 가상화 여부, 공란, 공란 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="가상화 여부" style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect }} value={form.virtualYn} onChange={e => set("virtualYn", e.target.value)}>
              <option value="N">No</option><option value="Y">Yes</option>
            </RoSelect>
          </FormRow>
          <div style={{ flex: 1 }} />
          <div style={{ flex: 1 }} />
        </div>
      </div>

      {/* ── 용도 정보 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="용도 정보" />}

        {/* 3단: 사용용도, 최초 사용용도, 이전 사용용도 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="사용용도" style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect, ...(readOnly ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", appearance: "none", backgroundImage: "none", cursor: "default" } : {}) }} value={form.usage} onChange={e => set("usage", e.target.value)}>
              <option value="">선택</option>
              {["운영","개발","테스트","백업","DR","대기","기타"].map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
          <FormRow label="최초 사용용도" style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect, ...(readOnly ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", appearance: "none", backgroundImage: "none", cursor: "default" } : {}) }} value={form.firstUsage} onChange={e => set("firstUsage", e.target.value)}>
              <option value="">선택</option>
              {["운영","개발","테스트","백업","DR","대기","기타"].map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
          <FormRow label="이전 사용용도" style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect, ...(readOnly ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", appearance: "none", backgroundImage: "none", cursor: "default" } : {}) }} value={form.prevUsage} onChange={e => set("prevUsage", e.target.value)}>
              <option value="">선택</option>
              {["운영","개발","테스트","백업","DR","대기","기타"].map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
        </div>
        <FormRow label="상세용도">
          <FTextarea style={{ ...(readOnly ? { ...roStyle, resize: "none" } : {}) }} value={form.detailUsage} onChange={e => set("detailUsage", e.target.value)} placeholder="상세용도를 입력하세요" readOnly={readOnly} maxLength={1000} />
        </FormRow>
      </div>

      {/* ── 네트워크 정보 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="네트워크 정보" />}

        {/* 3단: 장비 IP, 서비스 IP, 포트 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="장비 IP" required={["서버","네트워크","보안","WEB","DBMS","WAS"].includes(form.mid)} style={{ flex: 1 }}>
            <FInput style={{ ...roStyle, ...errS("ip") }} value={form.ip} onChange={e => set("ip", e.target.value)} placeholder="192.168.0.1" readOnly={readOnly} maxLength={45} />
            {errors.ip && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.ip}</span>}
          </FormRow>
          <FormRow label="서비스 IP" style={{ flex: 1 }}>
            <FInput style={{ ...roStyle }} value={form.serviceIp} onChange={e => set("serviceIp", e.target.value)} placeholder="10.0.0.1" readOnly={readOnly} maxLength={45} />
          </FormRow>
          <FormRow label="포트" required={["WEB","DBMS","WAS"].includes(form.mid)} style={{ flex: 1 }}>
            <FInput style={{ ...roStyle, ...errS("port") }} value={form.port} onChange={e => set("port", e.target.value.replace(/[^0-9]/g, ""))} placeholder="8080" readOnly={readOnly} maxLength={5} />
            {errors.port && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.port}</span>}
          </FormRow>
        </div>
        {readOnly && form.ip && (
          <div style={{ marginBottom: 10, padding: "8px 12px", background: "#F9FAFC", borderRadius: 6, fontSize: 12, color: C.txS }}>
            <span style={{ fontWeight: 600 }}>접속 IP 이력: </span>
            <span>2026-02-01 {form.ip} → 2026-01-15 10.0.0.99 → 2025-12-01 172.16.0.50</span>
          </div>
        )}

        {/* 서비스 URL — 복수 등록 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ ...LABEL_STYLE }}>서비스 URL{form.mid === "WAS" && !readOnly && <span style={{ color: C.red, marginLeft: 2 }}>*</span>}</label>
            {!readOnly && (
              <button onClick={() => set("serviceUrls", [...form.serviceUrls, { type: "https://", value: "" }])}
                style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 8px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 4, color: C.pri, background: C.priL, cursor: "pointer" }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> 추가
              </button>
            )}
          </div>
          {errors.serviceUrl && <span style={{ fontSize: 12, color: C.red, marginBottom: 4, display: "block" }}>{errors.serviceUrl}</span>}
          {form.serviceUrls.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <FInput style={{ width: "100%", marginBottom: 0, paddingRight: (!readOnly && idx > 0) ? 30 : 8, ...(readOnly ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none" } : {}) }}
                  value={item.value}
                  onChange={e => { const arr = [...form.serviceUrls]; arr[idx] = { ...arr[idx], value: e.target.value }; set("serviceUrls", arr); }}
                  placeholder="example.com" readOnly={readOnly} maxLength={255} />
                {!readOnly && idx > 0 && (
                  <span onClick={() => set("serviceUrls", form.serviceUrls.filter((_, i) => i !== idx))}
                    style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 15, color: C.txL, lineHeight: 1 }}>×</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 설치경로 — 복수 등록 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ ...LABEL_STYLE }}>설치경로{["WEB","DBMS","WAS"].includes(form.mid) && !readOnly && <span style={{ color: C.red, marginLeft: 2 }}>*</span>}</label>
            {!readOnly && (
              <button onClick={() => set("installPaths", [...form.installPaths, { type: "/opt", value: "" }])}
                style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 8px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 4, color: C.pri, background: C.priL, cursor: "pointer" }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> 추가
              </button>
            )}
          </div>
          {errors.installPath && <span style={{ fontSize: 12, color: C.red, marginBottom: 4, display: "block" }}>{errors.installPath}</span>}
          {form.installPaths.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <FInput style={{ width: "100%", marginBottom: 0, paddingRight: (!readOnly && idx > 0) ? 30 : 8, ...(readOnly ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none" } : {}) }}
                  value={item.value}
                  onChange={e => { const arr = [...form.installPaths]; arr[idx] = { ...arr[idx], value: e.target.value }; set("installPaths", arr); }}
                  placeholder="/app" readOnly={readOnly} maxLength={255} />
                {!readOnly && idx > 0 && (
                  <span onClick={() => set("installPaths", form.installPaths.filter((_, i) => i !== idx))}
                    style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 15, color: C.txL, lineHeight: 1 }}>×</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 로그경로 — 복수 등록 */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ ...LABEL_STYLE }}>로그경로 및 파일{["WEB","DBMS","WAS"].includes(form.mid) && !readOnly && <span style={{ color: C.red, marginLeft: 2 }}>*</span>}</label>
            {!readOnly && (
              <button onClick={() => set("logPaths", [...form.logPaths, { type: "애플리케이션로그", value: "" }])}
                style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 8px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 4, color: C.pri, background: C.priL, cursor: "pointer" }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> 추가
              </button>
            )}
          </div>
          {errors.logPath && <span style={{ fontSize: 12, color: C.red, marginBottom: 4, display: "block" }}>{errors.logPath}</span>}
          {form.logPaths.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <select value={item.type}
                onChange={e => { const arr = [...form.logPaths]; arr[idx] = { ...arr[idx], type: e.target.value }; set("logPaths", arr); }}
                disabled={readOnly}
                style={{ flexShrink: 0, width: 150, height: 34, border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 12, color: C.txt, background: readOnly ? "#F9FAFC" : "#fff", padding: "0 6px", cursor: readOnly ? "default" : "pointer", fontFamily: "inherit", appearance: readOnly ? "none" : undefined }}>
                {["애플리케이션로그","접근로그","에러로그","시스템로그","기타"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <div style={{ flex: 1, position: "relative" }}>
                <FInput style={{ width: "100%", marginBottom: 0, paddingRight: (!readOnly && idx > 0) ? 30 : 8, ...(readOnly ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none" } : {}) }}
                  value={item.value}
                  onChange={e => { const arr = [...form.logPaths]; arr[idx] = { ...arr[idx], value: e.target.value }; set("logPaths", arr); }}
                  placeholder="/var/log/app.log" readOnly={readOnly} maxLength={255} />
                {!readOnly && idx > 0 && (
                  <span onClick={() => set("logPaths", form.logPaths.filter((_, i) => i !== idx))}
                    style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 15, color: C.txL, lineHeight: 1 }}>×</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 하드웨어/시스템 정보 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="하드웨어/시스템 정보" />}

        {/* 3단: OS, 버전, 공백 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="OS" required={form.mid === "서버"} style={{ flex: 1 }}>
            <FInput style={{ ...roStyle, ...errS("os") }} value={form.os} onChange={e => set("os", e.target.value)} placeholder="CentOS 7" readOnly={readOnly} maxLength={100} />
            {errors.os && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.os}</span>}
          </FormRow>
          <FormRow label="버전" required={["서버","네트워크","보안","WEB","DBMS","WAS"].includes(form.mid)} style={{ flex: 1 }}>
            <FInput style={{ ...roStyle, ...errS("version") }} value={form.version} onChange={e => set("version", e.target.value)} placeholder="예) 2.4.51" readOnly={readOnly} maxLength={50} />
            {errors.version && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.version}</span>}
          </FormRow>
          <div style={{ flex: 1 }} />
        </div>

        {/* 3단: 제조사, 모델명, 시리얼넘버 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="제조사" style={{ flex: 1 }}>
            <FInput style={{ ...roStyle }} value={form.manufacturer} onChange={e => set("manufacturer", e.target.value)} placeholder="제조사" readOnly={readOnly} maxLength={100} />
          </FormRow>
          <FormRow label="모델명" style={{ flex: 1 }}>
            <FInput style={{ ...roStyle }} value={form.model} onChange={e => set("model", e.target.value)} placeholder="모델명" readOnly={readOnly} maxLength={100} />
          </FormRow>
          <FormRow label="시리얼넘버" style={{ flex: 1 }}>
            <FInput style={{ ...roStyle }} value={form.serial} onChange={e => set("serial", e.target.value)} placeholder="SN-XXXXXX" readOnly={readOnly} maxLength={50} />
          </FormRow>
        </div>

        {/* 3단: 메모리 용량, 로컬 디스크 용량, 공백 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="메모리 용량(GB)" style={{ flex: 1 }}>
            <FInput style={{ ...roStyle }} value={form.memory} onChange={e => set("memory", e.target.value.replace(/[^0-9]/g, ""))} placeholder="64" readOnly={readOnly} maxLength={5} />
          </FormRow>
          <FormRow label="로컬 디스크 용량(GB)" style={{ flex: 1 }}>
            <FInput style={{ ...roStyle }} value={form.localDisk} onChange={e => set("localDisk", e.target.value.replace(/[^0-9]/g, ""))} placeholder="500" readOnly={readOnly} maxLength={6} />
          </FormRow>
          <div style={{ flex: 1 }} />
        </div>

        {/* 3단: CPU 모델, CPU 클럭 속도, CPU 코어수 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="CPU 모델" style={{ flex: 1 }}>
            <FInput style={{ ...roStyle }} value={form.cpuModel} onChange={e => set("cpuModel", e.target.value)} placeholder="Intel Xeon E5-2680" readOnly={readOnly} maxLength={100} />
          </FormRow>
          <FormRow label="CPU 클럭 속도(GHz)" style={{ flex: 1 }}>
            <FInput style={{ ...roStyle }} value={form.cpuClock} onChange={e => set("cpuClock", e.target.value.replace(/[^0-9.]/g, ""))} placeholder="2.40" readOnly={readOnly} maxLength={5} />
          </FormRow>
          <FormRow label="CPU 코어수" style={{ flex: 1 }}>
            <FInput style={{ ...roStyle }} value={form.cpuCore} onChange={e => set("cpuCore", e.target.value.replace(/[^0-9]/g, ""))} placeholder="16" readOnly={readOnly} maxLength={3} />
          </FormRow>
        </div>

        {/* 3단: CPU 아키텍처, 공란, 공란 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="CPU 아키텍처" style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect }} value={form.cpuArch} onChange={e => set("cpuArch", e.target.value)}>
              <option value="">선택하세요</option>
              {cpuArchOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
          <div style={{ flex: 1 }} />
          <div style={{ flex: 1 }} />
        </div>
      </div>

      {/* ── SNMP 정보 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="SNMP 정보" />}

        {/* 3단: SNMP 계정정보, SNMP 버전, 공란 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="SNMP 계정정보" required={["네트워크","보안","DBMS"].includes(form.mid)} style={{ flex: 1 }}>
            <FInput style={{ ...roStyle, ...errS("snmpAccount") }} value={form.snmpAccount} onChange={e => set("snmpAccount", e.target.value)} placeholder="계정정보" readOnly={readOnly} maxLength={50} />
            {errors.snmpAccount && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.snmpAccount}</span>}
          </FormRow>
          <FormRow label="SNMP 버전" required={["네트워크","보안"].includes(form.mid)} style={{ flex: 1 }}>
            <RoSelect readOnly={readOnly} style={{ ...fSelect, ...errS("snmpVersion") }} value={form.snmpVersion} onChange={e => set("snmpVersion", e.target.value)}>
              <option value="">선택하세요</option>
              {snmpVersionOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
            {errors.snmpVersion && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.snmpVersion}</span>}
          </FormRow>
          <div style={{ flex: 1 }} />
        </div>
        <FormRow label="SNMP 인증정보">
          <FTextarea style={{ ...(readOnly ? { ...roStyle, resize: "none" } : {}) }} value={form.snmpAuth} onChange={e => set("snmpAuth", e.target.value)} placeholder="SNMP 인증정보를 입력하세요" readOnly={readOnly} maxLength={500} />
        </FormRow>
      </div>

      {/* ── 비고 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="기타" />}
        <FormRow label="비고">
          <FTextarea style={{ ...(readOnly ? { ...roStyle, resize: "none" } : {}) }} value={form.memo} onChange={e => set("memo", e.target.value)} placeholder="기타 메모 정보" readOnly={readOnly} maxLength={500} />
        </FormRow>
      </div>

      {/* ── 점검자 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="점검자" />}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {form.inspectors.map(uid => {
            const u = USERS.find(x => x.userId === uid);
            return u ? (
              <span key={uid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 14, background: C.priL, color: C.priD, fontSize: 12, fontWeight: 500 }}>
                {u.userNm} ({u.userRole})
                {!readOnly && <span onClick={() => set("inspectors", form.inspectors.filter(m => m !== uid))} style={{ cursor: "pointer", marginLeft: 2, fontSize: 15, lineHeight: 1 }}>×</span>}
              </span>
            ) : null;
          })}
          {form.inspectors.length === 0 && <span style={{ fontSize: 12, color: C.txL }}>점검자가 없습니다.</span>}
        </div>
        {!readOnly && (() => {
          const candidates = USERS.filter(u => u.useYn === "Y").filter(u => {
            if (inspSearch) {
              const q = inspSearch.toLowerCase();
              return u.userNm.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q) || u.userRole.toLowerCase().includes(q);
            }
            return true;
          });
          return <div style={{ position: "relative" }}>
            <div style={{ position: "relative" }}>
              <FInput
                style={{ paddingLeft: 30, fontSize: 14, maxWidth: 340 }}
                placeholder="이름, 아이디, 역할로 검색..."
                value={inspSearch}
                onChange={e => { setInspSearch(e.target.value); setInspOpen(true); }}
                onFocus={() => setInspOpen(true)}
              />
              <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Ic n="search" s={14} c={C.txL} /></span>
            </div>
            {inspOpen && <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, maxWidth: 340, marginTop: 4, zIndex: 50,
              background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,.12)", maxHeight: 220, overflowY: "auto"
            }}>
              {candidates.length === 0 && <div style={{ padding: "12px", textAlign: "center", fontSize: 12, color: C.txL }}>
                {inspSearch ? `"${inspSearch}" 검색 결과가 없습니다.` : "추가 가능한 사용자가 없습니다."}
              </div>}
              {candidates.map(u => {
                const checked = form.inspectors.includes(u.userId);
                return <div
                  key={u.userId}
                  onClick={() => {
                    if (checked) set("inspectors", form.inspectors.filter(x => x !== u.userId));
                    else set("inspectors", [...form.inspectors, u.userId]);
                  }}
                  style={{
                    padding: "8px 12px", cursor: "pointer", borderBottom: `1px solid ${C.brd}`,
                    display: "flex", alignItems: "center", gap: 8, fontSize: 12,
                    background: checked ? C.priL : ""
                  }}
                  onMouseEnter={e => { if (!checked) e.currentTarget.style.background = "#F9FAFC"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = checked ? C.priL : ""; }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: 3, border: `2px solid ${checked ? C.pri : C.brd}`,
                    background: checked ? C.pri : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    {checked && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontWeight: 500, flex: 1 }}>{u.userNm}</span>
                  <span style={{ fontSize: 12, color: C.txL }}>{u.userId}</span>
                  <span style={{ fontSize: 12, color: C.txS, background: "#F9FAFC", padding: "1px 6px", borderRadius: 8 }}>{u.userRole}</span>
                </div>;
              })}
              {candidates.length > 0 && <div style={{ padding: "6px 12px", fontSize: 12, color: C.txL, textAlign: "center", background: "#F9FAFC", display: "flex", justifyContent: "space-between" }}>
                <span>{form.inspectors.length}명 선택됨</span>
                <span onClick={() => setInspOpen(false)} style={{ cursor: "pointer", color: C.pri, fontWeight: 600 }}>닫기</span>
              </div>}
            </div>}
            {inspOpen && <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setInspOpen(false)} />}
          </div>;
        })()}
      </div>

      {/* ── 점검표 연결 ── */}
      <div style={{ marginBottom: 22 }}>
        <SecTitle label="점검표 연결" />
        {(() => {
          const selCL = form.clId === "none"
            ? null
            : form.clId
              ? CL_INIT.find(c => String(c.id) === String(form.clId))
              : CL_INIT.find(c => c.sub === form.mid);
          if (readOnly) {
            return selCL
              ? <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 12px",
                  borderRadius:6, background:"#dcfce7", border:"1px solid #bbf7d0" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize:12, fontWeight:600, color:"#166534" }}>{selCL.nm}</span>
                  <span style={{ fontSize:12, color:"#15803d" }}>({selCL.sub} · {selCL.items}항목)</span>
                </div>
              : <span style={{ fontSize:12, color:C.txL }}>연결된 점검표가 없습니다.</span>;
          }

          // 검색 + 필터
          const q   = clSearch.trim().toLowerCase();
          const visCL = CL_INIT.filter(c =>
            (!q || c.nm.toLowerCase().includes(q) || (c.sub||"").toLowerCase().includes(q) || c.type.toLowerCase().includes(q))
          ).sort((a,b) => {
            // 권장(mid 일치) 우선, 그 다음 이름순
            const aM = a.sub === form.mid ? 1 : 0;
            const bM = b.sub === form.mid ? 1 : 0;
            return bM - aM || a.nm.localeCompare(b.nm);
          });

          return (
            <>
              <div style={{ fontSize:12, color:C.txL, marginBottom:8 }}>
                자원에 연결할 점검표를 검색하여 선택하세요.
                {form.mid && CL_INIT.some(c=>c.sub===form.mid) &&
                  <span style={{ color:C.pri, fontWeight:600 }}> ({form.mid} 권장 점검표 있음)</span>}
              </div>

              {/* 선택된 점검표 미리보기 */}
              {selCL && (
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px",
                  borderRadius:8, border:`1.5px solid ${C.pri}`, background:C.priL+"44", marginBottom:8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:C.pri }}>{selCL.nm}</div>
                    <div style={{ fontSize:12, color:C.txL, marginTop:1 }}>{selCL.sub||"공통"} · {selCL.items}항목 · {selCL.type}</div>
                  </div>
                  <span onClick={()=>{ set("clId","none"); }} style={{ cursor:"pointer", color:C.txL, fontSize:18, lineHeight:1 }}>×</span>
                </div>
              )}

              {/* 검색 입력 */}
              <div style={{ position:"relative", marginBottom:8 }}>
                <FInput
                  value={clSearch} onChange={e=>setClSearch(e.target.value)}
                  placeholder="점검표명, 유형, 분류로 검색..."
                  style={{ width:"100%", padding:"6px 28px 6px 28px", fontSize:12,
                    border:`1px solid ${C.brd}`, borderRadius:6, outline:"none", boxSizing:"border-box" }}
                />
                <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                  <Ic n="search" s={13} c={C.txL} />
                </span>
                {clSearch && (
                  <span onClick={()=>setClSearch("")}
                    style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)",
                      cursor:"pointer", fontSize:15, color:C.txL, lineHeight:1 }}>×</span>
                )}
              </div>

              {/* 점검표 목록 */}
              <div style={{ border:`1px solid ${C.brd}`, borderRadius:8, overflow:"hidden", maxHeight:240, overflowY:"auto" }}>
                {/* 연결 안 함 옵션 */}
                <div onClick={()=>set("clId","none")}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px",
                    borderBottom:`1px solid ${C.brd}`, cursor:"pointer", transition:"background .12s",
                    background: form.clId==="none" ? C.priL+"33" : "#fff",
                    borderLeft: form.clId==="none" ? `3px solid ${C.pri}` : "3px solid transparent" }}
                  onMouseEnter={e=>{ if(form.clId!=="none") e.currentTarget.style.background="#F5F7FF"; }}
                  onMouseLeave={e=>{ if(form.clId!=="none") e.currentTarget.style.background="#fff"; }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", flexShrink:0, transition:"all .15s",
                    border:`2px solid ${form.clId==="none"?C.pri:C.brd}`, background:form.clId==="none"?C.pri:"#fff",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {form.clId==="none" && <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }}/>}
                  </div>
                  <span style={{ fontSize:12, color: form.clId==="none"?C.pri:C.txL, fontWeight: form.clId==="none"?600:400 }}>연결 안 함</span>
                </div>
                {/* 검색 결과 */}
                {visCL.length === 0
                  ? <div style={{ padding:"20px 0", textAlign:"center", fontSize:12, color:C.txL }}>
                      검색 결과가 없습니다.
                    </div>
                  : visCL.map(c => {
                    const isSel   = String(form.clId) === String(c.id);
                    const isMatch = c.sub === form.mid;
                    return (
                      <div key={c.id} onClick={()=>set("clId", String(c.id))}
                        style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px",
                          borderBottom:`1px solid ${C.brd}`, cursor:"pointer", transition:"background .12s",
                          background: isSel ? C.priL+"33" : "#fff",
                          borderLeft: isSel ? `3px solid ${C.pri}` : "3px solid transparent" }}
                        onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background="#F5F7FF"; }}
                        onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background="#fff"; }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", flexShrink:0, transition:"all .15s",
                          border:`2px solid ${isSel?C.pri:C.brd}`, background:isSel?C.pri:"#fff",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {isSel && <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }}/>}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:600, color: isSel?C.pri:C.txt, display:"flex", alignItems:"center", gap:6 }}>
                            {c.nm}
                            {isMatch && <span style={{ fontSize:12, fontWeight:700, padding:"1px 6px",
                              borderRadius:8, background:"#dbeafe", color:"#1d4ed8", flexShrink:0 }}>권장</span>}
                          </div>
                          <div style={{ fontSize:12, color:C.txL, marginTop:1 }}>{c.sub||"공통"} · {c.items}항목 · {c.type}</div>
                        </div>
                        {isSel && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    );
                  })
                }
              </div>
            </>
          );
        })()}
      </div>

      </div>{/* /바디 */}

      {/* 푸터 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        {/* 삭제 불가 안내 메시지 */}
        {!editing && isEdit && !canDelete && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
            padding: "8px 12px", borderRadius: 6, background: "#FFF7ED", border: "1px solid #FED7AA" }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
            </svg>
            <span style={{ color: "#9A3412", fontSize: 12 }}>
              연결된 점검표가 있어 삭제할 수 없습니다. 점검표 연결을 해제한 후 삭제하세요.
            </span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          {(editing || !isEdit) ? (
            <>
              <Btn onClick={() => { if (isEdit) { setEditing(false); } else handleClose(); }}>취소</Btn>
              <div style={{ flex: 1 }} />
              <Btn primary onClick={handleSubmit}>{isEdit ? "저장" : "등록"}</Btn>
            </>
          ) : (
            <>
              <Btn onClick={handleClose}>닫기</Btn>
              <div style={{ flex: 1 }} />
              <Btn danger disabled={!canDelete} onClick={() => canDelete && setDeleteConfirm(true)} style={{ marginRight: 8 }}>삭제</Btn>
              <Btn success onClick={() => setEditing(true)}>수정</Btn>
            </>
          )}
        </div>
      </div>
    </SidePanel>
    <ConfirmModal open={deleteConfirm} title="자원 삭제"
      msg={<><strong>{resource?.nm}</strong> 자원이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</>}
      okLabel="삭제" onOk={() => { onDelete?.(resource); setDeleteConfirm(false); forceClose(); }} onCancel={() => setDeleteConfirm(false)} />
    </>
  );
};
const MM = [
  { k: "d", l: "대시보드", i: "dash", p: "md" },
  { k: "r", l: "자원관리", i: "db", p: "mr" },
  { k: "i", l: "점검현황", i: "search", c: [
    { k: "is", l: "점검현황", p: "mis" },
    { k: "ic", l: "점검스케줄", p: "mic" },
    { k: "ip", l: "특별점검", p: "mip" },
  ]},
  { k: "rp", l: "보고현황", i: "file", c: [
    { k: "ir", l: "점검보고서", p: "mir" },
    { k: "id", l: "보고이력", p: "mid" },
  ]},
  { k: "b", l: "게시판", i: "bell", p: "mbn" },
  { k: "s", l: "환경설정", i: "gear", c: [
    { k: "sg1", l: "일반설정", group: true, c: [
      { k: "sp", l: "시스템 프로필", p: "msp" },
      { k: "sc", l: "공통코드", p: "msc" },
      { k: "sk", l: "카테고리 관리", p: "msk" },
      { k: "slm", l: "로그인 안내메시지", p: "mslm" },
    ]},
    { k: "sg2", l: "라이선스", group: true, c: [
      { k: "sl", l: "라이선스", p: "msl" },
    ]},
    { k: "sg3", l: "사용자 관리", group: true, c: [
      { k: "su", l: "사용자", p: "msu" },
    ]},
    { k: "sg4", l: "점검표", group: true, c: [
      { k: "st", l: "점검표", p: "mst" },
      { k: "sv", l: "검증코드", p: "msv" },
    ]},
    { k: "sg5", l: "로그정보", group: true, c: [
      { k: "la", l: "접속로그", p: "mla" },
      { k: "le", l: "에러로그", p: "mle" },
    ]},
    { k: "sg6", l: "보안 및 개발", group: true, c: [,
      { k: "sag", l: "AGENT 권한관리", p: "msag" },
      { k: "sapi", l: "API 관리", p: "msapi" },
    ]},
    { k: "sg7", l: "시스템정보", group: true, c: [
      { k: "si", l: "시스템정보", p: "msi" },
    ]},
  ]},
];
const SM = [
  { k: "sd", l: "대시보드", i: "dash", p: "sd" },
  { k: "sl", l: "일상점검", i: "check", p: "sll" },
  { k: "ss", l: "특별점검", i: "alert", p: "ssl" },
  { k: "sb", l: "게시판", i: "bell", p: "sbn" },
];

/* ── Sidebar (1Depth 아이콘바 + 2/3Depth 텍스트 패널) ── */
const Side = ({ menus, cur, nav, site, col, toggle, bannerH = 0 }) => {
  const [selMenu, setSelMenu] = useState(null);
  const [openGroups, setOpenGroups] = useState({});
  const st = sideTheme[site] || sideTheme.m;

  /* 현재 페이지가 속한 1depth 자동 추적 */
  const findActive1 = () => {
    for (const m of menus) {
      if (m.p === cur) return m.k;
      if (m.c) {
        for (const ch of m.c) {
          if (ch.p === cur) return m.k;
          if (ch.group && ch.c && ch.c.some(g => g.p === cur)) return m.k;
        }
      }
    }
    return null;
  };
  const curKey = findActive1();

  /* 현재 페이지가 속한 그룹 자동 추적 */
  const findActiveGroup = (menu) => {
    if (!menu?.c) return null;
    for (const ch of menu.c) {
      if (ch.group && ch.c && ch.c.some(g => g.p === cur)) return ch.k;
    }
    return null;
  };

  /* 1depth 클릭 */
  const click1 = (m) => {
    if (m.c) {
      setSelMenu(m.k);
      /* 첫 번째 leaf 메뉴로 이동 */
      const firstLeaf = (items) => {
        for (const it of items) {
          if (it.p) return it.p;
          if (it.c) { const r = firstLeaf(it.c); if (r) return r; }
        }
        return null;
      };
      const fp = firstLeaf(m.c);
      if (fp) nav(fp);
    } else {
      nav(m.p);
      setSelMenu(null);
    }
  };

  /* 그룹 토글 */
  const toggleGroup = (gk) => {
    setOpenGroups(prev => ({ ...prev, [gk]: !prev[gk] }));
  };

  /* 2depth 표시 대상 결정 */
  const shown = selMenu || curKey;
  const shownMenu = menus.find(m => m.k === shown);
  const depth2 = shownMenu?.c || [];
  const show2 = depth2.length > 0;
  const isGrouped = depth2.some(ch => ch.group);

  /* 그룹 열림 상태 (활성 그룹은 기본 열림) */
  const activeGroup = findActiveGroup(shownMenu);
  const isGroupOpen = (gk) => {
    if (gk in openGroups) return openGroups[gk];
    return true; // 모든 그룹 기본 펼침
  };

  /* 모든 leaf 메뉴의 p 값 수집 (active1 판별용) */
  const allLeafs = (items) => {
    const ps = [];
    for (const it of items || []) {
      if (it.p) ps.push(it.p);
      if (it.c) ps.push(...allLeafs(it.c));
    }
    return ps;
  };

  return (
    <div style={{ display: "flex", flexShrink: 0, height: `calc(100vh - ${67 + bannerH}px)`, position: "sticky", top: 67 + bannerH }}>
      {/* ── 1Depth 아이콘바 (64px, 파란 배경 #005CB9) ── */}
      <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, width: 64, background: C.bg, position: "relative" }}>
        {/* 아이콘 리스트 (border-radius 상단 우측 라운드) */}
        <div style={{ flex: 1, width: 64, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 4, borderRadius: "0 24px 0 0", background: C.brand }}>
          {menus.map(m => {
            const isA = m.k === curKey;
            const isOpen = shown === m.k;
            return <div
              key={m.k}
              onClick={() => click1(m)}
              style={{
                width: 56, padding: "6px 0", borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                cursor: "pointer", transition: "all .3s",
                background: isOpen ? "rgba(17,17,17,0.3)" : isA ? "rgba(17,17,17,0.2)" : "transparent",
              }}
              onMouseEnter={e => { if (!isA && !isOpen) e.currentTarget.style.background = "rgba(17,17,17,0.2)"; }}
              onMouseLeave={e => { if (!isA && !isOpen) e.currentTarget.style.background = "transparent"; }}
            >
              <Ic n={m.i} s={18} c={isA || isOpen ? "#fff" : "rgba(255,255,255,0.55)"} />
              <span style={{ fontSize: 9, fontWeight: 500, color: isA || isOpen ? "#fff" : "rgba(255,255,255,0.55)", lineHeight: 1.2, whiteSpace: "nowrap", letterSpacing: "-0.3px" }}>{m.l}</span>
            </div>;
          })}
        </div>
      </div>

      {/* ── 2/3Depth 텍스트 패널 (190px) ── */}
      <div style={{ width: show2 ? 190 : 0, background: C.bg, display: "flex", flexDirection: "column", overflow: "hidden", transition: "width .25s ease", flexShrink: 0 }}>
        <div style={{ width: 190, opacity: show2 ? 1 : 0, transition: "opacity .2s ease .05s", display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>
        {/* 메뉴/즐겨찾기 탭 - 숨김 */}
      {/* ── 2/3Depth 텍스트 패널 메뉴 리스트 ── */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {!isGrouped && depth2.map(ch => {
            const isA = cur === ch.p;
            return <div
              key={ch.k}
              onClick={() => nav(ch.p)}
              style={{
                padding: "4px 8px", cursor: "pointer", marginBottom: 4, borderRadius: 4,
                fontSize: 15, fontWeight: 500,
                background: isA ? C.priL : "", color: isA ? C.sec : C.txt,
                display: "flex", alignItems: "center", gap: 4,
                minHeight: 36, transition: "all .3s"
              }}
              onMouseEnter={e => { if (!isA) e.currentTarget.style.background = C.priL; }}
              onMouseLeave={e => { if (!isA) e.currentTarget.style.background = ""; }}
            >
              <span style={{ color: "#BBBBBB", fontSize: 12, marginRight: 2 }}>└</span>{ch.l}
            </div>;
          })}

          {isGrouped && depth2.map(grp => {
            if (!grp.group) return null;
            const open = isGroupOpen(grp.k);
            const hasActive = grp.c && grp.c.some(g => g.p === cur);
            const isSingle = grp.c && grp.c.length === 1;
            return <div key={grp.k}>
              {/* 2depth 그룹 헤더 */}
              <div
                onClick={() => isSingle ? nav(grp.c[0].p) : toggleGroup(grp.k)}
                style={{
                  padding: "4px 8px", cursor: "pointer", borderRadius: 4, marginBottom: 4,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  fontSize: 15, fontWeight: 500, minHeight: 36,
                  color: hasActive || (isSingle && cur === grp.c[0].p) ? C.sec : C.txt,
                  background: isSingle && cur === grp.c[0].p ? C.priL : "",
                  transition: "all .3s", userSelect: "none"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.priL; }}
                onMouseLeave={e => { e.currentTarget.style.background = isSingle && cur === grp.c[0].p ? C.priL : ""; }}
              >
                <span>{grp.l}</span>
                {!isSingle && <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, transition: "all .3s", transform: open ? "rotate(90deg)" : "none" }}>
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M1.5 1l5 5-5 5" stroke={hasActive ? C.sec : "#333"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>}
              </div>
              {/* 3depth 아이템 */}
              {!isSingle && open && grp.c && grp.c.map(item => {
                const isA = cur === item.p;
                return <div
                  key={item.k}
                  onClick={() => nav(item.p)}
                  style={{
                    padding: "4px 8px 4px 20px", cursor: "pointer", borderRadius: 4, marginBottom: 4,
                    fontSize: 15, fontWeight: isA ? 500 : 400, minHeight: 36,
                    background: isA ? C.priL : "", color: isA ? C.sec : C.txS,
                    display: "flex", alignItems: "center", gap: 4,
                    transition: "all .3s"
                  }}
                  onMouseEnter={e => { if (!isA) e.currentTarget.style.background = C.priL; }}
                  onMouseLeave={e => { if (!isA) e.currentTarget.style.background = ""; }}
                >
                  <span style={{ color: "#BBBBBB", fontSize: 12, marginRight: 2 }}>└</span>{item.l}
                </div>;
              })}
            </div>;
          })}
        </nav>
      </div></div>
    </div>
  );
};

/* ── 공지배너 ── */
const NoticeBanner = ({ item, onClose, onNav }) => {
  if (!item) return null;
  const bg  = "#F2F3F5";
  const txt = "#333333";
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 300,
      background: bg, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "9px 20px", animation: "modalIn .15s ease", boxSizing: "border-box" }}>
      <div onClick={onNav} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0, cursor: "pointer" }}>
        <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 3,
          background: "rgba(0,0,0,.08)", color: txt, whiteSpace: "nowrap", flexShrink: 0 }}>시스템공지</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: txt, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</span>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4,
          background: "rgba(0,0,0,.1)", color: txt, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0 }}>자세히 보기 →</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0, marginLeft: 12 }}>
        <span onClick={(e) => { e.stopPropagation(); onClose(false); }}
          style={{ fontSize: 12, color: txt, opacity: .7, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none" }}>
          오늘 하루 보이지 않음
        </span>
        <span onClick={(e) => { e.stopPropagation(); onClose(true); }}
          style={{ fontSize: 18, color: txt, opacity: .6, cursor: "pointer", marginLeft: 0, flexShrink: 0, userSelect: "none" }}>×</span>
      </div>
    </div>
  );
};

/* ── Header ── */
const Hdr = ({ user, site, sw, logout, siteName, onPwChange, bannerH = 0 }) => {
  /* ── 세션 타이머 (30분 = 1800초) ── */
  const SESSION_SEC = 30 * 60;
  const [remain, setRemain] = useState(SESSION_SEC);
  const [expired, setExpired] = useState(false);
  const timerRef = React.useRef(null);

  const startTimer = (sec) => {
    setRemain(sec);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemain(p => {
        if (p <= 1) {
          clearInterval(timerRef.current);
          setExpired(true);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
  };

  useEffect(() => { startTimer(SESSION_SEC); return () => clearInterval(timerRef.current); }, []);

  const extendSession = async () => {
    setExpired(false); startTimer(SESSION_SEC);
  };
  const handleExpiredOk = () => { setExpired(false); logout(); };

  const mm = String(Math.floor(remain / 60)).padStart(2, "0");
  const ss = String(remain % 60).padStart(2, "0");
  const isWarning = remain <= 5 * 60; // 5분 이하 경고색

  return (
    <>
    <div style={{ background: C.brand, position: "fixed", top: bannerH, left: 0, width: "100%", zIndex: 200 }}>
    <div style={{ height: 67, background: C.bg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px 0 20px", fontSize: 12, flexShrink: 0, borderRadius: "0 0 0 20px" }}>
      {/* 좌측: 로고 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: C.brandG, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15 }}>C</div>
        <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>
          <span style={{ color: C.brand }}>COMPLY</span>SIGHT<span onClick={user?.userRole !== "사용자" ? sw : undefined}
            style={{ paddingLeft: 12, fontSize: 18, fontWeight: 600, color: C.brand, cursor: user?.userRole !== "사용자" ? "pointer" : "default", transition: "opacity .2s" }}
            onMouseEnter={e => { if (user?.userRole !== "사용자") e.currentTarget.style.opacity = "0.6"; }}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            title={user?.userRole !== "사용자" ? (site === "m" ? "Sentinel로 전환" : "Manager로 전환") : ""}>{siteName}</span>
        </span>
      </div>
      {/* 우측: GNB */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ color: C.txt, fontSize: 12 }}>고객행복센터</span>
        <div style={{ width: 1, height: 12, background: C.brdD }} />
        <span style={{ color: C.txt, fontSize: 12 }}>업무담당자 : <span style={{ fontWeight: 700 }}>{user?.userNm}</span>
          <span onClick={onPwChange} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: 4, verticalAlign: "middle", opacity: .5, transition: "opacity .2s" }} title="비밀번호 변경"
            onMouseEnter={e => e.currentTarget.style.opacity = "1"}
            onMouseLeave={e => e.currentTarget.style.opacity = ".5"}>
            <Ic n="gear" s={13} c={C.txS} />
          </span>
        </span>
        {/* 세션 타이머 */}
        <div style={{ display: "flex", alignItems: "center", gap: 6,
          background: isWarning ? "#FEF2F2" : "#edf0f6",
          borderRadius: 100, padding: "4px 10px", fontSize: 12,
          border: isWarning ? "1px solid #fca5a5" : "1px solid transparent",
          transition: "all .3s" }}>
          <Ic n="clock" s={12} c={isWarning ? "#ef4444" : C.txS} />
          <span style={{ color: isWarning ? "#ef4444" : C.txS, fontWeight: isWarning ? 700 : 400, fontVariantNumeric: "tabular-nums", minWidth: 34 }}>{mm}:{ss}</span>
          <span onClick={extendSession}
            style={{ color: isWarning ? "#ef4444" : C.accent, fontWeight: 600, cursor: "pointer",
              paddingLeft: 4, borderLeft: `1px solid ${isWarning ? "#fca5a5" : C.brdD}`, marginLeft: 2,
              transition: "opacity .2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            로그인연장
          </span>
        </div>

        <div onClick={logout} style={{ cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: `1px solid ${C.brd}` }} title="로그아웃"><Ic n="out" s={16} c={C.txS} /></div>
      </div>
    </div>
    </div>

    {/* ── 세션 만료 모달 ── */}
    {expired && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "36px 32px", width: 360, boxShadow: "0 20px 60px rgba(0,0,0,.25)", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="#ef4444"/>
            </svg>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.txH, marginBottom: 8 }}>세션이 만료되었습니다</div>
          <div style={{ fontSize: 12, color: C.txS, lineHeight: 1.6, marginBottom: 28 }}>
            장시간 미사용으로 로그인 세션이 만료되었습니다.<br/>보안을 위해 자동으로 로그아웃됩니다.
          </div>
          <Btn primary onClick={handleExpiredOk} style={{ width: "100%", justifyContent: "center" }}>확인 (로그인 화면으로)</Btn>
        </div>
      </div>
    )}
    </>
  );
};

/* ──── COMMON PANEL: 일상점검 보고 패널 ──── */
const DailyReportPanel = ({ open, onClose, item }) => {
  const [showPreview, setShowPreview] = useState(false);

  /* ── 점검 항목 (더미) ── */
  const inspItems = item ? [
    { id:1, nm:"CPU 사용률",       method:"자동", std:"< 80%",    val:"72%",      result:"정상",   errCode:null },
    { id:2, nm:"메모리 사용률",    method:"자동", std:"< 85%",    val:"68%",      result:"정상",   errCode:null },
    { id:3, nm:"디스크 사용률",    method:"자동", std:"< 90%",    val:"54%",      result:"정상",   errCode:null },
    { id:4, nm:"서비스 포트 확인", method:"자동", std:"OPEN",     val:"OPEN",     result:"정상",   errCode:null },
    { id:5, nm:"로그 에러 확인",   method:"자동", std:"0건",      val:"3건",      result:"비정상", errCode:"ERR-LOG-0023" },
    { id:6, nm:"보안패치 상태",    method:"자동", std:"최신",     val:"최신",     result:"정상",   errCode:null },
    { id:7, nm:"서버 외관 상태",   method:"육안", std:"이상없음", val:"이상없음", result:"정상",   errCode:null },
    { id:8, nm:"케이블 연결 상태", method:"육안", std:"정상연결", val:"정상연결", result:"정상",   errCode:null },
    { id:9, nm:"LED 표시등 확인",  method:"육안", std:"Green",    val:"Yellow",   result:"비정상", errCode:null },
  ] : [];

  const ERR_DETAIL_MAP = {
    "ERR-LOG-0023":  { code:"ERR-LOG-0023",   level:"ERROR",   msg:"Application exception: NullPointerException at line 342", cause:"로그 수집 중 애플리케이션 예외 발생", action:"해당 서비스 재시작 및 스택 트레이스 확인 필요" },
    "ERR-CPU-0011":  { code:"ERR-CPU-0011",   level:"WARNING", msg:"CPU usage exceeded threshold: 91.2% (threshold: 80%)",    cause:"배치 작업 집중으로 인한 CPU 부하 급증", action:"배치 스케줄 분산 또는 리소스 증설 검토" },
    "ERR-PORT-0004": { code:"ERR-PORT-0004",  level:"CRITICAL",msg:"Service port 8080 unreachable — connection refused",     cause:"WAS 프로세스 비정상 종료", action:"서비스 프로세스 재시작 및 원인 로그 확인" },
  };

  const normalCnt = inspItems.filter(r=>r.result==="정상").length;
  const abnCnt    = inspItems.filter(r=>r.result==="비정상").length;
  const eyeItemPhotos = item?.eyeItemPhotos || {};
  const autoItems = inspItems.filter(r=>r.method==="자동");
  const eyeItems  = inspItems.filter(r=>r.method==="육안");

  const RPT_COLOR = { "일일":"#0C8CE9","주간":"#19973C","월간":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333333","상시":"#0891B2" };
  const rptType = item?.rptType || "일일";
  const rptCol  = RPT_COLOR[rptType] || "#333";

  /* ── 보고서 미리보기 ── */
  const ReportPreview = () => {
    const tbl  = { width:"100%", borderCollapse:"collapse" };
    const th   = (ex={}) => ({ padding:"6px 10px", border:"1px solid #333", background:"#1a3a5c", color:"#fff", fontSize:12, fontWeight:700, textAlign:"center", ...ex });
    const thLt = (ex={}) => ({ padding:"6px 10px", border:"1px solid #333", background:"#c8d8e8", color:"#1a3a5c", fontSize:12, fontWeight:700, ...ex });
    const td   = (ex={}) => ({ padding:"6px 10px", border:"1px solid #aaa", fontSize:12, verticalAlign:"middle", ...ex });
    const secH = (ex={}) => ({ padding:"5px 10px", border:"1px solid #333", background:"#2d5a8e", color:"#fff", fontSize:12, fontWeight:700, textAlign:"center", letterSpacing:2, ...ex });
    const groups = inspItems.reduce((acc,r)=>{ const g=r.method==="육안"?"육안점검":"자동점검"; if(!acc[g])acc[g]=[]; acc[g].push(r); return acc; },{});
    return (
      <div style={{ fontFamily: PRETENDARD_FONT, background:"#fff", padding:"20px 24px", color:"#111" }}>
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:18, fontWeight:900, letterSpacing:10, color:"#1a3a5c", borderBottom:"3px solid #1a3a5c", paddingBottom:8, marginBottom:4 }}>일 상 점 검 보 고 서</div>
          <div style={{ fontSize:12, color:"#444", marginTop:6 }}>{item?.clNm} &nbsp;|&nbsp; {item?.execDt?.slice(0,10)}</div>
        </div>
        <div style={secH({ marginBottom:0 })}>SITE INFORMATION</div>
        <table style={{ ...tbl, marginBottom:10 }}><tbody>
          <tr><td style={thLt({ width:"18%" })}>정보시스템</td><td style={td({ width:"32%" })}>{item?.sysNm}</td><td style={thLt({ width:"18%" })}>대상자원</td><td style={td({ width:"32%" })}>{item?.resNm}</td></tr>
          <tr><td style={thLt()}>점검자</td><td style={td()}>{item?.insp}</td><td style={thLt()}>점검일시</td><td style={td()}>{item?.execDt}</td></tr>
          <tr><td style={thLt()}>점검표</td><td style={td()}>{item?.clNm}</td><td style={thLt()}>보고일시</td><td style={td()}>{item?.submitDt !== "-" ? item?.submitDt : "—"}</td></tr>
        </tbody></table>
        <div style={secH({ marginBottom:0 })}>SYSTEM DETAIL CHECK</div>
        {Object.entries(groups).map(([grp,rows])=>(
          <div key={grp}><table style={{ ...tbl }}><thead>
            <tr>{["점검 항목","방식","기준값","결과값","점검결과"].map((h,i)=><th key={i} style={th({ width:i===0?"28%":i===1?"10%":"16%" })}>{h}</th>)}</tr>
            <tr><td colSpan={5} style={{ padding:"4px 10px", border:"1px solid #aaa", background:"#e8f0f8", color:"#1a3a5c", fontWeight:700 }}>[{grp}]</td></tr>
          </thead><tbody>
            {rows.map(r=>{ const isAbn=r.result==="비정상"; const isEye=r.method==="육안"; return (
              <tr key={r.id} style={{ background:isAbn?"#FFF0F0":"#fff" }}>
                <td style={td({ fontWeight:600 })}>{r.nm}</td>
                <td style={td({ textAlign:"center" })}><span style={{ padding:"1px 6px", borderRadius:4, fontWeight:600, background:isEye?"#FEF3C7":"#E0F2FE", color:isEye?"#92400E":"#0369A1" }}>{r.method}</span></td>
                <td style={td({ textAlign:"center", fontFamily:"inherit" })}>{r.std}</td>
                <td style={td({ textAlign:"center", fontFamily:"inherit", color:isAbn?"#DC2626":"#111", fontWeight:isAbn?700:400 })}>{r.val}</td>
                <td style={td({ textAlign:"center" })}>{r.method==="자동"
                  ? <span style={{ fontSize:12, fontWeight:700, color:isAbn?"#DC2626":"#16a34a" }}>{r.result}</span>
                  : <span style={{ fontSize:12 }}>{isAbn?<span style={{ color:"#DC2626", fontWeight:700 }}>□ 정상 &nbsp;☑ 비정상</span>:<span style={{ color:"#16a34a", fontWeight:700 }}>☑ 정상 &nbsp;□ 비정상</span>}</span>}
                </td>
              </tr>
            );})}
          </tbody></table></div>
        ))}
        <div style={{ marginTop:10, border:"1px solid #aaa" }}>
          <div style={{ padding:"5px 10px", background:"#e8f0f8", borderBottom:"1px solid #aaa", fontSize:12, fontWeight:700, color:"#1a3a5c" }}>[점검결과 요약]</div>
          <table style={{ ...tbl }}><tbody><tr>
            <td style={thLt({ width:"18%", textAlign:"center" })}>전체</td><td style={td({ textAlign:"center", fontWeight:700 })}>{inspItems.length}건</td>
            <td style={thLt({ width:"18%", textAlign:"center" })}>정상</td><td style={td({ textAlign:"center", fontWeight:700, color:"#16a34a" })}>{normalCnt}건</td>
            <td style={thLt({ width:"18%", textAlign:"center" })}>비정상</td><td style={td({ textAlign:"center", fontWeight:700, color:abnCnt>0?"#DC2626":"#111" })}>{abnCnt}건</td>
          </tr></tbody></table>
        </div>
        <div style={{ marginTop:10, border:"1px solid #aaa" }}>
          <div style={{ padding:"5px 10px", background:"#e8f0f8", borderBottom:"1px solid #aaa", fontSize:12, fontWeight:700, color:"#1a3a5c" }}>[특이사항]</div>
          <div style={{ padding:"32px 10px 10px", fontSize:12, color:item?.note?"#c2410c":"#aaa", fontStyle:item?.note?"normal":"italic" }}>{item?.note || "특이사항 없음"}</div>
        </div>
        <div style={{ marginTop:16, border:"2px solid #1a3a5c", borderRadius:4 }}>
          <div style={{ padding:"6px 0", background:"#1a3a5c", color:"#fff", textAlign:"center", fontSize:12, fontWeight:700, letterSpacing:4 }}>상기와 같이 점검 하였음을 확인 합니다</div>
          <table style={{ ...tbl }}><tbody>
            <tr><td style={td({ width:"15%", background:"#f5f5f5", fontWeight:700 })}>점검자</td><td style={td({ width:"35%" })}>{item?.insp}</td><td style={td({ width:"15%", background:"#f5f5f5", fontWeight:700 })}>확인자</td><td style={td({ width:"35%" })}><span style={{ color:"#aaa" }}>(서명)</span></td></tr>
            <tr><td style={td({ background:"#f5f5f5", fontWeight:700 })}>소속/성명</td><td style={td()}>&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;</td><td style={td({ background:"#f5f5f5", fontWeight:700 })}>부서/성명</td><td style={td()}>&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color:"#aaa" }}>(인)</span></td></tr>
          </tbody></table>
        </div>
      </div>
    );
  };

  /* ── 다운로드 핸들러 ── */
  const handleDownload = () => {
    const w = window.open("", "_blank");
    const html = document.createElement("div");
    html.innerHTML = document.querySelector("#report-preview-content")?.innerHTML || "";
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>점검보고서_${item?.resNm}_${item?.execDt?.slice(0,10)}</title>
      <style>body{font-family:${PRETENDARD_FONT};margin:20px;}table{border-collapse:collapse;width:100%;}*{box-sizing:border-box;}</style>
      </head><body>${document.getElementById("report-preview-content")?.innerHTML || "<p>미리보기를 먼저 열어주세요.</p>"}</body></html>`);
    w.document.close();
    setTimeout(()=>w.print(), 400);
  };

  if (!item) return <SidePanel open={open} onClose={onClose} title="점검 상세" width={560}><div/></SidePanel>;

  const LEVEL_STYLE = { "CRITICAL":["#7F1D1D","#FEF2F2"], "ERROR":["#dc2626","#FFF8F8"], "WARNING":["#D97706","#FFFBEB"] };

  return (
    <SidePanel open={open} onClose={onClose} title="점검 상세" width={showPreview ? 1120 : 560} noScroll>
      <div style={{ display:"flex", height:"100%" }}>

        {/* ── 왼쪽: 보고서 미리보기 ── */}
        {showPreview && (
          <div style={{ flex:1, minWidth:0, borderRight:`1px solid ${C.brd}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"14px 20px 12px", borderBottom:`1px solid ${C.brd}`,
              display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, background:"#FAFBFC" }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.txH }}>보고서 미리보기</span>
              <span style={{ fontSize:12, color:C.txL, background:"#F0F5FF", padding:"2px 8px", borderRadius:10, border:`1px solid ${C.priL}` }}>실시간 반영</span>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
              <div id="report-preview-content" style={{ border:`1px solid ${C.brd}`, borderRadius:6, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
                <ReportPreview />
              </div>
            </div>
          </div>
        )}

        {/* ── 상세 내용 (항상 560px 고정) ── */}
        <div style={{ flex:"0 0 560px", display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>

          {/* ── 대상 자원 카드 (StlDailyPanel 동일 구조) ── */}
          <div style={{ border:`1px solid ${C.brd}`, borderRadius:10, padding:"14px 16px", marginBottom:18, background:"#fff", position:"relative" }}>
            {/* 보고서 유형 배지 */}
            <span style={{ position:"absolute", top:12, right:14, display:"inline-block",
              padding:"2px 10px", borderRadius:10, fontSize:12, fontWeight:700,
              background:rptCol+"1A", color:rptCol, border:`1px solid ${rptCol}33` }}>{rptType}</span>
            <div style={{ fontSize:12, color:C.txL, marginBottom:4 }}>대상 자원</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.txH, marginBottom:4 }}>{item.resNm}</div>
            <div style={{ fontSize:12, color:C.txL }}>{[item.mid, item.ip, item.sysNm].filter(Boolean).join(" · ")}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 20px", marginTop:12, paddingTop:10, borderTop:`1px solid ${C.brd}` }}>
              {[["점검표", item.clNm], ["점검자", item.insp], ["수행일시", item.execDt],
                ["제출일시", item.submitDt && item.submitDt !== "-" ? item.submitDt : "-"]
              ].map(([l,v]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:12, color:C.txL }}>{l}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:C.txt }}>{v||"—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 점검결과 요약 + 버튼 ── */}
          <div style={{ display:"flex", alignItems:"center", marginBottom:10 }}>
            <SecTitle label="점검결과 요약" style={{ marginBottom:0 }} />
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:20 }}>
            {[[`정상`,normalCnt,"#E8F5EC","#19973C"],[`비정상`,abnCnt,abnCnt>0?"#FEF2F2":"#F3F4F6",abnCnt>0?"#E24949":C.txL],[`전체`,inspItems.length,C.priL,C.pri]].map(([l,v,bg,tc])=>(
              <div key={l} style={{ flex:1, padding:"12px 16px", background:bg, borderRadius:8, textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:700, color:tc }}>{v}</div>
                <div style={{ fontSize:12, color:C.txS, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>

                    {/* ── 자동점검 결과 ── */}
          <SecTitle label="자동점검" />
          <div style={{ border:`1px solid ${C.brd}`, borderRadius:8, overflow:"hidden", marginBottom:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 10px", background:"#F8FAFC", borderBottom:`1px solid ${C.brd}` }}>
              {[[`정상 ${autoItems.filter(r=>r.result==="정상").length}건`,"#D1FAE5","#15803d"],
                [`비정상 ${autoItems.filter(r=>r.result==="비정상").length}건`, autoItems.some(r=>r.result==="비정상")?"#FEE2E2":"#F3F4F6", autoItems.some(r=>r.result==="비정상")?"#dc2626":C.txL],
                [`전체 ${autoItems.length}건`,C.priL,C.pri]
              ].map(([l,bg,tc])=>(
                <span key={l} style={{ fontSize:12, padding:"3px 9px", borderRadius:8, background:bg, color:tc, fontWeight:700 }}>{l}</span>
              ))}
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead><tr style={{ background:"#F8FAFC" }}>
                {["점검항목","기준","결과값","판정"].map((h,i)=>(
                  <th key={i} style={{ padding:"7px 9px", fontWeight:600, color:C.txS, textAlign:i===0?"left":"center", borderBottom:`1px solid ${C.brd}` }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {autoItems.map((r,i)=>{
                  const isAbn = r.result==="비정상";
                  const errDet = isAbn && r.errCode ? ERR_DETAIL_MAP[r.errCode] : null;
                  const [lc, lbg] = LEVEL_STYLE[errDet?.level] || ["#dc2626","#FFF8F8"];
                  return (
                    <React.Fragment key={r.id}>
                      <tr style={{ borderBottom: isAbn && errDet ? "none" : `1px solid ${C.brd}`, background:isAbn?"#FFF8F8":i%2===0?"#fff":"#FAFBFC" }}>
                        <td style={{ padding:"7px 9px", fontWeight:600, color:C.txH }}>{r.nm}</td>
                        <td style={{ padding:"7px 9px", textAlign:"center", color:C.txS, fontFamily:"inherit" }}>{r.std}</td>
                        <td style={{ padding:"7px 9px", textAlign:"center", fontFamily:"inherit", fontWeight:700, color:isAbn?"#dc2626":"#15803d" }}>{r.val}</td>
                        <td style={{ padding:"7px 9px", textAlign:"center" }}>
                          <span style={{ fontSize:12, fontWeight:700, padding:"2px 8px", borderRadius:8, background:isAbn?"#FEE2E2":"#D1FAE5", color:isAbn?"#dc2626":"#15803d" }}>{r.result}</span>
                        </td>
                      </tr>
                      {isAbn && errDet && (
                        <tr style={{ borderBottom:`1px solid ${C.brd}` }}>
                          <td colSpan={4} style={{ padding:"0 9px 10px 9px", background:"#FFF8F8" }}>
                            <div style={{ borderRadius:6, border:"1px solid #FECACA", background:lbg, padding:"10px 12px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                                <span style={{ fontSize:12, fontWeight:700, padding:"2px 7px", borderRadius:4, background:lc+"22", color:lc, border:`1px solid ${lc}44`, letterSpacing:.5 }}>{errDet.level}</span>
                                <span style={{ fontFamily:"inherit", fontWeight:700, color:lc, letterSpacing:.5 }}>{errDet.code}</span>
                              </div>
                              <div style={{ fontFamily:"inherit", color:"#374151", background:"rgba(0,0,0,.04)", borderRadius:4, padding:"6px 8px", marginBottom:8, wordBreak:"break-all", lineHeight:1.5 }}>{errDet.msg}</div>
                              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                                <div style={{ display:"flex", gap:6, fontSize:12 }}><span style={{ fontWeight:700, color:C.txS, flexShrink:0, width:32 }}>원인</span><span style={{ color:C.txS }}>{errDet.cause}</span></div>
                                <div style={{ display:"flex", gap:6, fontSize:12 }}><span style={{ fontWeight:700, color:lc, flexShrink:0, width:32 }}>조치</span><span style={{ color:C.txH, fontWeight:500 }}>{errDet.action}</span></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── 육안점검 결과 ── */}
          <SecTitle label="육안점검" />
          <div style={{ marginBottom:18 }}>
            {eyeItems.map(e => {
              const isAbn = e.result === "비정상";
              const itemPhotos = eyeItemPhotos[`e${e.id-6}`] || [];
              return (
                <div key={e.id} style={{ borderRadius:8, marginBottom:8,
                  border:`1px solid ${isAbn?"#fecaca":e.result==="정상"?"#bbf7d0":C.brd}`,
                  background: isAbn?"#FFF8F8":e.result==="정상"?"#F0FDF4":"#fff", overflow:"hidden" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px" }}>
                    <div>
                      <div style={{ fontSize:12, fontWeight:500, color:C.txt }}>{e.nm}</div>
                      <div style={{ fontSize:12, color:C.txL, marginTop:2 }}>기준: {e.std}</div>
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, padding:"3px 12px", borderRadius:8,
                      background:isAbn?"#FEE2E2":"#D1FAE5", color:isAbn?"#dc2626":"#15803d" }}>{e.result}</span>
                  </div>
                  {itemPhotos.length > 0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"0 14px 12px",
                      borderTop:`1px dashed ${isAbn?"#fecaca":"#bbf7d0"}` }}>
                      <div style={{ width:"100%", fontSize:12, color:C.txL, paddingTop:8, marginBottom:2 }}>첨부사진</div>
                      {itemPhotos.map(p => (
                        <div key={p.id} style={{ width:80, height:64, borderRadius:6, border:`1px solid ${C.brd}`,
                          background:p.color, display:"flex", flexDirection:"column", alignItems:"center",
                          justifyContent:"center", gap:3, flexShrink:0 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="1.5">
                            <rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M9 5l1.5-2h3L15 5"/>
                          </svg>
                          <span style={{ fontSize:12, color:C.txS, maxWidth:72, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", padding:"0 4px", textAlign:"center" }}>{p.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── 특이사항 ── */}
          <SecTitle label="특이사항" />
          <div style={{ padding:"10px 12px", border:`1px solid ${C.brd}`, borderRadius:6,
            background:"#FAFBFC", fontSize:12, color:item.note?"#F36D00":C.txL,
            minHeight:56, marginBottom:20, lineHeight:1.6 }}>
            {item.note || "특이사항 없음"}
          </div>
          </div>{/* ── 바디 끝 ── */}

          {/* ── 고정 푸터 ── */}
          <div style={{ flexShrink:0, display:"flex", alignItems:"center",
            padding:"12px 24px", borderTop:`1px solid ${C.brd}`, background:"#fff", gap:6 }}>
            <Btn onClick={onClose}>닫기</Btn>
            <Btn outline onClick={()=>setShowPreview(p=>!p)} style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              {showPreview ? "미리보기 닫기" : "보고서 미리보기"}
            </Btn>
            <div style={{ flex:1 }} />
            <Btn onClick={handleDownload} style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              보고서 다운로드
            </Btn>
          </div>
        </div>
      </div>
    </SidePanel>
  );
};


const DailyRequestPanel = ({ open, onClose }) => {
  const { editMode, confirmOpen, handleDiscard, handleSaveConfirm, handleSave, handleCancel, setConfirmOpen } = useEditPanel(open, onClose);
  const emptyForm = {
    nm: "", sysId: "", resources: [], _resCat: "", _resSearch: "",
    reportDeadlineDate: "", reportDeadlineTime: "18:00",
    st: "사용", priority: 1, alertYn: "Y"
  };
  const [form, setForm] = useState(emptyForm);
  useEffect(() => { if (open) setForm(emptyForm); }, [open]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const roS = {};
  return (
    <>
    <SidePanel open={open} onClose={() => confirmOpen ? setConfirmOpen(true) : onClose()} title="일상점검 등록" width={580}> noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      {/* ── 점검 정보 ── */}
      <div style={{ marginBottom: 18 }}>
        {<SecTitle label="점검 정보" primary />}
        <FormRow label="점검 명" required>
          <FInput value={form.nm} onChange={e => set("nm", e.target.value)} placeholder="점검 이름을 입력하세요" maxLength={100} />
        </FormRow>

        {/* 대상 자원 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ ...LABEL_STYLE }}>
              대상 자원 <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <span style={{ fontSize: 12, color: C.txL }}>{form.resources.length}개 선택됨</span>
          </div>

          {/* 선택된 자원 태그 */}
          {form.resources.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
              {form.resources.map(rid => {
                const r = RES.find(x => x.id === rid);
                if (!r) return null;
                const cl = CL_INIT.find(c => c.sub === r.mid);
                return (
                  <span key={rid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 10, background: C.priL, color: C.priD, fontSize: 12, fontWeight: 600 }}>
                    {r.nm}<span style={{ fontWeight: 400, color: C.pri }}>({cl ? cl.nm : "\u2014"})</span>
                    <span onClick={() => set("resources", form.resources.filter(x => x !== rid))} style={{ cursor: "pointer", fontSize: 12, lineHeight: 1 }}>\u00d7</span>
                  </span>
                );
              })}
              {form.resources.length > 1 && <span onClick={() => set("resources", [])} style={{ fontSize: 12, color: C.red, cursor: "pointer", padding: "3px 6px" }}>전체 해제</span>}
            </div>
          )}

          {/* 자원 검색/추가 */}
          {(() => {
            const sysRes = form.sysId ? RES.filter(r => r.sysId === form.sysId) : RES;
            const cats = Array.from(new Set(sysRes.map(r => r.mid))).sort();
            const catVal = form._resCat || "";
            const searchVal = form._resSearch || "";
            const availRes = sysRes.filter(r => {
              if (form.resources.includes(r.id)) return false;
              if (catVal && r.mid !== catVal) return false;
              if (searchVal && !r.nm.toLowerCase().includes(searchVal.toLowerCase()) && !(r.ip || "").includes(searchVal)) return false;
              return true;
            });
            return (
              <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ padding: "8px 10px", background: "#F9FAFC", display: "flex", gap: 6, borderBottom: `1px solid ${C.brd}`, flexWrap: "wrap" }}>
                  <FSelect style={{ padding: "4px 8px", fontSize: 14, border: `1px solid ${C.brd}`, borderRadius: 4, background: "#fff", flex: "0 0 auto", minWidth: 100 }}
                    value={form.sysId} onChange={e => { set("sysId", e.target.value); set("resources", []); set("_resCat", ""); set("_resSearch", ""); }}>
                    <option value="">전체 시스템</option>
                    {SYS.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
                  </FSelect>
                  <FSelect style={{ padding: "4px 8px", fontSize: 14, border: `1px solid ${C.brd}`, borderRadius: 4, background: "#fff", flex: "0 0 auto", minWidth: 80 }}
                    value={catVal} onChange={e => set("_resCat", e.target.value)}>
                    <option value="">전체 분류</option>
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                  </FSelect>
                  <div style={{ position: "relative", flex: 1, minWidth: 120 }}>
                    <FInput style={{ width: "100%", padding: "4px 8px 4px 26px", fontSize: 14, border: `1px solid ${C.brd}`, borderRadius: 4, outline: "none", boxSizing: "border-box" }}
                      placeholder="자원명 또는 IP로 검색..." value={searchVal} onChange={e => set("_resSearch", e.target.value)} />
                    <span style={{ position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Ic n="search" s={12} c={C.txL} /></span>
                    {searchVal && <span onClick={() => set("_resSearch", "")} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 12, color: C.txL, lineHeight: 1 }}>\u00d7</span>}
                  </div>
                </div>
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  {availRes.length === 0 && <div style={{ padding: 14, textAlign: "center", fontSize: 12, color: C.txL }}>{searchVal || catVal || form.sysId ? "조건에 맞는 자원이 없습니다." : "추가 가능한 자원이 없습니다."}</div>}
                  {availRes.map(r => {
                    const cl = CL_INIT.find(c => c.sub === r.mid);
                    const disabled = !cl;
                    return (
                      <div key={r.id}
                        onClick={() => !disabled && set("resources", [...form.resources, r.id])}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderBottom: `1px solid ${C.brd}`, cursor: disabled ? "not-allowed" : "pointer", fontSize: 12, opacity: disabled ? 0.5 : 1, background: disabled ? "#FAFAFA" : "" }}
                        onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "#f0fdf4"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = disabled ? "#FAFAFA" : ""; }}>
                        <span style={{ color: disabled ? C.txL : C.pri, fontWeight: 700, fontSize: 15, flexShrink: 0 }}>+</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: disabled ? C.txL : C.txt }}>{r.nm}</div>
                          <div style={{ fontSize: 12, color: C.txL, marginTop: 1 }}>{r.mid} \u00b7 {r.small || "\u2014"} \u00b7 {r.ip || "\u2014"}</div>
                        </div>
                        <span style={{ fontSize: 12, padding: "2px 7px", borderRadius: 8, fontWeight: 600, flexShrink: 0, background: cl ? "#dcfce7" : "#FEF2F2", color: cl ? "#166534" : "#DC2626" }}>
                          {cl ? cl.nm : "점검표 없음"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {availRes.length > 0 && <div style={{ padding: "4px 12px", fontSize: 12, color: C.txL, textAlign: "center", background: "#F9FAFC", borderTop: `1px solid ${C.brd}` }}>{availRes.length}개 추가 가능</div>}
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── 보고기한 ── */}
      <div style={{ marginBottom: 18 }}>
        {<SecTitle label="보고기한" />}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="보고기한 날짜" required half>
            <DatePicker value={form.reportDeadlineDate} onChange={v => set("reportDeadlineDate", v)} />
          </FormRow>
          <FormRow label="보고기한 시간" required half>
            <FInput type="time" value={form.reportDeadlineTime} onChange={e => set("reportDeadlineTime", e.target.value)} />
          </FormRow>
        </div>
        <div style={{ fontSize: 12, color: C.txL, marginTop: -4, marginBottom: 4 }}>해당 시간까지 보고를 완료하지 않으면 "지연" 상태로 전환됩니다.</div>
      </div>

        {/* 대상 자원 */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
            <label style={{ ...LABEL_STYLE }}>
              대상 자원 {!ro && <span style={{ color:"#ef4444" }}>*</span>}
            </label>
            <span style={{ fontSize:12, color:C.txL }}>{form.resources.length}개 {ro?"연결됨":"선택됨"}</span>
          </div>

          {form.resources.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:8 }}>
              {form.resources.map(rid => {
                const r = RES.find(x => x.id === rid);
                if (!r) return null;
                const cl = CL_INIT.find(c => c.sub === r.mid);
                return (
                  <span key={rid} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 8px", borderRadius:10, background:C.priL, color:C.priD, fontSize:12, fontWeight:600 }}>
                    {r.nm}<span style={{ fontWeight:400, color:C.pri }}>({cl ? cl.nm : "—"})</span>
                    {!ro && <span onClick={() => set("resources", form.resources.filter(x => x !== rid))} style={{ cursor:"pointer", fontSize:12, lineHeight:1 }}>×</span>}
                  </span>
                );
              })}
              {!ro && form.resources.length > 1 && <span onClick={() => set("resources",[])} style={{ fontSize:12, color:C.red, cursor:"pointer", padding:"3px 6px" }}>전체 해제</span>}
            </div>
          )}

          {ro && form.resources.length === 0 && (
            <div style={{ padding:"14px 12px", border:`1px solid ${C.brd}`, borderRadius:6, fontSize:12, color:C.txL, textAlign:"center" }}>연결된 자원이 없습니다.</div>
          )}

          {!ro && (() => {
            const sysRes   = form.sysId ? RES.filter(r => r.sysId === form.sysId) : RES;
            const cats     = Array.from(new Set(sysRes.map(r => r.mid))).sort();
            const catVal   = form._resCat   || "";
            const searchVal= form._resSearch|| "";
            const availRes = sysRes.filter(r => {
              if (form.resources.includes(r.id)) return false;
              if (catVal   && r.mid !== catVal) return false;
              if (searchVal && !r.nm.toLowerCase().includes(searchVal.toLowerCase()) && !(r.ip||"").includes(searchVal)) return false;
              return true;
            });
            return (
              <div style={{ border:`1px solid ${C.brd}`, borderRadius:8, overflow:"hidden" }}>
                <div style={{ padding:"8px 10px", background:"#F9FAFC", display:"flex", gap:6, borderBottom:`1px solid ${C.brd}`, flexWrap:"wrap" }}>
                  <FSelect style={{ padding:"4px 8px", fontSize:14, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", flex:"0 0 auto", minWidth:100 }}
                    value={form.sysId} onChange={e => { set("sysId",e.target.value); set("resources",[]); set("_resCat",""); set("_resSearch",""); }}>
                    <option value="">전체 시스템</option>
                    {SYS.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
                  </FSelect>
                  <FSelect style={{ padding:"4px 8px", fontSize:14, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", flex:"0 0 auto", minWidth:80 }}
                    value={catVal} onChange={e => set("_resCat",e.target.value)}>
                    <option value="">전체 분류</option>
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                  </FSelect>
                  <div style={{ position:"relative", flex:1, minWidth:120 }}>
                    <FInput style={{ width:"100%", padding:"4px 8px 4px 26px", fontSize:14, border:`1px solid ${C.brd}`, borderRadius:4, outline:"none", boxSizing:"border-box" }}
                      placeholder="자원명 또는 IP로 검색..." value={searchVal} onChange={e => set("_resSearch",e.target.value)} />
                    <span style={{ position:"absolute", left:7, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}><Ic n="search" s={12} c={C.txL} /></span>
                    {searchVal && <span onClick={() => set("_resSearch","")} style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", cursor:"pointer", fontSize:12, color:C.txL, lineHeight:1 }}>×</span>}
                  </div>
                </div>
                <div style={{ maxHeight:200, overflowY:"auto" }}>
                  {availRes.length === 0 && <div style={{ padding:14, textAlign:"center", fontSize:12, color:C.txL }}>{searchVal||catVal||form.sysId?"조건에 맞는 자원이 없습니다.":"추가 가능한 자원이 없습니다."}</div>}
                  {availRes.map(r => {
                    const cl = CL_INIT.find(c => c.sub === r.mid);
                    const disabled = !cl;
                    return (
                      <div key={r.id}
                        onClick={() => !disabled && set("resources",[...form.resources, r.id])}
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 12px", borderBottom:`1px solid ${C.brd}`, cursor:disabled?"not-allowed":"pointer", fontSize:12, opacity:disabled?0.5:1, background:disabled?"#FAFAFA":"" }}
                        onMouseEnter={e => { if (!disabled) e.currentTarget.style.background="#f0fdf4"; }}
                        onMouseLeave={e => { e.currentTarget.style.background=disabled?"#FAFAFA":""; }}>
                        <span style={{ color:disabled?C.txL:C.pri, fontWeight:700, fontSize:15, flexShrink:0 }}>+</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:disabled?C.txL:C.txt }}>{r.nm}</div>
                          <div style={{ fontSize:12, color:C.txL, marginTop:1 }}>{r.mid} · {r.small||"—"} · {r.ip||"—"}</div>
                        </div>
                        <span style={{ fontSize:12, padding:"2px 7px", borderRadius:8, fontWeight:600, flexShrink:0, background:cl?"#dcfce7":"#FEF2F2", color:cl?"#166534":"#DC2626" }}>
                          {cl ? cl.nm : "점검표 없음"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {availRes.length > 0 && <div style={{ padding:"4px 12px", fontSize:12, color:C.txL, textAlign:"center", background:"#F9FAFC", borderTop:`1px solid ${C.brd}` }}>{availRes.length}개 추가 가능</div>}
              </div>
            );
          })()}
        </div>
      </div>{/* /바디 */}

      {/* 푸터 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={onClose}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={handleSave}>등록</Btn>
        </div>
      </div>
    </SidePanel>
    <UnsavedConfirm open={confirmOpen} onDiscard={handleDiscard} onSave={() => handleSaveConfirm()} />
    </>
  );
};

/* ──── COMMON PANEL: 공지사항 패널 ──── */
const NoticePanel = ({ open, onClose, item, viewOnly = false, onSave }) => {
  const isNew = !item;
  const nowDt = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}T${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`; };
  const emptyForm = { st: "사용", title: "", content: "", scope: "전체", banner: "N", startDt: nowDt(), endDt: "2050-12-31T24:00", registrant: "", regDt: "", attachFile: null };
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    if (open && item) setForm({ st: "사용", title: item.title, content: item.content || ("안녕하세요.\n\n" + item.title + " 관련 내용입니다.\n\n자세한 사항은 첨부 파일을 참고해 주세요.\n\n감사합니다."), scope: item.scope || "전체", banner: item.banner || "N", startDt: item.dt + "T00:00", endDt: "2050-12-31T24:00", registrant: item.user, regDt: item.dt + " 09:00:00", attachFile: item.file ? { name: item.file, size: null } : null });
    if (open && !item) setForm({ ...emptyForm, startDt: nowDt() });
  }, [open, item]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleAttachFile = (e) => { const f = e.target.files?.[0]; if (f) set("attachFile", f); e.target.value = ""; };
  const { editMode, confirmOpen, startEdit, handleDiscard, handleSaveConfirm, handleSave, handleCancel, setConfirmOpen } = useEditPanel(open, onClose);
  const ro = !!item && !editMode;
  const roS = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none" } : {};
  const roSel = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", appearance: "none", backgroundImage: "none", cursor: "default" } : {};

  return (
    <>
    <SidePanel open={open} onClose={() => editMode ? setConfirmOpen(true) : onClose()} title={isNew ? "공지사항 등록" : "공지사항 상세"} width={580} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {/* ── 센티널 뷰 전용 (viewOnly) ── */}
      {viewOnly && item && (
        <div style={{ border:`1px solid ${C.brd}`, borderRadius:10, padding:"14px 16px",
          marginBottom:18, background:"#fff", position:"relative" }}>

          {/* 우상단: 공지 범위 배지 */}
          <span style={{ position:"absolute", top:12, right:14,
            fontSize:12, fontWeight:700, padding:"2px 10px", borderRadius:10,
            background:"rgba(59,130,246,0.10)", color:C.pri,
            border:`1px solid rgba(59,130,246,0.22)` }}>{item.scope || "전체"}</span>

          {/* 제목 */}
          <div style={{ fontSize:12, color:C.txL, marginBottom:4 }}>공지사항</div>
          <div style={{ fontSize:18, fontWeight:700, color:C.txH, marginBottom:4, paddingRight:100, lineHeight:1.4 }}>
            {item.title || "—"}
          </div>
          <div style={{ fontSize:12, color:C.txL, marginBottom:12 }}>
            {[item.category, item.user || item.registrant].filter(Boolean).join(" · ")}
          </div>

          {/* 메타 정보 */}
          <div style={{ paddingTop:10, borderTop:`1px solid ${C.brd}`, display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 20px" }}>
              {[["등록자", item.user || item.registrant || "—"], ["등록일", item.dt || item.regDt || "—"], ["조회수", item.views ?? 0]].map(([l,v]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:12, color:C.txL }}>{l}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:C.txt }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 내용 */}
          {item.content && (
            <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${C.brd}` }}>
              <div style={{ fontSize:11, color:C.txL, marginBottom:3 }}>내용</div>
              <div style={{ fontSize:13, color:C.txt, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{item.content}</div>
            </div>
          )}

          {/* 첨부파일 */}
          <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${C.brd}` }}>
            <div style={{ fontSize:11, color:C.txL, marginBottom:6 }}>첨부파일</div>
            {item.file ? (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
                border:`1px solid ${C.brd}`, borderRadius:6, background:"#F9FAFC" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <span style={{ flex:1, fontSize:12, color:C.txt, fontWeight:500 }}>{item.file}</span>
                <span style={{ fontSize:12, color:C.pri, cursor:"pointer", fontWeight:600,
                  padding:"2px 8px", border:`1px solid ${C.pri}`, borderRadius:4 }}>다운로드</span>
              </div>
            ) : (
              <div style={{ fontSize:12, color:C.txL }}>첨부파일 없음</div>
            )}
          </div>
        </div>
      )}
      {/* ── 일반 등록/수정 뷰 ── */}
      {!viewOnly && (<>
      <div style={{ marginBottom: 18 }}>
        <SecTitle label="공지사항 정보" primary />

        {/* 사용유무 */}
        <FormRow label="사용유무">
          <div onClick={() => !ro && set("st", form.st === "사용" ? "미사용" : "사용")}
            style={{ display:"flex", alignItems:"center", gap:8, cursor: ro ? "default" : "pointer", userSelect:"none", opacity: ro ? 0.6 : 1 }}>
            <div style={{ width:38, height:22, borderRadius:11, background: form.st==="사용" ? C.pri : "#D1D5DB",
              position:"relative", transition:"background .2s", flexShrink:0 }}>
              <div style={{ position:"absolute", top:3, left: form.st==="사용" ? 18 : 3,
                width:16, height:16, borderRadius:8, background:"#fff",
                transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,.2)" }} />
            </div>
            <span style={{ fontSize:13, fontWeight:500, color: form.st==="사용" ? C.pri : C.txL }}>{form.st}</span>
          </div>
        </FormRow>

        {/* 1단: 제목 */}
        <FormRow label="제목" required>
          <FInput style={{ ...roS }} value={form.title} onChange={e => set("title", e.target.value)} placeholder="공지사항 제목" readOnly={ro} maxLength={150} />
        </FormRow>

        {/* 1단: 내용 */}
        <FormRow label="내용">
          <FTextarea style={{ minHeight: 200, ...(ro ? { ...roS, resize: "none" } : {}) }} value={form.content} onChange={e => set("content", e.target.value)} placeholder="공지사항 내용을 입력하세요" readOnly={ro} maxLength={4000} />
        </FormRow>

        {/* 1단: 첨부파일 */}
        <FormRow label="첨부파일">
          {form.attachFile ? (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
              border:`1px solid ${C.brd}`, borderRadius:6, background:"#F9FAFC" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              <span style={{ flex:1, fontSize:12, color:C.txt, fontWeight:500,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {form.attachFile.name}
                {form.attachFile.size && <span style={{ fontSize:12, color:C.txL, marginLeft:6 }}>({(form.attachFile.size/1024).toFixed(1)} KB)</span>}
              </span>
              {!ro && (
                <span onClick={()=>set("attachFile",null)}
                  style={{ cursor:"pointer", color:C.txL, fontSize:18, lineHeight:1, flexShrink:0 }} title="파일 제거">×</span>
              )}
              {ro && (
                <span style={{ fontSize:12, color:C.pri, cursor:"pointer", fontWeight:600,
                  padding:"2px 8px", border:`1px solid ${C.pri}`, borderRadius:4 }}>다운로드</span>
              )}
            </div>
          ) : !ro ? (
            <label style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
              border:`2px dashed ${C.brd}`, borderRadius:6, cursor:"pointer",
              transition:"all .15s", background:"#fff" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.pri;e.currentTarget.style.background=C.priL+"44";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.brd;e.currentTarget.style.background="#fff";}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <span style={{ fontSize:12, color:C.txL }}>파일을 선택하거나 드래그하세요</span>
              <span style={{ fontSize:12, color:C.txL, marginLeft:"auto" }}>PDF, DOCX, XLSX, HWP</span>
              <FInput type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.hwp" style={{ display:"none" }}
                onChange={handleAttachFile} />
            </label>
          ) : (
            <div style={{ padding:"8px 12px", border:`1px solid ${C.brd}`, borderRadius:6,
              background:"#F9FAFC", fontSize:12, color:C.txL }}>첨부파일 없음</div>
          )}
        </FormRow>

        {/* 공지 범위 - 히든 */}
        <div style={{ display:"none" }}>
          <FormRow label="공지 범위" style={{ flex:1 }}>
            <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.scope} onChange={e => set("scope", e.target.value)}>
              {["전체","매니저","센티널"].map(s => <option key={s} value={s}>{s}</option>)}
            </RoSelect>
          </FormRow>
        </div>

        {/* 2단: 게시시작, 게시종료 */}
        <div style={{ display:"flex", gap:12 }}>
          <FormRow label="게시 시작일" half>
            <DateTimePicker value={form.startDt} onChange={v => set("startDt", v)} readOnly={ro} />
          </FormRow>
          <FormRow label="게시 종료일" half>
            <DateTimePicker value={form.endDt} onChange={v => set("endDt", v)} readOnly={ro} />
          </FormRow>
        </div>

        {/* 3단: 배너공지, 공백, 공백 */}
        <div style={{ display:"flex", gap:12 }}>
          <FormRow label="배너공지" style={{ flex:1 }}>
            <div onClick={() => !ro && set("banner", form.banner === "Y" ? "N" : "Y")}
              style={{ display:"flex", alignItems:"center", gap:8, cursor: ro ? "default" : "pointer", userSelect:"none", opacity: ro ? 0.6 : 1 }}>
              <div style={{ width:38, height:22, borderRadius:11, background: form.banner==="Y" ? C.pri : "#D1D5DB",
                position:"relative", transition:"background .2s", flexShrink:0 }}>
                <div style={{ position:"absolute", top:3, left: form.banner==="Y" ? 18 : 3,
                  width:16, height:16, borderRadius:8, background:"#fff",
                  transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,.2)" }} />
              </div>
              <span style={{ fontSize:13, fontWeight:500, color: form.banner==="Y" ? C.pri : C.txL }}>
                {form.banner === "Y" ? "사용" : "미사용"}
              </span>
            </div>
          </FormRow>
          <div style={{ flex:1 }} />
          <div style={{ flex:1 }} />
        </div>

        {/* 3단: 등록자, 등록일, 조회수 */}
        <div style={{ display:"flex", gap:12 }}>
          <FormRow label="등록자" style={{ flex:1 }}>
            <FInput style={{ background: "#F9FAFC", pointerEvents: "none" }} value={form.registrant} readOnly />
          </FormRow>
          <FormRow label="등록일" style={{ flex:1 }}>
            <FInput style={{ background: "#F9FAFC", pointerEvents: "none" }} value={form.regDt} readOnly />
          </FormRow>
          <FormRow label="조회수" style={{ flex:1 }}>
            <FInput style={{ background: "#F9FAFC", pointerEvents: "none" }} value={ro ? (item.views ?? 0) : 0} readOnly />
          </FormRow>
        </div>
      </div>
      </>)}
      </div>{/* /바디 */}

      {/* 푸터 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {viewOnly ? (
            <Btn onClick={onClose}>닫기</Btn>
          ) : (isNew || editMode) ? (
            <>
              <Btn onClick={handleCancel}>취소</Btn>
              <div style={{ flex: 1 }} />
              <Btn primary onClick={() => { handleSave(); onSave?.({ ...form, id: item?.id || Date.now(), title: form.title }); }}>{isNew ? "등록" : "저장"}</Btn>
            </>
          ) : (
            <>
              <Btn onClick={onClose}>닫기</Btn>
              <div style={{ flex: 1 }} />
              <Btn danger onClick={() => {}}>삭제</Btn>
              <Btn success style={{ marginLeft: 8 }} onClick={startEdit}>수정</Btn>
            </>
          )}
        </div>
      </div>
    </SidePanel>
    <UnsavedConfirm open={confirmOpen} onDiscard={handleDiscard} onSave={() => handleSaveConfirm()} />
    </>
  );
};

/* ── 정보시스템 상세/수정 사이드패널 (AddSystemModal과 동일 구조) ── */
const SystemDetailPanel = ({ open, onClose, system, onUpdate, onDelete, resCount = 0 }) => {
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [memberSearch, setMemberSearch] = useState("");
  const [mode, setMode] = useState("panel"); // "panel" | "modal"
  const systemTypeOptions = ["업무", "서비스", "솔루션", "기타"];
  const mgmtOrgOptions = ["내부", "외부(업체)", "IT운영팀", "경영지원팀", "정보보안팀"];

  const isFixed = system?.id === "SHARED";
  const canDelete = resCount === 0 && !isFixed;

  const toggleMode = () => setMode(m => m === "panel" ? "modal" : "panel");

  const panelIcon = <PanelLeftClose size={16} />;
  const modalIcon = <ArrowUpLeftFromSquare size={16} />;

  useEffect(() => {
    if (system) {
      setForm({
        systemNm: system.nm || "",
        systemId: system.id || "",
        useYn: system.useYn || "Y",
        systemType: system.type || "",
        mgmtOrg: system.org || "",
        systemDesc: system.systemDesc || "",
        operStartDt: system.operStartDt || "",
        operEndDt: system.operEndDt || "",
        managerNm: system.managerNm || "",
        managerPhone: system.managerPhone || "",
        contractInfo: system.contractInfo || "",
        maintEndDate: system.maintEndDate || "",   // DB: maint_end_date
        ref1: system.ref1 || "",                   // DB: ref_1
        ref2: system.ref2 || "",                   // DB: ref_2
        ref3: system.ref3 || "",                   // DB: ref_3
        memo: system.memo || "",
        members: system.members || [],
      });
      setEditing(false);
      setErrors({});
      setMemberSearch("");
      setDeleteConfirm(false);
    }
  }, [system]);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };
  const ro = !editing;
  const roS = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", cursor: "default" } : {};
  const roSel = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", cursor: "default", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundImage: "none" } : {};
  const errStyle = (k) => errors[k] ? { borderColor: C.red } : {};

  const handleSave = () => {
    const e = {};
    if (!form.systemNm.trim()) e.systemNm = "정보시스템 명은 필수입니다.";
    if (!form.systemType) e.systemType = "시스템 유형을 선택해주세요.";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onUpdate?.({ ...form, nm: form.systemNm, type: form.systemType, org: form.mgmtOrg });
    setEditing(false);
  };

  const handleCancel = () => { setConfirmOpen(true); };
  const handleDiscard = () => {
    // form을 원래 system 데이터로 복원, 패널은 닫지 않음
    if (system) {
      setForm({
        systemNm: system.nm || "",
        systemId: system.id || "",
        useYn: system.useYn || "Y",
        systemType: system.type || "",
        mgmtOrg: system.org || "",
        systemDesc: system.systemDesc || "",
        operStartDt: system.operStartDt || "",
        operEndDt: system.operEndDt || "",
        managerNm: system.managerNm || "",
        managerPhone: system.managerPhone || "",
        contractInfo: system.contractInfo || "",
        maintEndDate: system.maintEndDate || "",
        ref1: system.ref1 || "",
        ref2: system.ref2 || "",
        ref3: system.ref3 || "",
        memo: system.memo || "",
        members: system.members || [],
      });
    }
    setErrors({});
    setConfirmOpen(false);
    setEditing(false);
  };

  if (!open) return null;

  return (
    <>
    <UnsavedConfirm open={confirmOpen} onDiscard={handleDiscard} onSave={() => { setConfirmOpen(false); handleSave(); }} />
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.25)", zIndex: 9998 }} onClick={() => editing ? setConfirmOpen(true) : onClose()} />
    <div style={mode === "panel"
      ? { position: "fixed", top: 0, right: 0, width: 620, height: "100%", background: "#fff", zIndex: 9999, boxShadow: "-4px 0 20px rgba(0,0,0,.12)", display: "flex", flexDirection: "column" }
      : { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 680, maxWidth: "92vw", maxHeight: "88vh", background: "#fff", zIndex: 9999, borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,.2)", display: "flex", flexDirection: "column" }}>
      {/* 헤더 */}
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: C.txH }}>{editing ? "정보시스템 수정" : "정보시스템 상세"}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <div onClick={toggleMode} title={mode === "panel" ? "레이어 팝업으로 전환" : "사이드 패널로 전환"}
            style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg}
            onMouseLeave={e => e.currentTarget.style.background = ""}>
            {mode === "panel" ? modalIcon : panelIcon}
          </div>
          <div onClick={() => editing ? setConfirmOpen(true) : onClose()}
            style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL, fontSize: 18 }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg}
            onMouseLeave={e => e.currentTarget.style.background = ""}>✕</div>
        </div>
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", minHeight: 0 }}>

        {/* 현황 (상단 요약) */}
        {system && (
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, padding: "14px 16px", background: C.priL, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.pri }}>{system.res}</div>
              <div style={{ fontSize: 12, color: C.txS, marginTop: 2 }}>등록 자원</div>
            </div>
            <div style={{ flex: 1, padding: "14px 16px", background: "#F0FDF4", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#16A34A" }}>{system.mem}</div>
              <div style={{ fontSize: 12, color: C.txS, marginTop: 2 }}>구성원</div>
            </div>
          </div>
        )}

        {/* 기본 정보 */}
        <div style={{ marginBottom: 20 }}>
          <SecTitle label="기본 정보" primary />
          <FormRow label="사용상태">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div onClick={() => !ro && set("useYn", form.useYn === "Y" ? "N" : "Y")}
                style={{ position: "relative", width: 44, height: 24, borderRadius: 12,
                  cursor: ro ? "default" : "pointer", opacity: ro ? 0.6 : 1,
                  background: form.useYn === "Y" ? C.pri : "#D1D5DB", transition: "background .2s" }}>
                <div style={{ position: "absolute", top: 2, left: form.useYn === "Y" ? 22 : 2,
                  width: 20, height: 20, borderRadius: "50%", background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .2s" }} />
              </div>
              <span style={{ fontSize: 13, color: form.useYn === "Y" ? C.pri : C.txL, fontWeight: 500, opacity: ro ? 0.6 : 1 }}>
                {form.useYn === "Y" ? "사용" : "미사용"}
              </span>
            </div>
          </FormRow>
          <FormRow label="정보시스템 명" required>
            <FInput style={{ ...roS, ...errStyle("systemNm") }} value={form.systemNm} onChange={e => set("systemNm", e.target.value)} placeholder="정보시스템 명을 입력하세요" readOnly={ro} maxLength={100} />
            {errors.systemNm && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.systemNm}</span>}
          </FormRow>
          <div style={{ display: "flex", gap: 12 }}>
            <FormRow label="시스템 ID" style={{ flex: 1 }}>
              <div style={{ position: "relative" }}>
                <FInput style={{ background: "#F9FAFC", color: C.txt, pointerEvents: "none", cursor: "default", paddingRight: 64 }} value={form.systemId} readOnly />
                <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: C.txS, fontWeight: 600, background: C.bgSec, padding: "2px 7px", borderRadius: 3, pointerEvents: "none" }}>자동생성</span>
              </div>
            </FormRow>
            <FormRow label="시스템 유형" required style={{ flex: 1 }}>
              <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel, ...errStyle("systemType") }} value={form.systemType} onChange={e => set("systemType", e.target.value)}>
                <option value="">선택하세요</option>
                {systemTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </RoSelect>
              {errors.systemType && <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.systemType}</span>}
            </FormRow>
            <FormRow label="관리주체" style={{ flex: 1 }}>
              <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.mgmtOrg} onChange={e => set("mgmtOrg", e.target.value)}>
                <option value="">선택하세요</option>
                {mgmtOrgOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </RoSelect>
            </FormRow>
          </div>
          <FormRow label="시스템 설명">
            <FTextarea style={{ ...(ro ? { ...roS, resize: "none" } : {}) }} value={form.systemDesc} onChange={e => set("systemDesc", e.target.value)} placeholder="시스템에 대한 설명을 입력하세요" readOnly={ro} maxLength={1000} />
          </FormRow>
        </div>

        {/* 운영 정보 */}
        <div style={{ marginBottom: 20 }}>
          <SecTitle label="운영 정보" />
          <div style={{ display: "flex", gap: 12 }}>
            <FormRow label="운영시작일" style={{ flex: 1 }}>
              <DatePicker value={form.operStartDt} onChange={v => set("operStartDt", v)} readOnly={ro} />
            </FormRow>
            <FormRow label="종료예정일" style={{ flex: 1 }}>
              <DatePicker value={form.operEndDt} onChange={v => set("operEndDt", v)} readOnly={ro} />
            </FormRow>
            <FormRow label="유지보수 종료일" style={{ flex: 1 }}>
              <DatePicker value={form.maintEndDate} onChange={v => set("maintEndDate", v)} readOnly={ro} placeholder="유지보수 종료일" />
            </FormRow>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FormRow label="담당자" style={{ flex: 1 }}>
              <FInput style={{ ...roS }} value={form.managerNm} onChange={e => set("managerNm", e.target.value)} placeholder="담당자 이름" readOnly={ro} maxLength={50} />
            </FormRow>
            <FormRow label="담당자 연락처" style={{ flex: 1 }}>
              <FInput style={{ ...roS }} value={form.managerPhone} onChange={e => set("managerPhone", e.target.value)} placeholder="010-0000-0000" readOnly={ro} maxLength={20} />
            </FormRow>
            <div style={{ flex: 1 }} />
          </div>
          <FormRow label="계약정보">
            <FTextarea style={{ ...(ro ? { ...roS, resize: "none" } : {}) }} value={form.contractInfo} onChange={e => set("contractInfo", e.target.value)} placeholder="유지보수 계약 정보를 입력하세요" readOnly={ro} maxLength={500} />
          </FormRow>
          <FormRow label="비고">
            <FTextarea style={{ ...(ro ? { ...roS, resize: "none" } : {}) }} value={form.memo} onChange={e => set("memo", e.target.value)} placeholder="기타 메모 정보" readOnly={ro} maxLength={500} />
          </FormRow>
        </div>

        {/* 참조 정보 (DB: ref_1, ref_2, ref_3) */}
        <div style={{ marginBottom: 20 }}>
          <SecTitle label="참조 정보" />
          <div style={{ display: "flex", gap: 12 }}>
            <FormRow label="참조1" style={{ flex: 1 }}>
              <FInput style={{ ...roS }} value={form.ref1} onChange={e => set("ref1", e.target.value)} placeholder="참조 정보 1" readOnly={ro} maxLength={200} />
            </FormRow>
            <FormRow label="참조2" style={{ flex: 1 }}>
              <FInput style={{ ...roS }} value={form.ref2} onChange={e => set("ref2", e.target.value)} placeholder="참조 정보 2" readOnly={ro} maxLength={200} />
            </FormRow>
            <FormRow label="참조3" style={{ flex: 1 }}>
              <FInput style={{ ...roS }} value={form.ref3} onChange={e => set("ref3", e.target.value)} placeholder="참조 정보 3" readOnly={ro} maxLength={200} />
            </FormRow>
          </div>
        </div>

        {/* 구성원 */}
        <div style={{ marginBottom: 20 }}>
          <SecTitle label="구성원" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8, minHeight: 32 }}>
            {(form.members || []).map(uid => {
              const u = USERS.find(x => x.userId === uid);
              return u ? (
                <span key={uid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 14, background: C.priL, color: C.priD, fontSize: 12, fontWeight: 500 }}>
                  {u.userNm} <span style={{ fontSize: 12, color: C.txL }}>({u.userRole})</span>
                  {editing && <span onClick={() => set("members", form.members.filter(m => m !== uid))} style={{ cursor: "pointer", marginLeft: 2, fontSize: 15, lineHeight: 1, color: C.txL }}>×</span>}
                </span>
              ) : null;
            })}
            {(!form.members || form.members.length === 0) && <span style={{ fontSize: 12, color: C.txL, lineHeight: "32px" }}>{editing ? "아래에서 구성원을 추가하세요." : "등록된 구성원이 없습니다."}</span>}
          </div>
          {editing && (
            <>
              <div style={{ position: "relative", marginBottom: 6 }}>
                <FInput style={{ paddingLeft: 30, fontSize: 14, marginBottom: 0 }} placeholder="이름, 아이디, 역할로 검색..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)} />
                <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Ic n="search" s={14} c={C.txL} /></span>
                {memberSearch && <span onClick={() => setMemberSearch("")} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: C.txL, fontSize: 15, lineHeight: 1 }}>×</span>}
              </div>
              <div style={{ border: `1px solid ${C.brd}`, borderRadius: 6, maxHeight: 180, overflowY: "auto" }}>
                {(() => {
                  const q = memberSearch.trim().toLowerCase();
                  const filteredUsers = USERS.filter(u => u.useYn === "Y" && (!q || u.userNm.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q) || u.userRole.toLowerCase().includes(q)));
                  if (filteredUsers.length === 0) return <div style={{ padding: "14px", textAlign: "center", fontSize: 12, color: C.txL }}>{q ? `"${memberSearch}" 검색 결과가 없습니다.` : "사용자가 없습니다."}</div>;
                  return filteredUsers.map(u => {
                    const checked = (form.members || []).includes(u.userId);
                    return (
                      <div key={u.userId}
                        onClick={() => { if (checked) set("members", form.members.filter(m => m !== u.userId)); else set("members", [...(form.members || []), u.userId]); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer", background: checked ? C.priL : "#fff", borderBottom: `1px solid ${C.brd}` }}
                        onMouseEnter={e => { if (!checked) e.currentTarget.style.background = "#F9FAFC"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = checked ? C.priL : "#fff"; }}>
                        <div style={{ width: 16, height: 16, borderRadius: 3, border: `2px solid ${checked ? C.pri : C.brd}`, background: checked ? C.pri : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span style={{ fontSize: 13, color: checked ? C.pri : C.txt, fontWeight: checked ? 600 : 400, flex: 1 }}>{u.userNm}</span>
                        <span style={{ fontSize: 12, color: C.txL }}>{u.userId}</span>
                        <span style={{ fontSize: 12, color: C.txS, background: "#F0F0F0", padding: "1px 6px", borderRadius: 8 }}>{u.userRole}</span>
                      </div>
                    );
                  });
                })()}
              </div>
              <div style={{ fontSize: 12, color: C.txL, marginTop: 6 }}>{(form.members || []).length}명 선택됨</div>
            </>
          )}
        </div>
      </div>

      {/* 푸터 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        {/* 삭제 불가 안내 메시지 */}
        {!editing && isFixed && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
            padding: "8px 12px", borderRadius: 6, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
            </svg>
            <span style={{ color: "#1E40AF", fontSize: 12 }}>
              <strong>공유자원</strong>은 고정 정보시스템으로 삭제할 수 없습니다.
            </span>
          </div>
        )}
        {!editing && !isFixed && !canDelete && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
            padding: "8px 12px", borderRadius: 6, background: "#FFF7ED", border: "1px solid #FED7AA" }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
            </svg>
            <span style={{ color: "#9A3412", fontSize: 12 }}>
              등록된 자원이 <strong>{resCount}개</strong> 있어 삭제할 수 없습니다. 자원을 먼저 삭제하세요.
            </span>
          </div>
        )}



        {/* 버튼 행: 닫기 | [공백] | 삭제  수정 */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {editing ? (
            /* 수정 모드: 취소 [공백] 저장 */
            <>
              <Btn onClick={handleCancel}>취소</Btn>
              <div style={{ flex: 1 }} />
              <Btn primary onClick={handleSave}>저장</Btn>
            </>
          ) : (
            <>
              <Btn onClick={onClose}>닫기</Btn>
              <div style={{ flex: 1 }} />
              <Btn danger disabled={!canDelete} onClick={() => canDelete && setDeleteConfirm(true)} style={{ marginRight: 8 }}>삭제</Btn>
              <Btn success onClick={() => setEditing(true)}>수정</Btn>
            </>
          )}
        </div>
      </div>
    </div>
    <ConfirmModal open={deleteConfirm} title="정보시스템 삭제"
      msg={<><strong>{system?.nm}</strong> 정보시스템이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</>}
      okLabel="삭제" onOk={() => { onDelete?.(system); onClose(); }} onCancel={() => setDeleteConfirm(false)} />
    </>
  );
};

/* ── 엑셀 일괄등록 모달 ── */
const ExcelUploadModal = ({ open, onClose }) => {
  const [file, setFile] = useState(null);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState({ success: 0, fail: 0 });
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile({ name: f.name, size: f.size, type: f.type || "application/octet-stream" });
  };

  const fmtSize = (b) => b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(1)}KB` : `${(b/1048576).toFixed(1)}MB`;

  const handleDrop = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); };

  const handleRegister = () => {
    const total = 5 + Math.floor(Math.random() * 10);
    const fail = Math.floor(Math.random() * 3);
    setResult({ success: total - fail, fail });
    setDone(true);
  };

  const handleClose = () => { setFile(null); setDone(false); setResult({ success: 0, fail: 0 }); onClose(); };

  return (
    <Modal open={open} onClose={handleClose} title="자원 일괄등록 (엑셀)" width={520}>
      {!done ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.txt }}>엑셀 파일 업로드</span>
              <a href="#" style={{ fontSize: 12, color: C.pri }}>양식 다운로드</a>
            </div>
            <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              style={{ border: `2px dashed ${C.brd}`, borderRadius: 8, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: "#F9FAFC", transition: "all .3s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.pri}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.brd}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
              <div style={{ fontSize: 12, color: C.txt, fontWeight: 600 }}>파일을 드래그하거나 클릭하여 업로드</div>
              <div style={{ fontSize: 12, color: C.txL, marginTop: 4 }}>xlsx, xls 파일만 지원 · 최대 10MB</div>
              <FInput ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>
          </div>
          {file && (
            <div style={{ marginBottom: 20, padding: "12px 14px", background: "#F0F9FF", border: `1px solid ${C.pri}30`, borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>📄</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.txt }}>{file.name}</div>
                <div style={{ fontSize: 12, color: C.txL, marginTop: 2 }}>{fmtSize(file.size)} · {file.type.includes("sheet") || file.type.includes("excel") ? "엑셀" : file.name.endsWith(".xlsx") ? "XLSX" : "XLS"}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn xs onClick={() => fileRef.current?.click()}>재업로드</Btn>
                <Btn xs outlineDanger onClick={() => setFile(null)}>삭제</Btn>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 16, borderTop: `1px solid ${C.brd}` }}>
            <Btn onClick={handleClose}>취소</Btn>
            <Btn primary onClick={handleRegister} disabled={!file} style={!file ? { opacity: 0.4, cursor: "not-allowed" } : {}}>등록</Btn>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{result.fail > 0 ? "⚠️" : "✅"}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.txt, marginBottom: 8 }}>등록 완료</div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20, marginBottom: 28 }}>
            <div style={{ padding: "16px 28px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#16A34A" }}>{result.success}</div>
              <div style={{ fontSize: 12, color: "#16A34A", marginTop: 2 }}>성공</div>
            </div>
            <div style={{ padding: "16px 28px", background: result.fail > 0 ? "#FEF2F2" : "#F9FAFC", borderRadius: 10, border: result.fail > 0 ? "1px solid #fecaca" : `1px solid ${C.brd}` }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: result.fail > 0 ? "#EF4444" : C.txL }}>{result.fail}</div>
              <div style={{ fontSize: 12, color: result.fail > 0 ? "#EF4444" : C.txL, marginTop: 2 }}>실패</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            <Btn primary onClick={handleClose}>닫기</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
};

/* ──── PAGES: MANAGER ──── */
const MgrRes = ({ toast }) => {
  const [sel, setSel] = useState(null);
  const [sysSearch, setSysSearch] = useState("");
  const [showAddSystem, setShowAddSystem] = useState(false);
  const [systems, setSystems] = useState(SYS);
  const [resources, setResources] = useState(RES);
  const [panelRes, setPanelRes] = useState(null);
  const [showAddRes, setShowAddRes] = useState(false);
  const [showSysDetail, setShowSysDetail] = useState(false);
  const [detailSys, setDetailSys] = useState(null);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [sysLimitToast, setSysLimitToast] = useState(false);
  const filtered = sel ? resources.filter(r => r.sysId === sel) : resources;

  /* ── 라이선스 기반 정보시스템 최대 수 계산 (고정 1개 포함) ── */
  const LICENSE_PLAN_MAX = { "PLAN_BASIC": 3, "PLAN_STD": 10, "PLAN_PREM": Infinity };
  const ACTIVE_PLAN = "PLAN_STD"; // 현재 활성 플랜 (Standard)
  const maxSystems = (LICENSE_PLAN_MAX[ACTIVE_PLAN] ?? 10) + 1; // +1 공유자원(고정)
  const currentSysCount = systems.length; // SHARED 포함 전체
  const canAddSystem = currentSysCount < maxSystems;

  const handleAddSystemClick = () => {
    if (!canAddSystem) { setSysLimitToast(true); setTimeout(() => setSysLimitToast(false), 3500); return; }
    setShowAddSystem(true);
  };

  const handleAddSystem = (form) => { if(toast) toast("정보시스템이 등록되었습니다.");
    const newSys = { id: form.systemId, nm: form.systemNm, type: form.systemType, org: form.mgmtOrg || "—", useYn: form.useYn, mem: form.members.length, res: 0 };
    setSystems(prev => [...prev, newSys]);
  };

  const handleUpdateSystem = (form) => {
    setSystems(prev => prev.map(s => s.id === detailSys?.id ? { ...s, ...form } : s));
    if (toast) toast("정보시스템이 저장되었습니다.");
  };

  const handleDeleteSystem = (system) => {
    setSystems(prev => prev.filter(s => s.id !== system.id));
    setShowSysDetail(false);
    setDetailSys(null);
    if (sel === system.id) setSel(null);
    if (toast) toast("정보시스템이 삭제되었습니다.", false);
  };


  const handleResourceSubmit = (form, editId) => {
    if (editId) {
      const updated = { ...resources.find(r => r.id === editId), ...form, sysNm: (systems.find(s => s.id === form.sysId) || {}).nm || "" };
      setResources(prev => prev.map(r => r.id === editId ? updated : r));
      setPanelRes(updated);
      if (toast) toast("자원이 수정되었습니다.");
    } else {
      const prefix = (systems.find(s => s.id === form.sysId)?.id || "RES").slice(0,3).toUpperCase();
      const autoId = `${prefix}-${String(Date.now()).slice(-6)}`;
      const newRes = { id: Date.now(), ...form, resourceId: autoId, sysNm: (systems.find(s => s.id === form.sysId) || {}).nm || "" };
      setResources(prev => [newRes, ...prev]);
      if (toast) toast("자원이 등록되었습니다.");
    }
  };

  const handleDeleteResource = (resource) => {
    setResources(prev => prev.filter(r => r.id !== resource.id));
    setPanelRes(null);
    if (toast) toast("자원이 삭제되었습니다.", false);
  };

  // 드래그 핸들러
  const handleDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setSystems(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(idx, 0, moved);
      setDragIdx(idx);
      return arr;
    });
  };
  const handleDragEnd = () => setDragIdx(null);

  const PAGE_SZ = 10;
  const [resPage, setResPage] = useState(1);
  const [resKw,   setResKw]   = useState("");

  const filteredRes = filtered.filter(r => {
    const kw = resKw.trim().toLowerCase();
    return !kw || r.nm.toLowerCase().includes(kw) || (r.ip || "").includes(kw);
  });
  const totalResPages = Math.max(1, Math.ceil(filteredRes.length / PAGE_SZ));
  const pagedRes = filteredRes.slice((resPage - 1) * PAGE_SZ, resPage * PAGE_SZ);
  const selSysNm = sel ? (systems.find(s => s.id === sel)?.nm || "") : "";

  return (
    <div>
      <PH title="자원관리" bc="홈 > 자원관리" />

      <div style={{ display: "flex", gap: 14, alignItems: "start" }}>

        {/* ── 왼쪽: 정보시스템 패널 ── */}
        <div style={{ width: 240, flexShrink: 0, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 6, overflow: "hidden", position: "sticky", top: 0, maxHeight: "calc(100vh - 170px)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.brd}`,
            display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.txH }}>정보시스템</span>
              <span style={{ fontSize: 11, color: canAddSystem ? C.txL : C.red, fontWeight: 500 }}>
                {currentSysCount - 1}/{maxSystems - 1}
              </span>
            </div>
            <div onClick={handleAddSystemClick}
              style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 4, cursor: "pointer", transition: "background .15s", border: "none", outline: "none" }}
              onMouseEnter={e => e.currentTarget.style.background = C.priL}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={canAddSystem ? C.txL : C.red} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </div>
          </div>
          {/* 시스템 수 제한 안내 토스트 */}
          {sysLimitToast && (
            <div style={{ margin: "8px 10px 0", padding: "8px 12px", borderRadius: 6,
              background: "#FEF2F2", border: "1px solid #FECACA", display: "flex", alignItems: "flex-start", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
              </svg>
              <span style={{ fontSize: 11, color: "#991B1B", lineHeight: 1.5 }}>
                현재 플랜(Standard)에서 정보시스템은 최대 <strong>{maxSystems - 1}개</strong>까지 등록 가능합니다. 추가 등록이 필요한 경우 라이선스를 업그레이드하세요.
              </span>
            </div>
          )}
          <div style={{ padding: "6px 0", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
            {/* 검색 */}
            <div style={{ padding: "6px 10px 4px", flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <FInput value={sysSearch} onChange={e => setSysSearch(e.target.value)}
                  placeholder="시스템 검색"
                  style={{ width: "100%", padding: "6px 24px 6px 26px", fontSize: 12, border: `1px solid ${C.brd}`,
                    borderRadius: 6, outline: "none", boxSizing: "border-box", background: "#F8FAFC", color: C.txt, fontFamily: "inherit" }} />
                {sysSearch && (
                  <span onClick={() => setSysSearch("")}
                    style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)",
                      cursor: "pointer", fontSize: 15, color: C.txL, lineHeight: 1 }}>×</span>
                )}
              </div>
            </div>
            {/* 전체 */}
            {(() => {
              const active = sel === null;
              return (
                <div onClick={() => { setSel(null); setResPage(1); }}
                  style={{ display: "flex", alignItems: "center",
                    padding: "9px 14px", cursor: "pointer", borderRadius: 6, margin: "0 6px",
                    background: active ? C.priL : "transparent",
                    transition: "all .3s" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.priL; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? C.priL : "transparent"; }}>
                  <span style={{ fontSize: 15, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txt, flex: 1 }}>전체</span>
                  <span style={{ fontSize: 12, fontWeight: 500,
                    background: "#EEEEEE", color: "#929292",
                    borderRadius: 10, padding: "1px 7px", minWidth: 20, textAlign: "center" }}>{resources.length}</span>
                </div>
              );
            })()}
            {/* 시스템 목록 */}
            {systems.filter(s => !sysSearch || s.nm.toLowerCase().includes(sysSearch.toLowerCase())).map((s, idx) => {
              const active = sel === s.id;
              return (
                <div key={s.id}
                  draggable
                  onDragStart={e => handleDragStart(e, idx)}
                  onDragOver={e => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  style={{ display: "flex", alignItems: "center",
                    padding: "8px 14px 8px 10px", cursor: "pointer", borderRadius: 6, margin: "0 6px",
                    background: active ? C.priL : dragIdx === idx ? "#F0F9FF" : "transparent",
                    opacity: s.useYn === "N" ? 0.4 : 1,
                    transition: "all .3s" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.priL; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? C.priL : "transparent"; }}>
                  <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }} onClick={() => { setSel(active ? null : s.id); setResPage(1); }}>
                    <div style={{ fontSize: 15, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txt,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: "20px" }}>{s.nm}</div>
                    <div style={{ fontSize: 12, color: C.txL, marginTop: 1 }}>자원 {s.res}개 · 구성원 {s.mem}명</div>
                  </div>
                  {/* 상세 아이콘 버튼 (세로 점 3개) */}
                  <button
                    onClick={e => { e.stopPropagation(); setDetailSys(s); setShowSysDetail(true); }}
                    style={{ flexShrink: 0, marginLeft: 4, width: 24, height: 24, border: "none", borderRadius: 4, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.txL }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.priL; e.currentTarget.style.color = C.pri; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.txL; }}
                    title="상세 보기">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 오른쪽: 자원 목록 ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          <SB ph="자원명 또는 IP로 검색"
            fields={[{ key:"status", label:"상태", type:"select", options:["전체","사용","미사용"] }]}
            onSearch={(f, kw) => { setResKw(kw); setResSt(f.status||"전체"); setResPage(1); }} />

          <Tbl
            secTitle={`${sel ? selSysNm : "전체"} 자원 목록`}
            secCount={filteredRes.length}
            secButtons={<>
              <Btn onClick={() => setShowExcelUpload(true)}>📤 엑셀 일괄등록</Btn>
              <Btn primary onClick={() => setShowAddRes(true)}>+ 자원추가</Btn>
            </>}
            data={filteredRes}
            onRow={r => setPanelRes(r)}
            rowStyle={r => r.st === "미사용" ? { opacity: 0.4 } : {}}
            cols={[
              { t:"상태",         k:"st",         w:80,   r:(v)=><YnBadge v={v}/> },
              { t:"자원명",       k:"nm",         w:180,  align:"left",
                r:(v)=><span style={{fontWeight:600,color:C.pri}}>{v}</span> },
              { t:"정보시스템",   k:"sysNm",      align:"left" },
              { t:"연결된 점검표", k:"clId",       align:"left",
                r:(v,r)=>{ const cl=v?CL_INIT.find(c=>String(c.id)===String(v)):CL_INIT.find(c=>c.sub===r.mid);
                  return cl
                    ?<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"2px 10px",borderRadius:10,fontSize:12,fontWeight:600,background:"#dcfce7",color:"#166534"}}>
                       <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>{cl.nm}
                     </span>
                    :<span style={{fontSize:12,color:C.txL}}>—</span>;} },
              { t:"점검자",       k:"inspectors",
                r:(v)=>(v&&v.length>0)?v.map(uid=>{const u=USERS.find(x=>x.userId===uid);return u?u.userNm:uid;}).join(", "):"—" },
              { t:"대분류",       k:"large" },
              { t:"중분류",       k:"mid" },
              { t:"소분류",       k:"small" },
              { t:"IP",           k:"ip" },
              { t:"OS",           k:"os",          r:(v)=>v||"—" },
            ]}
          />
        </div>
      </div>

      <AddSystemModal open={showAddSystem} onClose={() => setShowAddSystem(false)} onSubmit={handleAddSystem} systems={systems} />
      <ResourcePanel open={!!panelRes}  onClose={() => setPanelRes(null)}    resource={panelRes} onSubmit={handleResourceSubmit} onDelete={handleDeleteResource} systems={systems} hasLinkedCL={panelRes ? (panelRes.clId !== "none" && !!(panelRes.clId || CL_INIT.find(c => c.sub === panelRes.mid))) : false} />
      <ResourcePanel open={showAddRes}  onClose={() => setShowAddRes(false)} resource={null}     onSubmit={handleResourceSubmit} systems={systems} defaultSysId={sel || ""} />
      <SystemDetailPanel open={showSysDetail} onClose={() => setShowSysDetail(false)} system={detailSys} onUpdate={handleUpdateSystem} onDelete={handleDeleteSystem} resCount={detailSys ? resources.filter(r => r.sysId === detailSys.id).length : 0} />
      <ExcelUploadModal open={showExcelUpload} onClose={() => { setShowExcelUpload(false); if(toast) toast("엑셀 업로드가 완료되었습니다."); }} />
    </div>
  );
};

const MgrDash = ({ nav }) => {
  const { di, addDI } = useDI();
  const cnt = { s: di.filter(x => x.st === "요청").length, p: di.filter(x => x.st === "중단").length, d: di.filter(x => x.st === "지연").length, c: di.filter(x => x.st === "완료").length };

  /* ── 점검 상태 보고: 정보시스템 + 자원 세부분류별 완료율 계산 ── */
  const inspStatusData = (() => {
    const result = [];
    SYS.forEach(sys => {
      const sysRes = RES.filter(r => r.sysId === sys.id);
      const midGroups = {};
      sysRes.forEach(r => {
        if (!midGroups[r.mid]) midGroups[r.mid] = [];
        midGroups[r.mid].push(r);
      });
      const rows = Object.entries(midGroups).map(([mid, resources]) => {
        const total = resources.length;
        /* 완료율: resourceId hash 기반 시뮬레이션 */
        const doneCount = resources.filter((r, i) => {
          const h = (r.id * 17 + i * 7) % 100;
          return h < 72;
        }).length;
        const rate = total > 0 ? Math.round((doneCount / total) * 100) : 0;
        /* 상태 등급 */
        const grade = rate === 100 ? "정상" : rate >= 80 ? "경미" : rate >= 50 ? "경고" : rate >= 1 ? "지연" : "장애";
        const gradeColor = { 정상: "#19973C", 경미: "#0C8CE9", 경고: "#F36D00", 지연: "#E24949", 장애: "#7C3AED" };
        const gradeBg = { 정상: "#E8F5EC", 경미: "#E6F3FA", 경고: "#FFF3E6", 지연: "#FDE8E8", 장애: "#EDE9FE" };
        return { mid, total, doneCount, rate, grade, gradeColor: gradeColor[grade], gradeBg: gradeBg[grade] };
      });
      if (rows.length > 0) result.push({ sys, rows });
    });
    return result;
  })();

  return <div>
    <PH title="대시보드" bc="홈 > 대시보드" />
    <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
      <Stat label="전체 정보시스템" value={SYS.length} color={C.pri} icon="server" onClick={()=>nav&&nav("mr")} />
      <Stat label="전체 자원" value={RES.length} color={C.sec} icon="db" onClick={()=>nav&&nav("mr")} />
      <Stat label="오늘 보고 예정" value={(cnt.s||0) + (cnt.p||0)} color="#F36D00" icon="cal" onClick={()=>nav&&nav("mis")} />
      <Stat label="보고 지연" value={cnt.d} color={C.red} icon="alert" onClick={()=>nav&&nav("mis")} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Card title="오늘의 보고 현황">
        <div style={{ display: "flex", gap: 14 }}>
          {[["예정", cnt.s, "요청"], ["진행", cnt.p, null], ["지연", cnt.d, "지연"], ["완료", cnt.c, "완료"]].map(([label, v, st]) => (
            <div key={label} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 44, fontWeight: 700, color: st ? SC[st].t : C.pri }}>{v}</div>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: st ? SC[st].b : C.priL, color: st ? SC[st].t : C.pri, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── 최근 공지사항: 항목 클릭 시 공지사항 페이지로 이동 ── */}
      <Card title="최근 공지사항">
        {NT.slice(0, 3).map(n => (
          <div key={n.id}
            onClick={() => nav && nav("mbn")}
            style={{ padding: "7px 0", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", cursor: "pointer", transition: "background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.priL}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontSize: 14 }}>{n.title}</span>
            <span style={{ fontSize: 14, color: C.txL, flexShrink: 0, marginLeft: 8 }}>{n.dt}</span>
          </div>
        ))}
      </Card>

      {/* ── 점검 상태 보고: 정보시스템 + 자원 세부분류별 ── */}
      <Card title="보고 상태 보고" style={{ gridColumn: "span 2" }}>
        {/* 범례 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
          {[["100%","#19973C"],["80-99%","#0C8CE9"],["50-79%","#F36D00"],["1-49%","#E24949"],["0%","#7C3AED"]].map(([label, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: color }} />
              <span style={{ fontSize: 12, fontWeight: 600, color }}>{label}</span>
            </div>
          ))}
        </div>
        {/* 테이블 */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.bg }}>
                <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: C.txS, borderBottom: `1px solid ${C.brd}`, whiteSpace: "nowrap", width: 140 }}>정보시스템</th>
                {_mids.map(mid => (
                  <th key={mid} style={{ padding: "8px 8px", textAlign: "center", fontWeight: 600, color: C.txS, borderBottom: `1px solid ${C.brd}`, whiteSpace: "nowrap", minWidth: 64 }}>{mid}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inspStatusData.map(({ sys, rows }, si) => {
                const midMap = {};
                rows.forEach(r => { midMap[r.mid] = r; });
                return (
                  <tr key={sys.id} style={{ borderBottom: `1px solid ${C.brd}`, background: si % 2 === 0 ? "#fff" : "#FAFBFC" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: C.txH, whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 12 }}>{sys.nm}</div>
                      <div style={{ fontSize: 12, color: C.txL, marginTop: 1 }}>{sys.type} · {sys.org}</div>
                    </td>
                    {_mids.map(mid => {
                      const cell = midMap[mid];
                      if (!cell) return (
                        <td key={mid} style={{ padding: "8px 8px", textAlign: "center" }}>
                          <span style={{ fontSize: 12, color: C.txX }}>—</span>
                        </td>
                      );
                      return (
                        <td key={mid} style={{ padding: "6px 8px", textAlign: "center" }}>
                            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: cell.gradeColor, background: cell.gradeBg, padding: "2px 7px", borderRadius: 10, whiteSpace: "nowrap" }}>
                              {cell.rate}%
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── 자원유형별 / 자동vs육안 / 최근 점검 이력 — 3칼럼 ── */}
      <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

      {/* ── 자원 유형별 점검 현황 (가로 막대) ── */}
      <Card title="자원 유형별 보고 현황">
        {(() => {
          const types = ["서버","WEB","WAS","DBMS","네트워크","보안","스토리지","백업","서비스","유효성"];
          const data = types.map(t => {
            const total = RES.filter(r => r.mid === t).length;
            const h = (t.charCodeAt(0) * 7 + t.length * 13) % 100;
            const ok = Math.round(total * (0.5 + (h % 40) / 100));
            const ng = Math.round(total * ((h % 15) / 100));
            const none = Math.max(0, total - ok - ng);
            return { t, ok, ng, none, total };
          }).filter(d => d.total > 0);
          const max = Math.max(...data.map(d => d.total), 1);
          return <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.map(d => <div key={d.t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 52, fontSize: 12, fontWeight: 500, textAlign: "right", flexShrink: 0, color: C.txS }}>{d.t}</span>
              <div style={{ flex: 1, display: "flex", height: 18, borderRadius: 3, overflow: "hidden", background: "#F9FAFC" }}>
                {d.ok > 0 && <div title={`정상 ${d.ok}`} style={{ width: `${(d.ok / max) * 100}%`, background: "#479559" }} />}
                {d.ng > 0 && <div title={`비정상 ${d.ng}`} style={{ width: `${(d.ng / max) * 100}%`, background: "#f2c67d" }} />}
                {d.none > 0 && <div title={`미점검 ${d.none}`} style={{ width: `${(d.none / max) * 100}%`, background: "#BDC3C7" }} />}
              </div>
              <span style={{ fontSize: 12, color: C.txL, width: 22, flexShrink: 0 }}>{d.total}</span>
            </div>)}
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: C.txS, marginTop: 4, paddingLeft: 60 }}>
              {[["정상","#479559"],["비정상","#f2c67d"],["미점검","#BDC3C7"]].map(([l, c]) => <span key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}</span>)}
            </div>
          </div>;
        })()}
      </Card>

      {/* ── 자동점검 vs 육안점검 비율 ── */}
      <Card title="자동점검 vs 육안점검 비율">
        {(() => {
          const auto = 68, manual = 32;
          const total = auto + manual;
          const r = 56, cx = 70, cy = 70;
          const autoAngle = (auto / total) * 360;
          const toRad = a => (a - 90) * Math.PI / 180;
          const x1 = cx + r * Math.cos(toRad(0)), y1 = cy + r * Math.sin(toRad(0));
          const x2 = cx + r * Math.cos(toRad(autoAngle)), y2 = cy + r * Math.sin(toRad(autoAngle));
          const lg = autoAngle > 180 ? 1 : 0;
          return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx={cx} cy={cy} r={r} fill="#EEEEEE" />
              <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} Z`} fill={C.pri} />
              <circle cx={cx} cy={cy} r={32} fill="#fff" />
              <text x={cx} y={cy - 3} textAnchor="middle" style={{ fontSize: 18, fontWeight: 600, fill: C.txt }}>{total}</text>
              <text x={cx} y={cy + 11} textAnchor="middle" style={{ fontSize: 12, fill: C.txL }}>전체 점검</text>
            </svg>
            <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, justifyContent: "center" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: C.pri }} /><span style={{ fontSize: 12, fontWeight: 600 }}>자동점검</span></div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.pri }}>{auto}%</div>
                <div style={{ fontSize: 12, color: C.txL }}>{Math.round(di.length * auto / 100)}건</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, justifyContent: "center" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#EEEEEE" }} /><span style={{ fontSize: 12, fontWeight: 600 }}>육안점검</span></div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.txS }}>{manual}%</div>
                <div style={{ fontSize: 12, color: C.txL }}>{Math.round(di.length * manual / 100)}건</div>
              </div>
            </div>
          </div>;
        })()}
      </Card>

      {/* ── 최근 점검 이력 (명칭 변경, 상태 "완료", 점검표 명칭 노출) ── */}
      <Card title="최근 보고 이력" extra={<span style={{ fontSize: 12, color: C.txL }}>최근 24시간</span>}>
        {(() => {
          const logs = [
            { id: 1, t: "09:15", res: "CRM-DB-01", clNm: "DBMS 상태점검표" },
            { id: 2, t: "08:42", res: "SEC-NET-03", clNm: "네트워크 상태점검표" },
            { id: 3, t: "07:30", res: "MAIL-WAS-02", clNm: "WAS 상태점검표" },
            { id: 4, t: "어제 22:10", res: "FIN-SVR-04", clNm: "서버 상태점검표" },
            { id: 5, t: "어제 18:35", res: "GW-WEB-01", clNm: "서비스 유효성 점검표" },
          ];
          return <div style={{ position: "relative", paddingLeft: 16 }}>
            <div style={{ position: "absolute", left: 5, top: 4, bottom: 4, width: 2, background: C.brd }} />
            {logs.map((l, i) => (
              <div key={l.id} style={{ position: "relative", paddingLeft: 14, paddingBottom: i < logs.length - 1 ? 10 : 0 }}>
                <div style={{ position: "absolute", left: -13, top: 3, width: 8, height: 8, borderRadius: 4, background: SC["완료"].t, border: "2px solid #fff" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: C.txL, minWidth: 50 }}>{l.t}</span>
                  <Badge status="완료" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.txt }}>{l.res}</span>
                </div>
                <div style={{ fontSize: 12, color: C.txS, marginTop: 1 }}>{l.clNm}</div>
              </div>
            ))}
          </div>;
        })()}
      </Card>

      </div>

      {/* ── 관리자 전용: 시스템 운영 현황 ── */}
      <Card title="시스템 운영 현황" style={{ gridColumn: "span 2" }} extra={<span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#dbeafe", color: "#1d4ed8", fontWeight: 600 }}>관리자 전용</span>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {/* 라이선스 현황 */}
          <div style={{ padding: 16, borderRadius: 8, background: "#fefce8", border: "1px solid #fef08a" }}>
            <div style={{ fontSize: 12, color: "#854d0e", fontWeight: 600, marginBottom: 8 }}>라이선스 현황</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.txS }}>정보시스템</span><span style={{ fontSize: 12, fontWeight: 600 }}>{SYS.filter(s => s.id !== "SHARED").length} / 15</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: C.txS }}>자원</span><span style={{ fontSize: 12, fontWeight: 600 }}>{RES.length} / 500</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "#EEEEEE", overflow: "hidden" }}>
              <div style={{ width: `${(RES.length / 500) * 100}%`, height: "100%", borderRadius: 3, background: RES.length > 450 ? C.red : RES.length > 350 ? "#f59e0b" : "#22c55e" }} />
            </div>
            <div style={{ fontSize: 12, color: C.txL, marginTop: 4 }}>만료일: 2026-12-31</div>
          </div>
          {/* 코어 연동 상태 */}
          <div style={{ padding: 16, borderRadius: 8, background: C.priL, border: `1px solid ${C.pri}30` }}>
            <div style={{ fontSize: 12, color: "#1e40af", fontWeight: 600, marginBottom: 8 }}>코어 연동 상태</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: "#22c55e", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>정상 운영 중</span>
            </div>
            <div style={{ fontSize: 12, color: C.txL }}>마지막 통신: 09:15:32</div>
            <div style={{ fontSize: 12, color: C.txL }}>평균 응답: 124ms</div>
          </div>
          {/* 점검 실행 현황 (명칭 변경) */}
          <div style={{ padding: 16, borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <div style={{ fontSize: 12, color: "#166534", fontWeight: 600, marginBottom: 8 }}>자동점검 실행 현황</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.txS }}>오늘 실행</span><span style={{ fontSize: 12, fontWeight: 700 }}>24회</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.txS }}>성공</span><span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>23회</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: C.txS }}>실패</span><span style={{ fontSize: 12, fontWeight: 700, color: C.red }}>1회</span>
            </div>
          </div>
          {/* 최근 점검 결과 (명칭 변경) */}
          <div style={{ padding: 16, borderRadius: 8, background: "#faf5ff", border: "1px solid #e9d5ff" }}>
            <div style={{ fontSize: 12, color: "#6b21a8", fontWeight: 600, marginBottom: 8 }}>자동점검 실행 결과</div>
            {[{ t: "09:00", s: true, n: "CRM 서버 일간점검" }, { t: "08:00", s: true, n: "WEB 서비스 일간점검" }, { t: "07:00", s: false, n: "SEC 보안 점검" }, { t: "06:00", s: true, n: "HR 서버 일간점검" }].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: b.s ? "#22c55e" : "#ef4444" }} />
                <span style={{ color: C.txL, minWidth: 36 }}>{b.t}</span>
                <span style={{ color: C.txS }}>{b.n}</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      </Card>

      {/* ── 정보시스템별 자원 현황 ── */}
      <Card title="정보시스템별 자원 현황" style={{ gridColumn: "span 2" }}>
        <Tbl cols={[{ t: "시스템명", k: "nm" }, { t: "유형", k: "type" }, { t: "관리주체", k: "org" }, { t: "자원수", k: "res" }, { t: "구성원수", k: "mem" }, { t: "상태", k: "useYn", r: v => <YnBadge v={v} /> }]} data={SYS} noPaging />
      </Card>
    </div>
  </div>;
};

const MgrInspSt = () => {
  const { di } = useDI();
  const [selDay, setSelDay] = useState(null);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(1); // 0-indexed, 1=Feb
  const [showYMPicker, setShowYMPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(2026);

  const pad = n => String(n).padStart(2, "0");
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const goMonthPrev = () => { let m = viewMonth - 1, y = viewYear; if (m < 0) { m = 11; y--; } setViewMonth(m); setViewYear(y); setSelDay(null); };
  const goMonthNext = () => { let m = viewMonth + 1, y = viewYear; if (m > 11) { m = 0; y++; } setViewMonth(m); setViewYear(y); setSelDay(null); };

  const allInsp = [...di.map(x => ({...x, _type: "일상"})), ...SI.map(x => ({...x, _type: "특별", resNm: x.title}))];
  const dayItems = selDay
    ? allInsp.filter(x => x.due === `${viewYear}-${pad(viewMonth + 1)}-${pad(selDay)}`)
    : [];

  return <div>
    <PH title="점검현황" bc="홈 > 점검현황" />
    <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.brd}`, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(98vh - 170px)", maxHeight: 1500 }}>
      {/* 캘린더 네비게이션 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 12px", borderBottom: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
          <span onClick={() => { setPickerYear(viewYear); setShowYMPicker(!showYMPicker); }}
            style={{ fontSize: 28, fontWeight: 700, color: C.txH, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, userSelect: "none", padding: "2px 0", transition: "opacity .2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            {viewYear}.{viewMonth + 1}
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ marginTop: 2 }}><path d="M3 4.5L6 7.5L9 4.5" stroke={C.txL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          {showYMPicker && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 98 }} onClick={() => setShowYMPicker(false)} />
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 99,
                background: "#fff", borderRadius: 10, boxShadow: "0 4px 24px rgba(0,0,0,.14)",
                border: `1px solid ${C.brd}`, padding: "14px 16px", minWidth: 260 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span onClick={() => setPickerYear(pickerYear - 1)} style={{ cursor: "pointer", padding: "2px 10px", fontWeight: 700, fontSize: 15, color: C.txS, userSelect: "none" }}>‹</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>{pickerYear}년</span>
                  <span onClick={() => setPickerYear(pickerYear + 1)} style={{ cursor: "pointer", padding: "2px 10px", fontWeight: 700, fontSize: 15, color: C.txS, userSelect: "none" }}>›</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const isSel = pickerYear === viewYear && i === viewMonth;
                    return (
                      <div key={i} onClick={() => { setViewYear(pickerYear); setViewMonth(i); setShowYMPicker(false); setSelDay(null); }}
                        style={{ textAlign: "center", padding: "7px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                          background: isSel ? C.pri : "transparent", color: isSel ? "#fff" : C.txt,
                          border: isSel ? `1px solid ${C.pri}` : `1px solid ${C.brd}` }}
                        onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = C.priL; }}
                        onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                        {pad(i + 1)}월
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
        {/* 범례 */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {[{ bg: "#dcfce7", bd: "#16653433", l: "일상점검" }, { bg: "#fff7ed", bd: "#c2410c33", l: "특별점검" }].map(lg =>
            <span key={lg.l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.txS }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: lg.bg, border: `1px solid ${lg.bd}` }} />{lg.l}
            </span>
          )}
        </div>
      </div>

      {/* 요일 헤더 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", flexShrink: 0 }}>
        {["일","월","화","수","목","금","토"].map((d, i) => (
          <div key={d} style={{ padding: "10px 12px", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            color: i === 0 ? "#ef4444" : i === 6 ? C.pri : C.txL, borderBottom: `1px solid ${C.brd}` }}>{d}</div>
        ))}
      </div>

      {/* 날짜 그리드 - 일요일 시작 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridTemplateRows: `repeat(${Math.ceil((firstDay + daysInMonth) / 7)}, 1fr)`, flex: 1, minHeight: 0 }}>
        {(() => {
          const sunFirst = firstDay;
          const rows = Math.ceil((sunFirst + daysInMonth) / 7) * 7;
          const rowCount = rows / 7;
          const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
          return Array.from({ length: rows }, (_, idx) => {
            const dayNum = idx - sunFirst + 1;
            const isValid = dayNum >= 1 && dayNum <= daysInMonth;
            let displayDay = dayNum;
            if (dayNum < 1) displayDay = prevMonthDays + dayNum;
            else if (dayNum > daysInMonth) displayDay = dayNum - daysInMonth;
            const ds = isValid ? `${viewYear}-${pad(viewMonth + 1)}-${pad(dayNum)}` : "";
            const dailyCnt = isValid ? di.filter(x => x.due === ds).length : 0;
            const specCnt = isValid ? SI.filter(x => x.due === ds).length : 0;
            const today = isValid && viewYear === 2026 && viewMonth === 1 && dayNum === 11;
            const isSel = selDay === dayNum && isValid;
            const dow = idx % 7; // 0=일 1=월 ... 6=토
            const isWeekRow = Math.floor(idx / 7);
            const isLastRow = isWeekRow === Math.ceil(rows / 7) - 1;

            return (
              <div key={idx}
                onClick={() => isValid && setSelDay(dayNum === selDay ? null : dayNum)}
                style={{
                  position: "relative", padding: "8px 12px",
                  borderBottom: isLastRow ? "none" : `1px solid ${C.brd}`,
                  borderRight: dow < 6 ? `1px solid ${C.brd}` : "none",
                  cursor: isValid ? "pointer" : "default",
                  transition: "background .15s",
                  background: isSel ? C.priL : "transparent",
                }}
                onMouseEnter={e => { if (isValid && !isSel) e.currentTarget.style.background = "#FAFAFA"; }}
                onMouseLeave={e => { if (isValid && !isSel) e.currentTarget.style.background = isSel ? C.priL : "transparent"; }}
              >
                {/* 지연 건이 있으면 오른쪽 상단 빨간 동그라미 */}
                {isValid && (di.some(x => x.due === ds && x.st === "지연") || SI.some(x => x.due === ds && x.st === "지연")) && (
                  <div style={{ position: "absolute", top: 16, right: 10, width: 8, height: 8, borderRadius: "50%", background: C.red }} />
                )}
                {isSel && (
                  <div style={{ position: "absolute", top: 0, right: 0, width: 3, height: "100%", background: C.pri }} />
                )}
                <div style={{
                  fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 6,
                  color: !isValid ? C.txX : today ? C.red : dow === 0 ? "#ef4444" : dow === 6 ? C.pri : C.txH,
                }}>{pad(displayDay)}</div>
                {isValid && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {dailyCnt > 0 && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#166534", lineHeight: 1.4, fontWeight: 500 }}>일상점검 <span style={{ minWidth: 16, height: 16, borderRadius: 8, background: "#dcfce7", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{dailyCnt}</span></div>}
                    {specCnt > 0 && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#c2410c", lineHeight: 1.4, fontWeight: 500 }}>특별점검 <span style={{ minWidth: 16, height: 16, borderRadius: 8, background: "#fff7ed", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{specCnt}</span></div>}
                  </div>
                )}
              </div>
            );
          });
        })()}
      </div>
    </div>

    <SidePanel open={selDay !== null && dayItems.length > 0} onClose={() => setSelDay(null)}
      title={`${viewYear}년 ${viewMonth + 1}월 ${selDay}일 점검 목록`} width={480}>
      {dayItems.map((it, i) => (
        <div key={i} style={{ padding: 12, marginBottom: 8, borderRadius: 8, border: `1px solid ${C.brd}`, background: "#F9FAFC" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{it.resNm || it.title}</span>
            <Badge status={it.st} />
          </div>
          <div style={{ fontSize: 12, color: C.txS }}>
            <span style={{ padding: "1px 6px", borderRadius: 3, marginRight: 6,
              background: it._type === "일상" ? "#dcfce7" : "#fff7ed",
              color: it._type === "일상" ? "#166534" : "#c2410c", fontSize: 12 }}>{it._type}</span>
            {it.sysNm} · {it.kind || it.clNm} · {it.insp || ""}
          </div>
        </div>
      ))}
      {dayItems.length === 0 && <div style={{ textAlign: "center", color: C.txL, fontSize: 12, padding: 32 }}>점검 항목이 없습니다.</div>}
    </SidePanel>
  </div>;
};

/* ── 특별점검 상세/등록 패널 ── */
const SpecialPanel = ({ open, onClose, item, onSave, onDelete, canReport = false }) => {
  const { editMode, confirmOpen, startEdit, handleDiscard, handleSaveConfirm, handleSave, handleCancel, setConfirmOpen } = useEditPanel(open, onClose);
  const isComp = item?.st === "완료";

  const SPEC_KINDS = ["오프라인점검","이중화점검","성능점검","업무집중기간점검"];

  const lastDayOfMonth = () => {
    const n = new Date(); 
    return new Date(n.getFullYear(), n.getMonth() + 1, 0).toISOString().slice(0, 10);
  };

  const emptyForm = {
    title:"", kind:"오프라인점검", insp:"", due: lastDayOfMonth(),
    purpose:"", content:"",
    planFile: null,
    execDt:"", submitDt:"", resultContent:"",
    resources: [],
    registrant: "", regDt: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [inspSearch, setInspSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const todayStr = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`; };

  const resetForm = (src) => {
    if (src) {
      setForm({
        title:         src.title         || "",
        kind:          src.kind          || "오프라인점검",
        insp:          src.insp          || "",
        due:           src.due           || lastDayOfMonth(),
        purpose:       src.purpose       || "",
        content:       src.content       || "",
        planFile:      src.planFile      ? { name: "점검계획서.pdf", size: null } : null,
        reportFile:    src.resultFile    ? { name: "점검결과보고서.pdf", size: null } : null,
        execDt:        src.execDt        || "",
        submitDt:      src.submitDt      || "",
        resultContent: src.resultContent || "",
        resources:     Array.isArray(src.resources) ? src.resources.map(nm => RES.find(r=>r.nm===nm)?.id).filter(Boolean) : [],
        registrant:    src.regUser       || "",
        regDt:         src.reg           || "",
      });
    } else {
      setForm({ ...emptyForm, due: lastDayOfMonth(), registrant: USERS[0]?.userNm || "관리자", regDt: todayStr() });
      setInspSearch("");
    }
    setErrors({});
  };

  useEffect(() => {
    if (open) resetForm(item);
  }, [open, item]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const isNew = !item;
  const ro    = !!item && !editMode;
  const roS   = ro ? { background:"#F9FAFC", color:C.txt, pointerEvents:"none" } : {};
  const roSel = ro ? { background:"#F9FAFC", color:C.txt, pointerEvents:"none", appearance:"none", backgroundImage:"none", cursor:"default" } : {};

  const handlePlanFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert("파일 용량은 10MB를 초과할 수 없습니다."); e.target.value = ""; return; }
    set("planFile", file);
    e.target.value = "";
  };

  return (
    <>
    <UnsavedConfirm open={confirmOpen}
      onDiscard={() => { setConfirmOpen(false); resetForm(item); handleSave(); }}
      onSave={() => {
        if (!form.title.trim() || !form.kind || !form.insp.trim() || !form.due) { setConfirmOpen(false); return; }
        if (onSave) onSave({ ...form, id: item?.id, regUser: form.registrant, reg: form.regDt, st: item?.st || "요청" });
        setConfirmOpen(false); handleSave();
      }} />
    <SidePanel open={open}
      onClose={()=>{ if (editMode) setConfirmOpen(true); else onClose(); }}
      onOverlayClick={()=>{ if (editMode) setConfirmOpen(true); else onClose(); }}
      title={isNew ? "특별점검 등록" : "특별점검 상세"} width={580} noScroll>

      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

      {/* ── 점검계획 ── */}
      <SecTitle label="점검계획" primary />

      <FormRow label="점검 제목" required>
        <FInput style={{ ...roS }} value={form.title}
          onChange={e=>set("title",e.target.value)} placeholder="특별점검 제목을 입력하세요"
          readOnly={ro} maxLength={100} />
      </FormRow>

      {/* 3단: 점검종류, 등록자, 등록일 */}
      <div style={{ display:"flex", gap:12 }}>
        <FormRow label="점검 종류" required style={{ flex:1 }}>
          <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }}
            value={form.kind} onChange={e=>set("kind",e.target.value)}>
            {SPEC_KINDS.map(k=><option key={k} value={k}>{k}</option>)}
          </RoSelect>
        </FormRow>
        <FormRow label="등록자" style={{ flex:1 }}>
          <FInput style={{ background:"#F9FAFC", pointerEvents:"none" }} value={form.registrant} readOnly />
        </FormRow>
        <FormRow label="등록일" style={{ flex:1 }}>
          <FInput style={{ background:"#F9FAFC", pointerEvents:"none" }} value={form.regDt} readOnly />
        </FormRow>
      </div>

      {/* 2단: 점검기한(1) + 점검자(2) */}
      <div style={{ display:"flex", gap:12 }}>
        <FormRow label="점검기한" required style={{ flex:1 }}>
          <DatePicker value={form.due} onChange={v=>set("due",v)} readOnly={ro} />
        </FormRow>
        <FormRow label="점검자" required style={{ flex:2, position:"relative" }}>
          {ro ? (
            <FInput style={{ ...roS }} value={form.insp} readOnly />
          ) : (
            <div style={{ position:"relative" }}>
              <FInput
                value={inspSearch || form.insp}
                onChange={e => { setInspSearch(e.target.value); if (!e.target.value) set("insp",""); }}
                onFocus={() => { if (form.insp) setInspSearch(form.insp); }}
                placeholder="이름 또는 아이디 검색"
                style={{ paddingRight: 28 }}
              />
              {(inspSearch || form.insp) && (
                <span onClick={()=>{ set("insp",""); setInspSearch(""); }}
                  style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)",
                    cursor:"pointer", color:C.txL, fontSize:16, lineHeight:1 }}>×</span>
              )}
              {/* 드롭다운 목록 */}
              {inspSearch && (() => {
                const q = inspSearch.trim().toLowerCase();
                const filtered = USERS.filter(u => u.useYn==="Y" && (
                  u.userNm.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q)
                ));
                if (!filtered.length) return (
                  <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:200,
                    background:"#fff", border:`1px solid ${C.brd}`, borderRadius:6,
                    boxShadow:"0 4px 16px rgba(0,0,0,.1)", fontSize:12, padding:"8px 12px", color:C.txL }}>
                    검색 결과가 없습니다.
                  </div>
                );
                return (
                  <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:200,
                    background:"#fff", border:`1px solid ${C.brd}`, borderRadius:6,
                    boxShadow:"0 4px 16px rgba(0,0,0,.1)", maxHeight:180, overflowY:"auto" }}>
                    {filtered.map(u => (
                      <div key={u.userId}
                        onMouseDown={e=>{ e.preventDefault(); set("insp", u.userNm); setInspSearch(""); }}
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
                          cursor:"pointer", borderBottom:`1px solid ${C.brd}` }}
                        onMouseEnter={e=>e.currentTarget.style.background=C.priL}
                        onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                        <span style={{ fontSize:13, fontWeight:500, flex:1, color:C.txt }}>{u.userNm}</span>
                        <span style={{ fontSize:11, color:C.txL }}>{u.userId}</span>
                        <span style={{ fontSize:11, color:C.txS, background:"#F0F0F0", padding:"1px 6px", borderRadius:8 }}>{u.userRole}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </FormRow>
      </div>

      {/* ── 점검계획서 ── */}
      <FormRow label="점검계획서">
        {form.planFile ? (
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
            border:`1px solid ${C.brd}`, borderRadius:6, background:"#F9FAFC" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <span style={{ flex:1, fontSize:12, color:C.txt, fontWeight:500,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {form.planFile.name}
              {form.planFile.size && <span style={{ fontSize:12, color:C.txL, marginLeft:6 }}>
                ({(form.planFile.size/1024/1024).toFixed(1)} MB)
              </span>}
            </span>
            {!ro && (
              <span onClick={()=>set("planFile",null)}
                style={{ cursor:"pointer", color:C.txL, fontSize:18, lineHeight:1, flexShrink:0 }}
                title="파일 제거">×</span>
            )}
            {ro && (
              <span style={{ fontSize:12, color:C.pri, cursor:"pointer", fontWeight:600,
                padding:"2px 8px", border:`1px solid ${C.pri}`, borderRadius:4 }}>다운로드</span>
            )}
          </div>
        ) : (
          !ro ? (
            <label style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
              border:`2px dashed ${C.brd}`, borderRadius:6, cursor:"pointer",
              transition:"all .15s", background:"#fff" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.pri;e.currentTarget.style.background=C.priL+"44";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.brd;e.currentTarget.style.background="#fff";}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <span style={{ fontSize:12, color:C.txL }}>파일을 선택하거나 드래그하세요</span>
              <span style={{ fontSize:12, color:C.txL, marginLeft:"auto" }}>최대 10MB</span>
              <FInput type="file" style={{ display:"none" }} onChange={handlePlanFile} />
            </label>
          ) : (
            <div style={{ padding:"8px 12px", border:`1px solid ${C.brd}`, borderRadius:6,
              background:"#F9FAFC", fontSize:12, color:C.txL }}>첨부파일 없음</div>
          )
        )}
      </FormRow>

      <FormRow label="점검 목적">
        <FTextarea style={{ ...(ro?{ ...roS, resize:"none" }:{}) }}
          value={form.purpose} onChange={e=>set("purpose",e.target.value)}
          placeholder="점검의 목적을 입력하세요" readOnly={ro} maxLength={500} />
      </FormRow>
      <FormRow label="점검 내용">
        <FTextarea style={{ ...(ro?{ ...roS, resize:"none" }:{}) }}
          value={form.content} onChange={e=>set("content",e.target.value)}
          placeholder="점검 내용을 입력하세요" readOnly={ro} maxLength={500} />
      </FormRow>

      {/* ── 점검 결과 카드 ── */}
      {!isNew && !editMode && (() => {
        const nowStr = (() => {
          const n = new Date();
          const pad = v => String(v).padStart(2,"0");
          return `${n.getFullYear()}-${pad(n.getMonth()+1)}-${pad(n.getDate())} ${pad(n.getHours())}:${pad(n.getMinutes())}`;
        })();
        const resRo = true; // 점검결과는 센티널에서만 수정 가능, 편집모드에서도 읽기 전용
        const hasResult = isComp;

        /* ── 읽기 전용: 결과 카드 ── */
        if (resRo) return (
          <div style={{ border:"2px dashed #19973C",
            borderRadius:10, marginTop:20, background:"#fff",
            padding:"14px 16px" }}>

            {/* 공통 헤더: 타이틀 + 상태 레이블 */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontSize:13, fontWeight:700, color:C.txH }}>점검 결과</span>
              <span style={{ fontSize:12, fontWeight:700, padding:"2px 10px", borderRadius:10,
                background: SC[item?.st]?.b || "rgba(140,147,157,0.12)",
                color: SC[item?.st]?.t || "#6B7280",
                border:`1px solid ${SC[item?.st]?.t || "#6B7280"}33` }}>
                {item?.st || "—"}
              </span>
            </div>

            {/* 구분선 */}
            <div style={{ borderTop:`1px solid ${C.brd}`, marginBottom:0 }} />

            {hasResult ? (<>
              {/* 결과요약 본문 */}
              <div style={{ fontSize:14, fontWeight:500, color:C.txH,
                margin:"12px 0 10px", lineHeight:1.7, whiteSpace:"pre-wrap" }}>
                {form.resultContent || "—"}
              </div>

              {/* 메타 정보 */}
              <div style={{ paddingTop:10, borderTop:`1px solid ${C.brd}`, display:"flex", flexWrap:"wrap", gap:"4px 20px" }}>
                {[
                  ["보고자",  form.reporter || form.insp || "—"],
                  ["수행일자", form.execDt  || "—"],
                  ["제출일시", form.submitDt && form.submitDt !== "-" ? form.submitDt : "—"],
                ].map(([l,v]) => (
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:12, color:C.txL }}>{l}</span>
                    <span style={{ fontSize:12, fontWeight:600, color:C.txt }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* 점검보고서 */}
              <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${C.brd}` }}>
                <div style={{ fontSize:11, color:C.txL, marginBottom:6 }}>점검보고서 첨부파일</div>
                {form.reportFile ? (
                  <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
                    border:`1px solid ${C.brd}`, borderRadius:6, background:"#F9FAFC" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span style={{ flex:1, fontSize:12, color:C.txt, fontWeight:500,
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {form.reportFile.name}
                    </span>
                    <span style={{ fontSize:12, color:C.pri, cursor:"pointer", fontWeight:600,
                      padding:"2px 8px", border:`1px solid ${C.pri}`, borderRadius:4, flexShrink:0 }}>다운로드</span>
                  </div>
                ) : (
                  <div style={{ fontSize:12, color:C.txL }}>첨부파일 없음</div>
                )}
              </div>
            </>) : (
              /* 미보고 메시지 */
              <div style={{ padding:"20px 0", textAlign:"center", fontSize:13, color:C.txL }}>
                보고된 결과가 없습니다.
              </div>
            )}
          </div>
        );

        /* ── 입력 모드: 결과 입력 카드 ── */
        return (
          <div style={{ border:`2px dashed ${C.sec}`, borderRadius:10, padding:"14px 16px", marginTop:20, background:"#fff" }}>

            {/* 헤더 */}
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14,
              fontSize:12, fontWeight:700, color:C.sec }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.sec} strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              점검결과 입력
            </div>

            {/* 2단: 보고자 / 수행일자 / 제출예정 */}
            <div style={{ display:"flex", gap:12, marginBottom:12 }}>
              <FormRow label="보고자" style={{ flex:1 }}>
                <FInput style={{ background:"#F9FAFC", pointerEvents:"none" }} value={USERS[0]?.userNm || "현재 사용자"} readOnly />
              </FormRow>
              <FormRow label="수행일자" required style={{ flex:1 }}>
                <div style={{ border: errors.execDt ? "1.5px solid #ef4444" : "none", borderRadius:6 }}>
                  <DatePicker value={form.execDt}
                    onChange={v=>{ set("execDt",v); setErrors(p=>({...p,execDt:undefined})); }}
                    readOnly={false} />
                </div>
                {errors.execDt && <div style={{ fontSize:11, color:"#ef4444", marginTop:3 }}>수행일자를 입력하세요.</div>}
              </FormRow>
              <FormRow label="제출예정일시" style={{ flex:1 }}>
                <FInput value={nowStr} readOnly style={{ background:"#F9FAFC", color:C.txL, pointerEvents:"none" }} />
              </FormRow>
            </div>

            {/* 점검보고서 첨부 */}
            <FormRow label="점검보고서">
              {form.reportFile ? (
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px",
                  borderRadius:6, background:"#F0F7FF", border:`1px solid #BFDBFE` }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span style={{ flex:1, fontSize:12, fontWeight:500, color:C.txt,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{form.reportFile.name}</span>
                  <span onClick={()=>set("reportFile",null)}
                    style={{ cursor:"pointer", color:C.txL, fontSize:16, lineHeight:1 }} title="제거">×</span>
                </div>
              ) : (
                <label style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px",
                  border:`2px dashed ${errors.reportFile ? "#ef4444" : C.brd}`, borderRadius:6,
                  cursor:"pointer", transition:"all .15s", background: errors.reportFile ? "#fff5f5" : "#fff" }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.pri; e.currentTarget.style.background=C.priL+"44"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=errors.reportFile?"#ef4444":C.brd; e.currentTarget.style.background=errors.reportFile?"#fff5f5":"#fff"; }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  <span style={{ fontSize:12, color:C.txL }}>파일을 선택하거나 드래그하세요</span>
                  <span style={{ fontSize:11, color:C.txL, marginLeft:"auto" }}>최대 10MB</span>
                  <FInput type="file" style={{ display:"none" }} onChange={e=>{
                    const f=e.target.files?.[0]; if(!f) return;
                    if(f.size>10*1024*1024){ alert("파일 용량은 10MB를 초과할 수 없습니다."); e.target.value=""; return; }
                    set("reportFile",f); setErrors(p=>({...p,reportFile:undefined})); e.target.value="";
                  }} />
                </label>
              )}
              {errors.reportFile && <div style={{ fontSize:11, color:"#ef4444", marginTop:3 }}>점검보고서를 첨부하세요.</div>}
            </FormRow>

            {/* 결과요약 */}
            <FormRow label="결과요약" required>
              <FTextarea
                style={{ background:"#fff", resize:"vertical", minHeight:80,
                  ...(errors.resultContent ? { border:"1.5px solid #ef4444" } : {}) }}
                value={form.resultContent}
                onChange={e=>{ set("resultContent",e.target.value); setErrors(p=>({...p,resultContent:undefined})); }}
                placeholder="점검 결과를 요약하여 입력하세요"
                maxLength={1000} />
              {errors.resultContent && <div style={{ fontSize:11, color:"#ef4444", marginTop:3 }}>결과요약을 입력하세요.</div>}
              <div style={{ textAlign:"right", fontSize:11, color:C.txL, marginTop:3 }}>{form.resultContent?.length || 0} / 1000</div>
            </FormRow>
          </div>
        );
      })()}

      </div>{/* /바디 */}

      {/* 푸터 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        {/* 완료 점검 안내 메시지 */}
        {!isNew && !editMode && isComp && (
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12,
            padding:"8px 12px", borderRadius:6, background:"#F0FDF4", border:"1px solid #bbf7d0" }}>
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
            </svg>
            <span style={{ fontSize:12, color:"#15803d" }}>
              점검 보고가 완료된 점검은 수정 및 삭제가 불가능합니다.
            </span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          {(isNew || editMode) ? (
            <>
              <Btn onClick={() => { resetForm(item); handleSave(); }}>취소</Btn>
              <div style={{ flex: 1 }} />
              <Btn primary onClick={() => {
                if (!form.title.trim()) { alert("점검 제목을 입력하세요."); return; }
                if (!form.kind) { alert("점검 종류를 선택하세요."); return; }
                if (!form.insp.trim()) { alert("점검자를 선택하세요."); return; }
                if (!form.due) { alert("점검기한을 선택하세요."); return; }
                if (onSave) onSave({
                  ...form,
                  id:      item?.id,
                  regUser: form.registrant,
                  reg:     form.regDt,
                  st:      item?.st || "요청",
                });
                handleSave();
                if (!isNew) onClose();
              }}>{isNew ? "등록" : "저장"}</Btn>
            </>
          ) : (
            <>
              <Btn onClick={onClose}>닫기</Btn>
              <div style={{ flex: 1 }} />
              <Btn danger disabled={isComp} onClick={() => !isComp && setDeleteConfirm(true)} style={{ opacity: isComp ? 0.4 : 1, cursor: isComp ? "not-allowed" : "pointer" }}>삭제</Btn>
              <Btn success style={{ marginLeft: 8, opacity: isComp ? 0.4 : 1, cursor: isComp ? "not-allowed" : "pointer" }} onClick={() => !isComp && startEdit()}>수정</Btn>
            </>
          )}
        </div>
      </div>
    </SidePanel>
    <ConfirmModal open={deleteConfirm}
      title="특별점검 삭제"
      msg={<span><b>{form.title}</b> 점검을 삭제하시겠습니까?<br/><span style={{fontSize:12,color:"#6B7280"}}>삭제된 데이터는 복구할 수 없습니다.</span></span>}
      okLabel="삭제"
      onOk={() => { setDeleteConfirm(false); onDelete?.(item); onClose(); }}
      onCancel={() => setDeleteConfirm(false)} />
    </>
  );
};
const SchedulePanel = ({ open, onClose, item, onDelete, onUpdate, onAdd }) => {
  const isNew = !item;
  const { editMode, confirmOpen, startEdit, handleDiscard, handleSaveConfirm, handleSave, handleCancel, setConfirmOpen } = useEditPanel(open, onClose);
  const ro = !!item && !editMode;
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const FREQ_OPTS = [
    { value:"매일", desc:"매일 배치 실행" },
    { value:"매주", desc:"매주 월요일 배치 실행" },
    { value:"매월", desc:"매월 1일 배치 실행" },
    { value:"분기", desc:"매 분기 시작월의 1일 배치 실행" },
    { value:"반기", desc:"반기 시작월의 1일 배치 실행" },
    { value:"연간", desc:"연 초 1회 배치 실행" },
  ];
  const FREQ_COLOR = { "매일":"#0C8CE9","매주":"#19973C","매월":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333333" };

  const emptyForm = {
    nm:"", st:"사용", clId:"", sysId:"", resources:[],
    _resCat:"", _resSmall:"", _resSearch:"",
    freq:"매일",
    batchStartTime:"06:00", batchMin:30,
    rptDdlnHr: 24,                              // DB: rpt_ddln_hr (보고기한시간)
    startDt: new Date().toISOString().slice(0,10),
    lastRunDt:"", nextRunDt:""
  };
  const [form, setForm] = useState(emptyForm);
  const initialFormRef = useRef(null);

  useEffect(() => {
    if (open && item) {
      const sid    = SYS.find(s => s.nm === item.sysNm)?.id || "";
      const cid    = CL_INIT.find(c => c.nm === item.clNm)?.id   || "";
      const resIds = RES.filter(r => r.sysId === sid).slice(0, item.resCnt).map(r => r.id);
      const loaded = {
        ...emptyForm,
        nm: item.nm, st: item.useYn === "Y" ? "사용" : "미사용",
        sysId: sid, clId: cid,
        freq: item.freq || "매일",
        batchStartTime: item.batchStartTime || "06:00",
        batchMin:       item.batchMin       || 30,
        rptDdlnHr:      item.rptDdlnHr      ?? 24,
        startDt:        item.startDt        || new Date().toISOString().slice(0,10),
        resources: resIds,
        lastRunDt: item.last || "", nextRunDt: item.next || "",
      };
      setForm(loaded);
      initialFormRef.current = loaded;
    }
    if (open && !item) { setForm(emptyForm); initialFormRef.current = emptyForm; }
  }, [open, item]);

  // 수정 시작 시 초기 스냅샷 갱신
  useEffect(() => {
    if (editMode) initialFormRef.current = form;
  }, [editMode]);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nm.trim())        e.nm        = "스케줄 명은 필수입니다.";
    if (!form.startDt)          e.startDt   = "시작일은 필수입니다.";
    if (!form.batchStartTime)   e.batchStartTime = "배치시작시간은 필수입니다.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const isDirty = () => {
    if (!initialFormRef.current) return false;
    const init = initialFormRef.current;
    const keys = ["nm","st","clId","sysId","freq","batchStartTime","batchMin","rptDdlnHr","startDt"];
    if (keys.some(k => form[k] !== init[k])) return true;
    if (JSON.stringify(form.resources) !== JSON.stringify(init.resources)) return true;
    return false;
  };

  // 취소: 변경 없으면 읽기모드 복귀 / 변경 있으면 컨펌
  const handleCancelEdit = () => {
    if (isDirty()) { setConfirmOpen(true); }
    else { handleSave(); } // editMode 해제 (저장 없이)
  };

  // 외부 클릭 / X 닫기: 수정모드+변경 있을 때만 컨펌
  const handlePanelClose = () => {
    if (editMode && isDirty()) { setConfirmOpen(true); }
    else if (editMode) { handleSave(); } // 변경 없으면 바로 읽기모드
    else { onClose(); }
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const roS   = ro ? { background:"#F9FAFC", color:C.txt, pointerEvents:"none" } : {};
  const roSel = ro ? { background:"#F9FAFC", color:C.txt, pointerEvents:"none", appearance:"none", backgroundImage:"none", cursor:"default" } : {};

  const selFreq = FREQ_OPTS.find(f => f.value === form.freq) || FREQ_OPTS[0];
  const freqCol = FREQ_COLOR[form.freq] || C.txS;

  return (
    <>
    <SidePanel open={open} onClose={handlePanelClose} onOverlayClick={handlePanelClose}
      title={isNew ? "점검스케줄 추가" : "점검스케줄 상세"} width={580} noScroll>

      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>





      {/* ── 스케줄 기본 정보 ── */}
      <div style={{ marginBottom:18 }}>
        <SecTitle label="스케줄 정보" primary />

        {/* 1단: 설정된 스케줄 정보 (써머리) — 스케줄명 상단 */}
        {(() => {
          const dt    = form.startDt ? new Date(form.startDt) : null;
          const WEEK  = ["일","월","화","수","목","금","토"];
          const pad   = n => String(n).padStart(2,"0");
          let summary = "";
          if (dt && !isNaN(dt)) {
            const m  = dt.getMonth() + 1;
            const d  = dt.getDate();
            const wd = WEEK[dt.getDay()];
            const mm = pad(m), dd = pad(d);
            if      (form.freq === "매일") summary = `매일 배치 (${mm}/${dd} 시작)`;
            else if (form.freq === "매주") summary = `매주 ${wd}요일 배치 (${mm}/${dd} 시작)`;
            else if (form.freq === "매월") summary = `매월 ${d}일 배치 (${mm}/${dd} 시작)`;
            else if (form.freq === "분기") summary = `3개월마다 ${d}일 배치 (${mm}/${dd} 시작)`;
            else if (form.freq === "반기") summary = `6개월마다 ${d}일 배치 (${mm}/${dd} 시작)`;
            else if (form.freq === "연간") summary = `매년 ${m}월 ${d}일 배치 (${mm}/${dd} 시작)`;
          } else {
            summary = selFreq.desc;
          }
          return (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
              borderRadius:6, background: freqCol+"0D", border:`1px solid ${freqCol}33`, marginBottom:14 }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5A5.5 5.5 0 1 0 7 12.5 5.5 5.5 0 0 0 7 1.5zm.5 8H6.5V6.5h1V9.5zm0-4H6.5v-1h1v1z" fill={freqCol}/>
              </svg>
              <span style={{ fontSize:12, color:freqCol, fontWeight:600 }}>{summary}</span>
            </div>
          );
        })()}

        {/* 사용/미사용 */}
        <FormRow label="사용유무">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div onClick={() => !ro && set("st", form.st === "사용" ? "미사용" : "사용")}
              style={{ position:"relative", width:44, height:24, borderRadius:12,
                cursor: ro ? "default" : "pointer", opacity: ro ? 0.6 : 1,
                background: form.st === "사용" ? C.pri : "#D1D5DB", transition:"background .2s" }}>
              <div style={{ position:"absolute", top:2, left: form.st === "사용" ? 22 : 2,
                width:20, height:20, borderRadius:"50%", background:"#fff",
                boxShadow:"0 1px 3px rgba(0,0,0,.2)", transition:"left .2s" }} />
            </div>
            <span style={{ fontSize:13, color: form.st === "사용" ? C.pri : C.txL, fontWeight:500, opacity: ro ? 0.6 : 1 }}>
              {form.st === "사용" ? "사용" : "미사용"}
            </span>
          </div>
        </FormRow>

        {/* 1단: 스케줄명 */}
        <FormRow label="스케줄 명" required>
          <FInput style={{ ...roS, ...(errors.nm ? { borderColor:"#ef4444" } : {}) }} value={form.nm} onChange={e => { set("nm", e.target.value); if (errors.nm) setErrors(p=>({...p,nm:""})); }} placeholder="스케줄 이름" readOnly={ro} maxLength={100} />
          {errors.nm && <div style={{ color:"#ef4444", fontSize:11, marginTop:3 }}>{errors.nm}</div>}
        </FormRow>

        {/* 1단: 실행주기 */}
        <div style={{ marginBottom:14 }}>
          <label style={{ ...LABEL_STYLE }}>
            실행주기 <span style={{ color:"#ef4444" }}>*</span>
          </label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {FREQ_OPTS.filter(f => !ro || form.freq === f.value).map(f => {
              const active = form.freq === f.value;
              const col    = FREQ_COLOR[f.value];
              return (
                <button key={f.value}
                  onClick={() => !ro && set("freq", f.value)}
                  style={{ padding:"5px 16px", borderRadius:20, fontSize:12, fontWeight:700,
                    border:`1.5px solid ${active ? col : C.brd}`,
                    background: active ? col+"1A" : "#fff",
                    color: active ? col : C.txS,
                    cursor: ro ? "default" : "pointer", transition:"all .15s" }}>
                  {f.value}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3단: 시작일 / 배치시작시간 / 예상소요시간(분) */}
        <div style={{ display:"flex", gap:12, marginBottom:14 }}>
          <div style={{ flex:1 }}>
            <FormRow label="시작일" required>
              <DatePicker value={form.startDt || ""}
                onChange={v => { set("startDt", v); if (errors.startDt) setErrors(p=>({...p,startDt:""})); }} readOnly={ro} />
              {errors.startDt && <div style={{ color:"#ef4444", fontSize:11, marginTop:3 }}>{errors.startDt}</div>}
            </FormRow>
          </div>
          <div style={{ flex:1 }}>
            <FormRow label="배치시작시간" required>
              <FInput type="time" style={{ ...roS }} value={form.batchStartTime}
                onChange={e => set("batchStartTime", e.target.value)} readOnly={ro} />
            </FormRow>
          </div>
          <div style={{ flex:1 }}>
            <FormRow label="예상소요시간(분)" required>
              <FInput type="number" min={10} max={300} style={{ ...roS }}
                value={form.batchMin}
                onChange={e => set("batchMin", Math.min(300, Math.max(10, +e.target.value)))}
                readOnly={ro} />
              {!ro && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
                  {[10,30,60].map(m => {
                    const active = form.batchMin === m;
                    return (
                      <button key={m} onClick={() => set("batchMin", m)}
                        style={{ padding:"2px 8px", fontSize:12, fontWeight:600, borderRadius:4,
                          border:`1px solid ${active ? C.pri : C.brd}`,
                          background: active ? C.priL : "#fff",
                          color: active ? C.pri : C.txS,
                          cursor: "pointer", transition:"all .15s" }}>
                        {m}분
                      </button>
                    );
                  })}
                </div>
              )}
            </FormRow>
          </div>
        </div>

        {/* 1단: 설정된 스케줄 정보는 상단으로 이동됨 */}

      </div>

        <SecTitle label="대상 자원 정보" />
        {/* 대상 자원 — 좌: 선택된 자원 / 우: 검색+선택 */}
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>

          {/* 좌: 선택된 자원 */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <div style={{ fontSize:12, fontWeight:600, color:C.txS }}>
                선택된 자원
              </div>
              <span style={{ fontSize:11, color:C.txL }}>{form.resources.length}개 {ro?"연결됨":"선택됨"}</span>
            </div>
            <div style={{ border:`1px solid ${C.brd}`, borderRadius:8, minHeight:80, background:"#FAFCFF", overflow:"hidden" }}>
              {form.resources.length === 0 ? (
                <div style={{ padding:"20px 12px", textAlign:"center", fontSize:12, color:C.txL }}>
                  {ro ? "연결된 자원 없음" : "자원을 선택하세요 →"}
                </div>
              ) : (
                <div style={{ maxHeight:220, overflowY:"auto" }}>
                  {form.resources.map(rid => {
                    const r  = RES.find(x => x.id === rid);
                    if (!r) return null;
                    const cl = CL_INIT.find(c => c.sub === r.mid);
                    return (
                      <div key={rid} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 10px", borderBottom:`1px solid ${C.brd}`, fontSize:12 }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:600, color:C.priD, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.nm}</div>
                          <div style={{ fontSize:11, color:C.txL, marginTop:1 }}>{r.mid} · {r.ip||"—"}</div>
                        </div>
                        <span style={{ fontSize:11, padding:"1px 6px", borderRadius:6, fontWeight:600, flexShrink:0, background:cl?"#dcfce7":"#FEF2F2", color:cl?"#166534":"#DC2626" }}>
                          {cl ? cl.nm : "—"}
                        </span>
                        {!ro && (
                          <span onClick={() => set("resources", form.resources.filter(x => x !== rid))}
                            style={{ cursor:"pointer", fontSize:14, color:C.txL, lineHeight:1, flexShrink:0, padding:"0 2px" }}>×</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {!ro && form.resources.length > 1 && (
                <div style={{ padding:"5px 10px", borderTop:`1px solid ${C.brd}`, textAlign:"right" }}>
                  <span onClick={() => set("resources",[])} style={{ fontSize:11, color:C.red, cursor:"pointer" }}>전체 해제</span>
                </div>
              )}
            </div>
          </div>

          {/* 우: 자원 검색 + 목록 */}
          {!ro && (
          <div style={{ flex:"0 0 55%", minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, color:C.txS, marginBottom:6 }}>
              자원 검색 <span style={{ color:"#ef4444" }}>*</span>
            </div>
            {(() => {
              const sysRes    = form.sysId ? RES.filter(r => r.sysId === form.sysId) : RES;
              const mids      = Array.from(new Set(sysRes.map(r => r.mid))).sort();
              const midVal    = form._resCat    || "";
              const smallRes  = midVal ? sysRes.filter(r => r.mid === midVal) : sysRes;
              const smalls    = Array.from(new Set(smallRes.map(r => r.small))).sort();
              const smallVal  = form._resSmall  || "";
              const searchVal = form._resSearch || "";
              const availRes  = sysRes.filter(r => {
                if (form.resources.includes(r.id)) return false;
                if (midVal   && r.mid   !== midVal)   return false;
                if (smallVal && r.small !== smallVal)  return false;
                if (searchVal && !r.nm.toLowerCase().includes(searchVal.toLowerCase()) && !(r.ip||"").includes(searchVal)) return false;
                return true;
              });
              return (
                <div style={{ border:`1px solid ${C.brd}`, borderRadius:8, overflow:"hidden" }}>
                  {/* 1행: 정보시스템 · 중분류 · 소분류 */}
                  <div style={{ padding:"7px 8px", background:"#F9FAFC", display:"flex", gap:5, borderBottom:`1px solid ${C.brd}` }}>
                    <FSelect style={{ flex:1, padding:"3px 6px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", minWidth:0 }}
                      value={form.sysId} onChange={e => { set("sysId",e.target.value); set("resources",[]); set("_resCat",""); set("_resSmall",""); set("_resSearch",""); }}>
                      <option value="">정보시스템</option>
                      {SYS.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
                    </FSelect>
                    <FSelect style={{ flex:1, padding:"3px 6px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", minWidth:0 }}
                      value={midVal} onChange={e => { set("_resCat",e.target.value); set("_resSmall",""); }}>
                      <option value="">중분류</option>
                      {mids.map(c => <option key={c} value={c}>{c}</option>)}
                    </FSelect>
                    <FSelect style={{ flex:1, padding:"3px 6px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", minWidth:0 }}
                      value={smallVal} onChange={e => set("_resSmall",e.target.value)}>
                      <option value="">소분류</option>
                      {smalls.map(s => <option key={s} value={s}>{s}</option>)}
                    </FSelect>
                  </div>
                  {/* 2행: 검색박스 */}
                  <div style={{ padding:"6px 8px", background:"#F9FAFC", borderBottom:`1px solid ${C.brd}` }}>
                    <div style={{ position:"relative" }}>
                      <FInput style={{ width:"100%", padding:"3px 6px 3px 22px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:4, outline:"none", boxSizing:"border-box" }}
                        placeholder="자원명·IP 검색" value={searchVal} onChange={e => set("_resSearch",e.target.value)} />
                      <span style={{ position:"absolute", left:6, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}><Ic n="search" s={11} c={C.txL} /></span>
                      {searchVal && <span onClick={() => set("_resSearch","")} style={{ position:"absolute", right:5, top:"50%", transform:"translateY(-50%)", cursor:"pointer", fontSize:11, color:C.txL }}>×</span>}
                    </div>
                  </div>
                  <div style={{ maxHeight:220, overflowY:"auto" }}>
                    {availRes.length === 0
                      ? <div style={{ padding:14, textAlign:"center", fontSize:12, color:C.txL }}>{searchVal||midVal||smallVal||form.sysId?"조건에 맞는 자원 없음":"추가 가능한 자원 없음"}</div>
                      : availRes.map(r => {
                          const cl = CL_INIT.find(c => c.sub === r.mid);
                          const dis = !cl;
                          return (
                            <div key={r.id}
                              onClick={() => !dis && set("resources",[...form.resources, r.id])}
                              style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 10px", borderBottom:`1px solid ${C.brd}`, cursor:dis?"not-allowed":"pointer", fontSize:12, opacity:dis?0.5:1, background:dis?"#FAFAFA":"" }}
                              onMouseEnter={e => { if (!dis) e.currentTarget.style.background="#f0fdf4"; }}
                              onMouseLeave={e => { e.currentTarget.style.background=dis?"#FAFAFA":""; }}>
                              <span style={{ color:dis?C.txL:C.pri, fontWeight:700, fontSize:13, flexShrink:0 }}>+</span>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:dis?C.txL:C.txt }}>{r.nm}</div>
                                <div style={{ fontSize:11, color:C.txL, marginTop:1 }}>{r.mid} · {r.small} · {r.ip||"—"}</div>
                              </div>
                              <span style={{ fontSize:11, padding:"1px 6px", borderRadius:6, fontWeight:600, flexShrink:0, background:cl?"#dcfce7":"#FEF2F2", color:cl?"#166534":"#DC2626" }}>
                                {cl ? cl.nm : "점검표 없음"}
                              </span>
                            </div>
                          );
                        })
                    }
                  </div>
                  {availRes.length > 0 && <div style={{ padding:"3px 10px", fontSize:11, color:C.txL, textAlign:"center", background:"#F9FAFC", borderTop:`1px solid ${C.brd}` }}>{availRes.length}개 추가 가능</div>}
                </div>
              );
            })()}
          </div>
          )}

        </div>

      {/* ── 수행 이력 (상세) ── */}
      {ro && (
        <div style={{ marginBottom:18, marginTop:6 }}>
          <SecTitle label="수행 이력" />
          <div style={{ display:"flex", gap:12 }}>
            <FormRow label="마지막 수행 일시" half>
              <FInput style={{ ...roS }} value={form.lastRunDt || "—"} readOnly />
            </FormRow>
            <FormRow label="다음 수행 예정일" half>
              <FInput style={{ ...roS }} value={form.nextRunDt || "—"} readOnly />
            </FormRow>
          </div>
        </div>
      )}
      </div>{/* /바디 */}

      {/* 푸터 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        {/* 삭제 불가 안내 메시지 */}
        {!isNew && !editMode && form.resources.length > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10,
            padding:"8px 12px", borderRadius:6, background:"#FFF7ED", border:"1px solid #FED7AA" }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
            </svg>
            <span style={{ color:"#9A3412", fontSize:12 }}>
              연결된 자원이 있어 삭제할 수 없습니다. 자원 연결을 해제한 후 삭제하세요.
            </span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          {(isNew || editMode) ? (
            <>
              <Btn onClick={isNew ? handleCancel : handleCancelEdit}>취소</Btn>
              <div style={{ flex: 1 }} />
              <Btn primary onClick={() => {
                if (!validate()) return;
                if (isNew) { onAdd?.(form); onClose(); }
                else { onUpdate?.(form); handleSave(); }
              }}>{isNew ? "등록" : "저장"}</Btn>
            </>
          ) : (
            <>
              <Btn onClick={onClose}>닫기</Btn>
              <div style={{ flex: 1 }} />
              <Btn danger disabled={form.resources.length > 0}
                onClick={() => form.resources.length === 0 && setDeleteConfirm(true)}
                style={{ marginRight:8 }}>삭제</Btn>
              <Btn success onClick={startEdit}>수정</Btn>
            </>
          )}
        </div>
      </div>
    </SidePanel>
    <ConfirmModal open={deleteConfirm} title="스케줄 삭제"
      msg={<><strong>{item?.nm}</strong> 스케줄이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</>}
      okLabel="삭제" onOk={() => { setDeleteConfirm(false); onDelete?.(item); onClose(); }} onCancel={() => setDeleteConfirm(false)} />
    <UnsavedConfirm open={confirmOpen}
      onDiscard={() => { setConfirmOpen(false); if (initialFormRef.current) setForm(initialFormRef.current); handleSave(); }}
      onSave={() => { if (!validate()) return; onUpdate?.(form); handleSaveConfirm(); }} />
    </>
  );
};
const MgrInspSch = ({ toast }) => {
  const [schList, setSchList] = useState(SCH);
  const [showAdd, setShowAdd] = useState(false);
  const [selItem, setSelItem] = useState(null);
  const [searchQ,   setSearchQ]   = useState("");
  const [appliedQ,  setAppliedQ]  = useState("");

  const doSearch = () => setAppliedQ(searchQ.trim());
  const doReset  = () => { setSearchQ(""); setAppliedQ(""); };

  const handleDelete = (item) => {
    setSchList(prev => prev.filter(s => s.id !== item.id));
    setSelItem(null);
    toast?.("스케줄이 삭제되었습니다.", false);
  };

  const handleAdd = (form) => {
    const newItem = {
      id:             Date.now(),
      nm:             form.nm,
      sysNm:          SYS.find(s => s.id === form.sysId)?.nm || "",
      clNm:           CL_INIT.find(c => c.id === form.clId)?.nm || "",
      useYn:          form.st === "사용" ? "Y" : "N",
      freq:           form.freq,
      batchStartTime: form.batchStartTime,
      batchMin:       form.batchMin,
      rptDdlnHr:      form.rptDdlnHr,
      resCnt:         form.resources.length,
      next:           "—",
    };
    setSchList(prev => [newItem, ...prev]);
    setShowAdd(false);
    toast?.("스케줄이 등록되었습니다.");
  };

  const handleUpdate = (form) => {
    setSchList(prev => prev.map(s => s.id === selItem?.id ? {
      ...s,
      nm:             form.nm,
      useYn:          form.st === "사용" ? "Y" : "N",
      freq:           form.freq,
      batchStartTime: form.batchStartTime,
      batchMin:       form.batchMin,
      resCnt:         form.resources.length,
    } : s));
    setSelItem(prev => prev ? {
      ...prev,
      nm:             form.nm,
      useYn:          form.st === "사용" ? "Y" : "N",
      freq:           form.freq,
      batchStartTime: form.batchStartTime,
      batchMin:       form.batchMin,
      resCnt:         form.resources.length,
    } : prev);
    toast?.("스케줄이 저장되었습니다.");
  };

  const filtered = appliedQ
    ? schList.filter(r =>
        r.nm?.includes(appliedQ) ||
        r.sysNm?.includes(appliedQ) ||
        r.clNm?.includes(appliedQ)
      )
    : schList;

  return <div>
    <PH title="점검스케줄" bc="홈 > 점검현황 > 점검스케줄" />
    <SB ph="스케줄명, 시스템명, 점검표명 검색" onSearch={doSearch} onReset={doReset}>
      <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
        <span style={{ ...LABEL_STYLE_SM }}>키워드</span>
        <FInput
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && doSearch()}
          placeholder="스케줄명, 시스템명, 점검표명"
          style={{ ...fInput, minWidth: 200 }}
        />
      </div>
    </SB>

    {/* ── 배치 현황 타임라인 ── */}
    {(() => {
      // SCH에서 사용 중(useYn=Y)이고 배치시작시간이 설정된 항목만 필터링
    const allSch = SCH.filter(s => s.useYn === "Y" && s.batchStartTime);
    // 24시간 슬롯 (00~23시)
    const slots = Array.from({ length: 24 }, (_, h) => {
      const hh = String(h).padStart(2,"0");
      const inSlot = allSch.filter(s => s.batchStartTime.startsWith(hh));
      return { h, hh, items: inSlot };
    });
    const busyHours = slots.filter(s => s.items.length > 0);
    const FREQ_COL = { "매일":"#0C8CE9","매주":"#19973C","매월":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333","상시":"#0891B2" };
    return (
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.txS, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
          <Ic n="clock" s={13} c={C.txS} />
          현재 등록된 배치 현황
          <span style={{ fontSize:11, fontWeight:400, color:C.txL }}>— 사용 중인 스케줄 {allSch.length}개</span>
        </div>
        {/* 타임라인 바 */}
        <div style={{ background:"#F8FAFC", border:`1px solid ${C.brd}`, borderRadius:8, padding:"12px 14px" }}>
          {/* 시간축 */}
          <div style={{ display:"flex", position:"relative", height:28, marginBottom:6 }}>
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} style={{ flex:1, position:"relative" }}>
                {h % 3 === 0 && (
                  <span style={{ position:"absolute", left:0, top:0, fontSize:9, color:C.txL, transform:"translateX(-50%)", whiteSpace:"nowrap" }}>
                    {String(h).padStart(2,"0")}:00
                  </span>
                )}
              </div>
            ))}
          </div>
          {/* 배치 블록 */}
          <div style={{ display:"flex", position:"relative", height:22, background:"#EEF0F5", borderRadius:4, overflow:"visible" }}>
            {allSch.map((s, i) => {
              const [hh, mm] = s.batchStartTime.split(":").map(Number);
              const startPct = ((hh * 60 + mm) / 1440) * 100;
              const widthPct = Math.max((s.batchMin / 1440) * 100, 0.8);
              const col = FREQ_COL[s.freq] || C.pri;
              return (
                <div key={s.id} title={`${s.nm}
  ${s.batchStartTime} ~ +${s.batchMin}분 (${s.freq})`}
                  style={{ position:"absolute", left:`${startPct}%`, width:`${widthPct}%`, minWidth:4,
                    height:"100%", borderRadius:3, background:col, opacity:0.82,
                    cursor:"default", transition:"opacity .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.opacity="1"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="0.82"} />
              );
            })}
          </div>
          {/* 혼잡 시간대 요약 */}
          {busyHours.length > 0 && (
            <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:6 }}>
              {busyHours.map(slot => (
                <div key={slot.h} style={{ display:"flex", alignItems:"center", gap:4,
                  padding:"3px 8px", borderRadius:5, background:"#fff", border:`1px solid ${C.brd}` }}>
                  <span style={{ fontWeight:700, color:C.txH, fontFamily:"inherit", fontSize:12 }}>{slot.hh}시</span>
                  <span style={{ color:C.txL, fontSize:12 }}>·</span>
                  <span style={{ color:C.txS, fontSize:12 }}>{slot.items.length}건</span>
                  <div style={{ display:"flex", gap:2, marginLeft:2 }}>
                    {slot.items.slice(0,3).map(s => (
                      <span key={s.id} style={{ width:6, height:6, borderRadius:2,
                        background: FREQ_COL[s.freq] || C.pri, display:"inline-block" }} />
                    ))}
                    {slot.items.length > 3 && <span style={{ fontSize:12, color:C.txL }}>+{slot.items.length-3}</span>}
                  </div>
                </div>
              ))}
              {(() => {
                const peakSlot = busyHours.reduce((a,b) => a.items.length >= b.items.length ? a : b);
                return peakSlot.items.length >= 2 ? (
                  <div style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 8px",
                    borderRadius:5, background:"#FEF3C7", border:"1px solid #F59E0B", fontSize:12, color:"#92400E" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span><b>{peakSlot.hh}시</b> 집중 ({peakSlot.items.length}건) — 시간대 분산을 권장합니다</span>
                  </div>
                ) : null;
              })()}
          </div>
        )}
      </div>
    </div>
  );
    })()}

    {filtered.length === 0 ? (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:"60px 0", color:C.txL, gap:10 }}>
        <span style={{ fontSize:32 }}>🗓️</span>
        <div style={{ fontSize:15, fontWeight:600, color:C.txS }}>검색 결과가 없습니다</div>
        <div style={{ fontSize:12 }}>
          <span style={{ fontWeight:600, color:C.txt }}>"{appliedQ}"</span>에 해당하는 스케줄이 없습니다.
        </div>
        <button onClick={doReset}
          style={{ marginTop:4, padding:"6px 16px", borderRadius:6, border:`1px solid ${C.brd}`,
            background:"#fff", color:C.txS, fontSize:12, cursor:"pointer" }}>
          🔄 초기화
        </button>
      </div>
    ) : (
      <Tbl secTitle="점검스케줄 목록" secCount={filtered.length} secButtons={<SecBtnP onClick={() => setShowAdd(true)}>+ 스케줄 추가</SecBtnP>} onRow={row => setSelItem(row)} cols={[
        { t: "상태", k: "useYn", w: 80, r: v => <YnBadge v={v} /> },
        { t: "스케줄명", k: "nm", mw: 200, align: "left", r: v => <span style={{ fontWeight: 600, color: C.pri }}>{v}</span> },
        { t: "실행주기", k: "freq", w: 90, r: v => {
          const map = { "매일":"#0C8CE9","매주":"#19973C","매월":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333333","상시":"#0891B2" };
          const color = map[v] || C.txS;
          return <span style={{ display:"inline-block", padding:"2px 12px", borderRadius:10, fontSize:12, fontWeight:700, background:color+"1A", color }}>{v}</span>;
        }},
        { t: "배치시작시간", k: "batchStartTime", w: 100 },
        { t: "예상소요시간", k: "batchMin", w: 90, r: v => `${v}분` },
        { t: "자원수", k: "resCnt", w: 70 },
        { t: "다음 수행", k: "next" },
      ]} data={filtered} />
    )}
    <SchedulePanel open={showAdd} onClose={() => setShowAdd(false)} item={null} onAdd={handleAdd} />
    <SchedulePanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} onDelete={handleDelete} onUpdate={handleUpdate} />
  </div>;
};

/* ── Inspection Filter Sidebar ── */
const _dailyMenu = [
  { k: null, l: "전체현황" },
  { k: "상태점검", l: "상태점검", c: ["서버","WEB","WAS","DBMS","네트워크","보안장비","스토리지","백업"] },
  { k: "유효성점검", l: "유효성점검" },
  { k: "서비스점검", l: "서비스점검" },
];
const _specMenu = [
  { k: null, l: "전체현황" },
  { k: "오프라인점검", l: "오프라인점검" },
  { k: "이중화점검", l: "이중화점검" },
  { k: "성능점검", l: "성능점검" },
  { k: "업무집중기간점검", l: "업무집중기간점검" },
];
const InspFilter = ({ menus, sel, sub, onSelect, data, kindKey = "kind", midKey = "mid" }) => {
  const [openK, setOpenK] = useState(null);
  const dCnt = (k, s) => {
    if (!data) return 0;
    return data.filter(x => { if (k && x[kindKey] !== k) return false; if (s && x[midKey] !== s) return false; return x.st === "지연"; }).length;
  };
  const badge = (cnt) => cnt > 0 ? <span style={{ minWidth: 18, height: 18, borderRadius: 9, background: C.red, color: "#fff", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{cnt}</span> : null;
  const itemS = (active) => ({ padding: "9px 14px", borderRadius: 6, cursor: "pointer", marginBottom: 2, margin: "1px 6px", fontSize: 15, fontWeight: active ? 600 : 500, background: active ? C.priL : "", color: active ? C.sec : C.txt, transition: "all .3s" });
  const subS = (active) => ({ padding: "6px 12px 6px 24px", borderRadius: 6, cursor: "pointer", marginBottom: 1, margin: "0 6px", fontSize: 13, fontWeight: active ? 600 : 400, background: active ? C.priL : "", color: active ? C.sec : C.txS, transition: "all .3s" });
  return <div>
    {menus.map((m, i) => {
      const hasC = m.c && m.c.length > 0;
      const parentActive = sel === m.k && !sub;
      const childActive = hasC && sel === m.k && !!sub;
      const isOpen = hasC ? true : (openK === m.k || childActive);
      return <div key={i}>
        <div onClick={() => { if (hasC) { onSelect(m.k, null); } else { setOpenK(null); onSelect(m.k, null); } }}
          style={itemS(parentActive || childActive)}
          onMouseEnter={e => { if (!parentActive && !childActive) e.currentTarget.style.background = C.secL; }}
          onMouseLeave={e => { if (!parentActive && !childActive) e.currentTarget.style.background = ""; }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{m.l}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {badge(dCnt(m.k, null))}
              {hasC && <Ic n={isOpen ? "down" : "right"} s={10} c={C.txL} />}
            </div>
          </div>
        </div>
        {hasC && isOpen && <div style={{ marginBottom: 2 }}>
          {m.c.map(s => <div key={s} onClick={() => onSelect(m.k, s)} style={subS(sel === m.k && sub === s)}
            onMouseEnter={e => { if (!(sel === m.k && sub === s)) e.currentTarget.style.background = C.secL; }}
            onMouseLeave={e => { if (!(sel === m.k && sub === s)) e.currentTarget.style.background = ""; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:11, color: sel===m.k&&sub===s ? C.sec : C.txX, lineHeight:1 }}>─</span>
                {s}
              </span>
              {badge(dCnt(m.k, s))}
            </div>
          </div>)}
        </div>}
      </div>;
    })}
  </div>;
};

const MgrInspD = () => {
  const { di } = useDI();
  const todayDt = new Date().toISOString().slice(0,10);
  const minus10 = new Date(Date.now() - 10*24*60*60*1000).toISOString().slice(0,10);
  const [selItem,     setSelItem]     = useState(null);
  const [fKind,       setFKind]       = useState(null);
  const [fSub,        setFSub]        = useState(null);
  const [kw,          setKw]          = useState("");
  const [dtFrom,      setDtFrom]      = useState(minus10);
  const [dtTo,        setDtTo]        = useState(todayDt);
  const [checkedIds,  setCheckedIds]  = useState([]);
  const [fSys,        setFSys]        = useState("");
  const [applied,     setApplied]     = useState({ kw:"", dtFrom:minus10, dtTo:todayDt, fSys:"", fKind:null, fSub:null });

  const doSearch = () => { setApplied({ kw, dtFrom, dtTo, fSys, fKind, fSub }); setCheckedIds([]); };
  const doReset  = () => { setKw(""); setDtFrom(minus10); setDtTo(todayDt); setFSys(""); setApplied({ kw:"", dtFrom:minus10, dtTo:todayDt, fSys:"", fKind, fSub }); setCheckedIds([]); };

  const filtered = di.filter(x => {
    if (x.st !== "완료") return false;
    if (applied.fSys  && x.sysNm !== (SYS.find(s=>s.id===applied.fSys)||{}).nm) return false;
    if (applied.fKind && x.kind !== applied.fKind) return false;
    if (applied.fSub  && x.mid  !== applied.fSub)  return false;
    const q = applied.kw.trim().toLowerCase();
    if (q && !x.resNm.toLowerCase().includes(q) && !x.insp.toLowerCase().includes(q)) return false;
    if (applied.dtFrom && x.submitDt.slice(0,10) < applied.dtFrom) return false;
    if (applied.dtTo   && x.submitDt.slice(0,10) > applied.dtTo)   return false;
    return true;
  });
  const title = fSub ? `${fKind} > ${fSub}` : fKind || "전체현황";
  const FC = { "상시":"#0891B2","매일":"#0C8CE9","매주":"#19973C","매월":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333333" };

  return <div>
    <PH title="보고이력" bc="홈 > 점검현황 > 보고이력" />
    <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:14 }}>
      <Card title="점검종류" style={{ position:"sticky", top:20, maxHeight:"calc(100vh - 170px)", overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <InspFilter menus={_dailyMenu} sel={fKind} sub={fSub} onSelect={(k,s)=>{ setFKind(k); setFSub(s); setApplied(p=>({...p, fKind:k, fSub:s})); }} data={di} />
      </Card>
      <div style={{ minWidth:0 }}>

        {/* 검색폼 */}
        <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: "16px 12px", display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-end" }}>

            {/* 정보시스템 */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:"fit-content" }}>
              <span style={{ ...LABEL_STYLE_SM }}>정보시스템</span>
              <FSelect value={fSys} onChange={e=>setFSys(e.target.value)}
                style={{ padding:"6px 12px", border:`1px solid ${C.brd}`, borderRadius:4,
                  fontSize:15, outline:"none", color:C.txt, background:"#fff",
                  fontFamily:"inherit", minWidth:120 }}>
                <option value="">전체</option>
                {SYS.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
              </FSelect>
            </div>

            {/* 제출일시 레인지 */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:"fit-content" }}>
              <span style={{ ...LABEL_STYLE_SM }}>제출일시</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <DatePicker value={dtFrom} onChange={v => { setDtFrom(v); if (dtTo && v > dtTo) setDtTo(v); }} style={{ width: 130 }} />
                <span style={{ fontSize:12, color:C.txL }}>~</span>
                <DatePicker value={dtTo} onChange={v => { setDtTo(v); if (dtFrom && v < dtFrom) setDtFrom(v); }} style={{ width: 130 }} />
              </div>
            </div>

            {/* 자원명/점검자 */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:"fit-content" }}>
              <span style={{ ...LABEL_STYLE_SM }}>자원명/점검자</span>
              <FInput value={kw} onChange={e=>setKw(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&doSearch()}
                placeholder="자원명 또는 점검자"
                style={{ padding:"6px 12px", border:`1px solid ${C.brd}`, borderRadius:4,
                  fontSize:15, outline:"none", color:C.txt, background:"#fff", minWidth:120, fontFamily:"inherit" }} />
            </div>
          </div>

          <div style={{ display:"flex", gap:6, marginLeft:"auto", flexShrink:0, alignSelf:"stretch" }}>
            <SearchBtn onClick={doSearch} />
            <RefreshBtn onClick={doReset} />
          </div>
        </div>

        <Tbl secTitle={title} secCount={filtered.length}
          onRow={row => setSelItem(row)}
          secButtons={
            <Btn sm primary={checkedIds.length > 0} disabled={checkedIds.length === 0}
              onClick={()=>{ if(checkedIds.length>0) alert(`${checkedIds.length}건 보고서 일괄 다운로드`); }}
              style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              보고서 일괄다운로드{checkedIds.length > 0 ? ` (${checkedIds.length})` : ""}
            </Btn>
          }
          cols={[
          { t: <div onClick={e => { e.stopPropagation(); setCheckedIds(checkedIds.length === filtered.length && filtered.length > 0 ? [] : filtered.map(x=>x.id)); }}
                style={{ width:16, height:16, borderRadius:3, margin:"0 auto", cursor:"pointer",
                  border:`2px solid ${checkedIds.length===filtered.length&&filtered.length>0 ? C.pri : C.brd}`,
                  background: checkedIds.length===filtered.length&&filtered.length>0 ? C.pri : "#fff",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                {checkedIds.length===filtered.length&&filtered.length>0
                  ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : checkedIds.length>0 && <div style={{width:8,height:2,background:C.pri,borderRadius:1}}/>}
              </div>,
            k: "id", w: 44,
            r: (v, row) => <div onClick={e => { e.stopPropagation(); setCheckedIds(p => checkedIds.includes(v) ? p.filter(x=>x!==v) : [...p, v]); }}
              style={{ width:16, height:16, borderRadius:3, margin:"0 auto", cursor:"pointer",
                border:`2px solid ${checkedIds.includes(v) ? C.pri : C.brd}`,
                background: checkedIds.includes(v) ? C.pri : "#fff",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
              {checkedIds.includes(v) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div> },
          { t: "보고서 유형", k: "freq",     w: 90,
            r: v => <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:10, fontWeight:700, background:(FC[v]||C.txS)+"1A", color:FC[v]||C.txS }}>{v}</span> },
          { t: "정보시스템", k: "sysNm",     mw: 120, align: "left" },
          { t: "대상자원",   k: "resNm",     mw: 150, align: "left",
            r: v => <span style={{ fontWeight:600, color:C.pri }}>{v}</span> },
          { t: "점검표",     k: "clNm",      mw: 150, align: "left" },
          { t: "점검자",     k: "insp" },
          { t: "점검일시",   k: "execDt" },
          { t: "제출일시",   k: "submitDt" },
          { t: "정상",       k: "normalCnt", w: 70,
            r: v => <span style={{ fontWeight:700, color:"#19973C" }}>{v}</span> },
          { t: "비정상",     k: "abnCnt",    w: 70,
            r: v => <span style={{ fontWeight:700, color: v > 0 ? "#E24949" : C.txL }}>{v}</span> },
          { t: "특이사항",   k: "note",      mw: 160, align: "left",
            r: v => v ? <span style={{ color:"#F36D00", fontWeight:500 }}>{v}</span>
                      : <span style={{ color:C.txL }}>-</span> },
        ]} data={filtered} />
      </div>
    </div>
    <DailyReportPanel open={!!selItem} onClose={()=>setSelItem(null)} item={selItem} />
  </div>;
};

const MgrInspSp = ({ toast }) => {
  const [items,    setItems]    = useState(SI);
  const [selItem,  setSelItem]  = useState(null);
  const [showAdd,  setShowAdd]  = useState(false);
  const [fKind,    setFKind]    = useState(null);
  const [kw,       setKw]       = useState("");
  const [applied,  setApplied]  = useState({ kw: "", fKind: null });

  const doSearch = () => setApplied({ kw, fKind });
  const doReset  = () => { setKw(""); setApplied({ kw: "", fKind: null }); };

  const handleAdd = (newItem) => {
    const item = { ...newItem, id: Date.now(), reg: new Date().toISOString().slice(0,10), submitDt: null, reportFile: null };
    setItems(prev => [item, ...prev]);
    SI = [item, ...SI];
    setShowAdd(false);
  };

  const handleUpdate = (updated) => {
    const merged = { ...(SI.find(x => x.id === updated.id) || {}), ...updated };
    setItems(prev => prev.map(x => x.id === updated.id ? merged : x));
    SI = SI.map(x => x.id === updated.id ? merged : x);
    setSelItem(null);
    toast?.("특별점검이 수정되었습니다.");
  };

  const handleDelete = (target) => {
    setItems(prev => prev.filter(x => x.id !== target.id));
    SI = SI.filter(x => x.id !== target.id);
    setSelItem(null);
    toast?.("특별점검이 삭제되었습니다.", false);
  };

  const filtered = items.filter(x => {
    if (applied.fKind && x.kind !== applied.fKind) return false;
    const q = applied.kw.trim().toLowerCase();
    if (q && !x.title.toLowerCase().includes(q) && !(x.insp||"").toLowerCase().includes(q) && !(x.id+"").includes(q)) return false;
    return true;
  });
  const title = fKind || "전체현황";

  const ST_COLOR = { "요청":"#929292","중단":"#F36D00","완료":"#19973C","지연":"#E24949" };

  return (
    <div>
      <PH title="특별점검" bc="홈 > 점검현황 > 특별점검" />
      <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:14 }}>
        <Card title="점검종류" style={{ position:"sticky", top:20, maxHeight:"calc(100vh - 170px)", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <InspFilter menus={_specMenu} sel={applied.fKind} sub={null}
            onSelect={k => { setFKind(k); setApplied(p => ({ ...p, fKind: k })); }} data={SI} kindKey="kind" />
        </Card>
        <div style={{ minWidth:0 }}>
          <div style={{ width:"100%", border:`1px solid ${C.brd}`, background:C.bg, borderRadius:6,
            padding:"16px 12px", display:"flex", gap:8, marginBottom:16, alignItems:"stretch" }}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-end" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:"fit-content" }}>
                <span style={{ ...LABEL_STYLE_SM }}>제목/점검자</span>
                <FInput value={kw} onChange={e => setKw(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && doSearch()}
                  placeholder="제목, 점검자 검색"
                  style={{ padding:"6px 12px", border:`1px solid ${C.brd}`, borderRadius:4,
                    fontSize:15, outline:"none", color:C.txt, background:"#fff", minWidth:200, fontFamily:"inherit" }} />
              </div>
            </div>
            <div style={{ display:"flex", gap:6, marginLeft:"auto", flexShrink:0, alignSelf:"stretch" }}>
              <SearchBtn onClick={doSearch} />
              <RefreshBtn onClick={doReset} />
            </div>
          </div>
          <Tbl secTitle={title} secCount={filtered.length}
            secButtons={<SecBtnP onClick={() => setShowAdd(true)}>+ 특별점검 추가</SecBtnP>}
            onRow={row => setSelItem(row)}
            cols={[
              { t:"상태",         k:"st",      w:80,  r: v => <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:10, fontSize:12, fontWeight:700, background:(ST_COLOR[v]||C.txS)+"1A", color:ST_COLOR[v]||C.txS }}>{v}</span> },
              { t:"특별점검 제목", k:"title",  mw:220, align:"left", r: v => <span style={{ fontWeight:600, color:C.pri }}>{v}</span> },
              { t:"점검종류",     k:"kind",    w:120 },
              { t:"등록자",       k:"regUser", w:80  },
              { t:"등록일",       k:"reg",     w:100 },
              { t:"점검계획서",   k:"planFile",w:90,  r: v => v ? <span style={{ color:C.pri, cursor:"pointer" }}>📎</span> : <span style={{ color:C.txL }}>-</span> },
              { t:"점검기한",     k:"due",     w:100 },
              { t:"점검자",       k:"insp",    w:80  },
              { t:"보고자",       k:"insp",    w:80  },
              { t:"제출일시",     k:"submitDt",w:110, r: v => <span style={{ color: (!v||v==="-")?C.txL:C.txt }}>{v||"-"}</span> },
              { t:"점검보고서",   k:"reportFile",w:90, r: v => v ? <span style={{ color:C.pri, cursor:"pointer" }}>📎</span> : <span style={{ color:C.txL }}>-</span> },
            ]}
            data={filtered}
          />
        </div>
      </div>
      <SpecialPanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} onSave={handleUpdate} onDelete={handleDelete} />
      <SpecialPanel open={showAdd} onClose={() => setShowAdd(false)} item={null} onSave={handleAdd} />
    </div>
  );
};

const MgrInspReport = () => {
  const FREQ_OPTS  = ["전체","상시","매일","매주","매월","분기","반기","연간"];
  const FREQ_COLOR = { "전체":"#555E6C","상시":"#0891B2","매일":"#0C8CE9","매주":"#19973C","매월":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333333" };
  const RES_COLS   = ["서버","WEB","WAS","DBMS","네트워크","보안","스토리지","백업"];

  const todayStr = new Date().toISOString().slice(0,10);
  const [baseDate, setBaseDate] = useState(todayStr);
  const [freq,     setFreq]     = useState("전체");
  const [applied,  setApplied]  = useState({ baseDate: todayStr, freq: "전체" });
  const [checked,  setChecked]  = useState({});
  const [toastMsg, setToastMsg] = useState(null);
  const [panelInfo, setPanelInfo] = useState(null); // { sysNm, col, resources }

  const showToast = (msg, ok=true) => { setToastMsg({msg,ok}); setTimeout(()=>setToastMsg(null),2600); };

  const rows = SYS.map(sys => {
    const cells = {};
    const sysIdx = SYS.findIndex(s=>s.id===sys.id);
    RES_COLS.forEach((col,ci) => {
      const res = RES.filter(r => r.sysId===sys.id && r.mid===col);
      if (!res.length) { cells[col]=null; return; }
      /* 일부 셀은 미생성(reported=0) 예제를 위해 강제 처리
         sysIdx+ci 합이 특정 패턴이면 전체 미보고 처리 */
      const forceZero = (sysIdx * 3 + ci) % 7 === 0;
      const reported = forceZero ? 0 : res.filter((r,i)=>(r.id*13+i*7)%100<74).length;
      const hasReport = reported > 0;
      /* 자원별 보고서 시뮬레이션 */
      const resDetail = res.map((r,i) => {
        const isReported = !forceZero && (r.id*13+i*7)%100 < 74;
        const normalCnt  = isReported ? Math.floor((r.id*7+i*3)%10 + 3) : 0;
        const abnCnt     = isReported ? Math.floor((r.id*3+i*11)%4)      : 0;
        const freqList   = ["상시","매일","매주","매월","분기","반기","연간"];
        const resFreq    = freqList[(r.id + ci) % freqList.length];
        return {
          ...r,
          reported:    isReported,
          inspDt:      isReported ? `2026-02-${String(((r.id*3+i)%11)+1).padStart(2,"0")}` : null,
          reportDt:    isReported ? `2026-02-${String(((r.id*3+i)%11)+2).padStart(2,"0")}` : null,
          inspector:   USERS[(r.id+i)%USERS.length]?.userNm || "—",
          reportNm:    `${col} 상태점검표`,
          normalCnt,
          abnCnt,
          resFreq,
        };
      });
      cells[col] = { total:res.length, reported, rate:Math.round(reported/res.length*100), hasReport, resDetail };
    });
    const totalAll    = RES_COLS.reduce((s,c)=>s+(cells[c]?cells[c].total:0),0);
    const reportedAll = RES_COLS.reduce((s,c)=>s+(cells[c]?cells[c].reported:0),0);
    const overall     = totalAll>0 ? Math.round(reportedAll/totalAll*100) : 0;
    return { sys, cells, overall, totalAll, reportedAll };
  });

  /* 전체자원 합계 행 */
  const totalRow = (() => {
    const cells = {};
    RES_COLS.forEach(col => {
      const allCells = rows.map(r=>r.cells[col]).filter(Boolean);
      if (!allCells.length) { cells[col]=null; return; }
      const total    = allCells.reduce((s,c)=>s+c.total,0);
      const reported = allCells.reduce((s,c)=>s+c.reported,0);
      cells[col] = { total, reported, rate:Math.round(reported/total*100) };
    });
    const totalAll    = rows.reduce((s,r)=>s+r.totalAll,0);
    const reportedAll = rows.reduce((s,r)=>s+r.reportedAll,0);
    const overall     = totalAll>0 ? Math.round(reportedAll/totalAll*100) : 0;
    return { cells, overall, totalAll, reportedAll };
  })();

  const filteredRows = applied.freq === "전체"
    ? rows
    : rows.map(row => {
        const cells = {};
        Object.entries(row.cells).forEach(([col, cell]) => {
          if (!cell) { cells[col] = null; return; }
          const filtered = cell.resDetail.filter(r => r.resFreq === applied.freq);
          if (!filtered.length) { cells[col] = null; return; }
          const reported = filtered.filter(r => r.reported).length;
          cells[col] = { ...cell, total: filtered.length, reported, rate: Math.round(reported / filtered.length * 100), resDetail: filtered };
        });
        const totalAll    = RES_COLS.reduce((s,c)=>s+(cells[c]?cells[c].total:0),0);
        const reportedAll = RES_COLS.reduce((s,c)=>s+(cells[c]?cells[c].reported:0),0);
        const overall     = totalAll>0 ? Math.round(reportedAll/totalAll*100) : 0;
        return { ...row, cells, overall, totalAll, reportedAll };
      });

  const allIds    = SYS.map(s=>s.id);
  const selIds    = allIds.filter(id=>checked[id]);
  const allChk    = selIds.length===allIds.length;
  const toggleAll = () => allChk ? setChecked({}) : setChecked(Object.fromEntries(allIds.map(id=>[id,true])));

  const rColor = r => r===100?"#19973C":r>=80?"#0C8CE9":r>=50?"#F36D00":r>=1?"#E24949":"#7C3AED";
  const rBg    = r => r===100?"#E8F5EC":r>=80?"#E6F3FA":r>=50?"#FFF3E6":r>=1?"#FDE8E8":"#EDE9FE";

  const dlSingle = (sysNm,col) => showToast(`${sysNm}${col?` · ${col}`:""} 점검보고서 다운로드가 시작되었습니다.`);
  const dlBulk   = () => {
    if (!selIds.length){ showToast("다운로드할 정보시스템을 선택하세요.",false); return; }
    showToast(`${selIds.length}개 점검보고서 일괄 다운로드가 시작되었습니다.`);
  };

  const search = () => { setApplied({ baseDate, freq }); setChecked({}); };
  const reset  = () => {
    const d = new Date().toISOString().slice(0,10);
    setBaseDate(d); setFreq("전체");
    setApplied({ baseDate: d, freq: "전체" });
    setChecked({});
  };

  const dlIcon = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
  );

  /* ── 셀 클릭 핸들러 ── */
  const openPanel = (sys, col, cell) => {
    if (!cell) return;
    setPanelInfo({ sysNm: sys.nm, sysType: sys.type, col, cell });
  };

  return (
    <div>
      <PH title="점검보고서" bc="홈 > 점검현황 > 점검보고서" />

      {/* ── 검색폼 ── */}
      <SB onSearch={search} onReset={reset}>
        <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
          <span style={{ ...LABEL_STYLE_SM }}>기준일</span>
          <DatePicker value={baseDate} onChange={setBaseDate} style={{ width: 130 }} />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
          <span style={{ ...LABEL_STYLE_SM }}>보고주기</span>
          <div style={{ display:"flex", gap:4, height:36, alignItems:"center" }}>
            {FREQ_OPTS.map(f => {
              const active=freq===f, color=FREQ_COLOR[f];
              return (
                <span key={f} onClick={()=>setFreq(f)} style={{
                    padding:"5px 13px", borderRadius:4, fontSize:12, fontWeight:active?600:400,
                  border:`1px solid ${active?color:C.brd}`, background:active?color+"1A":"#fff",
                  color:active?color:C.txS, cursor:"pointer", transition:"all .12s", userSelect:"none", lineHeight:"22px" }}>
                  {f}
                </span>
              );
            })}
          </div>
        </div>
      </SB>

      {/* ── 테이블 가이드 안내 ── */}
      <div style={{ display:"flex", alignItems:"center", gap:16, padding:"9px 16px",
        background:"#F0F5FF", border:`1px solid #C7D9F8`, borderRadius:8, margin:"12px 0 4px",
        flexWrap:"wrap" }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0 }}>
          <circle cx="8" cy="8" r="7" stroke="#4C7EF3" strokeWidth="1.4"/>
          <path d="M8 7v5" stroke="#4C7EF3" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="8" cy="5" r="0.8" fill="#4C7EF3"/>
        </svg>
        {[
          { icon:"📊", text:"보고된 자원수 / 전체 자원수" },
          { icon:"🔍", text:"셀 클릭 시 자원별 보고서 상세 확인" },
          { icon:"📄", text:"PDF: 분류별 개별 다운로드" },
        ].map(({ icon, text }, i, arr) => (
          <React.Fragment key={i}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:13 }}>{icon}</span>
              <span style={{ fontSize:12, fontWeight:600, color:"#2D5BB9" }}>{text}</span>
            </div>
            {i < arr.length - 1 && (
              <span style={{ width:1, height:14, background:"#C7D9F8", flexShrink:0 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── 섹션 타이틀 ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        height:52, borderBottom:`1px solid ${C.brdD}` }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
          <span style={{ fontSize:18, fontWeight:600, color:C.txH }}>점검보고서 목록</span>
          <span style={{ fontSize:12, color:C.txL }}>{filteredRows.length}건</span>
        </div>
      </div>

      {/* ── 테이블 ── */}
      <div style={{ overflowX:"auto" }}>
        <table style={{ minWidth:"100%", width:"max-content", borderCollapse:"collapse", fontSize:15, borderBottom:`1px solid ${C.brd}` }}>
          <thead>
            <tr style={{ borderTop:`1px solid ${C.txH}` }}>
              <th style={{...TH({textAlign:"left", width:200})}} >정보시스템</th>
              <th style={{...TH({textAlign:"center", width:90})}} >종합</th>
              {RES_COLS.map(col=>(
                <th key={col} style={{...TH({textAlign:"center", width:100})}} >{col}</th>
              ))}
              <th style={{...TH({textAlign:"center", width:100})}} >다운로드</th>
            </tr>
          </thead>
          <tbody>
            {/* 전체자원 합계 행 */}
            {(() => {
              const ftotalRow = (() => {
                const cells = {};
                RES_COLS.forEach(col => {
                  const allCells = filteredRows.map(r=>r.cells[col]).filter(Boolean);
                  if (!allCells.length) { cells[col]=null; return; }
                  const total    = allCells.reduce((s,c)=>s+c.total,0);
                  const reported = allCells.reduce((s,c)=>s+c.reported,0);
                  cells[col] = { total, reported, rate:Math.round(reported/total*100) };
                });
                const totalAll    = filteredRows.reduce((s,r)=>s+r.totalAll,0);
                const reportedAll = filteredRows.reduce((s,r)=>s+r.reportedAll,0);
                const overall     = totalAll>0 ? Math.round(reportedAll/totalAll*100) : 0;
                return { cells, overall, totalAll, reportedAll };
              })();
              const { cells, overall, totalAll, reportedAll } = ftotalRow;
              return (
                <tr style={{ background:"#F0F5FF", fontWeight:700 }}>
                  <td style={{...TD({textAlign:"left", borderBottom:`2px solid ${C.brdD}` })}}>
                    <div style={{ fontWeight:700, color:C.pri, fontSize:15 }}>전체 자원</div>
                    <div style={{ fontSize:12, color:C.txL, marginTop:1 }}>전체 {SYS.length}개 정보시스템</div>
                  </td>
                  <td style={{...TD({textAlign:"center", borderBottom:`2px solid ${C.brdD}` })}}>
                    <span style={{ fontSize:15, fontWeight:700, color:rColor(overall), background:rBg(overall), padding:"3px 8px", borderRadius:10, whiteSpace:"nowrap" }}>
                      {reportedAll}<span style={{ fontWeight:400, fontSize:15 }}>/{totalAll}</span>
                    </span>
                  </td>
                  {RES_COLS.map(col => {
                    const cell = cells[col];
                    if (!cell) return <td key={col} style={{...TD({textAlign:"center", borderBottom:`2px solid ${C.brdD}` })}}><span style={{color:C.txX}}>—</span></td>;
                    /* 전체자원 클릭용 합산 cell 구성 */
                    const mergedCell = (() => {
                      const allDetail = filteredRows.flatMap(r => r.cells[col]?.resDetail || []);
                      return { ...cell, resDetail: allDetail, hasReport: cell.reported > 0 };
                    })();
                    return (
                      <td key={col} onClick={()=>openPanel({ nm:"전체 자원", type:"전체", org:`${SYS.length}개 시스템` }, col, mergedCell)}
                        style={{...TD({textAlign:"center", borderBottom:`2px solid ${C.brdD}`,
                          cursor:"pointer", transition:"background .12s" })}}
                        onMouseEnter={e=>e.currentTarget.style.background="#D8E8FF"}
                        onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <span style={{ fontSize:15, fontWeight:700, color:rColor(cell.rate), whiteSpace:"nowrap" }}>
                          {cell.reported}<span style={{ fontWeight:400, fontSize:15, color:C.txL }}>/{cell.total}</span>
                        </span>
                      </td>
                    );
                  })}
                  <td style={{...TD({textAlign:"center", borderBottom:`2px solid ${C.brdD}` })}}>
                    <span style={{ fontSize:12, color:C.txL }}>—</span>
                  </td>
                </tr>
              );
            })()}

            {/* 시스템별 행 */}
            {filteredRows.map(({ sys, cells, overall, totalAll, reportedAll }, si) => {
              const isChk = !!checked[sys.id];
              return (
                <tr key={sys.id} style={{ cursor:"pointer", background:isChk?C.priL+"88":"" }}
                  onMouseEnter={e=>{ if(!isChk) e.currentTarget.style.background=C.secL; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=isChk?C.priL+"88":""; }}>

                  <td style={{...TD({textAlign:"left"})}} >
                    <div style={{ fontWeight:600, color:C.txH, fontSize:15 }}>{sys.nm}</div>
                    <div style={{ fontSize:12, color:C.txL, marginTop:1 }}>{sys.type} · {sys.org}</div>
                  </td>

                  <td style={{...TD({textAlign:"center"})}} >
                    <span style={{ fontSize:15, fontWeight:700, color:rColor(overall), background:rBg(overall), padding:"3px 8px", borderRadius:10, whiteSpace:"nowrap" }}>
                      {reportedAll}<span style={{ fontWeight:400, fontSize:15 }}>/{totalAll}</span>
                    </span>
                  </td>

                  {RES_COLS.map(col => {
                    const cell = cells[col];
                    if (!cell) return (
                      <td key={col} style={{...TD({textAlign:"center"})}} >
                        <span style={{ color:C.txX, fontSize:15 }}>—</span>
                      </td>
                    );
                    return (
                      <td key={col} onClick={()=>openPanel(sys,col,cell)}
                        style={{...TD({textAlign:"center"})}} onMouseEnter={e=>e.currentTarget.style.background="#EEF4FF"}
                        onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                          <span style={{ fontSize:15, fontWeight:700, color:rColor(cell.rate), whiteSpace:"nowrap" }}>
                            {cell.reported}<span style={{ fontWeight:400, fontSize:15, color:C.txL }}>/{cell.total}</span>
                          </span>
                          {cell.hasReport ? (
                            <Btn xs onClick={e=>{e.stopPropagation();dlSingle(sys.nm,col);}}
                              style={{ padding:"3px 7px", gap:3, fontWeight:400 }}>
                              {dlIcon} PDF
                            </Btn>
                          ) : (
                            <span style={{ fontSize:12, color:C.txX }}>미생성</span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  <td style={{...TD({textAlign:"center"})}} >
                    <Btn onClick={e=>{e.stopPropagation();dlSingle(sys.nm,"");}}>
                      📥 전체
                    </Btn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ padding:"8px 0" }}>
        <span style={{ fontSize:12, color:C.txL }}>보고된 자원수 / 전체 자원수 &nbsp;·&nbsp; 셀 클릭 시 자원별 보고서 상세 확인 &nbsp;·&nbsp; PDF: 분류별 개별 다운로드</span>
      </div>

      {/* ── 자원별 보고서 사이드패널 ── */}
      {panelInfo && (() => {
        const { sysNm, col, cell } = panelInfo;
        const isTotal     = sysNm === "전체 자원";
        const reported    = cell.resDetail.filter(r=>r.reported);
        const notReported = cell.resDetail.filter(r=>!r.reported);
        const thC = { padding:"8px 10px", fontSize:12, fontWeight:600, color:C.txS,
          borderBottom:`2px solid ${C.brdD}`, background:C.bg, textAlign:"center", whiteSpace:"nowrap" };
        const tdC = (align="center") => ({ padding:"9px 10px", fontSize:12, color:C.txt,
          borderBottom:`1px solid ${C.brd}`, textAlign:align, verticalAlign:"middle" });
        return (
          <SidePanel open={!!panelInfo} onClose={()=>setPanelInfo(null)}
            title={`${col} 보고서 상세`} width={680} noScroll>
            {/* 바디 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {/* 요약 카드 */}
            <div style={{ display:"flex", gap:10, marginBottom:18 }}>
              <div style={{ flex:1, padding:"10px 14px", background:C.priL, borderRadius:8, textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:700, color:C.pri }}>{cell.reported}</div>
                <div style={{ fontSize:12, color:C.txS, marginTop:1 }}>보고 완료</div>
              </div>
              <div style={{ flex:1, padding:"10px 14px", background:"#FEF2F2", borderRadius:8, textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:700, color:"#EF4444" }}>{cell.total-cell.reported}</div>
                <div style={{ fontSize:12, color:C.txS, marginTop:1 }}>미보고</div>
              </div>
              <div style={{ flex:1, padding:"10px 14px", background:rBg(cell.rate), borderRadius:8, textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:700, color:rColor(cell.rate) }}>{cell.rate}%</div>
                <div style={{ fontSize:12, color:C.txS, marginTop:1 }}>보고율</div>
              </div>
            </div>

            <div style={{ fontSize:12, color:C.txL, marginBottom:14 }}>
              <span style={{ fontWeight:600, color: isTotal ? C.pri : C.txH }}>{sysNm}</span>
              &nbsp;·&nbsp;{col}&nbsp;·&nbsp;기준일: {baseDate}
            </div>

            {/* 자원 목록 테이블 */}
            <div style={{ marginBottom:0 }}>
              {/* 테이블 헤더 행 */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                paddingBottom:8, marginBottom:0 }}>
                <span style={{ fontSize:12, fontWeight:600, color:C.txH }}>자원 목록</span>
                {cell.hasReport && (
                  <Btn primary onClick={()=>dlSingle(sysNm,col)}
                    style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
                    📥 전체 PDF 다운로드
                  </Btn>
                )}
              </div>
              <div style={{ overflowX:"auto", border:`1px solid ${C.brd}`, borderRadius:8, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr>
                    <th style={{ ...thC, textAlign:"left", minWidth:120 }}>자원명</th>
                    <th style={thC}>보고주기</th>
                    <th style={thC}>점검일자</th>
                    <th style={thC}>보고서제출일</th>
                    <th style={thC}>점검자</th>
                    <th style={{ ...thC, color:"#19973C" }}>정상</th>
                    <th style={{ ...thC, color:"#E24949" }}>비정상</th>
                    <th style={thC}>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {[...reported, ...notReported].map((r,i) => (
                    <tr key={r.id||i}
                      style={{ background: r.reported ? (i%2===0?"#fff":"#FAFBFC") : "#FAFBFC" }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.secL}
                      onMouseLeave={e=>e.currentTarget.style.background=r.reported?(i%2===0?"#fff":"#FAFBFC"):"#FAFBFC"}>
                      {/* 자원명 */}
                      <td style={{ ...tdC("left"), fontWeight:600, color:C.txH }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:7, height:7, borderRadius:"50%", flexShrink:0,
                            background: r.reported ? "#19973C" : C.brd }} />
                          <div style={{ minWidth:0 }}>
                            <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:110 }}>{r.nm}</div>
                            {isTotal && <div style={{ fontSize:12, color:C.txL, fontWeight:400 }}>{r.sysNm}</div>}
                          </div>
                        </div>
                      </td>
                      {/* 보고주기 */}
                      <td style={tdC()}>
                        {(() => {
                          const fv = r.resFreq || (freq==="전체" ? "매월" : freq);
                          const fc = FREQ_COLOR[fv] || "#F36D00";
                          return <span style={{ padding:"2px 8px", borderRadius:8, fontSize:12, fontWeight:600,
                            background:fc+"1A", color:fc }}>{fv}</span>;
                        })()}
                      </td>
                      {/* 점검일자 */}
                      <td style={{ ...tdC(), color: r.inspDt ? C.txt : C.txX }}>
                        {r.inspDt || "—"}
                      </td>
                      {/* 보고서제출일 */}
                      <td style={{ ...tdC(), color: r.reportDt ? C.txt : C.txX }}>
                        {r.reportDt || "—"}
                      </td>
                      {/* 점검자 */}
                      <td style={tdC()}>{r.reported ? r.inspector : <span style={{color:C.txX}}>—</span>}</td>
                      {/* 정상 */}
                      <td style={tdC()}>
                        {r.reported
                          ? <span style={{ fontWeight:700, color:"#19973C" }}>{r.normalCnt}</span>
                          : <span style={{color:C.txX}}>—</span>}
                      </td>
                      {/* 비정상 */}
                      <td style={tdC()}>
                        {r.reported
                          ? <span style={{ fontWeight:700, color: r.abnCnt>0?"#E24949":C.txL }}>{r.abnCnt}</span>
                          : <span style={{color:C.txX}}>—</span>}
                      </td>
                      {/* PDF */}
                      <td style={tdC()}>
                        {r.reported ? (
                          <Btn xs ghost onClick={()=>showToast(`${r.nm} 보고서 다운로드가 시작되었습니다.`)}
                            style={{ display:"inline-flex", alignItems:"center", gap:3 }}>
                            📥 PDF
                          </Btn>
                        ) : (
                          <span style={{ fontSize:12, color:C.txX, background:"#F3F4F6",
                            padding:"3px 8px", borderRadius:4 }}>미보고</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>

            </div>{/* /바디 */}

            {/* 푸터 */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Btn onClick={()=>setPanelInfo(null)}>닫기</Btn>
              </div>
            </div>
          </SidePanel>
        );
      })()}

      {toastMsg && (
        <div style={{ position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)",
          zIndex:99999, padding:"12px 28px", borderRadius:8, fontSize:15, fontWeight:600,
          color:"#fff", background:toastMsg.ok?"#16a34a":"#dc2626",
          boxShadow:"0 4px 20px rgba(0,0,0,.18)",
          display:"flex", alignItems:"center", gap:8, animation:"toastIn .3s ease" }}>
          <span>{toastMsg.ok?"✓":"✕"}</span>{toastMsg.msg}
        </div>
      )}
    </div>
  );
};


/* ── 공지사항 ── */
const MgrNotice = ({ readOnly, onBannerOn, onBannerOff }) => {
  const [items,   setItems]   = useState(NT);
  const [showAdd, setShowAdd] = useState(false);
  const [selItem, setSelItem] = useState(null);
  const [kw,      setKw]      = useState("");
  const [applied, setApplied] = useState("");

  const doSearch = (_, v) => setApplied(v ?? kw);
  const doReset  = ()     => { setKw(""); setApplied(""); };

  const handleSaveNotice = (saved) => {
    // 배너 ON 저장 시 기존 배너 해제 후 새 배너 등록
    if (saved.banner === "Y") {
      const updated = items.map(n => ({ ...n, banner: n.id === saved.id ? "Y" : "N" }));
      setItems(updated);
      NT = updated;
      onBannerOn?.({ id: saved.id, title: saved.title });
    } else {
      const updated = items.map(n => n.id === saved.id ? { ...n, banner: "N" } : n);
      setItems(updated);
      NT = updated;
      // 현재 배너가 이 공지였다면 해제
      onBannerOff?.();
    }
    setSelItem(null);
    setShowAdd(false);
  };

  const filtered = items.filter(x =>
    !applied.trim() || x.title.toLowerCase().includes(applied.trim().toLowerCase())
  );

  const listCols = readOnly
    ? [
        { t: "No", k: "id", w: 60, r: (v, row) => filtered.length - filtered.indexOf(row) },
        { t: "제목", k: "title", mw: 300, align: "left", r: v => <span style={{ fontWeight: 600, color: C.pri }}>{v}</span> },
        { t: "등록자", k: "user" },
        { t: "등록일", k: "dt" },
        { t: "조회수", k: "views" },
      ]
    : [
        { t: "No", k: "id", w: 70, r: (v, row) => filtered.length - filtered.indexOf(row) },
        { t: "제목", k: "title", mw: 300, align: "left", r: v => <span style={{ fontWeight: 600, color: C.pri }}>{v}</span> },
        { t: "배너공지", k: "banner", w: 90, r: v => v === "Y"
          ? <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#EEF4FF", color: C.pri, border: `1px solid ${C.pri}44` }}>ON</span>
          : <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 10, background: "#F3F4F6", color: C.txL }}>OFF</span>
        },
        { t: "조회수", k: "views" }, { t: "작성자", k: "user" }, { t: "등록일", k: "dt" },
      ];

  return <div>
    <PH title="공지사항" bc="홈 > 게시판 > 공지사항" />
    <SB ph="제목으로 검색" value={kw} onChange={setKw} onSearch={doSearch} onReset={doReset} />
    <Tbl secTitle="공지사항 목록" secCount={filtered.length}
      secButtons={!readOnly && <SecBtnP onClick={() => setShowAdd(true)}>+ 공지사항 등록</SecBtnP>}
      onRow={row => setSelItem(row)} cols={listCols} data={filtered} />
    {!readOnly && <NoticePanel open={showAdd} onClose={() => setShowAdd(false)} item={null} onSave={handleSaveNotice} />}
    <NoticePanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} viewOnly={readOnly} onSave={handleSaveNotice} />
  </div>;
};

/* ── 자료실 ── */
const LIB = [
  { id: 1, title: "2026년 정기점검 보고서 양식", views: 89, user: "김시스템", dt: "2026-01-08", file: "정기점검_보고서_양식_v2.xlsx" },
  { id: 2, title: "자원 등록 가이드 문서", views: 124, user: "김시스템", dt: "2026-01-12", file: "자원등록_가이드_v1.2.pdf" },
  { id: 3, title: "점검표 작성 매뉴얼", views: 76, user: "이기관", dt: "2026-01-18", file: "점검표_작성_매뉴얼.pdf" },
  { id: 4, title: "보안점검 체크리스트 (2026)", views: 158, user: "김시스템", dt: "2026-01-22", file: "보안점검_체크리스트_2026.xlsx" },
  { id: 5, title: "COMPLYSIGHT 사용자 매뉴얼 v2.0", views: 203, user: "김시스템", dt: "2026-01-28", file: "COMPLYSIGHT_사용자매뉴얼_v2.0.pdf" },
  { id: 6, title: "자동점검 설정 가이드", views: 67, user: "박유지보수", dt: "2026-02-01", file: "자동점검_설정가이드.pdf" },
  { id: 7, title: "네트워크 장비 점검 양식", views: 45, user: "김시스템", dt: "2026-02-05", file: "네트워크_점검양식.docx" },
  { id: 8, title: "이중화 점검 절차서", views: 91, user: "이기관", dt: "2026-02-07", file: "이중화_점검절차서_v1.1.pdf" },
  { id: 9, title: "업무집중기간 점검 계획서 템플릿", views: 38, user: "이기관", dt: "2026-02-09", file: "업무집중기간_점검계획서.docx" },
  { id: 10, title: "라이선스 관리 정책 문서", views: 52, user: "김시스템", dt: "2026-02-10", file: "라이선스_관리정책.pdf" },
];
const LibViewPanel = ({ open, onClose, item }) => {
  if (!open || !item) return null;
  return (
    <SidePanel open={open} onClose={onClose} title="자료실 상세" width={560} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.txH, lineHeight: 1.4, marginBottom: 16 }}>{item.title}</div>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.txL, marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${C.brd}` }}>
          <span>등록자 <strong style={{ color: C.txS }}>{item.user || "—"}</strong></span>
          <span>등록일 <strong style={{ color: C.txS }}>{item.dt || "—"}</strong></span>
          <span>조회수 <strong style={{ color: C.txS }}>{item.views ?? 0}</strong></span>
        </div>
        <div style={{ fontSize: 15, color: C.txt, lineHeight: 1.7, whiteSpace: "pre-wrap", minHeight: 80, marginBottom: 20 }}>
          {item.content || <span style={{ color: C.txL }}>내용이 없습니다.</span>}
        </div>
        {item.file
          ? <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 6, border: `1px solid ${C.brd}`, background: "#F9FAFC", fontSize: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
              <span style={{ color: C.pri, cursor: "pointer", fontWeight: 500 }}>{item.file}</span>
            </div>
          : <div style={{ fontSize: 12, color: C.txL }}>첨부파일 없음</div>
        }
      </div>
      </div>{/* /바디 */}

      {/* 푸터 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={onClose}>닫기</Btn>
        </div>
      </div>
    </SidePanel>
  );
};

const MgrLibrary = ({ readOnly }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [selItem, setSelItem] = useState(null);

  const listCols = readOnly
    ? [
        { t: "No", k: "id", w: 60 },
        { t: "제목", k: "title", mw: 300, align: "left", r: v => <span style={{ fontWeight: 600, color: C.pri }}>{v}</span> },
        { t: "첨부파일", k: "file", mw: 220, align: "left", r: v => v ? <span style={{ color: C.pri, cursor: "pointer" }}>📎 {v}</span> : "—" },
        { t: "등록자", k: "user" },
        { t: "등록일", k: "dt" },
        { t: "조회수", k: "views" },
      ]
    : [
        { t: "No", k: "id", w: 70 },
        { t: "제목", k: "title", mw: 300, align: "left", r: v => <span style={{ fontWeight: 600, color: C.pri }}>{v}</span> },
        { t: "첨부파일", k: "file", mw: 300, align: "left", r: v => v ? <span style={{ color: C.pri, cursor: "pointer" }}>📎 {v}</span> : "—" },
        { t: "조회수", k: "views" }, { t: "작성자", k: "user" }, { t: "등록일", k: "dt" },
      ];

  return <div>
    <PH title="자료실" bc="홈 > 게시판 > 자료실" />
    <SB ph="제목으로 검색" />
    <Tbl secTitle="자료실 목록" secCount={LIB.length}
      secButtons={!readOnly && <SecBtnP onClick={() => setShowAdd(true)}>+ 자료 등록</SecBtnP>}
      onRow={row => setSelItem(row)} cols={listCols} data={LIB} />
    {!readOnly && <NoticePanel open={showAdd} onClose={() => setShowAdd(false)} item={null} />}
    {readOnly
      ? <LibViewPanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} />
      : <NoticePanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} />
    }
  </div>;
};

const UserPanel = ({ open, onClose, user, groups }) => {
  const isNew = !user;
  // DB: user_m - isAdmin(관리자여부), adminAuth(관리자권한), sntlAuth(센티널권한) 분리
  const emptyForm = { st: "Y", userId: "", userNm: "", email: "", password: "", role: "사용자", isAdmin: "N", adminAuth: "사용자", sntlAuth: "없음", systems: [], lockedYn: "N", groupId: "", phone: "", memo: "" };
  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [pwResetDone, setPwResetDone] = useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  useEffect(() => {
    if (open && user) {
      setForm({ st: user.useYn || "Y", userId: user.userId, userNm: user.userNm, email: user.email, password: "", role: user.userRole, isAdmin: user.isAdmin || "N", adminAuth: user.adminAuth || "사용자", sntlAuth: user.sntlAuth || "없음", systems: [], lockedYn: "N", groupId: user.groupId || "", phone: user.phone || "", memo: "" });
      setEditMode(false); setPwResetDone(false);
    }
    if (open && !user) { setForm(emptyForm); setEditMode(false); setPwResetDone(false); }
  }, [open, user]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const ro = !!user && !editMode;
  const roS  = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none" } : {};
  const roSel = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", appearance: "none", backgroundImage: "none", cursor: "default" } : {};

  const handleSave = () => { setEditMode(false); if (isNew) onClose(); };
  const handleCancel = () => { if (editMode) setConfirmOpen(true); else onClose(); };
  const handlePwReset = () => { setPwResetDone(true); setTimeout(() => setPwResetDone(false), 3000); };

  return (
    <>
    <UnsavedConfirm open={confirmOpen} onDiscard={() => { setConfirmOpen(false); setEditMode(false); onClose(); }} onSave={() => { setConfirmOpen(false); setEditMode(false); }} />
    <SidePanel open={open} onClose={() => editMode ? setConfirmOpen(true) : onClose()} title={isNew ? "사용자 등록" : "사용자 상세"} width={580} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

      {/* 계정 정보 */}
      <div style={{ marginBottom: 18 }}>
        <SecTitle label="계정 정보" primary />

        {/* 1단: 상태 토글 */}
        <FormRow label="상태">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Toggle on={form.st === "Y"} onClick={() => !ro && set("st", form.st === "Y" ? "N" : "Y")} disabled={ro} />
            <span style={{ fontSize: 13, color: form.st === "Y" ? C.green : C.txL, fontWeight: 500 }}>
              {form.st === "Y" ? "사용" : "미사용"}
            </span>
          </div>
        </FormRow>

        {/* 3단: 사용자 ID, 비밀번호, 공백 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="사용자 ID" required style={{ flex:1 }}>
            <FInput style={{ ...(ro || !isNew ? roS : {}) }} value={form.userId} onChange={e => set("userId", e.target.value.replace(/[^a-zA-Z0-9]/g, ""))} placeholder="영문/숫자" readOnly={ro || !isNew} maxLength={20} />
          </FormRow>
          <FormRow label="비밀번호" required={isNew} style={{ flex:1 }}>
            {ro ? (
              <FInput value="••••••••••••" readOnly style={{ ...roS, letterSpacing:2, color:C.txL, fontFamily:"inherit" }} />
            ) : editMode ? (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <FInput value="••••••••••••" readOnly style={{ flex:1, letterSpacing:2, color:C.txL, fontFamily:"inherit", background:"#F9FAFC", pointerEvents:"none" }} />
                <Btn sm success={pwResetDone} outline={!pwResetDone} onClick={handlePwReset} style={{ flexShrink:0, whiteSpace:"nowrap" }}>
                  {pwResetDone ? "✓ 완료" : "초기화"}
                </Btn>
              </div>
            ) : (
              <FInput type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="비밀번호 입력" maxLength={72} />
            )}
          </FormRow>
          <div style={{ flex:1 }} />
        </div>

        {/* 3단: 사용자명, 이메일, 연락처 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="사용자명" required style={{ flex:1 }}>
            <FInput style={{ ...roS }} value={form.userNm} onChange={e => set("userNm", e.target.value)} placeholder="실명" readOnly={ro} maxLength={50} />
          </FormRow>
          <FormRow label="이메일" required style={{ flex:1 }}>
            <FInput type="email" style={{ ...roS }} value={form.email} onChange={e => set("email", e.target.value)} placeholder="user@example.com" readOnly={ro} maxLength={254} />
          </FormRow>
          <FormRow label="연락처" style={{ flex:1 }}>
            <FInput style={{ ...roS }} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="010-0000-0000" readOnly={ro} maxLength={20} />
          </FormRow>
        </div>

        {/* 3단: 그룹, 역할, 관리자여부 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="그룹" style={{ flex:1 }}>
            {ro ? (
              <div style={{ ...fInput, background:"#F9FAFC", color: form.groupId ? C.txt : C.txL, userSelect:"none" }}>
                {form.groupId ? (groups||[]).find(g => g.id===form.groupId)?.nm || form.groupId : "그룹 없음"}
              </div>
            ) : (
              <FSelect value={form.groupId} onChange={e => set("groupId", e.target.value)}>
                <option value="">그룹 없음</option>
                {(groups||[]).map(g => <option key={g.id} value={g.id}>{g.nm}</option>)}
              </FSelect>
            )}
          </FormRow>
          <FormRow label="역할" style={{ flex:1 }}>
            <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.role} onChange={e => {
              const r = e.target.value;
              set("role", r);
              if (r==="시스템 관리자") { set("isAdmin","Y"); set("adminAuth","시스템관리자"); set("sntlAuth","전체"); }
              else if (r==="기관 관리자") { set("isAdmin","Y"); set("adminAuth","기관관리자"); set("sntlAuth","읽기"); }
              else if (r==="유지보수 총괄") { set("isAdmin","N"); set("adminAuth","유지보수총괄"); set("sntlAuth","없음"); }
              else { set("isAdmin","N"); set("adminAuth","사용자"); set("sntlAuth","없음"); }
            }}>
              {["시스템 관리자","기관 관리자","유지보수 총괄","사용자"].map(r => <option key={r} value={r}>{r}</option>)}
            </RoSelect>
          </FormRow>
          <FormRow label="관리자여부" style={{ flex:1 }}>
            <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.isAdmin} onChange={e => set("isAdmin", e.target.value)}>
              <option value="Y">Y (관리자)</option><option value="N">N (일반)</option>
            </RoSelect>
          </FormRow>
        </div>

        {/* 1단: 비고 */}
        <FormRow label="비고">
          <FTextarea style={{ ...(ro ? { ...roS, resize:"none" } : {}) }} value={form.memo} onChange={e => set("memo", e.target.value)} placeholder="기타 메모" readOnly={ro} maxLength={500} />
        </FormRow>
      </div>

      {/* 소속 정보시스템 */}
      <div style={{ marginBottom: 18 }}>
        <SecTitle label="소속 정보시스템" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {form.systems.length === 0 && <span style={{ fontSize: 12, color: C.txL }}>소속 정보시스템이 없습니다.</span>}
          {form.systems.map(sid => { const s = SYS.find(x => x.id === sid); return s ? <span key={sid} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:12, background:C.priL, color:C.priD, fontSize:12 }}>{s.nm} {!ro && <span onClick={() => set("systems", form.systems.filter(x => x!==sid))} style={{ cursor:"pointer" }}>×</span>}</span> : null; })}
        </div>
        {!ro && <FSelect style={{ maxWidth: 280 }} value="" onChange={e => { if (e.target.value && !form.systems.includes(e.target.value)) set("systems", [...form.systems, e.target.value]); }}>
          <option value="">+ 정보시스템 추가</option>
          {SYS.filter(s => !form.systems.includes(s.id)).map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
        </FSelect>}
      </div>

      {/* 접속 정보 (조회 시만) — 가장 하단 */}
      {user && <div style={{ marginBottom: 18 }}>
        <SecTitle label="접속 정보" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }}>
          <FormRow label="가입일시">
            <FInput value={user.joinDt || "—"} readOnly style={{ background:"#F9FAFC", color:C.txt, pointerEvents:"none" }} />
          </FormRow>
          <FormRow label="마지막 로그인">
            <FInput value={user.lastLoginDt || "—"} readOnly style={{ background:"#F9FAFC", color:C.txt, pointerEvents:"none" }} />
          </FormRow>
          <FormRow label="비밀번호 오류">
            <FInput value={`${user.pwdErrCnt ?? 0}회`} readOnly style={{ background:"#F9FAFC", color: (user.pwdErrCnt ?? 0) >= 3 ? "#ef4444" : C.txt, pointerEvents:"none", fontWeight: (user.pwdErrCnt ?? 0) >= 3 ? 600 : 400 }} />
          </FormRow>
        </div>
      </div>}

      </div>{/* /바디 */}

      {/* 푸터 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {(isNew || editMode) ? (
            <>
              <Btn onClick={handleCancel}>취소</Btn>
              <div style={{ flex: 1 }} />
              <Btn primary onClick={handleSave}>{isNew ? "등록" : "저장"}</Btn>
            </>
          ) : (
            <>
              <Btn onClick={onClose}>닫기</Btn>
              <div style={{ flex: 1 }} />
              <Btn danger onClick={() => {}}>삭제</Btn>
              <Btn success style={{ marginLeft: 8 }} onClick={() => setEditMode(true)}>수정</Btn>
            </>
          )}
        </div>
      </div>
    </SidePanel>
    </>
  );
};

/* ── 그룹관리 레이어 팝업 ── */
const GroupMgmtModal = ({ open, onClose, groups, setGroups, users }) => {
  const [search,   setSearch]   = useState("");
  const [editId,   setEditId]   = useState(null);   // 수정 중인 그룹 id
  const [editNm,   setEditNm]   = useState("");
  const [newNm,    setNewNm]    = useState("");
  const [errMsg,   setErrMsg]   = useState("");

  useEffect(() => { if (!open) { setSearch(""); setEditId(null); setNewNm(""); setErrMsg(""); } }, [open]);

  const usedIds = new Set((users || []).map(u => u.groupId).filter(Boolean));
  const filtered = groups.filter(g => g.nm.includes(search.trim()));

  /* 등록 */
  const addGroup = () => {
    const nm = newNm.trim();
    if (!nm) { setErrMsg("그룹명을 입력하세요."); return; }
    if (groups.some(g => g.nm === nm)) { setErrMsg("이미 등록된 그룹명입니다."); return; }
    const id = "GRP" + String(Date.now()).slice(-6);
    const today = new Date().toISOString().slice(0, 10);
    setGroups(prev => [...prev, { id, nm, regDt: today }]);
    setNewNm(""); setErrMsg("");
  };

  /* 수정 시작 */
  const startEdit = (g) => { setEditId(g.id); setEditNm(g.nm); setErrMsg(""); };

  /* 수정 저장 */
  const saveEdit = () => {
    const nm = editNm.trim();
    if (!nm) { setErrMsg("그룹명을 입력하세요."); return; }
    if (groups.some(g => g.nm === nm && g.id !== editId)) { setErrMsg("이미 등록된 그룹명입니다."); return; }
    setGroups(prev => prev.map(g => g.id === editId ? { ...g, nm } : g));
    setEditId(null); setEditNm(""); setErrMsg("");
  };

  /* 삭제 */
  const delGroup = (g) => {
    if (usedIds.has(g.id)) { setErrMsg(`'${g.nm}'은 사용 중인 그룹으로 삭제할 수 없습니다.`); return; }
    setGroups(prev => prev.filter(x => x.id !== g.id));
    setErrMsg("");
  };

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* 딤 */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)" }} onClick={onClose} />
      {/* 팝업 */}
      <div style={{ position: "relative", width: 480, background: "#fff", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,.2)", display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
        {/* 헤더 */}
        <div style={{ padding: "18px 22px 14px", borderBottom: `1px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>그룹 관리</div>
            <div style={{ fontSize: 12, color: C.txL, marginTop: 2 }}>그룹을 추가·수정·삭제하고 사용자에게 적용합니다.</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: C.txL, lineHeight: 1 }}>×</button>
        </div>

        {/* 검색 + 목록 */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "16px 22px 0" }}>
          <FInput value={search} onChange={e => setSearch(e.target.value)} placeholder="그룹명 검색"
            style={{ ...fInput, marginBottom: 10 }} />

          {/* 오류 메시지 */}
          {errMsg && <div style={{ fontSize: 12, color: "#ef4444", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, padding: "7px 12px", marginBottom: 10 }}>{errMsg}</div>}

          <div style={{ flex: 1, overflowY: "auto", marginRight: -4, paddingRight: 4 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: C.txL, fontSize: 12 }}>
                {search ? "검색 결과가 없습니다." : "등록된 그룹이 없습니다."}
              </div>
            )}
            {filtered.map(g => {
              const inUse = usedIds.has(g.id);
              const isEditing = editId === g.id;
              return (
                <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 8, marginBottom: 4,
                  background: isEditing ? C.priL : "#f8fafc", border: `1px solid ${isEditing ? C.pri : C.brd}` }}>
                  {isEditing ? (
                    <>
                      <FInput value={editNm} onChange={e => setEditNm(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && saveEdit()}
                        autoFocus style={{ ...fInput, flex: 1, margin: 0 }} />
                      <Btn xs primary onClick={saveEdit}>저장</Btn>
                      <Btn xs onClick={() => { setEditId(null); setErrMsg(""); }}>취소</Btn>
                    </>
                  ) : (
                    <>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.txt }}>{g.nm}</div>
                        <div style={{ fontSize: 12, color: C.txL, marginTop: 1 }}>등록일 {g.regDt} {inUse && <span style={{ color: C.pri, fontWeight: 600, marginLeft: 6 }}>사용 중</span>}</div>
                      </div>
                      <Btn xs outline onClick={() => startEdit(g)}>수정</Btn>
                      <Btn xs outlineDanger disabled={inUse} onClick={() => delGroup(g)}>삭제</Btn>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 신규 등록 영역 */}
        <div style={{ padding: "14px 22px 20px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 400, color: C.txL, marginBottom: 6 }}>신규 그룹 등록</div>
          <div style={{ display: "flex", gap: 8 }}>
            <FInput value={newNm} onChange={e => { setNewNm(e.target.value); setErrMsg(""); }}
              onKeyDown={e => e.key === "Enter" && addGroup()}
              placeholder="그룹명 입력 후 Enter 또는 등록 버튼 클릭"
              style={{ ...fInput, flex: 1 }} maxLength={50} />
            <Btn primary onClick={addGroup}>등록</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

const MgrUsers = () => {
  const [users,       setUsers]       = useState(USERS);
  const [groups,      setGroups]      = useState(INIT_USER_GROUPS);
  const [selGroup,    setSelGroup]    = useState(null);   // 왼쪽 선택 그룹 (null=전체)
  const [selUser,     setSelUser]     = useState(null);
  const [showAdd,     setShowAdd]     = useState(false);
  const [showGrpMgmt, setShowGrpMgmt] = useState(false);
  const [keyword,     setKeyword]     = useState("");

  /* 왼쪽 패널: 그룹별 사용자 수 */
  const countByGroup = (gid) => users.filter(u => u.groupId === gid).length;
  const ungrouped    = users.filter(u => !u.groupId).length;

  /* 오른쪽 목록 필터 */
  const filtered = users.filter(u => {
    const kw = keyword.trim().toLowerCase();
    if (kw && !u.userNm.toLowerCase().includes(kw) && !u.userId.toLowerCase().includes(kw) && !(u.email||"").toLowerCase().includes(kw)) return false;
    if (selGroup === "__NONE__") return !u.groupId;
    if (selGroup) return u.groupId === selGroup;
    return true;
  });

  /* 선택 그룹 이름 */
  const selGroupNm = selGroup === "__NONE__" ? "미지정" : groups.find(g => g.id === selGroup)?.nm || "전체";

  return (
    <div>
      <PH title="사용자" bc="홈 > 환경설정 > 사용자 관리 > 사용자" />

      <div style={{ display: "flex", gap: 14, alignItems: "start" }}>

        {/* ── 왼쪽: 그룹 패널 ── */}
        <div style={{ width: 240, flexShrink: 0, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.brd}`, display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.txH }}>그룹</span>
          </div>
          <div style={{ padding: "6px 0" }}>
            {/* 전체 */}
            {(() => {
              const active = selGroup === null;
              return (
                <div onClick={() => setSelGroup(null)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 14px", cursor: "pointer", borderRadius: 6, margin: "0 6px",
                    background: active ? C.priL : "transparent",
                    transition: "all .3s" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? C.priL : "transparent"; }}>
                  <span style={{ fontSize: 15, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txt }}>전체</span>
                  <span style={{ fontSize: 12, fontWeight: 500,
                    background: "#EEEEEE", color: "#929292",
                    borderRadius: 10, padding: "1px 7px", minWidth: 20, textAlign: "center" }}>{users.length}</span>
                </div>
              );
            })()}
            {/* 그룹 목록 */}
            {groups.map(g => {
              const active = selGroup === g.id;
              const cnt = countByGroup(g.id);
              return (
                <div key={g.id} onClick={() => setSelGroup(g.id)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 14px", cursor: "pointer", borderRadius: 6, margin: "1px 6px",
                    background: active ? C.priL : "transparent",
                    transition: "all .3s" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? C.priL : "transparent"; }}>
                  <span style={{ fontSize: 15, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txt,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 6 }}>{g.nm}</span>
                  <span style={{ fontSize: 12, fontWeight: 500,
                    background: "#EEEEEE", color: "#929292",
                    borderRadius: 10, padding: "1px 7px", minWidth: 20, textAlign: "center", flexShrink: 0 }}>{cnt}</span>
                </div>
              );
            })}
            {/* 미지정 */}
            {ungrouped > 0 && (() => {
              const active = selGroup === "__NONE__";
              return (
                <div onClick={() => setSelGroup("__NONE__")}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 14px", cursor: "pointer", borderRadius: 6, margin: "1px 6px",
                    borderTop: `1px dashed ${C.brd}`, marginTop: 4,
                    background: active ? C.priL : "transparent",
                    transition: "all .3s" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? C.priL : "transparent"; }}>
                  <span style={{ fontSize: 15, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txL }}>미지정</span>
                  <span style={{ fontSize: 12, fontWeight: 500,
                    background: "#EEEEEE", color: "#929292",
                    borderRadius: 10, padding: "1px 7px", minWidth: 20, textAlign: "center" }}>{ungrouped}</span>
                </div>
              );
            })()}
          </div>
          {/* 사용자 그룹관리 버튼 */}
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.brd}` }}>
            <Btn ghost onClick={() => setShowGrpMgmt(true)} style={{ width: "100%" }}>사용자 그룹관리</Btn>
          </div>
        </div>

        {/* ── 오른쪽: 사용자 목록 ── */}
        <div style={{ flex: 1 }}>

          <SB ph="이름, ID, 이메일 검색"
            fields={[{ key:"status", label:"상태", type:"select", options:["전체","사용","미사용"] }]}
            onSearch={(f, kw) => { setKeyword(kw); }} />

          <Tbl
            secTitle={`${selGroupNm} 사용자 목록`}
            secCount={filtered.length}
            secButtons={<SecBtnP onClick={() => setShowAdd(true)}>+ 사용자 등록</SecBtnP>}
            data={filtered}
            onRow={u => setSelUser(u)}
            cols={[
              { t:"상태",          k:"useYn",      w:100, r:(v)=><YnBadge v={v}/> },
              { t:"사용자 ID",     k:"userId",     mw:150, align:"left", r:(v)=><span style={{color:C.txS,fontFamily:"inherit"}}>{v}</span> },
              { t:"이름",          k:"userNm",     mw:150, align:"left", r:(v)=><span style={{color:C.pri}}>{v}</span> },
              { t:"이메일",        k:"email",       r:(v)=>v||"—" },
              { t:"그룹",          k:"groupId",    w:100,
                r:(v)=>{ const grp=groups.find(g=>g.id===v);
                  return grp
                    ?<span style={{padding:"2px 9px",borderRadius:10,fontSize:12,fontWeight:600,background:C.priL,color:C.pri,border:`1px solid ${C.priL}`}}>{grp.nm}</span>
                    :<span style={{color:C.txL}}>—</span>;} },
              { t:"역할",          k:"userRole",   w:110, r:(v)=><RoleBadge v={v}/> },
              { t:"마지막 로그인", k:"lastLoginDt",w:140, r:(v)=><span style={{color:C.txL}}>{v||"—"}</span> },
            ]}
          />
        </div>
      </div>

      {/* 그룹 관리 팝업 */}
      <GroupMgmtModal open={showGrpMgmt} onClose={() => setShowGrpMgmt(false)} groups={groups} setGroups={setGroups} users={users} />

      {/* 사용자 상세/등록 패널 */}
      <UserPanel open={showAdd}    onClose={() => setShowAdd(false)}  user={null}    groups={groups} />
      <UserPanel open={!!selUser}  onClose={() => setSelUser(null)}   user={selUser} groups={groups} />
    </div>
  );
};

const _clEmptyForm = { st: "Y", nm: "", clId: "", inspType: "일상점검", inspKind: "", exposedRes: [], linkedSch: 0, linkedRes: 0, registrant: "", regDt: "", purpose: "", memo: "" };
const ChecklistPanel = ({ open, onClose, item, linkedResIds = [], onLinkChange, onSaved, initialTab = "info", isJustCreated = false, resLinkMap = {} }) => {
  const isNew = !item;
  const [form, setForm] = useState(_clEmptyForm);
  useEffect(() => {
    if (open && item) setForm({ st: item.useYn || "Y", nm: item.nm, clId: item.id || "", inspType: item.type || "일상점검", inspKind: item.sub || "", exposedRes: [], linkedSch: item.sch || 0, linkedRes: 0, registrant: "관리자", regDt: "2026-01-15 10:00:00", purpose: "", memo: "" });
    if (open && !item) setForm(_clEmptyForm);
  }, [open, item]);
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [kindChangeConfirm, setKindChangeConfirm] = useState(null);
  const [itemFilter, setItemFilter] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab); // "info" | "res"
  const [resSearch,  setResSearch]  = useState("");
  const [resSys,     setResSys]     = useState("");
  const [resLarge,   setResLarge]   = useState("");
  const [resMid,     setResMid]     = useState("");
  useEffect(() => { if (open) { setEditMode(false); setConfirmOpen(false); setKindChangeConfirm(null); setItemFilter(""); setActiveTab(initialTab); setResSearch(""); setResSys(""); setResLarge(""); setResMid(""); } }, [open]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const ro = !!item && !editMode;
  const roS = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none" } : {};
  const roSel = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", appearance: "none", backgroundImage: "none", cursor: "default" } : {};
  const handleSave = () => {
    if (isNew) {
      const newItem = { ...form, id: Date.now(), useYn: form.st, type: form.inspType, kind: form.inspKind, items: inspItems.length, sch: 0 };
      onSaved?.(newItem); // MgrCL이 패널 전환 담당 — onClose 호출하지 않음
      return;
    }
    setEditMode(false);
  };
  const handleCancel = () => { if (editMode) setConfirmOpen(true); else onClose(); };
  const handleDiscard = () => { setConfirmOpen(false); setEditMode(false); onClose(); };
  const handleSaveConfirm = () => { setConfirmOpen(false); setEditMode(false); };
  const inspKindOptions = { "일상점검": ["상태점검","유효성점검","서비스점검"], "특별점검": ["오프라인점검","이중화점검","성능점검","업무집중기간점검"] };
  const resInfoOptions = [
    // 기본 정보
    "자원명", "자원 식별코드", "중분류", "소분류", "상위 자원명", "관리주체", "운영/개발 구분", "도입일", "가상화 여부",
    // 용도 정보
    "사용용도", "최초 사용용도", "이전 사용용도", "상세용도",
    // 네트워크 정보
    "장비 IP", "서비스 IP", "포트",
    // 서비스 정보
    "서비스 URL", "설치경로", "로그경로",
    // SNMP
    "SNMP 계정정보", "SNMP 버전", "SNMP 인증정보",
    // 하드웨어/시스템
    "OS", "제조사", "모델명", "시리얼넘버", "메모리 용량(GB)", "로컬 디스크 용량(GB)", "CPU 모델", "CPU 클럭 속도(GHz)", "CPU 코어수", "CPU 아키텍처",
    // 기타
    "비고",
  ];

  /* 검증코드 풀 (선택 가능한 항목 목록) */
  const vcPool = [
    /* 서버 > CPU */
    { code: "CHK-CPU-001", nm: "CPU 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "서버", cat2: "CPU", cat3: "사용률" },
    { code: "CHK-CPU-002", nm: "CPU 코어별 사용률", method: "자동", std: "< 90%", unit: "%", cat1: "서버", cat2: "CPU", cat3: "코어별" },
    { code: "CHK-CPU-003", nm: "CPU 대기 큐 길이", method: "자동", std: "< 10", unit: "개", cat1: "서버", cat2: "CPU", cat3: "대기 큐" },
    /* 서버 > 메모리 */
    { code: "CHK-MEM-001", nm: "메모리 사용률", method: "자동", std: "< 85%", unit: "%", cat1: "서버", cat2: "메모리", cat3: "사용률" },
    { code: "CHK-MEM-002", nm: "SWAP 사용률", method: "자동", std: "< 50%", unit: "%", cat1: "서버", cat2: "메모리", cat3: "SWAP" },
    { code: "CHK-MEM-003", nm: "캐시 메모리 상태", method: "자동", std: "정상", unit: "", cat1: "서버", cat2: "메모리", cat3: "캐시" },
    /* 서버 > 디스크 */
    { code: "CHK-DISK-001", nm: "디스크 사용률", method: "자동", std: "< 90%", unit: "%", cat1: "서버", cat2: "디스크", cat3: "사용률" },
    { code: "CHK-DISK-002", nm: "디스크 I/O 대기", method: "자동", std: "< 20%", unit: "%", cat1: "서버", cat2: "디스크", cat3: "I/O" },
    { code: "CHK-DISK-003", nm: "inode 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "서버", cat2: "디스크", cat3: "inode" },
    { code: "CHK-DISK-004", nm: "파일시스템 상태", method: "자동", std: "정상", unit: "", cat1: "서버", cat2: "디스크", cat3: "파일시스템" },
    /* 서버 > 프로세스 */
    { code: "CHK-PROC-001", nm: "주요 프로세스 구동 확인", method: "자동", std: "Running", unit: "", cat1: "서버", cat2: "프로세스", cat3: "구동상태" },
    { code: "CHK-PROC-002", nm: "좀비 프로세스 수", method: "자동", std: "0", unit: "개", cat1: "서버", cat2: "프로세스", cat3: "좀비" },
    { code: "CHK-PROC-003", nm: "프로세스 수 한계", method: "자동", std: "< 500", unit: "개", cat1: "서버", cat2: "프로세스", cat3: "한계" },
    /* 서버 > 서비스 */
    { code: "CHK-SVC-001", nm: "서비스 포트 확인", method: "자동", std: "OPEN", unit: "", cat1: "서버", cat2: "서비스", cat3: "포트" },
    { code: "CHK-SVC-002", nm: "SSH 서비스 상태", method: "자동", std: "Active", unit: "", cat1: "서버", cat2: "서비스", cat3: "SSH" },
    { code: "CHK-SVC-003", nm: "NTP 동기화 상태", method: "자동", std: "동기화", unit: "", cat1: "서버", cat2: "서비스", cat3: "NTP" },
    { code: "CHK-SVC-004", nm: "DNS 응답 확인", method: "자동", std: "정상", unit: "", cat1: "서버", cat2: "서비스", cat3: "DNS" },
    /* 서버 > OS */
    { code: "CHK-OS-001", nm: "OS 커널 버전 확인", method: "자동", std: "최신", unit: "", cat1: "서버", cat2: "OS", cat3: "커널" },
    { code: "CHK-OS-002", nm: "시스템 가동시간(Uptime)", method: "자동", std: "> 0", unit: "일", cat1: "서버", cat2: "OS", cat3: "Uptime" },
    { code: "CHK-OS-003", nm: "시스템 시간 정확도", method: "자동", std: "< 1초", unit: "초", cat1: "서버", cat2: "OS", cat3: "시간" },
    /* 서버 > 로그 */
    { code: "CHK-LOG-001", nm: "로그 에러 확인", method: "육안", std: "0건", unit: "건", cat1: "서버", cat2: "로그", cat3: "에러" },
    { code: "CHK-LOG-002", nm: "시스템 로그 용량", method: "자동", std: "< 1GB", unit: "GB", cat1: "서버", cat2: "로그", cat3: "용량" },
    { code: "CHK-LOG-003", nm: "감사 로그 기록 확인", method: "육안", std: "정상", unit: "", cat1: "서버", cat2: "로그", cat3: "감사" },
    { code: "CHK-LOG-004", nm: "로그 로테이션 상태", method: "자동", std: "정상", unit: "", cat1: "서버", cat2: "로그", cat3: "로테이션" },
    /* 보안 > 패치 */
    { code: "CHK-PATCH-001", nm: "보안패치 상태", method: "육안", std: "최신", unit: "", cat1: "보안", cat2: "패치", cat3: "상태" },
    { code: "CHK-PATCH-002", nm: "긴급 보안패치 적용 여부", method: "육안", std: "적용", unit: "", cat1: "보안", cat2: "패치", cat3: "긴급" },
    /* 보안 > 접근통제 */
    { code: "CHK-SEC-001", nm: "방화벽 룰 점검", method: "육안", std: "정상", unit: "", cat1: "보안", cat2: "접근통제", cat3: "방화벽" },
    { code: "CHK-SEC-002", nm: "불필요 포트 오픈 확인", method: "자동", std: "0", unit: "개", cat1: "보안", cat2: "접근통제", cat3: "포트" },
    { code: "CHK-SEC-003", nm: "root 원격접속 제한", method: "자동", std: "차단", unit: "", cat1: "보안", cat2: "접근통제", cat3: "원격접속" },
    { code: "CHK-SEC-009", nm: "암호화 통신 설정", method: "자동", std: "TLS 1.2+", unit: "", cat1: "보안", cat2: "접근통제", cat3: "암호화" },
    { code: "CHK-SEC-010", nm: "IPS/IDS 정책 상태", method: "육안", std: "정상", unit: "", cat1: "보안", cat2: "접근통제", cat3: "IPS/IDS" },
    /* 보안 > 계정관리 */
    { code: "CHK-SEC-004", nm: "패스워드 정책 준수", method: "자동", std: "준수", unit: "", cat1: "보안", cat2: "계정관리", cat3: "패스워드" },
    { code: "CHK-SEC-005", nm: "계정 잠김 정책 확인", method: "자동", std: "설정", unit: "", cat1: "보안", cat2: "계정관리", cat3: "잠김정책" },
    { code: "CHK-SEC-006", nm: "세션 타임아웃 설정", method: "자동", std: "설정", unit: "", cat1: "보안", cat2: "계정관리", cat3: "세션" },
    { code: "CHK-SEC-007", nm: "불필요 계정 존재 확인", method: "육안", std: "0", unit: "개", cat1: "보안", cat2: "계정관리", cat3: "불필요계정" },
    { code: "CHK-SEC-008", nm: "권한 설정 적정성", method: "육안", std: "적정", unit: "", cat1: "보안", cat2: "계정관리", cat3: "권한" },
    /* 보안 > 인증서 */
    { code: "CHK-CERT-001", nm: "인증서 만료 확인", method: "자동", std: "> 30일", unit: "일", cat1: "보안", cat2: "인증서", cat3: "만료" },
    { code: "CHK-CERT-002", nm: "SSL 인증서 유효성", method: "자동", std: "유효", unit: "", cat1: "보안", cat2: "인증서", cat3: "SSL" },
    /* 네트워크 > 인터페이스 */
    { code: "CHK-NET-001", nm: "네트워크 인터페이스 상태", method: "자동", std: "UP", unit: "", cat1: "네트워크", cat2: "인터페이스", cat3: "상태" },
    { code: "CHK-NET-002", nm: "네트워크 트래픽 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "네트워크", cat2: "인터페이스", cat3: "트래픽" },
    { code: "CHK-NET-008", nm: "대역폭 가용률", method: "자동", std: "> 20%", unit: "%", cat1: "네트워크", cat2: "인터페이스", cat3: "대역폭" },
    /* 네트워크 > 품질 */
    { code: "CHK-NET-003", nm: "패킷 손실률", method: "자동", std: "< 1%", unit: "%", cat1: "네트워크", cat2: "품질", cat3: "패킷손실" },
    { code: "CHK-NET-004", nm: "네트워크 지연시간", method: "자동", std: "< 100ms", unit: "ms", cat1: "네트워크", cat2: "품질", cat3: "지연시간" },
    /* 네트워크 > 설정 */
    { code: "CHK-NET-005", nm: "ARP 테이블 정상 확인", method: "자동", std: "정상", unit: "", cat1: "네트워크", cat2: "설정", cat3: "ARP" },
    { code: "CHK-NET-006", nm: "라우팅 테이블 확인", method: "자동", std: "정상", unit: "", cat1: "네트워크", cat2: "설정", cat3: "라우팅" },
    { code: "CHK-NET-007", nm: "VLAN 설정 확인", method: "육안", std: "정상", unit: "", cat1: "네트워크", cat2: "설정", cat3: "VLAN" },
    /* WEB > 응답 */
    { code: "CHK-WEB-001", nm: "WEB 서비스 응답 코드", method: "자동", std: "200", unit: "", cat1: "WEB", cat2: "응답", cat3: "응답코드" },
    { code: "CHK-WEB-002", nm: "WEB 응답 시간", method: "자동", std: "< 3초", unit: "초", cat1: "WEB", cat2: "응답", cat3: "응답시간" },
    { code: "CHK-WEB-008", nm: "정적 리소스 응답 확인", method: "자동", std: "정상", unit: "", cat1: "WEB", cat2: "응답", cat3: "정적리소스" },
    /* WEB > 프로세스 */
    { code: "CHK-WEB-004", nm: "WEB 프로세스 상태", method: "자동", std: "Running", unit: "", cat1: "WEB", cat2: "프로세스", cat3: "상태" },
    { code: "CHK-WEB-005", nm: "WEB 커넥션 수", method: "자동", std: "< 1000", unit: "개", cat1: "WEB", cat2: "프로세스", cat3: "커넥션" },
    { code: "CHK-WEB-006", nm: "WEB 쓰레드 풀 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "WEB", cat2: "프로세스", cat3: "쓰레드" },
    /* WEB > 로그 */
    { code: "CHK-WEB-003", nm: "WEB 에러 로그 확인", method: "육안", std: "0건", unit: "건", cat1: "WEB", cat2: "로그", cat3: "에러" },
    { code: "CHK-WEB-007", nm: "WEB 접근 로그 확인", method: "육안", std: "정상", unit: "", cat1: "WEB", cat2: "로그", cat3: "접근" },
    /* WAS > 리소스 */
    { code: "CHK-WAS-001", nm: "WAS 프로세스 상태", method: "자동", std: "Running", unit: "", cat1: "WAS", cat2: "리소스", cat3: "프로세스" },
    { code: "CHK-WAS-002", nm: "WAS 힙 메모리 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "WAS", cat2: "리소스", cat3: "힙메모리" },
    { code: "CHK-WAS-003", nm: "WAS 쓰레드 풀 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "WAS", cat2: "리소스", cat3: "쓰레드" },
    { code: "CHK-WAS-007", nm: "WAS GC 빈도 확인", method: "자동", std: "정상", unit: "", cat1: "WAS", cat2: "리소스", cat3: "GC" },
    /* WAS > 커넥션 */
    { code: "CHK-WAS-004", nm: "WAS JDBC 커넥션 풀", method: "자동", std: "< 80%", unit: "%", cat1: "WAS", cat2: "커넥션", cat3: "JDBC" },
    { code: "CHK-WAS-005", nm: "WAS 세션 수", method: "자동", std: "< 5000", unit: "개", cat1: "WAS", cat2: "커넥션", cat3: "세션" },
    /* WAS > 로그/배포 */
    { code: "CHK-WAS-006", nm: "WAS 에러 로그 확인", method: "육안", std: "0건", unit: "건", cat1: "WAS", cat2: "로그/배포", cat3: "에러" },
    { code: "CHK-WAS-008", nm: "WAS 배포 상태 확인", method: "육안", std: "정상", unit: "", cat1: "WAS", cat2: "로그/배포", cat3: "배포" },
    /* DBMS > 상태 */
    { code: "CHK-DB-001", nm: "DB 서비스 상태", method: "자동", std: "Running", unit: "", cat1: "DBMS", cat2: "상태", cat3: "서비스" },
    { code: "CHK-DB-002", nm: "DB 커넥션 수", method: "자동", std: "< 200", unit: "개", cat1: "DBMS", cat2: "상태", cat3: "커넥션" },
    { code: "CHK-DB-007", nm: "DB 복제 상태", method: "자동", std: "정상", unit: "", cat1: "DBMS", cat2: "상태", cat3: "복제" },
    /* DBMS > 저장소 */
    { code: "CHK-DB-003", nm: "DB 테이블스페이스 사용률", method: "자동", std: "< 85%", unit: "%", cat1: "DBMS", cat2: "저장소", cat3: "테이블스페이스" },
    { code: "CHK-DB-009", nm: "DB 아카이브 로그 확인", method: "자동", std: "< 80%", unit: "%", cat1: "DBMS", cat2: "저장소", cat3: "아카이브" },
    /* DBMS > 성능 */
    { code: "CHK-DB-004", nm: "DB 슬로우 쿼리 수", method: "자동", std: "< 10", unit: "건", cat1: "DBMS", cat2: "성능", cat3: "슬로우쿼리" },
    { code: "CHK-DB-005", nm: "DB 데드락 발생 수", method: "자동", std: "0", unit: "건", cat1: "DBMS", cat2: "성능", cat3: "데드락" },
    { code: "CHK-DB-008", nm: "DB Lock 대기 확인", method: "자동", std: "0", unit: "건", cat1: "DBMS", cat2: "성능", cat3: "Lock" },
    { code: "CHK-DB-010", nm: "DB 인덱스 상태 확인", method: "육안", std: "정상", unit: "", cat1: "DBMS", cat2: "성능", cat3: "인덱스" },
    /* DBMS > 로그 */
    { code: "CHK-DB-006", nm: "DB 에러 로그 확인", method: "육안", std: "0건", unit: "건", cat1: "DBMS", cat2: "로그", cat3: "에러" },
    /* 운영 > 백업 */
    { code: "CHK-BAK-001", nm: "백업 상태 확인", method: "육안", std: "정상", unit: "", cat1: "운영", cat2: "백업", cat3: "상태" },
    { code: "CHK-BAK-002", nm: "전체 백업 수행 확인", method: "자동", std: "성공", unit: "", cat1: "운영", cat2: "백업", cat3: "전체" },
    { code: "CHK-BAK-003", nm: "증분 백업 수행 확인", method: "자동", std: "성공", unit: "", cat1: "운영", cat2: "백업", cat3: "증분" },
    { code: "CHK-BAK-004", nm: "백업 용량 확인", method: "자동", std: "< 500GB", unit: "GB", cat1: "운영", cat2: "백업", cat3: "용량" },
    { code: "CHK-BAK-005", nm: "백업 복원 테스트", method: "육안", std: "성공", unit: "", cat1: "운영", cat2: "백업", cat3: "복원" },
    /* 운영 > 이중화 */
    { code: "CHK-HA-001", nm: "이중화 상태 확인", method: "자동", std: "Active", unit: "", cat1: "운영", cat2: "이중화", cat3: "상태" },
    { code: "CHK-HA-002", nm: "이중화 절체 테스트", method: "육안", std: "성공", unit: "", cat1: "운영", cat2: "이중화", cat3: "절체" },
    { code: "CHK-HA-003", nm: "클러스터 노드 상태", method: "자동", std: "정상", unit: "", cat1: "운영", cat2: "이중화", cat3: "클러스터" },
    { code: "CHK-HA-004", nm: "Heartbeat 확인", method: "자동", std: "정상", unit: "", cat1: "운영", cat2: "이중화", cat3: "Heartbeat" },
    /* 운영 > 성능 */
    { code: "CHK-PERF-001", nm: "TPS 처리량 확인", method: "자동", std: "> 100", unit: "TPS", cat1: "운영", cat2: "성능", cat3: "TPS" },
    { code: "CHK-PERF-002", nm: "평균 응답시간", method: "자동", std: "< 2초", unit: "초", cat1: "운영", cat2: "성능", cat3: "응답시간" },
    { code: "CHK-PERF-003", nm: "동시접속자 처리 확인", method: "자동", std: "> 500", unit: "명", cat1: "운영", cat2: "성능", cat3: "동시접속" },
    { code: "CHK-PERF-004", nm: "부하테스트 결과 확인", method: "육안", std: "통과", unit: "", cat1: "운영", cat2: "성능", cat3: "부하테스트" },
    /* 하드웨어 > 전원 */
    { code: "CHK-HW-005", nm: "UPS 상태 확인", method: "자동", std: "정상", unit: "", cat1: "하드웨어", cat2: "전원", cat3: "UPS" },
    { code: "CHK-HW-001", nm: "하드웨어 온도 확인", method: "자동", std: "< 70℃", unit: "℃", cat1: "하드웨어", cat2: "냉각", cat3: "온도" },
    { code: "CHK-HW-003", nm: "팬 상태 확인", method: "자동", std: "정상", unit: "", cat1: "하드웨어", cat2: "냉각", cat3: "팬" },
    { code: "CHK-HW-004", nm: "RAID 상태 확인", method: "자동", std: "정상", unit: "", cat1: "하드웨어", cat2: "스토리지", cat3: "RAID" },
    { code: "CHK-HW-006", nm: "디스크 SMART 상태", method: "자동", std: "정상", unit: "", cat1: "하드웨어", cat2: "스토리지", cat3: "SMART" },
  ];

  const defaultItems = [
    { id: 1, code: "CHK-CPU-001", nm: "CPU 사용률", method: "자동", std: "< 80%", unit: "%" },
    { id: 2, code: "CHK-MEM-001", nm: "메모리 사용률", method: "자동", std: "< 85%", unit: "%" },
    { id: 3, code: "CHK-DISK-001", nm: "디스크 사용률", method: "자동", std: "< 90%", unit: "%" },
    { id: 4, code: "CHK-LOG-001", nm: "로그 에러 확인", method: "육안", std: "0건", unit: "건" },
  ];
  const [inspItems, setInspItems] = useState([]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    if (open && item) { setInspItems(defaultItems); setNextId(5); }
    if (open && !item) { setInspItems([]); setNextId(1); }
  }, [open]);

  const addItem = (code) => {
    const vc = vcPool.find(v => v.code === code);
    if (!vc) return;
    setInspItems(prev => [...prev, { id: nextId, code: vc.code, nm: vc.nm, method: vc.method, std: vc.std, unit: vc.unit }]);
    setNextId(p => p + 1);
  };
  const removeItem = (id) => setInspItems(prev => prev.filter(x => x.id !== id));
  const updateItemStd = (id, val) => setInspItems(prev => prev.map(x => x.id === id ? { ...x, std: val } : x));


  const available = vcPool.filter(vc => !inspItems.some(it => it.code === vc.code) && (!form.inspKind || vc.cat1 === form.inspKind));

  /* ── 미리보기 탭 state ── */
  const [showPreview, setShowPreview] = useState(false);

  /* 패널 열릴 때: 신규면 미리보기 기본 활성화, 수정/읽기면 비활성화 */
  useEffect(() => { if (open) setShowPreview(!item); }, [open]);

  /* ── 점검항목을 대분류별로 그룹화 ── */
  const groupedItems = inspItems.reduce((acc, it) => {
    const vc = vcPool.find(v => v.code === it.code);
    const cat = vc ? vc.cat1 : "기타";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...it, cat2: vc ? vc.cat2 : "", cat3: vc ? vc.cat3 : "" });
    return acc;
  }, {});

  /* ── 점검표 미리보기 컴포넌트 ── */
  const PreviewDoc = () => {
    const today = new Date();
    const tdStr = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`;
    const tbl = { width: "100%", borderCollapse: "collapse" };
    const th = (extra={}) => ({ padding: "6px 10px", border: "1px solid #333", background: "#1a3a5c", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "center", ...extra });
    const thLight = (extra={}) => ({ padding: "6px 10px", border: "1px solid #333", background: "#c8d8e8", color: "#1a3a5c", fontSize: 12, fontWeight: 700, textAlign: "center", ...extra });
    const td = (extra={}) => ({ padding: "6px 10px", border: "1px solid #aaa", fontSize: 12, verticalAlign: "middle", ...extra });
    const secHdr = (extra={}) => ({ padding: "5px 10px", border: "1px solid #333", background: "#2d5a8e", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "center", letterSpacing: 2, ...extra });
    return (
      <div style={{ fontFamily: PRETENDARD_FONT, background: "#fff", padding: "20px 24px", minHeight: "100%", color: "#111" }}>
        {/* 제목 */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 12, color: "#1a3a5c", borderBottom: "3px solid #1a3a5c", paddingBottom: 8, marginBottom: 4 }}>점 검 표</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontSize: 12, color: "#444" }}>
            <span style={{ width: 12, height: 12, border: "1.5px solid #333", display: "inline-block", verticalAlign: "middle" }} />
            <span>{form.nm || "(점검표 명 미입력)"} — {form.inspType} / {form.inspKind || "점검종류 미선택"}</span>
          </div>
        </div>

        {/* SITE INFORMATION */}
        <div style={secHdr({ marginBottom: 0 })}>SITE INFORMATION</div>
        <table style={{ ...tbl, marginBottom: 10 }}>
          <tbody>
            <tr>
              <td style={thLight({ width: "15%", textAlign: "left" })}>고객사명</td>
              <td style={td({ width: "35%" })}>&nbsp;</td>
              <td style={thLight({ width: "15%", textAlign: "left" })}>작업일자</td>
              <td style={td({ width: "35%" })}>{tdStr}</td>
            </tr>
            <tr>
              <td style={thLight({ textAlign: "left" })}>작업구분</td>
              <td style={td()}>주간 / 야간 &nbsp;&nbsp; 평일 / 휴일</td>
              <td style={thLight({ textAlign: "left" })}>작업시간</td>
              <td style={td()}>:&nbsp;&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;&nbsp;:</td>
            </tr>
          </tbody>
        </table>

        {/* SYSTEM INFORMATION */}
        <div style={secHdr({ marginBottom: 0 })}>SYSTEM INFORMATION</div>
        <table style={{ ...tbl, marginBottom: 10 }}>
          <tbody>
            {form.exposedRes.length > 0 ? form.exposedRes.map((r, i) => (
              <tr key={r}>
                <td style={thLight({ width: "20%", textAlign: "left" })}>{r}</td>
                <td style={td()}>&nbsp;</td>
                {form.exposedRes[i+1] ? <>
                  <td style={thLight({ width: "20%", textAlign: "left" })}>{form.exposedRes[i+1]}</td>
                  <td style={td()}>&nbsp;</td>
                </> : <><td style={{ border: "1px solid #aaa" }} /><td style={{ border: "1px solid #aaa" }} /></>}
              </tr>
            )).filter((_, i) => i % 2 === 0) : (
              <tr>
                <td colSpan={4} style={td({ textAlign: "center", color: "#aaa" })}>노출 자원정보를 선택하면 여기에 표시됩니다</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* SYSTEM DETAIL CHECK */}
        <div style={secHdr({ marginBottom: 0 })}>SYSTEM DETAIL CHECK</div>
        {Object.keys(groupedItems).length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "#aaa", fontSize: 12, border: "1px solid #aaa" }}>점검항목을 추가하면 여기에 표시됩니다</div>
        ) : (
          Object.entries(groupedItems).map(([cat, items]) => (
            <div key={cat}>
              <table style={{ ...tbl }}>
                <thead>
                  <tr>
                    <th style={th({ width: "70%" })}>점검 내용</th>
                    <th style={th({ width: "30%", borderLeft: "2px solid #fff" })}>점검 결과</th>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ padding: "4px 10px", border: "1px solid #aaa", background: "#e8f0f8", color: "#1a3a5c", fontWeight: 700 }}>
                      [{cat}]
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.id}>
                      <td style={td()}>
                        <div style={{ fontWeight: 600, fontSize: 12 }}>{it.nm}</div>
                        <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{it.code}</div>
                      </td>
                      <td style={td({ textAlign: "center" })}>
                        {it.method === "자동"
                          ? <span style={{ fontSize: 12, color: "#aaa" }}>자동 수집</span>
                          : <span style={{ fontSize: 12 }}>□ 정상 &nbsp; □ 비정상</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}

        {/* 특이사항 */}
        <div style={{ marginTop: 10, border: "1px solid #aaa" }}>
          <div style={{ padding: "5px 10px", background: "#e8f0f8", borderBottom: "1px solid #aaa", fontSize: 12, fontWeight: 700, color: "#1a3a5c" }}>[특이사항]</div>
          <div style={{ padding: "40px 10px 10px", fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
            {form.memo || "점검 중 특이사항을 기재합니다."}
          </div>
        </div>

        {/* 확인 서명 */}
        <div style={{ marginTop: 16, border: "2px solid #1a3a5c", borderRadius: 4 }}>
          <div style={{ padding: "6px 0", background: "#1a3a5c", color: "#fff", textAlign: "center", fontSize: 12, fontWeight: 700, letterSpacing: 4 }}>상기와 같이 점검 하였음을 확인 합니다</div>
          <table style={{ ...tbl }}>
            <tbody>
              <tr>
                <td style={td({ width: "15%", background: "#f5f5f5", fontWeight: 700 })}>작업자</td>
                <td style={td({ width: "35%" })}>&nbsp;</td>
                <td style={td({ width: "15%", background: "#f5f5f5", fontWeight: 700 })}>확인자</td>
                <td style={td({ width: "35%" })}>&nbsp;</td>
              </tr>
              <tr>
                <td style={td({ background: "#f5f5f5", fontWeight: 700 })}>소속/성명</td>
                <td style={td()}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td style={td({ background: "#f5f5f5", fontWeight: 700 })}>부서/성명</td>
                <td style={td()}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#aaa" }}>(인)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* 점검세부분류 목록 (vcPool의 cat1 기반) */
  const subCategories = Array.from(new Set(vcPool.map(v => v.cat1)));

  /* ── 편집 폼 ── */
  const editFormJSX = (
    <>
      {/* ── 사용유무 — 최상단 ── */}
      <FormRow label="사용유무">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div onClick={() => !ro && set("st", form.st === "Y" ? "N" : "Y")}
            style={{ position: "relative", width: 44, height: 24, borderRadius: 12,
              cursor: ro ? "default" : "pointer", opacity: ro ? 0.6 : 1,
              background: form.st === "Y" ? C.pri : "#D1D5DB", transition: "background .2s" }}>
            <div style={{ position: "absolute", top: 2, left: form.st === "Y" ? 22 : 2,
              width: 20, height: 20, borderRadius: "50%", background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .2s" }} />
          </div>
          <span style={{ fontSize: 13, color: form.st === "Y" ? C.pri : C.txL, fontWeight: 500, opacity: ro ? 0.6 : 1 }}>
            {form.st === "Y" ? "사용" : "미사용"}
          </span>
        </div>
      </FormRow>

      <div style={{ marginBottom: 18 }}>
        <SecTitle label="기본 정보" primary />
        <div style={{ display: "flex", gap: 12, marginBottom: 0 }}>
          <div style={{ flex: 2 }}>
            <FormRow label="점검표 명" required>
              <FInput style={{ ...roS }} value={form.nm} onChange={e => set("nm", e.target.value)} placeholder="점검표 명" readOnly={ro} maxLength={100} />
            </FormRow>
          </div>
          <div style={{ flex: 1 }}>
            <FormRow label="점검세부분류" required>
              <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.inspKind} onChange={e => {
                const nv = e.target.value;
                if (form.inspKind && nv !== form.inspKind && inspItems.length > 0) {
                  setKindChangeConfirm(nv);
                } else {
                  set("inspKind", nv); setItemFilter("");
                }
              }}>
                <option value="">선택하세요</option>
                {subCategories.map(o => <option key={o} value={o}>{o}</option>)}
              </RoSelect>
            </FormRow>
          </div>
        </div>
        <FormRow label="노출 자원정보">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {resInfoOptions.map(ri => {
              const sel = form.exposedRes.includes(ri);
              return <span key={ri} onClick={() => !ro && set("exposedRes", sel ? form.exposedRes.filter(x => x !== ri) : [...form.exposedRes, ri])} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 12, border: `1px solid ${sel ? C.pri : C.brd}`, background: sel ? C.priL : "", color: sel ? C.priD : C.txS, cursor: ro ? "default" : "pointer" }}>{ri}</span>;
            })}
          </div>
        </FormRow>
      </div>

      <div style={{ marginBottom: 18 }}>
        <SecTitle label="점검항목" />
        {!form.inspKind && <div style={{ padding: 16, textAlign: "center", color: C.txL, fontSize: 12, background: "#F9FAFC", borderRadius: 6, marginBottom: 8 }}>점검세부분류를 먼저 선택하세요.</div>}
        {form.inspKind && <>
          {/* 상단: 검색 (편집모드만) */}
          {!ro && available.length > 0 && (() => {
            const filtered = itemFilter ? available.filter(vc => vc.nm.toLowerCase().includes(itemFilter.toLowerCase()) || vc.code.toLowerCase().includes(itemFilter.toLowerCase())) : available;
            return <div style={{ marginBottom: 10 }}>
              <div style={{ position: "relative", marginBottom: 6 }}>
                <FInput style={{ paddingLeft: 28, fontSize: 14, height: 32 }} placeholder="항목명 또는 검증코드로 검색..." value={itemFilter} onChange={e => setItemFilter(e.target.value)} />
                <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Ic n="search" s={13} c={C.txL} /></span>
                {itemFilter && <span onClick={() => setItemFilter("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 15, color: C.txL, lineHeight: 1 }}>×</span>}
              </div>
              <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, maxHeight: 200, overflowY: "auto" }}>
                {filtered.length === 0 && <div style={{ padding: 14, textAlign: "center", fontSize: 12, color: C.txL }}>"{itemFilter}" 검색 결과가 없습니다.</div>}
                {filtered.map(vc => (
                  <div key={vc.code} onClick={() => addItem(vc.code)} style={{ padding: "7px 12px", cursor: "pointer", borderBottom: `1px solid ${C.brd}`, display: "flex", alignItems: "center", gap: 6, fontSize: 12 }} onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 12, background: vc.method === "자동" ? "#dbeafe" : "#fff7ed", color: vc.method === "자동" ? "#1e40af" : "#c2410c", flexShrink: 0 }}>{vc.method}</span>
                    <span style={{ fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{vc.nm}</span>
                    <span style={{ fontSize: 12, color: C.txL, flexShrink: 0 }}>{vc.code}</span>
                    <span style={{ fontSize: 12, color: C.txS, background: "#F9FAFC", padding: "1px 5px", borderRadius: 8, flexShrink: 0 }}>{vc.cat2}›{vc.cat3}</span>
                  </div>
                ))}
              </div>
              {available.length === 0 && inspItems.length > 0 && <div style={{ padding: 12, textAlign: "center", color: C.txL, fontSize: 12, background: "#F9FAFC", borderRadius: 6 }}>모든 항목이 추가되었습니다.</div>}
            </div>;
          })()}
          {/* 하단: 선택된 점검항목 */}
          <div style={{ fontSize: 12, fontWeight: 600, color: C.txS, marginBottom: 6 }}>
            선택된 항목 <span style={{ fontWeight: 400, color: C.txL }}>({inspItems.length}개)</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 8 }}>
            <thead><tr style={{ background: "#F9FAFC" }}>
              {["항목명","검증코드","방식","기준값","단위",...(ro ? [] : [""])].map(h => <th key={h} style={{ padding: "8px 6px", borderBottom: `2px solid ${C.brd}`, textAlign: "left", fontWeight: 600, color: C.txS }}>{h}</th>)}
            </tr></thead>
            <tbody>{inspItems.map(it => <tr key={it.id} style={{ borderBottom: `1px solid ${C.brd}` }}>
              <td style={{ padding: "8px 6px" }}>{it.nm}</td>
              <td style={{ color: C.pri }}>{it.code}</td>
              <td><span style={{ padding: "1px 6px", borderRadius: 3, background: it.method === "자동" ? "#dbeafe" : "#fff7ed", color: it.method === "자동" ? "#1e40af" : "#c2410c" }}>{it.method}</span></td>
              <td>{ro ? <span style={{ color: C.txS }}>{it.std}</span> : <FInput style={{ width: 80, padding: "3px 6px", border: `1px solid ${C.brd}`, borderRadius: 4 }} value={it.std} onChange={e => updateItemStd(it.id, e.target.value)} />}</td>
              <td style={{ color: C.txS }}>{it.unit}</td>
              {!ro && <td style={{ textAlign: "center" }}><span onClick={() => removeItem(it.id)} style={{ cursor: "pointer", color: C.red, fontSize: 15, fontWeight: 600 }} title="삭제">×</span></td>}
            </tr>)}</tbody>
          </table>
          {inspItems.length === 0 && <div style={{ padding: 16, textAlign: "center", color: C.txL, fontSize: 12, background: "#F9FAFC", borderRadius: 6 }}>점검항목이 없습니다. 위에서 검색하여 추가하세요.</div>}
        </>}
      </div>

      <div style={{ marginBottom: 18 }}>
        <SecTitle label="관리 정보" />
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="등록자" style={{ flex: 1 }}>
            <FInput style={{ background: "#F9FAFC", pointerEvents: "none" }} value={form.registrant} readOnly />
          </FormRow>
          <FormRow label="등록일" style={{ flex: 1 }}>
            <FInput style={{ background: "#F9FAFC", pointerEvents: "none" }} value={form.regDt} readOnly />
          </FormRow>
          <div style={{ flex: 1 }} />
        </div>
        {ro && <div style={{ display: "flex", gap: 12, marginTop: 0 }}>
          <FormRow label="연결된 자원" style={{ flex: 1 }}>
            <FInput style={{ ...roS }} value={form.linkedRes} readOnly />
          </FormRow>
          <FormRow label="연결된 정기점검" style={{ flex: 1 }}>
            <FInput style={{ ...roS }} value={form.linkedSch} readOnly />
          </FormRow>
          <div style={{ flex: 1 }} />
        </div>}
      </div>
    </>
  );

  return (
    <>
    <UnsavedConfirm open={confirmOpen} onDiscard={handleDiscard} onSave={() => handleSaveConfirm()} />
    {/* 점검세부분류 변경 확인 */}
    <ConfirmModal open={!!kindChangeConfirm} title="점검세부분류 변경" msg="다른 점검 세부분류를 선택하시는 경우 모든 점검항목이 초기화 됩니다."
      okLabel="확인" danger={false}
      onOk={() => { set("inspKind", kindChangeConfirm); setInspItems([]); setNextId(1); setItemFilter(""); setKindChangeConfirm(null); }}
      onCancel={() => setKindChangeConfirm(null)} />
    <SidePanel open={open} onClose={() => { setShowPreview(false); if (editMode) { setConfirmOpen(true); } else { onClose(); } }} title={isNew ? "점검표 추가" : "점검표 상세"} width={showPreview ? 1220 : 640} noScroll>
      {/* 2컬럼 flex - 미리보기(왼쪽) + 편집폼(오른쪽) */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* 미리보기 컬럼 - 왼쪽, SidePanel 내부에 속함 */}
        {showPreview && (
          <div style={{ flex: 1, borderRight: `1px solid ${C.brd}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px 12px", borderBottom: `1px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "#FAFBFC" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.txH }}>점검표 미리보기</span>
              <span style={{ fontSize: 12, color: C.txL, background: "#F0F5FF", padding: "2px 8px", borderRadius: 10, border: `1px solid ${C.priL}` }}>실시간 반영</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              <div style={{ border: `1px solid ${C.brd}`, borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
                <PreviewDoc />
              </div>
            </div>
          </div>
        )}

        {/* 편집 폼 컬럼 - 오른쪽 */}
        <div style={{ flex: "0 0 640px", display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {/* ── 탭 ── */}
            {!isNew && (
              <div style={{ display:"flex", borderBottom:`2px solid ${C.brd}`, marginBottom:18, gap:0 }}>
                {[["info","기본 정보"],["res","연결 자원"]].map(([k,l]) => (
                  <button key={k} onClick={()=>setActiveTab(k)}
                    style={{ padding:"8px 20px", fontSize:12, fontWeight:600, border:"none", background:"none",
                      cursor:"pointer", borderBottom: activeTab===k ? `2px solid ${C.pri}` : "2px solid transparent",
                      marginBottom:-2, color: activeTab===k ? C.pri : C.txL, transition:"color .15s" }}>
                    {l}
                    {k==="res" && linkedResIds.length > 0 &&
                      <span style={{ marginLeft:6, fontSize:12, padding:"1px 7px", borderRadius:10,
                        background: activeTab===k ? C.pri : C.brd,
                        color: activeTab===k ? "#fff" : C.txS }}>{linkedResIds.length}</span>}
                  </button>
                ))}
              </div>
            )}

            {/* ── 탭: 기본 정보 ── */}
            {(isNew || activeTab === "info") && (<>
            {editFormJSX}
            </>)}

            {/* ── 탭: 연결 자원 ── */}
            {!isNew && activeTab === "res" && (() => {
              const clSub    = item?.sub || "";
              const clId     = item?.id;
              const sysFiltered = RES.filter(r => {
                if (resSys   && r.sysId !== resSys)   return false;
                if (resLarge && r.large !== resLarge)  return false;
                if (resMid   && r.mid   !== resMid)    return false;
                return true;
              });

              // 각 자원 상태 분류
              const classify = (r) => {
                if (linkedResIds.includes(r.id)) return "linked";       // 현재 점검표에 연결됨
                const mapped = resLinkMap[r.id];
                if (mapped && mapped !== clId) return "other";           // 다른 점검표에 이미 연결됨
                return "free";                                           // 연결 가능
              };

              const baseRes = sysFiltered.filter(r => {
                if (r.st === "미사용") return false;
                if (resSearch) {
                  const q = resSearch.toLowerCase();
                  return r.nm.toLowerCase().includes(q) || (r.ip||"").includes(q);
                }
                return true;
              });

              // 정렬: 현재 연결됨 → 권장(sub 일치) → 자유 → 다른 점검표 연결됨(최하단)
              const sorted = [...baseRes].sort((a, b) => {
                const order = { linked: 0, free: 1, other: 2 };
                const ca = classify(a), cb = classify(b);
                if (order[ca] !== order[cb]) return order[ca] - order[cb];
                // 같은 그룹 내: 권장 우선 → 이름순
                const aM = (ca !== "other" && a.mid === clSub) ? 0 : 1;
                const bM = (cb !== "other" && b.mid === clSub) ? 0 : 1;
                if (aM !== bM) return aM - bM;
                return a.nm.localeCompare(b.nm);
              });

              const selectableIds = sorted.filter(r => classify(r) !== "other").map(r => r.id);
              const allSelected   = selectableIds.length > 0 && selectableIds.every(id => linkedResIds.includes(id));
              const anySelected   = selectableIds.some(id => linkedResIds.includes(id));

              return (
                <div>
                  {/* 등록 완료 배너 */}
                  {isJustCreated && (
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px",
                      borderRadius:8, background:"#f0fdf4", border:"1px solid #bbf7d0", marginBottom:14 }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", background:"#16a34a",
                        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:"#166534" }}>점검표 등록이 완료되었습니다.</div>
                        <div style={{ fontSize:12, color:"#15803d", marginTop:1 }}>아래에서 이 점검표를 사용할 자원을 연결하세요.</div>
                      </div>
                    </div>
                  )}

                  {/* 상단: 안내 */}
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:12, color:C.txL }}>
                      이 점검표에 연결할 자원을 선택하세요.
                      <span style={{ color:C.pri, fontWeight:600 }}> 현재 {linkedResIds.length}개</span> 연결됨
                      {clSub && <span style={{ color:C.txS }}> · {clSub} 자원 권장</span>}
                    </div>
                  </div>

                  {/* 필터 */}
                  <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:8 }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <FSelect value={resSys} onChange={e=>{ setResSys(e.target.value); }}
                        style={{ flex:1, padding:"5px 10px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", outline:"none" }}>
                        <option value="">전체 시스템</option>
                        {SYS.map(s=><option key={s.id} value={s.id}>{s.nm}</option>)}
                      </FSelect>
                      <FSelect value={resMid} onChange={e=>setResMid(e.target.value)}
                        style={{ flex:1, padding:"5px 10px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", outline:"none" }}>
                        <option value="">전체 중분류</option>
                        {["서버","WEB","WAS","DBMS","네트워크","보안","스토리지","백업","클라우드","기타"].map(o=><option key={o} value={o}>{o}</option>)}
                      </FSelect>
                      <FSelect value={resLarge} onChange={e=>setResLarge(e.target.value)}
                        style={{ flex:1, padding:"5px 10px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", outline:"none" }}>
                        <option value="">전체 대분류</option>
                        {["하드웨어","소프트웨어"].map(o=><option key={o} value={o}>{o}</option>)}
                      </FSelect>
                    </div>
                    <div style={{ position:"relative" }}>
                      <FInput value={resSearch} onChange={e=>setResSearch(e.target.value)} placeholder="자원명 또는 IP 검색"
                        style={{ width:"100%", padding:"5px 10px 5px 28px", fontSize:12,
                          border:`1px solid ${C.brd}`, borderRadius:4, outline:"none", boxSizing:"border-box" }} />
                      <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                        <Ic n="search" s={12} c={C.txL} />
                      </span>
                      {resSearch && <span onClick={()=>setResSearch("")} style={{ position:"absolute", right:7, top:"50%",
                        transform:"translateY(-50%)", cursor:"pointer", fontSize:15, color:C.txL }}>×</span>}
                    </div>
                  </div>

                  {/* 전체 선택/해제 */}
                  {selectableIds.length > 0 && (
                    <div style={{ display:"flex", gap:8, marginBottom:6 }}>
                      <Btn xs outline onClick={() => selectableIds.forEach(id => !linkedResIds.includes(id) && onLinkChange?.(id, true))}>전체 선택</Btn>
                      <Btn xs disabled={!anySelected} onClick={() => selectableIds.forEach(id => linkedResIds.includes(id) && onLinkChange?.(id, false))}>전체 선택 해제</Btn>
                    </div>
                  )}

                  {/* 자원 목록 */}
                  <div style={{ border:`1px solid ${C.brd}`, borderRadius:8, overflow:"hidden", maxHeight:360, overflowY:"auto" }}>
                    {sorted.length === 0
                      ? <div style={{ padding:24, textAlign:"center", fontSize:12, color:C.txL }}>조건에 맞는 자원이 없습니다.</div>
                      : sorted.map((r, idx) => {
                        const state    = classify(r);
                        const linked   = state === "linked";
                        const isOther  = state === "other";
                        const isMatch  = r.mid === clSub && !isOther;
                        const prevOther = idx > 0 && classify(sorted[idx-1]) !== "other" && isOther;
                        return (
                          <React.Fragment key={r.id}>
                            {/* 구분선: 다른 점검표 연결된 항목 시작 전 */}
                            {prevOther && (
                              <div style={{ padding:"6px 14px", background:"#F9FAFC", borderBottom:`1px solid ${C.brd}`,
                                display:"flex", alignItems:"center", gap:6 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                <span style={{ fontSize:12, color:C.txL, fontWeight:500 }}>다른 점검표가 이미 연결된 자원 (선택 불가)</span>
                              </div>
                            )}
                            <div
                              onClick={() => !isOther && onLinkChange?.(r.id, !linked)}
                              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
                                borderBottom:`1px solid ${C.brd}`, transition:"background .12s",
                                cursor: isOther ? "not-allowed" : "pointer",
                                background: linked ? "#f0fdf4" : isOther ? "#F9FAFC" : "#fff",
                                borderLeft: linked ? "3px solid #16a34a" : isOther ? `3px solid ${C.brd}` : "3px solid transparent",
                                opacity: isOther ? 0.6 : 1 }}
                              onMouseEnter={e=>{ if(!linked && !isOther) e.currentTarget.style.background="#F5F7FF"; }}
                              onMouseLeave={e=>{ if(!linked && !isOther) e.currentTarget.style.background="#fff"; }}>
                              {/* 체크박스 */}
                              <div style={{ width:18, height:18, borderRadius:4, flexShrink:0, transition:"all .15s",
                                border:`2px solid ${linked ? "#16a34a" : isOther ? C.brd : C.brd}`,
                                background: linked ? "#16a34a" : "#fff",
                                display:"flex", alignItems:"center", justifyContent:"center" }}>
                                {linked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>}
                                {isOther && <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <line x1="2" y1="5" x2="8" y2="5" stroke={C.txL} strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>}
                              </div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:12, fontWeight:600, color: linked ? "#166534" : isOther ? C.txL : C.txt, display:"flex", alignItems:"center", gap:6 }}>
                                  {r.nm}
                                  {isMatch && <span style={{ fontSize:12, fontWeight:700, padding:"1px 6px",
                                    borderRadius:8, background:"#dbeafe", color:"#1d4ed8" }}>권장</span>}
                                </div>
                                <div style={{ fontSize:12, color:C.txL, marginTop:1 }}>
                                  {r.sysNm} · {r.mid} · {r.ip||"—"}
                                  {isOther && <span style={{ marginLeft:6, color:"#f59e0b" }}>· 다른 점검표 연결됨</span>}
                                </div>
                              </div>
                              {linked && <span style={{ fontSize:12, padding:"2px 8px", borderRadius:8,
                                background:"#dcfce7", color:"#166534", fontWeight:600, flexShrink:0 }}>연결됨</span>}
                            </div>
                          </React.Fragment>
                        );
                      })
                    }
                  </div>

                </div>
              );
            })()}
          </div>

          {/* ── 고정 푸터 (ResourcePanel 동일 패턴) ── */}
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
            {/* 삭제 불가 안내 메시지 */}
            {!isNew && ro && linkedResIds.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
                padding: "8px 12px", borderRadius: 6, background: "#FFF7ED", border: "1px solid #FED7AA" }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
                </svg>
                <span style={{ color: "#9A3412", fontSize: 12 }}>
                  연결된 자원이 있어 삭제할 수 없습니다. 연결 자원 탭에서 해제한 후 삭제하세요.
                </span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center" }}>
              {activeTab === "info" ? (
                (isNew || editMode) ? (
                  <>
                    <Btn onClick={handleCancel}>취소</Btn>
                    <Btn primary onClick={() => setShowPreview(p => !p)} style={{ marginLeft: 8, display:"flex", alignItems:"center", gap:5 }}>
                      {showPreview
                        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="0.5" y="0.5" width="9" height="9" rx="1.5"/><path d="M8 6l5-5M13 5V1h-4"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="4.5" width="9" height="9" rx="1.5"/><path d="M6 8L1 13M1 9v4h4"/></svg>}
                      {showPreview ? "미리보기 닫기" : "점검표 미리보기"}
                    </Btn>
                    <div style={{ flex: 1 }} />
                    <Btn primary onClick={handleSave}>{isNew ? "등록" : "저장"}</Btn>
                  </>
                ) : (
                  <>
                    <Btn onClick={onClose}>닫기</Btn>
                    <Btn primary onClick={() => setShowPreview(p => !p)} style={{ marginLeft: 8, display:"flex", alignItems:"center", gap:5 }}>
                      {showPreview
                        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="0.5" y="0.5" width="9" height="9" rx="1.5"/><path d="M8 6l5-5M13 5V1h-4"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="4.5" width="9" height="9" rx="1.5"/><path d="M6 8L1 13M1 9v4h4"/></svg>}
                      {showPreview ? "미리보기 닫기" : "점검표 미리보기"}
                    </Btn>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn danger disabled={linkedResIds.length > 0} onClick={() => {}}>삭제</Btn>
                      <Btn success onClick={() => setEditMode(true)}>수정</Btn>
                    </div>
                  </>
                )
              ) : (
                /* 연결 자원 탭 */
                <>
                  <Btn onClick={onClose}>닫기</Btn>
                  <Btn primary onClick={() => setShowPreview(p => !p)} style={{ marginLeft: 8, display:"flex", alignItems:"center", gap:5 }}>
                    {showPreview
                      ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="0.5" y="0.5" width="9" height="9" rx="1.5"/><path d="M8 6l5-5M13 5V1h-4"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="4.5" width="9" height="9" rx="1.5"/><path d="M6 8L1 13M1 9v4h4"/></svg>}
                    {showPreview ? "미리보기 닫기" : "점검표 미리보기"}
                  </Btn>
                  <div style={{ flex: 1 }} />
                  <Btn primary onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    저장
                  </Btn>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </SidePanel>
    </>
  );
};

const MgrCL = () => {
  const { cl, addCL } = useCL();
  const [selItem,   setSelItem]   = useState(null);
  const [showAdd,   setShowAdd]   = useState(false);
  const [savedItem, setSavedItem] = useState(null);
  const [resLinkMap, setResLinkMap] = useState(() => {
    const map = {};
    RES.forEach(r => { const c = CL_INIT.find(c => c.sub === r.mid); if (c) map[r.id] = c.id; });
    return map;
  });

  const getLinkedResIds = (clId) => Object.entries(resLinkMap)
    .filter(([,v]) => v === clId).map(([k]) => Number(k));

  const handleLinkChange = (resId, link, clId) => {
    setResLinkMap(prev => {
      const next = { ...prev };
      if (link) { next[resId] = clId; }
      else { if (next[resId] === clId) delete next[resId]; }
      return next;
    });
  };

  const handleSaved = (newItem) => {
    addCL(newItem);       // 목록에 즉시 반영
    setShowAdd(false);
    setSavedItem(newItem);
  };

  const activeItem = selItem || savedItem;

  return <div>
  <PH title="점검표" bc="홈 > 환경설정 > 점검표" />
  <SB ph="점검표명으로 검색" />
  <Tbl secTitle="점검표 목록" secCount={cl.length} secButtons={<SecBtnP onClick={() => setShowAdd(true)}>+ 점검표 추가</SecBtnP>} cols={[
    { t: "상태", k: "useYn", w: 80, r: v => <YnBadge v={v} /> },
    { t: "점검표명", k: "nm", mw: 150, align: "left", r: (v, row) => <span style={{ fontWeight: 600, color: C.pri, cursor: "pointer" }} onClick={() => setSelItem(row)}>{v}</span> },
    { t: "점검상세분류", k: "kind", w: 120 },
    { t: "항목수", k: "items", w: 70 },
    { t: "스케줄", k: "sch", w: 70 },
    { t: "연결자원", k: "id", w: 80, r: v => {
      const cnt = getLinkedResIds(v).length;
      return <span style={{ fontWeight:600, color: cnt>0 ? C.pri : C.txL }}>{cnt}개</span>;
    }},
    { t: "등록자", k: "registrant", w: 90 },
    { t: "등록일", k: "regDt", w: 140 },
  ]} data={cl} onRow={row => setSelItem(row)} />
  <ChecklistPanel open={showAdd} onClose={() => setShowAdd(false)} item={null}
    linkedResIds={[]} onLinkChange={()=>{}} onSaved={handleSaved} />
  <ChecklistPanel open={!!activeItem} onClose={() => { setSelItem(null); setSavedItem(null); }} item={activeItem}
    initialTab={savedItem ? "res" : "info"}
    isJustCreated={!!savedItem}
    resLinkMap={resLinkMap}
    linkedResIds={activeItem ? getLinkedResIds(activeItem.id) : []}
    onLinkChange={(resId, link) => handleLinkChange(resId, link, activeItem?.id)} />
</div>
};

const VCAddPanel = ({ open, onClose, onSaved }) => {
  const AGENTS = ["PROMETHEUS", "SSH", "LOKI", "육안검수"];
  const empty = { code:"", useYn:"Y", nm:"", desc:"", agent:"PROMETHEUS", val:"" };
  const [form,    setForm]    = useState(empty);
  const [errors,  setErrors]  = useState({});
  const { editMode, confirmOpen, handleDiscard, handleSaveConfirm, setConfirmOpen } = useEditPanel(open, onClose);

  useEffect(() => { if (open) { setForm(empty); setErrors({}); } }, [open]);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = "코드를 입력하세요.";
    if (!form.nm.trim())   e.nm   = "검증코드명을 입력하세요.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSaved({ id: form.code.trim().toUpperCase(), nm: form.nm.trim(), desc: form.desc.trim(), agent: form.agent, val: form.val.trim(), useYn: form.useYn });
    onClose();
  };

  const handleCancel = () => {
    const dirty = form.code || form.nm || form.desc || form.val;
    if (dirty) setConfirmOpen(true); else onClose();
  };

  const agentColor = (agent) => ({
    "PROMETHEUS": { bg:"#dcfce7", color:"#166534" },
    "SSH":        { bg:"#dbeafe", color:"#1e40af" },
    "LOKI":       { bg:"#fff7ed", color:"#9a3412" },
    "육안검수":   { bg:"#f3f4f6", color:"#374151" },
  }[agent] || { bg:"#f3f4f6", color:"#374151" });

  const fLabel = LABEL_STYLE;
  const fInput = (err) => ({
    width:"100%", padding:"8px 10px", fontSize:12, fontFamily:"inherit", outline:"none",
    border:`1px solid ${err ? C.red : C.brd}`, borderRadius:6, boxSizing:"border-box",
    background:"#fff", color:C.txt,
  });
  const fErr = { fontSize:12, color:C.red, marginTop:4 };
  const fRow  = { marginBottom:20 };
  const fHint = { fontSize:12, color:C.txL, marginTop:4 };

  return (
    <SidePanel open={open} onClose={handleCancel} title="검증코드 추가" width={480} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      {/* 폼 영역 */}
      <div>
        {/* 코드 */}
        <div style={fRow}>
          <label style={fLabel}>코드 <span style={{ color:C.red }}>*</span></label>
          <FInput value={form.code} onChange={e=>set("code", e.target.value.toUpperCase())}
            placeholder="예) VC100"
            style={{ ...fInput(errors.code), fontFamily:"inherit", letterSpacing:1 }} />
          {errors.code
            ? <div style={fErr}>{errors.code}</div>
            : <div style={fHint}>영문·숫자 조합으로 입력하세요.</div>}
        </div>

        {/* 사용 여부 */}
        <div style={fRow}>
          <label style={fLabel}>사용 여부</label>
          <div style={{ display:"flex", gap:8 }}>
            {["Y","N"].map(v => (
              <div key={v} onClick={()=>set("useYn",v)}
                style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 18px",
                  borderRadius:6, border:`1.5px solid ${form.useYn===v ? C.pri : C.brd}`,
                  background: form.useYn===v ? C.priL : "#fff",
                  cursor:"pointer", fontSize:12, fontWeight: form.useYn===v ? 600 : 400,
                  color: form.useYn===v ? C.pri : C.txS, transition:"all .15s" }}>
                <div style={{ width:14, height:14, borderRadius:"50%",
                  border:`2px solid ${form.useYn===v ? C.pri : C.brd}`,
                  background: form.useYn===v ? C.pri : "#fff",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {form.useYn===v && <div style={{ width:5, height:5, borderRadius:"50%", background:"#fff" }} />}
                </div>
                {v==="Y" ? "사용" : "미사용"}
              </div>
            ))}
          </div>
        </div>

        {/* 검증코드명 */}
        <div style={fRow}>
          <label style={fLabel}>검증코드명 <span style={{ color:C.red }}>*</span></label>
          <FInput value={form.nm} onChange={e=>set("nm",e.target.value)}
            placeholder="예) CPU 사용률 점검"
            style={fInput(errors.nm)} />
          {errors.nm && <div style={fErr}>{errors.nm}</div>}
        </div>

        {/* 점검내용 */}
        <div style={fRow}>
          <label style={fLabel}>점검내용</label>
          <FTextarea value={form.desc} onChange={e=>set("desc",e.target.value)}
            placeholder="점검 항목에 대한 설명을 입력하세요."
            rows={3}
            style={{ ...fInput(false), resize:"vertical", lineHeight:1.6 }} />
        </div>

        {/* 에이전트 타입 */}
        <div style={fRow}>
          <label style={fLabel}>에이전트 타입</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {AGENTS.map(ag => {
              const sel = form.agent === ag;
              const ac = agentColor(ag);
              return (
                <div key={ag} onClick={()=>set("agent",ag)}
                  style={{ padding:"6px 14px", borderRadius:6, cursor:"pointer",
                    border:`1.5px solid ${sel ? C.pri : C.brd}`,
                    background: sel ? C.priL : "#fff", transition:"all .15s" }}>
                  <span style={{ padding:"2px 8px", borderRadius:4, fontSize:12, fontWeight:600,
                    background:ac.bg, color:ac.color }}>{ag}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 정상 기준값 */}
        <div style={{ marginBottom:0 }}>
          <label style={fLabel}>정상 기준값</label>
          <FInput value={form.val} onChange={e=>set("val",e.target.value)}
            placeholder="예) < 80%  /  OPEN  /  0건  /  정상"
            style={fInput(false)} />
          <div style={fHint}>비워두면 목록에서 직접 입력할 수 있습니다.</div>
        </div>
      </div>

      </div>{/* /바디 */}

      {/* 푸터 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={handleCancel}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={handleSave}>등록</Btn>
        </div>
      </div>

      <ConfirmModal open={confirmOpen} title="입력을 취소하시겠습니까?" msg="입력한 내용이 저장되지 않습니다."
        okLabel="취소" onOk={() => { setConfirmOpen(false); onClose(); }} onCancel={() => setConfirmOpen(false)} />
    </SidePanel>
  );
};


const MgrVC = () => {
  const [vcData,  setVcData]  = useState(VC.map(v => ({ ...v })));
  const [showAdd, setShowAdd] = useState(false);
  const [editId,  setEditId]  = useState(null);
  const [editVal, setEditVal] = useState("");
  const [savedId, setSavedId] = useState(null);

  const saveEdit = (id, nextId) => {
    setVcData(p => p.map(v => v.id === id ? { ...v, val: editVal } : v));
    setSavedId(id);
    setTimeout(() => setSavedId(p => p === id ? null : p), 1800);
    if (nextId) {
      const next = vcData.find(v => v.id === nextId);
      if (next) { setEditId(nextId); setEditVal(next.val || ""); }
      else { setEditId(null); }
    } else { setEditId(null); }
  };
  const cancelEdit = () => { setEditId(null); setEditVal(""); };
  const startEdit  = (row) => { setEditId(row.id); setEditVal(row.val || ""); };
  const getAdjacentId = (id, dir) => {
    const idx = vcData.findIndex(v => v.id === id);
    return vcData[idx + dir]?.id || null;
  };
  const agentColor = (agent) => ({
    "PROMETHEUS": { bg:"#dcfce7", color:"#166534" },
    "SSH":        { bg:"#dbeafe", color:"#1e40af" },
    "LOKI":       { bg:"#fff7ed", color:"#9a3412" },
    "육안검수":   { bg:"#f3f4f6", color:"#374151" },
  }[agent] || { bg:"#f3f4f6", color:"#374151" });

  return <div>
    <PH title="검증코드" bc="홈 > 환경설정 > 점검표 > 검증코드" />
    <SB ph="검증코드명으로 검색" />
    <Tbl secTitle="검증코드 목록" secCount={vcData.length} noPaging
      secButtons={
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:12, color:C.txL, display:"flex", alignItems:"center", gap:3 }}>
            <Ic n="info" s={11} c={C.txL} />
            기준값 셀 클릭 후 Tab·Enter → 다음 행 &nbsp;|&nbsp; Shift+Tab → 이전 행
          </span>
          <SecBtnP onClick={()=>setShowAdd(true)}>+ 검증코드 추가</SecBtnP>
        </div>
      }
      cols={[
        { t:"상태",         k:"useYn",  w:80,  r: v => <YnBadge v={v} /> },
        { t:"코드",         k:"id",     w:140, align:"left", r: v => <span style={{ color:C.txS }}>{v}</span> },
        { t:"검증코드명",   k:"nm",     mw:160, align:"left", r: v => <span style={{ fontWeight:600 }}>{v}</span> },
        { t:"점검내용",     k:"desc",   mw:200, align:"left", r: v => <span style={{ color:C.txS }}>{v||"—"}</span> },
        { t:"에이전트 타입", k:"agent", w:130, r: v => {
          const ag = agentColor(v);
          return <span style={{ padding:"2px 10px", borderRadius:4, fontSize:12, fontWeight:600, background:ag.bg, color:ag.color }}>{v}</span>;
        }},
        { t:"정상 기준값",  k:"id",     w:180, r: (v, row) => {
          const isEditing = editId === row.id;
          const isSaved   = savedId === row.id;
          if (isEditing) return (
            <FInput autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)}
              onKeyDown={e=>{
                if (e.key==="Tab")    { e.preventDefault(); saveEdit(row.id, getAdjacentId(row.id, e.shiftKey?-1:1)); }
                else if (e.key==="Enter")  { saveEdit(row.id, getAdjacentId(row.id, 1)); }
                else if (e.key==="Escape") { cancelEdit(); }
              }}
              style={{ width:"100%", padding:"4px 8px", fontSize:14, fontWeight:600,
                border:`1.5px solid ${C.pri}`, borderRadius:5, outline:"none",
                textAlign:"left", boxSizing:"border-box", boxShadow:`0 0 0 3px ${C.pri}22` }} />
          );
          return (
            <div onClick={()=>startEdit(row)}
              style={{ display:"flex", alignItems:"center", justifyContent:"flex-start", gap:5,
                padding:"4px 8px", borderRadius:5, cursor:"text", minHeight:28,
                border:`1px dashed ${isSaved?"#16a34a":C.brd}`,
                background: isSaved?"#f0fdf4":"transparent", transition:"all .15s" }}
              onMouseEnter={e=>{ if(!isSaved){ e.currentTarget.style.borderColor=C.pri; e.currentTarget.style.background=C.priL; }}}
              onMouseLeave={e=>{ if(!isSaved){ e.currentTarget.style.borderColor=C.brd; e.currentTarget.style.background="transparent"; }}}>
              {isSaved
                ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize:12, fontWeight:700, color:"#16a34a" }}>{row.val||"—"}</span></>
                : <><span style={{ fontSize:12, fontWeight:600, color:row.val?C.txH:C.txL }}>{row.val||"미설정"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg></>
              }
            </div>
          );
        }},
        { t:"",  k:"id", w:80, r: (v, row) => editId === row.id ? (
          <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
            <Btn xs primary onClick={()=>saveEdit(row.id, getAdjacentId(row.id, 1))}>저장</Btn>
            <Btn xs onClick={cancelEdit}>취소</Btn>
          </div>
        ) : null },
      ]} data={vcData} />
    <VCAddPanel open={showAdd} onClose={()=>setShowAdd(false)}
      onSaved={(item) => { setVcData(p => [...p, item]); setShowAdd(false); }} />
  </div>;
};

const Placeholder = ({ title, bc }) => <div>
  <PH title={title} bc={bc} />
  <Card><div style={{ padding: 36, textAlign: "center", color: C.txL }}><Ic n="gear" s={40} c={C.txL} /><div style={{ marginTop: 10, fontSize: 15 }}>{title}</div><div style={{ marginTop: 4, fontSize: 12 }}>이 페이지는 개발 중입니다.</div></div></Card>
</div>;

/* ──── PAGES: SENTINEL ──── */
const StlDash = () => {
  const { di } = useDI();
  const cnt = { p: di.filter(x => x.st === "중단").length, d: di.filter(x => x.st === "지연").length, c: di.filter(x => x.st === "완료").length };
  return <div>
    <PH title="대시보드" bc="홈 > 대시보드" />
    <div style={{ display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
      <Stat label="오늘 점검" value={cnt.p + cnt.d + cnt.c} color={C.sec} icon="cal" />
      <Stat label="진행 중" value={cnt.p} color={C.pri} icon="check" />
      <Stat label="지연" value={cnt.d} color={C.red} icon="alert" />
      <Stat label="완료" value={cnt.c} color={C.purp} icon="check" />
    </div>
    <Tbl secTitle="나의 점검 현황" secCount={di.length} cols={[{ t: "자원", k: "resNm" }, { t: "점검표", k: "clNm" }, { t: "예정일", k: "due" }, { t: "상태", k: "st", r: v => <Badge status={v} /> }]} data={di} />
  </div>;
};

/* ── 센티널 일상점검 보고 작성 패널 ── */
const StlDailyPanel = ({ open, onClose, item, currentUser, toast }) => {
  const { addDI, updateDI } = useDI();
  const freeMode = !item;
  const isComp = item?.st === "완료";

  /* ── freeMode state ── */
  const [step,        setStep]        = useState(1);
  const [selRes,      setSelRes]      = useState(null);
  const [resSearch,   setResSearch]   = useState("");
  const [resSys,      setResSys]      = useState("");
  const [resCat,      setResCat]      = useState("");
  const [createdItem, setCreatedItem] = useState(null);

  const RPT_TYPES = [
    { value:"일일",  color:"#0C8CE9" },
    { value:"주간",  color:"#19973C" },
    { value:"월간",  color:"#F36D00" },
    { value:"분기",  color:"#7C3AED" },
    { value:"반기",  color:"#E24949" },
    { value:"연간",  color:"#333333" },
    { value:"상시",  color:"#0891B2" },
  ];

  const EYE_ITEMS = [
    { id:"e1", nm:"서버 외관 상태",   std:"이상없음" },
    { id:"e2", nm:"케이블 연결 상태", std:"정상연결" },
    { id:"e3", nm:"LED 표시등 확인",  std:"Green"   },
  ];
  const AUTO_ITEMS = [
    { id:"a1", nm:"CPU 사용률",       std:"< 80%",  val:"72%",     result:"정상",   errCode:null },
    { id:"a2", nm:"메모리 사용률",    std:"< 85%",  val:"68%",     result:"정상",   errCode:null },
    { id:"a3", nm:"디스크 사용률",    std:"< 90%",  val:"54%",     result:"정상",   errCode:null },
    { id:"a4", nm:"서비스 포트 확인", std:"OPEN",   val:"OPEN",    result:"정상",   errCode:null },
    { id:"a5", nm:"로그 에러 확인",   std:"0건",    val:"3건",     result:"비정상", errCode:"ERR-LOG-0023", errMsg:"Application exception: NullPointerException at line 342" },
    { id:"a6", nm:"보안패치 상태",    std:"최신",   val:"최신",    result:"정상",   errCode:null },
  ];
  const ERR_DETAIL = {
    "ERR-LOG-0023": { code:"ERR-LOG-0023", level:"ERROR",   msg:"Application exception: NullPointerException at line 342",            cause:"로그 수집 중 애플리케이션 예외 발생",          action:"해당 서비스 재시작 및 스택 트레이스 확인 필요" },
    "ERR-CPU-0011": { code:"ERR-CPU-0011", level:"WARNING", msg:"CPU usage exceeded threshold: 91.2% (threshold: 80%)",                cause:"배치 작업 집중으로 인한 CPU 부하 급증",         action:"배치 스케줄 분산 또는 리소스 증설 검토" },
    "ERR-MEM-0007": { code:"ERR-MEM-0007", level:"ERROR",   msg:"Memory usage critical: 93.4% — GC overhead limit exceeded",          cause:"메모리 누수 또는 힙 설정 부족",                action:"JVM 힙 증설(-Xmx) 또는 메모리 누수 분석 필요" },
    "ERR-DISK-0031": { code:"ERR-DISK-0031", level:"WARNING", msg:"Disk usage exceeded threshold: 92.1% on /data partition",           cause:"/data 파티션 로그 파일 과다 누적",             action:"오래된 로그 파일 정리 및 logrotate 정책 점검" },
    "ERR-PORT-0004": { code:"ERR-PORT-0004", level:"CRITICAL", msg:"Service port 8080 unreachable — connection refused",               cause:"WAS 프로세스 비정상 종료",                     action:"서비스 프로세스 재시작 및 원인 로그 확인" },
    "ERR-PATCH-0019": { code:"ERR-PATCH-0019", level:"WARNING", msg:"3 security patches pending: CVE-2025-1234, CVE-2025-5678, ...",   cause:"보안 패치 미적용 상태",                       action:"보안 패치 적용 일정 수립 및 긴급 패치 검토" },
  };

  const initEye = () => {
    const hasSaved = item?.eyeRes && item.eyeRes !== "-";
    return Object.fromEntries(
      EYE_ITEMS.map(e => [e.id, isComp ? (e.id==="e3" ? "비정상" : "정상") : hasSaved ? "정상" : ""])
    );
  };

  const [eyeRes,     setEyeRes]     = useState({});
  const [note,       setNote]       = useState("");
  const [photos,     setPhotos]     = useState([]);  // 하위 호환용 (미사용)
  const [eyeItemPhotos, setEyeItemPhotos] = useState({}); // { [itemId]: [{id, label, color}] }
  const [rptType,    setRptType]    = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const [autoConfirm,setAutoConfirm]= useState(false);
  const [autoLoading,setAutoLoading]= useState(false);
  const [autoHistory, setAutoHistory] = useState([]);
  const [selAutoId,   setSelAutoId]   = useState(null);
  const [eyeSnapshot, setEyeSnapshot] = useState(null);
  const [submitConfirm, setSubmitConfirm] = useState(false);
  const [skipCheck,     setSkipCheck]     = useState(false);

  /* ── 더미 자동점검 이력 생성 ── */
  const buildDummyHistory = (item) => {
    if (!item) return [];
    // autoRes가 "-"이면 자동점검 수행 기록 없음
    if (!item.autoRes || item.autoRes === "-") return [];
    // execDt가 실제 날짜인 항목만 더미 생성
    const hasExec = item.execDt && item.execDt !== "-";
    if (!hasExec) return [];

    const baseDate = item.execDt; // "2026-02-XX HH:MM"
    const [datePart, timePart] = baseDate.split(" ");
    const [hh, mm] = (timePart || "09:00").split(":");
    const baseH = parseInt(hh, 10);
    const baseM = parseInt(mm, 10);
    const fmt = (h, m, s=0) => {
      const pad = n => String(n).padStart(2,"0");
      return `${datePart} ${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    // 항목별 시드 기반 랜덤 (같은 item.id면 항상 같은 결과)
    const seed = item.id;
    const pseudo = (n) => ((seed * 9301 + n * 49297 + 233) % 1000) / 1000;

    const ERR_BY_ITEM = {
      "CPU":  ["ERR-CPU-0011"],
      "메모리":["ERR-MEM-0007"],
      "디스크":["ERR-DISK-0031"],
      "포트":  ["ERR-PORT-0004"],
      "로그":  ["ERR-LOG-0023"],
      "패치":  ["ERR-PATCH-0019"],
    };
    const makeItems = (runIdx) => AUTO_ITEMS.map((a, ai) => {
      const r = pseudo(runIdx * 13 + ai * 7);
      const isAbn = r < 0.18;
      let val = a.val;
      if (a.nm.includes("CPU"))         val = isAbn ? `${82 + Math.floor(r*100)%15}%`    : `${40 + Math.floor(pseudo(runIdx+ai)*100)%38}%`;
      else if (a.nm.includes("메모리")) val = isAbn ? `${87 + Math.floor(r*100)%10}%`    : `${45 + Math.floor(pseudo(runIdx+ai+1)*100)%38}%`;
      else if (a.nm.includes("디스크")) val = isAbn ? `${91 + Math.floor(r*100)%8}%`     : `${30 + Math.floor(pseudo(runIdx+ai+2)*100)%58}%`;
      else if (a.nm.includes("포트"))   val = isAbn ? "CLOSED"                            : "OPEN";
      else if (a.nm.includes("로그"))   val = isAbn ? `${2 + Math.floor(r*100)%8}건`     : "0건";
      else if (a.nm.includes("패치"))   val = isAbn ? "미적용"                            : "최신";
      const errKey = Object.keys(ERR_BY_ITEM).find(k => a.nm.includes(k));
      const errCode = isAbn && errKey ? ERR_BY_ITEM[errKey][0] : null;
      return { ...a, val, result: isAbn ? "비정상" : "정상", errCode };
    });

    // 완료: 보고된 최종 결과 1개 (selAutoId로 자동 선택됨)
    if (item.st === "완료") {
      const items = makeItems(0);
      const norm = items.filter(r => r.result === "정상").length;
      const abn  = items.filter(r => r.result === "비정상").length;
      return [{ id: seed * 1000 + 1, dt: fmt(baseH, baseM, 0), items, norm, abn }];
    }

    // 진행/지연: 여러 회차 (item.id 기반으로 2~4회)
    const runCount = 2 + (seed % 3); // 2, 3, 4회
    return Array.from({ length: runCount }, (_, ri) => {
      const items = makeItems(ri);
      const norm  = items.filter(r => r.result === "정상").length;
      const abn   = items.filter(r => r.result === "비정상").length;
      const mOff  = (runCount - 1 - ri) * 8;
      const totalM = baseM - mOff;
      const h = baseH + Math.floor(totalM < 0 ? (totalM - 59) / 60 : Math.floor(totalM / 60));
      const m = ((totalM % 60) + 60) % 60;
      return { id: seed * 1000 + ri + 1, dt: fmt(Math.max(0, h), m, ri * 3), items, norm, abn };
    }).reverse(); // 최신순
  };

  useEffect(() => {
    if (open) {
      // freeMode 리셋
      if (!item) {
        setStep(1); setSelRes(null); setResSearch(""); setResSys(""); setResCat("");
        setCreatedItem(null);
      }
      setEyeRes(initEye());
      setNote(item?.note || "");
      setPhotos([]);
      setEyeItemPhotos(item?.eyeItemPhotos || {});
      setRptType(isComp ? (item?.rptType || "일일") : "");
      setSubmitted(false);
      setAutoConfirm(false);
      setAutoLoading(false);
      setEyeSnapshot(!!(item?.eyeRes && item.eyeRes !== "-") ? { eyeRes: Object.fromEntries(EYE_ITEMS.map(e=>[e.id, isComp?(e.id==="e3"?"비정상":"정상"):"정상"])), note: item?.note||"", eyeItemPhotos: item?.eyeItemPhotos||{} } : null);
      const dummyHistory = buildDummyHistory(item);
      setAutoHistory(dummyHistory);
      setSelAutoId(dummyHistory.length > 0 ? dummyHistory[0].id : null);
    }
  }, [open, item]);

  if (!item && !freeMode) return null;

  const eyeDone  = EYE_ITEMS.every(e => eyeRes[e.id]);
  const eyeSaved = eyeSnapshot !== null
    && JSON.stringify(eyeSnapshot.eyeRes) === JSON.stringify(eyeRes)
    && eyeSnapshot.note === note
    && JSON.stringify(eyeSnapshot.eyeItemPhotos) === JSON.stringify(eyeItemPhotos);
  const canSubmit= eyeDone && !!rptType && autoHistory.length > 0 && !isComp;

  const doSubmit = () => {
    if (freeMode) { handleFreeSubmit(); }
    else { updateDI(item.id, { rptType, st:"완료", submitDt: new Date().toISOString().slice(0,16).replace("T"," ") }); onClose(); }
    toast?.("보고서가 제출되었습니다.");
  };
  const handleSubmitClick = () => {
    if (!canSubmit) return;
    if (getCookie(COOKIE_SKIP_SUBMIT_CONFIRM) === "1") { doSubmit(); return; }
    setSkipCheck(false);
    setSubmitConfirm(true);
  };

  const generateAutoResult = () => {
    return AUTO_ITEMS.map(item => {
      const isAbn = Math.random() < 0.2;
      let val = item.val;
      if (isAbn) {
        if (item.nm.includes("CPU"))    val = `${Math.floor(82+Math.random()*15)}%`;
        else if (item.nm.includes("메모리")) val = `${Math.floor(87+Math.random()*10)}%`;
        else if (item.nm.includes("디스크")) val = `${Math.floor(91+Math.random()*8)}%`;
        else if (item.nm.includes("포트"))   val = "CLOSED";
        else if (item.nm.includes("로그"))   val = `${Math.floor(2+Math.random()*10)}건`;
        else if (item.nm.includes("패치"))   val = "미적용";
      } else {
        if (item.nm.includes("CPU"))    val = `${Math.floor(40+Math.random()*38)}%`;
        else if (item.nm.includes("메모리")) val = `${Math.floor(45+Math.random()*38)}%`;
        else if (item.nm.includes("디스크")) val = `${Math.floor(30+Math.random()*58)}%`;
        else if (item.nm.includes("포트"))   val = "OPEN";
        else if (item.nm.includes("로그"))   val = "0건";
        else if (item.nm.includes("패치"))   val = "최신";
      }
      return { ...item, val, result: isAbn ? "비정상" : "정상" };
    });
  };

  const handleAutoRun = () => {
    setAutoConfirm(false);
    setAutoLoading(true);
    setTimeout(() => {
      const items = generateAutoResult();
      const norm  = items.filter(r => r.result === "정상").length;
      const abn   = items.filter(r => r.result === "비정상").length;
      const d = new Date();
      const pad = n => String(n).padStart(2,"0");
      const dt = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      const newEntry = { id: Date.now(), dt, items, norm, abn };
      setAutoHistory(prev => {
        const next = [newEntry, ...prev];
        setSelAutoId(newEntry.id);
        return next;
      });
      setAutoLoading(false);
      const autoPatch = { autoRes: abn > 0 ? "비정상" : "정상", normalCnt: norm, abnCnt: abn };
      if (freeMode && createdItem) {
        if (!createdItem._registered) {
          addDI({ ...createdItem, ...autoPatch, _registered: true });
          setCreatedItem(p => ({ ...p, ...autoPatch, _registered: true }));
        } else {
          updateDI(createdItem.id, autoPatch);
          setCreatedItem(p => ({ ...p, ...autoPatch }));
        }
      } else if (!freeMode && item) {
        updateDI(item.id, autoPatch);
      }
    }, 2800);
  };

  /* ── freeMode handlers ── */
  const pad2 = n => String(n).padStart(2,"0");
  const nowFmt = () => { const d=new Date(); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };

  const handleFreeCreate = () => {
    const fmt = nowFmt();
    const cl = CL_INIT.find(c => c.sub === selRes?.mid);
    const newItem = {
      id: Date.now(), sysNm: selRes?.sysNm||"-", resNm: selRes?.nm,
      mid: selRes?.mid, clNm: cl?.nm||"-", kind:"상태점검", sub:"", freq:"-",
      due: fmt.split(" ")[0], st:"중단", insp: currentUser?.userNm||"-",
      execDt: fmt, submitDt:"-", rptType:"", normalCnt:0, abnCnt:0,
      note:"", autoRes:"-", eyeRes:"-", summary:"-", hasFile:false, recheck:"N", memo:"", _free:true,
    };
    setCreatedItem(newItem);
    setStep(2);
  };

  const handleFreeSubmit = () => {
    if (!canSubmit || !createdItem) return;
    const patch = { rptType, st:"완료", submitDt: nowFmt() };
    if (!createdItem._registered) {
      addDI({ ...createdItem, ...patch, _registered: true });
    } else {
      updateDI(createdItem.id, patch);
    }
    setStep(3);
  };

  /* ── myRes for freeMode ── */
  const myUid  = currentUser?.userId || "";
  const myRes  = RES.filter(r => r.st !== "미사용" && (r.inspectors||[]).includes(myUid));
  const sysRes = resSys ? myRes.filter(r => r.sysId === resSys) : myRes;
  const cats   = Array.from(new Set(sysRes.map(r => r.mid))).sort();
  const visRes = sysRes.filter(r => {
    if (resCat && r.mid !== resCat) return false;
    if (resSearch && !r.nm.toLowerCase().includes(resSearch.toLowerCase()) && !(r.ip||"").includes(resSearch)) return false;
    return true;
  });

  /* ── active item (freeMode: createdItem, else: item) ── */
  const activeItem = freeMode ? createdItem : item;

  const handlePhotoAdd = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotos(p => [...p, { id: Date.now(), label: file.name, color:"#F0F5FF" }]);
    e.target.value = "";
  };

  /* ── step 계산 ── */
  // freeMode: 1=자원선택 2=점검진행 3=보고완료 | item모드: 1=점검진행 2=보고완료
  const STEPS = [["1","자원 선택"],["2","점검 진행"],["3","보고 완료"]];
  // freeMode: step state 그대로 | item모드: 완료=3, 진행=2(자원선택은 done)
  const curStep = freeMode ? step : (isComp ? 3 : 2);
  const [showPreview, setShowPreview] = useState(false);

  // 패널 열릴 때 미리보기 초기화
  React.useEffect(() => { if (!open) setShowPreview(false); }, [open]);

  return (
    <SidePanel open={open} onClose={onClose}
      title={freeMode ? "점검 수행" : isComp ? "점검 결과 조회" : "점검 보고 작성"} width={showPreview ? 1160 : 600} noScroll>
      <div style={{ display: "flex", height: "100%" }}>

      {/* ── 왼쪽: 보고서 미리보기 (isComp일 때만) ── */}
      {showPreview && (() => {
        const inspItems = item ? [
          { id:1, nm:"CPU 사용률",       method:"자동", std:"< 80%",    val:"72%",      result:"정상",   errCode:null },
          { id:2, nm:"메모리 사용률",    method:"자동", std:"< 85%",    val:"68%",      result:"정상",   errCode:null },
          { id:3, nm:"디스크 사용률",    method:"자동", std:"< 90%",    val:"54%",      result:"정상",   errCode:null },
          { id:4, nm:"서비스 포트 확인", method:"자동", std:"OPEN",     val:"OPEN",     result:"정상",   errCode:null },
          { id:5, nm:"로그 에러 확인",   method:"자동", std:"0건",      val:"3건",      result:"비정상", errCode:"ERR-LOG-0023" },
          { id:6, nm:"보안패치 상태",    method:"자동", std:"최신",     val:"최신",     result:"정상",   errCode:null },
          { id:7, nm:"서버 외관 상태",   method:"육안", std:"이상없음", val:"이상없음", result:"정상",   errCode:null },
          { id:8, nm:"케이블 연결 상태", method:"육안", std:"정상연결", val:"정상연결", result:"정상",   errCode:null },
          { id:9, nm:"LED 표시등 확인",  method:"육안", std:"Green",    val:"Yellow",   result:"비정상", errCode:null },
        ] : [];
        const normalCnt = inspItems.filter(r=>r.result==="정상").length;
        const abnCnt    = inspItems.filter(r=>r.result==="비정상").length;
        const groups    = inspItems.reduce((acc,r)=>{ const g=r.method==="육안"?"육안점검":"자동점검"; if(!acc[g])acc[g]=[]; acc[g].push(r); return acc; },{});
        const tbl  = { width:"100%", borderCollapse:"collapse" };
        const th   = (ex={}) => ({ padding:"6px 10px", border:"1px solid #333", background:"#1a3a5c", color:"#fff", fontSize:12, fontWeight:700, textAlign:"center", ...ex });
        const thLt = (ex={}) => ({ padding:"6px 10px", border:"1px solid #333", background:"#c8d8e8", color:"#1a3a5c", fontSize:12, fontWeight:700, ...ex });
        const td   = (ex={}) => ({ padding:"6px 10px", border:"1px solid #aaa", fontSize:12, verticalAlign:"middle", ...ex });
        const secH = (ex={}) => ({ padding:"5px 10px", border:"1px solid #333", background:"#2d5a8e", color:"#fff", fontSize:12, fontWeight:700, textAlign:"center", letterSpacing:2, ...ex });
        return (
          <div style={{ flex:1, minWidth:0, borderRight:`1px solid ${C.brd}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"14px 20px 12px", borderBottom:`1px solid ${C.brd}`,
              display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, background:"#FAFBFC" }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.txH }}>보고서 미리보기</span>
              <span style={{ fontSize:12, color:C.txL, background:"#F0F5FF", padding:"2px 8px", borderRadius:10, border:`1px solid ${C.priL}` }}>점검 결과 기준</span>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
              <div style={{ border:`1px solid ${C.brd}`, borderRadius:6, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)", fontFamily:PRETENDARD_FONT, background:"#fff", padding:"20px 24px", color:"#111" }}>
                <div style={{ textAlign:"center", marginBottom:16 }}>
                  <div style={{ fontSize:18, fontWeight:900, letterSpacing:10, color:"#1a3a5c", borderBottom:"3px solid #1a3a5c", paddingBottom:8, marginBottom:4 }}>일 상 점 검 보 고 서</div>
                  <div style={{ fontSize:12, color:"#444", marginTop:6 }}>{item?.clNm} &nbsp;|&nbsp; {item?.execDt?.slice(0,10)}</div>
                </div>
                <div style={secH({ marginBottom:0 })}>SITE INFORMATION</div>
                <table style={{ ...tbl, marginBottom:10 }}><tbody>
                  <tr><td style={thLt({ width:"18%" })}>정보시스템</td><td style={td({ width:"32%" })}>{item?.sysNm}</td><td style={thLt({ width:"18%" })}>대상자원</td><td style={td({ width:"32%" })}>{item?.resNm}</td></tr>
                  <tr><td style={thLt()}>점검자</td><td style={td()}>{item?.insp}</td><td style={thLt()}>점검일시</td><td style={td()}>{item?.execDt}</td></tr>
                  <tr><td style={thLt()}>점검표</td><td style={td()}>{item?.clNm}</td><td style={thLt()}>보고일시</td><td style={td()}>{item?.submitDt !== "-" ? item?.submitDt : "—"}</td></tr>
                </tbody></table>
                <div style={secH({ marginBottom:0 })}>SYSTEM DETAIL CHECK</div>
                {Object.entries(groups).map(([grp,rows]) => (
                  <div key={grp}><table style={{ ...tbl }}><thead>
                    <tr>{["점검 항목","방식","기준값","결과값","점검결과"].map((h,i)=><th key={i} style={th({ width:i===0?"28%":i===1?"10%":"16%" })}>{h}</th>)}</tr>
                    <tr><td colSpan={5} style={{ padding:"4px 10px", border:"1px solid #aaa", background:"#e8f0f8", color:"#1a3a5c", fontWeight:700 }}>[{grp}]</td></tr>
                  </thead><tbody>
                    {rows.map(r => { const isAbn=r.result==="비정상"; const isEye=r.method==="육안"; return (
                      <tr key={r.id} style={{ background:isAbn?"#FFF0F0":"#fff" }}>
                        <td style={td({ fontWeight:600 })}>{r.nm}</td>
                        <td style={td({ textAlign:"center" })}><span style={{ padding:"1px 6px", borderRadius:4, fontWeight:600, background:isEye?"#FEF3C7":"#E0F2FE", color:isEye?"#92400E":"#0369A1" }}>{r.method}</span></td>
                        <td style={td({ textAlign:"center" })}>{r.std}</td>
                        <td style={td({ textAlign:"center", color:isAbn?"#DC2626":"#111", fontWeight:isAbn?700:400 })}>{r.val}</td>
                        <td style={td({ textAlign:"center" })}>
                          {r.method==="자동"
                            ? <span style={{ fontSize:12, fontWeight:700, color:isAbn?"#DC2626":"#16a34a" }}>{r.result}</span>
                            : isAbn ? <span style={{ color:"#DC2626", fontWeight:700, fontSize:12 }}>□ 정상 &nbsp;☑ 비정상</span>
                                    : <span style={{ color:"#16a34a", fontWeight:700, fontSize:12 }}>☑ 정상 &nbsp;□ 비정상</span>}
                        </td>
                      </tr>
                    );})}
                  </tbody></table></div>
                ))}
                <div style={{ marginTop:10, border:"1px solid #aaa" }}>
                  <div style={{ padding:"5px 10px", background:"#e8f0f8", borderBottom:"1px solid #aaa", fontSize:12, fontWeight:700, color:"#1a3a5c" }}>[점검결과 요약]</div>
                  <table style={{ ...tbl }}><tbody><tr>
                    <td style={thLt({ width:"18%", textAlign:"center" })}>전체</td><td style={td({ textAlign:"center", fontWeight:700 })}>{inspItems.length}건</td>
                    <td style={thLt({ width:"18%", textAlign:"center" })}>정상</td><td style={td({ textAlign:"center", fontWeight:700, color:"#16a34a" })}>{normalCnt}건</td>
                    <td style={thLt({ width:"18%", textAlign:"center" })}>비정상</td><td style={td({ textAlign:"center", fontWeight:700, color:abnCnt>0?"#DC2626":"#111" })}>{abnCnt}건</td>
                  </tr></tbody></table>
                </div>
                <div style={{ marginTop:10, border:"1px solid #aaa" }}>
                  <div style={{ padding:"5px 10px", background:"#e8f0f8", borderBottom:"1px solid #aaa", fontSize:12, fontWeight:700, color:"#1a3a5c" }}>[특이사항]</div>
                  <div style={{ padding:"32px 10px 10px", fontSize:12, color:item?.note?"#c2410c":"#aaa", fontStyle:item?.note?"normal":"italic" }}>{item?.note || "특이사항 없음"}</div>
                </div>
                <div style={{ marginTop:16, border:"2px solid #1a3a5c", borderRadius:4 }}>
                  <div style={{ padding:"6px 0", background:"#1a3a5c", color:"#fff", textAlign:"center", fontSize:12, fontWeight:700, letterSpacing:4 }}>상기와 같이 점검 하였음을 확인 합니다</div>
                  <table style={{ ...tbl }}><tbody>
                    <tr><td style={td({ width:"15%", background:"#f5f5f5", fontWeight:700 })}>점검자</td><td style={td({ width:"35%" })}>{item?.insp}</td><td style={td({ width:"15%", background:"#f5f5f5", fontWeight:700 })}>확인자</td><td style={td({ width:"35%" })}><span style={{ color:"#aaa" }}>(서명)</span></td></tr>
                    <tr><td style={td({ background:"#f5f5f5", fontWeight:700 })}>소속/성명</td><td style={td()}>&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;</td><td style={td({ background:"#f5f5f5", fontWeight:700 })}>부서/성명</td><td style={td()}>&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color:"#aaa" }}>(인)</span></td></tr>
                  </tbody></table>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 오른쪽: 상세 내용 ── */}
      <div style={{ flex: showPreview ? "0 0 600px" : "1", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      {/* ── 스텝바 ── */}
      {(() => {
        return (
          <div style={{ display:"flex", alignItems:"center", marginBottom:22 }}>
            {STEPS.map(([n,l], i) => {
              const done   = curStep > i+1;
              const active = curStep === i+1;
              const isLast = i === STEPS.length-1;
              const filled = curStep > i;
              const comp   = active && isLast;
              const col    = active||done ? (comp ? "#19973C" : C.pri) : C.txL;
              return (
                <React.Fragment key={n}>
                  {i > 0 && <div style={{ flex:1, height:2, minWidth:8,
                    background: filled ? (comp?"#19973C":C.pri) : C.brd, transition:"background .3s" }} />}
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center",
                      justifyContent:"center", fontSize:12, fontWeight:700, transition:"all .3s",
                      background: comp?"#19973C" : active?C.pri : done?C.pri : "#F3F4F6",
                      color: active||done?"#fff":C.txL,
                      boxShadow: active ? `0 0 0 3px ${comp?"#19973C":C.pri}33` : "none" }}>
                      {done ? "✓" : n}
                    </div>
                    <span style={{ fontSize:12, fontWeight:600, color:col, whiteSpace:"nowrap" }}>{l}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        );
      })()}

      {/* ══════════ STEP 1: 자원 선택 (freeMode) ══════════ */}
      {freeMode && step === 1 && (() => {
        const myUidLocal = currentUser?.userId || "";
        return (
          <>
            <SecTitle label="대상 자원 선택" />
            <div style={{ fontSize:12, color:C.txL, marginBottom:10 }}>
              점검할 자원을 1개 선택하세요.{" "}
              <span style={{ color:C.pri, fontWeight:600 }}>{myRes.length}개</span>의 자원이 등록되어 있습니다.
            </div>
            <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
              <FSelect value={resSys} onChange={e=>{setResSys(e.target.value);setResCat("");}}
                style={{ padding:"5px 10px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", minWidth:120, outline:"none" }}>
                <option value="">전체 시스템</option>
                {SYS.filter(s=>myRes.some(r=>r.sysId===s.id)).map(s=><option key={s.id} value={s.id}>{s.nm}</option>)}
              </FSelect>
              <FSelect value={resCat} onChange={e=>setResCat(e.target.value)}
                style={{ padding:"5px 10px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", minWidth:90, outline:"none" }}>
                <option value="">전체 분류</option>
                {cats.map(c=><option key={c} value={c}>{c}</option>)}
              </FSelect>
              <div style={{ position:"relative", flex:1, minWidth:140 }}>
                <FInput value={resSearch} onChange={e=>setResSearch(e.target.value)} placeholder="자원명 또는 IP 검색"
                  style={{ width:"100%", padding:"5px 10px 5px 28px", fontSize:12,
                    border:`1px solid ${C.brd}`, borderRadius:4, outline:"none", boxSizing:"border-box" }} />
                <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                  <Ic n="search" s={12} c={C.txL} />
                </span>
                {resSearch && <span onClick={()=>setResSearch("")} style={{ position:"absolute", right:7, top:"50%",
                  transform:"translateY(-50%)", cursor:"pointer", fontSize:15, color:C.txL }}>×</span>}
              </div>
            </div>
            {selRes && (
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", marginBottom:10,
                borderRadius:8, border:`1.5px solid ${C.pri}`, background:C.priL+"44" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.pri }}>{selRes.nm}</div>
                  <div style={{ fontSize:12, color:C.txL }}>{selRes.mid} · {selRes.ip||"—"}</div>
                </div>
                <span onClick={()=>setSelRes(null)} style={{ cursor:"pointer", color:C.txL, fontSize:18 }}>×</span>
              </div>
            )}
            <div style={{ border:`1px solid ${C.brd}`, borderRadius:8, overflow:"hidden", maxHeight:320, overflowY:"auto" }}>
              {visRes.length === 0
                ? <div style={{ padding:24, textAlign:"center", fontSize:12, color:C.txL }}>조건에 맞는 자원이 없습니다.</div>
                : [...visRes].sort((a,b)=>{
                    const aCl=CL_INIT.find(c=>c.sub===a.mid)?1:0;
                    const bCl=CL_INIT.find(c=>c.sub===b.mid)?1:0;
                    return bCl-aCl;
                  }).map(r => {
                  const isSel=selRes?.id===r.id, cl=CL_INIT.find(c=>c.sub===r.mid), disabled=!cl;
                  return (
                    <div key={r.id} onClick={()=>{ if(!disabled) setSelRes(r); }}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
                        borderBottom:`1px solid ${C.brd}`, cursor:disabled?"not-allowed":"pointer",
                        opacity:disabled?0.45:1, background:isSel?C.priL+"44":"#fff",
                        borderLeft:isSel?`3px solid ${C.pri}`:"3px solid transparent", transition:"background .12s" }}
                      onMouseEnter={e=>{ if(!disabled&&!isSel) e.currentTarget.style.background="#F5F7FF"; }}
                      onMouseLeave={e=>{ if(!disabled&&!isSel) e.currentTarget.style.background="#fff"; }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, fontSize:12, color:disabled?C.txL:isSel?C.pri:C.txt,
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.nm}</div>
                        <div style={{ fontSize:12, color:C.txL, marginTop:2 }}>{r.mid} · {r.ip||"—"}</div>
                      </div>
                      <span style={{ fontSize:12, padding:"2px 8px", borderRadius:8, fontWeight:600, flexShrink:0,
                        background:cl?"#dcfce7":"#F3F4F6", color:cl?"#166534":C.txL }}>
                        {cl?cl.nm:"점검표 없음"}
                      </span>
                      {isSel && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  );
                })
              }
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8, paddingTop:16, marginTop:16, borderTop:`1px solid ${C.brd}` }}>
              <Btn onClick={onClose}>취소</Btn>
              <Btn primary onClick={()=>selRes&&handleFreeCreate()} style={{ opacity:selRes?1:0.4, cursor:selRes?"pointer":"not-allowed" }}>
                점검 시작 →
              </Btn>
            </div>
          </>
        );
      })()}

      {/* ── 점검 정보 카드 (step>=2 또는 item 모드) ── */}
      {(!freeMode || step >= 2) && (() => {
        const ai = freeMode ? (createdItem || {}) : item;
        const res = freeMode ? selRes : null;
        return (
          <div style={{ border:`1px solid ${C.brd}`, borderRadius:10, padding:"14px 16px",
            marginBottom:18, background:"#fff", position:"relative" }}>
            {/* 보고서 유형 배지 - 완료 시 우상단 */}
            {isComp && rptType && (() => {
              const RPT_COLOR = { "일일":"#0C8CE9","주간":"#19973C","월간":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333333","상시":"#0891B2" };
              const col = RPT_COLOR[rptType] || "#333";
              return (
                <span style={{ position:"absolute", top:12, right:14,
                  display:"inline-block", padding:"2px 10px", borderRadius:10, fontWeight:700, background:col+"1A", color:col,
                  border:`1px solid ${col}33` }}>{rptType}</span>
              );
            })()}
            <div style={{ fontSize:12, color:C.txL, marginBottom:4 }}>대상 자원</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.txH, marginBottom:4 }}>
              {freeMode ? selRes?.nm : ai.resNm}
            </div>
            <div style={{ fontSize:12, color:C.txL }}>
              {[freeMode ? selRes?.mid : ai.mid,
                freeMode ? selRes?.ip  : ai.ip,
                freeMode ? selRes?.sysNm : ai.sysNm
              ].filter(Boolean).join(" · ")}
            </div>
            {ai.clNm && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 20px", marginTop:12,
                paddingTop:10, borderTop:`1px solid ${C.brd}` }}>
                {[["점검표", ai.clNm], ["점검자", ai.insp], ["수행일시", ai.execDt],
                  ...(!freeMode ? [["제출일시", ai.submitDt && ai.submitDt !== "-" ? ai.submitDt : "-"]] : [])
                ].map(([l,v]) => (
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:12, color:C.txL }}>{l}</span>
                    <span style={{ fontSize:12, fontWeight:600, color:C.txt }}>{v||"—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── 자동점검 + 육안점검 영역 (step2 이상 또는 item 모드) ── */}
      {(!freeMode || step === 2) && <>
      <ConfirmModal open={autoConfirm} title="자동점검 수행" msg="자동점검을 수행합니다. 계속하시겠습니까?"
        okLabel="예" danger={false} onOk={handleAutoRun} onCancel={() => setAutoConfirm(false)} />

      {/* 로딩 오버레이 */}
      {autoLoading && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9999,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
          <div style={{ width:52, height:52, borderRadius:"50%",
            border:"5px solid rgba(255,255,255,.25)",
            borderTopColor:"#fff",
            animation:"spin 0.8s linear infinite" }} />
          <div style={{ color:"#fff", fontSize:15, fontWeight:600, letterSpacing:.5 }}>
            자동점검 수행 중...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <div style={{ marginBottom:18 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <SecTitle label="자동점검" style={{ marginBottom:0 }} />
          {!isComp && autoHistory.length === 0 && (
            <Btn sm outline onClick={()=>setAutoConfirm(true)} style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              자동점검 수행
            </Btn>
          )}
        </div>

        {(() => {
          const sel = autoHistory[0];
          if (!sel) return (
            <div style={{ padding:"28px 16px", borderRadius:8, border:`1.5px dashed ${C.brd}`,
              textAlign:"center", color:C.txL, background:"#FAFBFC" }}>
              <div style={{ fontSize:12, marginBottom:4 }}>자동점검 수행 버튼을 눌러 점검을 시작하세요.</div>
            </div>
          );
          const { items, norm, abn, dt } = sel;
          return (
            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ display:"flex", gap:5 }}>
                  {[[`정상 ${norm}건`,"#D1FAE5","#15803d"],
                    [`비정상 ${abn}건`, abn>0?"#FEE2E2":"#F3F4F6", abn>0?"#dc2626":C.txL],
                    [`전체 ${items.length}건`,C.priL,C.pri]
                  ].map(([l,bg,tc]) => (
                    <span key={l} style={{ fontSize:12, padding:"3px 9px", borderRadius:8, background:bg, color:tc, fontWeight:700 }}>{l}</span>
                  ))}
                </div>
                <span style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:1 }}>
                    <span style={{ fontSize:9, color:C.txL, fontWeight:500 }}>수행일시</span>
                    <span style={{ fontSize:11, color:C.txS, fontFamily:"inherit" }}>{dt}</span>
                  </span>
              </div>
              <div style={{ border:`1px solid ${C.brd}`, borderRadius:8, overflow:"hidden", marginBottom: isComp ? 0 : 8 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ background:"#F8FAFC" }}>
                      {["점검항목","기준","결과값","판정"].map((h,i) => (
                        <th key={i} style={{ padding:"7px 9px", fontWeight:600, color:C.txS,
                          textAlign:i===0?"left":"center", borderBottom:`1px solid ${C.brd}`, fontSize:12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r,i) => {
                      const isAbn = r.result==="비정상";
                      const errDet = isAbn && r.errCode ? ERR_DETAIL[r.errCode] : null;
                      const LEVEL_STYLE = { "CRITICAL":["#7F1D1D","#FEF2F2"], "ERROR":["#dc2626","#FFF8F8"], "WARNING":["#D97706","#FFFBEB"] };
                      const [lc, lbg] = LEVEL_STYLE[errDet?.level] || ["#dc2626","#FFF8F8"];
                      return (
                        <React.Fragment key={r.id}>
                          <tr style={{ borderBottom: isAbn && errDet ? "none" : `1px solid ${C.brd}`,
                            background:isAbn?"#FFF8F8":i%2===0?"#fff":"#FAFBFC" }}>
                            <td style={{ padding:"7px 9px", fontWeight:600, color:C.txH }}>{r.nm}</td>
                            <td style={{ padding:"7px 9px", textAlign:"center", color:C.txS, fontFamily:"inherit" }}>{r.std}</td>
                            <td style={{ padding:"7px 9px", textAlign:"center", fontFamily:"inherit",
                              fontWeight:700, fontSize:12, color:isAbn?"#dc2626":"#15803d" }}>{r.val}</td>
                            <td style={{ padding:"7px 9px", textAlign:"center" }}>
                              <span style={{ fontSize:12, fontWeight:700, padding:"2px 8px", borderRadius:8,
                                background:isAbn?"#FEE2E2":"#D1FAE5", color:isAbn?"#dc2626":"#15803d" }}>{r.result}</span>
                            </td>
                          </tr>
                          {isAbn && errDet && (
                            <tr style={{ borderBottom:`1px solid ${C.brd}` }}>
                              <td colSpan={4} style={{ padding:"0 9px 10px 9px", background:"#FFF8F8" }}>
                                <div style={{ borderRadius:6, border:`1px solid #FECACA`, background:lbg, padding:"10px 12px" }}>
                                  {/* 에러코드 + 레벨 */}
                                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                                    <span style={{ fontSize:12, fontWeight:700, padding:"2px 7px", borderRadius:4,
                                      background:lc+"22", color:lc, border:`1px solid ${lc}44`, letterSpacing:.5 }}>{errDet.level}</span>
                                    <span style={{ fontFamily:"inherit", fontWeight:700, color:lc, letterSpacing:.5 }}>{errDet.code}</span>
                                  </div>
                                  {/* 에러 메시지 */}
                                  <div style={{ fontFamily:"inherit", color:"#374151",
                                    background:"rgba(0,0,0,.04)", borderRadius:4, padding:"6px 8px", marginBottom:8,
                                    wordBreak:"break-all", lineHeight:1.5 }}>{errDet.msg}</div>
                                  {/* 원인 / 조치 */}
                                  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                                    <div style={{ display:"flex", gap:6 }}>
                                      <span style={{ fontWeight:700, color:C.txS, flexShrink:0, width:32 }}>원인</span>
                                      <span style={{ color:C.txS }}>{errDet.cause}</span>
                                    </div>
                                    <div style={{ display:"flex", gap:6 }}>
                                      <span style={{ fontWeight:700, color:lc, flexShrink:0, width:32 }}>조치</span>
                                      <span style={{ color:C.txH, fontWeight:500 }}>{errDet.action}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          );
        })()}
      </div>

      {/* ── 육안점검 결과 입력 ── */}
      {!(isComp && (!item.eyeRes || item.eyeRes === "-")) && (
      <><div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:0 }}>
        <SecTitle label="육안점검" style={{ marginBottom:0 }} />
        {!isComp && (
          <Btn sm success={eyeSaved} outline={!eyeSaved}
            onClick={() => {
              const eyeVal = Object.values(eyeRes).some(v => v === "비정상") ? "비정상" : Object.values(eyeRes).every(v => v === "정상") ? "정상" : "-";
              const totalPhotos = Object.values(eyeItemPhotos).flat().length;
              const eyePatch = { eyeRes: eyeVal, note, hasFile: totalPhotos > 0, eyeItemPhotos };
              setEyeSnapshot({ eyeRes: { ...eyeRes }, note, eyeItemPhotos: JSON.parse(JSON.stringify(eyeItemPhotos)) });
              if (freeMode && createdItem) {
                if (!createdItem._registered) {
                  addDI({ ...createdItem, ...eyePatch, _registered: true });
                  setCreatedItem(p => ({ ...p, ...eyePatch, _registered: true }));
                } else {
                  updateDI(createdItem.id, eyePatch);
                  setCreatedItem(p => ({ ...p, ...eyePatch }));
                }
              } else if (!freeMode && item) {
                updateDI(item.id, eyePatch);
              }
            }}
            style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
            {eyeSaved
              ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>저장됨</>
              : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                </svg>저장</>
            }
          </Btn>
        )}
      </div>
      <div style={{ marginBottom:18, marginTop:8 }}>
        {EYE_ITEMS.map(e => {
          const val = eyeRes[e.id] || "";
          const itemPhotos = eyeItemPhotos[e.id] || [];
          const isAbn = val === "비정상";
          return (
            <div key={e.id} style={{ borderRadius:8, marginBottom:8,
              border:`1px solid ${isAbn?"#fecaca":val==="정상"?"#bbf7d0":C.brd}`,
              background: isAbn?"#FFF8F8":val==="정상"?"#F0FDF4":"#fff",
              overflow:"hidden" }}>
              {/* 항목 행 */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px" }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:500, color:C.txt }}>{e.nm}</div>
                  <div style={{ fontSize:12, color:C.txL, marginTop:2 }}>기준: {e.std}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {/* 정상/비정상 버튼 */}
                  <div style={{ display:"flex", gap:6 }}>
                    {["정상","비정상"].map(r => {
                      const active = val === r;
                      const col = r==="정상" ? "#19973C" : "#dc2626";
                      return (
                        <button key={r} onClick={() => !isComp && setEyeRes(p=>({...p,[e.id]:r}))}
                          style={{ padding:"4px 14px", fontSize:12, fontWeight:600, borderRadius:4,
                            border:`1.5px solid ${active?col:C.brd}`,
                            background:active?col+"1A":"#fff", color:active?col:C.txS,
                            cursor:isComp?"default":"pointer", transition:"all .15s" }}>{r}</button>
                      );
                    })}
                  </div>
                  {/* 사진첨부 버튼 */}
                  {!isComp && (
                    <label style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 14px",
                      borderRadius:4, border:`1.5px solid ${itemPhotos.length>0?C.pri:C.brd}`,
                      background: itemPhotos.length>0?C.priL:"#fff",
                      color: itemPhotos.length>0?C.pri:C.txS, fontWeight:600, fontSize:12, cursor:"pointer", transition:"all .15s", flexShrink:0 }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.pri;e.currentTarget.style.color=C.pri;e.currentTarget.style.background=C.priL;}}
                      onMouseLeave={e=>{if(!itemPhotos.length){e.currentTarget.style.borderColor=C.brd;e.currentTarget.style.color=C.txS;e.currentTarget.style.background="#fff";}}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M9 5l1.5-2h3L15 5"/>
                      </svg>
                      {itemPhotos.length > 0 ? `${itemPhotos.length}장` : "사진"}
                      <FInput type="file" accept="image/*" multiple style={{ display:"none" }} onChange={ev => {
                        const files = Array.from(ev.target.files);
                        if (!files.length) return;
                        const newPhotos = files.map(f => ({ id: Date.now() + Math.random(), label: f.name, color:"#F0F5FF" }));
                        setEyeItemPhotos(p => ({ ...p, [e.id]: [...(p[e.id]||[]), ...newPhotos] }));
                        ev.target.value = "";
                      }} />
                    </label>
                  )}
                </div>
              </div>
              {/* 첨부사진 미리보기 */}
              {itemPhotos.length > 0 && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"0 14px 12px",
                  borderTop:`1px dashed ${isAbn?"#fecaca":"#bbf7d0"}` }}>
                  <div style={{ width:"100%", fontSize:12, color:C.txL, paddingTop:8, marginBottom:2 }}>첨부사진</div>
                  {itemPhotos.map(p => (
                    <div key={p.id} style={{ width:80, height:64, borderRadius:6,
                      border:`1px solid ${C.brd}`, background:p.color,
                      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                      gap:3, position:"relative", flexShrink:0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="1.5">
                        <rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M9 5l1.5-2h3L15 5"/>
                      </svg>
                      <span style={{ fontSize:12, color:C.txS, maxWidth:72, overflow:"hidden",
                        textOverflow:"ellipsis", whiteSpace:"nowrap", padding:"0 4px", textAlign:"center" }}>{p.label}</span>
                      {!isComp && (
                        <span onClick={()=>setEyeItemPhotos(prev=>({ ...prev, [e.id]: (prev[e.id]||[]).filter(x=>x.id!==p.id) }))}
                          style={{ position:"absolute", top:2, right:5, fontSize:12, color:C.txL, cursor:"pointer", lineHeight:1 }}>×</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </>)}

      {/* ── 특이사항 ── */}
      <SecTitle label="특이사항" />
      <FTextarea
        style={{ marginBottom:18, ...(isComp?{background:"#F9FAFC",pointerEvents:"none"}:{}) }}
        value={note} onChange={e=>setNote(e.target.value)}
        placeholder="특이사항을 입력하세요 (선택)" readOnly={isComp} maxLength={500} />

      {/* ── 닫기 영역 wrap ── */}
      </>}

      {/* ══════════ STEP 3: 점검 완료 (freeMode) ══════════ */}
      {freeMode && step === 3 && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 24px", textAlign:"center" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"#DCFCE7",
            display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20,
            boxShadow:"0 0 0 8px #DCFCE744" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div style={{ fontSize:20, fontWeight:800, color:"#16A34A", marginBottom:8 }}>점검 완료</div>
          <div style={{ fontSize:15, color:C.txS, lineHeight:1.8, marginBottom:28 }}>
            <span style={{ fontWeight:600, color:C.txt }}>{selRes?.nm}</span> 점검이 완료되었습니다.<br/>
            보고서가 성공적으로 제출되었습니다.
          </div>
          <div style={{ width:"100%", background:"#F9FAFC", border:`1px solid ${C.brd}`, borderRadius:10,
            padding:"16px 20px", textAlign:"left", marginBottom:28 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.txS, marginBottom:12 }}>점검 요약</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 20px" }}>
              {[["대상 자원", selRes?.nm], ["점검자", currentUser?.userNm],
                ["보고서 유형", rptType],
                ["육안점검", EYE_ITEMS.every(e=>eyeRes[e.id]==="정상")?"전체 정상":"일부 비정상"],
                ["특이사항", note||"없음"],
              ].map(([l,v])=>(
                <div key={l}>
                  <div style={{ fontSize:12, color:C.txL, marginBottom:2 }}>{l}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>{/* /바디 끝 */}

      {/* ══ FOOTER ══ */}
      {/* Step 1: 자원 선택 (freeMode) */}
      {freeMode && step === 1 && (
        <div style={{ flexShrink:0, borderTop:`1px solid ${C.brd}`, padding:"14px 24px", background:"#fff",
          display:"flex", alignItems:"center", gap:8 }}>
          <Btn onClick={onClose}>취소</Btn>
          <div style={{ flex:1 }} />
          <Btn primary onClick={() => selRes && handleFreeCreate()}
            style={{ opacity: selRes ? 1 : 0.4, cursor: selRes ? "pointer" : "not-allowed" }}>
            점검 시작 →
          </Btn>
        </div>
      )}
      {/* Step 2: 점검 진행 */}
      {(!freeMode || step === 2) && (
        <div style={{ flexShrink:0, borderTop:`1px solid ${C.brd}`, padding:"14px 24px", background:"#fff",
          display:"flex", flexDirection:"column", gap:10 }}>
          {/* 유효성 안내 (비완료 상태일 때만) */}
          {!isComp && (!autoHistory.length || !eyeDone || !rptType) && (
            <div style={{ fontSize:12, color:"#ea580c", display:"flex", alignItems:"center", gap:6,
              padding:"8px 12px", borderRadius:6, background:"#FFF7ED", border:"1px solid #FED7AA" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0 }}>
                <path d="M7 1.5A5.5 5.5 0 1 0 7 12.5 5.5 5.5 0 0 0 7 1.5zm.5 8H6.5V6.5h1V9.5zm0-4H6.5v-1h1v1z" fill="#ea580c"/>
              </svg>
              <span>
                {!autoHistory.length ? "자동점검을 수행하고 보고할 결과를 선택해야 합니다."
                  : !eyeDone ? "육안점검 항목을 모두 입력해야 제출 가능합니다."
                  : "보고서 유형을 선택해야 제출 가능합니다."}
              </span>
            </div>
          )}
          {/* 보고 유형 선택 (비완료 상태일 때만) */}
          {!isComp && (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:8,
              border:`1.5px solid ${!rptType ? "#fca5a5" : C.brd}`,
              background: !rptType ? "#fff8f8" : C.bg, transition:"all .2s" }}>
              <span style={{ fontSize:12, fontWeight:700, color: !rptType ? "#dc2626" : C.txS, flexShrink:0 }}>
                보고 유형<span style={{ color:"#dc2626", marginLeft:3 }}>*</span>
              </span>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, flex:1 }}>
                {RPT_TYPES.map(t => {
                  const active = rptType === t.value;
                  return (
                    <button key={t.value} onClick={() => setRptType(t.value)}
                      style={{ padding:"3px 12px", borderRadius:20, fontSize:12, fontWeight:700,
                        border:`1.5px solid ${active ? t.color : C.brd}`,
                        background: active ? t.color+"1A" : "#fff",
                        color: active ? t.color : C.txS,
                        cursor:"pointer", transition:"all .15s" }}>
                      {t.value}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {/* 버튼 행 */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Btn onClick={onClose}>{isComp ? "닫기" : "취소"}</Btn>
            <Btn onClick={() => setShowPreview(p => !p)}
              style={{ display:"flex", alignItems:"center", gap:6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              {showPreview ? "미리보기 닫기" : "보고서 미리보기"}
            </Btn>
            <div style={{ flex:1 }} />
            {!isComp && (
              <Btn primary onClick={handleSubmitClick}
                style={{ opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? "pointer" : "not-allowed" }}>
                {freeMode ? "점검 보고" : "보고 제출"}
              </Btn>
            )}
          </div>
        </div>
      )}
      {/* Step 3: 완료 확인 (freeMode) */}
      {freeMode && step === 3 && (
        <div style={{ flexShrink:0, borderTop:`1px solid ${C.brd}`, padding:"14px 24px", background:"#fff",
          display:"flex", justifyContent:"flex-end" }}>
          <Btn primary onClick={onClose} style={{ minWidth:120, justifyContent:"center" }}>확인</Btn>
        </div>
      )}

      {/* 보고 제출 확인 모달 */}
      {submitConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:10001,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:12, padding:28, width:380, boxShadow:"0 8px 32px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize:18, fontWeight:600, color:C.txH, marginBottom:8 }}>보고서 제출 확인</div>
            <div style={{ marginBottom:14, fontSize:15, color:C.txS }}>점검 보고서를 제출하시겠습니까?</div>
            <div style={{ background:"#F9FAFC", border:`1px solid ${C.brd}`, borderRadius:8, padding:"12px 16px", fontSize:13, lineHeight:1.9, marginBottom:12 }}>
              <div style={{ display:"flex", gap:8 }}><span style={{ color:C.txL, minWidth:64 }}>보고 유형</span><span style={{ fontWeight:700, color:C.txH }}>{rptType}</span></div>
              <div style={{ display:"flex", gap:8 }}><span style={{ color:C.txL, minWidth:64 }}>육안점검</span><span style={{ fontWeight:600, color:C.txH }}>{EYE_ITEMS.every(e => eyeRes[e.id] === "정상") ? "전체 정상" : "일부 비정상"}</span></div>
              <div style={{ display:"flex", gap:8 }}><span style={{ color:C.txL, minWidth:64 }}>특이사항</span><span style={{ color:C.txS }}>{note || "없음"}</span></div>
            </div>
            <div style={{ fontSize:12, color:"#ea580c", marginBottom:18 }}>제출 후에는 수정이 불가합니다.</div>
            <label style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20, cursor:"pointer", userSelect:"none" }}
              onClick={() => setSkipCheck(p => !p)}>
              <div style={{ width:16, height:16, borderRadius:3, border:`1.5px solid ${skipCheck ? C.sec : C.brdD}`,
                background: skipCheck ? C.sec : "#fff", display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0, transition:"all .15s" }}>
                {skipCheck && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <span style={{ fontSize:13, color:C.txS }}>다음부터 확인하지 않기</span>
            </label>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
              <Btn onClick={() => setSubmitConfirm(false)}>취소</Btn>
              <Btn primary onClick={() => {
                if (skipCheck) setCookie(COOKIE_SKIP_SUBMIT_CONFIRM, "1", 365);
                setSubmitConfirm(false);
                doSubmit();
              }}>제출</Btn>
            </div>
          </div>
        </div>
      )}
      </div>{/* 오른쪽 컬럼 */}
      </div>{/* flex row wrapper */}
    </SidePanel>
  );
};


/* ── 일괄점검 쿨다운 저장소 (전역 메모리) ── */
const _batchCooldown = new Map(); // key: resId, value: timestamp
const BATCH_COOLDOWN_MS = 2 * 60 * 1000; // 2분
const BATCH_MAX = 20;

/* ── 일괄점검 모달 ── */
const BatchInspModal = ({ open, onClose, currentUser, onSubmit }) => {
  const myUid = currentUser?.userId || "";
  const myRes = RES.filter(r => r.st !== "미사용" && (r.inspectors||[]).includes(myUid));
  const [sel,       setSel]       = useState([]);
  const [resSys,    setResSys]    = useState("");
  const [resCat,    setResCat]    = useState("");
  const [resSearch, setResSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]      = useState(false);
  const [resultCnt,  setResultCnt] = useState(0);
  const now = Date.now();

  useEffect(() => {
    if (open) { setSel([]); setResSys(""); setResCat(""); setResSearch(""); setSubmitting(false); setDone(false); setResultCnt(0); }
  }, [open]);

  const sysRes  = resSys ? myRes.filter(r => r.sysId === resSys) : myRes;
  const cats    = Array.from(new Set(sysRes.map(r => r.mid))).sort();
  const visRes  = sysRes.filter(r => {
    if (resCat && r.mid !== resCat) return false;
    if (resSearch && !r.nm.toLowerCase().includes(resSearch.toLowerCase()) && !(r.ip||"").includes(resSearch)) return false;
    return true;
  });

  const cooldownLeft = (id) => {
    const t = _batchCooldown.get(id);
    if (!t) return 0;
    return Math.max(0, BATCH_COOLDOWN_MS - (now - t));
  };
  const fmtLeft = (ms) => {
    const s = Math.ceil(ms / 1000);
    return s >= 60 ? `${Math.ceil(s/60)}분 후` : `${s}초 후`;
  };

  const toggle = (r) => {
    if (!CL_INIT.find(c=>c.sub===r.mid)) return;
    if (cooldownLeft(r.id) > 0) return;
    setSel(p => p.find(x=>x.id===r.id) ? p.filter(x=>x.id!==r.id) : p.length >= BATCH_MAX ? p : [...p, r]);
  };

  const handleSubmit = () => {
    if (sel.length === 0 || submitting) return;
    setSubmitting(true);
    // 쿨다운 등록
    sel.forEach(r => _batchCooldown.set(r.id, Date.now()));
    // 3~5초 시뮬레이션 후 결과 반환
    setTimeout(() => {
      onSubmit(sel);
      setResultCnt(sel.length);
      setSubmitting(false);
      setDone(true);
    }, 3500);
  };

  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9000,
      display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:14,
        width:620, maxHeight:"85vh", display:"flex", flexDirection:"column",
        boxShadow:"0 16px 48px rgba(0,0,0,.22)", overflow:"hidden" }}>

        {/* 헤더 */}
        <div style={{ padding:"18px 24px 14px", borderBottom:`1px solid ${C.brd}`,
          display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:C.txH }}>일괄 자동점검 요청</div>
            <div style={{ fontSize:12, color:C.txL, marginTop:2 }}>최대 {BATCH_MAX}개 · 자원별 2분 쿨다운</div>
          </div>
          <span onClick={onClose} style={{ cursor:"pointer", color:C.txL, fontSize:20, lineHeight:1 }}>×</span>
        </div>

        {done ? (
          /* 완료 화면 */
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 24px", textAlign:"center" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"#DCFCE7",
              display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16,
              boxShadow:"0 0 0 8px #DCFCE744" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontSize:18, fontWeight:800, color:"#16A34A", marginBottom:8 }}>요청 완료</div>
            <div style={{ fontSize:15, color:C.txS, lineHeight:1.8, marginBottom:28 }}>
              <span style={{ fontWeight:700, color:C.txt }}>{resultCnt}개</span> 자원에 대한<br/>자동점검 결과가 목록에 반영되었습니다.
            </div>
            <Btn primary onClick={onClose}>확인</Btn>
          </div>
        ) : submitting ? (
          /* 처리 중 화면 */
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 24px", textAlign:"center" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", border:`5px solid ${C.priL}`,
              borderTopColor:C.pri, animation:"spin 0.8s linear infinite", marginBottom:20 }} />
            <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
            <div style={{ fontSize:18, fontWeight:700, color:C.txH, marginBottom:6 }}>자동점검 요청 중</div>
            <div style={{ fontSize:12, color:C.txS }}>
              <span style={{ fontWeight:700, color:C.pri }}>{sel.length}개</span> 자원에 점검을 요청하고 있습니다...
            </div>
          </div>
        ) : (
          <>
            {/* 필터 + 선택 카운터 */}
            <div style={{ padding:"12px 20px 8px", borderBottom:`1px solid ${C.brd}`, flexShrink:0 }}>
              <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap", alignItems:"center" }}>
                <FSelect value={resSys} onChange={e=>{setResSys(e.target.value);setResCat("");}}
                  style={{ padding:"5px 10px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", outline:"none" }}>
                  <option value="">전체 시스템</option>
                  {SYS.filter(s=>myRes.some(r=>r.sysId===s.id)).map(s=><option key={s.id} value={s.id}>{s.nm}</option>)}
                </FSelect>
                <FSelect value={resCat} onChange={e=>setResCat(e.target.value)}
                  style={{ padding:"5px 10px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", outline:"none" }}>
                  <option value="">전체 분류</option>
                  {cats.map(c=><option key={c} value={c}>{c}</option>)}
                </FSelect>
                <div style={{ position:"relative", flex:1, minWidth:140 }}>
                  <FInput value={resSearch} onChange={e=>setResSearch(e.target.value)} placeholder="자원명 또는 IP 검색"
                    style={{ width:"100%", padding:"5px 10px 5px 28px", fontSize:12,
                      border:`1px solid ${C.brd}`, borderRadius:4, outline:"none", boxSizing:"border-box" }} />
                  <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                    <Ic n="search" s={12} c={C.txL} />
                  </span>
                  {resSearch && <span onClick={()=>setResSearch("")} style={{ position:"absolute", right:7, top:"50%",
                    transform:"translateY(-50%)", cursor:"pointer", fontSize:15, color:C.txL }}>×</span>}
                </div>
                {/* 선택 카운터 */}
                <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px",
                  borderRadius:20, background: sel.length >= BATCH_MAX ? "#FEF3C7" : C.priL,
                  border:`1px solid ${sel.length >= BATCH_MAX ? "#F59E0B" : C.pri+"44"}` }}>
                  <span style={{ fontSize:12, fontWeight:700,
                    color: sel.length >= BATCH_MAX ? "#92400E" : C.pri }}>
                    {sel.length} / {BATCH_MAX}
                  </span>
                  {sel.length > 0 && (
                    <span onClick={()=>setSel([])} style={{ fontSize:12, color:C.txL, cursor:"pointer" }}>초기화</span>
                  )}
                </div>
              </div>
              {sel.length >= BATCH_MAX && (
                <div style={{ fontSize:12, color:"#92400E", background:"#FEF3C7",
                  padding:"4px 10px", borderRadius:4, marginBottom:4 }}>
                  최대 {BATCH_MAX}개 선택됩니다. 일부 선택을 해제 후 추가 선택하세요.
                </div>
              )}
            </div>

            {/* 자원 목록 */}
            <div style={{ overflowY:"auto", flex:1 }}>
              {visRes.length === 0
                ? <div style={{ padding:32, textAlign:"center", fontSize:12, color:C.txL }}>조건에 맞는 자원이 없습니다.</div>
                : [...visRes].sort((a,b) => {
                    const aOk = !CL_INIT.find(c=>c.sub===a.mid) ? 1 : 0;
                    const bOk = !CL_INIT.find(c=>c.sub===b.mid) ? 1 : 0;
                    if (aOk !== bOk) return aOk - bOk; // 점검표 있는 것 먼저
                    const aCD = _batchCooldown.get(a.id) ? 1 : 0;
                    const bCD = _batchCooldown.get(b.id) ? 1 : 0;
                    return aCD - bCD; // 쿨다운 없는 것 먼저
                  }).map(r => {
                  const isSel = sel.find(x=>x.id===r.id);
                  const cdLeft = cooldownLeft(r.id);
                  const noCl = !CL_INIT.find(c=>c.sub===r.mid);
                  const disabled = noCl || cdLeft > 0 || (!isSel && sel.length >= BATCH_MAX);
                  return (
                    <div key={r.id} onClick={()=>toggle(r)}
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 20px",
                        borderBottom:`1px solid ${C.brd}`, cursor:disabled?"not-allowed":"pointer",
                        opacity: cdLeft > 0 ? 0.5 : 1,
                        background: isSel ? C.priL+"55" : "#fff",
                        borderLeft: isSel ? `3px solid ${C.pri}` : "3px solid transparent",
                        transition:"background .1s" }}
                      onMouseEnter={e=>{ if(!disabled&&!isSel) e.currentTarget.style.background="#F5F7FF"; }}
                      onMouseLeave={e=>{ if(!disabled&&!isSel) e.currentTarget.style.background="#fff"; }}>
                      {/* 체크박스 */}
                      <div style={{ width:18, height:18, borderRadius:4, flexShrink:0,
                        border:`2px solid ${isSel ? C.pri : C.brd}`,
                        background: isSel ? C.pri : "#fff",
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {isSel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, fontSize:12, color:disabled?C.txL:C.txt,
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.nm}</div>
                        <div style={{ fontSize:12, color:C.txL, marginTop:1 }}>{r.mid} · {r.ip||"—"} · {r.sysNm || SYS.find(s=>s.id===r.sysId)?.nm}</div>
                      </div>
                      {cdLeft > 0
                        ? <span style={{ fontSize:12, color:"#92400E", background:"#FEF3C7",
                            padding:"2px 8px", borderRadius:8, fontWeight:600, flexShrink:0 }}>
                            {fmtLeft(cdLeft)} 가능
                          </span>
                        : <span style={{ fontSize:12, padding:"2px 8px", borderRadius:8, fontWeight:600, flexShrink:0,
                            background: CL_INIT.find(c=>c.sub===r.mid) ? "#dcfce7" : "#F3F4F6",
                            color:      CL_INIT.find(c=>c.sub===r.mid) ? "#166534" : C.txL }}>
                            {CL_INIT.find(c=>c.sub===r.mid)?.nm || "점검표 없음"}
                          </span>
                      }
                    </div>
                  );
                })
              }
            </div>

            {/* 하단 버튼 */}
            <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.brd}`, display:"flex",
              justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
              <div style={{ fontSize:12, color:C.txL }}>
                {sel.length > 0
                  ? <><span style={{ fontWeight:700, color:C.pri }}>{sel.length}개</span> 자원 선택됨</>
                  : "점검할 자원을 선택하세요"}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <Btn onClick={onClose}>취소</Btn>
                <Btn primary disabled={sel.length === 0} onClick={handleSubmit} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  일괄 점검 요청
                </Btn>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StlDaily = ({ currentUser, toast }) => {
  const { di, addDI } = useDI();
  const [selItem,   setSelItem]   = useState(null);
  const [showFree,  setShowFree]  = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [fKind,     setFKind]     = useState(null);
  const [fSub,      setFSub]      = useState(null);
  const [kw,        setKw]        = useState("");
  const [fSys,      setFSys]      = useState("");
  const _today = () => { const d = new Date(); return d.toISOString().slice(0,10); };
  const _daysAgo = n => { const d = new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); };
  const [dtFrom,    setDtFrom]    = useState(_daysAgo(30));
  const [dtTo,      setDtTo]      = useState(_today());

  const filtered = di.filter(x => {
    if (fSys  && x.sysNm !== (SYS.find(s=>s.id===fSys)||{}).nm) return false;
    if (fKind && x.kind !== fKind) return false;
    if (fSub  && x.mid  !== fSub)  return false;
    const q = kw.trim().toLowerCase();
    if (q && !x.resNm.toLowerCase().includes(q) && !x.insp.toLowerCase().includes(q)) return false;
    if (dtFrom && x.execDt.slice(0,10) < dtFrom) return false;
    if (dtTo   && x.execDt.slice(0,10) > dtTo)   return false;
    return true;
  });
  const title = fSub ? `${fKind} > ${fSub}` : fKind || "전체현황";
  const search = () => {}; // 상태 기반 자동 필터링

  return <div>
    <PH title="일상점검" bc="홈 > 일상점검" />
    <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:14 }}>
      <Card title="점검종류" style={{ position:"sticky", top:20, maxHeight:"calc(100vh - 170px)",
        overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <InspFilter menus={_dailyMenu} sel={fKind} sub={fSub}
          onSelect={(k,s)=>{ setFKind(k); setFSub(s); }} data={di} />
      </Card>
      <div style={{ minWidth:0 }}>

        {/* 검색폼 */}
        <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: "16px 12px", display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-end" }}>

            {/* 정보시스템 */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:"fit-content" }}>
              <span style={{ ...LABEL_STYLE_SM }}>정보시스템</span>
              <FSelect value={fSys} onChange={e=>setFSys(e.target.value)}
                style={{ padding:"6px 12px", border:`1px solid ${C.brd}`, borderRadius:4,
                  fontSize:15, outline:"none", color:C.txt, background:"#fff",
                  fontFamily:"inherit", minWidth:120 }}>
                <option value="">전체</option>
                {SYS.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
              </FSelect>
            </div>

            {/* 점검일시 레인지 */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:"fit-content" }}>
              <span style={{ ...LABEL_STYLE_SM }}>점검일시</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <DatePicker value={dtFrom} onChange={v => { setDtFrom(v); if (dtTo && v > dtTo) setDtTo(v); }} style={{ width: 130 }} />
                <span style={{ fontSize:12, color:C.txL }}>~</span>
                <DatePicker value={dtTo} onChange={v => { setDtTo(v); if (dtFrom && v < dtFrom) setDtFrom(v); }} style={{ width: 130 }} />
              </div>
            </div>

            {/* 자원명/점검자 */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:"fit-content" }}>
              <span style={{ ...LABEL_STYLE_SM }}>자원명/점검자</span>
              <FInput value={kw} onChange={e=>setKw(e.target.value)} placeholder="자원명 또는 점검자"
                style={{ padding:"6px 12px", border:`1px solid ${C.brd}`, borderRadius:4,
                  fontSize:15, outline:"none", color:C.txt, background:"#fff", minWidth:120, fontFamily:"inherit" }} />
            </div>
          </div>

          <div style={{ display:"flex", gap:6, marginLeft:"auto", flexShrink:0, alignSelf:"stretch" }}>
            <SearchBtn onClick={search} />
            <RefreshBtn onClick={()=>{ setKw(""); setDtFrom(_daysAgo(30)); setDtTo(_today()); setFSys(""); }} />
          </div>
        </div>

        <Tbl secTitle={title} secCount={filtered.length}
          onRow={row => setSelItem(row)}
          secButtons={<div style={{ display:"flex", gap:6 }}>
            <SecBtnO onClick={()=>setShowBatch(true)}>
              <span style={{ display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink:0 }}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                일괄점검수행 <span style={{ color:C.txL, fontWeight:400, fontSize:12 }}>(추후 개발)</span>
              </span>
            </SecBtnO>
            <SecBtnP onClick={()=>setShowFree(true)}>+ 점검수행</SecBtnP>
          </div>}
          cols={[
          { t:"보고서 유형", k:"rptType",  w:90,  r: v => {
            const RPT_COLOR = { "일일":"#0C8CE9","주간":"#19973C","월간":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333333","상시":"#0891B2" };
            const col = RPT_COLOR[v] || C.txS;
            return v
              ? <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:10, fontWeight:700, background:col+"1A", color:col }}>{v}</span>
              : <span style={{ color:C.txL, fontSize:12 }}>미제출</span>;
          }},
          { t:"정보시스템", k:"sysNm",    mw:120, align:"left" },
          { t:"대상자원",   k:"resNm",    mw:140, align:"left",
            r:v => <span style={{ fontWeight:600, color:C.pri }}>{v}</span> },
          { t:"실행주기",   k:"freq",     w:80 },
          { t:"점검표",     k:"clNm",     mw:140, align:"left" },
          { t:"점검자",     k:"insp",     w:80 },
          { t:"점검일시",   k:"execDt" },
          { t:"제출일시",   k:"submitDt", r: v => <span style={{ color: v==="-"?C.txL:C.txt }}>{v}</span> },
          { t:"자동점검",   k:"autoRes",  w:70,  align:"center",  r: v => {
            const done = v && v !== "-";
            return done
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#D1FAE5"/><polyline points="4.5,8.5 7,11 11.5,5.5" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#FEE2E2"/><line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/><line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/></svg>;
          }},
          { t:"육안점검",   k:"eyeRes",   w:70,  align:"center",  r: v => {
            const done = v && v !== "-";
            return done
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#D1FAE5"/><polyline points="4.5,8.5 7,11 11.5,5.5" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#FEE2E2"/><line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/><line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/></svg>;
          }},
          { t:"정상",       k:"normalCnt", w:60,  r: v => <span style={{ fontWeight:700, color:"#19973C" }}>{v}</span> },
          { t:"비정상",     k:"abnCnt",    w:60,  r: v => <span style={{ fontWeight:700, color: v>0?"#E24949":C.txL }}>{v}</span> },
          { t:"특이사항",   k:"note",     mw:160, align:"left",
            r: v => v
              ? <span style={{ color:"#F36D00", fontWeight:500 }}>{v}</span>
              : <span style={{ color:C.txL }}>-</span> },
        ]} data={filtered} onRow={row => setSelItem(row)} />
      </div>
    </div>
    <StlDailyPanel open={!!selItem} onClose={()=>setSelItem(null)} item={selItem} toast={toast} />
    <StlDailyPanel open={showFree} onClose={()=>setShowFree(false)} currentUser={currentUser} toast={toast} />
    <BatchInspModal open={showBatch} onClose={()=>setShowBatch(false)} currentUser={currentUser}
      onSubmit={(resList) => {
        const pad = n => String(n).padStart(2,"0");
        const nowFmt = () => { const d=new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
        const AUTO_ITEMS = [
          { id:"a1", nm:"CPU 사용률",       std:"< 80%"  },
          { id:"a2", nm:"메모리 사용률",    std:"< 85%"  },
          { id:"a3", nm:"디스크 사용률",    std:"< 90%"  },
          { id:"a4", nm:"서비스 포트 확인", std:"OPEN"   },
          { id:"a5", nm:"로그 에러 확인",   std:"0건"    },
          { id:"a6", nm:"보안패치 상태",    std:"최신"   },
        ];
        const fmt = nowFmt();
        resList.forEach((r, idx) => {
          const cl = CL_INIT.find(c => c.sub === r.mid);
          const seed = r.id + idx;
          const pseudo = n => ((seed * 9301 + n * 49297 + 233) % 1000) / 1000;
          const items = AUTO_ITEMS.map((a, ai) => {
            const isAbn = pseudo(ai * 7) < 0.15;
            let val = isAbn ? "비정상값" : "정상값";
            if (a.nm.includes("CPU"))    val = isAbn ? `${82+Math.floor(pseudo(ai)*15)}%`  : `${40+Math.floor(pseudo(ai+1)*38)}%`;
            if (a.nm.includes("메모리")) val = isAbn ? `${87+Math.floor(pseudo(ai)*10)}%`  : `${45+Math.floor(pseudo(ai+2)*38)}%`;
            if (a.nm.includes("디스크")) val = isAbn ? `${91+Math.floor(pseudo(ai)*8)}%`   : `${30+Math.floor(pseudo(ai+3)*58)}%`;
            if (a.nm.includes("포트"))   val = isAbn ? "CLOSED" : "OPEN";
            if (a.nm.includes("로그"))   val = isAbn ? `${2+Math.floor(pseudo(ai)*8)}건`   : "0건";
            if (a.nm.includes("패치"))   val = isAbn ? "미적용" : "최신";
            return { ...a, val, result: isAbn ? "비정상" : "정상" };
          });
          const norm = items.filter(x=>x.result==="정상").length;
          const abn  = items.filter(x=>x.result==="비정상").length;
          addDI({
            id: Date.now() + idx,
            sysNm: r.sysNm || SYS.find(s=>s.id===r.sysId)?.nm || "-",
            resNm: r.nm, mid: r.mid, clNm: cl?.nm||"-",
            kind:"상태점검", sub:"", freq:"-",
            due: fmt.split(" ")[0], st:"중단",
            insp: currentUser?.userNm||"-",
            execDt: fmt, submitDt:"-", rptType:"",
            normalCnt: norm, abnCnt: abn, note:"",
            autoRes: abn > 0 ? "비정상" : "정상",
            eyeRes:"-", summary:"-", hasFile:false, recheck:"N", memo:"",
            _free:true, _registered:true,
          });
        });
      }}
    />
  </div>;
};

const StlSpecial = ({ toast }) => {
  const [items,   setItems]   = useState(SI);
  const [selItem, setSelItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [fKind,   setFKind]   = useState(null);
  const [kw,      setKw]      = useState("");
  const [applied, setApplied] = useState({ kw: "", fKind: null });

  const doSearch = () => setApplied({ kw, fKind });
  const doReset  = () => { setKw(""); setApplied({ kw: "", fKind: null }); };

  const handleAdd = (newItem) => {
    const item = { ...newItem, id: Date.now(), reg: new Date().toISOString().slice(0,10), submitDt: null, reportFile: null };
    setItems(prev => [item, ...prev]);
    SI = [item, ...SI];
    setShowAdd(false);
  };

  const handleUpdate = (updated) => {
    setItems(prev => prev.map(x => x.id === updated.id ? { ...x, ...updated } : x));
    SI = SI.map(x => x.id === updated.id ? { ...x, ...updated } : x);
    setSelItem(null);
  };

  const filtered = items.filter(x => {
    if (applied.fKind && x.kind !== applied.fKind) return false;
    const q = applied.kw.trim().toLowerCase();
    if (q && !x.title.toLowerCase().includes(q) && !(x.insp||"").toLowerCase().includes(q) && !(x.id+"").includes(q)) return false;
    return true;
  });
  const title = fKind || "전체현황";

  const ST_COLOR = { "요청":"#929292","중단":"#F36D00","완료":"#19973C","지연":"#E24949" };

  return (
    <div>
      <PH title="특별점검" bc="홈 > 특별점검" />
      <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:14 }}>
        <Card title="점검종류" style={{ position:"sticky", top:20, maxHeight:"calc(100vh - 170px)", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <InspFilter menus={_specMenu} sel={applied.fKind} sub={null}
            onSelect={k => { setFKind(k); setApplied(p => ({ ...p, fKind: k })); }} data={SI} kindKey="kind" />
        </Card>
        <div style={{ minWidth:0 }}>
          <div style={{ width:"100%", border:`1px solid ${C.brd}`, background:C.bg, borderRadius:6,
            padding:"16px 12px", display:"flex", gap:8, marginBottom:16, alignItems:"stretch" }}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-end" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:"fit-content" }}>
                <span style={{ ...LABEL_STYLE_SM }}>제목/점검자</span>
                <FInput value={kw} onChange={e => setKw(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && doSearch()}
                  placeholder="제목, 점검자 검색"
                  style={{ padding:"6px 12px", border:`1px solid ${C.brd}`, borderRadius:4,
                    fontSize:15, outline:"none", color:C.txt, background:"#fff", minWidth:200, fontFamily:"inherit" }} />
              </div>
            </div>
            <div style={{ display:"flex", gap:6, marginLeft:"auto", flexShrink:0, alignSelf:"stretch" }}>
              <SearchBtn onClick={doSearch} />
              <RefreshBtn onClick={doReset} />
            </div>
          </div>
          <Tbl secTitle={title} secCount={filtered.length}
            onRow={row => setSelItem(row)}
            cols={[
              { t:"상태",         k:"st",       w:80,  r: v => <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:10, fontSize:12, fontWeight:700, background:(ST_COLOR[v]||C.txS)+"1A", color:ST_COLOR[v]||C.txS }}>{v}</span> },
              { t:"특별점검 제목", k:"title",    mw:220, align:"left", r: v => <span style={{ fontWeight:600, color:C.pri }}>{v}</span> },
              { t:"점검종류",     k:"kind",      w:120 },
              { t:"등록자",       k:"regUser",   w:80  },
              { t:"등록일",       k:"reg",       w:100 },
              { t:"점검계획서",   k:"planFile",  w:90,  r: v => v ? <span style={{ color:C.pri, cursor:"pointer" }}>📎</span> : <span style={{ color:C.txL }}>-</span> },
              { t:"점검기한",     k:"due",       w:100 },
              { t:"점검자",       k:"insp",      w:80  },
              { t:"보고자",       k:"insp",      w:80  },
              { t:"제출일시",     k:"submitDt",  w:110, r: v => <span style={{ color: (!v||v==="-")?C.txL:C.txt }}>{v||"-"}</span> },
              { t:"점검보고서",   k:"reportFile",w:90,  r: v => v ? <span style={{ color:C.pri, cursor:"pointer" }}>📎</span> : <span style={{ color:C.txL }}>-</span> },
            ]}
            data={filtered}
          />
        </div>
      </div>
      <StlSpecialPanel open={!!selItem}  onClose={() => setSelItem(null)} item={selItem} onSave={handleUpdate} toast={toast} />
      <StlSpecialPanel open={showAdd}    onClose={() => setShowAdd(false)} item={null}   onSave={handleAdd} toast={toast} />
    </div>
  );
};

const StlSpecialPanel = ({ open, onClose, item, onSave, toast }) => {
  const { editMode, confirmOpen, handleDiscard, handleSaveConfirm, handleSave, handleCancel, setConfirmOpen } = useEditPanel(open, onClose);
  const isComp = item?.st === "완료";

  const SPEC_KINDS = ["오프라인점검","이중화점검","성능점검","업무집중기간점검"];

  const lastDayOfMonth = () => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth() + 1, 0).toISOString().slice(0, 10);
  };

  const emptyForm = {
    title:"", kind:"오프라인점검", insp:"", due: lastDayOfMonth(),
    purpose:"", content:"",
    planFile: null,
    execDt:"", submitDt:"", resultContent:"",
    resources: [],
    registrant: "", regDt: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [inspSearch, setInspSearch] = useState("");
  const [submitConfirm, setSubmitConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const todayStr = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`; };

  useEffect(() => {
    if (open && item) {
      setForm({
        title:         item.title         || "",
        kind:          item.kind          || "오프라인점검",
        insp:          item.insp          || "",
        due:           item.due           || lastDayOfMonth(),
        purpose:       item.purpose       || "",
        content:       item.content       || "",
        planFile:      item.planFile      ? { name: "점검계획서.pdf", size: null } : null,
        execDt:        item.execDt        || "",
        submitDt:      item.submitDt      || "",
        resultContent: item.resultContent || "",
        reportFile:    item.resultFile    ? { name: "점검보고서.pdf", size: null } : null,
        resources:     Array.isArray(item.resources) ? item.resources.map(nm => RES.find(r=>r.nm===nm)?.id).filter(Boolean) : [],
        registrant:    item.regUser       || "",
        regDt:         item.reg           || "",
      });
    }
    if (open && !item) {
      setForm({ ...emptyForm, due: lastDayOfMonth(), registrant: USERS[0]?.userNm || "관리자", regDt: todayStr() });
      setInspSearch("");
    }
  }, [open, item]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const isNew = !item;
  const ro    = !!item && !editMode;
  const roS   = ro ? { background:"#F9FAFC", color:C.txt, pointerEvents:"none" } : {};
  const roSel = ro ? { background:"#F9FAFC", color:C.txt, pointerEvents:"none", appearance:"none", backgroundImage:"none", cursor:"default" } : {};

  const handlePlanFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert("파일 용량은 10MB를 초과할 수 없습니다."); e.target.value = ""; return; }
    set("planFile", file);
    e.target.value = "";
  };

  return (
    <>
    <UnsavedConfirm open={confirmOpen} onDiscard={handleDiscard} onSave={handleSaveConfirm} />
    <ConfirmModal
      open={submitConfirm}
      title="보고 제출"
      msg="특별점검 결과를 제출합니다. 제출 후에는 수정할 수 없습니다. 계속하시겠습니까?"
      okLabel="제출"
      danger={false}
      onCancel={() => setSubmitConfirm(false)}
      onOk={() => {
        const nowStr = (() => {
          const n = new Date();
          const pad = v => String(v).padStart(2,"0");
          return `${n.getFullYear()}-${pad(n.getMonth()+1)}-${pad(n.getDate())} ${pad(n.getHours())}:${pad(n.getMinutes())}`;
        })();
        if (onSave) onSave({ ...form, id: item?.id, regUser: form.registrant, reg: form.regDt, st: "완료", submitDt: nowStr });
        if (toast) toast("보고가 제출되었습니다.", "success");
        setSubmitConfirm(false);
        onClose();
      }}
    />
    <SidePanel open={open}
      onClose={()=>{ if (editMode) setConfirmOpen(true); else onClose(); }}
      title={isNew ? "특별점검 등록" : "특별점검 상세"} width={580} noScroll>

      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

      {/* ── 점검 정보 카드 (등록 모드 / 수정 모드) ── */}
      {(isNew || editMode) ? (
        <div style={{ border:`1px solid ${C.brd}`, borderRadius:10, padding:"16px 18px", marginBottom:18, background:"#fff" }}>
          <SecTitle label="점검계획" primary style={{ marginBottom:12 }} />

          <FormRow label="점검 제목" required>
            <FInput value={form.title} onChange={e=>set("title",e.target.value)}
              placeholder="특별점검 제목을 입력하세요" maxLength={100} />
          </FormRow>

          {/* 3단: 점검종류, 등록자, 등록일 */}
          <div style={{ display:"flex", gap:12 }}>
            <FormRow label="점검 종류" required style={{ flex:1 }}>
              <RoSelect style={{ ...fSelect }} value={form.kind} onChange={e=>set("kind",e.target.value)}>
                {SPEC_KINDS.map(k=><option key={k} value={k}>{k}</option>)}
              </RoSelect>
            </FormRow>
            <FormRow label="등록자" style={{ flex:1 }}>
              <FInput style={{ background:"#F9FAFC", pointerEvents:"none" }} value={form.registrant} readOnly />
            </FormRow>
            <FormRow label="등록일" style={{ flex:1 }}>
              <FInput style={{ background:"#F9FAFC", pointerEvents:"none" }} value={form.regDt} readOnly />
            </FormRow>
          </div>

          {/* 3단: 점검자, 점검기한, 공백 */}
          <div style={{ display:"flex", gap:12 }}>
            <FormRow label="점검자" required style={{ flex:1, position:"relative" }}>
              <div style={{ position:"relative" }}>
                <FInput
                  value={inspSearch || form.insp}
                  onChange={e => { setInspSearch(e.target.value); if (!e.target.value) set("insp",""); }}
                  onFocus={() => { if (form.insp) setInspSearch(form.insp); }}
                  placeholder="이름 또는 아이디 검색"
                  style={{ paddingRight: 28 }}
                />
                {(inspSearch || form.insp) && (
                  <span onClick={()=>{ set("insp",""); setInspSearch(""); }}
                    style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)",
                      cursor:"pointer", color:C.txL, fontSize:16, lineHeight:1 }}>×</span>
                )}
                {inspSearch && (() => {
                  const q = inspSearch.trim().toLowerCase();
                  const filteredU = USERS.filter(u => u.useYn==="Y" && (
                    u.userNm.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q)
                  ));
                  if (!filteredU.length) return (
                    <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:200,
                      background:"#fff", border:`1px solid ${C.brd}`, borderRadius:6,
                      boxShadow:"0 4px 16px rgba(0,0,0,.1)", fontSize:12, padding:"8px 12px", color:C.txL }}>
                      검색 결과가 없습니다.
                    </div>
                  );
                  return (
                    <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:200,
                      background:"#fff", border:`1px solid ${C.brd}`, borderRadius:6,
                      boxShadow:"0 4px 16px rgba(0,0,0,.1)", maxHeight:180, overflowY:"auto" }}>
                      {filteredU.map(u => (
                        <div key={u.userId}
                          onMouseDown={e=>{ e.preventDefault(); set("insp", u.userNm); setInspSearch(""); }}
                          style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
                            cursor:"pointer", borderBottom:`1px solid ${C.brd}` }}
                          onMouseEnter={e=>e.currentTarget.style.background=C.priL}
                          onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                          <span style={{ fontSize:13, fontWeight:500, flex:1, color:C.txt }}>{u.userNm}</span>
                          <span style={{ fontSize:11, color:C.txL }}>{u.userId}</span>
                          <span style={{ fontSize:11, color:C.txS, background:"#F0F0F0", padding:"1px 6px", borderRadius:8 }}>{u.userRole}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </FormRow>
            <FormRow label="점검기한" required style={{ flex:1 }}>
              <DatePicker value={form.due} onChange={v=>set("due",v)} />
            </FormRow>
            <div style={{ flex:1 }} />
          </div>

          <FormRow label="점검 목적">
            <FTextarea value={form.purpose} onChange={e=>set("purpose",e.target.value)}
              placeholder="점검의 목적을 입력하세요" maxLength={500} />
          </FormRow>
          <FormRow label="점검 내용">
            <FTextarea value={form.content} onChange={e=>set("content",e.target.value)}
              placeholder="점검 내용을 입력하세요" maxLength={500} />
          </FormRow>

          {/* 점검계획서 첨부 */}
          <FormRow label="점검계획서 첨부">
            {form.planFile ? (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
                border:`1px solid ${C.brd}`, borderRadius:6, background:"#F9FAFC" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <span style={{ flex:1, fontSize:12, color:C.txt, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {form.planFile.name}
                  {form.planFile.size && <span style={{ fontSize:12, color:C.txL, marginLeft:6 }}>({(form.planFile.size/1024/1024).toFixed(1)} MB)</span>}
                </span>
                <span onClick={()=>set("planFile",null)} style={{ cursor:"pointer", color:C.txL, fontSize:18, lineHeight:1, flexShrink:0 }} title="파일 제거">×</span>
              </div>
            ) : (
              <label style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
                border:`2px dashed ${C.brd}`, borderRadius:6, cursor:"pointer", transition:"all .15s", background:"#fff" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.pri;e.currentTarget.style.background=C.priL+"44";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.brd;e.currentTarget.style.background="#fff";}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <span style={{ fontSize:12, color:C.txL }}>파일을 선택하거나 드래그하세요</span>
                <span style={{ fontSize:12, color:C.txL, marginLeft:"auto" }}>최대 10MB</span>
                <FInput type="file" style={{ display:"none" }} onChange={handlePlanFile} />
              </label>
            )}
          </FormRow>
        </div>
      ) : (
        /* ── 조회 모드: 일상점검 패널 스타일 헤더 카드 ── */
        <div style={{ border:`1px solid ${C.brd}`, borderRadius:10, padding:"14px 16px",
          marginBottom:18, background:"#fff", position:"relative" }}>

          {/* 우상단: 점검종류 배지만 */}
          <span style={{ position:"absolute", top:12, right:14,
            fontSize:12, fontWeight:700, padding:"2px 10px", borderRadius:10,
            background:"rgba(234,145,91,0.12)", color:"#c97640",
            border:"1px solid rgba(234,145,91,0.25)" }}>{form.kind}</span>

          {/* 대상 점검명 */}
          <div style={{ fontSize:12, color:C.txL, marginBottom:4 }}>점검 계획</div>
          <div style={{ fontSize:18, fontWeight:700, color:C.txH, marginBottom:4, paddingRight:120 }}>
            {form.title || "—"}
          </div>
          <div style={{ fontSize:12, color:C.txL, marginBottom:12 }}>
            {[form.kind, form.registrant].filter(Boolean).join(" · ")}
          </div>

          {/* 메타 정보 — 2줄 */}
          <div style={{ paddingTop:10, borderTop:`1px solid ${C.brd}`, display:"flex", flexDirection:"column", gap:6 }}>
            {/* 1행: 등록자, 등록일 */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 20px" }}>
              {[["등록자", form.registrant || "—"], ["등록일", form.regDt || "—"]].map(([l,v]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:12, color:C.txL }}>{l}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:C.txt }}>{v}</span>
                </div>
              ))}
            </div>
            {/* 2행: 점검자, 점검기한, 제출일시 */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 20px" }}>
              {[
                ["점검자",   form.insp  || "—"],
                ["점검기한", form.due   || "—"],
                ["제출일시", form.submitDt || "—"],
              ].map(([l,v]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:12, color:C.txL }}>{l}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:C.txt }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 점검 목적 / 내용 (있을 때만) */}
          {(form.purpose || form.content) && (
            <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${C.brd}`, display:"flex", flexDirection:"column", gap:8 }}>
              {form.purpose && (
                <div>
                  <div style={{ fontSize:11, color:C.txL, marginBottom:3 }}>점검 목적</div>
                  <div style={{ fontSize:12, color:C.txt, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{form.purpose}</div>
                </div>
              )}
              {form.content && (
                <div>
                  <div style={{ fontSize:11, color:C.txL, marginBottom:3 }}>점검 내용</div>
                  <div style={{ fontSize:12, color:C.txt, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{form.content}</div>
                </div>
              )}
            </div>
          )}

          {/* 점검계획서 첨부 — 점검 내용 다음 */}
          <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${C.brd}` }}>
            <div style={{ fontSize:11, color:C.txL, marginBottom:6 }}>점검계획서 첨부파일</div>
            {form.planFile ? (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
                border:`1px solid ${C.brd}`, borderRadius:6, background:"#F9FAFC" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <span style={{ flex:1, fontSize:12, color:C.txt, fontWeight:500 }}>{form.planFile.name || "점검계획서.pdf"}</span>
                <span style={{ fontSize:12, color:C.pri, cursor:"pointer", fontWeight:600,
                  padding:"2px 8px", border:`1px solid ${C.pri}`, borderRadius:4 }}>다운로드</span>
              </div>
            ) : (
              <div style={{ fontSize:12, color:C.txL }}>첨부파일 없음</div>
            )}
          </div>
        </div>
      )}

      {/* ── 점검 결과 (상세) ── */}
      {!isNew && (() => {
        const nowStr = (() => {
          const n = new Date();
          const pad = v => String(v).padStart(2,"0");
          return `${n.getFullYear()}-${pad(n.getMonth()+1)}-${pad(n.getDate())} ${pad(n.getHours())}:${pad(n.getMinutes())}`;
        })();
        const resRo = isComp;
        return (
        <div style={{ marginTop:20, borderRadius:10,
          border: isComp ? "2px dashed #19973C" : `2px dashed ${C.sec}`,
          background:"#fff", padding:"16px 18px" }}>
          <div style={{ fontSize:12, fontWeight:700, marginBottom:14,
            display:"flex", alignItems:"center", gap:6,
            color: isComp ? "#19973C" : C.sec }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={isComp ? "#19973C" : C.sec} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isComp
                ? <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
                : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
              }
            </svg>
            {isComp ? "점검결과" : "점검결과 입력"}
          </div>

          {isComp && (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
              borderRadius:8, background:"#F0FDF4", border:"1px solid #bbf7d0", marginBottom:14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontSize:12, fontWeight:600, color:"#15803d" }}>결과 보고가 완료된 점검입니다.</span>
            </div>
          )}

          <div style={{ display:"flex", gap:12 }}>
            <FormRow label="보고자" style={{ flex:1 }}>
              <FInput style={{ background:"#F9FAFC", pointerEvents:"none" }} value={form.insp || "—"} readOnly />
            </FormRow>
            <FormRow label="수행일자" required={!isComp} style={{ flex:1 }}>
              <DatePicker value={form.execDt} onChange={v=>set("execDt",v)} readOnly={resRo} />
            </FormRow>
            <FormRow label="제출일시" style={{ flex:1 }}>
              <FInput
                value={isComp ? (form.submitDt || "—") : nowStr}
                readOnly
                style={{ background:"#F9FAFC", color:C.txL, pointerEvents:"none" }}
              />
            </FormRow>
          </div>

          <FormRow label="점검보고서">
            {form.reportFile ? (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
                border:`1px solid ${C.brd}`, borderRadius:6, background:"#F9FAFC" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <span style={{ flex:1, fontSize:12, color:C.txt, fontWeight:500,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {form.reportFile.name}
                  {form.reportFile.size && <span style={{ fontSize:12, color:C.txL, marginLeft:6 }}>
                    ({(form.reportFile.size/1024/1024).toFixed(1)} MB)
                  </span>}
                </span>
                {!resRo && (
                  <span onClick={()=>set("reportFile",null)}
                    style={{ cursor:"pointer", color:C.txL, fontSize:18, lineHeight:1, flexShrink:0 }}
                    title="파일 제거">×</span>
                )}
                {resRo && (
                  <span style={{ fontSize:12, color:C.pri, cursor:"pointer", fontWeight:600,
                    padding:"2px 8px", border:`1px solid ${C.pri}`, borderRadius:4 }}>다운로드</span>
                )}
              </div>
            ) : resRo ? (
              <div style={{ padding:"8px 12px", border:`1px solid ${C.brd}`, borderRadius:6,
                background:"#F9FAFC", fontSize:12, color:C.txL }}>첨부파일 없음</div>
            ) : (
              <label style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
                border:`2px dashed ${C.brd}`, borderRadius:6, cursor:"pointer",
                transition:"all .15s", background:"#fff" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.pri;e.currentTarget.style.background=C.priL+"44";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.brd;e.currentTarget.style.background="#fff";}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <span style={{ fontSize:12, color:C.txL }}>파일을 선택하거나 드래그하세요</span>
                <span style={{ fontSize:12, color:C.txL, marginLeft:"auto" }}>최대 10MB</span>
                <FInput type="file" style={{ display:"none" }} onChange={e=>{
                  const f=e.target.files?.[0]; if(!f) return;
                  if(f.size>10*1024*1024){alert("파일 용량은 10MB를 초과할 수 없습니다.");e.target.value="";return;}
                  set("reportFile",f); e.target.value="";
                }} />
              </label>
            )}
          </FormRow>

          <FormRow label="결과요약">
            <FTextarea
              style={{ background:"#fff", ...(resRo ? { color:C.txt, pointerEvents:"none", resize:"none" } : {}) }}
              value={form.resultContent} onChange={e=>set("resultContent",e.target.value)}
              placeholder={resRo ? "" : "점검 결과를 요약하여 입력하세요"}
              readOnly={resRo} maxLength={1000} />
          </FormRow>
        </div>
        );
      })()}

      </div>{/* /바디 */}

      {/* 푸터 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={onClose}>닫기</Btn>
          <div style={{ flex: 1 }} />
          {!isComp && (
            <Btn primary onClick={() => {
              const e = {};
              if (!form.execDt) e.execDt = "수행일자를 입력하세요.";
              if (!form.reportFile) e.reportFile = "점검보고서를 첨부하세요.";
              if (!form.resultContent.trim()) e.resultContent = "결과요약을 입력하세요.";
              if (Object.keys(e).length > 0) { setErrors(e); return; }
              setErrors({});
              setSubmitConfirm(true);
            }}>보고 제출</Btn>
          )}
        </div>
      </div>
    </SidePanel>
    </>
  );
};



/* ── MgrCategory (카테고리 관리 - 3Depth) ── */
const MgrCategory = () => {
  const initTree = [
    { id: "c1", nm: "서버", children: [
      { id: "c1-1", nm: "CPU", children: [{ id: "c1-1-1", nm: "사용률" }, { id: "c1-1-2", nm: "코어별" }, { id: "c1-1-3", nm: "대기 큐" }] },
      { id: "c1-2", nm: "메모리", children: [{ id: "c1-2-1", nm: "사용률" }, { id: "c1-2-2", nm: "SWAP" }, { id: "c1-2-3", nm: "캐시" }] },
      { id: "c1-3", nm: "디스크", children: [{ id: "c1-3-1", nm: "사용률" }, { id: "c1-3-2", nm: "I/O" }, { id: "c1-3-3", nm: "inode" }, { id: "c1-3-4", nm: "파일시스템" }] },
      { id: "c1-4", nm: "프로세스", children: [{ id: "c1-4-1", nm: "구동상태" }, { id: "c1-4-2", nm: "좀비" }, { id: "c1-4-3", nm: "한계" }] },
      { id: "c1-5", nm: "서비스", children: [{ id: "c1-5-1", nm: "포트" }, { id: "c1-5-2", nm: "SSH" }, { id: "c1-5-3", nm: "NTP" }, { id: "c1-5-4", nm: "DNS" }] },
      { id: "c1-6", nm: "OS", children: [{ id: "c1-6-1", nm: "커널" }, { id: "c1-6-2", nm: "Uptime" }, { id: "c1-6-3", nm: "시간" }] },
      { id: "c1-7", nm: "로그", children: [{ id: "c1-7-1", nm: "에러" }, { id: "c1-7-2", nm: "용량" }, { id: "c1-7-3", nm: "감사" }, { id: "c1-7-4", nm: "로테이션" }] },
    ]},
    { id: "c2", nm: "보안", children: [
      { id: "c2-1", nm: "패치", children: [{ id: "c2-1-1", nm: "상태" }, { id: "c2-1-2", nm: "긴급" }] },
      { id: "c2-2", nm: "접근통제", children: [{ id: "c2-2-1", nm: "방화벽" }, { id: "c2-2-2", nm: "포트" }, { id: "c2-2-3", nm: "원격접속" }, { id: "c2-2-4", nm: "암호화" }, { id: "c2-2-5", nm: "IPS/IDS" }] },
      { id: "c2-3", nm: "계정관리", children: [{ id: "c2-3-1", nm: "패스워드" }, { id: "c2-3-2", nm: "잠김정책" }, { id: "c2-3-3", nm: "세션" }, { id: "c2-3-4", nm: "불필요계정" }, { id: "c2-3-5", nm: "권한" }] },
      { id: "c2-4", nm: "인증서", children: [{ id: "c2-4-1", nm: "만료" }, { id: "c2-4-2", nm: "SSL" }] },
    ]},
    { id: "c3", nm: "네트워크", children: [
      { id: "c3-1", nm: "인터페이스", children: [{ id: "c3-1-1", nm: "상태" }, { id: "c3-1-2", nm: "트래픽" }, { id: "c3-1-3", nm: "대역폭" }] },
      { id: "c3-2", nm: "품질", children: [{ id: "c3-2-1", nm: "패킷손실" }, { id: "c3-2-2", nm: "지연시간" }] },
      { id: "c3-3", nm: "설정", children: [{ id: "c3-3-1", nm: "ARP" }, { id: "c3-3-2", nm: "라우팅" }, { id: "c3-3-3", nm: "VLAN" }] },
    ]},
    { id: "c4", nm: "WEB", children: [
      { id: "c4-1", nm: "응답", children: [{ id: "c4-1-1", nm: "응답코드" }, { id: "c4-1-2", nm: "응답시간" }, { id: "c4-1-3", nm: "정적리소스" }] },
      { id: "c4-2", nm: "프로세스", children: [{ id: "c4-2-1", nm: "상태" }, { id: "c4-2-2", nm: "커넥션" }, { id: "c4-2-3", nm: "쓰레드" }] },
      { id: "c4-3", nm: "로그", children: [{ id: "c4-3-1", nm: "에러" }, { id: "c4-3-2", nm: "접근" }] },
    ]},
    { id: "c5", nm: "WAS", children: [
      { id: "c5-1", nm: "리소스", children: [{ id: "c5-1-1", nm: "프로세스" }, { id: "c5-1-2", nm: "힙메모리" }, { id: "c5-1-3", nm: "쓰레드" }, { id: "c5-1-4", nm: "GC" }] },
      { id: "c5-2", nm: "커넥션", children: [{ id: "c5-2-1", nm: "JDBC" }, { id: "c5-2-2", nm: "세션" }] },
      { id: "c5-3", nm: "로그/배포", children: [{ id: "c5-3-1", nm: "에러" }, { id: "c5-3-2", nm: "배포" }] },
    ]},
    { id: "c6", nm: "DBMS", children: [
      { id: "c6-1", nm: "상태", children: [{ id: "c6-1-1", nm: "서비스" }, { id: "c6-1-2", nm: "커넥션" }, { id: "c6-1-3", nm: "복제" }] },
      { id: "c6-2", nm: "저장소", children: [{ id: "c6-2-1", nm: "테이블스페이스" }, { id: "c6-2-2", nm: "아카이브" }] },
      { id: "c6-3", nm: "성능", children: [{ id: "c6-3-1", nm: "슬로우쿼리" }, { id: "c6-3-2", nm: "데드락" }, { id: "c6-3-3", nm: "Lock" }, { id: "c6-3-4", nm: "인덱스" }] },
      { id: "c6-4", nm: "로그", children: [{ id: "c6-4-1", nm: "에러" }] },
    ]},
    { id: "c7", nm: "운영", children: [
      { id: "c7-1", nm: "백업", children: [{ id: "c7-1-1", nm: "상태" }, { id: "c7-1-2", nm: "전체" }, { id: "c7-1-3", nm: "증분" }, { id: "c7-1-4", nm: "용량" }, { id: "c7-1-5", nm: "복원" }] },
      { id: "c7-2", nm: "이중화", children: [{ id: "c7-2-1", nm: "상태" }, { id: "c7-2-2", nm: "절체" }, { id: "c7-2-3", nm: "클러스터" }, { id: "c7-2-4", nm: "Heartbeat" }] },
      { id: "c7-3", nm: "성능", children: [{ id: "c7-3-1", nm: "TPS" }, { id: "c7-3-2", nm: "응답시간" }, { id: "c7-3-3", nm: "동시접속" }, { id: "c7-3-4", nm: "부하테스트" }] },
    ]},
    { id: "c8", nm: "하드웨어", children: [
      { id: "c8-1", nm: "전원", children: [{ id: "c8-1-1", nm: "PSU" }, { id: "c8-1-2", nm: "UPS" }] },
      { id: "c8-2", nm: "냉각", children: [{ id: "c8-2-1", nm: "온도" }, { id: "c8-2-2", nm: "팬" }] },
      { id: "c8-3", nm: "스토리지", children: [{ id: "c8-3-1", nm: "RAID" }, { id: "c8-3-2", nm: "SMART" }] },
    ]},
  ];

  const [tree,      setTree]      = useState(initTree);
  const [sel1,      setSel1]      = useState(null);
  const [sel2,      setSel2]      = useState(null);
  const [sel3,      setSel3]      = useState(null);
  const [editId,    setEditId]    = useState(null);
  const [editNm,    setEditNm]    = useState("");
  const [addDepth,  setAddDepth]  = useState(null);
  const [addNm,     setAddNm]     = useState("");
  const [sortMode,  setSortMode]  = useState(false);
  const [sortSaved, setSortSaved] = useState(false);
  const [overItem,  setOverItem]  = useState(null); // { depth, id }
  const dragRef = React.useRef(null); // { depth, id }

  const depth2 = sel1 ? (tree.find(c => c.id === sel1)?.children || []) : [];
  const depth3 = sel2 ? (depth2.find(c => c.id === sel2)?.children || []) : [];

  const genId = (prefix) => prefix + "-" + Date.now();

  const startAdd = (depth) => { setAddDepth(depth); setAddNm(""); };
  const cancelAdd = () => { setAddDepth(null); setAddNm(""); };
  const commitAdd = () => {
    if (!addNm.trim()) { cancelAdd(); return; }
    const nm = addNm.trim();
    if (addDepth === 1) setTree(p => [...p, { id: genId("c"), nm, children: [] }]);
    if (addDepth === 2 && sel1) setTree(p => p.map(c => c.id === sel1 ? { ...c, children: [...c.children, { id: genId("c2"), nm, children: [] }] } : c));
    if (addDepth === 3 && sel1 && sel2) setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === sel2 ? { ...c2, children: [...c2.children, { id: genId("c3"), nm }] } : c2) } : c1));
    cancelAdd();
  };

  const delCat1 = (id) => { setTree(p => p.filter(c => c.id !== id)); if (sel1 === id) { setSel1(null); setSel2(null); setSel3(null); } };
  const delCat2 = (id) => { setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.filter(c2 => c2.id !== id) } : c1)); if (sel2 === id) { setSel2(null); setSel3(null); } };
  const delCat3 = (id) => { setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === sel2 ? { ...c2, children: c2.children.filter(c3 => c3.id !== id) } : c2) } : c1)); if (sel3 === id) setSel3(null); };

  const startEdit = (id, nm) => { setEditId(id); setEditNm(nm); };
  const saveEdit = (depth) => {
    if (!editNm.trim()) { setEditId(null); return; }
    if (depth === 1) setTree(p => p.map(c => c.id === editId ? { ...c, nm: editNm.trim() } : c));
    if (depth === 2) setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === editId ? { ...c2, nm: editNm.trim() } : c2) } : c1));
    if (depth === 3) setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === sel2 ? { ...c2, children: c2.children.map(c3 => c3.id === editId ? { ...c3, nm: editNm.trim() } : c3) } : c2) } : c1));
    setEditId(null);
  };

  /* ── 순서변경 저장 ── */
  const saveSort = () => { setSortMode(false); setSortSaved(true); setTimeout(() => setSortSaved(false), 2200); };
  const cancelSort = () => { setSortMode(false); setTree(initTree); };

  /* ── 드래그&드롭: useRef로 dragIdx 추적, setOverItem으로 over 하이라이트 ── */
  const onDragStart = (depth, id) => { dragRef.current = { depth, id }; };
  const onDragOver  = (e, depth, id) => {
    e.preventDefault();
    if (!dragRef.current || dragRef.current.depth !== depth) return;
    setOverItem({ depth, id });
  };
  const onDragEnd   = () => { setOverItem(null); dragRef.current = null; };
  const onDrop      = (e, depth, targetId) => {
    e.preventDefault();
    const drag = dragRef.current;
    if (!drag || drag.depth !== depth || drag.id === targetId) { onDragEnd(); return; }
    const reorder = (arr) => {
      const from = arr.findIndex(x => x.id === drag.id);
      const to   = arr.findIndex(x => x.id === targetId);
      if (from < 0 || to < 0) return arr;
      const next = [...arr];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    };
    if (depth === 1) setTree(p => reorder(p));
    if (depth === 2) setTree(p => p.map(c => c.id === sel1 ? { ...c, children: reorder(c.children) } : c));
    if (depth === 3) setTree(p => p.map(c1 => c1.id === sel1
      ? { ...c1, children: c1.children.map(c2 => c2.id === sel2 ? { ...c2, children: reorder(c2.children) } : c2) }
      : c1));
    onDragEnd();
  };

  const colHeader = (label, count, onAdd) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `2px solid ${C.brd}`, background: "#F9FAFC" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.txt }}>{label} <span style={{ fontWeight: 400, fontSize: 12, color: C.txL }}>({count})</span></div>
      {sortMode
        ? <span style={{ fontSize: 12, color: C.pri, background: "#EEF2FF", padding: "2px 8px", borderRadius: 8, border: `1px solid ${C.priL}` }}>드래그로 순서 변경</span>
        : <span onClick={onAdd} style={{ cursor: "pointer", fontSize: 18, color: C.pri, fontWeight: 700, lineHeight: 1 }} title={`${label} 추가`}>+</span>
      }
    </div>
  );

  const catRow = (item, isActive, onSelect, onDel, depth) => {
    const isOver = sortMode && overItem?.depth === depth && overItem?.id === item.id;
    const isDrag = sortMode && dragRef.current?.depth === depth && dragRef.current?.id === item.id;
    return (
      <div
        key={item.id}
        draggable={sortMode}
        onDragStart={sortMode ? () => onDragStart(depth, item.id) : undefined}
        onDragOver={sortMode  ? (e) => onDragOver(e, depth, item.id) : undefined}
        onDrop={sortMode      ? (e) => onDrop(e, depth, item.id) : undefined}
        onDragEnd={sortMode   ? onDragEnd : undefined}
        onClick={() => !sortMode && editId !== item.id && onSelect(item.id)}
        style={{
          display: "flex", alignItems: "center", padding: "9px 14px",
          cursor: sortMode ? "grab" : "pointer",
          background: isOver ? "#EEF2FF" : isActive ? C.priL : "",
          borderBottom: `1px solid ${C.brd}`,
          borderTop: isOver ? `2px solid ${C.pri}` : "2px solid transparent",
          opacity: isDrag ? 0.4 : 1,
          transition: "background .12s, opacity .12s",
          userSelect: "none",
        }}
        onMouseEnter={e => { if (!isActive && !sortMode) e.currentTarget.style.background = "#F9FAFC"; }}
        onMouseLeave={e => { if (!isActive && !sortMode) e.currentTarget.style.background = ""; }}
      >
        {sortMode && (
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginRight: 8, flexShrink: 0, opacity: 0.4 }}>
            <rect x="1" y="1.5" width="10" height="1.5" rx="0.75" fill={C.txS}/>
            <rect x="1" y="5"   width="10" height="1.5" rx="0.75" fill={C.txS}/>
            <rect x="1" y="8.5" width="10" height="1.5" rx="0.75" fill={C.txS}/>
          </svg>
        )}
        {editId === item.id ? (
          <FInput
            autoFocus
            value={editNm}
            onChange={e => setEditNm(e.target.value)}
            onBlur={() => saveEdit(depth)}
            onKeyDown={e => { if (e.key === "Enter") saveEdit(depth); if (e.key === "Escape") setEditId(null); }}
            onClick={e => e.stopPropagation()}
            style={{ flex: 1, padding: "2px 6px", border: `1px solid ${C.pri}`, borderRadius: 4, fontSize: 12, outline: "none" }}
          />
        ) : (
          <span style={{ flex: 1, fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? C.priD : C.txt }}>{item.nm}</span>
        )}
        {!sortMode && item.children && <span style={{ fontSize: 12, color: C.txL, marginRight: 6 }}>{item.children.length}</span>}
        {!sortMode && editId !== item.id && <>
          <span onClick={e => { e.stopPropagation(); startEdit(item.id, item.nm); }} style={{ cursor: "pointer", fontSize: 12, color: C.txL, marginRight: 6, padding: "0 2px" }} title="수정"><Ic n="edit" s={13} c={C.txL} /></span>
          <span onClick={e => { e.stopPropagation(); onDel(item.id); }} style={{ cursor: "pointer", fontSize: 15, color: C.red, fontWeight: 600 }} title="삭제">×</span>
        </>}
      </div>
    );
  };

  const addInputRow = (depth) => addDepth === depth && (
    <div style={{ display: "flex", alignItems: "center", padding: "6px 14px", borderBottom: `1px solid ${C.brd}`, background: "#f0fdf4" }}>
      <FInput
        autoFocus
        value={addNm}
        onChange={e => setAddNm(e.target.value)}
        onBlur={commitAdd}
        onKeyDown={e => { if (e.key === "Enter") commitAdd(); if (e.key === "Escape") cancelAdd(); }}
        placeholder="이름 입력 후 Enter"
        style={{ flex: 1, padding: "4px 8px", border: `1px solid ${C.pri}`, borderRadius: 4, fontSize: 12, outline: "none" }}
      />
      <span onClick={cancelAdd} style={{ cursor: "pointer", marginLeft: 8, fontSize: 12, color: C.txL }}>취소</span>
    </div>
  );

  return (
    <div>
      <PH title="카테고리 관리" bc="홈 > 환경설정 > 카테고리 관리" />
      {/* 그리드 툴바 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: 8, gap: 8 }}>
        {sortSaved && (
          <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            저장되었습니다
          </span>
        )}
        {sortMode ? (
          <>
            <Btn sm onClick={cancelSort}>취소</Btn>
            <Btn sm primary onClick={saveSort} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              저장
            </Btn>
          </>
        ) : (
          <Btn sm onClick={() => { setSortMode(true); setSortSaved(false); }} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            순서변경
          </Btn>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        border: `1px solid ${sortMode ? C.pri : C.brd}`, borderRadius: 8, overflow: "hidden", minHeight: 400,
        boxShadow: sortMode ? `0 0 0 3px ${C.priL}` : "none", transition: "box-shadow .2s, border-color .2s" }}>
        {/* 1Depth 대분류 */}
        <div style={{ borderRight: `1px solid ${C.brd}` }}>
          {colHeader("1 Depth 대분류", tree.length, () => startAdd(1))}
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {tree.map(c => catRow(c, sel1 === c.id, (id) => { setSel1(id); setSel2(null); setSel3(null); }, delCat1, 1))}
            {!sortMode && addInputRow(1)}
            {tree.length === 0 && addDepth !== 1 && <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>대분류가 없습니다.<br/>+ 버튼으로 추가하세요.</div>}
          </div>
        </div>
        {/* 2Depth 중분류 */}
        <div style={{ borderRight: `1px solid ${C.brd}` }}>
          {colHeader("2 Depth 중분류", depth2.length, () => sel1 && startAdd(2))}
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {sel1 ? depth2.map(c => catRow(c, sel2 === c.id, (id) => { setSel2(id); setSel3(null); }, delCat2, 2)) : <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>대분류를 선택하세요</div>}
            {!sortMode && sel1 && addInputRow(2)}
            {sel1 && depth2.length === 0 && addDepth !== 2 && <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>중분류가 없습니다.<br/>+ 버튼으로 추가하세요.</div>}
          </div>
        </div>
        {/* 3Depth 소분류 */}
        <div>
          {colHeader("3 Depth 소분류", depth3.length, () => sel2 && startAdd(3))}
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {sel2 ? depth3.map(c => catRow(c, sel3 === c.id, setSel3, delCat3, 3)) : <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>중분류를 선택하세요</div>}
            {!sortMode && sel2 && addInputRow(3)}
            {sel2 && depth3.length === 0 && addDepth !== 3 && <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>소분류가 없습니다.<br/>+ 버튼으로 추가하세요.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};



/* ── 공통코드 관리 ── */
const MgrCode = () => {
  const INIT_GROUPS = [
    { id:"GRP001", nm:"자원유형",     desc:"자원 대분류/중분류/소분류 구분 코드", cnt:6, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP002", nm:"점검상태",     desc:"점검 진행 상태 코드",               cnt:4, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP003", nm:"점검결과",     desc:"점검 결과 판정 코드",               cnt:2, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP004", nm:"사용자역할",   desc:"시스템 내 사용자 권한 유형",         cnt:4, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP005", nm:"점검유형",     desc:"일상/특별 점검 유형 코드",           cnt:2, useYn:"Y", regDt:"2026-01-11" },
    { id:"GRP006", nm:"특별점검종류", desc:"특별점검 세부 종류 코드",            cnt:4, useYn:"Y", regDt:"2026-01-11" },
    { id:"GRP007", nm:"정기점검주기", desc:"정기점검 반복 주기 코드",            cnt:3, useYn:"Y", regDt:"2026-01-12" },
    { id:"GRP008", nm:"알림유형",     desc:"발송 알림 종류 코드",               cnt:5, useYn:"Y", regDt:"2026-01-15" },
    { id:"GRP009", nm:"파일유형",     desc:"첨부 가능한 파일 형식 코드",         cnt:8, useYn:"N", regDt:"2026-01-20" },
    { id:"GRP010", nm:"시스템유형",   desc:"정보시스템 유형 분류 코드",          cnt:3, useYn:"Y", regDt:"2026-01-20" },
  ];
  const INIT_CODES = {
    GRP001: [
      { id:"C001001", grpId:"GRP001", cd:"HW",  nm:"하드웨어",  desc:"물리 서버·장비",      sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001002", grpId:"GRP001", cd:"SW",  nm:"소프트웨어",desc:"OS·미들웨어·앱",      sort:2, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001003", grpId:"GRP001", cd:"NW",  nm:"네트워크",  desc:"스위치·라우터·방화벽", sort:3, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001004", grpId:"GRP001", cd:"SEC", nm:"보안",      desc:"보안 장비 및 솔루션",  sort:4, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001005", grpId:"GRP001", cd:"DB",  nm:"DBMS",     desc:"데이터베이스 서버",     sort:5, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001006", grpId:"GRP001", cd:"WAS", nm:"WAS",      desc:"웹 애플리케이션 서버",  sort:6, useYn:"Y", regDt:"2026-01-10" },
    ],
    GRP002: [
      { id:"C002001", grpId:"GRP002", cd:"REQ",  nm:"요청", desc:"점검 요청 상태",  sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C002002", grpId:"GRP002", cd:"STP",  nm:"중단", desc:"점검 중단 상태",  sort:2, useYn:"Y", regDt:"2026-01-10" },
      { id:"C002003", grpId:"GRP002", cd:"DLY",  nm:"지연", desc:"기한 초과 지연",  sort:3, useYn:"Y", regDt:"2026-01-10" },
      { id:"C002004", grpId:"GRP002", cd:"DONE", nm:"완료", desc:"점검 완료 상태",  sort:4, useYn:"Y", regDt:"2026-01-10" },
    ],
    GRP003: [
      { id:"C003001", grpId:"GRP003", cd:"OK", nm:"정상",   desc:"정상 판정",   sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C003002", grpId:"GRP003", cd:"NG", nm:"비정상", desc:"비정상 판정", sort:2, useYn:"Y", regDt:"2026-01-10" },
    ],
    GRP004: [
      { id:"C004001", grpId:"GRP004", cd:"SYS", nm:"시스템 관리자", desc:"전체 권한",      sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C004002", grpId:"GRP004", cd:"ORG", nm:"기관 관리자",   desc:"기관 범위 권한", sort:2, useYn:"Y", regDt:"2026-01-10" },
      { id:"C004003", grpId:"GRP004", cd:"MNT", nm:"유지보수 총괄", desc:"점검 운영 권한", sort:3, useYn:"Y", regDt:"2026-01-10" },
      { id:"C004004", grpId:"GRP004", cd:"USR", nm:"사용자",        desc:"점검 수행 권한", sort:4, useYn:"Y", regDt:"2026-01-10" },
    ],
  };

  const EMPTY_GRP  = { id:"", nm:"", desc:"", useYn:"Y" };
  const EMPTY_CODE = { id:"", cd:"", nm:"", desc:"", sort:1, useYn:"Y" };

  const [groups,     setGroups]     = useState(INIT_GROUPS);
  const [codes,      setCodes]      = useState(INIT_CODES);
  const [selGrp,     setSelGrp]     = useState(INIT_GROUPS[0]);
  const [grpQ,       setGrpQ]       = useState("");
  const [codeQ,      setCodeQ]      = useState("");

  /* 그룹 패널 - isNew: 신규 추가 모드 */
  const [grpPanel,   setGrpPanel]   = useState(false);
  const [grpForm,    setGrpForm]    = useState(EMPTY_GRP);
  const [grpIsNew,   setGrpIsNew]   = useState(false);
  const [grpErrors,  setGrpErrors]  = useState({});
  const [grpDel,     setGrpDel]     = useState(null);

  /* 코드 패널 */
  const [codePanel,  setCodePanel]  = useState(false);
  const [codeForm,   setCodeForm]   = useState(EMPTY_CODE);
  const [codeIsNew,  setCodeIsNew]  = useState(false);
  const [codeErrors, setCodeErrors] = useState({});
  const [codeDel,    setCodeDel]    = useState(null);

  const [showUpload, setShowUpload] = useState(false);

  const sgf = (k,v) => setGrpForm(p=>({...p,[k]:v}));
  const scf = (k,v) => setCodeForm(p=>({...p,[k]:v}));

  const filteredGroups = groups.filter(g => !grpQ || g.nm.includes(grpQ) || g.id.includes(grpQ));
  const curCodes = (codes[selGrp?.id]||[])
    .filter(c => !codeQ || c.nm.includes(codeQ) || c.cd.includes(codeQ))
    .sort((a,b)=>a.sort-b.sort);

  /* 그룹 행 클릭 → 좌측은 selGrp 변경, 더블클릭 또는 아이콘 클릭 → 패널 오픈 */
  const openGrpPanel = (g, isNew=false) => {
    setGrpIsNew(isNew);
    setGrpForm(isNew ? EMPTY_GRP : {...g});
    setGrpErrors({});
    setGrpPanel(true);
  };

  /* 코드 행 클릭 → 패널 오픈 */
  const openCodePanel = (c, isNew=false) => {
    setCodeIsNew(isNew);
    setCodeForm(isNew ? {...EMPTY_CODE, sort:(codes[selGrp?.id]||[]).length+1} : {...c});
    setCodeErrors({});
    setCodePanel(true);
  };

  const saveGroup = () => {
    const e = {};
    if (!grpForm.id.trim()) e.id = "그룹 ID를 입력하세요.";
    if (!grpForm.nm.trim()) e.nm = "그룹명을 입력하세요.";
    setGrpErrors(e);
    if (Object.keys(e).length) return;
    if (grpIsNew) {
      if (groups.some(g=>g.id===grpForm.id)) { setGrpErrors({id:"이미 존재하는 그룹 ID입니다."}); return; }
      setGroups(p=>[...p, {...grpForm, cnt:0, regDt:"2026-02-24"}]);
    } else {
      setGroups(p=>p.map(g=>g.id===grpForm.id ? {...g,...grpForm} : g));
      if (selGrp?.id===grpForm.id) setSelGrp(prev=>({...prev,...grpForm}));
    }
    setGrpPanel(false);
  };

  const saveCode = () => {
    const e = {};
    if (!codeForm.cd.trim()) e.cd = "코드값을 입력하세요.";
    if (!codeForm.nm.trim()) e.nm = "코드명을 입력하세요.";
    setCodeErrors(e);
    if (Object.keys(e).length) return;
    if (codeIsNew) {
      const nc = {...codeForm, id:`${selGrp.id}_${Date.now()}`, grpId:selGrp.id, regDt:"2026-02-24"};
      setCodes(p=>({...p, [selGrp.id]:[...(p[selGrp.id]||[]), nc]}));
      setGroups(p=>p.map(g=>g.id===selGrp.id ? {...g, cnt:g.cnt+1} : g));
    } else {
      setCodes(p=>({...p, [selGrp.id]: p[selGrp.id].map(c=>c.id===codeForm.id ? {...c,...codeForm} : c)}));
    }
    setCodePanel(false);
  };

  const deleteGroup = (id) => {
    setGroups(p=>p.filter(g=>g.id!==id));
    if (selGrp?.id===id) setSelGrp(groups.find(g=>g.id!==id)||null);
    setGrpDel(null); setGrpPanel(false);
  };
  const deleteCode = (cid) => {
    setCodes(p=>({...p, [selGrp.id]:(p[selGrp.id]||[]).filter(c=>c.id!==cid)}));
    setGroups(p=>p.map(g=>g.id===selGrp.id ? {...g, cnt:Math.max(0,g.cnt-1)} : g));
    setCodeDel(null); setCodePanel(false);
  };

  const inp = {...fInput};
  const ro  = {background:"#f0f1f3", color:C.txS, pointerEvents:"none"};
  const err = (msg) => msg ? <div style={{fontSize:12,color:"#ef4444",marginTop:3}}>{msg}</div> : null;







  return (
    <div>
      <PH title="공통코드" bc="홈 > 환경설정 > 공통코드" />

      <div style={{ display: "flex", gap: 14, alignItems: "start" }}>

        {/* ── 좌: 코드 그룹 ── */}
        <div style={{ width: 240, flexShrink: 0, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 6, overflow: "hidden", position: "sticky", top: 0, maxHeight: "calc(100vh - 170px)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.brd}`,
            display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.txH }}>코드 그룹</span>
            <div onClick={() => openGrpPanel(null, true)}
              style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 4, cursor: "pointer", transition: "background .15s", border: "none", outline: "none" }}
              onMouseEnter={e => e.currentTarget.style.background = C.priL}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </div>
          </div>
          <div style={{ padding: "6px 0", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ padding: "6px 10px 4px", flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <FInput value={grpQ} onChange={e => setGrpQ(e.target.value)}
                  placeholder="그룹 검색"
                  style={{ width: "100%", padding: "6px 24px 6px 26px", fontSize: 12, border: `1px solid ${C.brd}`,
                    borderRadius: 6, outline: "none", boxSizing: "border-box", background: "#F8FAFC", color: C.txt, fontFamily: "inherit" }} />
                {grpQ && (
                  <span onClick={() => setGrpQ("")}
                    style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)",
                      cursor: "pointer", color: C.txL, fontSize: 14, lineHeight: 1 }}>×</span>
                )}
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", paddingTop: 4 }}>
              {filteredGroups.map(g => {
                const isSel = selGrp?.id === g.id;
                return (
                  <div key={g.id}
                    onClick={() => { setSelGrp(g); setCodeQ(""); setCodePanel(false); }}
                    onDoubleClick={() => openGrpPanel(g, false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
                      cursor: "pointer", borderRadius: 6, margin: "1px 6px",
                      background: isSel ? C.priL : "transparent", transition: "background .15s" }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = C.bgSec; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isSel ? C.priL : "transparent"; }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: isSel ? 600 : 400, color: isSel ? C.pri : C.txt,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.nm}</div>
                      <div style={{ fontSize: 11, color: C.txL, marginTop: 1 }}>{g.id}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      {g.useYn === "N" && <span style={{ fontSize: 10, padding: "1px 5px", borderRadius: 3, background: "#F9FAFC", color: C.txL }}>미사용</span>}
                      <span style={{ fontSize: 11, color: C.txL, background: C.bgSec, borderRadius: 10, padding: "1px 7px", minWidth: 18, textAlign: "center" }}>{g.cnt}</span>
                    </div>
                  </div>
                );
              })}
              {!filteredGroups.length && <div style={{ padding: 30, textAlign: "center", color: C.txL, fontSize: 12 }}>검색 결과 없음</div>}
            </div>
          </div>
        </div>

        {/* ── 우: 코드 목록 ── */}
        <div style={{flex:1, minWidth:0}}>
          {!selGrp ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:C.txL}}>
              <div style={{fontSize:36,marginBottom:10}}>☰</div>
              <div style={{fontSize:12}}>왼쪽에서 코드 그룹을 선택하세요.</div>
            </div>
          ) : (<>
            <SB ph="코드값 또는 코드명 검색" />
            <Tbl secTitle={`${selGrp.nm} 코드 목록`} secCount={curCodes.length} secButtons={<div style={{display:"flex",gap:4}}>
              <Btn small onClick={()=>setShowUpload(true)}>📤 엑셀 업로드</Btn>
              <Btn small>📥 엑셀 다운로드</Btn>
              <SecBtnP onClick={()=>openCodePanel(null, true)}>+ 코드 추가</SecBtnP>
            </div>} onRow={row => openCodePanel(row, false)} cols={[
              { t: "순서", k: "sort" },
              { t: "코드값", k: "cd", r: v => <span style={{fontFamily:"inherit",padding:"2px 8px",background:C.priL,borderRadius:4,color:C.pri,fontWeight:700}}>{v}</span> },
              { t: "항목", k: "nm", r: v => <span style={{fontWeight:600,color:C.pri}}>{v}</span> },
              { t: "설명", k: "desc", r: v => v || "—" },
              { t: "사용여부", k: "useYn", r: v => <YnBadge v={v} /> },
              { t: "등록일", k: "regDt" },
            ]} data={curCodes} />
          </>)}
        </div>
      </div>

      {/* ── 사이드 패널: 코드 그룹 ── */}
      <SidePanel open={grpPanel} onClose={()=>setGrpPanel(false)}
        title={grpIsNew ? "코드 그룹 추가" : "코드 그룹 수정"} width={480} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {!grpIsNew && <PanelDeleteBtn onClick={()=>setGrpDel(grpForm.id)} />}
        <SecTitle label="그룹 정보" primary />
        <FormRow label="그룹 ID" required>
          <FInput value={grpForm.id} onChange={e=>sgf("id",e.target.value.toUpperCase())}
            placeholder="예) GRP011" maxLength={20}
            style={{...inp,...(!grpIsNew?ro:{})}} readOnly={!grpIsNew} />
          {err(grpErrors.id)}
        </FormRow>
        <FormRow label="그룹명" required>
          <FInput value={grpForm.nm} onChange={e=>sgf("nm",e.target.value)}
            placeholder="예) 자원유형" style={inp} maxLength={50} />
          {err(grpErrors.nm)}
        </FormRow>
        <FormRow label="설명">
          <FTextarea value={grpForm.desc} onChange={e=>sgf("desc",e.target.value)}
            placeholder="코드 그룹에 대한 설명을 입력하세요" rows={3}
            style={{...inp, resize:"none", fontFamily:"inherit"}} maxLength={200} />
        </FormRow>
        <FormRow label="사용여부">
          <Radio value={grpForm.useYn} onChange={v=>sgf("useYn",v)} />
        </FormRow>
      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={()=>setGrpPanel(false)}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={saveGroup}>{grpIsNew ? "등록" : "저장"}</Btn>
        </div>
      </div>
      </SidePanel>

      {/* ── 사이드 패널: 코드 ── */}
      <SidePanel open={codePanel} onClose={()=>setCodePanel(false)}
        title={codeIsNew ? "코드 추가" : "코드 수정"} width={480} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {!codeIsNew && <PanelDeleteBtn onClick={()=>setCodeDel(codeForm.id)} />}
        <SecTitle label="코드 정보" primary />
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1}}>
            <FormRow label="코드값" required>
              <FInput value={codeForm.cd} onChange={e=>scf("cd",e.target.value.toUpperCase())}
                placeholder="예) HW" maxLength={30}
                style={{...inp,...(!codeIsNew?ro:{})}} readOnly={!codeIsNew} />
              {err(codeErrors.cd)}
            </FormRow>
          </div>
          <div style={{width:80}}>
            <FormRow label="순서">
              <FInput type="number" min={1} value={codeForm.sort}
                onChange={e=>scf("sort",parseInt(e.target.value)||1)} style={inp} />
            </FormRow>
          </div>
        </div>
        <FormRow label="코드명" required>
          <FInput value={codeForm.nm} onChange={e=>scf("nm",e.target.value)}
            placeholder="예) 하드웨어" style={inp} maxLength={50} />
          {err(codeErrors.nm)}
        </FormRow>
        <FormRow label="설명">
          <FTextarea value={codeForm.desc} onChange={e=>scf("desc",e.target.value)}
            placeholder="코드에 대한 설명" rows={2}
            style={{...inp, resize:"none", fontFamily:"inherit"}} maxLength={200} />
        </FormRow>
        <FormRow label="사용여부">
          <Radio value={codeForm.useYn} onChange={v=>scf("useYn",v)} />
        </FormRow>
      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={()=>setCodePanel(false)}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={saveCode}>{codeIsNew ? "등록" : "저장"}</Btn>
        </div>
      </div>
      </SidePanel>

      {/* ── 엑셀 업로드 모달 ── */}
      {showUpload && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:12,padding:32,width:440,boxShadow:"0 12px 40px rgba(0,0,0,.18)"}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>엑셀 업로드</div>
            <div style={{fontSize:12,color:C.txS,marginBottom:20}}>엑셀 파일을 업로드하면 코드 그룹 및 코드가 일괄 등록됩니다.</div>
            <div style={{border:`2px dashed ${C.brd}`,borderRadius:8,padding:"30px 0",textAlign:"center",marginBottom:16,color:C.txL,cursor:"pointer",background:"#f8fafc"}}>
              <div style={{fontSize:28,marginBottom:8}}>📂</div>
              <div style={{fontSize:12}}>파일을 드래그하거나 클릭하여 선택</div>
              <div style={{fontSize:12,marginTop:4}}>.xlsx, .xls 형식 지원 / 최대 5MB</div>
            </div>
            <div style={{fontSize:12,color:C.pri,marginBottom:20,cursor:"pointer"}}>▼ 업로드 양식 다운로드</div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
              <Btn onClick={()=>setShowUpload(false)}>취소</Btn>
              <Btn primary onClick={()=>setShowUpload(false)}>업로드</Btn>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!grpDel} title="코드 그룹 삭제" msg="해당 그룹과 하위 코드 전체가 삭제됩니다. 계속하시겠습니까?"
        onOk={()=>deleteGroup(grpDel)} onCancel={()=>setGrpDel(null)} />
      <ConfirmModal open={!!codeDel} title="코드 삭제" msg="선택한 코드를 삭제합니다. 계속하시겠습니까?"
        onOk={()=>deleteCode(codeDel)} onCancel={()=>setCodeDel(null)} />
    </div>
  );
};



/* ── 로그인 안내메시지 관리 ── */
const MgrLoginMsg = ({ loginMsg, onSave }) => {
  const MAX_LEN = 500;
  const [form, setForm] = useState({ content: loginMsg || "", useYn: loginMsg ? "Y" : "N" });
  const [errors, setErrors] = useState({});
  const [saveOk, setSaveOk] = useState(false);

  const sf = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    const e = {};
    if (form.useYn === "Y" && !form.content.trim()) e.content = "안내 메시지를 입력하세요.";
    if (form.content.length > MAX_LEN) e.content = MAX_LEN + "자 이내로 입력하세요.";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(form.useYn === "Y" ? form.content : "");
    setSaveOk(true);
    setTimeout(() => setSaveOk(false), 2000);
  };

  const remaining = MAX_LEN - form.content.length;



  return (
    <div>
      <PH title="로그인 안내메시지" bc="홈 > 환경설정 > 로그인 안내메시지" />
      <div>
        <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, padding: "28px 32px", maxWidth: 680 }}>
          <SecTitle label="안내 메시지 설정" primary />

          <FormRow label="노출 여부">
            <Radio value={form.useYn} onChange={v => sf("useYn", v)} />
            <div style={{ fontSize: 12, color: C.txS, marginTop: 5 }}>"노출" 설정 시 로그인 화면에 즉시 반영됩니다.</div>
          </FormRow>

          <FormRow label="안내 메시지 내용" required={form.useYn === "Y"}>
            <FTextarea
              value={form.content}
              onChange={e => { sf("content", e.target.value); setErrors(p => ({ ...p, content: "" })); }}
              placeholder={"로그인 화면에 표시할 안내 문구를 입력하세요.\n\n예) 본 시스템은 COMPLYSIGHT 정보시스템 자원 점검 관리 플랫폼입니다."}
              rows={8}
              maxLength={MAX_LEN}
              disabled={form.useYn === "N"}
              style={{ ...fInput, resize: "vertical", fontFamily: "inherit", lineHeight: 1.7, minHeight: 160, opacity: form.useYn === "N" ? 0.5 : 1 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
              <div>{errors.content && <span style={{ fontSize: 12, color: "#ef4444" }}>{errors.content}</span>}</div>
              <span style={{ fontSize: 12, color: remaining < 50 ? "#ef4444" : C.txL }}>{form.content.length} / {MAX_LEN}자</span>
            </div>
          </FormRow>

          {/* 미리보기 */}
          {form.useYn === "Y" && form.content.trim() && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.txS, marginBottom: 8 }}>미리보기</div>
              <div style={{ padding: "14px 18px", borderRadius: 8, background: "#fffbeb", border: "1px solid #fde68a", fontSize: 12, color: "#92400e", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {form.content}
              </div>
            </div>
          )}

          {saveOk && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 12, color: "#16a34a", marginBottom: 16 }}>
              ✓ 저장이 완료되었습니다.
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${C.brd}` }}>
            <Btn primary onClick={handleSave}>저장</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ── 공지배너 관리 ── */
const MgrCommonCode = () => {

  /* ── 샘플 데이터 ── */
  const INIT_GROUPS = [
    { id:"GRP001", nm:"자원 대분류",   desc:"자원의 최상위 분류 코드",   useYn:"Y", cnt:3, regDt:"2026-01-05" },
    { id:"GRP002", nm:"자원 중분류",   desc:"서버/WEB/WAS/DBMS 등 중분류", useYn:"Y", cnt:6, regDt:"2026-01-05" },
    { id:"GRP003", nm:"점검 유형",     desc:"일상점검, 특별점검 구분",   useYn:"Y", cnt:2, regDt:"2026-01-10" },
    { id:"GRP004", nm:"점검 종류",     desc:"점검 세부 종류 코드",       useYn:"Y", cnt:7, regDt:"2026-01-10" },
    { id:"GRP005", nm:"사용자 역할",   desc:"시스템 내 사용자 역할 코드", useYn:"Y", cnt:4, regDt:"2026-01-12" },
    { id:"GRP006", nm:"점검 상태",     desc:"예정/진행/지연/완료",       useYn:"Y", cnt:4, regDt:"2026-01-12" },
    { id:"GRP007", nm:"자원 상태",     desc:"사용/미사용 상태 코드",     useYn:"Y", cnt:2, regDt:"2026-01-15" },
    { id:"GRP008", nm:"시스템 유형",   desc:"정보시스템 유형 분류",     useYn:"Y", cnt:5, regDt:"2026-01-15" },
    { id:"GRP009", nm:"운영환경 구분", desc:"운영/개발/테스트",         useYn:"N", cnt:3, regDt:"2026-01-20" },
    { id:"GRP010", nm:"에이전트 타입", desc:"자동점검 에이전트 종류",   useYn:"Y", cnt:4, regDt:"2026-01-20" },
  ];

  const INIT_CODES = {
    GRP001: [
      { id:"C001-01", grpId:"GRP001", cd:"HW", nm:"하드웨어", desc:"서버, 네트워크 등 물리 장비", sort:1, useYn:"Y" },
      { id:"C001-02", grpId:"GRP001", cd:"SW", nm:"소프트웨어", desc:"WEB, WAS, DBMS 등 소프트웨어", sort:2, useYn:"Y" },
      { id:"C001-03", grpId:"GRP001", cd:"NW", nm:"네트워크", desc:"라우터, 스위치 등 네트워크 장비", sort:3, useYn:"Y" },
    ],
    GRP002: [
      { id:"C002-01", grpId:"GRP002", cd:"SVR", nm:"서버", desc:"물리/가상 서버", sort:1, useYn:"Y" },
      { id:"C002-02", grpId:"GRP002", cd:"WEB", nm:"WEB", desc:"웹서버", sort:2, useYn:"Y" },
      { id:"C002-03", grpId:"GRP002", cd:"WAS", nm:"WAS", desc:"웹 애플리케이션 서버", sort:3, useYn:"Y" },
      { id:"C002-04", grpId:"GRP002", cd:"DBMS", nm:"DBMS", desc:"데이터베이스 서버", sort:4, useYn:"Y" },
      { id:"C002-05", grpId:"GRP002", cd:"SEC", nm:"보안", desc:"방화벽, IDS/IPS 등", sort:5, useYn:"Y" },
      { id:"C002-06", grpId:"GRP002", cd:"ROUTER", nm:"네트워크", desc:"라우터/스위치", sort:6, useYn:"Y" },
    ],
    GRP003: [
      { id:"C003-01", grpId:"GRP003", cd:"DAILY",   nm:"일상점검", desc:"정기 반복 점검", sort:1, useYn:"Y" },
      { id:"C003-02", grpId:"GRP003", cd:"SPECIAL",  nm:"특별점검", desc:"비정기 특별 점검", sort:2, useYn:"Y" },
    ],
    GRP004: [
      { id:"C004-01", grpId:"GRP004", cd:"STATUS",   nm:"상태점검", desc:"자원 상태 확인", sort:1, useYn:"Y" },
      { id:"C004-02", grpId:"GRP004", cd:"VALID",    nm:"유효성점검", desc:"설정값 유효성", sort:2, useYn:"Y" },
      { id:"C004-03", grpId:"GRP004", cd:"SVC",      nm:"서비스점검", desc:"서비스 운영 확인", sort:3, useYn:"Y" },
      { id:"C004-04", grpId:"GRP004", cd:"OFFLINE",  nm:"오프라인점검", desc:"장비 직접 점검", sort:4, useYn:"Y" },
      { id:"C004-05", grpId:"GRP004", cd:"DUAL",     nm:"이중화점검", desc:"이중화 구성 점검", sort:5, useYn:"Y" },
      { id:"C004-06", grpId:"GRP004", cd:"PERF",     nm:"성능점검", desc:"성능 이슈 점검", sort:6, useYn:"Y" },
      { id:"C004-07", grpId:"GRP004", cd:"BUSY",     nm:"업무집중기간점검", desc:"피크타임 집중 점검", sort:7, useYn:"Y" },
    ],
    GRP005: [
      { id:"C005-01", grpId:"GRP005", cd:"SYS_ADMIN", nm:"시스템 관리자", desc:"전체 시스템 관리", sort:1, useYn:"Y" },
      { id:"C005-02", grpId:"GRP005", cd:"ORG_ADMIN", nm:"기관 관리자",   desc:"기관 단위 관리", sort:2, useYn:"Y" },
      { id:"C005-03", grpId:"GRP005", cd:"MAINT",     nm:"유지보수 총괄", desc:"점검 수행 관리", sort:3, useYn:"Y" },
      { id:"C005-04", grpId:"GRP005", cd:"USER",      nm:"사용자",        desc:"점검 수행 담당자", sort:4, useYn:"Y" },
    ],
    GRP006: [
      { id:"C006-01", grpId:"GRP006", cd:"REQ",   nm:"요청", desc:"점검 요청 상태", sort:1, useYn:"Y" },
      { id:"C006-02", grpId:"GRP006", cd:"STP",   nm:"중단", desc:"점검 중단 상태", sort:2, useYn:"Y" },
      { id:"C006-03", grpId:"GRP006", cd:"DELAY", nm:"지연", desc:"기한 초과 지연", sort:3, useYn:"Y" },
      { id:"C006-04", grpId:"GRP006", cd:"DONE",  nm:"완료", desc:"점검 완료",      sort:4, useYn:"Y" },
    ],
    GRP007: [
      { id:"C007-01", grpId:"GRP007", cd:"USE",   nm:"사용",   desc:"사용 중인 상태",  sort:1, useYn:"Y" },
      { id:"C007-02", grpId:"GRP007", cd:"UNUSE", nm:"미사용", desc:"미사용 처리 상태", sort:2, useYn:"Y" },
    ],
    GRP008: [
      { id:"C008-01", grpId:"GRP008", cd:"BIZ",   nm:"업무시스템", desc:"", sort:1, useYn:"Y" },
      { id:"C008-02", grpId:"GRP008", cd:"INF",   nm:"인프라",     desc:"", sort:2, useYn:"Y" },
      { id:"C008-03", grpId:"GRP008", cd:"SEC",   nm:"보안시스템", desc:"", sort:3, useYn:"Y" },
      { id:"C008-04", grpId:"GRP008", cd:"SHARE", nm:"공유자원",   desc:"", sort:4, useYn:"Y" },
      { id:"C008-05", grpId:"GRP008", cd:"EXT",   nm:"외부연계",   desc:"", sort:5, useYn:"Y" },
    ],
    GRP009: [
      { id:"C009-01", grpId:"GRP009", cd:"PROD",  nm:"운영", desc:"", sort:1, useYn:"N" },
      { id:"C009-02", grpId:"GRP009", cd:"DEV",   nm:"개발", desc:"", sort:2, useYn:"N" },
      { id:"C009-03", grpId:"GRP009", cd:"TEST",  nm:"테스트", desc:"", sort:3, useYn:"N" },
    ],
    GRP010: [
      { id:"C010-01", grpId:"GRP010", cd:"SSH",   nm:"SSH",  desc:"SSH 기반 점검", sort:1, useYn:"Y" },
      { id:"C010-02", grpId:"GRP010", cd:"SNMP",  nm:"SNMP", desc:"SNMP 프로토콜", sort:2, useYn:"Y" },
      { id:"C010-03", grpId:"GRP010", cd:"API",   nm:"API",  desc:"API 호출 방식", sort:3, useYn:"Y" },
      { id:"C010-04", grpId:"GRP010", cd:"AGENT", nm:"Agent", desc:"에이전트 설치", sort:4, useYn:"Y" },
    ],
  };

  const EMPTY_GRP  = { id:"", nm:"", desc:"", useYn:"Y" };
  const EMPTY_CODE = { id:"", cd:"", nm:"", desc:"", sort:1, useYn:"Y" };

  const [groups,    setGroups]    = useState(INIT_GROUPS);
  const [codesMap,  setCodesMap]  = useState(INIT_CODES);
  const [selGrp,    setSelGrp]    = useState(INIT_GROUPS[0]);
  const [grpSearch, setGrpSearch] = useState("");
  const [cdSearch,  setCdSearch]  = useState("");
  const [useFilter, setUseFilter] = useState("전체");

  /* 패널 상태 */
  const [panel,       setPanel]       = useState(null); // null | "grp-add" | "grp-edit" | "code-add" | "code-edit"
  const [grpForm,     setGrpForm]     = useState(EMPTY_GRP);
  const [codeForm,    setCodeForm]    = useState(EMPTY_CODE);
  const [grpErrors,   setGrpErrors]   = useState({});
  const [codeErrors,  setCodeErrors]  = useState({});

  /* 엑셀 업로드 모달 */
  const [uploadModal, setUploadModal] = useState(false);
  const [delGrpConfirm,  setDelGrpConfirm]  = useState(null);
  const [delCdConfirm,   setDelCdConfirm]   = useState(null);

  /* ── 유틸 ── */
  const sg  = (k, v) => setGrpForm(p => ({ ...p, [k]: v }));
  const sc  = (k, v) => setCodeForm(p => ({ ...p, [k]: v }));
  const closePanel = () => { setPanel(null); setGrpErrors({}); setCodeErrors({}); };

  const currentCodes = (codesMap[selGrp?.id] || [])
    .filter(c => useFilter === "전체" || c.useYn === (useFilter === "사용" ? "Y" : "N"))
    .filter(c => !cdSearch || c.cd.includes(cdSearch) || c.nm.includes(cdSearch))
    .sort((a, b) => a.sort - b.sort);

  const filteredGroups = groups.filter(g =>
    !grpSearch || g.id.includes(grpSearch) || g.nm.includes(grpSearch)
  );

  /* ── 그룹 저장 ── */
  const saveGroup = () => {
    const e = {};
    if (!grpForm.id.trim())  e.id = "그룹 ID를 입력하세요.";
    if (!grpForm.nm.trim())  e.nm = "그룹명을 입력하세요.";
    if (panel === "grp-add" && groups.find(g => g.id === grpForm.id)) e.id = "이미 존재하는 그룹 ID입니다.";
    setGrpErrors(e);
    if (Object.keys(e).length) return;
    if (panel === "grp-add") {
      const newG = { ...grpForm, cnt: 0, regDt: "2026-02-24" };
      setGroups(p => [...p, newG]);
      setCodesMap(p => ({ ...p, [grpForm.id]: [] }));
      setSelGrp(newG);
    } else {
      setGroups(p => p.map(g => g.id === grpForm.id ? { ...g, ...grpForm } : g));
      if (selGrp.id === grpForm.id) setSelGrp(p => ({ ...p, ...grpForm }));
    }
    closePanel();
  };

  /* ── 코드 저장 ── */
  const saveCode = () => {
    const e = {};
    if (!codeForm.cd.trim()) e.cd = "코드를 입력하세요.";
    if (!codeForm.nm.trim()) e.nm = "코드명을 입력하세요.";
    const existing = codesMap[selGrp.id] || [];
    if (panel === "code-add" && existing.find(c => c.cd === codeForm.cd)) e.cd = "이미 존재하는 코드입니다.";
    setCodeErrors(e);
    if (Object.keys(e).length) return;
    if (panel === "code-add") {
      const newC = { ...codeForm, id: `${selGrp.id}-${Date.now()}`, grpId: selGrp.id };
      setCodesMap(p => ({ ...p, [selGrp.id]: [...(p[selGrp.id]||[]), newC] }));
      setGroups(p => p.map(g => g.id === selGrp.id ? { ...g, cnt: g.cnt + 1 } : g));
    } else {
      setCodesMap(p => ({ ...p, [selGrp.id]: p[selGrp.id].map(c => c.id === codeForm.id ? { ...c, ...codeForm } : c) }));
    }
    closePanel();
  };

  /* ── 삭제 ── */
  const deleteGroup = (gid) => {
    setGroups(p => p.filter(g => g.id !== gid));
    setCodesMap(p => { const n = { ...p }; delete n[gid]; return n; });
    if (selGrp?.id === gid) setSelGrp(groups.find(g => g.id !== gid) || null);
    setDelGrpConfirm(null); closePanel();
  };
  const deleteCode = (cid) => {
    setCodesMap(p => ({ ...p, [selGrp.id]: p[selGrp.id].filter(c => c.id !== cid) }));
    setGroups(p => p.map(g => g.id === selGrp.id ? { ...g, cnt: Math.max(0, g.cnt - 1) } : g));
    setDelCdConfirm(null); closePanel();
  };

  /* ── 공통 스타일 ── */
  const thSt = { padding:"9px 12px", fontSize: 15, fontWeight: 400, color: C.txL,
    textAlign:"center", borderBottom:`1px solid ${C.brdD}`, whiteSpace:"nowrap", verticalAlign:"middle" };
  const tdSt = (sel) => ({ padding:"11px 12px", fontSize:15, color:C.txt,
    borderBottom:`1px solid ${C.brd}`, background: sel ? C.priL : "transparent", textAlign:"center", verticalAlign:"middle" });
  const useChip = (yn) => (
    <span style={{ padding:"2px 8px", borderRadius:10, fontSize:12, fontWeight:600,
      background: yn==="Y" ? "#dcfce7" : "#F9FAFC",
      color:      yn==="Y" ? "#16a34a" : "#929292" }}>{yn==="Y" ? "사용" : "미사용"}</span>
  );



  /* ── 그룹 패널 JSX ── */
  const GroupPanel = () => {
    const isEdit = panel === "grp-edit";
    return (
      <SidePanel open={panel==="grp-add"||panel==="grp-edit"} onClose={closePanel}
        title={isEdit ? "코드 그룹 수정" : "코드 그룹 등록"} width={480} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {isEdit && <PanelDeleteBtn onClick={() => setDelGrpConfirm(grpForm.id)} />}
        <SecTitle label="그룹 기본 정보" primary />
        <FormRow label="그룹 ID" required err={grpErrors.id}>
          <FInput value={grpForm.id} onChange={e => sg("id", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,""))}
            placeholder="예: GRP011" maxLength={20}
            readOnly={isEdit}
            style={{ ...fInput, ...(isEdit ? { background:"#f0f1f3", color:C.txS, pointerEvents:"none" } : {}) }} />
          <div style={{ fontSize:12, color:C.txS, marginTop:3 }}>영문 대문자·숫자만 입력 가능합니다.</div>
        </FormRow>
        <FormRow label="그룹명" required err={grpErrors.nm}>
          <FInput value={grpForm.nm} onChange={e => sg("nm", e.target.value)}
            placeholder="그룹명을 입력하세요" maxLength={50} style={fInput} />
        </FormRow>
        <FormRow label="설명">
          <FTextarea value={grpForm.desc} onChange={e => sg("desc", e.target.value)}
            placeholder="그룹에 대한 설명" rows={3}
            style={{ ...fInput, resize:"none", fontFamily:"inherit" }} />
        </FormRow>
        <FormRow label="사용여부">
          <Radio value={grpForm.useYn} onChange={v => sg("useYn", v)} />
        </FormRow>
      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={closePanel}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={saveGroup}>{isEdit ? "저장" : "등록"}</Btn>
        </div>
      </div>
      </SidePanel>
    );
  };

  /* ── 코드 패널 JSX ── */
  const CodePanel = () => {
    const isEdit = panel === "code-edit";
    return (
      <SidePanel open={panel==="code-add"||panel==="code-edit"} onClose={closePanel}
        title={isEdit ? `코드 수정 — ${selGrp?.nm}` : `코드 등록 — ${selGrp?.nm}`} width={480} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {isEdit && <PanelDeleteBtn onClick={() => setDelCdConfirm(codeForm.id)} />}
        <SecTitle label="코드 정보" primary />
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ flex:1 }}>
            <FormRow label="코드" required err={codeErrors.cd}>
              <FInput value={codeForm.cd} onChange={e => sc("cd", e.target.value.toUpperCase())}
                placeholder="예: SVR" maxLength={30}
                readOnly={isEdit}
                style={{ ...fInput, ...(isEdit ? { background:"#f0f1f3", color:C.txS, pointerEvents:"none" } : {}) }} />
            </FormRow>
          </div>
          <div style={{ width:80 }}>
            <FormRow label="정렬순서">
              <FInput type="number" min={1} value={codeForm.sort}
                onChange={e => sc("sort", parseInt(e.target.value)||1)} style={fInput} />
            </FormRow>
          </div>
        </div>
        <FormRow label="코드명" required err={codeErrors.nm}>
          <FInput value={codeForm.nm} onChange={e => sc("nm", e.target.value)}
            placeholder="코드명을 입력하세요" maxLength={50} style={fInput} />
        </FormRow>
        <FormRow label="설명">
          <FTextarea value={codeForm.desc} onChange={e => sc("desc", e.target.value)}
            placeholder="코드 설명 (선택)" rows={3}
            style={{ ...fInput, resize:"none", fontFamily:"inherit" }} />
        </FormRow>
        <FormRow label="사용여부">
          <Radio value={codeForm.useYn} onChange={v => sc("useYn", v)} />
        </FormRow>
      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={closePanel}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={saveCode}>{isEdit ? "저장" : "등록"}</Btn>
        </div>
      </div>
      </SidePanel>
    );
  };

  return (
    <div>
      <PH title="공통코드" bc="홈 > 환경설정 > 공통코드" />

      <div style={{ padding:"24px 32px", display:"flex", gap:20, alignItems:"flex-start" }}>

        {/* ══════════ 좌: 코드 그룹 목록 ══════════ */}
        <div style={{ width:360, flexShrink:0, background:"#fff", border:`1px solid ${C.brd}`, borderRadius:10, overflow:"hidden" }}>
          {/* 헤더 */}
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.brd}`,
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, fontWeight:700, color:C.txt }}>코드 그룹</span>
            <div style={{ display:"flex", gap:6 }}>
              <Btn sm onClick={() => { setUploadModal(true); }}>📤 엑셀 업로드</Btn>
              <Btn primary small onClick={() => {
                setGrpForm({ ...EMPTY_GRP });
                setGrpErrors({});
                setPanel("grp-add");
              }}>+ 그룹 추가</Btn>
            </div>
          </div>
          {/* 검색 */}
          <div style={{ padding:"10px 16px", borderBottom:`1px solid ${C.brd}` }}>
            <FInput value={grpSearch} onChange={e => setGrpSearch(e.target.value)}
              placeholder="그룹 ID 또는 그룹명 검색"
              style={{ ...fInput, fontSize:12 }} />
          </div>
          {/* 그룹 목록 */}
          <div style={{ maxHeight:"calc(100vh - 280px)", overflowY:"auto" }}>
            {filteredGroups.length === 0
              ? <div style={{ padding:32, textAlign:"center", fontSize:12, color:C.txL }}>검색 결과가 없습니다.</div>
              : filteredGroups.map(g => {
                const sel = selGrp?.id === g.id;
                return (
                  <div key={g.id} onClick={() => { setSelGrp(g); setCdSearch(""); setUseFilter("전체"); }}
                    style={{ padding:"11px 16px", borderBottom:`1px solid #f3f4f6`,
                      background: sel ? C.priL : "#fff", cursor:"pointer",
                      borderLeft: sel ? `3px solid ${C.pri}` : "3px solid transparent",
                      transition:"background .1s" }}
                    onMouseEnter={e => { if(!sel) e.currentTarget.style.background="#f8fafc"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = sel ? C.priL : "#fff"; }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:3 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ fontSize:12, fontWeight:700, color: sel ? C.pri : C.txS,
                          fontFamily:"inherit", background: sel ? "#dbeafe" : "#F9FAFC",
                          padding:"1px 6px", borderRadius:3 }}>{g.id}</span>
                        <span style={{ fontSize:12, fontWeight:600, color: sel ? C.pri : C.txt }}>{g.nm}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        {useChip(g.useYn)}
                        <span style={{ fontSize:12, color:C.txL }}>{g.cnt}개</span>
                      </div>
                    </div>
                    {g.desc && <div style={{ fontSize:12, color:C.txL, marginTop:1 }}>{g.desc}</div>}
                  </div>
                );
              })
            }
          </div>
          {/* 하단 카운트 */}
          <div style={{ padding:"8px 16px", background:"#F9FAFC", borderTop:`1px solid ${C.brd}`, color:C.txS, display:"flex", justifyContent:"space-between" }}>
            <span>전체 {groups.length}개 그룹</span>
            <span>사용 {groups.filter(g=>g.useYn==="Y").length}개</span>
          </div>
        </div>

        {/* ══════════ 우: 코드 목록 ══════════ */}
        <div style={{ flex:1, minWidth:0, background:"#fff", border:`1px solid ${C.brd}`, borderRadius:10, overflow:"hidden" }}>
          {selGrp ? (<>
            {/* 헤더 */}
            <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.brd}`,
              display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:12, fontWeight:700, color:C.txt }}>{selGrp.nm}</span>
                <span style={{ color:C.txS, fontFamily:"inherit",
                  background:"#F9FAFC", padding:"2px 7px", borderRadius:3 }}>{selGrp.id}</span>
                <span style={{ cursor:"pointer", fontSize:12, color:C.pri, fontWeight:600,
                  padding:"3px 8px", border:`1px solid ${C.pri}`, borderRadius:4 }}
                  onClick={() => { setGrpForm({ ...selGrp }); setGrpErrors({}); setPanel("grp-edit"); }}>
                  그룹 수정
                </span>
              </div>
              <Btn primary small onClick={() => {
                setCodeForm({ ...EMPTY_CODE, sort: currentCodes.length + 1 });
                setCodeErrors({});
                setPanel("code-add");
              }}>+ 코드 추가</Btn>
            </div>

            {/* 필터 바 */}
            <div style={{ padding:"10px 18px", borderBottom:`1px solid ${C.brd}`,
              display:"flex", alignItems:"center", gap:10 }}>
              <FInput value={cdSearch} onChange={e => setCdSearch(e.target.value)}
                placeholder="코드 또는 코드명 검색"
                style={{ ...fInput, width:220, fontSize:12 }} />
              <div style={{ display:"flex", gap:4 }}>
                {["전체","사용","미사용"].map(f => (
                  <button key={f} onClick={() => setUseFilter(f)}
                    style={{ padding:"5px 12px", fontSize:12, fontWeight:600, borderRadius:5, cursor:"pointer",
                      border:`1px solid ${useFilter===f ? C.pri : C.brd}`,
                      background: useFilter===f ? C.priL : "#fff",
                      color: useFilter===f ? C.pri : C.txS }}>
                    {f}
                  </button>
                ))}
              </div>
              <span style={{ marginLeft:"auto", fontSize:12, color:C.txS }}>
                {currentCodes.length}개 코드
              </span>
            </div>

            {/* 테이블 */}
            <Tbl
              noPaging
              data={currentCodes}
              onRow={c=>{ setCodeForm({...c}); setCodeErrors({}); setPanel("code-edit"); }}
              cols={[
                { t:"순서",   k:"sort",  w:70,  r:(v)=><span style={{color:C.txL}}>{v}</span> },
                { t:"코드값", k:"cd",    mw:120, align:"left", r:(v)=><span style={{fontFamily:"inherit",fontWeight:600,color:C.txt}}>{v}</span> },
                { t:"항목",   k:"nm",    mw:150, align:"left", r:(v)=><span style={{fontWeight:600}}>{v}</span> },
                { t:"설명",   k:"desc",  align:"left",
                  r:(v)=><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block",color:C.txS,maxWidth:260}}>
                    {v||<span style={{color:C.txL}}>—</span>}
                  </span> },
                { t:"사용여부", k:"useYn", r:(v)=>useChip(v) },
                { t:"", k:"id", w:60,
                  r:(_,c)=><span onClick={e=>{e.stopPropagation();setDelCdConfirm(c.id);}}
                    style={{fontSize:18,color:"#fca5a5",cursor:"pointer",fontWeight:700,padding:"0 4px",borderRadius:3,lineHeight:1}}
                    onMouseEnter={e=>e.currentTarget.style.color=C.red}
                    onMouseLeave={e=>e.currentTarget.style.color="#fca5a5"}>×</span> },
              ]}
            />
          </>) : (
            <div style={{ padding:60, textAlign:"center", fontSize:12, color:C.txL }}>
              왼쪽에서 코드 그룹을 선택하세요.
            </div>
          )}
        </div>
      </div>

      {/* ── 패널들 ── */}
      <GroupPanel />
      <CodePanel />

      {/* ── 엑셀 업로드 모달 ── */}
      {uploadModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:1100,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:12, padding:28, width:420, boxShadow:"0 8px 32px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>엑셀 업로드</div>
            <div style={{ fontSize:12, color:C.txS, marginBottom:20 }}>
              그룹 ID, 코드, 코드명, 설명, 정렬순서, 사용여부 순서로 작성된 엑셀 파일을 업로드하세요.
            </div>
            <div style={{ border:`2px dashed ${C.brd}`, borderRadius:8, padding:"28px 20px",
              textAlign:"center", background:"#F9FAFC", marginBottom:16, cursor:"pointer" }}
              onClick={() => {}}>
              <div style={{ fontSize:12, color:C.txS, marginBottom:6 }}>파일을 드래그하거나 클릭하여 선택</div>
              <div style={{ fontSize:12, color:C.txL }}>지원 형식: .xlsx, .xls, .csv</div>
            </div>
            <div style={{ fontSize:12, color:C.txS, marginBottom:20 }}>
              * 기존 코드와 동일한 그룹 ID + 코드는 덮어쓰기 됩니다.<br/>
              * 업로드 전 반드시 양식을 확인하세요.{" "}
              <span style={{ color:C.pri, cursor:"pointer", fontWeight:600 }}>양식 다운로드</span>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
              <Btn onClick={() => setUploadModal(false)}>취소</Btn>
              <Btn primary onClick={() => setUploadModal(false)}>업로드</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ── 그룹 삭제 확인 ── */}
      <ConfirmModal open={!!delGrpConfirm} title="그룹 삭제"
        msg={<>하위 코드 <strong>{(codesMap[delGrpConfirm]||[]).length}개</strong>가 함께 삭제됩니다. 삭제 후 복구할 수 없습니다. 계속하시겠습니까?</>}
        okLabel="삭제" onOk={() => deleteGroup(delGrpConfirm)} onCancel={() => setDelGrpConfirm(null)} />

      {/* ── 코드 삭제 확인 ── */}
      <ConfirmModal open={!!delCdConfirm} title="코드 삭제" msg="삭제된 코드는 복구할 수 없습니다. 계속하시겠습니까?"
        okLabel="삭제" onOk={() => deleteCode(delCdConfirm)} onCancel={() => setDelCdConfirm(null)} />
    </div>
  );
};

/* ── 자원 로그 ── */
const MgrErrorLog = () => {
  const PAGE_SZ = 10;

  const ERR_TYPES = ["전체", "시스템 오류", "인증 오류", "DB 오류", "API 오류", "권한 오류"];
  const MODULES   = ["전체", "자원관리", "점검관리", "사용자관리", "인증", "API Gateway", "배치"];

  const TYPE_STYLE = {
    "시스템 오류": { bg: "#fee2e2", c: "#dc2626" },
    "인증 오류":   { bg: "#fef3c7", c: "#d97706" },
    "DB 오류":     { bg: "#ede9fe", c: "#7c3aed" },
    "API 오류":    { bg: "#dbeafe", c: "#1d4ed8" },
    "권한 오류":   { bg: "#f1f5f9", c: "#475569" },
  };

  const INIT_LOGS = [
    { id:"EL001", dt:"2026-02-24 09:03:11", errType:"인증 오류",   module:"인증",        msg:"로그인 시도 횟수 초과 - 계정 잠금 처리",   user:"sysmgr",    reqUrl:"/api/auth/login", detail:"IP 10.0.0.5에서 5회 연속 로그인 실패. 계정 자동 잠금 적용." },
    { id:"EL002", dt:"2026-02-24 09:45:22", errType:"DB 오류",     module:"자원관리",    msg:"DB Connection Pool 한계 도달",             user:"—",         reqUrl:"/api/resource/list", detail:"Connection pool 최대치(50) 도달. 신규 연결 대기 타임아웃 발생." },
    { id:"EL003", dt:"2026-02-24 10:12:05", errType:"API 오류",    module:"API Gateway", msg:"외부 Core API 응답 타임아웃",              user:"—",         reqUrl:"/api/core/inspect",   detail:"Core 서버 응답 30초 초과. 자동점검 항목 3건 실패 처리됨." },
    { id:"EL004", dt:"2026-02-24 11:08:33", errType:"권한 오류",   module:"사용자관리",  msg:"접근 권한 없는 메뉴 직접 접근 시도",      user:"user01",    reqUrl:"/api/admin/users", detail:"일반 사용자가 사용자 관리 API 직접 호출 시도. 403 반환." },
    { id:"EL005", dt:"2026-02-24 12:30:44", errType:"시스템 오류", module:"배치",        msg:"정기점검 배치 실행 실패",                  user:"—",         reqUrl:"/batch/schedule/run",    detail:"스케줄 ID SCH-042 배치 실행 중 NullPointerException 발생." },
    { id:"EL006", dt:"2026-02-24 13:22:17", errType:"DB 오류",     module:"점검관리",    msg:"점검 결과 저장 실패 - 중복 키 오류",      user:"inspector", reqUrl:"/api/inspect/result/save", detail:"동일 점검 건에 대한 중복 제출 시도. UniqueConstraintException." },
    { id:"EL007", dt:"2026-02-24 14:05:59", errType:"API 오류",    module:"API Gateway", msg:"Core API 인증 토큰 만료",                  user:"—",         reqUrl:"/api/core/auto-check",   detail:"Core 연동 토큰 만료로 자동점검 실패. 토큰 재발급 진행 중." },
    { id:"EL008", dt:"2026-02-24 15:44:03", errType:"시스템 오류", module:"자원관리",    msg:"파일 업로드 용량 초과",                    user:"jdoe",      reqUrl:"/api/resource/file/upload", detail:"첨부파일 크기 50MB 초과(실제 87MB). 업로드 차단 처리." },
    { id:"EL009", dt:"2026-02-24 16:18:29", errType:"인증 오류",   module:"인증",        msg:"세션 만료 후 API 접근 시도",               user:"maint01",   reqUrl:"/api/inspect/list", detail:"세션 토큰 만료 후 재요청. 401 반환 및 로그인 페이지 리다이렉트." },
    { id:"EL010", dt:"2026-02-23 09:30:00", errType:"시스템 오류", module:"배치",        msg:"메일 알림 발송 실패",                      user:"—",         reqUrl:"/batch/notify/email",    detail:"SMTP 서버 연결 실패. 점검 지연 알림 12건 미발송 상태." },
    { id:"EL011", dt:"2026-02-23 11:15:42", errType:"DB 오류",     module:"점검관리",    msg:"대용량 점검 이력 조회 타임아웃",           user:"admin",     reqUrl:"/api/inspect/history", detail:"6개월 이상 이력 조회 시 쿼리 30초 초과. 인덱스 추가로 해결." },
    { id:"EL012", dt:"2026-02-22 14:02:55", errType:"권한 오류",   module:"사용자관리",  msg:"타 기관 사용자 정보 조회 시도",            user:"orgadmin",  reqUrl:"/api/admin/users/ORG002", detail:"기관 관리자가 타 기관 사용자 조회 시도. 403 반환." },
  ];

  const [logs,     setLogs]     = useState(INIT_LOGS);
  const [keyword,  setKeyword]  = useState("");
  const [dateFrom, setDateFrom] = useState("2026-02-22");
  const [dateTo,   setDateTo]   = useState("2026-02-24");
  const [errType,  setErrType]  = useState("전체");
  const [module,   setModule]   = useState("전체");
  const [page,     setPage]     = useState(1);
  const [applied,  setApplied]  = useState({ keyword:"", errType:"전체", module:"전체", dateFrom:"2026-02-22", dateTo:"2026-02-24" });
  const [selLog,   setSelLog]   = useState(null);

  const filtered = logs.filter(l => {
    const kw = applied.keyword.trim().toLowerCase();
    if (kw && !l.msg.toLowerCase().includes(kw) && !l.user.toLowerCase().includes(kw) && !l.module.toLowerCase().includes(kw)) return false;
    if (applied.errType  !== "전체" && l.errType !== applied.errType)    return false;
    if (applied.module   !== "전체" && l.module  !== applied.module)     return false;
    if (applied.dateFrom && l.dt.slice(0,10) < applied.dateFrom) return false;
    if (applied.dateTo   && l.dt.slice(0,10) > applied.dateTo)   return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SZ));
  const paged      = filtered.slice((page-1)*PAGE_SZ, page*PAGE_SZ);
  const search = () => { setApplied({ keyword, errType, module, dateFrom, dateTo }); setPage(1); };
  const reset  = () => { setKeyword(""); setDateFrom("2026-02-22"); setDateTo("2026-02-24"); setErrType("전체"); setModule("전체"); setApplied({ keyword:"", errType:"전체", module:"전체", dateFrom:"2026-02-22", dateTo:"2026-02-24" }); setPage(1); };






  return (
    <div>
      <PH title="에러로그" bc="홈 > 로그정보 > 에러로그" />
      <div>

        {/* ── 검색 영역 (searchform) ── */}
        <SB onSearch={search} onReset={reset}>
          <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
            <span style={{ ...LABEL_STYLE_SM }}>오류유형</span>
            <FSelect value={errType} onChange={e=>setErrType(e.target.value)} style={{...fSelect, width:"auto"}}>
              {ERR_TYPES.map(v=><option key={v}>{v}</option>)}
            </FSelect>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
            <span style={{ ...LABEL_STYLE_SM }}>발생모듈</span>
            <FSelect value={module} onChange={e=>setModule(e.target.value)} style={{...fSelect, width:"auto"}}>
              {MODULES.map(v=><option key={v}>{v}</option>)}
            </FSelect>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
            <span style={{ ...LABEL_STYLE_SM }}>기간</span>
            <DateRangePicker from={dateFrom} to={dateTo} onFromChange={setDateFrom} onToChange={setDateTo} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
            <span style={{ ...LABEL_STYLE_SM }}>키워드</span>
            <FInput value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}
              placeholder="오류 메시지, 사용자, 모듈" style={{...fInput, minWidth:120}} />
          </div>
        </SB>

        <Tbl
          secTitle="에러 이력"
          secCount={filtered.length}
          secButtons={<Btn onClick={()=>{}} style={{marginRight:4}}>📥 엑셀 다운로드</Btn>}
          data={filtered}
          cols={[
            { t:"No.",      k:"id",      w:60,  r:(_,l,i)=><span style={{color:C.txL}}>{filtered.length - i}</span> },
            { t:"오류유형",  k:"errType", w:70,  r:(v)=><Badge status={v}/> },
            { t:"발생모듈",  k:"module",  w:150, align:"left" },
            { t:"오류메시지", k:"msg",    align:"left",
              r:(v)=><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</div> },
            { t:"사용자",   k:"user",    w:80 },
            { t:"발생일시",  k:"dt",      w:150 },
          ]}
        />
      </div>
    </div>
  );
};

/* ── 접속 로그 ── */
const MgrAccessLog = () => {

  /* ── 샘플 데이터 ── */
  const INIT_LOGS = [
    { id:"LOG0001", userNm:"홍길동",  userId:"admin",     ip:"192.168.1.10",  menu:"대시보드",     action:"등록", url:"/dashboard",          dt:"2026-02-24 09:12:33", loginDt:"2026-02-24 09:10:00", result:"성공", note:"" },
    { id:"LOG0002", userNm:"김영희",  userId:"jdoe",      ip:"192.168.1.22",  menu:"자원관리",     action:"수정", url:"/resource",           dt:"2026-02-24 09:15:01", loginDt:"2026-02-24 09:14:00", result:"성공", note:"" },
    { id:"LOG0003", userNm:"이철수",  userId:"sysmgr",    ip:"10.0.0.5",      menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 09:20:45", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0004", userNm:"박민준",  userId:"inspector", ip:"192.168.2.100", menu:"점검현황",     action:"다운로드", url:"/inspect/status",     dt:"2026-02-24 10:03:17", loginDt:"2026-02-24 09:58:00", result:"성공", note:"" },
    { id:"LOG0005", userNm:"김영희",  userId:"jdoe",      ip:"192.168.1.22",  menu:"점검스케줄",   action:"로그인", url:"/inspect/schedule",   dt:"2026-02-24 10:44:59", loginDt:"2026-02-24 09:14:00", result:"성공", note:"" },
    { id:"LOG0006", userNm:"이철수",  userId:"sysmgr",    ip:"10.0.0.5",      menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 10:45:03", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0007", userNm:"이철수",  userId:"sysmgr",    ip:"10.0.0.5",      menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 10:45:21", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0008", userNm:"홍길동",  userId:"admin",     ip:"192.168.1.10",  menu:"사용자관리",   action:"수정", url:"/settings/users",     dt:"2026-02-24 11:08:42", loginDt:"2026-02-24 09:10:00", result:"성공", note:"" },
    { id:"LOG0009", userNm:"박민준",  userId:"inspector", ip:"192.168.2.100", menu:"보고이력",     action:"다운로드", url:"/inspect/history",    dt:"2026-02-24 12:30:00", loginDt:"2026-02-24 09:58:00", result:"성공", note:"" },
    { id:"LOG0010", userNm:"최유지",  userId:"maint01",   ip:"172.16.0.8",    menu:"점검표",       action:"등록", url:"/settings/checklist", dt:"2026-02-24 13:01:55", loginDt:"2026-02-24 12:59:00", result:"성공", note:"" },
    { id:"LOG0011", userNm:"김영희",  userId:"jdoe",      ip:"192.168.1.22",  menu:"자원관리",     action:"수정", url:"/resource",           dt:"2026-02-24 14:22:10", loginDt:"2026-02-24 09:14:00", result:"성공", note:"" },
    { id:"LOG0012", userNm:"—",       userId:"unknown",   ip:"203.0.113.42",  menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 14:33:07", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0013", userNm:"—",       userId:"unknown",   ip:"203.0.113.42",  menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 14:33:19", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0014", userNm:"—",       userId:"unknown",   ip:"203.0.113.42",  menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 14:33:31", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0015", userNm:"최유지",  userId:"maint01",   ip:"172.16.0.8",    menu:"점검현황",     action:"수정", url:"/inspect/status",     dt:"2026-02-24 15:10:44", loginDt:"2026-02-24 12:59:00", result:"성공", note:"" },
    { id:"LOG0016", userNm:"홍길동",  userId:"admin",     ip:"192.168.1.10",  menu:"대시보드",     action:"등록", url:"/dashboard",          dt:"2026-02-23 08:55:12", loginDt:"2026-02-23 08:53:00", result:"성공", note:"" },
    { id:"LOG0017", userNm:"박민준",  userId:"inspector", ip:"192.168.2.100", menu:"일상점검",     action:"등록", url:"/inspect/daily",      dt:"2026-02-23 09:40:38", loginDt:"2026-02-23 09:38:00", result:"성공", note:"" },
    { id:"LOG0018", userNm:"이철수",  userId:"sysmgr",    ip:"10.0.0.5",      menu:"자원관리",     action:"다운로드", url:"/resource",           dt:"2026-02-23 11:20:05", loginDt:"2026-02-23 11:18:00", result:"성공", note:"" },
    { id:"LOG0019", userNm:"김영희",  userId:"jdoe",      ip:"192.168.1.22",  menu:"점검보고서",   action:"다운로드", url:"/inspect/report",     dt:"2026-02-22 09:05:50", loginDt:"2026-02-22 09:04:00", result:"성공", note:"" },
    { id:"LOG0020", userNm:"홍길동",  userId:"admin",     ip:"192.168.1.10",  menu:"권한관리",     action:"수정", url:"/settings/permission",dt:"2026-02-22 16:30:00", loginDt:"2026-02-22 08:40:00", result:"성공", note:"" },
  ];

  const TODAY    = "2026-02-24";
  const PAGE_SZ  = 10;

  const [logs]        = useState(INIT_LOGS);
  const [keyword,  setKeyword]  = useState("");
  const [actionFilter, setActionFilter] = useState("전체");
  const [dateFrom, setDateFrom] = useState("2026-02-22");
  const [dateTo,   setDateTo]   = useState(TODAY);
  const [result,   setResult]   = useState("전체");   // 전체 | 성공 | 실패
  const [path,     setPath]     = useState("전체");   // 전체 | 웹 | 모바일
  const [page,     setPage]     = useState(1);
  const [applied,  setApplied]  = useState({ keyword:"", actionFilter:"전체", dateFrom:"2026-02-22", dateTo:TODAY, result:"전체", path:"전체" });
  const [selLog,   setSelLog]   = useState(null);

  /* ── 필터 적용 ── */
  const filtered = logs.filter(l => {
    if (applied.actionFilter !== "전체" && l.action !== applied.actionFilter) return false;
    const kw = applied.keyword.trim().toLowerCase();
    if (kw && !l.userId.toLowerCase().includes(kw) && !l.userNm.includes(kw) && !l.ip.includes(kw)) return false;
    if (applied.result !== "전체" && l.result !== applied.result) return false;
    if (applied.path   !== "전체" && l.path   !== applied.path)   return false;
    if (applied.dateFrom && l.dt.slice(0, 10) < applied.dateFrom) return false;
    if (applied.dateTo   && l.dt.slice(0, 10) > applied.dateTo)   return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SZ));
  const paged = filtered.slice((page - 1) * PAGE_SZ, page * PAGE_SZ);

  const search = () => { setApplied({ keyword, actionFilter, dateFrom, dateTo, result, path }); setPage(1); };
  const reset  = () => { setKeyword(""); setDateFrom("2026-02-22"); setDateTo(TODAY); setResult("전체"); setPath("전체"); setActionFilter("전체"); setApplied({ keyword:"", actionFilter:"전체", dateFrom:"2026-02-22", dateTo:TODAY, result:"전체", path:"전체" }); setPage(1); };

  /* ── 결과 배지 ── */


  return (
    <div>
      <PH title="접속로그" bc="홈 > 로그정보 > 접속로그" />

      <div>

        {/* ── 검색 영역 (searchform) ── */}
        <SB onSearch={search} onReset={reset}>
          <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
            <span style={{ ...LABEL_STYLE_SM }}>행동유형</span>
            <FSelect value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={{...fSelect, width:"auto"}}>
              {["전체", "등록", "수정", "삭제", "다운로드", "로그인"].map(v => <option key={v}>{v}</option>)}
            </FSelect>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
            <span style={{ ...LABEL_STYLE_SM }}>기간</span>
            <DateRangePicker from={dateFrom} to={dateTo} onFromChange={setDateFrom} onToChange={setDateTo} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
            <span style={{ ...LABEL_STYLE_SM }}>사용자/IP</span>
            <FInput value={keyword} onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="사용자 ID, 이름, IP"
              style={{...fInput, minWidth:120}} />
          </div>
        </SB>

        {/* ── 그리드 ── */}
        <div>
          <Tbl
            secTitle="접속 이력"
            secCount={filtered.length}
            secButtons={<Btn onClick={()=>{}}>📥 엑셀 다운로드</Btn>}
            data={filtered}
            cols={[
              { t:"No.",      k:"id",       w:60,  r:(_,l,i)=><span style={{color:C.txL}}>{filtered.length - i}</span> },
              { t:"행동유형",  k:"action",   w:70,  r:(v)=><Badge status={v}/> },
              { t:"이름",     k:"userNm",   w:90 },
              { t:"아이디",   k:"userId",   w:110, r:(v)=><span style={{color:C.txS,fontFamily:"inherit"}}>{v}</span> },
              { t:"IP",       k:"ip",       w:130, r:(v)=><span style={{fontFamily:"inherit"}}>{v}</span> },
              { t:"메뉴",     k:"menu",     w:110 },
              { t:"URL",      k:"url",      w:180, align:"left", r:(v)=><span style={{color:C.txS,fontFamily:"inherit"}}>{v}</span> },
              { t:"일시",     k:"dt",       w:155, r:(v)=><span style={{fontFamily:"inherit"}}>{v}</span> },
              { t:"로그인일시", k:"loginDt", w:155, r:(v)=><span style={{color:C.txS,fontFamily:"inherit"}}>{v}</span> },
              { t:"비고",     k:"note",     w:120, align:"left", r:(v)=><span style={{color:v?C.txt:C.txL}}>{v||"—"}</span> },
            ]}
          />
        </div>
      </div>

      {/* ══ 상세 패널 ══ */}
    </div>
  );
};

/* ── 권한 변경 로그 ── */
const MgrAgentAuth = () => {

  /* 에이전트 타입 정의 */
  const AGENT_TYPES = [
    { cd:"SSH",   nm:"SSH Agent",   icon:"🔑", desc:"SSH 프로토콜 기반",       forMid:["서버","WAS"] },
    { cd:"SNMP",  nm:"SNMP Agent",  icon:"📡", desc:"SNMP 프로토콜 기반",      forMid:["네트워크","보안","스토리지"] },
    { cd:"WEB",   nm:"Web Agent",   icon:"🌐", desc:"HTTP/HTTPS 기반",         forMid:["WEB","WAS"] },
    { cd:"DB",    nm:"DB Agent",    icon:"🗄️",  desc:"데이터베이스 접속 기반",  forMid:["DBMS"] },
    { cd:"LOCAL", nm:"Local Agent", icon:"💻", desc:"로컬 설치형",              forMid:["서버","백업","스토리지"] },
  ];

  /* 에이전트 접속 권한 초기 데이터 (자원 ID → 에이전트 설정 목록) */
  const INIT_AUTH = (() => {
    const data = {};
    // 샘플: RES 앞 30개에 대해 에이전트 설정 생성
    const sample = RES.slice(0, 30);
    sample.forEach((r, idx) => {
      const forTypes = AGENT_TYPES.filter(a => a.forMid.includes(r.mid));
      if (!forTypes.length) return;
      data[r.id] = forTypes.map((a, ai) => ({
        id: `${r.id}_${a.cd}`,
        resId: r.id,
        agentType: a.cd,
        host: r.ip,
        port: a.cd==="SSH"?22 : a.cd==="SNMP"?161 : a.cd==="WEB"?8080 : a.cd==="DB"?3306 : 0,
        authId: a.cd==="SSH"||a.cd==="DB"||a.cd==="LOCAL" ? `svc_${r.nm.toLowerCase().replace(/-/g,"_")}` : "",
        authPw: a.cd==="SSH"||a.cd==="DB"||a.cd==="LOCAL" ? "●●●●●●●●" : "",
        snmpVer: a.cd==="SNMP" ? "v2c" : "",
        community: a.cd==="SNMP" ? "public" : "",
        timeout: 10,
        retryCount: 3,
        useYn: (idx + ai) % 7 === 0 ? "N" : "Y",
        testResult: (idx + ai) % 5 === 0 ? "실패" : (idx + ai) % 3 === 0 ? "미확인" : "성공",
        testDt: (idx + ai) % 3 === 0 ? "" : `2026-02-${String(22 + (idx % 3)).padStart(2,"0")} ${String(9 + ai).padStart(2,"0")}:${String(idx * 3 % 60).padStart(2,"0")}`,
        regDt: "2026-01-10",
      }));
    });
    return data;
  })();

  /* 정보시스템 목록 */
  const SYS_LIST = [
    { id:"전체",   nm:"전체" },
    ..._sIds.map(id => ({ id, nm: _sysMap[id] }))
  ];

  const MID_LIST = ["전체", ..._mids];

  const PAGE_SZ = 15;

  const [authMap, setAuthMap]   = useState(INIT_AUTH);
  const [selRes,  setSelRes]    = useState(null);
  const [selSys,  setSelSys]    = useState("전체");
  const [selMid,  setSelMid]    = useState("전체");
  const [resQ,    setResQ]      = useState("");
  const [resPage, setResPage]   = useState(1);

  /* 에이전트 설정 패널 */
  const [panel,      setPanel]      = useState(false);
  const [panelForm,  setPanelForm]  = useState(null);
  const [panelIsNew, setPanelIsNew] = useState(false);
  const [panelErr,   setPanelErr]   = useState({});
  const [showPw,     setShowPw]     = useState(false);
  const [testLoading,setTestLoading]= useState(false);

  /* 삭제 확인 */
  const [delTarget, setDelTarget] = useState(null);

  /* 자원 필터 */
  const filteredRes = RES.filter(r => {
    if (r.st === "미사용") return false;
    if (selSys !== "전체" && r.sysId !== selSys) return false;
    if (selMid !== "전체" && r.mid !== selMid) return false;
    if (resQ && !r.nm.toLowerCase().includes(resQ.toLowerCase()) && !r.ip.includes(resQ)) return false;
    return true;
  });
  const totalResPages = Math.max(1, Math.ceil(filteredRes.length / PAGE_SZ));
  const pagedRes = filteredRes.slice((resPage-1)*PAGE_SZ, resPage*PAGE_SZ);

  /* 현재 선택 자원의 에이전트 목록 */
  const curAuth = selRes ? (authMap[selRes.id] || []) : [];

  /* 에이전트 타입에 따라 적합 여부 판단 */
  const isRecommended = (agentCd) => {
    if (!selRes) return false;
    const ag = AGENT_TYPES.find(a=>a.cd===agentCd);
    return ag?.forMid.includes(selRes.mid) || false;
  };
  const availableAgents = AGENT_TYPES.filter(a => !curAuth.some(c=>c.agentType===a.cd));

  const openPanel = (auth, isNew=false, agentType=null) => {
    if (isNew) {
      const ag = AGENT_TYPES.find(a=>a.cd===agentType) || AGENT_TYPES[0];
      setPanelForm({
        id: `${selRes.id}_${ag.cd}_${Date.now()}`,
        resId: selRes.id,
        agentType: ag.cd,
        host: selRes.ip,
        port: ag.cd==="SSH"?22 : ag.cd==="SNMP"?161 : ag.cd==="WEB"?8080 : ag.cd==="DB"?3306 : 0,
        authId:"", authPw:"", snmpVer:"v2c", community:"public",
        timeout:10, retryCount:3, useYn:"Y", testResult:"미확인", testDt:"", regDt:"2026-02-24",
      });
    } else {
      setPanelForm({...auth});
    }
    setPanelIsNew(isNew);
    setPanelErr({});
    setShowPw(false);
    setPanel(true);
  };

  const saveAuth = () => {
    const e = {};
    if (!panelForm.host.trim()) e.host = "호스트(IP)를 입력하세요.";
    if (["SSH","DB","LOCAL"].includes(panelForm.agentType) && !panelForm.authId.trim()) e.authId = "접속 ID를 입력하세요.";
    setPanelErr(e);
    if (Object.keys(e).length) return;
    const list = authMap[selRes.id] || [];
    if (panelIsNew) {
      setAuthMap(p=>({...p, [selRes.id]:[...list, panelForm]}));
    } else {
      setAuthMap(p=>({...p, [selRes.id]:list.map(a=>a.id===panelForm.id?{...a,...panelForm}:a)}));
    }
    setPanel(false);
  };

  const deleteAuth = (id) => {
    setAuthMap(p=>({...p, [selRes.id]:(p[selRes.id]||[]).filter(a=>a.id!==id)}));
    setDelTarget(null); setPanel(false);
  };

  const handleTest = () => {
    setTestLoading(true);
    setTimeout(()=>{
      const ok = Math.random() > 0.3;
      setPanelForm(p=>({...p, testResult:ok?"성공":"실패", testDt:"2026-02-24 " + new Date().toTimeString().slice(0,8)}));
      setTestLoading(false);
    }, 1200);
  };

  const spf = (k,v) => setPanelForm(p=>({...p,[k]:v}));
  const inp = {...fInput};
  const ro  = {background:"#f0f1f3",color:C.txS,pointerEvents:"none"};
  const err = (msg) => msg ? <div style={{fontSize:12,color:"#ef4444",marginTop:3}}>{msg}</div> : null;







  /* 에이전트 타입에 따른 접속정보 필드 렌더 */
  const renderAuthFields = () => {
    if (!panelForm) return null;
    const t = panelForm.agentType;
    return (
      <>
        {/* 공통: 호스트 + 포트 */}
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1}}>
            <FormRow label="호스트 (IP)" required>
              <FInput value={panelForm.host} onChange={e=>spf("host",e.target.value)}
                placeholder="예) 10.100.1.1" style={inp} />
              {err(panelErr.host)}
            </FormRow>
          </div>
          <div style={{width:90}}>
            <FormRow label="포트">
              <FInput type="number" value={panelForm.port} onChange={e=>spf("port",parseInt(e.target.value)||0)}
                style={inp} />
            </FormRow>
          </div>
        </div>

        {/* SSH / DB / LOCAL: ID + PW */}
        {["SSH","DB","LOCAL"].includes(t) && (
          <>
            <FormRow label="접속 ID" required>
              <FInput value={panelForm.authId} onChange={e=>spf("authId",e.target.value)}
                placeholder="접속 계정 ID" style={inp} />
              {err(panelErr.authId)}
            </FormRow>
            <FormRow label="접속 PW">
              <div style={{position:"relative"}}>
                <FInput type={showPw?"text":"password"} value={panelForm.authPw}
                  onChange={e=>spf("authPw",e.target.value)}
                  placeholder="접속 비밀번호"
                  style={{...inp,paddingRight:40}} />
                <button onClick={()=>setShowPw(p=>!p)}
                  style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",fontSize:15,color:C.txL}}>
                  {showPw?"🙈":"👁️"}
                </button>
              </div>
            </FormRow>
          </>
        )}

        {/* SNMP: 버전 + 커뮤니티 */}
        {t==="SNMP" && (
          <>
            <FormRow label="SNMP 버전">
              <FSelect value={panelForm.snmpVer} onChange={e=>spf("snmpVer",e.target.value)} style={inp}>
                {["v1","v2c","v3"].map(v=><option key={v}>{v}</option>)}
              </FSelect>
            </FormRow>
            <FormRow label="Community">
              <FInput value={panelForm.community} onChange={e=>spf("community",e.target.value)}
                placeholder="예) public" style={inp} />
            </FormRow>
          </>
        )}

        {/* 공통: 타임아웃 + 재시도 */}
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1}}>
            <FormRow label="타임아웃 (초)">
              <FInput type="number" min={1} max={120} value={panelForm.timeout}
                onChange={e=>spf("timeout",parseInt(e.target.value)||10)} style={inp} />
            </FormRow>
          </div>
          <div style={{flex:1}}>
            <FormRow label="재시도 횟수">
              <FInput type="number" min={0} max={10} value={panelForm.retryCount}
                onChange={e=>spf("retryCount",parseInt(e.target.value)||0)} style={inp} />
            </FormRow>
          </div>
        </div>

        <FormRow label="사용 여부">
          <Radio value={panelForm.useYn} onChange={v=>spf("useYn",v)} />
        </FormRow>
      </>
    );
  };

  return (
    <div>
      <PH title="AGENT 권한관리" bc="홈 > 보안 및 개발 > AGENT 권한관리" />

      <div style={{display:"flex",gap:16,maxHeight:"calc(100vh - 170px)",boxSizing:"border-box"}}>

        {/* ── 좌: 자원 목록 ── */}
        <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",background:"#fff",border:`1px solid ${C.brd}`,borderRadius:10,overflow:"hidden"}}>

          {/* 헤더 */}
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.brd}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:12,fontWeight:700,color:C.txt}}>자원 선택</span>
          </div>
          <div style={{padding:"10px 12px",borderBottom:`1px solid ${C.brd}`,flexShrink:0,display:"flex",flexDirection:"column",gap:8}}>
            {/* 정보시스템 필터 */}
            <FSelect value={selSys} onChange={e=>{setSelSys(e.target.value);setResPage(1);setSelRes(null);}}
              style={{...inp,fontSize:12,padding:"6px 10px",width:"100%",boxSizing:"border-box"}}>
              {SYS_LIST.map(s=><option key={s.id} value={s.id}>{s.nm}</option>)}
            </FSelect>
            {/* 분류 필터 */}
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {MID_LIST.map(m=>(
                <button key={m} onClick={()=>{setSelMid(m);setResPage(1);setSelRes(null);}}
                  style={{padding:"3px 8px",fontSize:12,border:`1px solid ${selMid===m?C.pri:C.brd}`,borderRadius:5,
                    background:selMid===m?C.pri:"#fff",color:selMid===m?"#fff":C.txS,cursor:"pointer",fontWeight:selMid===m?600:400}}>
                  {m}
                </button>
              ))}
            </div>
            {/* 검색 */}
            <FInput value={resQ} onChange={e=>{setResQ(e.target.value);setResPage(1);}}
              placeholder="자원명 / IP 검색"
              style={{...inp,fontSize:12,padding:"6px 10px",width:"100%",boxSizing:"border-box"}} />
          </div>

          {/* 자원 리스트 */}
          <div style={{flex:1,overflowY:"auto"}}>
            {pagedRes.length===0 && (
              <div style={{padding:30,textAlign:"center",color:C.txL,fontSize:12}}>자원이 없습니다.</div>
            )}
            {pagedRes.map(r => {
              const sel = selRes?.id===r.id;
              const authList = authMap[r.id]||[];
              const hasAny = authList.length > 0;
              const allOk  = hasAny && authList.every(a=>a.testResult==="성공"&&a.useYn==="Y");
              const hasFail= authList.some(a=>a.testResult==="실패");
              const dotColor = !hasAny?"#EEEEEE":hasFail?"#ef4444":allOk?"#16a34a":"#f59e0b";
              return (
                <div key={r.id}
                  onClick={()=>{ setSelRes(r); setPanel(false); }}
                  style={{padding:"9px 14px",cursor:"pointer", borderRadius:6, margin:"1px 6px",
                    background:sel?C.priL:"transparent",
                    transition:"all .3s"}}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? C.priL : "transparent"; }}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,flex:1,minWidth:0}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:dotColor,flexShrink:0}} />
                      <span style={{fontSize:15,fontWeight:sel?600:500,color:sel?C.sec:C.txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.nm}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                      <span style={{fontSize:12,color:C.txL,background:"#F9FAFC",borderRadius:10,padding:"1px 7px"}}>{authList.length}</span>
                      <button
                        onClick={e => { e.stopPropagation(); setSelRes(r); }}
                        style={{ width:24, height:24, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.txL, flexShrink:0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.secL; e.currentTarget.style.color = C.pri; e.currentTarget.style.borderColor = C.pri; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.txL; e.currentTarget.style.borderColor = C.brd; }}
                        title="상세 보기">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:C.txL,marginTop:2,display:"flex",gap:8,paddingLeft:15}}>
                    <span>{r.mid}</span>
                    <span>·</span>
                    <span>{r.sysNm}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          {totalResPages > 1 && (
            <div style={{padding:"8px 12px",borderTop:`1px solid ${C.brd}`,display:"flex",alignItems:"center",justifyContent:"center",gap:3,flexShrink:0}}>
              <button onClick={()=>setResPage(p=>Math.max(1,p-1))} disabled={resPage===1}
                style={{padding:"4px 8px",fontSize:12,border:`1px solid ${C.brd}`,borderRadius:4,background:"#fff",color:resPage===1?C.txL:C.txt,cursor:resPage===1?"default":"pointer"}}>‹</button>
              <span style={{fontSize:12,color:C.txS,padding:"0 8px"}}>{resPage} / {totalResPages}</span>
              <button onClick={()=>setResPage(p=>Math.min(totalResPages,p+1))} disabled={resPage===totalResPages}
                style={{padding:"4px 8px",fontSize:12,border:`1px solid ${C.brd}`,borderRadius:4,background:"#fff",color:resPage===totalResPages?C.txL:C.txt,cursor:resPage===totalResPages?"default":"pointer"}}>›</button>
            </div>
          )}
        </div>

        {/* ── 우: 에이전트 권한 목록 ── */}
        <div style={{flex:1, minWidth:0}}>
          {!selRes ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:C.txL,gap:8}}>
              <div style={{fontSize:36}}>🔐</div>
              <div style={{fontSize:15,fontWeight:600,color:C.txS}}>자원을 선택하세요</div>
              <div style={{fontSize:12}}>왼쪽에서 자원을 선택하면 에이전트 접속 권한을 관리할 수 있습니다.</div>
            </div>
          ) : (<>
            <SB ph="에이전트, 호스트 검색" />
            <Tbl secTitle={`${selRes.nm} 에이전트 목록`} secCount={curAuth.length} secButtons={availableAgents.length > 0 && (
              <div style={{position:"relative"}}>
                <FSelect defaultValue=""
                  onChange={e=>{ if(e.target.value){ openPanel(null,true,e.target.value); e.target.value=""; }}}
                  style={{fontSize:12,padding:"6px 12px",color:C.pri,border:`1px solid ${C.pri}`,borderRadius:4,fontWeight:600,background:"#fff",cursor:"pointer",fontFamily:"inherit"}}>
                  <option value="" disabled>+ 에이전트 추가</option>
                  {availableAgents.map(a=>(
                    <option key={a.cd} value={a.cd}>{a.icon} {a.nm}</option>
                  ))}
                </FSelect>
              </div>
            )} cols={[
              { t: "에이전트", k: "agentType", r: v => { const ag = AGENT_TYPES.find(a=>a.cd===v); return <Badge status={v} label={ag ? `${ag.icon} ${ag.nm}` : v} />; } },
              { t: "호스트", k: "host", r: v => <span style={{fontFamily:"inherit"}}>{v}</span> },
              { t: "포트", k: "port", r: v => <span style={{fontFamily:"inherit"}}>{v||"—"}</span> },
              { t: "접속 정보", k: "id", r: (_, row) => {
                const info = row.agentType==="SNMP" ? `${row.snmpVer} / ${row.community}` : row.authId ? row.authId : "—";
                return <span>{info}</span>;
              }},
              { t: "타임아웃", k: "timeout", r: v => `${v}초` },
              { t: "연결 테스트", k: "testResult", r: (v, row) => <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <Badge status={v||"미확인"} />
                {row.testDt && <span style={{color:C.txL,fontFamily:"inherit"}}>{row.testDt}</span>}
              </div> },
              { t: "사용여부", k: "useYn", r: v => <YnBadge v={v} /> },
              { t: "등록일", k: "regDt" },
            ]} data={curAuth} onRow={r => openPanel(r, false)} />
          </>)}
        </div>
      </div>

      {/* ── 사이드 패널: 에이전트 설정 ── */}
      <SidePanel open={panel} onClose={()=>setPanel(false)}
        title={panelIsNew?"에이전트 접속 설정 추가":"에이전트 접속 설정 수정"} width={460} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {panelForm && (
          <>
            {!panelIsNew && <PanelDeleteBtn onClick={()=>setDelTarget(panelForm.id)} />}

            <SecTitle label="에이전트 정보" primary />
            <div style={{marginBottom:16,padding:"12px 14px",background:"#f8fafc",border:`1px solid ${C.brd}`,borderRadius:8,display:"flex",alignItems:"center",gap:12}}>
              {(() => { const ag = AGENT_TYPES.find(a=>a.cd===panelForm.agentType); return <Badge status={panelForm.agentType} label={ag ? `${ag.icon} ${ag.nm}` : panelForm.agentType} />; })()}
              <div style={{fontSize:12,color:C.txS}}>
                {AGENT_TYPES.find(a=>a.cd===panelForm.agentType)?.desc}
                {isRecommended(panelForm.agentType) &&
                  <span style={{marginLeft:8,fontSize:12,color:"#16a34a",fontWeight:600}}>✓ 권장 에이전트</span>}
              </div>
            </div>

            <SecTitle label="접속 정보" primary />
            {renderAuthFields()}

            {/* 연결 테스트 */}
            <div style={{marginTop:4,marginBottom:16,padding:"12px 14px",background:"#f8fafc",border:`1px solid ${C.brd}`,borderRadius:8}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:panelForm.testDt?8:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,fontWeight:600,color:C.txt}}>연결 테스트</span>
                  <Badge status={panelForm.testResult||"미확인"} />
                </div>
                <Btn sm outline onClick={handleTest} disabled={testLoading}>
                  {testLoading ? "테스트 중..." : "연결 테스트"}
                </Btn>
              </div>
              {panelForm.testDt && (
                <div style={{color:C.txL,marginTop:6,fontFamily:"inherit"}}>마지막 테스트: {panelForm.testDt}</div>
              )}
            </div>

          </>
        )}
      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={()=>setPanel(false)}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={saveAuth}>{panelIsNew ? "등록" : "저장"}</Btn>
        </div>
      </div>
      </SidePanel>

      {delTarget && (
        <ConfirmModal open={!!confirmDel} title="에이전트 설정 삭제"
          msg="선택한 에이전트 접속 설정을 삭제합니다. 계속하시겠습니까?"
          onOk={()=>deleteAuth(delTarget)} onCancel={()=>setDelTarget(null)} />
      )}
    </div>
  );
};

/* ── 라이선스 관리 ── */
/* ── 시스템 프로필 ── */
const MgrSysProfile = () => {
  const [form, setForm] = useState({
    orgName: "한국정보보호산업협회", phone: "02-1234-5678",
    siteName: "COMPLYSIGHT", siteShort: "CS",
    url: "https://complysight.example.com", accessIp: "192.168.1.0/24, 10.0.0.0/8",
    workStart: "09:00", workEnd: "18:00",
    timezone: "Asia/Seoul", language: "ko",
    mfaEnabled: "N",
    logoAlt: "COMPLYSIGHT 로고",
  });
  const [saveOk, setSaveOk] = useState(false);
  const sf = (k, v) => { setForm(p => ({ ...p, [k]: v })); setSaveOk(false); };
  const handleSave = () => { setSaveOk(true); setTimeout(() => setSaveOk(false), 2500); };



  return <div>
    <PH title="시스템 프로필" bc="홈 > 환경설정 > 시스템 프로필" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

      {/* 왼쪽: 입력 폼 */}
      <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, padding: "28px 32px" }}>
        <SecTitle label="기관 정보" primary />
        <FormRow label="기관명" required>
          <FInput value={form.orgName} onChange={e => sf("orgName", e.target.value)} placeholder="기관명을 입력하세요" style={fInput} />
        </FormRow>
        <FormRow label="전화번호">
          <FInput value={form.phone} onChange={e => sf("phone", e.target.value)} placeholder="02-0000-0000" style={fInput} />
        </FormRow>

        <div style={{ borderTop: `1px solid ${C.brd}`, margin: "20px 0" }} />
        <SecTitle label="사이트 정보" />
        <FormRow label="사이트 명" required>
          <FInput value={form.siteName} onChange={e => sf("siteName", e.target.value)} placeholder="사이트 명칭" style={fInput} />
        </FormRow>
        <FormRow label="사이트 약칭명" desc="사이드바, 헤더 등에 노출되는 짧은 명칭입니다.">
          <FInput value={form.siteShort} onChange={e => sf("siteShort", e.target.value)} placeholder="약칭 (최대 10자)" style={fInput} maxLength={10} />
        </FormRow>
        <FormRow label="URL" desc="외부에서 접속 가능한 서비스 URL을 입력하세요.">
          <FInput value={form.url} onChange={e => sf("url", e.target.value)} placeholder="https://" style={fInput} />
        </FormRow>

        <div style={{ borderTop: `1px solid ${C.brd}`, margin: "20px 0" }} />
        <SecTitle label="운영 설정" />
        <FormRow label="추가인증 사용여부" desc="로그인 시 OTP 등 추가인증을 적용합니다.">
          <Radio value={form.mfaEnabled} onChange={v => sf("mfaEnabled", v)} />
        </FormRow>

        <div style={{ borderTop: `1px solid ${C.brd}`, margin: "20px 0" }} />
        <SecTitle label="로고 설정" />
        <FormRow label="로고 이미지">
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:120, height:48, border:`2px dashed ${C.brd}`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:"#F9FAFC", flexShrink:0 }}>
              <span style={{ fontSize:12, color:C.txL }}>미리보기</span>
            </div>
            <div>
              <label style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"6px 14px", border:`1px solid ${C.brd}`, borderRadius:5, fontSize:12, color:C.txS, cursor:"pointer", background:"#fff" }}>
                📎 파일 선택
                <FInput type="file" accept="image/*" style={{ display:"none" }} />
              </label>
              <div style={{ fontSize:12, color:C.txL, marginTop:4 }}>PNG, JPG, SVG (최대 2MB)</div>
            </div>
          </div>
        </FormRow>
        <FormRow label="로고 이미지 대체텍스트" desc="이미지 로딩 실패 시 표시되는 텍스트입니다.">
          <FInput value={form.logoAlt} onChange={e => sf("logoAlt", e.target.value)} placeholder="로고 alt 텍스트" style={fInput} />
        </FormRow>

        {saveOk && (
            <div style={{ padding:"10px 14px", borderRadius:8, background:"#f0fdf4", border:"1px solid #bbf7d0", fontSize:12, color:"#16a34a", marginBottom:12 }}>
            ✓ 설정이 저장되었습니다.
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:12, borderTop:`1px solid ${C.brd}` }}>
          <Btn primary onClick={handleSave}>저장</Btn>
        </div>
      </div>

      {/* 오른쪽: 현재 설정 요약 */}
      <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, padding: "22px 22px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.txt, marginBottom: 16 }}>현재 설정 요약</div>
        {[
          ["기관명", form.orgName],
          ["전화번호", form.phone],
          ["사이트 명", form.siteName],
          ["약칭", form.siteShort],
          ["URL", form.url],
          ["추가인증", form.mfaEnabled === "Y" ? "사용" : "미사용"],
          ["로고 alt", form.logoAlt],
        ].map(([k, v]) => (
            <div key={k} style={{ display:"flex", gap:8, marginBottom:8, fontSize:12 }}>
            <span style={{ color:C.txS, minWidth:70, flexShrink:0 }}>{k}</span>
            <span style={{ color:C.txt, wordBreak:"break-all" }}>{v || "—"}</span>
          </div>
        ))}
      </div>

    </div>
  </div>;
};

/* ── 시스템정보 ── */
const SYS_INFO = [
  { k: "java.vendor", v: "Oracle Corporation" },
  { k: "com.sun.xml.rpc.streaming.XMLReaderFactory", v: "jeus.webservices.jaxrpc.streaming.XMLReaderFactoryImpl" },
  { k: "sun.java.launcher", v: "SUN_STANDARD" },
  { k: "sun.management.compiler", v: "HotSpot 64-Bit Tiered Compilers" },
  { k: "os.name", v: "Windows Server 2019" },
  { k: "sun.boot.class.path", v: "C:\\TmaxSoft\\JEUS8\\lib\\system\\extension.jar;C:\\TmaxSoft\\JEUS8\\lib\\endorsed\\activation-1.1.1.jar;..." },
  { k: "java.util.logging.config.file", v: "C:\\TmaxSoft\\JEUS8\\bin\\logging.properties" },
  { k: "sun.desktop", v: "windows" },
  { k: "java.vm.specification.vendor", v: "Oracle Corporation" },
  { k: "java.runtime.version", v: "1.8.0_291-b10" },
  { k: "com.sun.xml.ws.tx.txnMgrJndiName", v: "java:wsit/TransactionManager" },
  { k: "user.name", v: "AYF-WAS$" },
  { k: "org.apache.jasper.Constants.TAG_FILE_PACKAGE_NAME", v: "jeus_tagwork" },
  { k: "user.language", v: "ko" },
  { k: "java.vm.name", v: "Java HotSpot(TM) 64-Bit Server VM" },
  { k: "java.version", v: "1.8.0_291" },
  { k: "sun.os.patch.level", v: "" },
  { k: "java.vm.vendor", v: "Oracle Corporation" },
  { k: "file.encoding", v: "MS949" },
  { k: "java.specification.version", v: "1.8" },
  { k: "os.arch", v: "amd64" },
  { k: "os.version", v: "10.0" },
  { k: "user.dir", v: "C:\\TmaxSoft\\JEUS8" },
  { k: "java.home", v: "C:\\TmaxSoft\\JDK\\jdk1.8\\jre" },
  { k: "java.class.version", v: "52.0" },
];
const MgrSysInfo = () => {
  const [q, setQ] = useState("");
  const filtered = SYS_INFO.filter(r => !q || r.k.toLowerCase().includes(q.toLowerCase()) || r.v.toLowerCase().includes(q.toLowerCase()));
  return <div>
    <PH title="시스템정보" bc="홈 > 환경설정 > 시스템정보" />
    <Tbl secTitle="시스템 속성 정보" secCount={filtered.length} cols={[
      { t: "KEY", k: "k", align: "left" },
      { t: "VALUE", k: "v", align: "left" },
    ]} data={filtered} pageSize={25} noPaging />
  </div>;
};

const MgrLicense = () => {

  /* ── 라이선스 코드 → 플랜 매핑 (실제 서버에서 검증) ── */
  const CODE_MAP = {
    "CS-BASIC-2026-AABB": { planId: "PLAN_BASIC", planNm: "Basic",    type: "Basic",    startDt: "2026-03-01", endDt: "2026-12-31", cycle: "연간", autoRenew: false },
    "CS-STD-2026-CCDD":   { planId: "PLAN_STD",   planNm: "Standard", type: "Standard", startDt: "2026-03-01", endDt: "2027-02-28", cycle: "연간", autoRenew: true  },
    "CS-PREM-2026-EEFF":  { planId: "PLAN_PREM",  planNm: "Premium",  type: "Premium",  startDt: "2026-03-01", endDt: "2027-02-28", cycle: "연간", autoRenew: true  },
  };

  const PLAN_FEATURES = {
    "PLAN_BASIC": ["정보시스템 최대 3개", "자원 최대 30개", "일상점검", "공지사항", "기본 대시보드"],
    "PLAN_STD":   ["정보시스템 최대 10개", "자원 최대 100개", "일상점검 + 특별점검", "자동점검 연동", "알림 설정", "점검 이력"],
    "PLAN_PREM":  ["정보시스템 무제한", "자원 무제한", "전체 기능 포함", "API 연동", "전담 기술지원", "SLA 보장"],
  };

  const TODAY = "2026-02-24";

  /* ── 초기 라이선스 목록 ── */
  const INIT_LICENSES = [
    { id: "LIC001", code: "CS-STD-2025-XXXX", planId: "PLAN_STD",   planNm: "Standard", type: "Standard", startDt: "2025-03-01", endDt: "2026-02-28", cycle: "연간", autoRenew: true,  status: "만료 예정", regDt: "2025-03-01" },
    { id: "LIC002", code: "CS-BASIC-2024-YYYY",planId: "PLAN_BASIC", planNm: "Basic",    type: "Basic",    startDt: "2024-03-01", endDt: "2025-02-28", cycle: "연간", autoRenew: false, status: "만료",    regDt: "2024-03-01" },
  ];

  const [licenses,    setLicenses]   = useState(INIT_LICENSES);
  const [panel,       setPanel]      = useState(null);   // null | "add" | "detail"
  const [selLic,      setSelLic]     = useState(null);   // 선택된 라이선스
  const [codeInput,   setCodeInput]  = useState("");     // 라이선스 코드 입력
  const [codeError,   setCodeError]  = useState("");
  const [codePreview, setCodePreview]= useState(null);   // 코드 검증 결과 미리보기
  const [confirmMsg,  setConfirmMsg] = useState(null);
  const [toast,       setToast]      = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  /* ── 만료 30일 이내 ── */
  const isExpiringSoon = (endDt) => {
    const diff = (new Date(endDt) - new Date(TODAY)) / 86400000;
    return diff >= 0 && diff <= 30;
  };

  /* ── 상태 계산 ── */
  const calcStatus = (lic) => {
    if (lic.status === "해지") return "해지";
    if (new Date(lic.endDt) < new Date(TODAY)) return "만료";
    if (isExpiringSoon(lic.endDt)) return "만료 예정";
    return "구독중";
  };

  /* ── 플랜 타입 색 ── */
  const PLAN_COLOR = {
    Basic:    { pri: "#6366f1", light: "#eef2ff" },
    Standard: { pri: C.pri,    light: C.priL      },
    Premium:  { pri: "#0f766e", light: "#f0fdfa"  },
  };

  /* ── 상태 배지 ── */


  /* ── 라이선스 코드 검증 ── */
  const handleCodeCheck = () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) { setCodeError("라이선스 코드를 입력하세요."); setCodePreview(null); return; }
    /* 이미 등록된 코드인지 확인 */
    if (licenses.some(l => l.code.toUpperCase() === code)) {
      setCodeError("이미 등록된 라이선스 코드입니다."); setCodePreview(null); return;
    }
    const found = CODE_MAP[code];
    if (!found) { setCodeError("유효하지 않은 라이선스 코드입니다."); setCodePreview(null); return; }
    setCodeError("");
    setCodePreview({ ...found, code });
  };

  /* ── 라이선스 추가 확정 ── */
  const handleAddLicense = () => {
    if (!codePreview) return;
    const newLic = {
      id: "LIC" + String(licenses.length + 1).padStart(3, "0"),
      ...codePreview,
      status: "구독중",
      regDt: TODAY,
    };
    setLicenses(p => [newLic, ...p]);
    setPanel(null);
    setCodeInput(""); setCodePreview(null); setCodeError("");
    showToast("라이선스가 등록되었습니다.");
  };

  /* ── 자동갱신 변경 ── */
  const handleToggleAutoRenew = (id, val) => {
    setLicenses(p => p.map(l => l.id === id ? { ...l, autoRenew: val } : l));
    showToast("자동 갱신 설정이 변경되었습니다.");
  };

  /* ── 해지 ── */
  const handleCancel = (id) => {
    setConfirmMsg({
      title: "라이선스 해지",
      msg: "라이선스를 해지하면 만료일까지 사용 가능하며 이후 서비스가 중단됩니다. 해지하시겠습니까?",
      onOk: () => {
        setLicenses(p => p.map(l => l.id === id ? { ...l, status: "해지", autoRenew: false } : l));
        setSelLic(prev => prev?.id === id ? { ...prev, status: "해지", autoRenew: false } : prev);
        setConfirmMsg(null);
        showToast("라이선스가 해지되었습니다.");
      },
    });
  };

  /* ── 행 클릭 → 상세 패널 ── */
  const openDetail = (lic) => {
    setSelLic(lic);
    setPanel("detail");
  };

  /* ── 추가 패널 오픈 ── */
  const openAdd = () => {
    setCodeInput(""); setCodePreview(null); setCodeError("");
    setPanel("add");
  };



  /* ── 상세 패널용 현재 라이선스 최신 상태 ── */
  const liveLic = selLic ? (licenses.find(l => l.id === selLic.id) || selLic) : null;
  const liveStatus = liveLic ? calcStatus(liveLic) : "";
  const col = liveLic ? (PLAN_COLOR[liveLic.type] || PLAN_COLOR.Standard) : {};
  const features = liveLic ? (PLAN_FEATURES[liveLic.planId] || []) : [];

  return (
    <div>
      <PH title="라이선스" bc="홈 > 라이선스 > 라이선스" />

      <div>
        <div>

          <Tbl
            secTitle="라이선스 목록"
            secCount={licenses.length}
            secButtons={<SecBtnP onClick={openAdd}>+ 라이선스 추가</SecBtnP>}
            data={licenses}
            onRow={lic=>openDetail(lic)}
            cols={[
              { t:"상태",        k:"id",       w:100, r:(_,lic)=><Badge status={calcStatus(lic)}/> },
              { t:"라이선스 코드", k:"code",   mw:200, align:"left",
                r:(v)=><span style={{fontFamily:"inherit",color:C.txt,fontWeight:600}}>{v}</span> },
              { t:"플랜",        k:"type",     w:110,
                r:(v,lic)=>{ const col=PLAN_COLOR[v]||PLAN_COLOR.Standard;
                  return <span style={{padding:"2px 9px",borderRadius:5,fontSize:12,fontWeight:700,background:col.light,color:col.pri}}>{lic.planNm}</span>;} },
              { t:"결제 주기",   k:"cycle",    w:90 },
              { t:"구독 시작일", k:"startDt",  w:110 },
              { t:"만료일",      k:"endDt",    w:110 },
              { t:"자동갱신",    k:"autoRenew", w:80,
                r:(v)=><span style={{color:v?"#16a34a":C.txL}}>{v?"사용":"미사용"}</span> },
              { t:"등록일",      k:"regDt",    w:100 },
            ]}
          />
        </div>
      </div>
      {/* ══════════════════════════════════════
          사이드 패널: 라이선스 추가
      ══════════════════════════════════════ */}
      <SidePanel open={panel === "add"} onClose={() => setPanel(null)} title="라이선스 추가" width={500} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <SecTitle label="라이선스 코드 입력" primary />
        <div style={{ fontSize: 12, color: C.txS, marginBottom: 16, lineHeight: 1.7 }}>
          발급받은 라이선스 코드를 입력하고 [코드 확인] 버튼을 클릭하세요.<br />
          코드 확인 후 라이선스 정보를 검토하고 등록을 진행할 수 있습니다.
        </div>

        <FormRow label="라이선스 코드" required>
          <div style={{ display: "flex", gap: 8 }}>
            <FInput
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(""); setCodePreview(null); }}
              placeholder="예) CS-STD-2026-CCDD"
              style={{ ...fInput, flex: 1, fontFamily:"inherit", letterSpacing: "0.03em" }}
              onKeyDown={e => e.key === "Enter" && handleCodeCheck()}
            />
            <Btn sm primary onClick={handleCodeCheck} style={{ whiteSpace:"nowrap", flexShrink:0 }}>코드 확인</Btn>
          </div>
          {codeError && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{codeError}</div>}
        </FormRow>

        {/* 코드 검증 성공 → 미리보기 */}
        {codePreview && (() => {
          const preCol = PLAN_COLOR[codePreview.type] || PLAN_COLOR.Standard;
          const preFeatures = PLAN_FEATURES[codePreview.planId] || [];
          return (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span>✓</span> 유효한 라이선스 코드입니다.
              </div>

              {/* 플랜 정보 카드 */}
              <div style={{ border: `2px solid ${preCol.pri}`, borderRadius: 10, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ padding: "14px 18px", background: preCol.light, borderBottom: `1px solid ${preCol.pri}33` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: C.txt }}>{codePreview.planNm} 플랜</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: preCol.pri, background: "#fff", padding: "2px 8px", borderRadius: 5 }}>{codePreview.type}</span>
                  </div>
                  <div style={{ color: C.txS, fontFamily:"inherit" }}>{codePreview.code}</div>
                </div>
                <div style={{ padding: "14px 18px" }}>
                  {[
                    ["구독 시작일", codePreview.startDt],
                    ["만료일",      codePreview.endDt],
                    ["결제 주기",   codePreview.cycle],
                    ["자동 갱신",   codePreview.autoRenew ? "사용" : "미사용"],
                  ].map(([label, val], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f3f4f6", fontSize: 12 }}>
                      <span style={{ color: C.txS }}>{label}</span>
                      <span style={{ color: C.txt, fontWeight: 500 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    {preFeatures.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.txS, marginBottom: 5 }}>
                        <span style={{ color: preCol.pri }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={() => setPanel(null)}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={handleAddLicense}>라이선스 등록</Btn>
        </div>
      </div>
      </SidePanel>

      {/* ══════════════════════════════════════
          사이드 패널: 라이선스 상세 / 관리
      ══════════════════════════════════════ */}
      <SidePanel open={panel === "detail" && !!liveLic} onClose={() => setPanel(null)}
        title="라이선스 상세" width={500} noScroll>
        {/* 바디 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {liveLic && (() => {
          const isActive = liveStatus === "구독중" || liveStatus === "만료 예정";
          return (
            <>
              {/* 플랜 헤더 */}
              <div style={{ padding: "16px 18px", background: col.light, borderRadius: 10, marginBottom: 20, border: `1px solid ${col.pri}33` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: col.pri, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{liveLic.type}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.txt }}>{liveLic.planNm} 플랜</div>
                  </div>
                  <Badge status={liveStatus} />
                </div>
                <div style={{ color: C.txS, fontFamily:"inherit", marginBottom: 10 }}>{liveLic.code}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 0", fontSize: 12 }}>
                  {[
                    ["구독 시작일", liveLic.startDt],
                    ["만료일",     liveLic.endDt + (liveStatus === "만료 예정" ? "  ⚠" : "")],
                    ["결제 주기",  liveLic.cycle],
                    ["등록일",     liveLic.regDt],
                  ].map(([label, val], i) => (
                    <div key={i} style={{ paddingRight: 12 }}>
                      <div style={{ color: C.txL, fontSize: 12, marginBottom: 1 }}>{label}</div>
                      <div style={{ color: C.txt, fontWeight: 500 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 이용 내역 */}
              <SecTitle label="이용 내역" primary />
              <div style={{ background: "#f8fafc", borderRadius: 8, border: `1px solid ${C.brd}`, overflow: "hidden", marginBottom: 20 }}>
                {features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < features.length - 1 ? `1px solid ${C.brd}` : "none", fontSize: 12 }}>
                    <span style={{ color: col.pri, fontSize: 12, flexShrink: 0 }}>✓</span>
                    <span style={{ color: C.txt }}>{f}</span>
                    <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, color: "#16a34a", background: "#dcfce7", padding: "1px 7px", borderRadius: 5 }}>이용 가능</span>
                  </div>
                ))}
              </div>

              {/* 관리 설정 — 구독중/만료예정만 */}
              {isActive && (
                <>
                  <SecTitle label="구독 설정" primary />
                  <FormRow label="자동 갱신">
                    <Radio options={[[true,"사용"],[false,"사용 안함"]]} value={liveLic.autoRenew} onChange={v => handleToggleAutoRenew(liveLic.id, v)} />
                    <div style={{ fontSize: 12, color: C.txS, marginTop: 4 }}>자동 갱신 시 만료 전 자동으로 결제됩니다.</div>
                  </FormRow>
                </>
              )}

            </>
          );
        })()}
        </div>{/* /바디 */}

        {/* 푸터 */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {(liveStatus === "구독중" || liveStatus === "만료 예정") && <Btn outlineDanger onClick={() => handleCancel(liveLic?.id)}>라이선스 해지</Btn>}
            <div style={{ flex: 1 }} />
            <Btn primary onClick={() => setPanel(null)}>확인</Btn>
          </div>
        </div>
      </SidePanel>

      {confirmMsg && (
        <ConfirmModal open={!!confirmMsg} title={confirmMsg?.title} msg={confirmMsg?.msg}
          onOk={confirmMsg.onOk} onCancel={() => setConfirmMsg(null)} />
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", background: "#333333", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 12, fontWeight: 500, zIndex: 2000, boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
};



/* ══════════════════════════════════════════════════
   현재 앱에서 실제 사용 중인 컴포넌트를 그룹별로 정리
══════════════════════════════════════════════════ */
const Page = ({ p, s, loginMsg, onSaveLoginMsg, nav, toast, currentUser, onNoticeBannerOn, onNoticeBannerOff }) => {
  if (s === "m") {
    const map = { md: <MgrDash nav={nav} />, mr: <MgrRes toast={toast} />, mis: <MgrInspSt />, mic: <MgrInspSch toast={toast} />, mid: <MgrInspD />, mip: <MgrInspSp toast={toast} />, mir: <MgrInspReport />, mbn: <MgrNotice onBannerOn={onNoticeBannerOn} onBannerOff={onNoticeBannerOff} />, mbl: <MgrLibrary />, msu: <MgrUsers />, mst: <MgrCL />, msv: <MgrVC />, msk: <MgrCategory />, msc: <MgrCode />, mslm: <MgrLoginMsg loginMsg={loginMsg} onSave={onSaveLoginMsg} />, msl: <MgrLicense />, mla: <MgrAccessLog />, mle: <MgrErrorLog />, msag: <MgrAgentAuth />, msi: <MgrSysInfo />, msp: <MgrSysProfile />, };
    if (map[p]) return map[p];
    const labels = { msp: "시스템 프로필", msi: "시스템정보", mla: "접속로그", mlr: "자원로그", mli: "점검로그", mlp: "권한변경로그", mle: "에러로그", mssc: "시스템코드", msag: "AGENT 권한관리", msapi: "API 관리" };
    if (labels[p]) return <Placeholder title={labels[p]} bc={`홈 > 환경설정 > ${labels[p]}`} />;
    return <MgrDash />;
  }
  const sMap = { sd: <StlDash />, sll: <StlDaily currentUser={currentUser} toast={toast} />, ssl: <StlSpecial toast={toast} />, sbn: <MgrNotice readOnly />, sbl: <MgrLibrary readOnly /> };
  if (sMap[p]) return sMap[p];
  const sLabels = { sep: "일반설정", sel: "라이선스", sei: "시스템정보" };
  if (sLabels[p]) return <Placeholder title={sLabels[p]} bc={`홈 > ${sLabels[p]}`} />;
  return <StlDash />;
};

/* ── Login ── */
const Login = ({ onLogin, loginMsg }) => {
  const SAVED_ID_KEY = "complysight_saved_id";
  const getSavedId  = () => { try { return sessionStorage.getItem(SAVED_ID_KEY) || ""; } catch { return ""; } };
  const savedInit   = () => { try { return !!sessionStorage.getItem(SAVED_ID_KEY); } catch { return false; } };

  const [uid,     setUid]    = useState(() => getSavedId() || "admin");
  const [pw,      setPw]     = useState("password");
  const [site,    setSite]   = useState("m");
  const [saveId,  setSaveId] = useState(() => savedInit());
  const [errMsg,  setErrMsg]  = useState("");
  const [locked,  setLocked]  = useState(false);
  const [pwReset, setPwReset] = useState({ open: false, step: "input", email: "", err: "", sending: false });
  const t  = { ...BASE, ...(THEME[site] || THEME.m) };
  const is = (err) => ({
    width: "100%", padding: "8px 12px",
    border: `1px solid ${err ? "#ef4444" : "#EEEEEE"}`,
    borderRadius: 4, fontSize: 15, outline: "none",
    boxSizing: "border-box", color: "#333", background: locked ? "#f9fafb" : "#fff",
    transition: "border-color .15s", minHeight: 36,
  });

  /* 아이디 저장 토글 */
  const toggleSaveId = () => {
    const next = !saveId; setSaveId(next);
    try { if (next) sessionStorage.setItem(SAVED_ID_KEY, uid); else sessionStorage.removeItem(SAVED_ID_KEY); } catch {}
  };

  /* 한글 입력 차단 */
  const handleUidChange = (e) => { setUid(e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "")); setErrMsg(""); };
  const handleUidKeyDown = (e) => { if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(e.key)) e.preventDefault(); };

  const handleLogin = () => {
    if (locked) return;
    const id = uid.trim();
    if (!id) { setErrMsg("아이디를 입력해 주세요."); return; }
    if (!pw)  { setErrMsg("비밀번호를 입력해 주세요."); return; }
    setErrMsg("");
    const user = USERS.find(u => u.userId === id);
    if (!user || user.useYn !== "Y") { setErrMsg("아이디 또는 비밀번호가 일치하지 않습니다."); return; }
    if (pw !== "password") { setErrMsg("비밀번호가 일치하지 않습니다."); return; }
    try { if (saveId) sessionStorage.setItem(SAVED_ID_KEY, id); else sessionStorage.removeItem(SAVED_ID_KEY); } catch {}
    onLogin(user, site);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  const handlePwResetSend = () => {
    const email = pwReset.email.trim();
    if (!email) { setPwReset(p => ({ ...p, err: "이메일을 입력해 주세요." })); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setPwReset(p => ({ ...p, err: "올바른 이메일 형식이 아닙니다." })); return; }
    setPwReset(p => ({ ...p, step: "done", err: "" }));
  };

  return (
    <div style={{ minHeight: "100vh", background: t.brandBg, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: PRETENDARD_FONT }}>
      <div style={{ width: 420, background: "#fff", borderRadius: 12, padding: "44px 40px", boxShadow: "0 24px 64px rgba(0,0,0,.25)" }}>

        {/* 로고 */}
        <div style={{ textAlign: "center", marginBottom: loginMsg ? 20 : 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: t.brand, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>C</span>
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
            <span style={{ color: t.brand }}>COMPLY</span><span style={{ color: "#111" }}>SIGHT</span>
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: "#929292" }}>정보시스템 자원 점검 관리 플랫폼</p>
        </div>

        {/* 잠금 배너 */}
        {locked && (
          <div style={{ marginBottom: 16, padding: "12px 14px", background: "#fef2f2", border: "1px solid #fca5a5",
            borderRadius: 6, fontSize: 12, color: "#b91c1c", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            계정이 잠겼습니다. 관리자에게 잠금 해제를 요청하세요.
          </div>
        )}

        {/* 아이디 */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#929292" }}>아이디</label>
            <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", userSelect: "none" }} onClick={toggleSaveId}>
              <div style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0,
                border: `1.5px solid ${saveId ? t.brand : "#CCCCCC"}`,
                background: saveId ? t.brand : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
                {saveId && <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><polyline points="1.5,5 4,7.5 8.5,2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{ fontSize: 12, color: saveId ? t.brand : "#929292", fontWeight: saveId ? 600 : 400 }}>아이디 저장</span>
            </label>
          </div>
          <FInput value={uid} onChange={handleUidChange} onKeyDown={(e) => { handleUidKeyDown(e); if (e.key === "Enter") handleLogin(); }}
            style={{ ...is(errMsg && !pw), marginBottom: 0 }} placeholder="아이디를 입력하세요" lang="en" autoComplete="username" disabled={locked} />
        </div>

        {/* 비밀번호 */}
        <div style={{ marginBottom: 6, marginTop: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#929292", display: "block", marginBottom: 5 }}>비밀번호</label>
          <FInput type="password" value={pw} onChange={e => { setPw(e.target.value); setErrMsg(""); }}
            onKeyDown={handleKeyDown} style={{ ...is(!!errMsg), marginBottom: 0 }}
            placeholder="비밀번호를 입력하세요" autoComplete="current-password" disabled={locked} />
        </div>

        {/* 오류 메시지 */}
        {errMsg && (
          <div style={{ marginBottom: 10, padding: "9px 12px", background: "#fef2f2", border: "1px solid #fca5a5",
            borderRadius: 6, fontSize: 12, color: "#b91c1c", display: "flex", gap: 6, marginLeft: "auto", flexShrink: 0, alignSelf: "stretch" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {errMsg}
          </div>
        )}

        {/* 사이트 선택 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, marginTop: errMsg ? 4 : 12 }}>
          {[["m", "Manager", "관리자 사이트"], ["s", "Sentinel", "점검자 사이트"]].map(([k, l, d]) => (
            <div key={k} onClick={() => !locked && setSite(k)}
              style={{ flex: 1, padding: "10px 8px", borderRadius: 6,
                border: `2px solid ${site === k ? t.brand : "#EEEEEE"}`,
                textAlign: "center", cursor: locked ? "default" : "pointer",
                background: site === k ? t.priL : "#fff", transition: "all .3s",
                opacity: locked ? 0.5 : 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: site === k ? t.brand : "#666" }}>{l}</div>
              <div style={{ fontSize: 12, color: "#929292", marginTop: 2 }}>{d}</div>
            </div>
          ))}
        </div>

        {/* 로그인 버튼 */}
        <button onClick={handleLogin} disabled={locked}
          style={{ width: "100%", padding: "13px", background: locked ? "#94a3b8" : t.brand,
            color: "#fff", border: "none", borderRadius: 4, fontSize: 15, fontWeight: 600,
            cursor: locked ? "not-allowed" : "pointer", transition: "all .3s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          onMouseEnter={e => { if (!locked) e.currentTarget.style.background = t.brandD; }}
          onMouseLeave={e => { if (!locked) e.currentTarget.style.background = t.brand; }}>
          로그인
        </button>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <span onClick={() => !locked && setPwReset({ open: true, step: "input", email: "", err: "", sending: false })}
            style={{ fontSize: 12, color: locked ? "#94a3b8" : t.brand, cursor: locked ? "default" : "pointer",
              textDecoration: locked ? "none" : "underline", textUnderlineOffset: 2 }}>
            비밀번호 재설정
          </span>
        </div>

        {/* 시스템 안내 메시지 */}
        {loginMsg && (
          <div style={{ marginTop: 20, padding: "12px 14px", background: t.priL, border: `1px solid ${t.pri}30`,
            borderRadius: 6, fontSize: 12, color: t.priD, lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12, color: t.pri }}>📢 시스템 안내</div>
            {loginMsg}
          </div>
        )}

      </div>

      {/* ── 비밀번호 재설정 모달 ── */}
      {pwReset.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => { if (e.target === e.currentTarget) setPwReset(p => ({ ...p, open: false })); }}>
          <div style={{ width: 400, background: "#fff", borderRadius: 14, padding: "36px 32px 32px",
            boxShadow: "0 24px 64px rgba(0,0,0,.28)", position: "relative" }}>
            <button onClick={() => setPwReset(p => ({ ...p, open: false }))}
              style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none",
                fontSize: 22, color: "#aaa", cursor: "pointer", lineHeight: 1 }}>×</button>

            {pwReset.step === "input" && <>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: t.priL,
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.brand} strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div style={{ textAlign: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 6 }}>비밀번호 재설정</div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.65 }}>
                  가입 시 등록한 이메일 주소를 입력하시면<br/>비밀번호 재설정 링크를 보내드립니다.
                </div>
              </div>
              <div style={{ marginTop: 22, marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#929292", display: "block", marginBottom: 6 }}>이메일 주소</label>
                <FInput autoFocus value={pwReset.email}
                  onChange={e => { const v = e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, ""); setPwReset(p => ({ ...p, email: v, err: "" })); }}
                  onKeyDown={e => { if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(e.key)) { e.preventDefault(); return; } if (e.key === "Enter") handlePwResetSend(); }}
                  placeholder="example@company.com" lang="en"
                  style={{ width: "100%", padding: "6px 12px",
                    border: `1px solid ${pwReset.err ? "#ef4444" : "#EEEEEE"}`,
                    borderRadius: 6, fontSize: 15, outline: "none", boxSizing: "border-box",
                    color: "#333", transition: "border-color .15s", minHeight: 36 }}
                  onFocus={e => e.target.style.borderColor = t.brand}
                  onBlur={e => { if (!pwReset.err) e.target.style.borderColor = "#EEEEEE"; }} />
                {pwReset.err && <div style={{ marginTop: 4, fontSize: 12, color: "#ef4444" }}>{pwReset.err}</div>}
              </div>
              <button onClick={handlePwResetSend} disabled={pwReset.sending}
                style={{ width: "100%", marginTop: 16, padding: "12px",
                  background: pwReset.sending ? "#94a3b8" : t.brand, color: "#fff",
                  border: "none", borderRadius: 6, fontSize: 15, fontWeight: 700,
                  cursor: pwReset.sending ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {pwReset.sending ? "발송 중..." : "재설정 링크 발송"}
              </button>
            </>}

            {pwReset.step === "done" && <>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#f0fdf4",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 10 }}>이메일을 확인하세요</div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.75 }}>
                  <span style={{ fontWeight: 600, color: "#111" }}>{pwReset.email}</span>으로<br/>
                  비밀번호 재설정 링크를 발송했습니다.<br/>
                  <span style={{ fontSize: 12, color: "#929292" }}>메일이 오지 않으면 스팸함을 확인해 주세요.</span>
                </div>
              </div>
              <button onClick={() => setPwReset(p => ({ ...p, open: false }))}
                style={{ width: "100%", padding: "12px", background: t.brand, color: "#fff",
                  border: "none", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                확인
              </button>
            </>}
          </div>
        </div>
      )}

      {/* 스피너 keyframe */}
      <style>{"@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}</style>
    </div>
  );
};

/* ── App ── */
const PRETENDARD_FONT = '"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';

export default function App() {
  /* Pretendard 폰트 로드 — body 전체 적용 */
  useEffect(() => {
    if (!document.getElementById("pretendard-cdn")) {
      const link = document.createElement("link");
      link.id = "pretendard-cdn";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css";
      document.head.appendChild(link);
    }
    document.body.style.fontFamily = PRETENDARD_FONT;
    document.body.style.margin = "0";
    return () => {};
  }, []);

  const [di, setDi] = useState(DI_INIT);
  const addDI    = useCallback((item) => setDi(prev => [item, ...prev]), []);
  const updateDI = useCallback((id, patch) => setDi(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x)), []);
  const [cl, setCl] = useState(CL_INIT);
  const addCL = useCallback((item) => setCl(prev => [item, ...prev]), []);
  const [auth, setAuth] = useState({ ok: false, user: null, site: null });
  const [pg, setPg] = useState("");
  const [col, setCol] = useState(false);
  const [gToast, setGToast] = useState(null);
  const toast = useCallback((msg, ok=true) => { setGToast({msg, ok}); setTimeout(() => setGToast(null), 2800); }, []);
  const [showPwChange, setShowPwChange] = useState(false);
  const [pwForm, setPwForm] = useState({cur:"",next:"",confirm:""});
  const [pwErr, setPwErr] = useState("");
  const [loginMsg, setLoginMsg] = useState("본 시스템은 COMPLYSIGHT 정보시스템 자원 점검 관리 플랫폼입니다.\n무단 접근은 금지되어 있으며, 모든 접속 이력은 기록됩니다.");
  const [noticeBanner, setNoticeBanner] = useState(null); // { id, title }
  const [bannerHiddenUntil, setBannerHiddenUntil] = useState(null); // Date 또는 null

  // 배너 노출 여부: hiddenUntil이 현재보다 미래면 숨김
  const bannerVisible = noticeBanner && !(bannerHiddenUntil && new Date() < bannerHiddenUntil);

  const handleBannerClose = (justClose) => {
    if (justClose) {
      setNoticeBanner(null);
    } else {
      // 오늘 하루 보이지 않음: 오늘 자정까지
      const tomorrow = new Date(); tomorrow.setHours(23, 59, 59, 999);
      setBannerHiddenUntil(tomorrow);
    }
  };

  // 공지배너 ON 등록 시 호출
  const handleNoticeBannerOn = (item) => {
    // 기존 배너 해제 후 새 배너 세팅
    NT = NT.map(n => n.id === item.id ? { ...n, banner: "Y" } : { ...n, banner: "N" });
    setNoticeBanner({ id: item.id, title: item.title });
    setBannerHiddenUntil(null);
  };
  const handleNoticeBannerOff = () => {
    setNoticeBanner(null);
  };

  const login = useCallback((user, site) => {
    if (user) {
      setTheme(site);
      setAuth({ ok: true, user, site });
      setPg(site === "m" ? "md" : "sd");
    }
  }, []);
  const logout = useCallback(() => {
    setTheme("s"); setAuth({ ok: false, user: null, site: null }); setPg("");
  }, []);
  const sw = useCallback(() => {
    const ns = auth.site === "m" ? "s" : "m";
    setTheme(ns); setAuth(p => ({ ...p, site: ns })); setPg(ns === "m" ? "md" : "sd");
  }, [auth.site]);

    if (!auth.ok) return <Login onLogin={login} loginMsg={loginMsg} />;

  const BANNER_H = bannerVisible ? 38 : 0;

  return (
    <CLContext.Provider value={{ cl, addCL }}>
    <DIContext.Provider value={{ di, addDI, updateDI }}>
    <style>{`
      input:focus, select:focus, textarea:focus { border-color: ${C.sec} !important; outline: none; }
    `}</style>
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: C.bg, fontFamily: PRETENDARD_FONT }}>

      {/* 공지배너 - fixed, 레이아웃 흐름 밖 */}
      {bannerVisible && (
        <NoticeBanner
          item={noticeBanner}
          onClose={handleBannerClose}
          onNav={() => { setPg(auth.site === "m" ? "mbn" : "sbn"); }}
        />
      )}
      <Hdr user={auth.user} site={auth.site} sw={sw} logout={logout} siteName={auth.site === "m" ? "Manager" : "Sentinel"} onPwChange={() => { setPwForm({cur:"",next:"",confirm:""}); setPwErr(""); setShowPwChange(true); }} bannerH={BANNER_H} />
      <div style={{ display: "flex", flex: 1, minHeight: 0, background: C.bg, paddingTop: 67 + BANNER_H }}>
        <Side menus={auth.site === "m" ? MM : SM} cur={pg} nav={setPg} site={auth.site} col={col} toggle={() => setCol(!col)} bannerH={BANNER_H} />
        {/* 메인 콘텐츠: 좌상단 radius 32px, 가이드 padding 38px 40px */}
        <main style={{ flex: 1, background: C.white, borderRadius: "20px 0 0 0", padding: "38px 40px 0 40px", overflowY: "auto", minWidth: 0, marginLeft: 30, scrollbarGutter: "stable" }}>
          <Page p={pg} s={auth.site} loginMsg={loginMsg} onSaveLoginMsg={setLoginMsg} nav={setPg} toast={toast} currentUser={auth.user} onNoticeBannerOn={handleNoticeBannerOn} onNoticeBannerOff={handleNoticeBannerOff} />
        </main>
      </div>
      {showPwChange && (
        <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,.35)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowPwChange(false)}>
          <div style={{background:"#fff",borderRadius:10,padding:28,width:400,animation:"modalIn .2s ease"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <span style={{fontSize:18,fontWeight:700,color:C.txH}}>비밀번호 변경</span>
              <button onClick={()=>setShowPwChange(false)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.txL}}>×</button>
            </div>
            {[["현재 비밀번호","cur"],["새 비밀번호","next"],["새 비밀번호 확인","confirm"]].map(([label,key])=>(
              <div key={key} style={{marginBottom:14}}>
                <div style={LABEL_STYLE}>{label} <span style={{color:C.red}}>*</span></div>
                <FInput type="password" value={pwForm[key]} onChange={e=>setPwForm(p=>({...p,[key]:e.target.value}))} placeholder={label}
                  style={{width:"100%",padding:"8px 12px",border:`1px solid ${C.brd}`,borderRadius:4,fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}} />
              </div>
            ))}
            {pwErr && <div style={{fontSize:12,color:C.red,marginBottom:8}}>{pwErr}</div>}
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,paddingTop:12,borderTop:`1px solid ${C.brd}`}}>
              <Btn onClick={()=>setShowPwChange(false)}>취소</Btn>
              <Btn primary onClick={()=>{
                if(!pwForm.cur){setPwErr("현재 비밀번호를 입력하세요.");return;}
                if(!pwForm.next||pwForm.next.length<8){setPwErr("새 비밀번호는 8자 이상이어야 합니다.");return;}
                if(pwForm.next!==pwForm.confirm){setPwErr("새 비밀번호가 일치하지 않습니다.");return;}
                setShowPwChange(false);toast("비밀번호가 변경되었습니다.");
              }}>변경</Btn>
            </div>
          </div>
        </div>
      )}
      {gToast && (
        <div style={{position:"fixed",bottom:32,left:"50%",transform:"translateX(-50%)",zIndex:99999,padding:"12px 28px",borderRadius:8,fontSize:15,fontWeight:600,color:"#fff",background:gToast.ok?"#16a34a":"#dc2626",boxShadow:"0 4px 20px rgba(0,0,0,.18)",display:"flex",alignItems:"center",gap:8,animation:"toastIn .3s ease"}}>
          <span style={{fontSize:18}}>{gToast.ok?"✓":"✕"}</span>{gToast.msg}
        </div>
      )}
      <style>{"@keyframes subFadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}} @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}} @keyframes slideInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}"}</style>
    </div>
    </DIContext.Provider>
    </CLContext.Provider>
  );
}
