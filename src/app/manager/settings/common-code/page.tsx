// @ts-nocheck
'use client';

import { useState } from 'react';
import { PH } from '@/components/ui/PageHeader';
import { Tbl } from '@/components/ui/Table';
import { YnBadge } from '@/components/ui/Badge';
import { SB } from '@/components/ui/SearchBar';
import { Btn, SecBtnP } from '@/components/ui/Button';
import { FInput, FTextarea } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { FormRow, PanelDeleteBtn, SecTitle } from '@/components/ui/FormRow';
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
      <PH title="공통코드" bc="홈 > 환경설정 > 공통코드" />

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
                <FInput value={grpQ} onChange={e => setGrpQ(e.target.value)}
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
            <SB ph="코드값 또는 코드명 검색" />
            <Tbl secTitle={`${selGrp.nm} 코드 목록`} secCount={curCodes.length} secButtons={<div style={{display:"flex",gap:4}}>
              <Btn small onClick={()=>setShowUpload(true)}>📤 엑셀 업로드</Btn>
              <Btn small>📥 엑셀 다운로드</Btn>
              <SecBtnP onClick={()=>openCodePanel(null, true)}>+ 코드 추가</SecBtnP>
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
        {!grpIsNew && <PanelDeleteBtn onClick={()=>setGrpDel(grpForm.id)} />}
        <SecTitle label="그룹 정보" primary />
        <FormRow label="그룹 ID" required>
          <FInput value={grpForm.id} onChange={e=>sgf("id",e.target.value.toUpperCase())}
            placeholder="예) GRP011" maxLength={20}
            style={{...inp,...(!grpIsNew?ro:{})}} readOnly={!grpIsNew} />
          {err(grpErrors.id)}
        </FormRow>
        <FormRow label="그룹명" required>
          <FInput value={grpForm.nm} onChange={e=>sgf("nm",e.target.value)}
            placeholder="예) 자원유형" style={inp} maxLength={50} />
          {err(grpErrors.nm)}
        </FormRow>
        <FormRow label="설명">
          <FTextarea value={grpForm.desc} onChange={e=>sgf("desc",e.target.value)}
            placeholder="코드 그룹에 대한 설명을 입력하세요" rows={3}
            style={{...inp, resize:"none", fontFamily:"inherit"}} maxLength={200} />
        </FormRow>
        <FormRow label="사용여부">
          <Radio value={grpForm.useYn} onChange={v=>sgf("useYn",v)} />
        </FormRow>
      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={()=>setGrpPanel(false)}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={saveGroup}>{grpIsNew ? "등록" : "저장"}</Btn>
        </div>
      </div>
      </SidePanel>

      {/* ── 사이드 패널: 코드 ── */}
      <SidePanel open={codePanel} onClose={()=>setCodePanel(false)}
        title={codeIsNew ? "코드 추가" : "코드 수정"} width={480} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {!codeIsNew && <PanelDeleteBtn onClick={()=>setCodeDel(codeForm.id)} />}
        <SecTitle label="코드 정보" primary />
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1}}>
            <FormRow label="코드값" required>
              <FInput value={codeForm.cd} onChange={e=>scf("cd",e.target.value.toUpperCase())}
                placeholder="예) HW" maxLength={30}
                style={{...inp,...(!codeIsNew?ro:{})}} readOnly={!codeIsNew} />
              {err(codeErrors.cd)}
            </FormRow>
          </div>
          <div style={{width:80}}>
            <FormRow label="순서">
              <FInput type="number" min={1} value={codeForm.sort}
                onChange={e=>scf("sort",parseInt(e.target.value)||1)} style={inp} />
            </FormRow>
          </div>
        </div>
        <FormRow label="코드명" required>
          <FInput value={codeForm.nm} onChange={e=>scf("nm",e.target.value)}
            placeholder="예) 하드웨어" style={inp} maxLength={50} />
          {err(codeErrors.nm)}
        </FormRow>
        <FormRow label="설명">
          <FTextarea value={codeForm.desc} onChange={e=>scf("desc",e.target.value)}
            placeholder="코드에 대한 설명" rows={2}
            style={{...inp, resize:"none", fontFamily:"inherit"}} maxLength={200} />
        </FormRow>
        <FormRow label="사용여부">
          <Radio value={codeForm.useYn} onChange={v=>scf("useYn",v)} />
        </FormRow>
      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={()=>setCodePanel(false)}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={saveCode}>{codeIsNew ? "등록" : "저장"}</Btn>
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
              <Btn onClick={()=>setShowUpload(false)}>취소</Btn>
              <Btn primary onClick={()=>setShowUpload(false)}>업로드</Btn>
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

