'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { FInput } from '@/components/ui/Input';
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

  const inputStyle = (err: string | boolean) => ({
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
    if (locked) return;

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
    <Box
      sx={{
        minHeight: '100vh',
        background: t.brandBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        fontFamily: PRETENDARD_FONT,
      }}
    >
      <Paper elevation={0} sx={{ width: 420, bgcolor: '#fff', borderRadius: 1.5, p: '44px 40px', boxShadow: '0 24px 64px rgba(0,0,0,.25)' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: 1.5, bgcolor: t.brand, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Typography sx={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>C</Typography>
          </Box>
          <Typography component="h1" sx={{ m: '0 0 4px', fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
            <Box component="span" sx={{ color: t.brand }}>COMPLY</Box>
            <Box component="span" sx={{ color: '#111' }}>SIGHT</Box>
          </Typography>
          <Typography sx={{ m: 0, fontSize: 12, color: '#929292' }}>정보시스템 자원 점검 관리 플랫폼</Typography>
        </Box>

        {locked && <Alert severity="error" sx={{ mb: 2 }}>계정이 잠겼습니다. 관리자에게 잠금 해제를 요청하세요.</Alert>}

        <Box sx={{ mb: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.625 }}>
            <Typography component="label" sx={{ fontSize: 12, fontWeight: 600, color: '#929292' }}>아이디</Typography>
            <FormControlLabel
              control={<Checkbox checked={saveId} onChange={toggleSaveId} size="small" sx={{ color: '#CCCCCC', '&.Mui-checked': { color: t.brand } }} />}
              label="아이디 저장"
              sx={{ m: 0, '.MuiFormControlLabel-label': { fontSize: 12, color: saveId ? t.brand : '#929292', fontWeight: saveId ? 600 : 400 } }}
            />
          </Box>
          <FInput
            value={uid}
            onChange={handleUidChange}
            onKeyDown={(event) => {
              handleUidKeyDown(event);
              if (event.key === 'Enter') {
                handleLogin();
              }
            }}
            style={{ ...inputStyle(errMsg && !pw), marginBottom: 0 }}
            placeholder="아이디를 입력하세요"
            lang="en"
            autoComplete="username"
            disabled={locked}
          />
        </Box>

        <Box sx={{ mb: 0.75, mt: 1.25 }}>
          <Typography component="label" sx={{ fontSize: 12, fontWeight: 600, color: '#929292', display: 'block', mb: 0.625 }}>비밀번호</Typography>
          <FInput
            type="password"
            value={pw}
            onChange={(event) => {
              setPw(event.target.value);
              setErrMsg('');
            }}
            onKeyDown={handleKeyDown}
            style={{ ...inputStyle(!!errMsg), marginBottom: 0 }}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            disabled={locked}
          />
        </Box>

        {errMsg && <Alert severity="error" sx={{ mb: 1.25, fontSize: 12 }}>{errMsg}</Alert>}

        <ToggleButtonGroup
          value={site}
          exclusive
          fullWidth
          onChange={(_event, value) => {
            if (value && !locked) {
              setSite(value);
            }
          }}
          sx={{ mb: 2.5, mt: errMsg ? 0.5 : 1.5, gap: 1, '& .MuiToggleButtonGroup-grouped': { borderRadius: '6px !important', border: `2px solid #EEEEEE !important` } }}
        >
          <ToggleButton
            value="m"
            disabled={locked}
            sx={{
              py: 1.25,
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: site === 'm' ? t.priL : '#fff',
              borderColor: site === 'm' ? `${t.brand} !important` : '#EEEEEE !important',
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: site === 'm' ? t.brand : '#666' }}>Manager</Typography>
            <Typography sx={{ fontSize: 12, color: '#929292', mt: 0.25 }}>관리자 사이트</Typography>
          </ToggleButton>
          <ToggleButton
            value="s"
            disabled={locked}
            sx={{
              py: 1.25,
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: site === 's' ? t.priL : '#fff',
              borderColor: site === 's' ? `${t.brand} !important` : '#EEEEEE !important',
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: site === 's' ? t.brand : '#666' }}>Sentinel</Typography>
            <Typography sx={{ fontSize: 12, color: '#929292', mt: 0.25 }}>점검자 사이트</Typography>
          </ToggleButton>
        </ToggleButtonGroup>

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={locked}
          sx={{
            py: 1.5,
            bgcolor: locked ? '#94a3b8' : t.brand,
            borderRadius: 1,
            fontSize: 15,
            fontWeight: 600,
            '&:hover': { bgcolor: locked ? '#94a3b8' : t.brandD },
          }}
        >
          로그인
        </Button>

        <Box sx={{ textAlign: 'center', mt: 1.75 }}>
          <Button
            variant="text"
            onClick={() => {
              if (!locked) {
                setPwReset({ open: true, step: 'input', email: '', err: '', sending: false });
              }
            }}
            sx={{
              p: 0,
              minWidth: 0,
              fontSize: 12,
              color: locked ? '#94a3b8' : t.brand,
              textDecoration: locked ? 'none' : 'underline',
              textUnderlineOffset: '2px',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
            }}
          >
            비밀번호 재설정
          </Button>
        </Box>
      </Paper>

      <Dialog open={pwReset.open} onClose={() => setPwReset((prev) => ({ ...prev, open: false }))} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: '36px 32px 32px', position: 'relative' }}>
          <IconButton onClick={() => setPwReset((prev) => ({ ...prev, open: false }))} sx={{ position: 'absolute', top: 12, right: 14, color: '#aaa' }}>
            <CloseRoundedIcon />
          </IconButton>

          {pwReset.step === 'input' && (
            <>
              <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: t.priL, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.25 }}>
                <Typography sx={{ color: t.brand, fontSize: 24 }}>🔐</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', mb: 0.75 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#111', mb: 0.75 }}>비밀번호 재설정</Typography>
                <Typography sx={{ fontSize: 12, color: '#666', lineHeight: 1.65 }}>
                  가입 시 등록한 이메일 주소를 입력하시면
                  <br />
                  비밀번호 재설정 링크를 보내드립니다.
                </Typography>
              </Box>
              <Box sx={{ mt: 2.75, mb: 0.5 }}>
                <Typography component="label" sx={{ fontSize: 12, fontWeight: 600, color: '#929292', display: 'block', mb: 0.75 }}>이메일 주소</Typography>
                <FInput
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
                {pwReset.err && <Typography sx={{ mt: 0.5, fontSize: 12, color: '#ef4444' }}>{pwReset.err}</Typography>}
              </Box>
              <Button
                fullWidth
                variant="contained"
                onClick={handlePwResetSend}
                disabled={pwReset.sending}
                sx={{ mt: 2, py: 1.5, bgcolor: pwReset.sending ? '#94a3b8' : t.brand, '&:hover': { bgcolor: pwReset.sending ? '#94a3b8' : t.brandD } }}
              >
                {pwReset.sending ? '발송 중...' : '재설정 링크 발송'}
              </Button>
            </>
          )}

          {pwReset.step === 'done' && (
            <>
              <Box sx={{ textAlign: 'center', mb: 2.5 }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.25 }}>
                  <Typography sx={{ color: '#16a34a', fontSize: 24 }}>✓</Typography>
                </Box>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#111', mb: 1.25 }}>이메일을 확인하세요</Typography>
                <Typography sx={{ fontSize: 12, color: '#555', lineHeight: 1.75 }}>
                  <Box component="span" sx={{ fontWeight: 600, color: '#111' }}>{pwReset.email}</Box>으로
                  <br />
                  비밀번호 재설정 링크를 발송했습니다.
                  <br />
                  <Box component="span" sx={{ fontSize: 12, color: '#929292' }}>메일이 오지 않으면 스팸함을 확인해 주세요.</Box>
                </Typography>
              </Box>
              <Button fullWidth variant="contained" onClick={() => setPwReset((prev) => ({ ...prev, open: false }))} sx={{ py: 1.5, bgcolor: t.brand, '&:hover': { bgcolor: t.brandD } }}>
                확인
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
