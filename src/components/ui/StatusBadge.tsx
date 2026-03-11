'use client';

import { SC } from '@/lib/theme/status-colors';

export interface StatusBadgeProps {
  status: string;
  label?: string;
}

export interface YnBadgeProps {
  value: string;
}

export interface RoleBadgeProps {
  value: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusColor = SC[status] || { b: 'rgba(140,147,157,0.12)', t: '#6B7280' };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 500,
        lineHeight: '18px',
        whiteSpace: 'nowrap',
        background: statusColor.b,
        color: statusColor.t,
      }}
    >
      {status}
    </span>
  );
}

export function YnBadge({ value }: YnBadgeProps) {
  const isY = value === 'Y' || value === '사용';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 500,
        lineHeight: '18px',
        background: isY ? 'rgba(51,156,213,0.12)' : 'rgba(140,147,157,0.12)',
        color: isY ? '#339CD5' : '#6B7280',
      }}
    >
      {isY ? '사용' : '미사용'}
    </span>
  );
}

export function RoleBadge({ value }: RoleBadgeProps) {
  const roleColorMap: Record<string, { b: string; t: string }> = {
    시스템관리자: { b: 'rgba(51,156,213,0.12)', t: '#339CD5' },
    기관관리자: { b: 'rgba(0,161,112,0.12)', t: '#00805A' },
    유지보수총괄: { b: 'rgba(243,109,0,0.12)', t: '#D15E00' },
    사용자: { b: 'rgba(140,147,157,0.12)', t: '#6B7280' },
  };
  const statusColor = roleColorMap[value] || { b: 'rgba(140,147,157,0.12)', t: '#6B7280' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: '18px',
        background: statusColor.b,
        color: statusColor.t,
      }}
    >
      {value}
    </span>
  );
}
