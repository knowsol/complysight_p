// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { YnBadge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { FormInput, FormTextarea } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { FormRow, PanelDeleteButton, SectionTitle } from '@/components/ui/FormRow';
import { Radio } from '@/components/ui/Radio';
import { C } from '@/lib/theme/colors';
import { fInput } from '@/lib/theme/styles';
import { ConfirmModal } from '@/components/ui/ConfirmModal';


const MgrCode = () => {
  const INIT_GROUPS = [
    { id:"GRP001", nm:"자원유형",     desc:"자원 대분류/중분류/소분류 구분 코드", cnt:6, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP002", nm:"점검상태",     desc:"점검 진행 상태 코드",               cnt:4, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP003", nm:"점검결과",     desc:"점검 결과 판정 코드",               cnt:2, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP004", nm:"사용자역할",   desc:"시스템 내 사용자 권한 유형",         cnt:4, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP005", nm:"점검유형",     desc:"일상/특별 점검 유형 코드",           cnt:2, useYn:"Y", regDt:"2026-01-11" },
    { id:"GRP006", nm:"특별점검종류", desc:"특별점검 세부 종류 코드",            cnt:4, useYn:"Y", regDt:"2026-01-11" },
    { id:"GRP007", nm:"정기점검주기", desc:"정기점검 반복 주기 코드",            cnt:3, useYn:"Y", regDt:"2026-01-12" },
    { id:"GRP008", nm:"알림유형",     desc:"발송 알림 종류 코드",               cnt:5, useYn:"Y", regDt:"2026-01-15" },
    { id:"GRP009", nm:"파일유형",     desc:"첨부 가능한 파일 형식 코드",         cnt:8, useYn:"N", regDt:"2026-01-20" },
    { id:"GRP010", nm:"시스템유형",   desc:"정보시스템 유형 분류 코드",          cnt:3, useYn:"Y", regDt:"2026-01-20" },
  ];
  const INIT_CODES = {
    GRP001: [
      { id:"C001001", grpId:"GRP001", cd:"HW",  nm:"하드웨어",  desc:"물리 서버·장비",      sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001002", grpId:"GRP001", cd:"SW",  nm:"소프트웨어",desc:"OS·미들웨어·앱",      sort:2, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001003", grpId:"GRP001", cd:"NW",  nm:"네트워크",  desc:"스위치·라우터·방화벽", sort:3, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001004", grpId:"GRP001", cd:"SEC", nm:"보안",      desc:"보안 장비 및 솔루션",  sort:4, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001005", grpId:"GRP001", cd:"DB",  nm:"DBMS",     desc:"데이터베이스 서버",     sort:5, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001006", grpId:"GRP001", cd:"WAS", nm:"WAS",      desc:"웹 애플리케이션 서버",  sort:6, useYn:"Y", regDt:"2026-01-10" },
    ],
    GRP002: [
      { id:"C002001", grpId:"GRP002", cd:"REQ",  nm:"요청", desc:"점검 요청 상태",  sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C002002", grpId:"GRP002", cd:"STP",  nm:"중단", desc:"점검 중단 상태",  sort:2, useYn:"Y", regDt:"2026-01-10" },
      { id:"C002003", grpId:"GRP002", cd:"DLY",  nm:"지연", desc:"기한 초과 지연",  sort:3, useYn:"Y", regDt:"2026-01-10" },
      { id:"C002004", grpId:"GRP002", cd:"DONE", nm:"완료", desc:"점검 완료 상태",  sort:4, useYn:"Y", regDt:"2026-01-10" },
    ],
    GRP003: [
      { id:"C003001", grpId:"GRP003", cd:"OK", nm:"정상",   desc:"정상 판정",   sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C003002", grpId:"GRP003", cd:"NG", nm:"비정상", desc:"비정상 판정", sort:2, useYn:"Y", regDt:"2026-01-10" },
    ],
    GRP004: [
      { id:"C004001", grpId:"GRP004", cd:"SYS", nm:"시스템 관리자", desc:"전체 권한",      sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C004002", grpId:"GRP004", cd:"ORG", nm:"기관 관리자",   desc:"기관 범위 권한", sort:2, useYn:"Y", regDt:"2026-01-10" },
      { id:"C004003", grpId:"GRP004", cd:"MNT", nm:"유지보수 총괄", desc:"점검 운영 권한", sort:3, useYn:"Y", regDt:"2026-01-10" },
      { id:"C004004", grpId:"GRP004", cd:"USR", nm:"사용자",        desc:"점검 수행 권한", sort:4, useYn:"Y", regDt:"2026-01-10" },
    ],
  };

  const EMPTY_GRP  = { id:"", nm:"", desc:"", useYn:"Y" };
  const EMPTY_CODE = { id:"", cd:"", nm:"", desc:"", sort:1, useYn:"Y" };

  const [groups,     setGroups]     = useState(INIT_GROUPS);
  const [codes,      setCodes]      = useState(INIT_CODES);
  const [selGrp,     setSelGrp]     = useState(INIT_GROUPS[0]);
  const [grpQ,       setGrpQ]       = useState("");
  const [codeQ,      setCodeQ]      = useState("");

  /* 그룹 패널 - isNew: 신규 추가 모드 */
  const [grpPanel,   setGrpPanel]   = useState(false);
  const [grpForm,    setGrpForm]    = useState(EMPTY_GRP);
  const [grpIsNew,   setGrpIsNew]   = useState(false);
  const [grpErrors,  setGrpErrors]  = useState({});
  const [grpDel,     setGrpDel]     = useState(null);

  /* 코드 패널 */
  const [codePanel,  setCodePanel]  = useState(false);
  const [codeForm,   setCodeForm]   = useState(EMPTY_CODE);
  const [codeIsNew,  setCodeIsNew]  = useState(false);
  const [codeErrors, setCodeErrors] = useState({});
  const [codeDel,    setCodeDel]    = useState(null);

  const [showUpload, setShowUpload] = useState(false);

  const sgf = (k,v) => setGrpForm(p=>({...p,[k]:v}));
  const scf = (k,v) => setCodeForm(p=>({...p,[k]:v}));

  const filteredGroups = groups.filter(g => !grpQ || g.nm.includes(grpQ) || g.id.includes(grpQ));
  const curCodes = (codes[selGrp?.id]||[])
    .filter(c => !codeQ || c.nm.includes(codeQ) || c.cd.includes(codeQ))
    .sort((a,b)=>a.sort-b.sort);

  /* 그룹 행 클릭 → 좌측은 selGrp 변경, 더블클릭 또는 아이콘 클릭 → 패널 오픈 */
  const openGrpPanel = (g, isNew=false) => {
    setGrpIsNew(isNew);
    setGrpForm(isNew ? EMPTY_GRP : {...g});
    setGrpErrors({});
    setGrpPanel(true);
  };

  /* 코드 행 클릭 → 패널 오픈 */
  const openCodePanel = (c, isNew=false) => {
    setCodeIsNew(isNew);
    setCodeForm(isNew ? {...EMPTY_CODE, sort:(codes[selGrp?.id]||[]).length+1} : {...c});
    setCodeErrors({});
    setCodePanel(true);
  };

  const saveGroup = () => {
    const e = {};
    if (!grpForm.id.trim()) e.id = "그룹 ID를 입력하세요.";
    if (!grpForm.nm.trim()) e.nm = "그룹명을 입력하세요.";
    setGrpErrors(e);
    if (Object.keys(e).length) return;
    if (grpIsNew) {
      if (groups.some(g=>g.id===grpForm.id)) { setGrpErrors({id:"이미 존재하는 그룹 ID입니다."}); return; }
      setGroups(p=>[...p, {...grpForm, cnt:0, regDt:"2026-02-24"}]);
    } else {
      setGroups(p=>p.map(g=>g.id===grpForm.id ? {...g,...grpForm} : g));
      if (selGrp?.id===grpForm.id) setSelGrp(prev=>({...prev,...grpForm}));
    }
    setGrpPanel(false);
  };

  const saveCode = () => {
    const e = {};
    if (!codeForm.cd.trim()) e.cd = "코드값을 입력하세요.";
    if (!codeForm.nm.trim()) e.nm = "코드명을 입력하세요.";
    setCodeErrors(e);
    if (Object.keys(e).length) return;
    if (codeIsNew) {
      const nc = {...codeForm, id:`${selGrp.id}_${Date.now()}`, grpId:selGrp.id, regDt:"2026-02-24"};
      setCodes(p=>({...p, [selGrp.id]:[...(p[selGrp.id]||[]), nc]}));
      setGroups(p=>p.map(g=>g.id===selGrp.id ? {...g, cnt:g.cnt+1} : g));
    } else {
      setCodes(p=>({...p, [selGrp.id]: p[selGrp.id].map(c=>c.id===codeForm.id ? {...c,...codeForm} : c)}));
    }
    setCodePanel(false);
  };

  const deleteGroup = (id) => {
    setGroups(p=>p.filter(g=>g.id!==id));
    if (selGrp?.id===id) setSelGrp(groups.find(g=>g.id!==id)||null);
    setGrpDel(null); setGrpPanel(false);
  };
  const deleteCode = (cid) => {
    setCodes(p=>({...p, [selGrp.id]:(p[selGrp.id]||[]).filter(c=>c.id!==cid)}));
    setGroups(p=>p.map(g=>g.id===selGrp.id ? {...g, cnt:Math.max(0,g.cnt-1)} : g));
    setCodeDel(null); setCodePanel(false);
  };

  const inp = {...fInput};
  const ro  = {background:"#f0f1f3", color:C.txS, pointerEvents:"none"};
  const err = (msg) => msg ? <div style={{fontSize:12,color:"#ef4444",marginTop:3}}>{msg}</div> : null;







  return (
    <div>
      <PageHeader title="공통코드" bc="홈 > 환경설정 > 공통코드" />

      <div style={{ display: "flex", gap: 14, alignItems: "start" }}>

        {/* ── 좌: 코드 그룹 ── */}
        <div style={{ width: 240, flexShrink: 0, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 6, overflow: "hidden", position: "sticky", top: 0, maxHeight: "calc(100vh - 170px)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.brd}`,
            display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.txH }}>코드 그룹</span>
            <div onClick={() => openGrpPanel(null, true)}
              style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 4, cursor: "pointer", transition: "background .15s", border: "none", outline: "none" }}
              onMouseEnter={e => e.currentTarget.style.background = C.priL}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </div>
          </div>
          <div style={{ padding: "6px 0", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ padding: "6px 10px 4px", flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <FormInput value={grpQ} onChange={e => setGrpQ(e.target.value)}
                  placeholder="그룹 검색"
                  style={{ width: "100%", padding: "6px 24px 6px 26px", fontSize: 12, border: `1px solid ${C.brd}`,
                    borderRadius: 6, outline: "none", boxSizing: "border-box", background: "#F8FAFC", color: C.txt, fontFamily: "inherit" }} />
                {grpQ && (
                  <span onClick={() => setGrpQ("")}
                    style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)",
                      cursor: "pointer", color: C.txL, fontSize: 14, lineHeight: 1 }}>×</span>
                )}
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", paddingTop: 4 }}>
              {filteredGroups.map(g => {
                const isSel = selGrp?.id === g.id;
                return (
                  <div key={g.id}
                    onClick={() => { setSelGrp(g); setCodeQ(""); setCodePanel(false); }}
                    onDoubleClick={() => openGrpPanel(g, false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
                      cursor: "pointer", borderRadius: 6, margin: "1px 6px",
                      background: isSel ? C.priL : "transparent", transition: "background .15s" }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = C.bgSec; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isSel ? C.priL : "transparent"; }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: isSel ? 600 : 400, color: isSel ? C.pri : C.txt,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.nm}</div>
                      <div style={{ fontSize: 11, color: C.txL, marginTop: 1 }}>{g.id}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      {g.useYn === "N" && <span style={{ fontSize: 10, padding: "1px 5px", borderRadius: 3, background: "#F9FAFC", color: C.txL }}>미사용</span>}
                      <span style={{ fontSize: 11, color: C.txL, background: C.bgSec, borderRadius: 10, padding: "1px 7px", minWidth: 18, textAlign: "center" }}>{g.cnt}</span>
                    </div>
                  </div>
                );
              })}
              {!filteredGroups.length && <div style={{ padding: 30, textAlign: "center", color: C.txL, fontSize: 12 }}>검색 결과 없음</div>}
            </div>
          </div>
        </div>

        {/* ── 우: 코드 목록 ── */}
        <div style={{flex:1, minWidth:0}}>
          {!selGrp ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:C.txL}}>
              <div style={{fontSize:36,marginBottom:10}}>☰</div>
              <div style={{fontSize:12}}>왼쪽에서 코드 그룹을 선택하세요.</div>
            </div>
          ) : (<>
            <SearchBar ph="코드값 또는 코드명 검색" />
            <DataTable secTitle={`${selGrp.nm} 코드 목록`} secCount={curCodes.length} secButtons={<div style={{display:"flex",gap:4}}>
              <Button small onClick={()=>setShowUpload(true)}>📤 엑셀 업로드</Button>
              <Button small>📥 엑셀 다운로드</Button>
              <Button variant="primary" onClick={()=>openCodePanel(null, true)}>+ 코드 추가</Button>
            </div>} onRow={row => openCodePanel(row, false)} cols={[
              { t: "순서", k: "sort" },
              { t: "코드값", k: "cd", r: v => <span style={{fontFamily:"inherit",padding:"2px 8px",background:C.priL,borderRadius:4,color:C.pri,fontWeight:700}}>{v}</span> },
              { t: "항목", k: "nm", r: v => <span style={{fontWeight:600,color:C.pri}}>{v}</span> },
              { t: "설명", k: "desc", r: v => v || "—" },
              { t: "사용여부", k: "useYn", r: v => <YnBadge v={v} /> },
              { t: "등록일", k: "regDt" },
            ]} data={curCodes} />
          </>)}
        </div>
      </div>

      {/* ── 사이드 패널: 코드 그룹 ── */}
      <SidePanel open={grpPanel} onClose={()=>setGrpPanel(false)}
        title={grpIsNew ? "코드 그룹 추가" : "코드 그룹 수정"} width={480} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {!grpIsNew && <PanelDeleteButton onClick={()=>setGrpDel(grpForm.id)} />}
        <SectionTitle label="그룹 정보" primary />
        <FormRow label="그룹 ID" required>
          <FormInput value={grpForm.id} onChange={e=>sgf("id",e.target.value.toUpperCase())}
            placeholder="예) GRP011" maxLength={20}
            style={{...inp,...(!grpIsNew?ro:{})}} readOnly={!grpIsNew} />
          {err(grpErrors.id)}
        </FormRow>
        <FormRow label="그룹명" required>
          <FormInput value={grpForm.nm} onChange={e=>sgf("nm",e.target.value)}
            placeholder="예) 자원유형" style={inp} maxLength={50} />
          {err(grpErrors.nm)}
        </FormRow>
        <FormRow label="설명">
          <FormTextarea value={grpForm.desc} onChange={e=>sgf("desc",e.target.value)}
            placeholder="코드 그룹에 대한 설명을 입력하세요" rows={3}
            style={{...inp, resize:"none", fontFamily:"inherit"}} maxLength={200} />
        </FormRow>
        <FormRow label="사용여부">
          <Radio value={grpForm.useYn} onChange={v=>sgf("useYn",v)} />
        </FormRow>
      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button onClick={()=>setGrpPanel(false)}>취소</Button>
          <div style={{ flex: 1 }} />
          <Button primary onClick={saveGroup}>{grpIsNew ? "등록" : "저장"}</Button>
        </div>
      </div>
      </SidePanel>

      {/* ── 사이드 패널: 코드 ── */}
      <SidePanel open={codePanel} onClose={()=>setCodePanel(false)}
        title={codeIsNew ? "코드 추가" : "코드 수정"} width={480} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {!codeIsNew && <PanelDeleteButton onClick={()=>setCodeDel(codeForm.id)} />}
        <SectionTitle label="코드 정보" primary />
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1}}>
            <FormRow label="코드값" required>
              <FormInput value={codeForm.cd} onChange={e=>scf("cd",e.target.value.toUpperCase())}
                placeholder="예) HW" maxLength={30}
                style={{...inp,...(!codeIsNew?ro:{})}} readOnly={!codeIsNew} />
              {err(codeErrors.cd)}
            </FormRow>
          </div>
          <div style={{width:80}}>
            <FormRow label="순서">
              <FormInput type="number" min={1} value={codeForm.sort}
                onChange={e=>scf("sort",parseInt(e.target.value)||1)} style={inp} />
            </FormRow>
          </div>
        </div>
        <FormRow label="코드명" required>
          <FormInput value={codeForm.nm} onChange={e=>scf("nm",e.target.value)}
            placeholder="예) 하드웨어" style={inp} maxLength={50} />
          {err(codeErrors.nm)}
        </FormRow>
        <FormRow label="설명">
          <FormTextarea value={codeForm.desc} onChange={e=>scf("desc",e.target.value)}
            placeholder="코드에 대한 설명" rows={2}
            style={{...inp, resize:"none", fontFamily:"inherit"}} maxLength={200} />
        </FormRow>
        <FormRow label="사용여부">
          <Radio value={codeForm.useYn} onChange={v=>scf("useYn",v)} />
        </FormRow>
      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button onClick={()=>setCodePanel(false)}>취소</Button>
          <div style={{ flex: 1 }} />
          <Button primary onClick={saveCode}>{codeIsNew ? "등록" : "저장"}</Button>
        </div>
      </div>
      </SidePanel>

      {/* ── 엑셀 업로드 모달 ── */}
      {showUpload && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:12,padding:32,width:440,boxShadow:"0 12px 40px rgba(0,0,0,.18)"}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>엑셀 업로드</div>
            <div style={{fontSize:12,color:C.txS,marginBottom:20}}>엑셀 파일을 업로드하면 코드 그룹 및 코드가 일괄 등록됩니다.</div>
            <div style={{border:`2px dashed ${C.brd}`,borderRadius:8,padding:"30px 0",textAlign:"center",marginBottom:16,color:C.txL,cursor:"pointer",background:"#f8fafc"}}>
              <div style={{fontSize:28,marginBottom:8}}>📂</div>
              <div style={{fontSize:12}}>파일을 드래그하거나 클릭하여 선택</div>
              <div style={{fontSize:12,marginTop:4}}>.xlsx, .xls 형식 지원 / 최대 5MB</div>
            </div>
            <div style={{fontSize:12,color:C.pri,marginBottom:20,cursor:"pointer"}}>▼ 업로드 양식 다운로드</div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
              <Button onClick={()=>setShowUpload(false)}>취소</Button>
              <Button primary onClick={()=>setShowUpload(false)}>업로드</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!grpDel} title="코드 그룹 삭제" msg="해당 그룹과 하위 코드 전체가 삭제됩니다. 계속하시겠습니까?"
        onOk={()=>deleteGroup(grpDel)} onCancel={()=>setGrpDel(null)} />
      <ConfirmModal open={!!codeDel} title="코드 삭제" msg="선택한 코드를 삭제합니다. 계속하시겠습니까?"
        onOk={()=>deleteCode(codeDel)} onCancel={()=>setCodeDel(null)} />
    </div>
  );
};

interface ManagerSettingsCommonCodePageProps {}

export default function ManagerSettingsCommonCodePage() { return (
  <>
    <MgrCode />
  </>
); }
