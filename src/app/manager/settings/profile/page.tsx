// @ts-nocheck
'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { Btn } from '@/components/ui/Button';
import { PH } from '@/components/ui/PageHeader';
import { FInput } from '@/components/ui/Input';
import { FormRow, SecTitle } from '@/components/ui/FormRow';
import { Radio } from '@/components/ui/Radio';
import { C } from '@/lib/theme/colors';
import { fInput } from '@/lib/theme/styles';

const MgrSysProfile = () => {
  const [form, setForm] = useState({
    orgName: '한국정보보호산업협회',
    phone: '02-1234-5678',
    siteName: 'COMPLYSIGHT',
    siteShort: 'CS',
    url: 'https://complysight.example.com',
    accessIp: '192.168.1.0/24, 10.0.0.0/8',
    workStart: '09:00',
    workEnd: '18:00',
    timezone: 'Asia/Seoul',
    language: 'ko',
    mfaEnabled: 'N',
    logoAlt: 'COMPLYSIGHT 로고',
  });
  const [saveOk, setSaveOk] = useState(false);

  const sf = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setSaveOk(false);
  };
  const handleSave = () => {
    setSaveOk(true);
    setTimeout(() => setSaveOk(false), 2500);
  };

  return (
    <Box>
      <PH title="시스템 프로필" bc="홈 > 환경설정 > 시스템 프로필" />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1fr 340px' }, gap: 2.5, alignItems: 'start' }}>
        <Paper elevation={0} sx={{ border: `1px solid ${C.brd}`, borderRadius: 1.5, p: '28px 32px' }}>
          <SecTitle label="기관 정보" primary />
          <FormRow label="기관명" required>
            <FInput value={form.orgName} onChange={(e) => sf('orgName', e.target.value)} placeholder="기관명을 입력하세요" style={fInput} />
          </FormRow>
          <FormRow label="전화번호">
            <FInput value={form.phone} onChange={(e) => sf('phone', e.target.value)} placeholder="02-0000-0000" style={fInput} />
          </FormRow>

          <Divider sx={{ my: 2.5, borderColor: C.brd }} />
          <SecTitle label="사이트 정보" />
          <FormRow label="사이트 명" required>
            <FInput value={form.siteName} onChange={(e) => sf('siteName', e.target.value)} placeholder="사이트 명칭" style={fInput} />
          </FormRow>
          <FormRow label="사이트 약칭명">
            <FInput value={form.siteShort} onChange={(e) => sf('siteShort', e.target.value)} placeholder="약칭 (최대 10자)" style={fInput} maxLength={10} />
          </FormRow>
          <FormRow label="URL">
            <FInput value={form.url} onChange={(e) => sf('url', e.target.value)} placeholder="https://" style={fInput} />
          </FormRow>

          <Divider sx={{ my: 2.5, borderColor: C.brd }} />
          <SecTitle label="운영 설정" />
          <FormRow label="추가인증 사용여부">
            <Radio value={form.mfaEnabled} onChange={(v) => sf('mfaEnabled', v)} />
          </FormRow>

          <Divider sx={{ my: 2.5, borderColor: C.brd }} />
          <SecTitle label="로고 설정" />
          <FormRow label="로고 이미지">
            <Stack direction="row" spacing={2} alignItems="center">
              <Paper
                elevation={0}
                sx={{
                  width: 120,
                  height: 48,
                  border: `2px dashed ${C.brd}`,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#F9FAFC',
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontSize: 12, color: C.txL }}>미리보기</Typography>
              </Paper>
              <Box>
                <Button component="label" variant="outlined" size="small" sx={{ color: C.txS, borderColor: C.brd }}>
                  파일 선택
                  <FInput type="file" accept="image/*" style={{ display: 'none' }} />
                </Button>
                <Typography sx={{ fontSize: 12, color: C.txL, mt: 0.5 }}>PNG, JPG, SVG (최대 2MB)</Typography>
              </Box>
            </Stack>
          </FormRow>
          <FormRow label="로고 이미지 대체텍스트">
            <FInput value={form.logoAlt} onChange={(e) => sf('logoAlt', e.target.value)} placeholder="로고 alt 텍스트" style={fInput} />
          </FormRow>

          {saveOk && <Alert severity="success" sx={{ mb: 1.5 }}>설정이 저장되었습니다.</Alert>}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1.5, borderTop: `1px solid ${C.brd}` }}>
            <Btn primary onClick={handleSave}>저장</Btn>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ border: `1px solid ${C.brd}`, borderRadius: 1.5, p: '22px' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: C.txt, mb: 2 }}>현재 설정 요약</Typography>
          <Stack spacing={1}>
            {[
              ['기관명', form.orgName],
              ['전화번호', form.phone],
              ['사이트 명', form.siteName],
              ['약칭', form.siteShort],
              ['URL', form.url],
              ['추가인증', form.mfaEnabled === 'Y' ? '사용' : '미사용'],
              ['로고 alt', form.logoAlt],
            ].map(([k, v]) => (
              <Box key={k} sx={{ display: 'flex', gap: 1, fontSize: 12 }}>
                <Typography sx={{ color: C.txS, minWidth: 70, flexShrink: 0, fontSize: 12 }}>{k}</Typography>
                <Typography sx={{ color: C.txt, wordBreak: 'break-all', fontSize: 12 }}>{v || '—'}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

interface ManagerSettingsProfilePageProps {}

export default function ManagerSettingsProfilePage() {
  return <MgrSysProfile />;
}
