'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

import { C } from '@/lib/theme/colors';

export interface ConfirmModalProps {
  open: boolean;
  title: ReactNode;
  msg: ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  okLabel?: ReactNode;
  danger?: boolean;
}

export interface UnsavedConfirmProps {
  open: boolean;
  onDiscard?: () => void;
  onSave?: () => void;
}

export const ConfirmModal = ({ open, title, msg, onOk, onCancel, okLabel = '확인', danger = true }: ConfirmModalProps) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontSize: 18, fontWeight: 600, color: danger ? C.red : C.txH }}>{title}</DialogTitle>
    <DialogContent>
      <Typography sx={{ fontSize: 15, color: C.txS, lineHeight: 1.7 }}>{msg}</Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button variant="outlined" onClick={onCancel}>취소</Button>
      <Button variant="contained" color={danger ? 'error' : 'primary'} onClick={onOk}>
        {okLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export const UnsavedConfirm = ({ open, onDiscard, onSave }: UnsavedConfirmProps) => (
  <Dialog open={open} onClose={onDiscard} maxWidth="xs" fullWidth>
    <DialogContent sx={{ px: 3.5, py: 3.5, textAlign: 'center' }}>
      <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.75, fontSize: 22 }}>
        ⚠️
      </Box>
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1e293b', mb: 1 }}>수정 사항을 저장하겠습니까?</Typography>
      <Typography sx={{ fontSize: 13, color: '#64748b', mb: 2.75 }}>저장하지 않으면 변경 내용이 사라집니다.</Typography>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button variant="outlined" onClick={onDiscard}>저장 안함</Button>
        <Button variant="contained" onClick={onSave}>저장</Button>
      </Box>
    </DialogContent>
  </Dialog>
);
