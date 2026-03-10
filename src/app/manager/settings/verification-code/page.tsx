// @ts-nocheck
'use client';

import { useState } from 'react';
import { PH } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Tbl } from '@/components/ui/Table';
import { YnBadge } from '@/components/ui/Badge';
import { SB } from '@/components/ui/SearchBar';
import { Btn, SecBtnP } from '@/components/ui/Button';
import { FInput } from '@/components/ui/Input';
import { Ic } from '@/components/ui/Icon';
import { C } from '@/lib/theme/colors';
import { VC } from '@/data/verification-codes';
import { VCAddPanel } from '@/components/panels';


const MgrVC = () => {
  const [vcData,  setVcData]  = useState(VC.map(v => ({ ...v })));
  const [showAdd, setShowAdd] = useState(false);
  const [editId,  setEditId]  = useState(null);
  const [editVal, setEditVal] = useState("");
  const [savedId, setSavedId] = useState(null);

  const saveEdit = (id, nextId) => {
    setVcData(p => p.map(v => v.id === id ? { ...v, val: editVal } : v));
    setSavedId(id);
    setTimeout(() => setSavedId(p => p === id ? null : p), 1800);
    if (nextId) {
      const next = vcData.find(v => v.id === nextId);
      if (next) { setEditId(nextId); setEditVal(next.val || ""); }
      else { setEditId(null); }
    } else { setEditId(null); }
  };
  const cancelEdit = () => { setEditId(null); setEditVal(""); };
  const startEdit  = (row) => { setEditId(row.id); setEditVal(row.val || ""); };
  const getAdjacentId = (id, dir) => {
    const idx = vcData.findIndex(v => v.id === id);
    return vcData[idx + dir]?.id || null;
  };
  const agentColor = (agent) => ({
    "PROMETHEUS": { bg:"#dcfce7", color:"#166534" },
    "SSH":        { bg:"#dbeafe", color:"#1e40af" },
    "LOKI":       { bg:"#fff7ed", color:"#9a3412" },
    "육안검수":   { bg:"#f3f4f6", color:"#374151" },
  }[agent] || { bg:"#f3f4f6", color:"#374151" });

  return <div>
    <PH title="검증코드" bc="홈 > 환경설정 > 점검표 > 검증코드" />
    <SB ph="검증코드명으로 검색" />
    <Tbl secTitle="검증코드 목록" secCount={vcData.length} noPaging
      secButtons={
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:12, color:C.txL, display:"flex", alignItems:"center", gap:3 }}>
            <Ic n="info" s={11} c={C.txL} />
            기준값 셀 클릭 후 Tab·Enter → 다음 행 &nbsp;|&nbsp; Shift+Tab → 이전 행
          </span>
          <SecBtnP onClick={()=>setShowAdd(true)}>+ 검증코드 추가</SecBtnP>
        </div>
      }
      cols={[
        { t:"상태",         k:"useYn",  w:80,  r: v => <YnBadge v={v} /> },
        { t:"코드",         k:"id",     w:140, align:"left", r: v => <span style={{ color:C.txS }}>{v}</span> },
        { t:"검증코드명",   k:"nm",     mw:160, align:"left", r: v => <span style={{ fontWeight:600 }}>{v}</span> },
        { t:"점검내용",     k:"desc",   mw:200, align:"left", r: v => <span style={{ color:C.txS }}>{v||"—"}</span> },
        { t:"에이전트 타입", k:"agent", w:130, r: v => {
          const ag = agentColor(v);
          return <span style={{ padding:"2px 10px", borderRadius:4, fontSize:12, fontWeight:600, background:ag.bg, color:ag.color }}>{v}</span>;
        }},
        { t:"정상 기준값",  k:"id",     w:180, r: (v, row) => {
          const isEditing = editId === row.id;
          const isSaved   = savedId === row.id;
          if (isEditing) return (
            <FInput autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)}
              onKeyDown={e=>{
                if (e.key==="Tab")    { e.preventDefault(); saveEdit(row.id, getAdjacentId(row.id, e.shiftKey?-1:1)); }
                else if (e.key==="Enter")  { saveEdit(row.id, getAdjacentId(row.id, 1)); }
                else if (e.key==="Escape") { cancelEdit(); }
              }}
              style={{ width:"100%", padding:"4px 8px", fontSize:14, fontWeight:600,
                border:`1.5px solid ${C.pri}`, borderRadius:5, outline:"none",
                textAlign:"left", boxSizing:"border-box", boxShadow:`0 0 0 3px ${C.pri}22` }} />
          );
          return (
            <div onClick={()=>startEdit(row)}
              style={{ display:"flex", alignItems:"center", justifyContent:"flex-start", gap:5,
                padding:"4px 8px", borderRadius:5, cursor:"text", minHeight:28,
                border:`1px dashed ${isSaved?"#16a34a":C.brd}`,
                background: isSaved?"#f0fdf4":"transparent", transition:"all .15s" }}
              onMouseEnter={e=>{ if(!isSaved){ e.currentTarget.style.borderColor=C.pri; e.currentTarget.style.background=C.priL; }}}
              onMouseLeave={e=>{ if(!isSaved){ e.currentTarget.style.borderColor=C.brd; e.currentTarget.style.background="transparent"; }}}>
              {isSaved
                ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize:12, fontWeight:700, color:"#16a34a" }}>{row.val||"—"}</span></>
                : <><span style={{ fontSize:12, fontWeight:600, color:row.val?C.txH:C.txL }}>{row.val||"미설정"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg></>
              }
            </div>
          );
        }},
        { t:"",  k:"id", w:80, r: (v, row) => editId === row.id ? (
          <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
            <Btn xs primary onClick={()=>saveEdit(row.id, getAdjacentId(row.id, 1))}>저장</Btn>
            <Btn xs onClick={cancelEdit}>취소</Btn>
          </div>
        ) : null },
      ]} data={vcData} />
    <VCAddPanel open={showAdd} onClose={()=>setShowAdd(false)}
      onSaved={(item) => { setVcData(p => [...p, item]); setShowAdd(false); }} />
  </div>;
};

const Placeholder = ({ title, bc }) => <div>
  <PH title={title} bc={bc} />
  <Card><div style={{ padding: 36, textAlign: "center", color: C.txL }}><Ic n="gear" s={40} c={C.txL} /><div style={{ marginTop: 10, fontSize: 15 }}>{title}</div><div style={{ marginTop: 4, fontSize: 12 }}>이 페이지는 개발 중입니다.</div></div></Card>
</div>;

/* ──── PAGES: SENTINEL ──── */

interface ManagerSettingsVerificationCodePageProps {}

export default function ManagerSettingsVerificationCodePage() { return <MgrVC />; }
