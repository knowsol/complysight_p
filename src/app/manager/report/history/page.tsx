// @ts-nocheck
'use client';

import { useState } from 'react';
import { useDI } from '@/contexts/DIContext';
import { PH } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Tbl } from '@/components/ui/Table';
import { Btn, SearchBtn, RefreshBtn } from '@/components/ui/Button';
import { FInput, FSelect } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';
import { InspFilter } from '@/components/ui/InspFilter';
import { PageSidebarLayout } from '@/components/ui/PageSidebarLayout';
import { C } from '@/lib/theme/colors';
import { LABEL_STYLE_SM } from '@/lib/theme/styles';
import { SYS } from '@/data/manager';
import { _dailyMenu } from '@/data/inspections';
import { DailyReportPanel } from '@/components/panels';


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
  const FC = { "상시":"#0891B2","매일":"#0C8CE9","매주":"#19973C","매월":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333333" };

  return <div style={{ display:"flex", flexDirection:"column", flex:1, minHeight:0 }}>
    <PH title="보고이력" bc="홈 > 점검현황 > 보고이력" />
    <PageSidebarLayout
      sidebar={
        <Card title="점검종류" style={{ height:"100%", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <InspFilter menus={_dailyMenu} sel={fKind} sub={fSub} onSelect={(k,s)=>{ setFKind(k); setFSub(s); setApplied(p=>({...p, fKind:k, fSub:s})); }} data={di} />
        </Card>
      }
    >

        {/* 검색폼 */}
        <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: "16px 12px", display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-end" }}>

            {/* 정보시스템 */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:"fit-content" }}>
              <span style={{ ...LABEL_STYLE_SM }}>정보시스템</span>
              <FSelect value={fSys} onChange={e=>setFSys(e.target.value)}
                style={{ padding:"6px 12px", border:`1px solid ${C.brd}`, borderRadius:4,
                  fontSize:15, outline:"none", color:C.txt, background:"#fff",
                  fontFamily:"inherit", minWidth:120 }}>
                <option value="">전체</option>
                {SYS.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
              </FSelect>
            </div>

            {/* 제출일시 레인지 */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:"fit-content" }}>
              <span style={{ ...LABEL_STYLE_SM }}>제출일시</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <DatePicker value={dtFrom} onChange={v => { setDtFrom(v); if (dtTo && v > dtTo) setDtTo(v); }} style={{ width: 130 }} />
                <span style={{ fontSize:12, color:C.txL }}>~</span>
                <DatePicker value={dtTo} onChange={v => { setDtTo(v); if (dtFrom && v < dtFrom) setDtFrom(v); }} style={{ width: 130 }} />
              </div>
            </div>

            {/* 자원명/점검자 */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:"fit-content" }}>
              <span style={{ ...LABEL_STYLE_SM }}>자원명/점검자</span>
              <FInput value={kw} onChange={e=>setKw(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&doSearch()}
                placeholder="자원명 또는 점검자"
                style={{ padding:"6px 12px", border:`1px solid ${C.brd}`, borderRadius:4,
                  fontSize:15, outline:"none", color:C.txt, background:"#fff", minWidth:120, fontFamily:"inherit" }} />
            </div>
          </div>

          <div style={{ display:"flex", gap:6, marginLeft:"auto", flexShrink:0, alignSelf:"stretch" }}>
            <SearchBtn onClick={doSearch} />
            <RefreshBtn onClick={doReset} />
          </div>
        </div>

        <Tbl secTitle={title} secCount={filtered.length}
          onRow={row => setSelItem(row)}
          secButtons={
            <Btn sm primary={checkedIds.length > 0} disabled={checkedIds.length === 0}
              onClick={()=>{ if(checkedIds.length>0) alert(`${checkedIds.length}건 보고서 일괄 다운로드`); }}
              style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              보고서 일괄다운로드{checkedIds.length > 0 ? ` (${checkedIds.length})` : ""}
            </Btn>
          }
          cols={[
          { t: <div onClick={e => { e.stopPropagation(); setCheckedIds(checkedIds.length === filtered.length && filtered.length > 0 ? [] : filtered.map(x=>x.id)); }}
                style={{ width:16, height:16, borderRadius:3, margin:"0 auto", cursor:"pointer",
                  border:`2px solid ${checkedIds.length===filtered.length&&filtered.length>0 ? C.pri : C.brd}`,
                  background: checkedIds.length===filtered.length&&filtered.length>0 ? C.pri : "#fff",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                {checkedIds.length===filtered.length&&filtered.length>0
                  ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : checkedIds.length>0 && <div style={{width:8,height:2,background:C.pri,borderRadius:1}}/>}
              </div>,
            k: "id", w: 44,
            r: (v, row) => <div onClick={e => { e.stopPropagation(); setCheckedIds(p => checkedIds.includes(v) ? p.filter(x=>x!==v) : [...p, v]); }}
              style={{ width:16, height:16, borderRadius:3, margin:"0 auto", cursor:"pointer",
                border:`2px solid ${checkedIds.includes(v) ? C.pri : C.brd}`,
                background: checkedIds.includes(v) ? C.pri : "#fff",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
              {checkedIds.includes(v) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div> },
          { t: "보고서 유형", k: "freq",     w: 90,
            r: v => <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:10, fontWeight:700, background:(FC[v]||C.txS)+"1A", color:FC[v]||C.txS }}>{v}</span> },
          { t: "정보시스템", k: "sysNm",     mw: 120, align: "left" },
          { t: "대상자원",   k: "resNm",     mw: 150, align: "left",
            r: v => <span style={{ fontWeight:600, color:C.pri }}>{v}</span> },
          { t: "점검표",     k: "clNm",      mw: 150, align: "left" },
          { t: "점검자",     k: "insp" },
          { t: "점검일시",   k: "execDt" },
          { t: "제출일시",   k: "submitDt" },
          { t: "정상",       k: "normalCnt", w: 70,
            r: v => <span style={{ fontWeight:700, color:"#19973C" }}>{v}</span> },
          { t: "비정상",     k: "abnCnt",    w: 70,
            r: v => <span style={{ fontWeight:700, color: v > 0 ? "#E24949" : C.txL }}>{v}</span> },
          { t: "특이사항",   k: "note",      mw: 160, align: "left",
            r: v => v ? <span style={{ color:"#F36D00", fontWeight:500 }}>{v}</span>
                      : <span style={{ color:C.txL }}>-</span> },
        ]} data={filtered} />
    </PageSidebarLayout>
    <DailyReportPanel open={!!selItem} onClose={()=>setSelItem(null)} item={selItem} />
  </div>;
};

interface ManagerReportHistoryPageProps {}

export default function ManagerReportHistoryPage() { return <MgrInspD />; }
