// @ts-nocheck
'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PH } from '@/components/ui/PageHeader';
import { Btn, SearchBtn, RefreshBtn, SecBtnO, SecBtnP } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tbl } from '@/components/ui/Table';
import { Card } from '@/components/ui/Card';
import { FInput, FSelect } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';
import { InspFilter } from '@/components/ui/InspFilter';
import { PageSidebarLayout } from '@/components/ui/PageSidebarLayout';
import { useDI } from '@/contexts/DIContext';
import { useAuth } from '@/contexts/AuthContext';
import { StlDailyPanel, BatchInspModal } from '@/components/panels';
import { SYS } from '@/data/systems';
import { _dailyMenu } from '@/data/inspections';
import { CL_INIT } from '@/data/checklists';
import { C } from '@/lib/theme/colors';
import { LABEL_STYLE_SM } from '@/lib/theme/styles';

export default function SentinelDailyInspectionPage() {
  const { di, addDI } = useDI();
  const { auth } = useAuth();
  const [selItem, setSelItem] = useState(null);
  const [showFree, setShowFree] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [fKind, setFKind] = useState(null);
  const [fSub, setFSub] = useState(null);
  const [kw, setKw] = useState('');
  const [fSys, setFSys] = useState('');
  const _today = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };
  const _daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  };
  const [dtFrom, setDtFrom] = useState(_daysAgo(30));
  const [dtTo, setDtTo] = useState(_today());

  const filtered = di.filter((x) => {
    if (fSys && x.sysNm !== (SYS.find((s) => s.id === fSys) || {}).nm) return false;
    if (fKind && x.kind !== fKind) return false;
    if (fSub && x.mid !== fSub) return false;
    const q = kw.trim().toLowerCase();
    if (q && !x.resNm.toLowerCase().includes(q) && !x.insp.toLowerCase().includes(q)) return false;
    if (dtFrom && x.execDt.slice(0, 10) < dtFrom) return false;
    if (dtTo && x.execDt.slice(0, 10) > dtTo) return false;
    return true;
  });

  const title = fSub ? `${fKind} > ${fSub}` : fKind || '전체현황';
  const search = () => {};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <PH title="일상점검" bc="홈 > 일상점검" />
      <PageSidebarLayout
        sidebar={(
          <Card title="점검종류" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <InspFilter menus={_dailyMenu} sel={fKind} sub={fSub} onSelect={(k, s) => { setFKind(k); setFSub(s); }} data={di} />
          </Card>
        )}
      >
          <Box sx={{ width: '100%', border: `1px solid ${C.brd}`, background: C.bg, borderRadius: '6px', padding: '16px 12px', display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'stretch' }}>
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <Stack direction="column" gap="6px" sx={{ minWidth: 'fit-content' }}>
                <Typography component="span" sx={{ ...LABEL_STYLE_SM }}>정보시스템</Typography>
                <FSelect value={fSys} onChange={(e) => setFSys(e.target.value)} style={{ padding: '6px 12px', border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 15, outline: 'none', color: C.txt, background: '#fff', fontFamily: 'inherit', minWidth: 120 }}>
                  <option value="">전체</option>
                  {SYS.map((s) => <option key={s.id} value={s.id}>{s.nm}</option>)}
                </FSelect>
              </Stack>

              <Stack direction="column" gap="6px" sx={{ minWidth: 'fit-content' }}>
                <Typography component="span" sx={{ ...LABEL_STYLE_SM }}>점검일시</Typography>
                <Stack direction="row" alignItems="center" gap="6px">
                  <DatePicker value={dtFrom} onChange={(v) => { setDtFrom(v); if (dtTo && v > dtTo) setDtTo(v); }} style={{ width: 130 }} />
                  <Typography component="span" sx={{ fontSize: 12, color: C.txL }}>~</Typography>
                  <DatePicker value={dtTo} onChange={(v) => { setDtTo(v); if (dtFrom && v < dtFrom) setDtFrom(v); }} style={{ width: 130 }} />
                </Stack>
              </Stack>

              <Stack direction="column" gap="6px" sx={{ minWidth: 'fit-content' }}>
                <Typography component="span" sx={{ ...LABEL_STYLE_SM }}>자원명/점검자</Typography>
                <FInput value={kw} onChange={(e) => setKw(e.target.value)} placeholder="자원명 또는 점검자" style={{ padding: '6px 12px', border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 15, outline: 'none', color: C.txt, background: '#fff', minWidth: 120, fontFamily: 'inherit' }} />
              </Stack>
            </Box>
            <Stack direction="row" gap="6px" sx={{ marginLeft: 'auto', flexShrink: 0, alignSelf: 'stretch' }}>
              <SearchBtn onClick={search} />
              <RefreshBtn onClick={() => { setKw(''); setDtFrom(_daysAgo(30)); setDtTo(_today()); setFSys(''); }} />
            </Stack>
          </Box>

          <Tbl
            secTitle={title}
            secCount={filtered.length}
            onRow={(row) => setSelItem(row)}
            secButtons={<Stack direction="row" gap="6px">
              <SecBtnO onClick={() => setShowBatch(true)}>
                <Stack direction="row" component="span" alignItems="center" gap="4px" sx={{ whiteSpace: 'nowrap' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                  일괄점검수행 <Box component="span" sx={{ color: C.txL, fontWeight: 400, fontSize: 12 }}>(추후 개발)</Box>
                </Stack>
              </SecBtnO>
              <SecBtnP onClick={() => setShowFree(true)}>+ 점검수행</SecBtnP>
            </Stack>}
            cols={[
              {
                t: '보고서 유형', k: 'rptType', w: 90, r: (v) => {
                  const RPT_COLOR = { 일일: '#0C8CE9', 주간: '#19973C', 월간: '#F36D00', 분기: '#7C3AED', 반기: '#E24949', 연간: '#333333', 상시: '#0891B2' };
                  const col = RPT_COLOR[v] || C.txS;
                  return v ? <Box component="span" sx={{ display: 'inline-block', padding: '2px 10px', borderRadius: 10, fontWeight: 700, background: col + '1A', color: col }}>{v}</Box> : <Box component="span" sx={{ color: C.txL, fontSize: 12 }}>미제출</Box>;
                },
              },
              { t: '정보시스템', k: 'sysNm', mw: 120, align: 'left' },
              { t: '대상자원', k: 'resNm', mw: 140, align: 'left', r: (v) => <Box component="span" sx={{ fontWeight: 600, color: C.pri }}>{v}</Box> },
              { t: '실행주기', k: 'freq', w: 80 },
              { t: '점검표', k: 'clNm', mw: 140, align: 'left' },
              { t: '점검자', k: 'insp', w: 80 },
              { t: '점검일시', k: 'execDt' },
              { t: '제출일시', k: 'submitDt', r: (v) => <Box component="span" sx={{ color: v === '-' ? C.txL : C.txt }}>{v}</Box> },
              {
                t: '자동점검', k: 'autoRes', w: 70, align: 'center', r: (v) => {
                  const done = v && v !== '-';
                  return done ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#D1FAE5" /><polyline points="4.5,8.5 7,11 11.5,5.5" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#FEE2E2" /><line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" /><line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" /></svg>;
                },
              },
              {
                t: '육안점검', k: 'eyeRes', w: 70, align: 'center', r: (v) => {
                  const done = v && v !== '-';
                  return done ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#D1FAE5" /><polyline points="4.5,8.5 7,11 11.5,5.5" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#FEE2E2" /><line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" /><line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" /></svg>;
                },
              },
              { t: '정상', k: 'normalCnt', w: 60, r: (v) => <Box component="span" sx={{ fontWeight: 700, color: '#19973C' }}>{v}</Box> },
              { t: '비정상', k: 'abnCnt', w: 60, r: (v) => <Box component="span" sx={{ fontWeight: 700, color: v > 0 ? '#E24949' : C.txL }}>{v}</Box> },
              { t: '특이사항', k: 'note', mw: 160, align: 'left', r: (v) => v ? <Box component="span" sx={{ color: '#F36D00', fontWeight: 500 }}>{v}</Box> : <Box component="span" sx={{ color: C.txL }}>-</Box> },
            ]}
            data={filtered}
          />
      </PageSidebarLayout>


      <StlDailyPanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} currentUser={auth.user} />
      <StlDailyPanel open={showFree} onClose={() => setShowFree(false)} currentUser={auth.user} />
      <BatchInspModal open={showBatch} onClose={() => setShowBatch(false)} currentUser={auth.user} onSubmit={(resList) => {
        const pad = (n) => String(n).padStart(2, '0');
        const nowFmt = () => {
          const d = new Date();
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };
        const AUTO_ITEMS = [
          { id: 'a1', nm: 'CPU 사용률', std: '< 80%' },
          { id: 'a2', nm: '메모리 사용률', std: '< 85%' },
          { id: 'a3', nm: '디스크 사용률', std: '< 90%' },
          { id: 'a4', nm: '서비스 포트 확인', std: 'OPEN' },
          { id: 'a5', nm: '로그 에러 확인', std: '0건' },
          { id: 'a6', nm: '보안패치 상태', std: '최신' },
        ];
        const fmt = nowFmt();
        resList.forEach((r, idx) => {
          const cl = CL_INIT.find((c) => c.sub === r.mid);
          const seed = r.id + idx;
          const pseudo = (n) => ((seed * 9301 + n * 49297 + 233) % 1000) / 1000;
          const items = AUTO_ITEMS.map((a, ai) => {
            const isAbn = pseudo(ai * 7) < 0.15;
            let val = isAbn ? '비정상값' : '정상값';
            if (a.nm.includes('CPU')) val = isAbn ? `${82 + Math.floor(pseudo(ai) * 15)}%` : `${40 + Math.floor(pseudo(ai + 1) * 38)}%`;
            if (a.nm.includes('메모리')) val = isAbn ? `${87 + Math.floor(pseudo(ai) * 10)}%` : `${45 + Math.floor(pseudo(ai + 2) * 38)}%`;
            if (a.nm.includes('디스크')) val = isAbn ? `${91 + Math.floor(pseudo(ai) * 8)}%` : `${30 + Math.floor(pseudo(ai + 3) * 58)}%`;
            if (a.nm.includes('포트')) val = isAbn ? 'CLOSED' : 'OPEN';
            if (a.nm.includes('로그')) val = isAbn ? `${2 + Math.floor(pseudo(ai) * 8)}건` : '0건';
            if (a.nm.includes('패치')) val = isAbn ? '미적용' : '최신';
            return { ...a, val, result: isAbn ? '비정상' : '정상' };
          });
          const norm = items.filter((x) => x.result === '정상').length;
          const abn = items.filter((x) => x.result === '비정상').length;
          addDI({
            id: Date.now() + idx,
            sysNm: r.sysNm || SYS.find((s) => s.id === r.sysId)?.nm || '-',
            resNm: r.nm,
            mid: r.mid,
            clNm: cl?.nm || '-',
            kind: '상태점검',
            sub: '',
            freq: '-',
            due: fmt.split(' ')[0],
            st: '중단',
            insp: auth.user?.userNm || '-',
            execDt: fmt,
            submitDt: '-',
            rptType: '',
            normalCnt: norm,
            abnCnt: abn,
            note: '',
            autoRes: abn > 0 ? '비정상' : '정상',
            eyeRes: '-',
            summary: '-',
            hasFile: false,
            recheck: 'N',
            memo: '',
            _free: true,
            _registered: true,
          });
        });
      }} />
    </Box>
  );
}
