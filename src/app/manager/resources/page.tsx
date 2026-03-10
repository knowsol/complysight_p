// @ts-nocheck
'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { PH } from '@/components/ui/PageHeader';
import { Tbl } from '@/components/ui/Table';
import { YnBadge } from '@/components/ui/Badge';
import { SB } from '@/components/ui/SearchBar';
import { Btn } from '@/components/ui/Button';
import { FInput } from '@/components/ui/Input';
import { C } from '@/lib/theme/colors';
import { SYS } from '@/data/manager';
import { RES } from '@/data/resources';
import { CL_INIT } from '@/data/checklists';
import { USERS } from '@/data/users';
import { AddSystemModal, ExcelUploadModal, ResourcePanel, SystemDetailPanel } from '@/components/panels';


const MgrRes = ({ toast }) => {
  const [sel, setSel] = useState(null);
  const [sysSearch, setSysSearch] = useState("");
  const [showAddSystem, setShowAddSystem] = useState(false);
  const [systems, setSystems] = useState(SYS);
  const [resources, setResources] = useState(RES);
  const [panelRes, setPanelRes] = useState(null);
  const [showAddRes, setShowAddRes] = useState(false);
  const [showSysDetail, setShowSysDetail] = useState(false);
  const [detailSys, setDetailSys] = useState(null);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [sysLimitToast, setSysLimitToast] = useState(false);
  const filtered = sel ? resources.filter(r => r.sysId === sel) : resources;

  /* ── 라이선스 기반 정보시스템 최대 수 계산 (고정 1개 포함) ── */
  const LICENSE_PLAN_MAX = { "PLAN_BASIC": 3, "PLAN_STD": 10, "PLAN_PREM": Infinity };
  const ACTIVE_PLAN = "PLAN_STD"; // 현재 활성 플랜 (Standard)
  const maxSystems = (LICENSE_PLAN_MAX[ACTIVE_PLAN] ?? 10) + 1; // +1 공유자원(고정)
  const currentSysCount = systems.length; // SHARED 포함 전체
  const canAddSystem = currentSysCount < maxSystems;

  const handleAddSystemClick = () => {
    if (!canAddSystem) { setSysLimitToast(true); setTimeout(() => setSysLimitToast(false), 3500); return; }
    setShowAddSystem(true);
  };

  const handleAddSystem = (form) => { if(toast) toast("정보시스템이 등록되었습니다.");
    const newSys = { id: form.systemId, nm: form.systemNm, type: form.systemType, org: form.mgmtOrg || "—", useYn: form.useYn, mem: form.members.length, res: 0 };
    setSystems(prev => [...prev, newSys]);
  };

  const handleUpdateSystem = (form) => {
    setSystems(prev => prev.map(s => s.id === detailSys?.id ? { ...s, ...form } : s));
    if (toast) toast("정보시스템이 저장되었습니다.");
  };

  const handleDeleteSystem = (system) => {
    setSystems(prev => prev.filter(s => s.id !== system.id));
    setShowSysDetail(false);
    setDetailSys(null);
    if (sel === system.id) setSel(null);
    if (toast) toast("정보시스템이 삭제되었습니다.", false);
  };


  const handleResourceSubmit = (form, editId) => {
    if (editId) {
      const updated = { ...resources.find(r => r.id === editId), ...form, sysNm: (systems.find(s => s.id === form.sysId) || {}).nm || "" };
      setResources(prev => prev.map(r => r.id === editId ? updated : r));
      setPanelRes(updated);
      if (toast) toast("자원이 수정되었습니다.");
    } else {
      const prefix = (systems.find(s => s.id === form.sysId)?.id || "RES").slice(0,3).toUpperCase();
      const autoId = `${prefix}-${String(Date.now()).slice(-6)}`;
      const newRes = { id: Date.now(), ...form, resourceId: autoId, sysNm: (systems.find(s => s.id === form.sysId) || {}).nm || "" };
      setResources(prev => [newRes, ...prev]);
      if (toast) toast("자원이 등록되었습니다.");
    }
  };

  const handleDeleteResource = (resource) => {
    setResources(prev => prev.filter(r => r.id !== resource.id));
    setPanelRes(null);
    if (toast) toast("자원이 삭제되었습니다.", false);
  };

  // 드래그 핸들러
  const handleDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setSystems(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(idx, 0, moved);
      setDragIdx(idx);
      return arr;
    });
  };
  const handleDragEnd = () => setDragIdx(null);

  const PAGE_SZ = 10;
  const [resPage, setResPage] = useState(1);
  const [resKw,   setResKw]   = useState("");
  const [resSt,   setResSt]   = useState("전체");

  const filteredRes = filtered.filter(r => {
    const kw = resKw.trim().toLowerCase();
    if (resSt !== "전체" && r.st !== resSt) return false;
    return !kw || r.nm.toLowerCase().includes(kw) || (r.ip || "").includes(kw);
  });
  const totalResPages = Math.max(1, Math.ceil(filteredRes.length / PAGE_SZ));
  const pagedRes = filteredRes.slice((resPage - 1) * PAGE_SZ, resPage * PAGE_SZ);
  const selSysNm = sel ? (systems.find(s => s.id === sel)?.nm || "") : "";

  return (
    <Box>
      <PH title="자원관리" bc="홈 > 자원관리" />

      <Stack direction="row" gap="14px" alignItems="start">

        {/* ── 왼쪽: 정보시스템 패널 ── */}
        <Box sx={{ width: 240, flexShrink: 0, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: "6px", overflow: "hidden", position: "sticky", top: 0, maxHeight: "calc(100vh - 170px)", display: "flex", flexDirection: "column" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ padding: "14px 16px", borderBottom: `1px solid ${C.brd}` }}>
            <Stack direction="row" alignItems="center" gap="8px">
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.txH }}>정보시스템</Typography>
              <Typography sx={{ fontSize: 11, color: canAddSystem ? C.txL : C.red, fontWeight: 500 }}>
                {currentSysCount - 1}/{maxSystems - 1}
              </Typography>
            </Stack>
            <Box onClick={handleAddSystemClick}
              sx={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "4px", cursor: "pointer", transition: "background .15s", border: "none", outline: "none",
                '&:hover': { background: C.priL } }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={canAddSystem ? C.txL : C.red} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </Box>
          </Stack>
          {/* 시스템 수 제한 안내 토스트 */}
          {sysLimitToast && (
            <Stack direction="row" alignItems="flex-start" gap="6px" sx={{ margin: "8px 10px 0", padding: "8px 12px", borderRadius: "6px", background: "#FEF2F2", border: "1px solid #FECACA" }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
              </svg>
              <Typography sx={{ fontSize: 11, color: "#991B1B", lineHeight: 1.5 }}>
                현재 플랜(Standard)에서 정보시스템은 최대 <strong>{maxSystems - 1}개</strong>까지 등록 가능합니다. 추가 등록이 필요한 경우 라이선스를 업그레이드하세요.
              </Typography>
            </Stack>
          )}
          <Box sx={{ padding: "6px 0", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
            {/* 검색 */}
            <Box sx={{ padding: "6px 10px 4px", flexShrink: 0 }}>
              <Box sx={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <FInput value={sysSearch} onChange={e => setSysSearch(e.target.value)}
                  placeholder="시스템 검색"
                  style={{ width: "100%", padding: "6px 24px 6px 26px", fontSize: 12, border: `1px solid ${C.brd}`,
                    borderRadius: 6, outline: "none", boxSizing: "border-box", background: "#F8FAFC", color: C.txt, fontFamily: "inherit" }} />
                {sysSearch && (
                  <Box component="span" onClick={() => setSysSearch("")}
                    sx={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)",
                      cursor: "pointer", fontSize: 15, color: C.txL, lineHeight: 1 }}>×</Box>
                )}
              </Box>
            </Box>
            {/* 전체 */}
            {(() => {
              const active = sel === null;
              return (
                <Box onClick={() => { setSel(null); setResPage(1); }}
                  sx={{ display: "flex", alignItems: "center",
                    padding: "9px 14px", cursor: "pointer", borderRadius: "6px", margin: "0 6px",
                    background: active ? C.priL : "transparent",
                    transition: "all .3s",
                    '&:hover': { background: C.priL } }}>
                  <Typography sx={{ fontSize: 15, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txt, flex: 1 }}>전체</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 500,
                    background: "#EEEEEE", color: "#929292",
                    borderRadius: "10px", padding: "1px 7px", minWidth: 20, textAlign: "center" }}>{resources.length}</Typography>
                </Box>
              );
            })()}
            {/* 시스템 목록 */}
            {systems.filter(s => !sysSearch || s.nm.toLowerCase().includes(sysSearch.toLowerCase())).map((s, idx) => {
              const active = sel === s.id;
              return (
                <Box key={s.id}
                  draggable
                  onDragStart={e => handleDragStart(e, idx)}
                  onDragOver={e => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  sx={{ display: "flex", alignItems: "center",
                    padding: "8px 14px 8px 10px", cursor: "pointer", borderRadius: "6px", margin: "0 6px",
                    background: active ? C.priL : dragIdx === idx ? "#F0F9FF" : "transparent",
                    opacity: s.useYn === "N" ? 0.4 : 1,
                    transition: "all .3s",
                    '&:hover': { background: C.priL } }}>
                  <Box sx={{ flex: 1, overflow: "hidden", minWidth: 0 }} onClick={() => { setSel(active ? null : s.id); setResPage(1); }}>
                    <Typography sx={{ fontSize: 15, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txt,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: "20px" }}>{s.nm}</Typography>
                    <Typography sx={{ fontSize: 12, color: C.txL, marginTop: "1px" }}>자원 {s.res}개 · 구성원 {s.mem}명</Typography>
                  </Box>
                  {/* 상세 아이콘 버튼 (세로 점 3개) */}
                  <IconButton
                    onClick={e => { e.stopPropagation(); setDetailSys(s); setShowSysDetail(true); }}
                    sx={{ flexShrink: 0, marginLeft: "4px", width: 24, height: 24, borderRadius: "4px", background: "#fff", color: C.txL,
                      '&:hover': { background: C.priL, color: C.pri } }}
                    title="상세 보기">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                    </svg>
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* ── 오른쪽: 자원 목록 ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>

          <SB ph="자원명 또는 IP로 검색"
            fields={[{ key:"status", label:"상태", type:"select", options:["전체","사용","미사용"] }]}
            onSearch={(f, kw) => { setResKw(kw); setResSt(f.status||"전체"); setResPage(1); }} />

          <Tbl
            secTitle={`${sel ? selSysNm : "전체"} 자원 목록`}
            secCount={filteredRes.length}
            secButtons={<>
              <Btn onClick={() => setShowExcelUpload(true)}>📤 엑셀 일괄등록</Btn>
              <Btn primary onClick={() => setShowAddRes(true)}>+ 자원추가</Btn>
            </>}
            data={filteredRes}
            onRow={r => setPanelRes(r)}
            rowStyle={r => r.st === "미사용" ? { opacity: 0.4 } : {}}
            cols={[
              { t:"상태",         k:"st",         w:80,   r:(v)=><YnBadge v={v}/> },
              { t:"자원명",       k:"nm",         w:180,  align:"left",
                r:(v)=><Box component="span" sx={{fontWeight:600,color:C.pri}}>{v}</Box> },
              { t:"정보시스템",   k:"sysNm",      align:"left" },
              { t:"연결된 점검표", k:"clId",       align:"left",
                r:(v,r)=>{ const cl=v?CL_INIT.find(c=>String(c.id)===String(v)):CL_INIT.find(c=>c.sub===r.mid);
                  return cl
                    ?<Box component="span" sx={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"2px 10px",borderRadius:"10px",fontSize:12,fontWeight:600,background:"#dcfce7",color:"#166534"}}>
                       <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>{cl.nm}
                     </Box>
                    :<Box component="span" sx={{fontSize:12,color:C.txL}}>—</Box>;} },
              { t:"점검자",       k:"inspectors",
                r:(v)=>(v&&v.length>0)?v.map(uid=>{const u=USERS.find(x=>x.userId===uid);return u?u.userNm:uid;}).join(", "):"—" },
              { t:"대분류",       k:"large" },
              { t:"중분류",       k:"mid" },
              { t:"소분류",       k:"small" },
              { t:"IP",           k:"ip" },
              { t:"OS",           k:"os",          r:(v)=>v||"—" },
            ]}
          />
        </Box>
      </Stack>

      <AddSystemModal open={showAddSystem} onClose={() => setShowAddSystem(false)} onSubmit={handleAddSystem} systems={systems} />
      <ResourcePanel open={!!panelRes}  onClose={() => setPanelRes(null)}    resource={panelRes} onSubmit={handleResourceSubmit} onDelete={handleDeleteResource} systems={systems} hasLinkedCL={panelRes ? (panelRes.clId !== "none" && !!(panelRes.clId || CL_INIT.find(c => c.sub === panelRes.mid))) : false} />
      <ResourcePanel open={showAddRes}  onClose={() => setShowAddRes(false)} resource={null}     onSubmit={handleResourceSubmit} systems={systems} defaultSysId={sel || ""} />
      <SystemDetailPanel open={showSysDetail} onClose={() => setShowSysDetail(false)} system={detailSys} onUpdate={handleUpdateSystem} onDelete={handleDeleteSystem} resCount={detailSys ? resources.filter(r => r.sysId === detailSys.id).length : 0} />
      <ExcelUploadModal open={showExcelUpload} onClose={() => { setShowExcelUpload(false); if(toast) toast("엑셀 업로드가 완료되었습니다."); }} />
    </Box>
  );
};

interface ManagerResourcesPageProps {
  toast?: (message: string, success?: boolean) => void;
}

export default function ManagerResourcesPage() { return <MgrRes />; }
