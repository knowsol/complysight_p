// @ts-nocheck
'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useDI } from '@/contexts/DIContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Button, SearchBtn, RefreshBtn } from '@/components/ui/Button';
import { FormInput, FormSelect } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';
import { InspFilter } from '@/components/ui/InspFilter';
import { PageSidebarLayout } from '@/components/ui/PageSidebarLayout';
import { colors } from '@/lib/theme/colors';
import { FREQ_COLORS } from '@/lib/theme/status-colors';
import { FreqBadge } from '@/components/ui/StyleUtils';
import { SYS } from '@/data/manager';
import { _dailyMenu } from '@/data/inspections';
import { DailyReportPanel } from '@/components/panels';
import css from './page.module.css';


const MgrInspD = () => {
  const { di } = useDI();
  const todayDt = new Date().toISOString().slice(0,10);
  const minus10 = new Date(Date.now() - 10*24*60*60*1000).toISOString().slice(0,10);
  const [selItem,     setSelItem]     = useState(null);
  const [fKind,       setFKind]       = useState(null);
  const [fSub,        setFSub]        = useState(null);
  const [kw,          setKw]          = useState("");
  const [dtFrom,      setDtFrom]      = useState(minus10);
  const [dtTo,        setDtTo]        = useState(todayDt);
  const [checkedIds,  setCheckedIds]  = useState([]);
  const [fSys,        setFSys]        = useState("");
  const [applied,     setApplied]     = useState({ kw:"", dtFrom:minus10, dtTo:todayDt, fSys:"", fKind:null, fSub:null });

  const doSearch = () => { setApplied({ kw, dtFrom, dtTo, fSys, fKind, fSub }); setCheckedIds([]); };
  const doReset  = () => { setKw(""); setDtFrom(minus10); setDtTo(todayDt); setFSys(""); setApplied({ kw:"", dtFrom:minus10, dtTo:todayDt, fSys:"", fKind, fSub }); setCheckedIds([]); };

  const filtered = di.filter(x => {
    if (x.st !== "완료") return false;
    if (applied.fSys  && x.sysNm !== (SYS.find(s=>s.id===applied.fSys)||{}).nm) return false;
    if (applied.fKind && x.kind !== applied.fKind) return false;
    if (applied.fSub  && x.mid  !== applied.fSub)  return false;
    const q = applied.kw.trim().toLowerCase();
    if (q && !x.resNm.toLowerCase().includes(q) && !x.insp.toLowerCase().includes(q)) return false;
    if (applied.dtFrom && x.submitDt.slice(0,10) < applied.dtFrom) return false;
    if (applied.dtTo   && x.submitDt.slice(0,10) > applied.dtTo)   return false;
    return true;
  });
  const title = fSub ? `${fKind} > ${fSub}` : fKind || "전체현황";
  const styles = {
    checkbox: (checked: boolean) => ({
      width: 16, height: 16, borderRadius: 3, margin: "0 auto", cursor: "pointer",
      border: `2px solid ${checked ? colors.primary : colors.border}`,
      background: checked ? colors.primary : "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
    }) as CSSProperties,
    abnCount: (v: number) => ({ fontWeight: 700, color: v > 0 ? "#E24949" : colors.textLight }) as CSSProperties,
    noteText: (v: string) => (v ? { color: "#F36D00", fontWeight: 500 } : { color: colors.textLight }) as CSSProperties,
  };

  return <div className={css.wrapper}>
    <PageHeader title="보고이력" breadcrumb="홈 > 점검현황 > 보고이력" />
    <PageSidebarLayout
      sidebar={
        <div className={css.sidebarCard}>
          <Card title="점검종류" style={{ display: 'flex', flexDirection: 'column' }}>
            <InspFilter menus={_dailyMenu} sel={fKind} sub={fSub} onSelect={(k,s)=>{ setFKind(k); setFSub(s); setApplied(p=>({...p, fKind:k, fSub:s})); }} data={di} />
          </Card>
        </div>
      }
    >

        {/* 검색폼 */}
        <div className={css.searchForm}>
          <div className={css.filterGroup}>

            {/* 정보시스템 */}
            <div className={css.filterCol}>
              <span className={css.labelSm}>정보시스템</span>
              <FormSelect value={fSys} onChange={e=>setFSys(e.target.value)}
                className={css.selectStyle}>
                <option value="">전체</option>
                {SYS.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
              </FormSelect>
            </div>

            {/* 제출일시 레인지 */}
            <div className={css.filterCol}>
              <span className={css.labelSm}>제출일시</span>
              <div className={css.dateRow}>
                <DatePicker value={dtFrom} onChange={v => { setDtFrom(v); if (dtTo && v > dtTo) setDtTo(v); }} className={css.datePicker} />
                <span className={css.dateSep}>~</span>
                <DatePicker value={dtTo} onChange={v => { setDtTo(v); if (dtFrom && v < dtFrom) setDtFrom(v); }} className={css.datePicker} />
              </div>
            </div>

            {/* 자원명/점검자 */}
            <div className={css.filterCol}>
              <span className={css.labelSm}>자원명/점검자</span>
              <FormInput value={kw} onChange={e=>setKw(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&doSearch()}
                placeholder="자원명 또는 점검자"
                className={css.inputStyle} />
            </div>
          </div>

          <div className={css.searchBtnGroup}>
            <SearchBtn onClick={doSearch} />
            <RefreshBtn onClick={doReset} />
          </div>
        </div>

        <DataTable sectionTitle={title} sectionCount={filtered.length}
          onRow={row => setSelItem(row)}
          sectionButtons={
            <Button sm primary={checkedIds.length > 0} disabled={checkedIds.length === 0}
              onClick={()=>{ if(checkedIds.length>0) alert(`${checkedIds.length}건 보고서 일괄 다운로드`); }}
              className={css.dlBtn}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              보고서 일괄다운로드{checkedIds.length > 0 ? ` (${checkedIds.length})` : ""}
            </Button>
          }
          cols={[
          { title: <div onClick={e => { e.stopPropagation(); setCheckedIds(checkedIds.length === filtered.length && filtered.length > 0 ? [] : filtered.map(x=>x.id)); }}
                className={css.checkbox}
                style={styles.checkbox(checkedIds.length===filtered.length&&filtered.length>0)}>
                {checkedIds.length===filtered.length&&filtered.length>0
                  ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : checkedIds.length>0 && <div className={css.indeterminate}/>} 
              </div>,
            fieldKey: "id", width: 44,
            renderCell: (v, row) => <div onClick={e => { e.stopPropagation(); setCheckedIds(p => checkedIds.includes(v) ? p.filter(x=>x!==v) : [...p, v]); }}
              className={css.checkbox}
              style={styles.checkbox(checkedIds.includes(v))}>
              {checkedIds.includes(v) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div> },
          { title: "보고서 유형", fieldKey: "freq",     width: 90,
            renderCell: v => <FreqBadge key={FREQ_COLORS[v] || v} freq={v} /> },
          { title: "정보시스템", fieldKey: "sysNm",     minWidth: 120, align: "left" },
          { title: "대상자원",   fieldKey: "resNm",     minWidth: 150, align: "left",
            renderCell: v => <span className={css.linkText}>{v}</span> },
          { title: "점검표",     fieldKey: "clNm",      minWidth: 150, align: "left" },
          { title: "점검자",     fieldKey: "insp" },
          { title: "점검일시",   fieldKey: "execDt" },
          { title: "제출일시",   fieldKey: "submitDt" },
          { title: "정상",       fieldKey: "normalCnt", width: 70,
            renderCell: v => <span className={css.normalCount}>{v}</span> },
          { title: "비정상",     fieldKey: "abnCnt",    width: 70,
            renderCell: v => <span className={css.abnCount} style={styles.abnCount(v)}>{v}</span> },
          { title: "특이사항",   fieldKey: "note",      minWidth: 160, align: "left",
            renderCell: v => v ? <span style={styles.noteText(v)}>{v}</span>
                      : <span style={styles.noteText(v)}>-</span> },
        ]} data={filtered} />
    </PageSidebarLayout>
    <DailyReportPanel open={!!selItem} onClose={()=>setSelItem(null)} item={selItem} />
  </div>;
};

interface ManagerReportHistoryPageProps {}

export default function ManagerReportHistoryPage() { return <MgrInspD />; }
