export const BASE = {
  white: "#fff",
  background: "#F9FAFC",
  backgroundSecondary: "#E9ECF3",
  backgroundDisabled: "#F7F7F7",
  border: "#EEEEEE",
  borderDark: "#D7D7D7",
  borderExtra: "#BBBBBB",
  textHeading: "#111111",
  text: "#333333",
  textSecondary: "#666666",
  textLight: "#929292",
  textMuted: "#BBBBBB",
  red: "#E24949",
  green: "#19973C",
  purple: "#9333EA",
} as const;

export const THEME = {
  m: {
    primary: "#339CD5",
    primaryLight: "#E6F3FA",
    primaryDark: "#2580AF",
    secondary: "#457CE1",
    secondaryLight: "#457CE11A",
    brand: "#005CB9",
    brandDark: "#004A94",
    brandGradient: "linear-gradient(135deg, #005cb9 0%, #339cd5 100%)",
    brandBackground: "linear-gradient(160deg, #003e82 0%, #005CB9 60%, #0a2a5e 100%)",
    accent: "#0C8CE9",
  },
  s: {
    primary: "#19973C",
    primaryLight: "#E8F5EC",
    primaryDark: "#147A30",
    secondary: "#19973C",
    secondaryLight: "#19973C1A",
    brand: "#15803D",
    brandDark: "#116632",
    brandGradient: "linear-gradient(135deg, #15803D 0%, #19973C 100%)",
    brandBackground: "linear-gradient(160deg, #0a4a20 0%, #15803D 60%, #0a3318 100%)",
    accent: "#19973C",
  },
} as const;

const SIDE_THEME = {
  m: { active: "#339CD51A", activeTxt: "#339CD5" },
  s: { active: "#19973C1A", activeTxt: "#19973C" },
} as const;

export type ThemeSite = keyof typeof THEME;
export type ThemePalette = typeof BASE & (typeof THEME)[ThemeSite];

export const COLORS = {
  BASE,
  THEME,
  sideTheme: SIDE_THEME,
} as const;

export const sideTheme = COLORS.sideTheme;

/** 풀네임 테마 색상 객체 — 모든 파일에서 사용 */
export let colors: ThemePalette = { ...BASE, ...THEME.m };

/** @deprecated colors 를 사용하세요. 호환용 alias */
export { colors as C };

/** CSS Custom Properties 키 매핑 */
const CSS_VAR_MAP: Record<string, string> = {
  white: "--color-white",
  background: "--color-background",
  backgroundSecondary: "--color-background-secondary",
  backgroundDisabled: "--color-background-disabled",
  border: "--color-border",
  borderDark: "--color-border-dark",
  borderExtra: "--color-border-extra",
  textHeading: "--color-text-heading",
  text: "--color-text",
  textSecondary: "--color-text-secondary",
  textLight: "--color-text-light",
  textMuted: "--color-text-muted",
  red: "--color-red",
  green: "--color-green",
  purple: "--color-purple",
  primary: "--color-primary",
  primaryLight: "--color-primary-light",
  primaryDark: "--color-primary-dark",
  secondary: "--color-secondary",
  secondaryLight: "--color-secondary-light",
  brand: "--color-brand",
  brandDark: "--color-brand-dark",
  brandGradient: "--color-brand-gradient",
  brandBackground: "--color-brand-background",
  accent: "--color-accent",
};

/** 테마 전환 — JS 객체 + CSS Custom Properties 동시 업데이트 */
export const setTheme = (site: ThemeSite): void => {
  const next = { ...BASE, ...(THEME[site] || THEME.m) };
  // 런타임 객체 업데이트 (기존 참조 유지를 위해 Object.assign)
  Object.assign(colors, next);
  // CSS Custom Properties 업데이트 (브라우저 환경에서만)
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    for (const [key, varName] of Object.entries(CSS_VAR_MAP)) {
      const value = (next as Record<string, string>)[key];
      if (value) root.style.setProperty(varName, value);
    }
  }
};
