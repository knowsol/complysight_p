'use client';

import { colors } from '@/lib/theme/colors';

export interface ToggleSwitchProps {
  on: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function ToggleSwitch({ on, onClick, disabled }: ToggleSwitchProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: on ? colors.secondary : colors.borderDark,
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
        transition: 'background .2s',
      }}
    >
      <div style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left .2s' }} />
    </div>
  );
}
