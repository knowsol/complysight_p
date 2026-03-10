export interface InspectionPhoto {
  id: number;
  label: string;
  color: string;
}

export interface DailyInspection extends Record<string, unknown> {
  id: number;
  sysNm: string;
  resNm: string;
  mid: string;
  clNm: string;
  kind: string;
  sub: string;
  freq: string;
  due: string;
  st: string;
  insp: string;
  execDt: string;
  summary: string;
  autoRes: string;
  eyeRes: string;
  submitDt: string;
  memo: string;
  hasFile: boolean;
  eyeItemPhotos: Record<string, InspectionPhoto[]>;
  recheck: "Y" | "N";
  normalCnt: number;
  abnCnt: number;
  note: string;
  rptType: string;
}

export type Inspection = DailyInspection;

export interface InspectionSchedule {
  id: number;
  sysNm: string;
  nm: string;
  clNm: string;
  freq: string;
  batchStartTime: string;
  batchMin: number;
  rptDdlnHr: number;
  useYn: "Y" | "N";
  resCnt: number;
  next: string;
}

export interface SpecialInspection extends Record<string, unknown> {
  id: number;
  sysNm: string;
  title: string;
  kind: string;
  due: string;
  st: string;
  reg: string;
  regUser: string;
  resources: string[];
  insp: string;
  planFile: boolean;
  purpose: string;
  content: string;
  execDt: string;
  submitDt: string;
  resultContent: string;
  resultFile: boolean;
  recheck: "Y" | "N";
}
