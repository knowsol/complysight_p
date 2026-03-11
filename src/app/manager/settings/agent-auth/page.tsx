// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, YnBadge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { FormInput, FormSelect } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { FormRow, PanelDeleteButton, SectionTitle } from '@/components/ui/FormRow';
import { Radio } from '@/components/ui/Radio';
import { colors } from '@/lib/theme/colors';
import { filterChip, panelBody, panelFooterBar, errorText, hoverStyle, fInput, emptyState } from '@/lib/theme/styles';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState, DotIndicator } from '@/components/ui/StyleUtils';
import { RES } from '@/data/resources';
import { _mids, _sIds, _sysMap } from '@/data/systems';
import css from './page.module.css';


const MgrAgentAuth = () => {

  /* 에이전트 타입 정의 */
  const AGENT_TYPES = [
    { cd:"SSH",   nm:"SSH Agent",   icon:"🔑", desc:"SSH 프로토콜 기반",       forMid:["서버","WAS"] },
    { cd:"SNMP",  nm:"SNMP Agent",  icon:"📡", desc:"SNMP 프로토콜 기반",      forMid:["네트워크","보안","스토리지"] },
    { cd:"WEB",   nm:"Web Agent",   icon:"🌐", desc:"HTTP/HTTPS 기반",         forMid:["WEB","WAS"] },
    { cd:"DB",    nm:"DB Agent",    icon:"🗄️",  desc:"데이터베이스 접속 기반",  forMid:["DBMS"] },
    { cd:"LOCAL", nm:"Local Agent", icon:"💻", desc:"로컬 설치형",              forMid:["서버","백업","스토리지"] },
  ];

  /* 에이전트 접속 권한 초기 데이터 (자원 ID → 에이전트 설정 목록) */
  const INIT_AUTH = (() => {
    const data = {};
    // 샘플: RES 앞 30개에 대해 에이전트 설정 생성
    const sample = RES.slice(0, 30);
    sample.forEach((r, idx) => {
      const forTypes = AGENT_TYPES.filter(a => a.forMid.includes(r.mid));
      if (!forTypes.length) return;
      data[r.id] = forTypes.map((a, ai) => ({
        id: `${r.id}_${a.cd}`,
        resId: r.id,
        agentType: a.cd,
        host: r.ip,
        port: a.cd==="SSH"?22 : a.cd==="SNMP"?161 : a.cd==="WEB"?8080 : a.cd==="DB"?3306 : 0,
        authId: a.cd==="SSH"||a.cd==="DB"||a.cd==="LOCAL" ? `svc_${r.nm.toLowerCase().replace(/-/g,"_")}` : "",
        authPw: a.cd==="SSH"||a.cd==="DB"||a.cd==="LOCAL" ? "●●●●●●●●" : "",
        snmpVer: a.cd==="SNMP" ? "v2c" : "",
        community: a.cd==="SNMP" ? "public" : "",
        timeout: 10,
        retryCount: 3,
        useYn: (idx + ai) % 7 === 0 ? "N" : "Y",
        testResult: (idx + ai) % 5 === 0 ? "실패" : (idx + ai) % 3 === 0 ? "미확인" : "성공",
        testDt: (idx + ai) % 3 === 0 ? "" : `2026-02-${String(22 + (idx % 3)).padStart(2,"0")} ${String(9 + ai).padStart(2,"0")}:${String(idx * 3 % 60).padStart(2,"0")}`,
        regDt: "2026-01-10",
      }));
    });
    return data;
  })();

  /* 정보시스템 목록 */
  const SYS_LIST = [
    { id:"전체",   nm:"전체" },
    ..._sIds.map(id => ({ id, nm: _sysMap[id] }))
  ];

  const MID_LIST = ["전체", ..._mids];

  const PAGE_SZ = 15;

  const [authMap, setAuthMap]   = useState(INIT_AUTH);
  const [selRes,  setSelRes]    = useState(null);
  const [selSys,  setSelSys]    = useState("전체");
  const [selMid,  setSelMid]    = useState("전체");
  const [resQ,    setResQ]      = useState("");
  const [resPage, setResPage]   = useState(1);

  /* 에이전트 설정 패널 */
  const [panel,      setPanel]      = useState(false);
  const [panelForm,  setPanelForm]  = useState(null);
  const [panelIsNew, setPanelIsNew] = useState(false);
  const [panelErr,   setPanelErr]   = useState({});
  const [showPw,     setShowPw]     = useState(false);
  const [testLoading,setTestLoading]= useState(false);

  /* 삭제 확인 */
  const [delTarget, setDelTarget] = useState(null);

  /* 자원 필터 */
  const filteredRes = RES.filter(r => {
    if (r.st === "미사용") return false;
    if (selSys !== "전체" && r.sysId !== selSys) return false;
    if (selMid !== "전체" && r.mid !== selMid) return false;
    if (resQ && !r.nm.toLowerCase().includes(resQ.toLowerCase()) && !r.ip.includes(resQ)) return false;
    return true;
  });
  const totalResPages = Math.max(1, Math.ceil(filteredRes.length / PAGE_SZ));
  const pagedRes = filteredRes.slice((resPage-1)*PAGE_SZ, resPage*PAGE_SZ);

  /* 현재 선택 자원의 에이전트 목록 */
  const curAuth = selRes ? (authMap[selRes.id] || []) : [];

  /* 에이전트 타입에 따라 적합 여부 판단 */
  const isRecommended = (agentCd) => {
    if (!selRes) return false;
    const ag = AGENT_TYPES.find(a=>a.cd===agentCd);
    return ag?.forMid.includes(selRes.mid) || false;
  };
  const availableAgents = AGENT_TYPES.filter(a => !curAuth.some(c=>c.agentType===a.cd));

  const openPanel = (auth, isNew=false, agentType=null) => {
    if (isNew) {
      const ag = AGENT_TYPES.find(a=>a.cd===agentType) || AGENT_TYPES[0];
      setPanelForm({
        id: `${selRes.id}_${ag.cd}_${Date.now()}`,
        resId: selRes.id,
        agentType: ag.cd,
        host: selRes.ip,
        port: ag.cd==="SSH"?22 : ag.cd==="SNMP"?161 : ag.cd==="WEB"?8080 : ag.cd==="DB"?3306 : 0,
        authId:"", authPw:"", snmpVer:"v2c", community:"public",
        timeout:10, retryCount:3, useYn:"Y", testResult:"미확인", testDt:"", regDt:"2026-02-24",
      });
    } else {
      setPanelForm({...auth});
    }
    setPanelIsNew(isNew);
    setPanelErr({});
    setShowPw(false);
    setPanel(true);
  };

  const saveAuth = () => {
    const e = {};
    if (!panelForm.host.trim()) e.host = "호스트(IP)를 입력하세요.";
    if (["SSH","DB","LOCAL"].includes(panelForm.agentType) && !panelForm.authId.trim()) e.authId = "접속 ID를 입력하세요.";
    setPanelErr(e);
    if (Object.keys(e).length) return;
    const list = authMap[selRes.id] || [];
    if (panelIsNew) {
      setAuthMap(p=>({...p, [selRes.id]:[...list, panelForm]}));
    } else {
      setAuthMap(p=>({...p, [selRes.id]:list.map(a=>a.id===panelForm.id?{...a,...panelForm}:a)}));
    }
    setPanel(false);
  };

  const deleteAuth = (id) => {
    setAuthMap(p=>({...p, [selRes.id]:(p[selRes.id]||[]).filter(a=>a.id!==id)}));
    setDelTarget(null); setPanel(false);
  };

  const handleTest = () => {
    setTestLoading(true);
    setTimeout(()=>{
      const ok = Math.random() > 0.3;
      setPanelForm(p=>({...p, testResult:ok?"성공":"실패", testDt:"2026-02-24 " + new Date().toTimeString().slice(0,8)}));
      setTestLoading(false);
    }, 1200);
  };

  const spf = (k,v) => setPanelForm(p=>({...p,[k]:v}));
  const inp = {...fInput};
  const ro  = {background:"#f0f1f3",color:colors.textSecondary,pointerEvents:"none"};
  const err = (msg) => msg ? <div style={errorText}>{msg}</div> : null;







  /* 에이전트 타입에 따른 접속정보 필드 렌더 */
  const renderAuthFields = () => {
    if (!panelForm) return null;
    const t = panelForm.agentType;
    return (
      <>
        {/* 공통: 호스트 + 포트 */}
        <div className={css.authFieldRow}>
          <div className={css.fieldFlex}>
            <FormRow label="호스트 (IP)" required>
              <FormInput value={panelForm.host} onChange={e=>spf("host",e.target.value)}
                placeholder="예) 10.100.1.1" style={inp} />
              {err(panelErr.host)}
            </FormRow>
          </div>
          <div className={css.fieldPort}>
            <FormRow label="포트">
              <FormInput type="number" value={panelForm.port} onChange={e=>spf("port",parseInt(e.target.value)||0)}
                style={inp} />
            </FormRow>
          </div>
        </div>

        {/* SSH / DB / LOCAL: ID + PW */}
        {["SSH","DB","LOCAL"].includes(t) && (
          <>
            <FormRow label="접속 ID" required>
              <FormInput value={panelForm.authId} onChange={e=>spf("authId",e.target.value)}
                placeholder="접속 계정 ID" style={inp} />
              {err(panelErr.authId)}
            </FormRow>
            <FormRow label="접속 PW">
              <div className={css.passwordWrap}>
                <FormInput type={showPw?"text":"password"} value={panelForm.authPw}
                  onChange={e=>spf("authPw",e.target.value)}
                  placeholder="접속 비밀번호"
                  style={{...inp,paddingRight:40}} />
                <button onClick={()=>setShowPw(p=>!p)}
                  className={css.passwordToggle}>
                  {showPw?"🙈":"👁️"}
                </button>
              </div>
            </FormRow>
          </>
        )}

        {/* SNMP: 버전 + 커뮤니티 */}
        {t==="SNMP" && (
          <>
            <FormRow label="SNMP 버전">
              <FormSelect value={panelForm.snmpVer} onChange={e=>spf("snmpVer",e.target.value)} style={inp}>
                {["v1","v2c","v3"].map(v=><option key={v}>{v}</option>)}
              </FormSelect>
            </FormRow>
            <FormRow label="Community">
              <FormInput value={panelForm.community} onChange={e=>spf("community",e.target.value)}
                placeholder="예) public" style={inp} />
            </FormRow>
          </>
        )}

        {/* 공통: 타임아웃 + 재시도 */}
        <div className={css.authFieldRow}>
          <div className={css.fieldFlex}>
            <FormRow label="타임아웃 (초)">
              <FormInput type="number" min={1} max={120} value={panelForm.timeout}
                onChange={e=>spf("timeout",parseInt(e.target.value)||10)} style={inp} />
            </FormRow>
          </div>
          <div className={css.fieldFlex}>
            <FormRow label="재시도 횟수">
              <FormInput type="number" min={0} max={10} value={panelForm.retryCount}
                onChange={e=>spf("retryCount",parseInt(e.target.value)||0)} style={inp} />
            </FormRow>
          </div>
        </div>

        <FormRow label="사용 여부">
          <Radio value={panelForm.useYn} onChange={v=>spf("useYn",v)} />
        </FormRow>
      </>
    );
  };

  return (
    <div>
      <PageHeader title="AGENT 권한관리" breadcrumb="홈 > 보안 및 개발 > AGENT 권한관리" />

      <div className={css.mainLayout}>

        {/* ── 좌: 자원 목록 ── */}
        <div className={css.leftPanel}>

          {/* 헤더 */}
          <div className={css.panelHeader}>
            <span className={css.panelTitle}>자원 선택</span>
          </div>
          <div className={css.filterSection}>
            {/* 정보시스템 필터 */}
            <FormSelect value={selSys} onChange={e=>{setSelSys(e.target.value);setResPage(1);setSelRes(null);}}
              className={css.fullWidthInput} style={inp}>
              {SYS_LIST.map(s=><option key={s.id} value={s.id}>{s.nm}</option>)}
            </FormSelect>
            {/* 분류 필터 */}
            <div className={css.midFilterRow}>
              {MID_LIST.map(m=>(
                <button key={m} onClick={()=>{setSelMid(m);setResPage(1);setSelRes(null);}}
                  style={filterChip(selMid===m)}>
                  {m}
                </button>
              ))}
            </div>
            {/* 검색 */}
            <FormInput value={resQ} onChange={e=>{setResQ(e.target.value);setResPage(1);}}
              placeholder="자원명 / IP 검색"
              className={css.fullWidthInput} style={inp} />
          </div>

          {/* 자원 리스트 */}
          <div className={css.resList}>
            {pagedRes.length===0 && (
              <div className={css.resEmpty} style={emptyState}>자원이 없습니다.</div>
            )}
            {pagedRes.map(r => {
              const sel = selRes?.id===r.id;
              const authList = authMap[r.id]||[];
              const hasAny = authList.length > 0;
              const allOk  = hasAny && authList.every(a=>a.testResult==="성공"&&a.useYn==="Y");
              const hasFail= authList.some(a=>a.testResult==="실패");
              const dotColor = !hasAny?"#EEEEEE":hasFail?"#ef4444":allOk?"#16a34a":"#f59e0b";
              return (
                <div key={r.id}
                  onClick={()=>{ setSelRes(r); setPanel(false); }}
                  className={`${css.resItem} ${sel ? css.resItemSelected : ''}`}>
                  <div className={css.resItemTop}>
                    <div className={css.resNameRow}>
                      <DotIndicator color={dotColor} />
                      <span className={`${css.resName} ${sel ? css.resNameSelected : ''}`}>{r.nm}</span>
                    </div>
                    <div className={css.resActions}>
                      <span className={css.resCount}>{authList.length}</span>
                      <button
                        onClick={e => { e.stopPropagation(); setSelRes(r); }}
                        style={{ width:24, height:24, border:`1px solid ${colors.border}`, borderRadius:4, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:colors.textLight, flexShrink:0 }}
                        {...hoverStyle(
                          { bg: "#fff", color: colors.textLight, border: colors.border },
                          { bg: colors.secondaryLight, color: colors.primary, border: colors.primary }
                        )}
                        title="상세 보기">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={css.resMeta}>
                    <span>{r.mid}</span>
                    <span>·</span>
                    <span>{r.sysNm}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          {totalResPages > 1 && (
            <div className={css.paginationBar}>
              <button onClick={()=>setResPage(p=>Math.max(1,p-1))} disabled={resPage===1}
                className={css.paginationButton}>‹</button>
              <span className={css.paginationText}>{resPage} / {totalResPages}</span>
              <button onClick={()=>setResPage(p=>Math.min(totalResPages,p+1))} disabled={resPage===totalResPages}
                className={css.paginationButton}>›</button>
            </div>
          )}
        </div>

        {/* ── 우: 에이전트 권한 목록 ── */}
        <div className={css.rightPanel}>
          {!selRes ? (
            <EmptyState icon="🔐" title="자원을 선택하세요" desc="왼쪽에서 자원을 선택하면 에이전트 접속 권한을 관리할 수 있습니다." style={{ height: "100%" }} />
          ) : (<>
            <SearchBar placeholder="에이전트, 호스트 검색" />
            <DataTable sectionTitle={`${selRes.nm} 에이전트 목록`} sectionCount={curAuth.length} sectionButtons={availableAgents.length > 0 && (
              <div className={css.agentSelectWrap}>
                <FormSelect defaultValue=""
                  onChange={e=>{ if(e.target.value){ openPanel(null,true,e.target.value); e.target.value=""; }}}
                  className={css.agentAddSelect}>
                  <option value="" disabled>+ 에이전트 추가</option>
                  {availableAgents.map(a=>(
                    <option key={a.cd} value={a.cd}>{a.icon} {a.nm}</option>
                  ))}
                </FormSelect>
              </div>
            )} cols={[
              { title: "에이전트", fieldKey: "agentType", renderCell: v => { const ag = AGENT_TYPES.find(a=>a.cd===v); return <Badge status={v} label={ag ? `${ag.icon} ${ag.nm}` : v} />; } },
              { title: "호스트", fieldKey: "host", renderCell: v => <span className={css.monoText}>{v}</span> },
              { title: "포트", fieldKey: "port", renderCell: v => <span className={css.monoText}>{v||"—"}</span> },
              { title: "접속 정보", fieldKey: "id", renderCell: (_, row) => {
                const info = row.agentType==="SNMP" ? `${row.snmpVer} / ${row.community}` : row.authId ? row.authId : "—";
                return <span>{info}</span>;
              }},
              { title: "타임아웃", fieldKey: "timeout", renderCell: v => `${v}초` },
              { title: "연결 테스트", fieldKey: "testResult", renderCell: (v, row) => <div className={css.testResultCell}>
                <Badge status={v||"미확인"} />
                {row.testDt && <span className={css.testDateText}>{row.testDt}</span>}
              </div> },
              { title: "사용여부", fieldKey: "useYn", renderCell: v => <YnBadge value={v} /> },
              { title: "등록일", fieldKey: "regDt" },
            ]} data={curAuth} onRow={r => openPanel(r, false)} />
          </>)}
        </div>
      </div>

      {/* ── 사이드 패널: 에이전트 설정 ── */}
      <SidePanel open={panel} onClose={()=>setPanel(false)}
        title={panelIsNew?"에이전트 접속 설정 추가":"에이전트 접속 설정 수정"} width={460} noScroll>
      {/* 바디 */}
      <div style={panelBody}>
        {panelForm && (
          <>
            {!panelIsNew && <PanelDeleteButton onClick={()=>setDelTarget(panelForm.id)} />}

            <SectionTitle label="에이전트 정보" primary />
            <div className={css.agentInfoBox}>
              {(() => { const ag = AGENT_TYPES.find(a=>a.cd===panelForm.agentType); return <Badge status={panelForm.agentType} label={ag ? `${ag.icon} ${ag.nm}` : panelForm.agentType} />; })()}
              <div className={css.agentDesc}>
                {AGENT_TYPES.find(a=>a.cd===panelForm.agentType)?.desc}
                {isRecommended(panelForm.agentType) &&
                  <span className={css.recommendedTag}>✓ 권장 에이전트</span>}
              </div>
            </div>

            <SectionTitle label="접속 정보" primary />
            {renderAuthFields()}

            {/* 연결 테스트 */}
            <div className={css.testBox}>
              <div className={`${css.testHeader} ${panelForm.testDt ? css.testHeaderWithDate : ''}`}>
                <div className={css.testHeaderLeft}>
                  <span className={css.testTitle}>연결 테스트</span>
                  <Badge status={panelForm.testResult||"미확인"} />
                </div>
                <Button sm outline onClick={handleTest} disabled={testLoading}>
                  {testLoading ? "테스트 중..." : "연결 테스트"}
                </Button>
              </div>
              {panelForm.testDt && (
                <div className={css.lastTestText}>마지막 테스트: {panelForm.testDt}</div>
              )}
            </div>

          </>
        )}
      </div>{/* /바디 */}
      <div style={panelFooterBar}>
        <div className={css.panelFooterRow}>
          <Button onClick={()=>setPanel(false)}>취소</Button>
          <div className={css.panelFooterSpacer} />
          <Button primary onClick={saveAuth}>{panelIsNew ? "등록" : "저장"}</Button>
        </div>
      </div>
      </SidePanel>

      {delTarget && (
        <ConfirmModal open={!!delTarget} title="에이전트 설정 삭제"
          msg="선택한 에이전트 접속 설정을 삭제합니다. 계속하시겠습니까?"
          onOk={()=>deleteAuth(delTarget)} onCancel={()=>setDelTarget(null)} />
      )}
    </div>
  );
};

interface ManagerSettingsAgentAuthPageProps {}

export default function ManagerSettingsAgentAuthPage() { return <MgrAgentAuth />; }
