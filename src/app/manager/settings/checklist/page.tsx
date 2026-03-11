// @ts-nocheck
'use client';

import { useState } from 'react';
import { useCL } from '@/contexts/CLContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { YnBadge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme/colors';
import { RES } from '@/data/resources';
import { CL_INIT } from '@/data/checklists';
import { ChecklistPanel } from '@/components/panels';


const MgrCL = () => {
  const { cl, addCL } = useCL();
  const [selItem,   setSelItem]   = useState(null);
  const [showAdd,   setShowAdd]   = useState(false);
  const [savedItem, setSavedItem] = useState(null);
  const [resLinkMap, setResLinkMap] = useState(() => {
    const map = {};
    RES.forEach(r => { const c = CL_INIT.find(c => c.sub === r.mid); if (c) map[r.id] = c.id; });
    return map;
  });

  const getLinkedResIds = (clId) => Object.entries(resLinkMap)
    .filter(([,v]) => v === clId).map(([k]) => Number(k));

  const handleLinkChange = (resId, link, clId) => {
    setResLinkMap(prev => {
      const next = { ...prev };
      if (link) { next[resId] = clId; }
      else { if (next[resId] === clId) delete next[resId]; }
      return next;
    });
  };

  const handleSaved = (newItem) => {
    addCL(newItem);       // 목록에 즉시 반영
    setShowAdd(false);
    setSavedItem(newItem);
  };

  const activeItem = selItem || savedItem;

  return <div>
  <PageHeader title="점검표" breadcrumb="홈 > 환경설정 > 점검표" />
  <SearchBar placeholder="점검표명으로 검색" />
  <DataTable sectionTitle="점검표 목록" sectionCount={cl.length} sectionButtons={<Button variant="primary" onClick={() => setShowAdd(true)}>+ 점검표 추가</Button>} cols={[
    { title: "상태", fieldKey: "useYn", width: 80, renderCell: v => <YnBadge value={v} /> },
    { title: "점검표명", fieldKey: "nm", minWidth: 150, align: "left", renderCell: (v, row) => <span style={{ fontWeight: 600, color: colors.primary, cursor: "pointer" }} onClick={() => setSelItem(row)}>{v}</span> },
    { title: "점검상세분류", fieldKey: "kind", width: 120 },
    { title: "항목수", fieldKey: "items", width: 70 },
    { title: "스케줄", fieldKey: "sch", width: 70 },
    { title: "연결자원", fieldKey: "id", width: 80, renderCell: v => {
      const cnt = getLinkedResIds(v).length;
      return <span style={{ fontWeight:600, color: cnt>0 ? colors.primary : colors.textLight }}>{cnt}개</span>;
    }},
    { title: "등록자", fieldKey: "registrant", width: 90 },
    { title: "등록일", fieldKey: "regDt", width: 140 },
  ]} data={cl} onRow={row => setSelItem(row)} />
  <ChecklistPanel open={showAdd} onClose={() => setShowAdd(false)} item={null}
    linkedResIds={[]} onLinkChange={()=>{}} onSaved={handleSaved} />
  <ChecklistPanel open={!!activeItem} onClose={() => { setSelItem(null); setSavedItem(null); }} item={activeItem}
    initialTab={savedItem ? "res" : "info"}
    isJustCreated={!!savedItem}
    resLinkMap={resLinkMap}
    linkedResIds={activeItem ? getLinkedResIds(activeItem.id) : []}
    onLinkChange={(resId, link) => handleLinkChange(resId, link, activeItem?.id)} />
</div>
};


interface ManagerSettingsChecklistPageProps {}

export default function ManagerSettingsChecklistPage() { return <MgrCL />; }
