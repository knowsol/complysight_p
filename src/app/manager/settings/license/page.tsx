// @ts-nocheck
'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Btn, SecBtnP } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FInput } from '@/components/ui/Input';
import { PH } from '@/components/ui/PageHeader';
import { Radio } from '@/components/ui/Radio';
import { SidePanel } from '@/components/ui/SidePanel';
import { FormRow, SecTitle } from '@/components/ui/FormRow';
import { Tbl } from '@/components/ui/Table';
import { C } from '@/lib/theme/colors';
import { fInput } from '@/lib/theme/styles';

const MgrLicense = () => {
  const CODE_MAP = {
    'CS-BASIC-2026-AABB': { planId: 'PLAN_BASIC', planNm: 'Basic', type: 'Basic', startDt: '2026-03-01', endDt: '2026-12-31', cycle: '연간', autoRenew: false },
    'CS-STD-2026-CCDD': { planId: 'PLAN_STD', planNm: 'Standard', type: 'Standard', startDt: '2026-03-01', endDt: '2027-02-28', cycle: '연간', autoRenew: true },
    'CS-PREM-2026-EEFF': { planId: 'PLAN_PREM', planNm: 'Premium', type: 'Premium', startDt: '2026-03-01', endDt: '2027-02-28', cycle: '연간', autoRenew: true },
  };

  const PLAN_FEATURES = {
    PLAN_BASIC: ['정보시스템 최대 3개', '자원 최대 30개', '일상점검', '공지사항', '기본 대시보드'],
    PLAN_STD: ['정보시스템 최대 10개', '자원 최대 100개', '일상점검 + 특별점검', '자동점검 연동', '알림 설정', '점검 이력'],
    PLAN_PREM: ['정보시스템 무제한', '자원 무제한', '전체 기능 포함', 'API 연동', '전담 기술지원', 'SLA 보장'],
  };

  const TODAY = '2026-02-24';

  const INIT_LICENSES = [
    { id: 'LIC001', code: 'CS-STD-2025-XXXX', planId: 'PLAN_STD', planNm: 'Standard', type: 'Standard', startDt: '2025-03-01', endDt: '2026-02-28', cycle: '연간', autoRenew: true, status: '만료 예정', regDt: '2025-03-01' },
    { id: 'LIC002', code: 'CS-BASIC-2024-YYYY', planId: 'PLAN_BASIC', planNm: 'Basic', type: 'Basic', startDt: '2024-03-01', endDt: '2025-02-28', cycle: '연간', autoRenew: false, status: '만료', regDt: '2024-03-01' },
  ];

  const [licenses, setLicenses] = useState(INIT_LICENSES);
  const [panel, setPanel] = useState(null);
  const [selLic, setSelLic] = useState(null);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codePreview, setCodePreview] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
  };

  const isExpiringSoon = (endDt) => {
    const diff = (new Date(endDt) - new Date(TODAY)) / 86400000;
    return diff >= 0 && diff <= 30;
  };

  const calcStatus = (lic) => {
    if (lic.status === '해지') return '해지';
    if (new Date(lic.endDt) < new Date(TODAY)) return '만료';
    if (isExpiringSoon(lic.endDt)) return '만료 예정';
    return '구독중';
  };

  const PLAN_COLOR = {
    Basic: { pri: '#6366f1', light: '#eef2ff' },
    Standard: { pri: C.pri, light: C.priL },
    Premium: { pri: '#0f766e', light: '#f0fdfa' },
  };

  const handleCodeCheck = () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) {
      setCodeError('라이선스 코드를 입력하세요.');
      setCodePreview(null);
      return;
    }
    if (licenses.some((l) => l.code.toUpperCase() === code)) {
      setCodeError('이미 등록된 라이선스 코드입니다.');
      setCodePreview(null);
      return;
    }
    const found = CODE_MAP[code];
    if (!found) {
      setCodeError('유효하지 않은 라이선스 코드입니다.');
      setCodePreview(null);
      return;
    }
    setCodeError('');
    setCodePreview({ ...found, code });
  };

  const handleAddLicense = () => {
    if (!codePreview) return;
    const newLic = {
      id: `LIC${String(licenses.length + 1).padStart(3, '0')}`,
      ...codePreview,
      status: '구독중',
      regDt: TODAY,
    };
    setLicenses((p) => [newLic, ...p]);
    setPanel(null);
    setCodeInput('');
    setCodePreview(null);
    setCodeError('');
    showToast('라이선스가 등록되었습니다.');
  };

  const handleToggleAutoRenew = (id, val) => {
    const nextValue = val === 'true' || val === true;
    setLicenses((p) => p.map((l) => (l.id === id ? { ...l, autoRenew: nextValue } : l)));
    showToast('자동 갱신 설정이 변경되었습니다.');
  };

  const handleCancel = (id) => {
    setConfirmMsg({
      title: '라이선스 해지',
      msg: '라이선스를 해지하면 만료일까지 사용 가능하며 이후 서비스가 중단됩니다. 해지하시겠습니까?',
      onOk: () => {
        setLicenses((p) => p.map((l) => (l.id === id ? { ...l, status: '해지', autoRenew: false } : l)));
        setSelLic((prev) => (prev?.id === id ? { ...prev, status: '해지', autoRenew: false } : prev));
        setConfirmMsg(null);
        showToast('라이선스가 해지되었습니다.');
      },
    });
  };

  const openDetail = (lic) => {
    setSelLic(lic);
    setPanel('detail');
  };

  const openAdd = () => {
    setCodeInput('');
    setCodePreview(null);
    setCodeError('');
    setPanel('add');
  };

  const liveLic = selLic ? licenses.find((l) => l.id === selLic.id) || selLic : null;
  const liveStatus = liveLic ? calcStatus(liveLic) : '';
  const col = liveLic ? PLAN_COLOR[liveLic.type] || PLAN_COLOR.Standard : {};
  const features = useMemo(() => (liveLic ? PLAN_FEATURES[liveLic.planId] || [] : []), [liveLic]);

  return (
    <Box>
      <PH title="라이선스" bc="홈 > 라이선스 > 라이선스" />

      <Tbl
        secTitle="라이선스 목록"
        secCount={licenses.length}
        secButtons={<SecBtnP onClick={openAdd}>+ 라이선스 추가</SecBtnP>}
        data={licenses}
        onRow={(lic) => openDetail(lic)}
        cols={[
          { t: '상태', k: 'id', w: 100, r: (_value, lic) => <Badge status={calcStatus(lic)} /> },
          { t: '라이선스 코드', k: 'code', mw: 200, align: 'left', r: (v) => <Typography component="span" sx={{ fontFamily: 'inherit', color: C.txt, fontWeight: 600, fontSize: 13 }}>{v}</Typography> },
          {
            t: '플랜',
            k: 'type',
            w: 110,
            r: (v, lic) => {
              const planColor = PLAN_COLOR[v] || PLAN_COLOR.Standard;
              return (
                <Paper elevation={0} sx={{ display: 'inline-flex', px: 1.125, py: 0.25, borderRadius: 1, bgcolor: planColor.light, color: planColor.pri, fontSize: 12, fontWeight: 700 }}>
                  {lic.planNm}
                </Paper>
              );
            },
          },
          { t: '결제 주기', k: 'cycle', w: 90 },
          { t: '구독 시작일', k: 'startDt', w: 110 },
          { t: '만료일', k: 'endDt', w: 110 },
          { t: '자동갱신', k: 'autoRenew', w: 80, r: (v) => <Typography component="span" sx={{ color: v ? '#16a34a' : C.txL, fontSize: 13 }}>{v ? '사용' : '미사용'}</Typography> },
          { t: '등록일', k: 'regDt', w: 100 },
        ]}
      />

      <SidePanel open={panel === 'add'} onClose={() => setPanel(null)} title="라이선스 추가" width={500} noScroll>
        <Box sx={{ flex: 1, overflowY: 'auto', p: '20px 24px' }}>
          <SecTitle label="라이선스 코드 입력" primary />
          <Typography sx={{ fontSize: 12, color: C.txS, mb: 2, lineHeight: 1.7 }}>
            발급받은 라이선스 코드를 입력하고 [코드 확인] 버튼을 클릭하세요.
            <br />
            코드 확인 후 라이선스 정보를 검토하고 등록을 진행할 수 있습니다.
          </Typography>

          <FormRow label="라이선스 코드" required>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FInput
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value.toUpperCase());
                  setCodeError('');
                  setCodePreview(null);
                }}
                placeholder="예) CS-STD-2026-CCDD"
                style={{ ...fInput, flex: 1, fontFamily: 'inherit', letterSpacing: '0.03em' }}
                onKeyDown={(e) => e.key === 'Enter' && handleCodeCheck()}
              />
              <Btn sm primary onClick={handleCodeCheck} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                코드 확인
              </Btn>
            </Box>
            {codeError && <Typography sx={{ fontSize: 12, color: '#ef4444', mt: 0.5 }}>{codeError}</Typography>}
          </FormRow>

          {codePreview && (() => {
            const preCol = PLAN_COLOR[codePreview.type] || PLAN_COLOR.Standard;
            const preFeatures = PLAN_FEATURES[codePreview.planId] || [];
            return (
              <Box sx={{ mt: 0.5 }}>
                <Alert severity="success" sx={{ mb: 1.5 }}>유효한 라이선스 코드입니다.</Alert>
                <Paper elevation={0} sx={{ border: `2px solid ${preCol.pri}`, borderRadius: 1.25, overflow: 'hidden' }}>
                  <Box sx={{ p: '14px 18px', bgcolor: preCol.light, borderBottom: `1px solid ${preCol.pri}33` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography sx={{ fontSize: 18, fontWeight: 800, color: C.txt }}>{codePreview.planNm} 플랜</Typography>
                      <Paper elevation={0} sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: '#fff', color: preCol.pri, fontSize: 12, fontWeight: 700 }}>
                        {codePreview.type}
                      </Paper>
                    </Box>
                    <Typography sx={{ color: C.txS, fontFamily: 'inherit', fontSize: 13 }}>{codePreview.code}</Typography>
                  </Box>
                  <Box sx={{ p: '14px 18px' }}>
                    <Stack spacing={0.625}>
                      {[
                        ['구독 시작일', codePreview.startDt],
                        ['만료일', codePreview.endDt],
                        ['결제 주기', codePreview.cycle],
                        ['자동 갱신', codePreview.autoRenew ? '사용' : '미사용'],
                      ].map(([label, val]) => (
                        <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.625, borderBottom: '1px solid #f3f4f6', fontSize: 12 }}>
                          <Typography sx={{ color: C.txS, fontSize: 12 }}>{label}</Typography>
                          <Typography sx={{ color: C.txt, fontWeight: 500, fontSize: 12 }}>{val}</Typography>
                        </Box>
                      ))}
                    </Stack>
                    <Stack spacing={0.625} sx={{ mt: 1.5 }}>
                      {preFeatures.map((f) => (
                        <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 12, color: C.txS }}>
                          <Typography sx={{ color: preCol.pri, fontSize: 12 }}>✓</Typography>
                          <Typography sx={{ fontSize: 12 }}>{f}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              </Box>
            );
          })()}
        </Box>

        <Box sx={{ p: '16px 24px', borderTop: `1px solid ${C.brd}`, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Btn onClick={() => setPanel(null)}>취소</Btn>
          <Box sx={{ flex: 1 }} />
          <Btn primary onClick={handleAddLicense}>라이선스 등록</Btn>
        </Box>
      </SidePanel>

      <SidePanel open={panel === 'detail' && !!liveLic} onClose={() => setPanel(null)} title="라이선스 상세" width={500} noScroll>
        <Box sx={{ flex: 1, overflowY: 'auto', p: '20px 24px' }}>
          {liveLic && (() => {
            const isActive = liveStatus === '구독중' || liveStatus === '만료 예정';
            return (
              <>
                <Paper elevation={0} sx={{ p: '16px 18px', bgcolor: col.light, borderRadius: 1.25, mb: 2.5, border: `1px solid ${col.pri}33` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: col.pri, mb: 0.375, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{liveLic.type}</Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 800, color: C.txt }}>{liveLic.planNm} 플랜</Typography>
                    </Box>
                    <Badge status={liveStatus} />
                  </Box>
                  <Typography sx={{ color: C.txS, fontFamily: 'inherit', mb: 1.25, fontSize: 13 }}>{liveLic.code}</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 0', fontSize: 12 }}>
                    {[
                      ['구독 시작일', liveLic.startDt],
                      ['만료일', `${liveLic.endDt}${liveStatus === '만료 예정' ? '  ⚠' : ''}`],
                      ['결제 주기', liveLic.cycle],
                      ['등록일', liveLic.regDt],
                    ].map(([label, val]) => (
                      <Box key={label} sx={{ pr: 1.5 }}>
                        <Typography sx={{ color: C.txL, fontSize: 12, mb: 0.125 }}>{label}</Typography>
                        <Typography sx={{ color: C.txt, fontWeight: 500, fontSize: 12 }}>{val}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                <SecTitle label="이용 내역" primary />
                <Paper elevation={0} sx={{ bgcolor: '#f8fafc', borderRadius: 1, border: `1px solid ${C.brd}`, overflow: 'hidden', mb: 2.5 }}>
                  {features.map((f, i) => (
                    <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.75, py: 1.25, borderBottom: i < features.length - 1 ? `1px solid ${C.brd}` : 'none' }}>
                      <Typography sx={{ color: col.pri, fontSize: 12, flexShrink: 0 }}>✓</Typography>
                      <Typography sx={{ color: C.txt, fontSize: 12 }}>{f}</Typography>
                      <Paper elevation={0} sx={{ ml: 'auto', px: 0.875, py: 0.125, borderRadius: 0.75, bgcolor: '#dcfce7', color: '#16a34a', fontSize: 12, fontWeight: 600 }}>
                        이용 가능
                      </Paper>
                    </Box>
                  ))}
                </Paper>

                {isActive && (
                  <>
                    <SecTitle label="구독 설정" primary />
                    <FormRow label="자동 갱신">
                      <Radio
                        options={[['true', '사용'], ['false', '사용 안함']]}
                        value={String(liveLic.autoRenew)}
                        onChange={(v) => handleToggleAutoRenew(liveLic.id, v)}
                      />
                      <Typography sx={{ fontSize: 12, color: C.txS, mt: 0.5 }}>자동 갱신 시 만료 전 자동으로 결제됩니다.</Typography>
                    </FormRow>
                  </>
                )}
              </>
            );
          })()}
        </Box>

        <Box sx={{ p: '16px 24px', borderTop: `1px solid ${C.brd}`, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {(liveStatus === '구독중' || liveStatus === '만료 예정') && <Btn outlineDanger onClick={() => handleCancel(liveLic?.id)}>라이선스 해지</Btn>}
          <Box sx={{ flex: 1 }} />
          <Btn primary onClick={() => setPanel(null)}>확인</Btn>
        </Box>
      </SidePanel>

      {confirmMsg && (
        <ConfirmModal open={!!confirmMsg} title={confirmMsg?.title} msg={confirmMsg?.msg} onOk={confirmMsg.onOk} onCancel={() => setConfirmMsg(null)} />
      )}

      <Snackbar open={!!toast} autoHideDuration={2800} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
};

interface ManagerSettingsLicensePageProps {}

export default function ManagerSettingsLicensePage() {
  return <MgrLicense />;
}
