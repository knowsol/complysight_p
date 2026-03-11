'use client';

import { colors } from '@/lib/theme/colors';
import { Icon } from '@/components/ui/Icon';
import type { ReactNode } from 'react';

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  color?: string;
  icon: string;
  onClick?: () => void;
}

export function StatCard({ label, value, color, icon, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      style={{ background: colors.white, borderRadius: 8, border: `1px solid ${colors.border}`, padding: '20px 24px', flex: 1, minWidth: 140, cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow .2s' }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 8, fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: color || colors.textHeading }}>{value}</div>
        </div>
        <div style={{ width: 46, height: 46, borderRadius: 10, background: `${color || colors.primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={22} color={color || colors.primary} />
        </div>
      </div>
    </div>
  );
}
