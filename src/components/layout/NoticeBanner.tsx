import React from 'react';

interface NoticeItem {
  id: number;
  title: string;
}

interface NoticeBannerProps {
  item: NoticeItem | null;
  onClose: (justClose: boolean) => void;
  onNav: () => void;
}

export default function NoticeBanner({ item, onClose, onNav }: NoticeBannerProps) {
  if (!item) {
    return null;
  }

  const bg = '#F2F3F5';
  const txt = '#333333';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 300,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '9px 20px',
        animation: 'modalIn .15s ease',
        boxSizing: 'border-box',
      }}
    >
      <div onClick={onNav} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, cursor: 'pointer' }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 3,
            background: 'rgba(0,0,0,.08)',
            color: txt,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          시스템공지
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: txt,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.title}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 4,
            background: 'rgba(0,0,0,.1)',
            color: txt,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          자세히 보기 →
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, marginLeft: 12 }}>
        <span
          onClick={(event) => {
            event.stopPropagation();
            onClose(false);
          }}
          style={{ fontSize: 12, color: txt, opacity: 0.7, cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}
        >
          오늘 하루 보이지 않음
        </span>
        <span
          onClick={(event) => {
            event.stopPropagation();
            onClose(true);
          }}
          style={{ fontSize: 18, color: txt, opacity: 0.6, cursor: 'pointer', marginLeft: 0, flexShrink: 0, userSelect: 'none' }}
        >
          ×
        </span>
      </div>
    </div>
  );
}
