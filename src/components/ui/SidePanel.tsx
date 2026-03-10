'use client';

import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { C } from '@/lib/theme/colors';

export type ViewMode = 'panel' | 'modal';

export interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  onOverlayClick?: () => void;
  title?: ReactNode;
  width?: number;
  children?: ReactNode;
  noScroll?: boolean;
}

let _viewMode: ViewMode = 'panel';

export const getViewMode = (): ViewMode => _viewMode;
export const setViewMode = (m: ViewMode) => {
  _viewMode = m;
};

export const SidePanel = ({ open, onClose, onOverlayClick, title, width = 520, children, noScroll = false }: SidePanelProps) => {
  const [mode, setMode] = useState<ViewMode>(getViewMode());

  useEffect(() => {
    if (open) {
      setMode(getViewMode());
    }
  }, [open]);

  const handleOverlayClose = () => {
    if (onOverlayClick) {
      onOverlayClick();
      return;
    }
    onClose();
  };

  const toggleMode = () => {
    const next: ViewMode = mode === 'panel' ? 'modal' : 'panel';
    setMode(next);
    setViewMode(next);
  };

  const actions = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      <IconButton onClick={toggleMode} title={mode === 'panel' ? '레이어 팝업으로 전환' : '사이드 패널로 전환'} sx={{ color: C.txL }}>
        {mode === 'panel' ? <OpenInNewRoundedIcon fontSize="small" /> : <ViewSidebarRoundedIcon fontSize="small" />}
      </IconButton>
      <IconButton onClick={handleOverlayClose} sx={{ color: C.txL }}>
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  const content = (
    <Box sx={{ display: noScroll ? 'flex' : 'block', flexDirection: noScroll ? 'column' : undefined, overflowY: noScroll ? 'hidden' : 'auto', flex: 1, minHeight: 0, p: noScroll ? 0 : '20px 24px' }}>
      {children}
    </Box>
  );

  if (mode === 'modal') {
    return (
      <Dialog open={open} onClose={handleOverlayClose} maxWidth={false} fullWidth PaperProps={{ sx: { width, maxWidth: '92vw', height: noScroll ? '88vh' : 'auto', maxHeight: '88vh' } }}>
        <DialogTitle sx={{ px: 3, py: 2.25, borderBottom: `1px solid ${C.brd}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box component="span" sx={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{title}</Box>
          {actions}
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', minHeight: 0 }}>{content}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleOverlayClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{ sx: { width, maxWidth: '94vw', height: '100vh' } }}
    >
      <Box sx={{ px: 3, py: 2.25, borderBottom: `1px solid ${C.brd}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Box component="span" sx={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{title}</Box>
        {actions}
      </Box>
      {content}
    </Drawer>
  );
};
