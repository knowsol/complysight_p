'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import type { ReactNode } from 'react';

import { C } from '@/lib/theme/colors';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  width?: number;
  children?: ReactNode;
}

export function Modal({ open, onClose, title, width = 580, children }: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth PaperProps={{ sx: { width, maxWidth: '92vw' } }}>
      <DialogTitle sx={{ px: 3, py: 2.25, borderBottom: `1px solid ${C.brd}`, color: C.txH, fontSize: 18, fontWeight: 600 }}>
        {title}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: C.txL }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2.75 }}>{children}</DialogContent>
    </Dialog>
  );
}
