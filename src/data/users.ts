import type { User, UserGroup } from "@/types/user";

export const mockUserGroups: UserGroup[] = [
  { id: "GRP001", nm: "IT운영팀", regDt: "2026-01-05" },
  { id: "GRP002", nm: "재무팀", regDt: "2026-01-05" },
  { id: "GRP003", nm: "정보보안팀", regDt: "2026-01-10" },
  { id: "GRP004", nm: "경영지원팀", regDt: "2026-01-10" },
  { id: "GRP005", nm: "데이터팀", regDt: "2026-01-15" },
];

export const mockUsers: User[] = [
  { userId: "admin", userNm: "김시스템", userRole: "시스템관리자", isAdmin: "Y", adminAuth: "시스템관리자", sntlAuth: "전체", pwdErrCnt: 0, pwdChgDt: "2026-01-01 00:00", joinDt: "2025-01-10 09:00", email: "admin@cs.kr", phone: "010-1234-5678", useYn: "Y", lastLoginDt: "2026-02-10 09:00", groupId: "GRP001" },
  { userId: "orgadmin", userNm: "이기관", userRole: "기관관리자", isAdmin: "Y", adminAuth: "기관관리자", sntlAuth: "읽기", pwdErrCnt: 0, pwdChgDt: "2026-01-15 10:00", joinDt: "2025-01-15 10:00", email: "org@cs.kr", phone: "010-2345-6789", useYn: "Y", lastLoginDt: "2026-02-10 08:30", groupId: "GRP001" },
  { userId: "maintmgr", userNm: "박유지보수", userRole: "유지보수총괄", isAdmin: "N", adminAuth: "유지보수총괄", sntlAuth: "없음", pwdErrCnt: 0, pwdChgDt: "2026-01-20 11:00", joinDt: "2025-02-01 09:00", email: "maint@cs.kr", phone: "010-3456-7890", useYn: "Y", lastLoginDt: "2026-02-09 17:00", groupId: "GRP003" },
  { userId: "user01", userNm: "최점검", userRole: "사용자", isAdmin: "N", adminAuth: "사용자", sntlAuth: "없음", pwdErrCnt: 0, pwdChgDt: "2026-01-25 09:00", joinDt: "2025-03-01 09:00", email: "user01@cs.kr", phone: "010-4567-8901", useYn: "Y", lastLoginDt: "2026-02-10 08:00", groupId: "GRP002" },
  { userId: "user02", userNm: "정담당", userRole: "사용자", isAdmin: "N", adminAuth: "사용자", sntlAuth: "없음", pwdErrCnt: 2, pwdChgDt: "2025-12-01 09:00", joinDt: "2025-04-01 09:00", email: "user02@cs.kr", phone: "010-5678-9012", useYn: "Y", groupId: "GRP004" },
  { userId: "user03", userNm: "한미사용", userRole: "사용자", isAdmin: "N", adminAuth: "사용자", sntlAuth: "없음", pwdErrCnt: 5, pwdChgDt: "2025-11-01 09:00", joinDt: "2025-05-01 09:00", email: "user03@cs.kr", useYn: "N" },
];

export const INIT_USER_GROUPS = mockUserGroups;
export const USERS = mockUsers;
