'use client';

import { useState } from 'react';
import { Btn } from '@/components/ui/Button';
import { FormRow } from '@/components/ui/FormRow';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormField';

export interface AddSystemForm {
  systemNm: string;
  systemId: string;
  useYn: 'Y' | 'N';
  systemType: string;
  mgmtOrg: string;
  members: string[];
}

interface AddSystemModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (form: AddSystemForm) => void;
}

export function AddSystemModal({ open, onClose, onSubmit }: AddSystemModalProps) {
  const [form, setForm] = useState<AddSystemForm>({
    systemNm: '',
    systemId: `SYS${String(Date.now()).slice(-3)}`,
    useYn: 'Y',
    systemType: '',
    mgmtOrg: '',
    members: [],
  });

  return (
    <Modal open={open} onClose={onClose} title="정보시스템 추가" width={560}>
      <FormRow label="시스템명" required>
        <FormInput value={form.systemNm} onChange={(e) => setForm((p) => ({ ...p, systemNm: e.target.value }))} />
      </FormRow>
      <FormRow label="시스템 ID" required>
        <FormInput value={form.systemId} onChange={(e) => setForm((p) => ({ ...p, systemId: e.target.value }))} />
      </FormRow>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Btn onClick={onClose}>취소</Btn>
        <Btn primary onClick={() => onSubmit?.(form)}>등록</Btn>
      </div>
    </Modal>
  );
}
