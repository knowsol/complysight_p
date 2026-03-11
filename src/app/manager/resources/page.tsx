// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { YnBadge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/Input';
import { colors } from '@/lib/theme/colors';
import { hoverBg } from '@/lib/theme/styles';
import { SYS } from '@/data/manager';
import { RES } from '@/data/resources';
import { CL_INIT } from '@/data/checklists';
import { USERS } from '@/data/users';
import { AddSystemModal, ExcelUploadModal, ResourcePanel, SystemDetailPanel } from '@/components/panels';
import css from './page.module.css';


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
  const styles = {
    sysCounter: (canAdd: boolean) => ({ fontSize: 11, color: canAdd ? colors.textLight : colors.red, fontWeight: 500 }),
    sysItem: (active: boolean, dragging: boolean, useYn: string) => ({
      display: "flex", alignItems: "center",
      padding: "8px 14px 8px 10px", cursor: "pointer", borderRadius: 6, margin: "0 6px",
      background: active ? colors.primaryLight : dragging ? "#F0F9FF" : "transparent",
      opacity: useYn === "N" ? 0.4 : 1,
      transition: "all .3s",
    }),
    allItem: (active: boolean) => ({
      display: "flex", alignItems: "center",
      padding: "9px 14px", cursor: "pointer", borderRadius: 6, margin: "0 6px",
      background: active ? colors.primaryLight : "transparent",
      transition: "all .3s",
    }),
    sysName: (active: boolean) => ({ fontSize: 15, fontWeight: active ? 600 : 500, color: active ? colors.secondary : colors.text, flex: 1 }),
    sysNameText: (active: boolean) => ({
      fontSize: 15, fontWeight: active ? 600 : 500, color: active ? colors.secondary : colors.text,
      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: "20px",
    }),
  };
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
    const newSys = {
      id: form.systemId,
      nm: form.systemNm,
      type: form.systemType,
      org: form.mgmtOrg || "—",
      useYn: form.useYn,
      mem: form.members.length,
      res: 0,
      maintEndDate: "",
      ref1: "",
      ref2: "",
      ref3: "",
      systemDesc: form.systemDesc || "",
      operStartDt: form.operStartDt || "",
      operEndDt: form.operEndDt || "",
      managerNm: form.managerNm || "",
      managerPhone: form.managerPhone || "",
      contractInfo: form.contractInfo || "",
      memo: form.memo || "",
      members: [...(form.members || [])],
    };
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
    <div>
      <PageHeader title="자원관리" breadcrumb="홈 > 자원관리" />

      <div className={css.layout}>

        {/* ── 왼쪽: 정보시스템 패널 ── */}
        <div className={css.leftPanel}>
          <div className={css.leftHeader}>
            <div className={css.leftTitleRow}>
              <span className={css.leftTitle}>정보시스템</span>
              <span style={styles.sysCounter(canAddSystem)}>
                {currentSysCount - 1}/{maxSystems - 1}
              </span>
            </div>
            <div onClick={handleAddSystemClick}
              className={css.addSysBtn}
              {...hoverBg("", colors.primaryLight)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={canAddSystem ? colors.textLight : colors.red} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </div>
          </div>
          {/* 시스템 수 제한 안내 토스트 */}
          {sysLimitToast && (
            <div className={css.limitToast}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" className={css.warningIcon}>
                <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
              </svg>
              <span className={css.limitText}>
                현재 플랜(Standard)에서 정보시스템은 최대 <strong>{maxSystems - 1}개</strong>까지 등록 가능합니다. 추가 등록이 필요한 경우 라이선스를 업그레이드하세요.
              </span>
            </div>
          )}
          <div className={css.sysListWrap}>
            {/* 검색 */}
            <div className={css.searchWrap}>
              <div className={css.searchInner}>
                <svg className={css.searchIcon}
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <FormInput value={sysSearch} onChange={e => setSysSearch(e.target.value)}
                  placeholder="시스템 검색"
                  className={css.searchInput} />
                {sysSearch && (
                  <span onClick={() => setSysSearch("")}
                    className={css.clearBtn}>×</span>
                )}
              </div>
            </div>
            {/* 전체 */}
            {(() => {
              const active = sel === null;
              return (
                <div onClick={() => { setSel(null); setResPage(1); }}
                  style={styles.allItem(active)}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = colors.primaryLight; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? colors.primaryLight : "transparent"; }}>
                  <span style={styles.sysName(active)}>전체</span>
                  <span className={css.sysBadge}>{resources.length}</span>
                </div>
              );
            })()}
            {/* 시스템 목록 */}
            {systems.filter(s => !sysSearch || s.nm.toLowerCase().includes(sysSearch.toLowerCase())).map((s, idx) => {
              const active = sel === s.id;
              return (
                <div key={s.id}
                  draggable
                  onDragStart={e => handleDragStart(e, idx)}
                  onDragOver={e => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  style={styles.sysItem(active, dragIdx === idx, s.useYn)}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = colors.primaryLight; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? colors.primaryLight : "transparent"; }}>
                  <div className={css.sysItemContent} onClick={() => { setSel(active ? null : s.id); setResPage(1); }}>
                    <div style={styles.sysNameText(active)}>{s.nm}</div>
                    <div className={css.sysSub}>자원 {s.res}개 · 구성원 {s.mem}명</div>
                  </div>
                  {/* 상세 아이콘 버튼 (세로 점 3개) */}
                  <button
                    onClick={e => { e.stopPropagation(); setDetailSys(s); setShowSysDetail(true); }}
                    className={css.detailBtn}
                    onMouseEnter={e => { e.currentTarget.style.background = colors.primaryLight; e.currentTarget.style.color = colors.primary; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = colors.textLight; }}
                    title="상세 보기">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 오른쪽: 자원 목록 ── */}
        <div className={css.rightPanel}>

          <SearchBar placeholder="자원명 또는 IP로 검색"
            fields={[{ key:"status", label:"상태", type:"select", options:["전체","사용","미사용"] }]}
            onSearch={(f, kw) => { setResKw(kw); setResSt(f.status||"전체"); setResPage(1); }} />

          <DataTable
            sectionTitle={`${sel ? selSysNm : "전체"} 자원 목록`}
            sectionCount={filteredRes.length}
            sectionButtons={<>
              <Button onClick={() => setShowExcelUpload(true)}>📤 엑셀 일괄등록</Button>
              <Button primary onClick={() => setShowAddRes(true)}>+ 자원추가</Button>
            </>}
            data={filteredRes}
            onRow={r => setPanelRes(r)}
            rowStyle={r => r.st === "미사용" ? { opacity: 0.4 } : {}}
            cols={[
              { title:"상태",         fieldKey:"st",         width:80,   renderCell:(v)=><YnBadge value={v}/> },
              { title:"자원명",       fieldKey:"nm",         width:180,  align:"left",
                renderCell:(v)=><span className={css.linkText}>{v}</span> },
              { title:"정보시스템",   fieldKey:"sysNm",      align:"left" },
              { title:"연결된 점검표", fieldKey:"clId",       align:"left",
                renderCell:(v,r)=>{ const cl=v?CL_INIT.find(c=>String(c.id)===String(v)):CL_INIT.find(c=>c.sub===r.mid);
                  return cl
                    ?<span className={css.checklistTag}>
                       <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>{cl.nm}
                     </span>
                    :<span className={css.checklistEmpty}>—</span>;} },
              { title:"점검자",       fieldKey:"inspectors",
                renderCell:(v)=>(v&&v.length>0)?v.map(uid=>{const u=USERS.find(x=>x.userId===uid);return u?u.userNm:uid;}).join(", "):"—" },
              { title:"대분류",       fieldKey:"large" },
              { title:"중분류",       fieldKey:"mid" },
              { title:"소분류",       fieldKey:"small" },
              { title:"IP",           fieldKey:"ip" },
              { title:"OS",           fieldKey:"os",          renderCell:(v)=>v||"—" },
            ]}
          />
        </div>
      </div>

      <AddSystemModal open={showAddSystem} onClose={() => setShowAddSystem(false)} onSubmit={handleAddSystem} systems={systems} />
      <ResourcePanel open={!!panelRes}  onClose={() => setPanelRes(null)}    resource={panelRes} onSubmit={handleResourceSubmit} onDelete={handleDeleteResource} systems={systems} hasLinkedCL={panelRes ? (panelRes.clId !== "none" && !!(panelRes.clId || CL_INIT.find(c => c.sub === panelRes.mid))) : false} />
      <ResourcePanel open={showAddRes}  onClose={() => setShowAddRes(false)} resource={null}     onSubmit={handleResourceSubmit} systems={systems} defaultSysId={sel || ""} />
      <SystemDetailPanel open={showSysDetail} onClose={() => setShowSysDetail(false)} system={detailSys} onUpdate={handleUpdateSystem} onDelete={handleDeleteSystem} resCount={detailSys ? resources.filter(r => r.sysId === detailSys.id).length : 0} />
      <ExcelUploadModal open={showExcelUpload} onClose={() => { setShowExcelUpload(false); if(toast) toast("엑셀 업로드가 완료되었습니다."); }} />
    </div>
  );
};

interface ManagerResourcesPageProps {
  toast?: (message: string, success?: boolean) => void;
}

export default function ManagerResourcesPage() { return <MgrRes />; }
