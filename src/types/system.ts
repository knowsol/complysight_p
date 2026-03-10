import type { Yn } from "@/types/user";

export interface System extends Record<string, unknown> {
  id: string;
  nm: string;
  type: string;
  org: string;
  useYn: Yn;
  mem: number;
  res: number;
  maintEndDate: string;
  ref1: string;
  ref2: string;
  ref3: string;
}
