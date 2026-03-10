export interface Resource extends Record<string, unknown> {
  id: number;
  sysId: string;
  sysNm: string;
  nm: string;
  mid: string;
  small: string;
  st: string;
  ip: string;
  os: string;
  resourceId: string;
  inspectors: string[];
}

export interface ResourceGroup {
  id: string;
  nm: string;
  type: string;
  org: string;
  useYn: "Y" | "N";
  mem: number;
  res: number;
  maintEndDate: string;
  ref1: string;
  ref2: string;
  ref3: string;
}
