'use client';

import { useState } from 'react';
import { Btn } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormField';
import { FormRow } from '@/components/ui/FormRow';
import { SidePanel } from '@/components/ui/SidePanel';
import type { VerificationCode } from '@/types/verification-code';

interface VCAddPanelProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (item: VerificationCode) => void;
}

export function VCAddPanel({ open, onClose, onSaved }: VCAddPanelProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  return (
    <SidePanel open={open} onClose={onClose} title="검증코드 추가" width={480} noScroll>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <FormRow label="코드" required>
          <FormInput value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        </FormRow>
        <FormRow label="검증코드명" required>
          <FormInput value={name} onChange={(e) => setName(e.target.value)} />
        </FormRow>
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Btn onClick={onClose}>취소</Btn>
          <Btn
            primary
            onClick={() => {
              if (!code || !name) {
                return;
              }
              onSaved?.({ id: code, nm: name, agent: 'PROMETHEUS', val: '', desc: '', useYn: 'Y' });
              onClose();
            }}
          >
            등록
          </Btn>
        </div>
      </div>
    </SidePanel>
  );
}