const MgrCommonCode = () => {

  /* ── 샘플 데이터 ── */
  const INIT_GROUPS = [
    { id:"GRP001", nm:"자원 대분류",   desc:"자원의 최상위 분류 코드",   useYn:"Y", cnt:3, regDt:"2026-01-05" },
    { id:"GRP002", nm:"자원 중분류",   desc:"서버/WEB/WAS/DBMS 등 중분류", useYn:"Y", cnt:6, regDt:"2026-01-05" },
    { id:"GRP003", nm:"점검 유형",     desc:"일상점검, 특별점검 구분",   useYn:"Y", cnt:2, regDt:"2026-01-10" },
    { id:"GRP004", nm:"점검 종류",     desc:"점검 세부 종류 코드",       useYn:"Y", cnt:7, regDt:"2026-01-10" },
    { id:"GRP005", nm:"사용자 역할",   desc:"시스템 내 사용자 역할 코드", useYn:"Y", cnt:4, regDt:"2026-01-12" },
    { id:"GRP006", nm:"점검 상태",     desc:"예정/진행/지연/완료",       useYn:"Y", cnt:4, regDt:"2026-01-12" },
    { id:"GRP007", nm:"자원 상태",     desc:"사용/미사용 상태 코드",     useYn:"Y", cnt:2, regDt:"2026-01-15" },
    { id:"GRP008", nm:"시스템 유형",   desc:"정보시스템 유형 분류",     useYn:"Y", cnt:5, regDt:"2026-01-15" },
    { id:"GRP009", nm:"운영환경 구분", desc:"운영/개발/테스트",         useYn:"N", cnt:3, regDt:"2026-01-20" },
    { id:"GRP010", nm:"에이전트 타입", desc:"자동점검 에이전트 종류",   useYn:"Y", cnt:4, regDt:"2026-01-20" },
  ];

  const INIT_CODES = {
    GRP001: [
      { id:"C001-01", grpId:"GRP001", cd:"HW", nm:"하드웨어", desc:"서버, 네트워크 등 물리 장비", sort:1, useYn:"Y" },
      { id:"C001-02", grpId:"GRP001", cd:"SW", nm:"소프트웨어", desc:"WEB, WAS, DBMS 등 소프트웨어", sort:2, useYn:"Y" },
      { id:"C001-03", grpId:"GRP001", cd:"NW", nm:"네트워크", desc:"라우터, 스위치 등 네트워크 장비", sort:3, useYn:"Y" },
    ],
    GRP002: [
      { id:"C002-01", grpId:"GRP002", cd:"SVR", nm:"서버", desc:"물리/가상 서버", sort:1, useYn:"Y" },
      { id:"C002-02", grpId:"GRP002", cd:"WEB", nm:"WEB", desc:"웹서버", sort:2, useYn:"Y" },
      { id:"C002-03", grpId:"GRP002", cd:"WAS", nm:"WAS", desc:"웹 애플리케이션 서버", sort:3, useYn:"Y" },
      { id:"C002-04", grpId:"GRP002", cd:"DBMS", nm:"DBMS", desc:"데이터베이스 서버", sort:4, useYn:"Y" },
      { id:"C002-05", grpId:"GRP002", cd:"SEC", nm:"보안", desc:"방화벽, IDS/IPS 등", sort:5, useYn:"Y" },
      { id:"C002-06", grpId:"GRP002", cd:"ROUTER", nm:"네트워크", desc:"라우터/스위치", sort:6, useYn:"Y" },
    ],
    GRP003: [
      { id:"C003-01", grpId:"GRP003", cd:"DAILY",   nm:"일상점검", desc:"정기 반복 점검", sort:1, useYn:"Y" },
      { id:"C003-02", grpId:"GRP003", cd:"SPECIAL",  nm:"특별점검", desc:"비정기 특별 점검", sort:2, useYn:"Y" },
    ],
    GRP004: [
      { id:"C004-01", grpId:"GRP004", cd:"STATUS",   nm:"상태점검", desc:"자원 상태 확인", sort:1, useYn:"Y" },
      { id:"C004-02", grpId:"GRP004", cd:"VALID",    nm:"유효성점검", desc:"설정값 유효성", sort:2, useYn:"Y" },
      { id:"C004-03", grpId:"GRP004", cd:"SVC",      nm:"서비스점검", desc:"서비스 운영 확인", sort:3, useYn:"Y" },
      { id:"C004-04", grpId:"GRP004", cd:"OFFLINE",  nm:"오프라인점검", desc:"장비 직접 점검", sort:4, useYn:"Y" },
      { id:"C004-05", grpId:"GRP004", cd:"DUAL",     nm:"이중화점검", desc:"이중화 구성 점검", sort:5, useYn:"Y" },
      { id:"C004-06", grpId:"GRP004", cd:"PERF",     nm:"성능점검", desc:"성능 이슈 점검", sort:6, useYn:"Y" },
      { id:"C004-07", grpId:"GRP004", cd:"BUSY",     nm:"업무집중기간점검", desc:"피크타임 집중 점검", sort:7, useYn:"Y" },
    ],
    GRP005: [
      { id:"C005-01", grpId:"GRP005", cd:"SYS_ADMIN", nm:"시스템 관리자", desc:"전체 시스템 관리", sort:1, useYn:"Y" },
      { id:"C005-02", grpId:"GRP005", cd:"ORG_ADMIN", nm:"기관 관리자",   desc:"기관 단위 관리", sort:2, useYn:"Y" },
      { id:"C005-03", grpId:"GRP005", cd:"MAINT",     nm:"유지보수 총괄", desc:"점검 수행 관리", sort:3, useYn:"Y" },
      { id:"C005-04", grpId:"GRP005", cd:"USER",      nm:"사용자",        desc:"점검 수행 담당자", sort:4, useYn:"Y" },
    ],
    GRP006: [
      { id:"C006-01", grpId:"GRP006", cd:"REQ",   nm:"요청", desc:"점검 요청 상태", sort:1, useYn:"Y" },
      { id:"C006-02", grpId:"GRP006", cd:"STP",   nm:"중단", desc:"점검 중단 상태", sort:2, useYn:"Y" },
      { id:"C006-03", grpId:"GRP006", cd:"DELAY", nm:"지연", desc:"기한 초과 지연", sort:3, useYn:"Y" },
      { id:"C006-04", grpId:"GRP006", cd:"DONE",  nm:"완료", desc:"점검 완료",      sort:4, useYn:"Y" },
    ],
    GRP007: [
      { id:"C007-01", grpId:"GRP007", cd:"USE",   nm:"사용",   desc:"사용 중인 상태",  sort:1, useYn:"Y" },
      { id:"C007-02", grpId:"GRP007", cd:"UNUSE", nm:"미사용", desc:"미사용 처리 상태", sort:2, useYn:"Y" },
    ],
    GRP008: [
      { id:"C008-01", grpId:"GRP008", cd:"BIZ",   nm:"업무시스템", desc:"", sort:1, useYn:"Y" },
      { id:"C008-02", grpId:"GRP008", cd:"INF",   nm:"인프라",     desc:"", sort:2, useYn:"Y" },
      { id:"C008-03", grpId:"GRP008", cd:"SEC",   nm:"보안시스템", desc:"", sort:3, useYn:"Y" },
      { id:"C008-04", grpId:"GRP008", cd:"SHARE", nm:"공유자원",   desc:"", sort:4, useYn:"Y" },
      { id:"C008-05", grpId:"GRP008", cd:"EXT",   nm:"외부연계",   desc:"", sort:5, useYn:"Y" },
    ],
    GRP009: [
      { id:"C009-01", grpId:"GRP009", cd:"PROD",  nm:"운영", desc:"", sort:1, useYn:"N" },
      { id:"C009-02", grpId:"GRP009", cd:"DEV",   nm:"개발", desc:"", sort:2, useYn:"N" },
      { id:"C009-03", grpId:"GRP009", cd:"TEST",  nm:"테스트", desc:"", sort:3, useYn:"N" },
    ],
    GRP010: [
      { id:"C010-01", grpId:"GRP010", cd:"SSH",   nm:"SSH",  desc:"SSH 기반 점검", sort:1, useYn:"Y" },
      { id:"C010-02", grpId:"GRP010", cd:"SNMP",  nm:"SNMP", desc:"SNMP 프로토콜", sort:2, useYn:"Y" },
      { id:"C010-03", grpId:"GRP010", cd:"API",   nm:"API",  desc:"API 호출 방식", sort:3, useYn:"Y" },
      { id:"C010-04", grpId:"GRP010", cd:"AGENT", nm:"Agent", desc:"에이전트 설치", sort:4, useYn:"Y" },
    ],
  };

  const EMPTY_GRP  = { id:"", nm:"", desc:"", useYn:"Y" };
  const EMPTY_CODE = { id:"", cd:"", nm:"", desc:"", sort:1, useYn:"Y" };

  const [groups,    setGroups]    = useState(INIT_GROUPS);
  const [codesMap,  setCodesMap]  = useState(INIT_CODES);
  const [selGrp,    setSelGrp]    = useState(INIT_GROUPS[0]);
  const [grpSearch, setGrpSearch] = useState("");
  const [cdSearch,  setCdSearch]  = useState("");
  const [useFilter, setUseFilter] = useState("전체");

  /* 패널 상태 */
  const [panel,       setPanel]       = useState(null); // null | "grp-add" | "grp-edit" | "code-add" | "code-edit"
  const [grpForm,     setGrpForm]     = useState(EMPTY_GRP);
  const [codeForm,    setCodeForm]    = useState(EMPTY_CODE);
  const [grpErrors,   setGrpErrors]   = useState({});
  const [codeErrors,  setCodeErrors]  = useState({});

  /* 엑셀 업로드 모달 */
  const [uploadModal, setUploadModal] = useState(false);
  const [delGrpConfirm,  setDelGrpConfirm]  = useState(null);
  const [delCdConfirm,   setDelCdConfirm]   = useState(null);

  /* ── 유틸 ── */
  const sg  = (k, v) => setGrpForm(p => ({ ...p, [k]: v }));
  const sc  = (k, v) => setCodeForm(p => ({ ...p, [k]: v }));
  const closePanel = () => { setPanel(null); setGrpErrors({}); setCodeErrors({}); };

  const currentCodes = (codesMap[selGrp?.id] || [])
    .filter(c => useFilter === "전체" || c.useYn === (useFilter === "사용" ? "Y" : "N"))
    .filter(c => !cdSearch || c.cd.includes(cdSearch) || c.nm.includes(cdSearch))
    .sort((a, b) => a.sort - b.sort);

  const filteredGroups = groups.filter(g =>
    !grpSearch || g.id.includes(grpSearch) || g.nm.includes(grpSearch)
  );

  /* ── 그룹 저장 ── */
  const saveGroup = () => {
    const e = {};
    if (!grpForm.id.trim())  e.id = "그룹 ID를 입력하세요.";
    if (!grpForm.nm.trim())  e.nm = "그룹명을 입력하세요.";
    if (panel === "grp-add" && groups.find(g => g.id === grpForm.id)) e.id = "이미 존재하는 그룹 ID입니다.";
    setGrpErrors(e);
    if (Object.keys(e).length) return;
    if (panel === "grp-add") {
      const newG = { ...grpForm, cnt: 0, regDt: "2026-02-24" };
      setGroups(p => [...p, newG]);
      setCodesMap(p => ({ ...p, [grpForm.id]: [] }));
      setSelGrp(newG);
    } else {
      setGroups(p => p.map(g => g.id === grpForm.id ? { ...g, ...grpForm } : g));
      if (selGrp.id === grpForm.id) setSelGrp(p => ({ ...p, ...grpForm }));
    }
    closePanel();
  };

  /* ── 코드 저장 ── */
  const saveCode = () => {
    const e = {};
    if (!codeForm.cd.trim()) e.cd = "코드를 입력하세요.";
    if (!codeForm.nm.trim()) e.nm = "코드명을 입력하세요.";
    const existing = codesMap[selGrp.id] || [];
    if (panel === "code-add" && existing.find(c => c.cd === codeForm.cd)) e.cd = "이미 존재하는 코드입니다.";
    setCodeErrors(e);
    if (Object.keys(e).length) return;
    if (panel === "code-add") {
      const newC = { ...codeForm, id: `${selGrp.id}-${Date.now()}`, grpId: selGrp.id };
      setCodesMap(p => ({ ...p, [selGrp.id]: [...(p[selGrp.id]||[]), newC] }));
      setGroups(p => p.map(g => g.id === selGrp.id ? { ...g, cnt: g.cnt + 1 } : g));
    } else {
      setCodesMap(p => ({ ...p, [selGrp.id]: p[selGrp.id].map(c => c.id === codeForm.id ? { ...c, ...codeForm } : c) }));
    }
    closePanel();
  };

  /* ── 삭제 ── */
  const deleteGroup = (gid) => {
    setGroups(p => p.filter(g => g.id !== gid));
    setCodesMap(p => { const n = { ...p }; delete n[gid]; return n; });
    if (selGrp?.id === gid) setSelGrp(groups.find(g => g.id !== gid) || null);
    setDelGrpConfirm(null); closePanel();
  };
  const deleteCode = (cid) => {
    setCodesMap(p => ({ ...p, [selGrp.id]: p[selGrp.id].filter(c => c.id !== cid) }));
    setGroups(p => p.map(g => g.id === selGrp.id ? { ...g, cnt: Math.max(0, g.cnt - 1) } : g));
    setDelCdConfirm(null); closePanel();
  };

  /* ── 공통 스타일 ── */
  const thSt = { padding:"9px 12px", fontSize: 15, fontWeight: 400, color: C.txL,
    textAlign:"center", borderBottom:`1px solid ${C.brdD}`, whiteSpace:"nowrap", verticalAlign:"middle" };
  const tdSt = (sel) => ({ padding:"11px 12px", fontSize:15, color:C.txt,
    borderBottom:`1px solid ${C.brd}`, background: sel ? C.priL : "transparent", textAlign:"center", verticalAlign:"middle" });
  const useChip = (yn) => (
    <span style={{ padding:"2px 8px", borderRadius:10, fontSize:12, fontWeight:600,
      background: yn==="Y" ? "#dcfce7" : "#F9FAFC",
      color:      yn==="Y" ? "#16a34a" : "#929292" }}>{yn==="Y" ? "사용" : "미사용"}</span>
  );



  /* ── 그룹 패널 JSX ── */
  const GroupPanel = () => {
    const isEdit = panel === "grp-edit";
    return (
      <SidePanel open={panel==="grp-add"||panel==="grp-edit"} onClose={closePanel}
        title={isEdit ? "코드 그룹 수정" : "코드 그룹 등록"} width={480} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {isEdit && <PanelDeleteBtn onClick={() => setDelGrpConfirm(grpForm.id)} />}
        <SecTitle label="그룹 기본 정보" primary />
        <FormRow label="그룹 ID" required err={grpErrors.id}>
          <FInput value={grpForm.id} onChange={e => sg("id", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,""))}
            placeholder="예: GRP011" maxLength={20}
            readOnly={isEdit}
            style={{ ...fInput, ...(isEdit ? { background:"#f0f1f3", color:C.txS, pointerEvents:"none" } : {}) }} />
          <div style={{ fontSize:12, color:C.txS, marginTop:3 }}>영문 대문자·숫자만 입력 가능합니다.</div>
        </FormRow>
        <FormRow label="그룹명" required err={grpErrors.nm}>
          <FInput value={grpForm.nm} onChange={e => sg("nm", e.target.value)}
            placeholder="그룹명을 입력하세요" maxLength={50} style={fInput} />
        </FormRow>
        <FormRow label="설명">
          <FTextarea value={grpForm.desc} onChange={e => sg("desc", e.target.value)}
            placeholder="그룹에 대한 설명" rows={3}
            style={{ ...fInput, resize:"none", fontFamily:"inherit" }} />
        </FormRow>
        <FormRow label="사용여부">
          <Radio value={grpForm.useYn} onChange={v => sg("useYn", v)} />
        </FormRow>
      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={closePanel}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={saveGroup}>{isEdit ? "저장" : "등록"}</Btn>
        </div>
      </div>
      </SidePanel>
    );
  };

  /* ── 코드 패널 JSX ── */
  const CodePanel = () => {
    const isEdit = panel === "code-edit";
    return (
      <SidePanel open={panel==="code-add"||panel==="code-edit"} onClose={closePanel}
        title={isEdit ? `코드 수정 — ${selGrp?.nm}` : `코드 등록 — ${selGrp?.nm}`} width={480} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {isEdit && <PanelDeleteBtn onClick={() => setDelCdConfirm(codeForm.id)} />}
        <SecTitle label="코드 정보" primary />
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ flex:1 }}>
            <FormRow label="코드" required err={codeErrors.cd}>
              <FInput value={codeForm.cd} onChange={e => sc("cd", e.target.value.toUpperCase())}
                placeholder="예: SVR" maxLength={30}
                readOnly={isEdit}
                style={{ ...fInput, ...(isEdit ? { background:"#f0f1f3", color:C.txS, pointerEvents:"none" } : {}) }} />
            </FormRow>
          </div>
          <div style={{ width:80 }}>
            <FormRow label="정렬순서">
              <FInput type="number" min={1} value={codeForm.sort}
                onChange={e => sc("sort", parseInt(e.target.value)||1)} style={fInput} />
            </FormRow>
          </div>
        </div>
        <FormRow label="코드명" required err={codeErrors.nm}>
          <FInput value={codeForm.nm} onChange={e => sc("nm", e.target.value)}
            placeholder="코드명을 입력하세요" maxLength={50} style={fInput} />
        </FormRow>
        <FormRow label="설명">
          <FTextarea value={codeForm.desc} onChange={e => sc("desc", e.target.value)}
            placeholder="코드 설명 (선택)" rows={3}
            style={{ ...fInput, resize:"none", fontFamily:"inherit" }} />
        </FormRow>
        <FormRow label="사용여부">
          <Radio value={codeForm.useYn} onChange={v => sc("useYn", v)} />
        </FormRow>
      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={closePanel}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={saveCode}>{isEdit ? "저장" : "등록"}</Btn>
        </div>
      </div>
      </SidePanel>
    );
  };

  return (
    <div>
      <PH title="공통코드" bc="홈 > 환경설정 > 공통코드" />

      <div style={{ padding:"24px 32px", display:"flex", gap:20, alignItems:"flex-start" }}>

        {/* ══════════ 좌: 코드 그룹 목록 ══════════ */}
        <div style={{ width:360, flexShrink:0, background:"#fff", border:`1px solid ${C.brd}`, borderRadius:10, overflow:"hidden" }}>
          {/* 헤더 */}
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.brd}`,
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, fontWeight:700, color:C.txt }}>코드 그룹</span>
            <div style={{ display:"flex", gap:6 }}>
              <Btn sm onClick={() => { setUploadModal(true); }}>📤 엑셀 업로드</Btn>
              <Btn primary small onClick={() => {
                setGrpForm({ ...EMPTY_GRP });
                setGrpErrors({});
                setPanel("grp-add");
              }}>+ 그룹 추가</Btn>
            </div>
          </div>
          {/* 검색 */}
          <div style={{ padding:"10px 16px", borderBottom:`1px solid ${C.brd}` }}>
            <FInput value={grpSearch} onChange={e => setGrpSearch(e.target.value)}
              placeholder="그룹 ID 또는 그룹명 검색"
              style={{ ...fInput, fontSize:12 }} />
          </div>
          {/* 그룹 목록 */}
          <div style={{ maxHeight:"calc(100vh - 280px)", overflowY:"auto" }}>
            {filteredGroups.length === 0
              ? <div style={{ padding:32, textAlign:"center", fontSize:12, color:C.txL }}>검색 결과가 없습니다.</div>
              : filteredGroups.map(g => {
                const sel = selGrp?.id === g.id;
                return (
                  <div key={g.id} onClick={() => { setSelGrp(g); setCdSearch(""); setUseFilter("전체"); }}
                    style={{ padding:"11px 16px", borderBottom:`1px solid #f3f4f6`,
                      background: sel ? C.priL : "#fff", cursor:"pointer",
                      borderLeft: sel ? `3px solid ${C.pri}` : "3px solid transparent",
                      transition:"background .1s" }}
                    onMouseEnter={e => { if(!sel) e.currentTarget.style.background="#f8fafc"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = sel ? C.priL : "#fff"; }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:3 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ fontSize:12, fontWeight:700, color: sel ? C.pri : C.txS,
                          fontFamily:"inherit", background: sel ? "#dbeafe" : "#F9FAFC",
                          padding:"1px 6px", borderRadius:3 }}>{g.id}</span>
                        <span style={{ fontSize:12, fontWeight:600, color: sel ? C.pri : C.txt }}>{g.nm}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        {useChip(g.useYn)}
                        <span style={{ fontSize:12, color:C.txL }}>{g.cnt}개</span>
                      </div>
                    </div>
                    {g.desc && <div style={{ fontSize:12, color:C.txL, marginTop:1 }}>{g.desc}</div>}
                  </div>
                );
              })
            }
          </div>
          {/* 하단 카운트 */}
          <div style={{ padding:"8px 16px", background:"#F9FAFC", borderTop:`1px solid ${C.brd}`, color:C.txS, display:"flex", justifyContent:"space-between" }}>
            <span>전체 {groups.length}개 그룹</span>
            <span>사용 {groups.filter(g=>g.useYn==="Y").length}개</span>
          </div>
        </div>

        {/* ══════════ 우: 코드 목록 ══════════ */}
        <div style={{ flex:1, minWidth:0, background:"#fff", border:`1px solid ${C.brd}`, borderRadius:10, overflow:"hidden" }}>
          {selGrp ? (<>
            {/* 헤더 */}
            <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.brd}`,
              display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:12, fontWeight:700, color:C.txt }}>{selGrp.nm}</span>
                <span style={{ color:C.txS, fontFamily:"inherit",
                  background:"#F9FAFC", padding:"2px 7px", borderRadius:3 }}>{selGrp.id}</span>
                <span style={{ cursor:"pointer", fontSize:12, color:C.pri, fontWeight:600,
                  padding:"3px 8px", border:`1px solid ${C.pri}`, borderRadius:4 }}
                  onClick={() => { setGrpForm({ ...selGrp }); setGrpErrors({}); setPanel("grp-edit"); }}>
                  그룹 수정
                </span>
              </div>
              <Btn primary small onClick={() => {
                setCodeForm({ ...EMPTY_CODE, sort: currentCodes.length + 1 });
                setCodeErrors({});
                setPanel("code-add");
              }}>+ 코드 추가</Btn>
            </div>

            {/* 필터 바 */}
            <div style={{ padding:"10px 18px", borderBottom:`1px solid ${C.brd}`,
              display:"flex", alignItems:"center", gap:10 }}>
              <FInput value={cdSearch} onChange={e => setCdSearch(e.target.value)}
                placeholder="코드 또는 코드명 검색"
                style={{ ...fInput, width:220, fontSize:12 }} />
              <div style={{ display:"flex", gap:4 }}>
                {["전체","사용","미사용"].map(f => (
                  <button key={f} onClick={() => setUseFilter(f)}
                    style={{ padding:"5px 12px", fontSize:12, fontWeight:600, borderRadius:5, cursor:"pointer",
                      border:`1px solid ${useFilter===f ? C.pri : C.brd}`,
                      background: useFilter===f ? C.priL : "#fff",
                      color: useFilter===f ? C.pri : C.txS }}>
                    {f}
                  </button>
                ))}
              </div>
              <span style={{ marginLeft:"auto", fontSize:12, color:C.txS }}>
                {currentCodes.length}개 코드
              </span>
            </div>

            {/* 테이블 */}
            <Tbl
              noPaging
              data={currentCodes}
              onRow={c=>{ setCodeForm({...c}); setCodeErrors({}); setPanel("code-edit"); }}
              cols={[
                { t:"순서",   k:"sort",  w:70,  r:(v)=><span style={{color:C.txL}}>{v}</span> },
                { t:"코드값", k:"cd",    mw:120, align:"left", r:(v)=><span style={{fontFamily:"inherit",fontWeight:600,color:C.txt}}>{v}</span> },
                { t:"항목",   k:"nm",    mw:150, align:"left", r:(v)=><span style={{fontWeight:600}}>{v}</span> },
                { t:"설명",   k:"desc",  align:"left",
                  r:(v)=><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block",color:C.txS,maxWidth:260}}>
                    {v||<span style={{color:C.txL}}>—</span>}
                  </span> },
                { t:"사용여부", k:"useYn", r:(v)=>useChip(v) },
                { t:"", k:"id", w:60,
                  r:(_,c)=><span onClick={e=>{e.stopPropagation();setDelCdConfirm(c.id);}}
                    style={{fontSize:18,color:"#fca5a5",cursor:"pointer",fontWeight:700,padding:"0 4px",borderRadius:3,lineHeight:1}}
                    onMouseEnter={e=>e.currentTarget.style.color=C.red}
                    onMouseLeave={e=>e.currentTarget.style.color="#fca5a5"}>×</span> },
              ]}
            />
          </>) : (
            <div style={{ padding:60, textAlign:"center", fontSize:12, color:C.txL }}>
              왼쪽에서 코드 그룹을 선택하세요.
            </div>
          )}
        </div>
      </div>

      {/* ── 패널들 ── */}
      <GroupPanel />
      <CodePanel />

      {/* ── 엑셀 업로드 모달 ── */}
      {uploadModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:1100,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:12, padding:28, width:420, boxShadow:"0 8px 32px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>엑셀 업로드</div>
            <div style={{ fontSize:12, color:C.txS, marginBottom:20 }}>
              그룹 ID, 코드, 코드명, 설명, 정렬순서, 사용여부 순서로 작성된 엑셀 파일을 업로드하세요.
            </div>
            <div style={{ border:`2px dashed ${C.brd}`, borderRadius:8, padding:"28px 20px",
              textAlign:"center", background:"#F9FAFC", marginBottom:16, cursor:"pointer" }}
              onClick={() => {}}>
              <div style={{ fontSize:12, color:C.txS, marginBottom:6 }}>파일을 드래그하거나 클릭하여 선택</div>
              <div style={{ fontSize:12, color:C.txL }}>지원 형식: .xlsx, .xls, .csv</div>
            </div>
            <div style={{ fontSize:12, color:C.txS, marginBottom:20 }}>
              * 기존 코드와 동일한 그룹 ID + 코드는 덮어쓰기 됩니다.<br/>
              * 업로드 전 반드시 양식을 확인하세요.{" "}
              <span style={{ color:C.pri, cursor:"pointer", fontWeight:600 }}>양식 다운로드</span>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
              <Btn onClick={() => setUploadModal(false)}>취소</Btn>
              <Btn primary onClick={() => setUploadModal(false)}>업로드</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ── 그룹 삭제 확인 ── */}
      <ConfirmModal open={!!delGrpConfirm} title="그룹 삭제"
        msg={<>하위 코드 <strong>{(codesMap[delGrpConfirm]||[]).length}개</strong>가 함께 삭제됩니다. 삭제 후 복구할 수 없습니다. 계속하시겠습니까?</>}
        okLabel="삭제" onOk={() => deleteGroup(delGrpConfirm)} onCancel={() => setDelGrpConfirm(null)} />

      {/* ── 코드 삭제 확인 ── */}
      <ConfirmModal open={!!delCdConfirm} title="코드 삭제" msg="삭제된 코드는 복구할 수 없습니다. 계속하시겠습니까?"
        okLabel="삭제" onOk={() => deleteCode(delCdConfirm)} onCancel={() => setDelCdConfirm(null)} />
    </div>
  );
};

interface ManagerSettingsCommonCodePageProps {}

export default function ManagerSettingsCommonCodePage() { return (
  <>
    <MgrCode />
    <div style={{ height: 24 }} />
    <MgrCommonCode />
  </>
); }
