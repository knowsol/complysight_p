import { mockInspections, mockSpecialInspections } from "@/data/inspections";
import type { Report } from "@/types/report";

const dailyReports: Report[] = mockInspections
  .filter((item) => item.st === "완료")
  .map((item) => ({
    id: item.id,
    inspType: "일상",
    sysNm: item.sysNm,
    resNm: item.resNm,
    title: item.clNm,
    inspector: item.insp,
    freq: item.freq,
    st: item.st,
    execDt: item.execDt,
    submitDt: item.submitDt,
    autoRes: item.autoRes,
    eyeRes: item.eyeRes,
    normalCnt: item.normalCnt,
    abnCnt: item.abnCnt,
    note: item.note,
    hasFile: item.hasFile,
  }));

const specialReports: Report[] = mockSpecialInspections
  .filter((item) => item.st === "완료")
  .map((item) => ({
    id: 1000 + item.id,
    inspType: "특별",
    sysNm: item.sysNm,
    resNm: item.title,
    title: item.kind,
    inspector: item.insp,
    freq: "특별",
    st: item.st,
    execDt: item.execDt,
    submitDt: item.submitDt,
    autoRes: "-",
    eyeRes: "-",
    normalCnt: 0,
    abnCnt: 0,
    note: item.resultContent,
    hasFile: item.resultFile,
  }));

export const mockReports: Report[] = [...dailyReports, ...specialReports];
