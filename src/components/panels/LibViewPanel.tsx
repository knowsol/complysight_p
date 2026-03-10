'use client';

import { Button } from '@/components/ui/Button';
import { SidePanel } from '@/components/ui/SidePanel';
import type { Notice } from '@/types/notice';

interface LibViewPanelProps {
  open: boolean;
  onClose: () => void;
  item?: Notice | null;
}

export function LibViewPanel({ open, onClose, item }: LibViewPanelProps) {
  return (
    <SidePanel open={open} onClose={onClose} title="자료실 상세" width={560} noScroll>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontSize: 12, lineHeight: 1.7 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>{item?.title}</div>
        <div>{item?.content}</div>
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #eee' }}>
        <Button onClick={onClose}>닫기</Button>
      </div>
    </SidePanel>
  );
}
