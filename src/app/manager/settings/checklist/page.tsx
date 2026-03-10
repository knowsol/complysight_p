// @ts-nocheck
'use client';

import { useState } from 'react';
import { useCL } from '@/contexts/CLContext';
import { PH } from '@/components/ui/PageHeader';
import { Tbl } from '@/components/ui/Table';
import { YnBadge } from '@/components/ui/Badge';
import { SB } from '@/components/ui/SearchBar';
import { SecBtnP } from '@/components/ui/Button';
import { C } from '@/lib/theme/colors';
import { RES } from '@/data/resources';
import { CL_INIT } from '@/data/checklists';
import { ChecklistPanel } from '@/components/panels';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


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

  return <Box>
  <PH title="점검표" bc="홈 > 환경설정 > 점검표" />
  <SB ph="점검표명으로 검색" />
  <Tbl secTitle="점검표 목록" secCount={cl.length} secButtons={<SecBtnP onClick={() => setShowAdd(true)}>+ 점검표 추가</SecBtnP>} cols={[
    { t: "상태", k: "useYn", w: 80, r: v => <YnBadge v={v} /> },
    { t: "점검표명", k: "nm", mw: 150, align: "left", r: (v, row) => <Typography component="span" sx={{ fontWeight: 600, color: C.pri, cursor: "pointer" }} onClick={() => setSelItem(row)}>{v}</Typography> },
    { t: "점검상세분류", k: "kind", w: 120 },
    { t: "항목수", k: "items", w: 70 },
    { t: "스케줄", k: "sch", w: 70 },
    { t: "연결자원", k: "id", w: 80, r: v => {
      const cnt = getLinkedResIds(v).length;
      return <Typography component="span" sx={{ fontWeight:600, color: cnt>0 ? C.pri : C.txL }}>{cnt}개</Typography>;
    }},
    { t: "등록자", k: "registrant", w: 90 },
    { t: "등록일", k: "regDt", w: 140 },
  ]} data={cl} onRow={row => setSelItem(row)} />
  <ChecklistPanel open={showAdd} onClose={() => setShowAdd(false)} item={null}
    linkedResIds={[]} onLinkChange={()=>{}} onSaved={handleSaved} />
  <ChecklistPanel open={!!activeItem} onClose={() => { setSelItem(null); setSavedItem(null); }} item={activeItem}
    initialTab={savedItem ? "res" : "info"}
    isJustCreated={!!savedItem}
    resLinkMap={resLinkMap}
    linkedResIds={activeItem ? getLinkedResIds(activeItem.id) : []}
    onLinkChange={(resId, link) => handleLinkChange(resId, link, activeItem?.id)} />
</Box>
};


interface ManagerSettingsChecklistPageProps {}

export default function ManagerSettingsChecklistPage() { return <MgrCL />; }
