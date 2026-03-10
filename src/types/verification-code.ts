import type { Yn } from "@/types/user";

export interface VerificationCode {
  id: string;
  nm: string;
  agent: string;
  val: string;
  desc: string;
  useYn: Yn;
}
