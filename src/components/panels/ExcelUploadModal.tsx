'use client';

import { useState } from 'react';
import { Btn } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface ExcelUploadModalProps {
  open: boolean;
  onClose: () => void;
}

export function ExcelUploadModal({ open, onClose }: ExcelUploadModalProps) {
  const [fileName, setFileName] = useState('');

  return (
    <Modal open={open} onClose={onClose} title="엑셀 일괄등록" width={520}>
      <div style={{ fontSize: 12, marginBottom: 10 }}>{fileName || '선택된 파일 없음'}</div>
      <input type="file" accept=".xlsx,.xls" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Btn onClick={onClose}>닫기</Btn>
      </div>
    </Modal>
  );
}
