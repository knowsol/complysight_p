import type { CSSProperties } from "react";

import { C } from "@/lib/theme/colors";

export const LABEL_STYLE: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: C.txS,
  marginBottom: 4,
  display: "flex",
  alignItems: "center",
  lineHeight: 1.4,
  minHeight: 18,
};

export const LABEL_STYLE_SM: CSSProperties = { ...LABEL_STYLE };

export const TH = (sx: CSSProperties = {}): CSSProperties => ({
  padding: "9px 12px",
  borderBottom: `1px solid ${C.brdD}`,
  fontSize: 14,
  color: C.txL,
  fontWeight: 400,
  verticalAlign: "middle",
  whiteSpace: "nowrap",
  textAlign: "center",
  ...sx,
});

export const TD = (sx: CSSProperties = {}): CSSProperties => ({
  padding: "11px 12px",
  borderBottom: `1px solid ${C.brd}`,
  fontSize: 14,
  color: C.txt,
  verticalAlign: "middle",
  whiteSpace: "nowrap",
  ...sx,
});

export const fInput: CSSProperties = {
  width: "100%",
  padding: "6px 12px",
  border: `1px solid ${C.brd}`,
  borderRadius: 4,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  color: C.txt,
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
  color: C.txS,
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
