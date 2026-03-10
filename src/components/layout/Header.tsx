'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Ic } from '@/components/ui/Icon';
import { C } from '@/lib/theme/colors';

interface HeaderUser {
  userNm: string;
  userRole: string;
}

interface HeaderProps {
  user: HeaderUser | null;
  site: 'm' | 's';
  siteName: string;
  onSiteSwitch: () => void;
  onLogout: () => void;
  onPwChange: () => void;
  bannerH?: number;
}

export default function Header({
  user,
  site,
  siteName,
  onSiteSwitch,
  onLogout,
  onPwChange,
  bannerH = 0,
}: HeaderProps) {
  const SESSION_SEC = 30 * 60;
  const [remain, setRemain] = useState(SESSION_SEC);
  const [expired, setExpired] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startTimer = (sec: number) => {
    setRemain(sec);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setRemain((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
          }
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer(SESSION_SEC);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const extendSession = () => {
    setExpired(false);
    startTimer(SESSION_SEC);
  };

  const handleExpiredOk = () => {
    setExpired(false);
    onLogout();
  };

  const mm = String(Math.floor(remain / 60)).padStart(2, '0');
  const ss = String(remain % 60).padStart(2, '0');
  const isWarning = remain <= 5 * 60;

  return (
    <>
      <div style={{ background: C.brand, position: 'fixed', top: bannerH, left: 0, width: '100%', zIndex: 200 }}>
        <div
          style={{
            height: 67,
            background: C.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px 0 20px',
            fontSize: 12,
            flexShrink: 0,
            borderRadius: '0 0 0 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: C.brandG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              C
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>
              <span style={{ color: C.brand }}>COMPLY</span>
              SIGHT
              <span
                onClick={user?.userRole !== '사용자' ? onSiteSwitch : undefined}
                style={{
                  paddingLeft: 12,
                  fontSize: 18,
                  fontWeight: 600,
                  color: C.brand,
                  cursor: user?.userRole !== '사용자' ? 'pointer' : 'default',
                  transition: 'opacity .2s',
                }}
                onMouseEnter={(event) => {
                  if (user?.userRole !== '사용자') {
                    event.currentTarget.style.opacity = '0.6';
                  }
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.opacity = '1';
                }}
                title={user?.userRole !== '사용자' ? (site === 'm' ? 'Sentinel로 전환' : 'Manager로 전환') : ''}
              >
                {siteName}
              </span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: C.txt, fontSize: 12 }}>고객행복센터</span>
            <div style={{ width: 1, height: 12, background: C.brdD }} />
            <span style={{ color: C.txt, fontSize: 12 }}>
              업무담당자 : <span style={{ fontWeight: 700 }}>{user?.userNm}</span>
              <span
                onClick={onPwChange}
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 4,
                  verticalAlign: 'middle',
                  opacity: 0.5,
                  transition: 'opacity .2s',
                }}
                title="비밀번호 변경"
                onMouseEnter={(event) => {
                  event.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.opacity = '0.5';
                }}
              >
                <Ic n="gear" s={13} c={C.txS} />
              </span>
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: isWarning ? '#FEF2F2' : '#edf0f6',
                borderRadius: 100,
                padding: '4px 10px',
                fontSize: 12,
                border: isWarning ? '1px solid #fca5a5' : '1px solid transparent',
                transition: 'all .3s',
              }}
            >
              <Ic n="clock" s={12} c={isWarning ? '#ef4444' : C.txS} />
              <span
                style={{
                  color: isWarning ? '#ef4444' : C.txS,
                  fontWeight: isWarning ? 700 : 400,
                  fontVariantNumeric: 'tabular-nums',
                  minWidth: 34,
                }}
              >
                {mm}:{ss}
              </span>
              <span
                onClick={extendSession}
                style={{
                  color: isWarning ? '#ef4444' : C.accent,
                  fontWeight: 600,
                  cursor: 'pointer',
                  paddingLeft: 4,
                  borderLeft: `1px solid ${isWarning ? '#fca5a5' : C.brdD}`,
                  marginLeft: 2,
                  transition: 'opacity .2s',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.opacity = '1';
                }}
              >
                로그인연장
              </span>
            </div>

            <div
              onClick={onLogout}
              style={{
                cursor: 'pointer',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                border: `1px solid ${C.brd}`,
              }}
              title="로그아웃"
            >
              <Ic n="out" s={16} c={C.txS} />
            </div>
          </div>
        </div>
      </div>

      {expired && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '36px 32px',
              width: 360,
              boxShadow: '0 20px 60px rgba(0,0,0,.25)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <circle cx="12" cy="16" r="1" fill="#ef4444" />
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.txH, marginBottom: 8 }}>세션이 만료되었습니다</div>
            <div style={{ fontSize: 12, color: C.txS, lineHeight: 1.6, marginBottom: 28 }}>
              장시간 미사용으로 로그인 세션이 만료되었습니다.
              <br />
              보안을 위해 자동으로 로그아웃됩니다.
            </div>
            <button
              onClick={handleExpiredOk}
              style={{
                width: '100%',
                justifyContent: 'center',
                minHeight: 38,
                borderRadius: 6,
                border: 'none',
                background: C.brand,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              확인 (로그인 화면으로)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
