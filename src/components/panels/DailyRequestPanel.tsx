'use client';

import { useState } from 'react';
import { Btn } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormField';
import { FormRow } from '@/components/ui/FormRow';
import { SidePanel } from '@/components/ui/SidePanel';

interface DailyRequestPanelProps {
  open: boolean;
  onClose: () => void;
}

export function DailyRequestPanel({ open, onClose }: DailyRequestPanelProps) {
  const [title, setTitle] = useState('');

  return (
    <SidePanel open={open} onClose={onClose} title="일상점검 요청" width={560} noScroll>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <FormRow label="요청명" required>
          <FormInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormRow>
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Btn onClick={onClose}>취소</Btn>
          <Btn primary onClick={onClose}>등록</Btn>
        </div>
      </div>
    </SidePanel>
  );
}
