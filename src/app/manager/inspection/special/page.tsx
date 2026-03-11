// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { SearchBtn, RefreshBtn, Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/Input';
import { InspFilter } from '@/components/ui/InspFilter';
import { PageSidebarLayout } from '@/components/ui/PageSidebarLayout';
import { colors } from '@/lib/theme/colors';
import { LABEL_STYLE_SM } from '@/lib/theme/styles';
import { SI, _specMenu } from '@/data/inspections';
import { SpecialPanel } from '@/components/panels';
import css from './page.module.css';


const MgrInspSp = ({ toast }) => {
  const [items,    setItems]    = useState(SI);
  const [selItem,  setSelItem]  = useState(null);
  const [showAdd,  setShowAdd]  = useState(false);
  const [fKind,    setFKind]    = useState(null);
  const [kw,       setKw]       = useState("");
  const [applied,  setApplied]  = useState({ kw: "", fKind: null });

  const doSearch = () => setApplied({ kw, fKind });
  const doReset  = () => { setKw(""); setApplied({ kw: "", fKind: null }); };

  const handleAdd = (newItem) => {
    const item = { ...newItem, id: Date.now(), reg: new Date().toISOString().slice(0,10), submitDt: null, reportFile: null };
    setItems(prev => [item, ...prev]);
    setShowAdd(false);
  };

  const handleUpdate = (updated) => {
    const merged = { ...(items.find(x => x.id === updated.id) || {}), ...updated };
    setItems(prev => prev.map(x => x.id === updated.id ? merged : x));
    setSelItem(null);
    toast?.("특별점검이 수정되었습니다.");
  };

  const handleDelete = (target) => {
    setItems(prev => prev.filter(x => x.id !== target.id));
    setSelItem(null);
    toast?.("특별점검이 삭제되었습니다.", false);
  };

  const filtered = items.filter(x => {
    if (applied.fKind && x.kind !== applied.fKind) return false;
    const q = applied.kw.trim().toLowerCase();
    if (q && !x.title.toLowerCase().includes(q) && !(x.insp||"").toLowerCase().includes(q) && !(x.id+"").includes(q)) return false;
    return true;
  });
  const title = fKind || "전체현황";

  const ST_COLOR = { "요청":"#929292","중단":"#F36D00","완료":"#19973C","지연":"#E24949" };

  const stBadge = (v: string) => ({ display: "inline-block", padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700, background: (ST_COLOR[v] || colors.textSecondary) + "1A", color: ST_COLOR[v] || colors.textSecondary });
  const submitDtText = (v: string) => ({ color: (!v || v === "-") ? colors.textLight : colors.text });

  return (
    <div className={css.wrapper}>
      <PageHeader title="특별점검" breadcrumb="홈 > 점검현황 > 특별점검" />
      <PageSidebarLayout
        sidebar={
          <Card title="점검종류" style={{ height:"100%", overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <InspFilter menus={_specMenu} sel={applied.fKind} sub={null}
              onSelect={k => { setFKind(k); setApplied(p => ({ ...p, fKind: k })); }} data={items} kindKey="kind" />
          </Card>
        }
      >
          <div className={css.searchForm}>
            <div className={css.filterGroup}>
              <div className={css.filterCol}>
                <span style={{ ...LABEL_STYLE_SM }}>제목/점검자</span>
                <FormInput value={kw} onChange={e => setKw(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && doSearch()}
                  placeholder="제목, 점검자 검색"
                  className={css.inputStyle} />
              </div>
            </div>
            <div className={css.searchBtnGroup}>
              <SearchBtn onClick={doSearch} />
              <RefreshBtn onClick={doReset} />
            </div>
          </div>
          <DataTable sectionTitle={title} sectionCount={filtered.length}
            sectionButtons={<Button variant="primary" onClick={() => setShowAdd(true)}>+ 특별점검 추가</Button>}
            onRow={row => setSelItem(row)}
            cols={[
              { title:"상태",         fieldKey:"st",      width:80,  renderCell: v => <span style={stBadge(v)}>{v}</span> },
              { title:"특별점검 제목", fieldKey:"title",  minWidth:220, align:"left", renderCell: v => <span className={css.linkText}>{v}</span> },
              { title:"점검종류",     fieldKey:"kind",    width:120 },
              { title:"등록자",       fieldKey:"regUser", width:80  },
              { title:"등록일",       fieldKey:"reg",     width:100 },
              { title:"점검계획서",   fieldKey:"planFile",width:90,  renderCell: v => v ? <span className={css.fileLink}>📎</span> : <span className={css.noFile}>-</span> },
              { title:"점검기한",     fieldKey:"due",     width:100 },
              { title:"점검자",       fieldKey:"insp",    width:80  },
              { title:"보고자",       fieldKey:"insp",    width:80  },
              { title:"제출일시",     fieldKey:"submitDt",width:110, renderCell: v => <span style={submitDtText(v)}>{v||"-"}</span> },
              { title:"점검보고서",   fieldKey:"reportFile",width:90, renderCell: v => v ? <span className={css.fileLink}>📎</span> : <span className={css.noFile}>-</span> },
            ]}
            data={filtered}
          />
      </PageSidebarLayout>
      <SpecialPanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} onSave={handleUpdate} onDelete={handleDelete} />
      <SpecialPanel open={showAdd} onClose={() => setShowAdd(false)} item={null} onSave={handleAdd} />
    </div>
  );
};

interface ManagerInspectionSpecialPageProps {
  toast?: (message: string, success?: boolean) => void;
}

export default function ManagerInspectionSpecialPage() { return <MgrInspSp />; }
