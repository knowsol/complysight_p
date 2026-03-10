export interface Report {
  id: number;
  inspType: "일상" | "특별";
  sysNm: string;
  resNm: string;
  title: string;
  inspector: string;
  freq: string;
  st: string;
  execDt: string;
  submitDt: string;
  autoRes: string;
  eyeRes: string;
  normalCnt: number;
  abnCnt: number;
  note: string;
  hasFile: boolean;
}
