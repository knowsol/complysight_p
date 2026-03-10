'use client';

import Chip from '@mui/material/Chip';

import { SC } from '@/lib/theme/status-colors';

export interface BadgeProps {
  status: string;
  label?: string;
}

export interface YnBadgeProps {
  v: string;
}

export interface RoleBadgeProps {
  v: string;
}

export const Badge = ({ status, label }: BadgeProps) => {
  const s = SC[status] || { b: 'rgba(140,147,157,0.12)', t: '#6B7280' };
  return (
    <Chip
      size="small"
      label={label || status}
      sx={{
        height: 22,
        borderRadius: 3,
        fontSize: 11,
        fontWeight: 500,
        bgcolor: s.b,
        color: s.t,
        '.MuiChip-label': { px: 1.25 },
      }}
    />
  );
};

export const YnBadge = ({ v }: YnBadgeProps) => {
  const isY = v === 'Y' || v === '사용';
  return (
    <Chip
      size="small"
      label={isY ? '사용' : '미사용'}
      sx={{
        height: 22,
        borderRadius: 3,
        fontSize: 11,
        fontWeight: 500,
        bgcolor: isY ? 'rgba(51,156,213,0.12)' : 'rgba(140,147,157,0.12)',
        color: isY ? '#339CD5' : '#6B7280',
        '.MuiChip-label': { px: 1.25 },
      }}
    />
  );
};

export const RoleBadge = ({ v }: RoleBadgeProps) => {
  const rc: Record<string, { b: string; t: string }> = {
    시스템관리자: { b: 'rgba(51,156,213,0.12)', t: '#339CD5' },
    기관관리자: { b: 'rgba(0,161,112,0.12)', t: '#00805A' },
    유지보수총괄: { b: 'rgba(243,109,0,0.12)', t: '#D15E00' },
    사용자: { b: 'rgba(140,147,157,0.12)', t: '#6B7280' },
  };
  const s = rc[v] || { b: 'rgba(140,147,157,0.12)', t: '#6B7280' };
  return (
    <Chip
      size="small"
      label={v}
      sx={{
        height: 22,
        borderRadius: 3,
        fontSize: 12,
        fontWeight: 500,
        bgcolor: s.b,
        color: s.t,
        '.MuiChip-label': { px: 1 },
      }}
    />
  );
};
