import type { Yn } from "@/types/user";

export interface Schedule {
  id: number;
  sysNm: string;
  nm: string;
  clNm: string;
  freq: string;
  batchStartTime: string;
  batchMin: number;
  rptDdlnHr: number;
  useYn: Yn;
  resCnt: number;
  next: string;
}
