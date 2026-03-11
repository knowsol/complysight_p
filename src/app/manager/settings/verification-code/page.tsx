// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { YnBadge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/lib/theme/colors';
import { VC } from '@/data/verification-codes';
import { VCAddPanel } from '@/components/panels';
import css from './page.module.css';


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

  const agentBadge = (ag) => ({ padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600, background: ag.bg, color: ag.color });
  const valCell = (isSaved) => ({ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 5, padding: "4px 8px", borderRadius: 5, cursor: "text", minHeight: 28, border: `1px dashed ${isSaved ? "#16a34a" : colors.border}`, background: isSaved ? "#f0fdf4" : "transparent", transition: "all .15s" });
  const valText = (hasVal) => ({ fontSize: 12, fontWeight: 600, color: hasVal ? colors.textHeading : colors.textLight });

  return <div>
    <PageHeader title="검증코드" breadcrumb="홈 > 환경설정 > 점검표 > 검증코드" />
    <SearchBar placeholder="검증코드명으로 검색" />
    <DataTable sectionTitle="검증코드 목록" sectionCount={vcData.length} noPaging
      sectionButtons={
        <div className={css.secBtnRow}>
          <span className={css.hintText}>
            <Icon name="info" size={11} color={colors.textLight} />
            기준값 셀 클릭 후 Tab·Enter → 다음 행 &nbsp;|&nbsp; Shift+Tab → 이전 행
          </span>
          <Button variant="primary" onClick={()=>setShowAdd(true)}>+ 검증코드 추가</Button>
        </div>
      }
      cols={[
        { title:"상태",         fieldKey:"useYn",  width:80,  renderCell: v => <YnBadge value={v} /> },
        { title:"코드",         fieldKey:"id",     width:140, align:"left", renderCell: v => <span className={css.codeText}>{v}</span> },
        { title:"검증코드명",   fieldKey:"nm",     minWidth:160, align:"left", renderCell: v => <span className={css.nameText}>{v}</span> },
        { title:"점검내용",     fieldKey:"desc",   minWidth:200, align:"left", renderCell: v => <span className={css.descText}>{v||"—"}</span> },
        { title:"에이전트 타입", fieldKey:"agent", width:130, renderCell: v => {
          const ag = agentColor(v);
          return <span style={agentBadge(ag)}>{v}</span>;
        }},
        { title:"정상 기준값",  fieldKey:"id",     width:180, renderCell: (v, row) => {
          const isEditing = editId === row.id;
          const isSaved   = savedId === row.id;
          if (isEditing) return (
            <FormInput autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)}
              onKeyDown={e=>{
                if (e.key==="Tab")    { e.preventDefault(); saveEdit(row.id, getAdjacentId(row.id, e.shiftKey?-1:1)); }
                else if (e.key==="Enter")  { saveEdit(row.id, getAdjacentId(row.id, 1)); }
                else if (e.key==="Escape") { cancelEdit(); }
              }}
              className={css.editInput} />
          );
          return (
            <div onClick={()=>startEdit(row)}
              style={valCell(isSaved)}
              onMouseEnter={e=>{ if(!isSaved){ e.currentTarget.style.borderColor=colors.primary; e.currentTarget.style.background=colors.primaryLight; }}}
              onMouseLeave={e=>{ if(!isSaved){ e.currentTarget.style.borderColor=colors.border; e.currentTarget.style.background="transparent"; }}}>
              {isSaved
                ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className={css.savedText}>{row.val||"—"}</span></>
                : <><span style={valText(!!row.val)}>{row.val||"미설정"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg></>
              }
            </div>
          );
        }},
        { title:"",  fieldKey:"id", width:80, renderCell: (v, row) => editId === row.id ? (
          <div className={css.actionBtns}>
            <Button xs primary onClick={()=>saveEdit(row.id, getAdjacentId(row.id, 1))}>저장</Button>
            <Button xs onClick={cancelEdit}>취소</Button>
          </div>
        ) : null },
      ]} data={vcData} />
    <VCAddPanel open={showAdd} onClose={()=>setShowAdd(false)}
      onSaved={(item) => { setVcData(p => [...p, item]); setShowAdd(false); }} />
  </div>;
};

const Placeholder = ({ title, bc }) => <div>
  <PageHeader title={title} breadcrumb={bc} />
  <Card><div style={{ padding: 36, textAlign: "center", color: colors.textLight }}><Icon name="gear" size={40} color={colors.textLight} /><div style={{ marginTop: 10, fontSize: 15 }}>{title}</div><div style={{ marginTop: 4, fontSize: 12 }}>이 페이지는 개발 중입니다.</div></div></Card>
</div>;

/* ──── PAGES: SENTINEL ──── */

interface ManagerSettingsVerificationCodePageProps {}

export default function ManagerSettingsVerificationCodePage() { return <MgrVC />; }
