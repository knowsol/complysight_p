// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button, SearchBtn, RefreshBtn } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Card } from '@/components/ui/Card';
import { FormInput, FormSelect } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';
import { InspFilter } from '@/components/ui/InspFilter';
import { PageSidebarLayout } from '@/components/ui/PageSidebarLayout';
import { useDI } from '@/contexts/DIContext';
import { useAuth } from '@/contexts/AuthContext';
import { StlDailyPanel, BatchInspModal } from '@/components/panels';
import { SYS } from '@/data/systems';
import { _dailyMenu } from '@/data/inspections';
import { CL_INIT } from '@/data/checklists';
import { colors } from '@/lib/theme/colors';
import { FREQ_COLORS } from '@/lib/theme/status-colors';
import { LABEL_STYLE_SM } from '@/lib/theme/styles';
import css from './page.module.css';

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
  const abnCountStyle = (v) => ({ fontWeight: 700, color: v > 0 ? '#E24949' : colors.textLight });
  const noteTextStyle = (v) => (v ? { color: '#F36D00', fontWeight: 500 } : { color: colors.textLight });
  const submitDtTextStyle = (v) => ({ color: v === '-' ? colors.textLight : colors.text });

  return (
    <div className={css.root}>
      <PageHeader title="일상점검" breadcrumb="홈 > 일상점검" />
      <PageSidebarLayout
        sidebar={(
          <Card title="점검종류" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <InspFilter menus={_dailyMenu} sel={fKind} sub={fSub} onSelect={(k, s) => { setFKind(k); setFSub(s); }} data={di} />
          </Card>
        )}
      >
          <div className={css.searchForm}>
            <div className={css.filterGroup}>
              <div className={css.filterCol}>
                <span style={{ ...LABEL_STYLE_SM }}>정보시스템</span>
                <FormSelect value={fSys} onChange={(e) => setFSys(e.target.value)} className={css.fInputLike}>
                  <option value="">전체</option>
                  {SYS.map((s) => <option key={s.id} value={s.id}>{s.nm}</option>)}
                </FormSelect>
              </div>

              <div className={css.filterCol}>
                <span style={{ ...LABEL_STYLE_SM }}>점검일시</span>
                <div className={css.dateRow}>
                  <DatePicker value={dtFrom} onChange={(v) => { setDtFrom(v); if (dtTo && v > dtTo) setDtTo(v); }} style={{ width: 130 }} />
                  <span className={css.dateSep}>~</span>
                  <DatePicker value={dtTo} onChange={(v) => { setDtTo(v); if (dtFrom && v < dtFrom) setDtFrom(v); }} style={{ width: 130 }} />
                </div>
              </div>

              <div className={css.filterCol}>
                <span style={{ ...LABEL_STYLE_SM }}>자원명/점검자</span>
                <FormInput value={kw} onChange={(e) => setKw(e.target.value)} placeholder="자원명 또는 점검자" className={css.fInputLike} />
              </div>
            </div>
            <div className={css.searchBtnGroup}>
              <SearchBtn onClick={search} />
              <RefreshBtn onClick={() => { setKw(''); setDtFrom(_daysAgo(30)); setDtTo(_today()); setFSys(''); }} />
            </div>
          </div>

          <DataTable
            sectionTitle={title}
            sectionCount={filtered.length}
            onRow={(row) => setSelItem(row)}
            sectionButtons={<div className={css.secBtnRow}>
              <Button variant="outline" onClick={() => setShowBatch(true)}>
                <span className={css.batchBtnContent}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                  일괄점검수행 <span className={css.futureDev}>(추후 개발)</span>
                </span>
              </Button>
              <Button variant="primary" onClick={() => setShowFree(true)}>+ 점검수행</Button>
            </div>}
            cols={[
              {
                title: '보고서 유형', fieldKey: 'rptType', width: 90, renderCell: (v) => {
                  const col = FREQ_COLORS[v] || colors.textSecondary;
                  return v ? <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 10, fontWeight: 700, background: col + '1A', color: col }}>{v}</span> : <span className={css.emptyRptText}>미제출</span>;
                },
              },
              { title: '정보시스템', fieldKey: 'sysNm', minWidth: 120, align: 'left' },
              { title: '대상자원', fieldKey: 'resNm', minWidth: 140, align: 'left', renderCell: (v) => <span className={css.linkText}>{v}</span> },
              { title: '실행주기', fieldKey: 'freq', width: 80 },
              { title: '점검표', fieldKey: 'clNm', minWidth: 140, align: 'left' },
              { title: '점검자', fieldKey: 'insp', width: 80 },
              { title: '점검일시', fieldKey: 'execDt' },
              { title: '제출일시', fieldKey: 'submitDt', renderCell: (v) => <span style={submitDtTextStyle(v)}>{v}</span> },
              {
                title: '자동점검', fieldKey: 'autoRes', width: 70, align: 'center', renderCell: (v) => {
                  const done = v && v !== '-';
                  return done ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#D1FAE5" /><polyline points="4.5,8.5 7,11 11.5,5.5" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#FEE2E2" /><line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" /><line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" /></svg>;
                },
              },
              {
                title: '육안점검', fieldKey: 'eyeRes', width: 70, align: 'center', renderCell: (v) => {
                  const done = v && v !== '-';
                  return done ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#D1FAE5" /><polyline points="4.5,8.5 7,11 11.5,5.5" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#FEE2E2" /><line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" /><line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" /></svg>;
                },
              },
              { title: '정상', fieldKey: 'normalCnt', width: 60, renderCell: (v) => <span className={css.normalCount}>{v}</span> },
              { title: '비정상', fieldKey: 'abnCnt', width: 60, renderCell: (v) => <span style={abnCountStyle(v)}>{v}</span> },
              { title: '특이사항', fieldKey: 'note', minWidth: 160, align: 'left', renderCell: (v) => v ? <span style={noteTextStyle(v)}>{v}</span> : <span style={noteTextStyle(v)}>-</span> },
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
    </div>
  );
}
