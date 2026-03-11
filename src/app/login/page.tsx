// @ts-nocheck
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { FormInput } from '@/components/ui/Input';
import { useAuth, type AuthUser } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants/routes';
import { BASE, THEME } from '@/lib/theme/colors';
import { hoverBg } from '@/lib/theme/styles';

import css from './page.module.css';

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

  const loginBtnHover = hoverBg(t.brand, t.brandDark);

  return (
    <div className={css.wrapper}>
      <div className={css.loginBox}>
        <div className={css.brandHeader}>
          <div className={css.brandLogo}>
            <span className={css.brandLogoText}>C</span>
          </div>
          <h1 className={css.brandTitle}>
            <span className={css.brandComply}>COMPLY</span>
            <span className={css.brandSight}>SIGHT</span>
          </h1>
          <p className={css.brandSub}>정보시스템 자원 점검 관리 플랫폼</p>
        </div>

        {locked && (
          <div className={css.lockedAlert}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={css.lockedAlertIcon}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            계정이 잠겼습니다. 관리자에게 잠금 해제를 요청하세요.
          </div>
        )}

        <div className={css.idBlock}>
          <div className={css.idRow}>
            <label className={css.fieldLabel}>아이디</label>
            <label className={css.saveIdLabel} onClick={toggleSaveId}>
              <div className={`${css.saveIdCheck} ${saveId ? css.saveIdCheckActive : ''}`}>
                {saveId && (
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <polyline points="1.5,5 4,7.5 8.5,2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`${css.saveIdText} ${saveId ? css.saveIdTextActive : ''}`}>아이디 저장</span>
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

        <div className={css.pwBlock}>
          <label className={css.pwLabel}>비밀번호</label>
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
          <div className={css.errBox}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errMsg}
          </div>
        )}

        <div className={`${css.siteRow} ${errMsg ? css.siteRowWithErr : ''}`}>
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
              className={`${css.siteCard} ${site === k ? css.siteCardActive : ''} ${locked ? css.siteCardLocked : ''}`}
            >
              <div className={`${css.siteTitle} ${site === k ? css.siteTitleActive : ''}`}>{l}</div>
              <div className={css.siteDesc}>{d}</div>
            </div>
          ))}
        </div>

        <button
          onClick={handleLogin}
          disabled={locked}
          className={`${css.loginBtn} ${locked ? css.loginBtnDisabled : ''}`}
          onMouseEnter={(event) => {
            if (!locked) {
              loginBtnHover.onMouseEnter(event);
            }
          }}
          onMouseLeave={(event) => {
            if (!locked) {
              loginBtnHover.onMouseLeave(event);
            }
          }}
        >
          로그인
        </button>

        <div className={css.pwResetWrap}>
          <span
            onClick={() => {
              if (!locked) {
                setPwReset({ open: true, step: 'input', email: '', err: '', sending: false });
              }
            }}
            className={`${css.pwResetText} ${locked ? css.pwResetTextLocked : ''}`}
          >
            비밀번호 재설정
          </span>
        </div>
      </div>

      {pwReset.open && (
        <div
          className={css.modalOverlay}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setPwReset((prev) => ({ ...prev, open: false }));
            }
          }}
        >
          <div className={css.modalCard}>
            <button
              onClick={() => setPwReset((prev) => ({ ...prev, open: false }))}
              className={css.modalClose}
            >
              ×
            </button>

            {pwReset.step === 'input' && (
              <>
                <div className={css.resetIconWrap}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.brand} strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className={css.resetTitleWrap}>
                  <div className={css.resetTitle}>비밀번호 재설정</div>
                  <div className={css.resetDesc}>
                    가입 시 등록한 이메일 주소를 입력하시면
                    <br />
                    비밀번호 재설정 링크를 보내드립니다.
                  </div>
                </div>
                <div className={css.emailBlock}>
                  <label className={css.emailLabel}>이메일 주소</label>
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
                  {pwReset.err && <div className={css.emailError}>{pwReset.err}</div>}
                </div>
                <button
                  onClick={handlePwResetSend}
                  disabled={pwReset.sending}
                  className={`${css.resetSendBtn} ${pwReset.sending ? css.resetSendBtnDisabled : ''}`}
                >
                  {pwReset.sending ? '발송 중...' : '재설정 링크 발송'}
                </button>
              </>
            )}

            {pwReset.step === 'done' && (
              <>
                <div className={css.doneWrap}>
                  <div className={css.doneIconWrap}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className={css.doneTitle}>이메일을 확인하세요</div>
                  <div className={css.doneDesc}>
                    <span className={css.doneEmail}>{pwReset.email}</span>으로
                    <br />
                    비밀번호 재설정 링크를 발송했습니다.
                    <br />
                    <span className={css.doneHint}>메일이 오지 않으면 스팸함을 확인해 주세요.</span>
                  </div>
                </div>
                <button
                  onClick={() => setPwReset((prev) => ({ ...prev, open: false }))}
                  className={css.doneBtn}
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
