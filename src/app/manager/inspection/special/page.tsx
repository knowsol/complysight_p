// @ts-nocheck
'use client';

import { useState } from 'react';
import { PH } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Tbl } from '@/components/ui/Table';
import { SearchBtn, RefreshBtn, SecBtnP } from '@/components/ui/Button';
import { FInput } from '@/components/ui/Input';
import { InspFilter } from '@/components/ui/InspFilter';
import { PageSidebarLayout } from '@/components/ui/PageSidebarLayout';
import { C } from '@/lib/theme/colors';
import { LABEL_STYLE_SM } from '@/lib/theme/styles';
import { SI, _specMenu } from '@/data/inspections';
import { SpecialPanel } from '@/components/panels';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


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

  return (
    <Box sx={{ display:"flex", flexDirection:"column", flex:1, minHeight:0 }}>
      <PH title="특별점검" bc="홈 > 점검현황 > 특별점검" />
      <PageSidebarLayout
        sidebar={
          <Card title="점검종류" style={{ height:"100%", overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <InspFilter menus={_specMenu} sel={applied.fKind} sub={null}
              onSelect={k => { setFKind(k); setApplied(p => ({ ...p, fKind: k })); }} data={items} kindKey="kind" />
          </Card>
        }
      >
          <Stack direction="row" sx={{ width:"100%", border:`1px solid ${C.brd}`, background:C.bg, borderRadius:6,
            padding:"16px 12px", gap:1, marginBottom:2, alignItems:"stretch" }}>
            <Stack direction="row" sx={{ gap:1, flexWrap:"wrap", alignItems:"flex-end" }}>
              <Stack direction="column" sx={{ gap:"6px", minWidth:"fit-content" }}>
                <Typography component="span" sx={{ ...LABEL_STYLE_SM }}>제목/점검자</Typography>
                <FInput value={kw} onChange={e => setKw(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && doSearch()}
                  placeholder="제목, 점검자 검색"
                  style={{ padding:"6px 12px", border:`1px solid ${C.brd}`, borderRadius:4,
                    fontSize:15, outline:"none", color:C.txt, background:"#fff", minWidth:200, fontFamily:"inherit" }} />
              </Stack>
            </Stack>
            <Stack direction="row" sx={{ gap:"6px", marginLeft:"auto", flexShrink:0, alignSelf:"stretch" }}>
              <SearchBtn onClick={doSearch} />
              <RefreshBtn onClick={doReset} />
            </Stack>
          </Stack>
          <Tbl secTitle={title} secCount={filtered.length}
            secButtons={<SecBtnP onClick={() => setShowAdd(true)}>+ 특별점검 추가</SecBtnP>}
            onRow={row => setSelItem(row)}
            cols={[
              { t:"상태",         k:"st",      w:80,  r: v => <Typography component="span" sx={{ display:"inline-block", padding:"2px 10px", borderRadius:10, fontSize:12, fontWeight:700, background:(ST_COLOR[v]||C.txS)+"1A", color:ST_COLOR[v]||C.txS }}>{v}</Typography> },
              { t:"특별점검 제목", k:"title",  mw:220, align:"left", r: v => <Typography component="span" sx={{ fontWeight:600, color:C.pri }}>{v}</Typography> },
              { t:"점검종류",     k:"kind",    w:120 },
              { t:"등록자",       k:"regUser", w:80  },
              { t:"등록일",       k:"reg",     w:100 },
              { t:"점검계획서",   k:"planFile",w:90,  r: v => v ? <Typography component="span" sx={{ color:C.pri, cursor:"pointer" }}>📎</Typography> : <Typography component="span" sx={{ color:C.txL }}>-</Typography> },
              { t:"점검기한",     k:"due",     w:100 },
              { t:"점검자",       k:"insp",    w:80  },
              { t:"보고자",       k:"insp",    w:80  },
              { t:"제출일시",     k:"submitDt",w:110, r: v => <Typography component="span" sx={{ color: (!v||v==="-")?C.txL:C.txt }}>{v||"-"}</Typography> },
              { t:"점검보고서",   k:"reportFile",w:90, r: v => v ? <Typography component="span" sx={{ color:C.pri, cursor:"pointer" }}>📎</Typography> : <Typography component="span" sx={{ color:C.txL }}>-</Typography> },
            ]}
            data={filtered}
          />
      </PageSidebarLayout>
      <SpecialPanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} onSave={handleUpdate} onDelete={handleDelete} />
      <SpecialPanel open={showAdd} onClose={() => setShowAdd(false)} item={null} onSave={handleAdd} />
    </Box>
  );
};

interface ManagerInspectionSpecialPageProps {
  toast?: (message: string, success?: boolean) => void;
}

export default function ManagerInspectionSpecialPage() { return <MgrInspSp />; }
