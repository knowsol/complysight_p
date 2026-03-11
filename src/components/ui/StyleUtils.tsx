// @ts-nocheck
'use client';

/**
 * StyleUtils — 공용 마이크로 UI 컴포넌트
 *
 * page.tsx에서 반복되는 인라인 스타일 패턴을 컴포넌트화한 모듈.
 * 기존 Badge 등과는 달리, 스타일 정리 목적의 래퍼 컴포넌트들.
 */

import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { colors } from '@/lib/theme/colors';
import { FREQ_COLORS, rateColor, rateBg } from '@/lib/theme/status-colors';

/* ────────────────────────────────────────
   FreqBadge — 점검 주기 배지
   사용처: report/view, inspection/schedule, SchedulePanel
   ──────────────────────────────────────── */
interface FreqBadgeProps {
  freq: string;
  style?: CSSProperties;
}

export const FreqBadge = ({ freq, style }: FreqBadgeProps) => {
  const color = FREQ_COLORS[freq] || "#F36D00";
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 600,
      background: color + "1A", color,
      ...style,
    }}>
      {freq}
    </span>
  );
};

/* ────────────────────────────────────────
   RateBadge — 비율 배지 (완료율, 보고율 등)
   사용처: report/view, dashboard
   ──────────────────────────────────────── */
interface RateBadgeProps {
  /** 표시할 비율 숫자 (0-100) */
  rate: number;
  /** 보고된 수 (선택) */
  reported?: number;
  /** 전체 수 (선택) */
  total?: number;
  /** true면 "80%" 형태, false/default면 "24/30" 형태 */
  percent?: boolean;
  style?: CSSProperties;
}

export const RateBadge = ({ rate, reported, total, percent, style }: RateBadgeProps) => {
  const color = rateColor(rate);
  const bg = rateBg(rate);
  if (percent) {
    return (
      <span style={{
        fontSize: 12, fontWeight: 700, color, background: bg,
        padding: "2px 7px", borderRadius: 10, whiteSpace: "nowrap",
        ...style,
      }}>
        {rate}%
      </span>
    );
  }
  return (
    <span style={{
      fontSize: 15, fontWeight: 700, color, background: bg,
      padding: "3px 8px", borderRadius: 10, whiteSpace: "nowrap",
      ...style,
    }}>
      {reported}<span style={{ fontWeight: 400, fontSize: 15, color: colors.textLight }}>/{total}</span>
    </span>
  );
};

/* ────────────────────────────────────────
   EmptyState — 빈 상태 표시
   사용처: agent-auth, common-code, resources 등
   ──────────────────────────────────────── */
interface EmptyStateProps {
  icon?: string;
  title?: string;
  desc?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export const EmptyState = ({ icon = "📭", title, desc, children, style }: EmptyStateProps) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: 40, color: colors.textLight, gap: 8,
    ...style,
  }}>
    {icon && <div style={{ fontSize: 36 }}>{icon}</div>}
    {title && <div style={{ fontSize: 15, fontWeight: 600, color: colors.textSecondary }}>{title}</div>}
    {desc && <div style={{ fontSize: 12 }}>{desc}</div>}
    {children}
  </div>
);

/* ────────────────────────────────────────
   InfoBox — 안내/가이드 박스
   사용처: report/view 테이블 가이드 등
   ──────────────────────────────────────── */
interface InfoBoxProps {
  items: { icon: string; text: string }[];
  bg?: string;
  borderColor?: string;
  textColor?: string;
  style?: CSSProperties;
}

