import type { CSSProperties, MouseEvent } from "react";

import { colors } from "@/lib/theme/colors";

export const LABEL_STYLE: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: colors.textSecondary,
  marginBottom: 4,
  display: "flex",
  alignItems: "center",
  lineHeight: 1.4,
  minHeight: 18,
};

export const LABEL_STYLE_SM: CSSProperties = { ...LABEL_STYLE };

export const TH = (sx: CSSProperties = {}): CSSProperties => ({
  padding: "9px 12px",
  borderBottom: `1px solid ${colors.borderDark}`,
  fontSize: 14,
  color: colors.textLight,
  fontWeight: 400,
  verticalAlign: "middle",
  whiteSpace: "nowrap",
  textAlign: "center",
  ...sx,
});

export const TD = (sx: CSSProperties = {}): CSSProperties => ({
  padding: "11px 12px",
  borderBottom: `1px solid ${colors.border}`,
  fontSize: 14,
  color: colors.text,
  verticalAlign: "middle",
  whiteSpace: "nowrap",
  ...sx,
});

export const fInput: CSSProperties = {
  width: "100%",
  padding: "6px 12px",
  border: `1px solid ${colors.border}`,
  borderRadius: 4,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  color: colors.text,
  fontFamily: "inherit",
  transition: "border-color .15s",
  minHeight: 36,
};

const chevron =
  'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWw0IDQgNC00IiBzdHJva2U9IiM5MjkyOTIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=")';

export const fSelect: CSSProperties = {
  ...fInput,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  backgroundImage: chevron,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 32,
  cursor: "pointer",
};

export const fTextarea: CSSProperties = {
  ...fInput,
  minHeight: 72,
  resize: "vertical",
  fontFamily: "inherit",
};

export const calNavBtn: CSSProperties = {
  width: 24,
  height: 24,
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  fontSize: 13,
  color: colors.textSecondary,
  fontFamily: "inherit",
  transition: "background .15s",
};

export const calDayBtn: CSSProperties = {
  width: "100%",
  aspectRatio: "1",
  background: "none",
  border: "none",
  cursor: "pointer",
  borderRadius: 4,
  fontSize: 13,
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background .15s",
};

export const PRETENDARD_FONT =
  '"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';

/* ────────────────────────────────────────
   공용 스타일 프리셋 — page.tsx 인라인 스타일 정리용
   ──────────────────────────────────────── */

/** 안내/가이드 박스 기본 스타일 */
export const infoBox = (bg = "#F0F5FF", borderColor = "#C7D9F8"): CSSProperties => ({
  display: "flex", alignItems: "center", gap: 16, padding: "9px 16px",
  background: bg, border: `1px solid ${borderColor}`, borderRadius: 8,
  flexWrap: "wrap",
});

/** 요약 숫자 카드 (3칸 flex 등에서 사용) */
export const summaryCard = (bg: string): CSSProperties => ({
  flex: 1, padding: "10px 14px", background: bg, borderRadius: 8, textAlign: "center",
});

/** 요약 카드 내부 큰 숫자 */
export const summaryValue = (color: string): CSSProperties => ({
  fontSize: 20, fontWeight: 700, color,
});

/** 요약 카드 내부 라벨 */
export const summaryLabel: CSSProperties = {
  fontSize: 12, color: colors.textSecondary, marginTop: 1,
};

/** 칩/태그 기본 스타일 */
export const chip = (bg: string, color: string): CSSProperties => ({
  padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 600,
  background: bg, color, display: "inline-block", whiteSpace: "nowrap",
});

/** 셀 내부 비율 배지 */
export const rateBadgeStyle = (color: string, bg: string): CSSProperties => ({
  fontSize: 15, fontWeight: 700, color, background: bg,
  padding: "3px 8px", borderRadius: 10, whiteSpace: "nowrap",
});

/** 패널 바디 영역 */
export const panelBody: CSSProperties = {
  flex: 1, overflowY: "auto", padding: "20px 24px",
};

/** 패널 푸터 영역 */
export const panelFooterBar: CSSProperties = {
  padding: "16px 24px", borderTop: `1px solid ${colors.border}`, flexShrink: 0,
};

/** 빈 상태 wrapper */
export const emptyState: CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  padding: 40, color: colors.textLight, gap: 8,
};

/** 섹션 타이틀 bar */
export const sectionBar: CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  height: 52, borderBottom: `1px solid ${colors.borderDark}`,
};

/** 에러 메시지 텍스트 */
export const errorText: CSSProperties = {
  fontSize: 12, color: "#ef4444", marginTop: 3,
};

/** 분류 필터 칩 (선택/비선택 상태) */
export const filterChip = (active: boolean, activeColor = colors.primary): CSSProperties => ({
  padding: "3px 8px", fontSize: 12,
  border: `1px solid ${active ? activeColor : colors.border}`,
  borderRadius: 5,
  background: active ? activeColor : "#fff",
  color: active ? "#fff" : colors.textSecondary,
  cursor: "pointer", fontWeight: active ? 600 : 400,
});

/** 주기 선택 칩 (SearchBar 내부) */
export const freqChip = (active: boolean, color: string): CSSProperties => ({
  padding: "5px 13px", borderRadius: 4, fontSize: 12,
  fontWeight: active ? 600 : 400,
  border: `1px solid ${active ? color : colors.border}`,
  background: active ? color + "1A" : "#fff",
  color: active ? color : colors.textSecondary,
  cursor: "pointer", transition: "all .12s", userSelect: "none",
  lineHeight: "22px",
});

/** 토스트 메시지 */
export const toastStyle = (ok: boolean): CSSProperties => ({
  position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
  zIndex: 99999, padding: "12px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600,
  color: "#fff", background: ok ? "#16a34a" : "#dc2626",
  boxShadow: "0 4px 20px rgba(0,0,0,.18)",
  display: "flex", alignItems: "center", gap: 8, animation: "toastIn .3s ease",
});

/* ────────────────────────────────────────
   Hover 헬퍼 — onMouseEnter/onMouseLeave 패턴 단순화
   ──────────────────────────────────────── */

/** 배경색 hover 헬퍼: { onMouseEnter, onMouseLeave } 반환 */
export const hoverBg = (normal: string, hover: string) => ({
  onMouseEnter: (e: MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.background = hover;
  },
  onMouseLeave: (e: MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.background = normal;
  },
});

/** 배경+보더+색상 hover 헬퍼 (버튼 등에 사용) */
export const hoverStyle = (
  normal: { bg: string; color: string; border: string },
  hover: { bg: string; color: string; border: string },
) => ({
  onMouseEnter: (e: MouseEvent<HTMLElement>) => {
    const s = (e.currentTarget as HTMLElement).style;
    s.background = hover.bg; s.color = hover.color; s.borderColor = hover.border;
  },
  onMouseLeave: (e: MouseEvent<HTMLElement>) => {
    const s = (e.currentTarget as HTMLElement).style;
    s.background = normal.bg; s.color = normal.color; s.borderColor = normal.border;
  },
});

export const STYLES = {
  LABEL_STYLE,
  LABEL_STYLE_SM,
  TH,
  TD,
  fInput,
  fSelect,
  fTextarea,
  chevron,
} as const;
