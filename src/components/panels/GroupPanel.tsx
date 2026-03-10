'use client';

import { Btn } from '@/components/ui/Button';
import { SidePanel } from '@/components/ui/SidePanel';

interface GroupPanelProps {
  open: boolean;
  onClose: () => void;
}

export function GroupPanel({ open, onClose }: GroupPanelProps) {
  return (
    <SidePanel open={open} onClose={onClose} title="그룹 편집" width={480} noScroll>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontSize: 12 }}>코드 그룹 편집 패널</div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #eee' }}>
        <Btn onClick={onClose}>닫기</Btn>
      </div>
    </SidePanel>
  );
}
