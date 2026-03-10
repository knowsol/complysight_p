import type { System } from "@/types/system";

export const SYS: System[] = [
  { id: "SYS001", nm: "고객관리시스템", type: "업무", org: "IT운영팀", useYn: "Y", mem: 8, res: 42, maintEndDate: "2027-12-31", ref1: "CRM-PRJ-001", ref2: "", ref3: "" },
  { id: "SYS002", nm: "인사관리시스템", type: "업무", org: "IT운영팀", useYn: "Y", mem: 5, res: 28, maintEndDate: "2026-12-31", ref1: "HR-PRJ-001", ref2: "", ref3: "" },
  { id: "SYS003", nm: "전자결재시스템", type: "서비스", org: "경영지원팀", useYn: "Y", mem: 6, res: 35, maintEndDate: "2027-06-30", ref1: "GW-PRJ-001", ref2: "GW-VND-001", ref3: "" },
  { id: "SYS004", nm: "재무회계시스템", type: "업무", org: "재무팀", useYn: "Y", mem: 4, res: 30, maintEndDate: "2026-09-30", ref1: "FIN-PRJ-001", ref2: "", ref3: "" },
  { id: "SYS005", nm: "물류관리시스템", type: "업무", org: "물류팀", useYn: "Y", mem: 5, res: 32, maintEndDate: "2027-03-31", ref1: "LOG-PRJ-001", ref2: "", ref3: "" },
  { id: "SYS006", nm: "홈페이지", type: "서비스", org: "홍보팀", useYn: "Y", mem: 3, res: 22, maintEndDate: "2026-12-31", ref1: "", ref2: "", ref3: "" },
  { id: "SYS007", nm: "메일시스템", type: "서비스", org: "IT운영팀", useYn: "Y", mem: 4, res: 25, maintEndDate: "2027-12-31", ref1: "MAIL-VND-001", ref2: "", ref3: "" },
  { id: "SYS008", nm: "보안관제시스템", type: "보안", org: "정보보안팀", useYn: "Y", mem: 6, res: 38, maintEndDate: "2028-06-30", ref1: "SEC-PRJ-001", ref2: "SEC-VND-001", ref3: "" },
  { id: "SYS009", nm: "빅데이터분석시스템", type: "분석", org: "데이터팀", useYn: "N", mem: 3, res: 20, maintEndDate: "2026-06-30", ref1: "BDA-PRJ-001", ref2: "", ref3: "" },
  { id: "SHARED", nm: "공유자원", type: "기타", org: "IT운영팀", useYn: "Y", mem: 4, res: 28, maintEndDate: "", ref1: "", ref2: "", ref3: "" },
];

export const _sysMap: Record<string, string> = {
  SYS001: "고객관리시스템",
  SYS002: "인사관리시스템",
  SYS003: "전자결재시스템",
  SYS004: "재무회계시스템",
  SYS005: "물류관리시스템",
  SYS006: "홈페이지",
  SYS007: "메일시스템",
  SYS008: "보안관제시스템",
  SYS009: "빅데이터분석시스템",
  SHARED: "공유자원",
};

export const _sIds = ["SYS001", "SYS002", "SYS003", "SYS004", "SYS005", "SYS006", "SYS007", "SYS008", "SYS009", "SHARED"];
export const _mids = ["서버", "WEB", "WAS", "DBMS", "네트워크", "보안", "스토리지", "백업", "서비스", "유효성"];

export const _smalls: Record<string, string[]> = {
  서버: ["Linux", "Windows", "AIX"],
  WEB: ["Apache", "Nginx", "IIS"],
  WAS: ["Tomcat", "WebLogic", "JEUS"],
  DBMS: ["MySQL", "PostgreSQL", "Oracle", "MariaDB"],
  네트워크: ["L2 Switch", "L3 Switch", "Router", "Firewall"],
  보안: ["WAF", "IPS", "IDS"],
  스토리지: ["NAS", "SAN"],
  백업: ["Backup Server", "Tape"],
  서비스: ["URL 모니터링", "API 모니터링", "포트 모니터링"],
  유효성: ["인증서", "라이선스", "계정"],
};

export const _oss = ["CentOS 7", "Ubuntu 22.04", "RHEL 8", "Windows Server 2022", "Rocky Linux 9", ""];
export const _pfx: Record<string, string> = { SYS001: "CRM", SYS002: "HR", SYS003: "GW", SYS004: "FIN", SYS005: "LOG", SYS006: "WEB", SYS007: "MAIL", SYS008: "SEC", SYS009: "BDA", SHARED: "SHR" };
export const _midCode: Record<string, string> = { 서버: "SVR", WEB: "WEB", WAS: "WAS", DBMS: "DB", 네트워크: "NET", 보안: "SEC", 스토리지: "STG", 백업: "BKP", 서비스: "SVC", 유효성: "VLD" };
