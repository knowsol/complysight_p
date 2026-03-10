export type Yn = "Y" | "N";
export type UserRole = "시스템관리자" | "기관관리자" | "유지보수총괄" | "사용자";

export interface UserGroup {
  id: string;
  nm: string;
  regDt: string;
}

export interface User extends Record<string, unknown> {
  userId: string;
  userNm: string;
  userRole: UserRole;
  isAdmin: Yn;
  adminAuth: string;
  sntlAuth: string;
  pwdErrCnt: number;
  pwdChgDt: string;
  joinDt: string;
  email: string;
  phone?: string;
  useYn: Yn;
  lastLoginDt?: string;
  groupId?: string;
}
