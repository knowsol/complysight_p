import type { Checklist, ChecklistItem } from "@/types/checklist";

export const mockChecklists: Checklist[] = [
  { id: 1, nm: "서버 상태점검표", type: "일상점검", kind: "상태점검", sub: "서버", useYn: "Y", items: 6, sch: 2, registrant: "관리자", regDt: "2026-01-10 09:00:00" },
  { id: 2, nm: "WEB 상태점검표", type: "일상점검", kind: "상태점검", sub: "WEB", useYn: "Y", items: 4, sch: 1, registrant: "관리자", regDt: "2026-01-10 09:30:00" },
  { id: 3, nm: "DBMS 상태점검표", type: "일상점검", kind: "상태점검", sub: "DBMS", useYn: "Y", items: 5, sch: 1, registrant: "관리자", regDt: "2026-01-11 10:00:00" },
  { id: 4, nm: "서비스 유효성 점검표", type: "일상점검", kind: "유효성점검", sub: "", useYn: "Y", items: 3, sch: 0, registrant: "관리자", regDt: "2026-01-15 10:00:00" },
];

export const mockChecklistItems: ChecklistItem[] = [
  { id: 1, code: "CHK-CPU-001", nm: "CPU 사용률", method: "자동", std: "< 80%", unit: "%" },
  { id: 2, code: "CHK-MEM-001", nm: "메모리 사용률", method: "자동", std: "< 85%", unit: "%" },
  { id: 3, code: "CHK-DISK-001", nm: "디스크 사용률", method: "자동", std: "< 90%", unit: "%" },
  { id: 4, code: "CHK-LOG-001", nm: "로그 에러 확인", method: "육안", std: "0건", unit: "건" },
];

export const CL_INIT = mockChecklists;
