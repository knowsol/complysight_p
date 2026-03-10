// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button, SearchBtn, RefreshBtn } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/Input';
import { DataTable } from '@/components/ui/DataTable';
import { InspFilter } from '@/components/ui/InspFilter';
import { PageSidebarLayout } from '@/components/ui/PageSidebarLayout';
import { StlSpecialPanel } from '@/components/panels';
import { SI, _specMenu } from '@/data/inspections';
import { C } from '@/lib/theme/colors';
import { LABEL_STYLE_SM } from '@/lib/theme/styles';

export default function SentinelSpecialInspectionPage() {
  const [items, setItems] = useState(SI);
  const [selItem, setSelItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [fKind, setFKind] = useState(null);
  const [kw, setKw] = useState('');
  const [applied, setApplied] = useState({ kw: '', fKind: null });

  const doSearch = () => setApplied({ kw, fKind });
  const doReset = () => {
    setKw('');
    setApplied({ kw: '', fKind: null });
  };

  const handleAdd = (newItem) => {
    const item = { ...newItem, id: Date.now(), reg: new Date().toISOString().slice(0, 10), submitDt: null, reportFile: null };
    setItems((prev) => [item, ...prev]);
    SI.unshift(item);
    setShowAdd(false);
  };

  const handleUpdate = (updated) => {
    setItems((prev) => prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
    const idx = SI.findIndex((x) => x.id === updated.id);
    if (idx >= 0) SI[idx] = { ...SI[idx], ...updated };
    setSelItem(null);
  };

  const filtered = items.filter((x) => {
    if (applied.fKind && x.kind !== applied.fKind) return false;
    const q = applied.kw.trim().toLowerCase();
    if (q && !x.title.toLowerCase().includes(q) && !(x.insp || '').toLowerCase().includes(q) && !(x.id + '').includes(q)) return false;
    return true;
  });
  const title = fKind || '전체현황';

  const ST_COLOR = { 요청: '#929292', 중단: '#F36D00', 완료: '#19973C', 지연: '#E24949' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <PageHeader title="특별점검" bc="홈 > 특별점검" />
      <PageSidebarLayout
        sidebar={(
          <Card title="점검종류" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <InspFilter menus={_specMenu} sel={applied.fKind} sub={null} onSelect={(k) => { setFKind(k); setApplied((p) => ({ ...p, fKind: k })); }} data={SI} kindKey="kind" />
          </Card>
        )}
      >
          <div style={{ width: '100%', border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: '16px 12px', display: 'flex', gap: 8, marginBottom: 16, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 'fit-content' }}>
                <span style={{ ...LABEL_STYLE_SM }}>제목/점검자</span>
                <FormInput
                  value={kw}
                  onChange={(e) => setKw(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                  placeholder="제목, 점검자 검색"
                  style={{ padding: '6px 12px', border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 15, outline: 'none', color: C.txt, background: '#fff', minWidth: 200, fontFamily: 'inherit' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', flexShrink: 0, alignSelf: 'stretch' }}>
              <SearchBtn onClick={doSearch} />
              <RefreshBtn onClick={doReset} />
            </div>
          </div>
          <DataTable
            secTitle={title}
            secCount={filtered.length}
            onRow={(row) => setSelItem(row)}
            secButtons={<Button variant="primary" onClick={() => setShowAdd(true)}>+ 점검등록</Button>}
            cols={[
              { t: '상태', k: 'st', w: 80, r: (v) => <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: (ST_COLOR[v] || C.txS) + '1A', color: ST_COLOR[v] || C.txS }}>{v}</span> },
              { t: '특별점검 제목', k: 'title', mw: 220, align: 'left', r: (v) => <span style={{ fontWeight: 600, color: C.pri }}>{v}</span> },
              { t: '점검종류', k: 'kind', w: 120 },
              { t: '등록자', k: 'regUser', w: 80 },
              { t: '등록일', k: 'reg', w: 100 },
              { t: '점검계획서', k: 'planFile', w: 90, r: (v) => (v ? <span style={{ color: C.pri, cursor: 'pointer' }}>📎</span> : <span style={{ color: C.txL }}>-</span>) },
              { t: '점검기한', k: 'due', w: 100 },
              { t: '점검자', k: 'insp', w: 80 },
              { t: '보고자', k: 'insp', w: 80 },
              { t: '제출일시', k: 'submitDt', w: 110, r: (v) => <span style={{ color: !v || v === '-' ? C.txL : C.txt }}>{v || '-'}</span> },
              { t: '점검보고서', k: 'reportFile', w: 90, r: (v) => (v ? <span style={{ color: C.pri, cursor: 'pointer' }}>📎</span> : <span style={{ color: C.txL }}>-</span>) },
            ]}
            data={filtered}
          />
      </PageSidebarLayout>
      <StlSpecialPanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} onSave={handleUpdate} />
      <StlSpecialPanel open={showAdd} onClose={() => setShowAdd(false)} item={null} onSave={handleAdd} />
    </div>
  );
}
