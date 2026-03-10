// @ts-nocheck
'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { Btn } from '@/components/ui/Button';
import { FTextarea } from '@/components/ui/Input';
import { PH } from '@/components/ui/PageHeader';
import { FormRow, SecTitle } from '@/components/ui/FormRow';
import { Radio } from '@/components/ui/Radio';
import { C } from '@/lib/theme/colors';
import { fInput } from '@/lib/theme/styles';

const MgrLoginMsg = ({ loginMsg, onSave }) => {
  const MAX_LEN = 500;
  const [form, setForm] = useState({ content: loginMsg || '', useYn: loginMsg ? 'Y' : 'N' });
  const [errors, setErrors] = useState({});
  const [saveOk, setSaveOk] = useState(false);

  const sf = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    const e = {};
    if (form.useYn === 'Y' && !form.content.trim()) e.content = '안내 메시지를 입력하세요.';
    if (form.content.length > MAX_LEN) e.content = `${MAX_LEN}자 이내로 입력하세요.`;
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(form.useYn === 'Y' ? form.content : '');
    setSaveOk(true);
    setTimeout(() => setSaveOk(false), 2000);
  };

  const remaining = MAX_LEN - form.content.length;

  return (
    <Box>
      <PH title="로그인 안내메시지" bc="홈 > 환경설정 > 로그인 안내메시지" />
      <Paper elevation={0} sx={{ border: `1px solid ${C.brd}`, borderRadius: 1.5, p: '28px 32px', maxWidth: 680 }}>
        <SecTitle label="안내 메시지 설정" primary />

        <FormRow label="노출 여부">
          <Radio value={form.useYn} onChange={(v) => sf('useYn', v)} />
          <Typography sx={{ fontSize: 12, color: C.txS, mt: 0.625 }}>"노출" 설정 시 로그인 화면에 즉시 반영됩니다.</Typography>
        </FormRow>

        <FormRow label="안내 메시지 내용" required={form.useYn === 'Y'}>
          <FTextarea
            value={form.content}
            onChange={(e) => {
              sf('content', e.target.value);
              setErrors((p) => ({ ...p, content: '' }));
            }}
            placeholder={'로그인 화면에 표시할 안내 문구를 입력하세요.\n\n예) 본 시스템은 COMPLYSIGHT 정보시스템 자원 점검 관리 플랫폼입니다.'}
            rows={8}
            maxLength={MAX_LEN}
            disabled={form.useYn === 'N'}
            style={{ ...fInput, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7, minHeight: 160, opacity: form.useYn === 'N' ? 0.5 : 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Box>{errors.content && <Typography sx={{ fontSize: 12, color: '#ef4444' }}>{errors.content}</Typography>}</Box>
            <Typography sx={{ fontSize: 12, color: remaining < 50 ? '#ef4444' : C.txL }}>{form.content.length} / {MAX_LEN}자</Typography>
          </Box>
        </FormRow>

        {form.useYn === 'Y' && form.content.trim() && (
          <Box sx={{ mb: 2.25 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.txS, mb: 1 }}>미리보기</Typography>
            <Paper elevation={0} sx={{ p: '14px 18px', borderRadius: 1, bgcolor: '#fffbeb', border: '1px solid #fde68a' }}>
              <Typography sx={{ fontSize: 12, color: '#92400e', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{form.content}</Typography>
            </Paper>
          </Box>
        )}

        {saveOk && <Alert severity="success" sx={{ mb: 2 }}>저장이 완료되었습니다.</Alert>}

        <Divider sx={{ borderColor: C.brd, mb: 1, mt: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Btn primary onClick={handleSave}>저장</Btn>
        </Box>
      </Paper>
    </Box>
  );
};

interface ManagerSettingsLoginMessagePageProps {
  loginMsg?: string;
  onSave?: (message: string) => void;
}

export default function ManagerSettingsLoginMessagePage() {
  return <MgrLoginMsg loginMsg="" onSave={() => undefined} />;
}
