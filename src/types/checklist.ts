import type { Yn } from "@/types/user";

export interface Checklist {
  id: number;
  nm: string;
  type: string;
  kind: string;
  sub: string;
  useYn: Yn;
  items: number;
  sch: number;
  registrant: string;
  regDt: string;
}

export interface ChecklistItem {
  id: number;
  code: string;
  nm: string;
  method: string;
  std: string;
  unit: string;
}
