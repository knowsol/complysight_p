'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { FormInput } from '@/components/ui/Input';
import { useAuth, type AuthUser } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants/routes';
import { BASE, THEME } from '@/lib/theme/colors';
import { PRETENDARD_FONT } from '@/lib/theme/styles';

type SiteType = 'm' | 's';
type PwResetStep = 'input' | 'done';

interface PwResetState {
  open: boolean;
  step: PwResetStep;
  email: string;
  err: string;
  sending: boolean;
}

const USERS: AuthUser[] = [
  { userId: 'admin', userNm: '김시스템', userRole: '시스템관리자', useYn: 'Y' },
  { userId: 'orgadmin', userNm: '이기관', userRole: '기관관리자', useYn: 'Y' },
  { userId: 'maintmgr', userNm: '박유지보수', userRole: '유지보수총괄', useYn: 'Y' },
  { userId: 'user01', userNm: '최점검', userRole: '사용자', useYn: 'Y' },
  { userId: 'user02', userNm: '정담당', userRole: '사용자', useYn: 'Y' },
  { userId: 'user03', userNm: '한미사용', userRole: '사용자', useYn: 'N' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const SAVED_ID_KEY = 'complysight_saved_id';
  const getSavedId = () => {
    try {
      return sessionStorage.getItem(SAVED_ID_KEY) || '';
    } catch {
      return '';
    }
  };

  const savedInit = () => {
    try {
      return !!sessionStorage.getItem(SAVED_ID_KEY);
    } catch {
      return false;
    }
  };

  const [uid, setUid] = useState(() => getSavedId() || 'admin');
  const [pw, setPw] = useState('password');
  const [site, setSite] = useState<SiteType>('m');
  const [saveId, setSaveId] = useState(() => savedInit());
  const [errMsg, setErrMsg] = useState('');
  const [locked] = useState(false);
  const [pwReset, setPwReset] = useState<PwResetState>({
    open: false,
    step: 'input',
    email: '',
    err: '',
    sending: false,
  });

  const t = { ...BASE, ...(THEME[site] || THEME.m) };

  const is = (err: string | boolean) => ({
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${err ? '#ef4444' : '#EEEEEE'}`,
    borderRadius: 4,
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box' as const,
    color: '#333',
    background: locked ? '#f9fafb' : '#fff',
    transition: 'border-color .15s',
    minHeight: 36,
  });

  const toggleSaveId = () => {
    const next = !saveId;
    setSaveId(next);
    try {
      if (next) {
        sessionStorage.setItem(SAVED_ID_KEY, uid);
      } else {
        sessionStorage.removeItem(SAVED_ID_KEY);
      }
    } catch {
      return;
    }
  };

  const handleUidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUid(event.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, ''));
    setErrMsg('');
  };

  const handleUidKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleLogin = () => {
    if (locked) {
      return;
    }

    const id = uid.trim();
    if (!id) {
      setErrMsg('아이디를 입력해 주세요.');
      return;
    }
    if (!pw) {
      setErrMsg('비밀번호를 입력해 주세요.');
      return;
    }

    setErrMsg('');
    const user = USERS.find((item) => item.userId === id);
    if (!user || user.useYn !== 'Y') {
      setErrMsg('아이디 또는 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (pw !== 'password') {
      setErrMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      if (saveId) {
        sessionStorage.setItem(SAVED_ID_KEY, id);
      } else {
        sessionStorage.removeItem(SAVED_ID_KEY);
      }
    } catch {
      return;
    }

    login(user, site);
    router.push(site === 'm' ? ROUTES.md : ROUTES.sd);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handlePwResetSend = () => {
    const email = pwReset.email.trim();
    if (!email) {
      setPwReset((prev) => ({ ...prev, err: '이메일을 입력해 주세요.' }));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setPwReset((prev) => ({ ...prev, err: '올바른 이메일 형식이 아닙니다.' }));
      return;
    }
    setPwReset((prev) => ({ ...prev, step: 'done', err: '' }));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: t.brandBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: PRETENDARD_FONT,
      }}
    >
      <div style={{ width: 420, background: '#fff', borderRadius: 12, padding: '44px 40px', boxShadow: '0 24px 64px rgba(0,0,0,.25)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: t.brand, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>C</span>
          </div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
            <span style={{ color: t.brand }}>COMPLY</span>
            <span style={{ color: '#111' }}>SIGHT</span>
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: '#929292' }}>정보시스템 자원 점검 관리 플랫폼</p>
        </div>

        {locked && (
          <div
            style={{
              marginBottom: 16,
              padding: '12px 14px',
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: 6,
              fontSize: 12,
              color: '#b91c1c',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            계정이 잠겼습니다. 관리자에게 잠금 해제를 요청하세요.
          </div>
        )}

        <div style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#929292' }}>아이디</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', userSelect: 'none' }} onClick={toggleSaveId}>
              <div
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 3,
                  flexShrink: 0,
                  border: `1.5px solid ${saveId ? t.brand : '#CCCCCC'}`,
                  background: saveId ? t.brand : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all .15s',
                }}
              >
                {saveId && (
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <polyline points="1.5,5 4,7.5 8.5,2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 12, color: saveId ? t.brand : '#929292', fontWeight: saveId ? 600 : 400 }}>아이디 저장</span>
            </label>
          </div>
          <FormInput
            value={uid}
            onChange={handleUidChange}
            onKeyDown={(event) => {
              handleUidKeyDown(event);
              if (event.key === 'Enter') {
                handleLogin();
              }
            }}
            style={{ ...is(errMsg && !pw), marginBottom: 0 }}
            placeholder="아이디를 입력하세요"
            lang="en"
            autoComplete="username"
            disabled={locked}
          />
        </div>

        <div style={{ marginBottom: 6, marginTop: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#929292', display: 'block', marginBottom: 5 }}>비밀번호</label>
          <FormInput
            type="password"
            value={pw}
            onChange={(event) => {
              setPw(event.target.value);
              setErrMsg('');
            }}
            onKeyDown={handleKeyDown}
            style={{ ...is(!!errMsg), marginBottom: 0 }}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            disabled={locked}
          />
        </div>

        {errMsg && (
          <div
            style={{
              marginBottom: 10,
              padding: '9px 12px',
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: 6,
              fontSize: 12,
              color: '#b91c1c',
              display: 'flex',
              gap: 6,
              marginLeft: 'auto',
              flexShrink: 0,
              alignSelf: 'stretch',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errMsg}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, marginTop: errMsg ? 4 : 12 }}>
          {[
            ['m', 'Manager', '관리자 사이트'],
            ['s', 'Sentinel', '점검자 사이트'],
          ].map(([k, l, d]) => (
            <div
              key={k}
              onClick={() => {
                if (!locked) {
                  setSite(k as SiteType);
                }
              }}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: 6,
                border: `2px solid ${site === k ? t.brand : '#EEEEEE'}`,
                textAlign: 'center',
                cursor: locked ? 'default' : 'pointer',
                background: site === k ? t.priL : '#fff',
                transition: 'all .3s',
                opacity: locked ? 0.5 : 1,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: site === k ? t.brand : '#666' }}>{l}</div>
              <div style={{ fontSize: 12, color: '#929292', marginTop: 2 }}>{d}</div>
            </div>
          ))}
        </div>

        <button
          onClick={handleLogin}
          disabled={locked}
          style={{
            width: '100%',
            padding: '13px',
            background: locked ? '#94a3b8' : t.brand,
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontSize: 15,
            fontWeight: 600,
            cursor: locked ? 'not-allowed' : 'pointer',
            transition: 'all .3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onMouseEnter={(event) => {
            if (!locked) {
              event.currentTarget.style.background = t.brandD;
            }
          }}
          onMouseLeave={(event) => {
            if (!locked) {
              event.currentTarget.style.background = t.brand;
            }
          }}
        >
          로그인
        </button>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <span
            onClick={() => {
              if (!locked) {
                setPwReset({ open: true, step: 'input', email: '', err: '', sending: false });
              }
            }}
            style={{
              fontSize: 12,
              color: locked ? '#94a3b8' : t.brand,
              cursor: locked ? 'default' : 'pointer',
              textDecoration: locked ? 'none' : 'underline',
              textUnderlineOffset: 2,
            }}
          >
            비밀번호 재설정
          </span>
        </div>
      </div>

      {pwReset.open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setPwReset((prev) => ({ ...prev, open: false }));
            }
          }}
        >
          <div style={{ width: 400, background: '#fff', borderRadius: 14, padding: '36px 32px 32px', boxShadow: '0 24px 64px rgba(0,0,0,.28)', position: 'relative' }}>
            <button
              onClick={() => setPwReset((prev) => ({ ...prev, open: false }))}
              style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#aaa', cursor: 'pointer', lineHeight: 1 }}
            >
              ×
            </button>

            {pwReset.step === 'input' && (
              <>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: t.priL, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.brand} strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 }}>비밀번호 재설정</div>
                  <div style={{ fontSize: 12, color: '#666', lineHeight: 1.65 }}>
                    가입 시 등록한 이메일 주소를 입력하시면
                    <br />
                    비밀번호 재설정 링크를 보내드립니다.
                  </div>
                </div>
                <div style={{ marginTop: 22, marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#929292', display: 'block', marginBottom: 6 }}>이메일 주소</label>
                  <FormInput
                    autoFocus
                    value={pwReset.email}
                    onChange={(event) => {
                      const value = event.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
                      setPwReset((prev) => ({ ...prev, email: value, err: '' }));
                    }}
                    onKeyDown={(event) => {
                      if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(event.key)) {
                        event.preventDefault();
                        return;
                      }
                      if (event.key === 'Enter') {
                        handlePwResetSend();
                      }
                    }}
                    placeholder="example@company.com"
                    lang="en"
                    style={{
                      width: '100%',
                      padding: '6px 12px',
                      border: `1px solid ${pwReset.err ? '#ef4444' : '#EEEEEE'}`,
                      borderRadius: 6,
                      fontSize: 15,
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#333',
                      transition: 'border-color .15s',
                      minHeight: 36,
                    }}
                    onFocus={(event) => {
                      event.target.style.borderColor = t.brand;
                    }}
                    onBlur={(event) => {
                      if (!pwReset.err) {
                        event.target.style.borderColor = '#EEEEEE';
                      }
                    }}
                  />
                  {pwReset.err && <div style={{ marginTop: 4, fontSize: 12, color: '#ef4444' }}>{pwReset.err}</div>}
                </div>
                <button
                  onClick={handlePwResetSend}
                  disabled={pwReset.sending}
                  style={{
                    width: '100%',
                    marginTop: 16,
                    padding: '12px',
                    background: pwReset.sending ? '#94a3b8' : t.brand,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: pwReset.sending ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {pwReset.sending ? '발송 중...' : '재설정 링크 발송'}
                </button>
              </>
            )}

            {pwReset.step === 'done' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 10 }}>이메일을 확인하세요</div>
                  <div style={{ fontSize: 12, color: '#555', lineHeight: 1.75 }}>
                    <span style={{ fontWeight: 600, color: '#111' }}>{pwReset.email}</span>으로
                    <br />
                    비밀번호 재설정 링크를 발송했습니다.
                    <br />
                    <span style={{ fontSize: 12, color: '#929292' }}>메일이 오지 않으면 스팸함을 확인해 주세요.</span>
                  </div>
                </div>
                <button
                  onClick={() => setPwReset((prev) => ({ ...prev, open: false }))}
                  style={{ width: '100%', padding: '12px', background: t.brand, color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                >
                  확인
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}
