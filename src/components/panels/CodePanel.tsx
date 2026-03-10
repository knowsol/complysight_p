'use client';

import { Button } from '@/components/ui/Button';
import { SidePanel } from '@/components/ui/SidePanel';

interface CodePanelProps {
  open: boolean;
  onClose: () => void;
}

export function CodePanel({ open, onClose }: CodePanelProps) {
  return (
    <SidePanel open={open} onClose={onClose} title="코드 편집" width={480} noScroll>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontSize: 12 }}>공통코드 편집 패널</div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #eee' }}>
        <Button onClick={onClose}>닫기</Button>
      </div>
    </SidePanel>
  );
}
