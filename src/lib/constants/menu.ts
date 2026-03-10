import type { MenuItem } from "@/types/menu";

export const MENU_ITEMS: Record<"m" | "s", MenuItem[]> = {
  m: [
    { k: "d", l: "대시보드", i: "dash", routeKey: "md" },
    { k: "r", l: "자원관리", i: "db", routeKey: "mr" },
    {
      k: "i",
      l: "점검현황",
      i: "search",
      c: [
        { k: "is", l: "점검현황", routeKey: "mis" },
        { k: "ic", l: "점검스케줄", routeKey: "mic" },
        { k: "ip", l: "특별점검", routeKey: "mip" },
      ],
    },
    {
      k: "rp",
      l: "보고현황",
      i: "file",
      c: [
        { k: "ir", l: "점검보고서", routeKey: "mir" },
        { k: "id", l: "보고이력", routeKey: "mid" },
      ],
    },
    { k: "b", l: "게시판", i: "bell", routeKey: "mbn" },
    {
      k: "s",
      l: "환경설정",
      i: "gear",
      c: [
        {
          k: "sg1",
          l: "일반설정",
          group: true,
          c: [
            { k: "sp", l: "시스템 프로필", routeKey: "msp" },
            { k: "sc", l: "공통코드", routeKey: "msc" },
            { k: "sk", l: "카테고리 관리", routeKey: "msk" },
            { k: "slm", l: "로그인 안내메시지", routeKey: "mslm" },
          ],
        },
        {
          k: "sg2",
          l: "라이선스",
          group: true,
          c: [{ k: "sl", l: "라이선스", routeKey: "msl" }],
        },
        {
          k: "sg3",
          l: "사용자 관리",
          group: true,
          c: [{ k: "su", l: "사용자", routeKey: "msu" }],
        },
        {
          k: "sg4",
          l: "점검표",
          group: true,
          c: [
            { k: "st", l: "점검표", routeKey: "mst" },
            { k: "sv", l: "검증코드", routeKey: "msv" },
          ],
        },
        {
          k: "sg5",
          l: "로그정보",
          group: true,
          c: [
            { k: "la", l: "접속로그", routeKey: "mla" },
            { k: "le", l: "에러로그", routeKey: "mle" },
          ],
        },
        {
          k: "sg6",
          l: "보안 및 개발",
          group: true,
          c: [
            { k: "sag", l: "AGENT 권한관리", routeKey: "msag" },
            { k: "sapi", l: "API 관리", routeKey: "msapi" },
          ],
        },
        {
          k: "sg7",
          l: "시스템정보",
          group: true,
          c: [{ k: "si", l: "시스템정보", routeKey: "msi" }],
        },
      ],
    },
  ],
  s: [
    { k: "sd", l: "대시보드", i: "dash", routeKey: "sd" },
    { k: "sl", l: "일상점검", i: "check", routeKey: "sll" },
    { k: "ss", l: "특별점검", i: "alert", routeKey: "ssl" },
    { k: "sb", l: "게시판", i: "bell", routeKey: "sbn" },
  ],
};
