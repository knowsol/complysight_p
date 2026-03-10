export const BASE = {
  white: "#fff",
  bg: "#F9FAFC",
  bgSec: "#E9ECF3",
  bgDis: "#F7F7F7",
  brd: "#EEEEEE",
  brdD: "#D7D7D7",
  brdX: "#BBBBBB",
  txH: "#111111",
  txt: "#333333",
  txS: "#666666",
  txL: "#929292",
  txX: "#BBBBBB",
  red: "#E24949",
  green: "#19973C",
  purp: "#9333EA",
} as const;

export const THEME = {
  m: {
    pri: "#339CD5",
    priL: "#E6F3FA",
    priD: "#2580AF",
    sec: "#457CE1",
    secL: "#457CE11A",
    brand: "#005CB9",
    brandD: "#004A94",
    brandG: "linear-gradient(135deg, #005cb9 0%, #339cd5 100%)",
    brandBg: "linear-gradient(160deg, #003e82 0%, #005CB9 60%, #0a2a5e 100%)",
    accent: "#0C8CE9",
  },
  s: {
    pri: "#19973C",
    priL: "#E8F5EC",
    priD: "#147A30",
    sec: "#19973C",
    secL: "#19973C1A",
    brand: "#15803D",
    brandD: "#116632",
    brandG: "linear-gradient(135deg, #15803D 0%, #19973C 100%)",
    brandBg: "linear-gradient(160deg, #0a4a20 0%, #15803D 60%, #0a3318 100%)",
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

export let C: ThemePalette = { ...BASE, ...THEME.m };

export const setTheme = (site: ThemeSite): void => {
  C = { ...BASE, ...(THEME[site] || THEME.m) };
};