export const InfoBox = ({ items, bg = "#F0F5FF", borderColor = "#C7D9F8", textColor = "#2D5BB9", style }: InfoBoxProps) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 16, padding: "9px 16px",
    background: bg, border: `1px solid ${borderColor}`, borderRadius: 8,
    flexWrap: "wrap",
    ...style,
  }}>
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" stroke={textColor} strokeWidth="1.4" />
      <path d="M8 7v5" stroke={textColor} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.8" fill={textColor} />
    </svg>
    {items.map(({ icon, text }, i, arr) => (
      <React.Fragment key={i}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 13 }}>{icon}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: textColor }}>{text}</span>
        </div>
        {i < arr.length - 1 && (
          <span style={{ width: 1, height: 14, background: borderColor, flexShrink: 0 }} />
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ────────────────────────────────────────
   SummaryCard — 요약 숫자 카드 (3칸 row 등)
   사용처: report/view 패널 요약, dashboard 보고현황 등
   ──────────────────────────────────────── */
interface SummaryCardProps {
  value: ReactNode;
  label: string;
  bg: string;
  valueColor: string;
  style?: CSSProperties;
}

export const SummaryCard = ({ value, label, bg, valueColor, style }: SummaryCardProps) => (
  <div style={{
    flex: 1, padding: "10px 14px", background: bg, borderRadius: 8, textAlign: "center",
    ...style,
  }}>
    <div style={{ fontSize: 20, fontWeight: 700, color: valueColor }}>{value}</div>
    <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>{label}</div>
  </div>
);

/* ────────────────────────────────────────
   Chip — 범용 칩/태그
   ──────────────────────────────────────── */
interface ChipProps {
  children: ReactNode;
  bg?: string;
  color?: string;
  style?: CSSProperties;
}

export const Chip = ({ children, bg = colors.primaryLight, color = colors.primary, style }: ChipProps) => (
  <span style={{
    padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 600,
    background: bg, color, display: "inline-block", whiteSpace: "nowrap",
    ...style,
  }}>
    {children}
  </span>
);

/* ────────────────────────────────────────
   Toast — 토스트 메시지
   사용처: report/view 다운로드 토스트 등
   ──────────────────────────────────────── */
interface ToastProps {
  msg: string;
  ok?: boolean;
}

export const Toast = ({ msg, ok = true }: ToastProps) => (
  <div style={{
    position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
    zIndex: 99999, padding: "12px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600,
    color: "#fff", background: ok ? "#16a34a" : "#dc2626",
    boxShadow: "0 4px 20px rgba(0,0,0,.18)",
    display: "flex", alignItems: "center", gap: 8, animation: "toastIn .3s ease",
  }}>
    <span>{ok ? "✓" : "✕"}</span>{msg}
  </div>
);

/* ────────────────────────────────────────
   LegendItem — 범례 아이템
   사용처: dashboard 차트 범례 등
   ──────────────────────────────────────── */
interface LegendItemProps {
  label: string;
  color: string;
  style?: CSSProperties;
}

export const LegendItem = ({ label, color, style }: LegendItemProps) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, ...style }}>
    <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: color }} />
    <span style={{ fontSize: 12, fontWeight: 600, color }}>{label}</span>
  </div>
);

/* ────────────────────────────────────────
   DotIndicator — 상태 점 표시 (timeline, 자원 목록)
   ──────────────────────────────────────── */
interface DotIndicatorProps {
  color: string;
  size?: number;
  style?: CSSProperties;
}

export const DotIndicator = ({ color, size = 8, style }: DotIndicatorProps) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", background: color, flexShrink: 0,
    ...style,
  }} />
);

/* ────────────────────────────────────────
   StatusInfoCard — 시스템 운영 현황 카드 (dashboard)
   ──────────────────────────────────────── */
interface StatusInfoCardProps {
  title: string;
  titleColor: string;
  bg: string;
  borderColor: string;
  children: ReactNode;
  style?: CSSProperties;
}

export const StatusInfoCard = ({ title, titleColor, bg, borderColor, children, style }: StatusInfoCardProps) => (
  <div style={{
    padding: 16, borderRadius: 8, background: bg, border: `1px solid ${borderColor}`,
    ...style,
  }}>
    <div style={{ fontSize: 12, color: titleColor, fontWeight: 600, marginBottom: 8 }}>{title}</div>
    {children}
  </div>
);

/* ────────────────────────────────────────
   KeyValueRow — 키-값 한 줄 (라이선스 현황 등)
   ──────────────────────────────────────── */
interface KeyValueRowProps {
  label: string;
  value: ReactNode;
  style?: CSSProperties;
}

export const KeyValueRow = ({ label, value, style }: KeyValueRowProps) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, ...style }}>
    <span style={{ fontSize: 12, color: colors.textSecondary }}>{label}</span>
    <span style={{ fontSize: 12, fontWeight: 600 }}>{value}</span>
  </div>
);

/* ────────────────────────────────────────
   ProgressBar — 프로그레스 바
   ──────────────────────────────────────── */
interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: number;
  style?: CSSProperties;
}

export const ProgressBar = ({ value, max, color, height = 6, style }: ProgressBarProps) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const barColor = color || (pct > 90 ? "#E24949" : pct > 70 ? "#f59e0b" : "#22c55e");
  return (
    <div style={{ height, borderRadius: height / 2, background: "#EEEEEE", overflow: "hidden", ...style }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: height / 2, background: barColor }} />
    </div>
  );
};
