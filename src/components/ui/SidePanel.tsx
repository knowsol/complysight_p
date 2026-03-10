'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpLeftFromSquare, PanelLeftClose } from 'lucide-react';
import { C } from '@/lib/theme/colors';

export type ViewMode = 'panel' | 'modal';

export interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  onOverlayClick?: () => void;
  title?: React.ReactNode;
  width?: number;
  children?: React.ReactNode;
  noScroll?: boolean;
}

let _viewMode: ViewMode = 'panel';

export const getViewMode = (): ViewMode => _viewMode;
export const setViewMode = (m: ViewMode) => {
  _viewMode = m;
};

export const SidePanel = ({ open, onClose, onOverlayClick, title, width = 520, children, noScroll = false }: SidePanelProps) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mode, setMode] = useState<ViewMode>(getViewMode());

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
      setMode(getViewMode());
    } else if (visible && !closing) {
      setVisible(false);
    }
  }, [open]);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
      onClose();
    }, 220);
  };

  const handleOverlayClick = () => {
    if (onOverlayClick) {
      onOverlayClick();
    } else {
      handleClose();
    }
  };

  const toggleMode = () => {
    const next: ViewMode = mode === 'panel' ? 'modal' : 'panel';
    setMode(next);
    setViewMode(next);
  };

  if (!visible) return null;

  const modeIcon = mode === 'panel' ? <ArrowUpLeftFromSquare size={16} /> : <PanelLeftClose size={16} />;

  if (mode === 'modal') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div onClick={handleOverlayClick} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', animation: closing ? 'fadeOut .22s ease forwards' : 'fadeIn .2s ease' }} />
        <div style={{ position: 'relative', background: '#fff', borderRadius: 8, width, maxWidth: '92vw', maxHeight: '88vh', height: noScroll ? '88vh' : undefined, display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,.2)', animation: closing ? 'modalOut .22s ease forwards' : 'modalIn .2s ease', transition: 'width .25s ease' }}>
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${C.brd}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{title}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <div
                onClick={toggleMode}
                title="사이드 패널로 전환"
                style={{ width: 32, height: 32, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txL }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.bg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '';
                }}
              >
                {modeIcon}
              </div>
              <div
                onClick={handleOverlayClick}
                style={{ width: 32, height: 32, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txL, fontSize: 18 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.bg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '';
                }}
              >
                ✕
              </div>
            </div>
          </div>
          <div style={{ display: noScroll ? 'flex' : 'block', flexDirection: noScroll ? 'column' : undefined, padding: noScroll ? '0' : '22px 24px', overflowY: noScroll ? 'hidden' : 'auto', flex: 1, minHeight: 0 }}>{children}</div>
        </div>
        <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}} @keyframes modalOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(12px) scale(.97)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes fadeOut{from{opacity:1}to{opacity:0}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={handleOverlayClick} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.35)', animation: closing ? 'fadeOut .22s ease forwards' : 'fadeIn .2s ease' }} />
      <div style={{ position: 'relative', width, maxWidth: '94vw', height: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 30px rgba(0,0,0,.12)', animation: closing ? 'slideOut .22s ease forwards' : 'slideIn .25s ease' }}>
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${C.brd}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <div
              onClick={toggleMode}
              title="레이어 팝업으로 전환"
              style={{ width: 32, height: 32, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txL }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '';
              }}
            >
              {modeIcon}
            </div>
            <div
              onClick={handleOverlayClick}
              style={{ width: 32, height: 32, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txL, fontSize: 18 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F9FAFC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '';
              }}
            >
              ✕
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: noScroll ? 'flex' : 'block', flexDirection: noScroll ? 'column' : undefined, overflowY: noScroll ? 'hidden' : 'auto', padding: noScroll ? '0' : '20px 24px', minHeight: 0 }}>{children}</div>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}} @keyframes slideOut{from{transform:translateX(0)}to{transform:translateX(100%)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes fadeOut{from{opacity:1}to{opacity:0}}`}</style>
    </div>
  );
};
