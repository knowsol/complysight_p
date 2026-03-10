export interface CommonCodeGroup {
  id: string;
  nm: string;
  desc: string;
  cnt: number;
  useYn: "Y" | "N";
  regDt: string;
}

export interface CommonCode {
  id: string;
  grpId: string;
  cd: string;
  nm: string;
  desc: string;
  sort: number;
  useYn: "Y" | "N";
  regDt: string;
}

export interface Category {
  id: string;
  nm: string;
  children?: Category[];
}

export interface License {
  id: string;
  code: string;
  planId: string;
  planNm: string;
  type: string;
  startDt: string;
  endDt: string;
  cycle: string;
  autoRenew: boolean;
  status: string;
  regDt: string;
}

export interface SystemInfo {
  k: string;
  v: string;
}
