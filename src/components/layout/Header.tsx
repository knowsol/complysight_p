'use client';

import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';

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
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ top: `${bannerH}px`, bgcolor: C.brand, boxShadow: 'none', zIndex: 200 }}
      >
        <Paper
          square
          elevation={0}
          sx={{
            height: 67,
            bgcolor: C.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, md: 3 },
            borderRadius: '0 0 0 20px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
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
            </Box>
            <Typography component="div" sx={{ fontSize: 18, fontWeight: 600, color: C.txH }}>
              <Box component="span" sx={{ color: C.brand }}>
                COMPLY
              </Box>
              SIGHT
              <Button
                variant="text"
                disabled={user?.userRole === '사용자'}
                onClick={user?.userRole !== '사용자' ? onSiteSwitch : undefined}
                sx={{
                  minWidth: 0,
                  ml: 1,
                  px: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  color: C.brand,
                  '&:hover': { bgcolor: 'transparent', opacity: 0.7 },
                }}
                title={user?.userRole !== '사용자' ? (site === 'm' ? 'Sentinel로 전환' : 'Manager로 전환') : ''}
              >
                {siteName}
              </Button>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ color: C.txt, fontSize: 12, display: { xs: 'none', md: 'block' } }}>고객행복센터</Typography>
            <Divider orientation="vertical" flexItem sx={{ borderColor: C.brdD, my: 2.5, display: { xs: 'none', md: 'block' } }} />
            <Typography sx={{ color: C.txt, fontSize: 12, display: { xs: 'none', md: 'block' } }}>
              업무담당자 : <Box component="span" sx={{ fontWeight: 700 }}>{user?.userNm}</Box>
            </Typography>
            <IconButton size="small" onClick={onPwChange} title="비밀번호 변경" sx={{ color: C.txS }}>
              <SettingsRoundedIcon fontSize="inherit" />
            </IconButton>
            <Chip
              icon={<AccessTimeRoundedIcon sx={{ color: `${isWarning ? '#ef4444' : C.txS} !important` }} />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box component="span" sx={{ color: isWarning ? '#ef4444' : C.txS, fontWeight: isWarning ? 700 : 400, fontVariantNumeric: 'tabular-nums', minWidth: 38 }}>
                    {mm}:{ss}
                  </Box>
                  <Button
                    variant="text"
                    onClick={extendSession}
                    sx={{
                      minWidth: 0,
                      px: 0,
                      pl: 0.75,
                      ml: 0.25,
                      borderLeft: `1px solid ${isWarning ? '#fca5a5' : C.brdD}`,
                      borderRadius: 0,
                      color: isWarning ? '#ef4444' : C.accent,
                      fontWeight: 600,
                      fontSize: 12,
                      '&:hover': { bgcolor: 'transparent', opacity: 0.7 },
                    }}
                  >
                    로그인연장
                  </Button>
                </Box>
              }
              sx={{
                height: 30,
                bgcolor: isWarning ? '#FEF2F2' : '#edf0f6',
                border: `1px solid ${isWarning ? '#fca5a5' : 'transparent'}`,
                '.MuiChip-label': { px: 1, py: 0 },
              }}
            />
            <IconButton onClick={onLogout} title="로그아웃" sx={{ border: `1px solid ${C.brd}`, borderRadius: 1, color: C.txS }}>
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </AppBar>

      <Dialog open={expired} onClose={handleExpiredOk} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: C.txH }}>세션이 만료되었습니다</DialogTitle>
        <DialogContent sx={{ color: C.txS, fontSize: 13 }}>
          장시간 미사용으로 로그인 세션이 만료되었습니다.
          <br />
          보안을 위해 자동으로 로그아웃됩니다.
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button fullWidth variant="contained" onClick={handleExpiredOk} sx={{ bgcolor: C.brand, '&:hover': { bgcolor: C.brandD } }}>
            확인 (로그인 화면으로)
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
