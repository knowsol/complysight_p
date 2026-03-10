// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { SidePanel } from '@/components/ui/SidePanel';
import { DatePicker } from '@/components/ui/DatePicker';
import { C } from '@/lib/theme/colors';
import { LABEL_STYLE_SM, TH, TD } from '@/lib/theme/styles';
import { SYS } from '@/data/manager';
import { RES } from '@/data/resources';
import { USERS } from '@/data/users';


const MgrInspReport = () => {
  const FREQ_OPTS  = ["전체","상시","매일","매주","매월","분기","반기","연간"];
  const FREQ_COLOR = { "전체":"#555E6C","상시":"#0891B2","매일":"#0C8CE9","매주":"#19973C","매월":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333333" };
  const RES_COLS   = ["서버","WEB","WAS","DBMS","네트워크","보안","스토리지","백업"];

  const todayStr = new Date().toISOString().slice(0,10);
  const [baseDate, setBaseDate] = useState(todayStr);
  const [freq,     setFreq]     = useState("전체");
  const [applied,  setApplied]  = useState({ baseDate: todayStr, freq: "전체" });
  const [checked,  setChecked]  = useState({});
  const [toastMsg, setToastMsg] = useState(null);
  const [panelInfo, setPanelInfo] = useState(null); // { sysNm, col, resources }

  const showToast = (msg, ok=true) => { setToastMsg({msg,ok}); setTimeout(()=>setToastMsg(null),2600); };

  const rows = SYS.map(sys => {
    const cells = {};
    const sysIdx = SYS.findIndex(s=>s.id===sys.id);
    RES_COLS.forEach((col,ci) => {
      const res = RES.filter(r => r.sysId===sys.id && r.mid===col);
      if (!res.length) { cells[col]=null; return; }
      /* 일부 셀은 미생성(reported=0) 예제를 위해 강제 처리
         sysIdx+ci 합이 특정 패턴이면 전체 미보고 처리 */
      const forceZero = (sysIdx * 3 + ci) % 7 === 0;
      const reported = forceZero ? 0 : res.filter((r,i)=>(r.id*13+i*7)%100<74).length;
      const hasReport = reported > 0;
      /* 자원별 보고서 시뮬레이션 */
      const resDetail = res.map((r,i) => {
        const isReported = !forceZero && (r.id*13+i*7)%100 < 74;
        const normalCnt  = isReported ? Math.floor((r.id*7+i*3)%10 + 3) : 0;
        const abnCnt     = isReported ? Math.floor((r.id*3+i*11)%4)      : 0;
        const freqList   = ["상시","매일","매주","매월","분기","반기","연간"];
        const resFreq    = freqList[(r.id + ci) % freqList.length];
        return {
          ...r,
          reported:    isReported,
          inspDt:      isReported ? `2026-02-${String(((r.id*3+i)%11)+1).padStart(2,"0")}` : null,
          reportDt:    isReported ? `2026-02-${String(((r.id*3+i)%11)+2).padStart(2,"0")}` : null,
          inspector:   USERS[(r.id+i)%USERS.length]?.userNm || "—",
          reportNm:    `${col} 상태점검표`,
          normalCnt,
          abnCnt,
          resFreq,
        };
      });
      cells[col] = { total:res.length, reported, rate:Math.round(reported/res.length*100), hasReport, resDetail };
    });
    const totalAll    = RES_COLS.reduce((s,c)=>s+(cells[c]?cells[c].total:0),0);
    const reportedAll = RES_COLS.reduce((s,c)=>s+(cells[c]?cells[c].reported:0),0);
    const overall     = totalAll>0 ? Math.round(reportedAll/totalAll*100) : 0;
    return { sys, cells, overall, totalAll, reportedAll };
  });

  /* 전체자원 합계 행 */
  const totalRow = (() => {
    const cells = {};
    RES_COLS.forEach(col => {
      const allCells = rows.map(r=>r.cells[col]).filter(Boolean);
      if (!allCells.length) { cells[col]=null; return; }
      const total    = allCells.reduce((s,c)=>s+c.total,0);
      const reported = allCells.reduce((s,c)=>s+c.reported,0);
      cells[col] = { total, reported, rate:Math.round(reported/total*100) };
    });
    const totalAll    = rows.reduce((s,r)=>s+r.totalAll,0);
    const reportedAll = rows.reduce((s,r)=>s+r.reportedAll,0);
    const overall     = totalAll>0 ? Math.round(reportedAll/totalAll*100) : 0;
    return { cells, overall, totalAll, reportedAll };
  })();

  const filteredRows = applied.freq === "전체"
    ? rows
    : rows.map(row => {
        const cells = {};
        Object.entries(row.cells).forEach(([col, cell]) => {
          if (!cell) { cells[col] = null; return; }
          const filtered = cell.resDetail.filter(r => r.resFreq === applied.freq);
          if (!filtered.length) { cells[col] = null; return; }
          const reported = filtered.filter(r => r.reported).length;
          cells[col] = { ...cell, total: filtered.length, reported, rate: Math.round(reported / filtered.length * 100), resDetail: filtered };
        });
        const totalAll    = RES_COLS.reduce((s,c)=>s+(cells[c]?cells[c].total:0),0);
        const reportedAll = RES_COLS.reduce((s,c)=>s+(cells[c]?cells[c].reported:0),0);
        const overall     = totalAll>0 ? Math.round(reportedAll/totalAll*100) : 0;
        return { ...row, cells, overall, totalAll, reportedAll };
      });

  const allIds    = SYS.map(s=>s.id);
  const selIds    = allIds.filter(id=>checked[id]);
  const allChk    = selIds.length===allIds.length;
  const toggleAll = () => allChk ? setChecked({}) : setChecked(Object.fromEntries(allIds.map(id=>[id,true])));

  const rColor = r => r===100?"#19973C":r>=80?"#0C8CE9":r>=50?"#F36D00":r>=1?"#E24949":"#7C3AED";
  const rBg    = r => r===100?"#E8F5EC":r>=80?"#E6F3FA":r>=50?"#FFF3E6":r>=1?"#FDE8E8":"#EDE9FE";

  const dlSingle = (sysNm,col) => showToast(`${sysNm}${col?` · ${col}`:""} 점검보고서 다운로드가 시작되었습니다.`);
  const dlBulk   = () => {
    if (!selIds.length){ showToast("다운로드할 정보시스템을 선택하세요.",false); return; }
    showToast(`${selIds.length}개 점검보고서 일괄 다운로드가 시작되었습니다.`);
  };

  const search = () => { setApplied({ baseDate, freq }); setChecked({}); };
  const reset  = () => {
    const d = new Date().toISOString().slice(0,10);
    setBaseDate(d); setFreq("전체");
    setApplied({ baseDate: d, freq: "전체" });
    setChecked({});
  };

  const dlIcon = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
  );

  /* ── 셀 클릭 핸들러 ── */
  const openPanel = (sys, col, cell) => {
    if (!cell) return;
    setPanelInfo({ sysNm: sys.nm, sysType: sys.type, col, cell });
  };

  return (
    <div>
      <PageHeader title="점검보고서" bc="홈 > 점검현황 > 점검보고서" />

      {/* ── 검색폼 ── */}
      <SearchBar onSearch={search} onReset={reset}>
        <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
          <span style={{ ...LABEL_STYLE_SM }}>기준일</span>
          <DatePicker value={baseDate} onChange={setBaseDate} style={{ width: 130 }} />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
          <span style={{ ...LABEL_STYLE_SM }}>보고주기</span>
          <div style={{ display:"flex", gap:4, height:36, alignItems:"center" }}>
            {FREQ_OPTS.map(f => {
              const active=freq===f, color=FREQ_COLOR[f];
              return (
                <span key={f} onClick={()=>setFreq(f)} style={{
                    padding:"5px 13px", borderRadius:4, fontSize:12, fontWeight:active?600:400,
                  border:`1px solid ${active?color:C.brd}`, background:active?color+"1A":"#fff",
                  color:active?color:C.txS, cursor:"pointer", transition:"all .12s", userSelect:"none", lineHeight:"22px" }}>
                  {f}
                </span>
              );
            })}
          </div>
        </div>
      </SearchBar>

      {/* ── 테이블 가이드 안내 ── */}
      <div style={{ display:"flex", alignItems:"center", gap:16, padding:"9px 16px",
        background:"#F0F5FF", border:`1px solid #C7D9F8`, borderRadius:8, margin:"12px 0 4px",
        flexWrap:"wrap" }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0 }}>
          <circle cx="8" cy="8" r="7" stroke="#4C7EF3" strokeWidth="1.4"/>
          <path d="M8 7v5" stroke="#4C7EF3" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="8" cy="5" r="0.8" fill="#4C7EF3"/>
        </svg>
        {[
          { icon:"📊", text:"보고된 자원수 / 전체 자원수" },
          { icon:"🔍", text:"셀 클릭 시 자원별 보고서 상세 확인" },
          { icon:"📄", text:"PDF: 분류별 개별 다운로드" },
        ].map(({ icon, text }, i, arr) => (
          <React.Fragment key={i}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:13 }}>{icon}</span>
              <span style={{ fontSize:12, fontWeight:600, color:"#2D5BB9" }}>{text}</span>
            </div>
            {i < arr.length - 1 && (
              <span style={{ width:1, height:14, background:"#C7D9F8", flexShrink:0 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── 섹션 타이틀 ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        height:52, borderBottom:`1px solid ${C.brdD}` }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
          <span style={{ fontSize:18, fontWeight:600, color:C.txH }}>점검보고서 목록</span>
          <span style={{ fontSize:12, color:C.txL }}>{filteredRows.length}건</span>
        </div>
      </div>

      {/* ── 테이블 ── */}
      <div style={{ overflowX:"auto" }}>
        <table style={{ minWidth:"100%", width:"max-content", borderCollapse:"collapse", fontSize:15, borderBottom:`1px solid ${C.brd}` }}>
          <thead>
            <tr style={{ borderTop:`1px solid ${C.txH}` }}>
              <th style={{...TH({textAlign:"left", width:200})}} >정보시스템</th>
              <th style={{...TH({textAlign:"center", width:90})}} >종합</th>
              {RES_COLS.map(col=>(
                <th key={col} style={{...TH({textAlign:"center", width:100})}} >{col}</th>
              ))}
              <th style={{...TH({textAlign:"center", width:100})}} >다운로드</th>
            </tr>
          </thead>
          <tbody>
            {/* 전체자원 합계 행 */}
            {(() => {
              const ftotalRow = (() => {
                const cells = {};
                RES_COLS.forEach(col => {
                  const allCells = filteredRows.map(r=>r.cells[col]).filter(Boolean);
                  if (!allCells.length) { cells[col]=null; return; }
                  const total    = allCells.reduce((s,c)=>s+c.total,0);
                  const reported = allCells.reduce((s,c)=>s+c.reported,0);
                  cells[col] = { total, reported, rate:Math.round(reported/total*100) };
                });
                const totalAll    = filteredRows.reduce((s,r)=>s+r.totalAll,0);
                const reportedAll = filteredRows.reduce((s,r)=>s+r.reportedAll,0);
                const overall     = totalAll>0 ? Math.round(reportedAll/totalAll*100) : 0;
                return { cells, overall, totalAll, reportedAll };
              })();
              const { cells, overall, totalAll, reportedAll } = ftotalRow;
              return (
                <tr style={{ background:"#F0F5FF", fontWeight:700 }}>
                  <td style={{...TD({textAlign:"left", borderBottom:`2px solid ${C.brdD}` })}}>
                    <div style={{ fontWeight:700, color:C.pri, fontSize:15 }}>전체 자원</div>
                    <div style={{ fontSize:12, color:C.txL, marginTop:1 }}>전체 {SYS.length}개 정보시스템</div>
                  </td>
                  <td style={{...TD({textAlign:"center", borderBottom:`2px solid ${C.brdD}` })}}>
                    <span style={{ fontSize:15, fontWeight:700, color:rColor(overall), background:rBg(overall), padding:"3px 8px", borderRadius:10, whiteSpace:"nowrap" }}>
                      {reportedAll}<span style={{ fontWeight:400, fontSize:15 }}>/{totalAll}</span>
                    </span>
                  </td>
                  {RES_COLS.map(col => {
                    const cell = cells[col];
                    if (!cell) return <td key={col} style={{...TD({textAlign:"center", borderBottom:`2px solid ${C.brdD}` })}}><span style={{color:C.txX}}>—</span></td>;
                    /* 전체자원 클릭용 합산 cell 구성 */
                    const mergedCell = (() => {
                      const allDetail = filteredRows.flatMap(r => r.cells[col]?.resDetail || []);
                      return { ...cell, resDetail: allDetail, hasReport: cell.reported > 0 };
                    })();
                    return (
                      <td key={col} onClick={()=>openPanel({ nm:"전체 자원", type:"전체", org:`${SYS.length}개 시스템` }, col, mergedCell)}
                        style={{...TD({textAlign:"center", borderBottom:`2px solid ${C.brdD}`,
                          cursor:"pointer", transition:"background .12s" })}}
                        onMouseEnter={e=>e.currentTarget.style.background="#D8E8FF"}
                        onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <span style={{ fontSize:15, fontWeight:700, color:rColor(cell.rate), whiteSpace:"nowrap" }}>
                          {cell.reported}<span style={{ fontWeight:400, fontSize:15, color:C.txL }}>/{cell.total}</span>
                        </span>
                      </td>
                    );
                  })}
                  <td style={{...TD({textAlign:"center", borderBottom:`2px solid ${C.brdD}` })}}>
                    <span style={{ fontSize:12, color:C.txL }}>—</span>
                  </td>
                </tr>
              );
            })()}

            {/* 시스템별 행 */}
            {filteredRows.map(({ sys, cells, overall, totalAll, reportedAll }, si) => {
              const isChk = !!checked[sys.id];
              return (
                <tr key={sys.id} style={{ cursor:"pointer", background:isChk?C.priL+"88":"" }}
                  onMouseEnter={e=>{ if(!isChk) e.currentTarget.style.background=C.secL; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=isChk?C.priL+"88":""; }}>

                  <td style={{...TD({textAlign:"left"})}} >
                    <div style={{ fontWeight:600, color:C.txH, fontSize:15 }}>{sys.nm}</div>
                    <div style={{ fontSize:12, color:C.txL, marginTop:1 }}>{sys.type} · {sys.org}</div>
                  </td>

                  <td style={{...TD({textAlign:"center"})}} >
                    <span style={{ fontSize:15, fontWeight:700, color:rColor(overall), background:rBg(overall), padding:"3px 8px", borderRadius:10, whiteSpace:"nowrap" }}>
                      {reportedAll}<span style={{ fontWeight:400, fontSize:15 }}>/{totalAll}</span>
                    </span>
                  </td>

                  {RES_COLS.map(col => {
                    const cell = cells[col];
                    if (!cell) return (
                      <td key={col} style={{...TD({textAlign:"center"})}} >
                        <span style={{ color:C.txX, fontSize:15 }}>—</span>
                      </td>
                    );
                    return (
                      <td key={col} onClick={()=>openPanel(sys,col,cell)}
                        style={{...TD({textAlign:"center"})}} onMouseEnter={e=>e.currentTarget.style.background="#EEF4FF"}
                        onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                          <span style={{ fontSize:15, fontWeight:700, color:rColor(cell.rate), whiteSpace:"nowrap" }}>
                            {cell.reported}<span style={{ fontWeight:400, fontSize:15, color:C.txL }}>/{cell.total}</span>
                          </span>
                          {cell.hasReport ? (
                            <Button xs onClick={e=>{e.stopPropagation();dlSingle(sys.nm,col);}}
                              style={{ padding:"3px 7px", gap:3, fontWeight:400 }}>
                              {dlIcon} PDF
                            </Button>
                          ) : (
                            <span style={{ fontSize:12, color:C.txX }}>미생성</span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  <td style={{...TD({textAlign:"center"})}} >
                    <Button onClick={e=>{e.stopPropagation();dlSingle(sys.nm,"");}}>
                      📥 전체
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ padding:"8px 0" }}>
        <span style={{ fontSize:12, color:C.txL }}>보고된 자원수 / 전체 자원수 &nbsp;·&nbsp; 셀 클릭 시 자원별 보고서 상세 확인 &nbsp;·&nbsp; PDF: 분류별 개별 다운로드</span>
      </div>

      {/* ── 자원별 보고서 사이드패널 ── */}
      {panelInfo && (() => {
        const { sysNm, col, cell } = panelInfo;
        const isTotal     = sysNm === "전체 자원";
        const reported    = cell.resDetail.filter(r=>r.reported);
        const notReported = cell.resDetail.filter(r=>!r.reported);
        const thC = { padding:"8px 10px", fontSize:12, fontWeight:600, color:C.txS,
          borderBottom:`2px solid ${C.brdD}`, background:C.bg, textAlign:"center", whiteSpace:"nowrap" };
        const tdC = (align="center") => ({ padding:"9px 10px", fontSize:12, color:C.txt,
          borderBottom:`1px solid ${C.brd}`, textAlign:align, verticalAlign:"middle" });
        return (
          <SidePanel open={!!panelInfo} onClose={()=>setPanelInfo(null)}
            title={`${col} 보고서 상세`} width={680} noScroll>
            {/* 바디 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {/* 요약 카드 */}
            <div style={{ display:"flex", gap:10, marginBottom:18 }}>
              <div style={{ flex:1, padding:"10px 14px", background:C.priL, borderRadius:8, textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:700, color:C.pri }}>{cell.reported}</div>
                <div style={{ fontSize:12, color:C.txS, marginTop:1 }}>보고 완료</div>
              </div>
              <div style={{ flex:1, padding:"10px 14px", background:"#FEF2F2", borderRadius:8, textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:700, color:"#EF4444" }}>{cell.total-cell.reported}</div>
                <div style={{ fontSize:12, color:C.txS, marginTop:1 }}>미보고</div>
              </div>
              <div style={{ flex:1, padding:"10px 14px", background:rBg(cell.rate), borderRadius:8, textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:700, color:rColor(cell.rate) }}>{cell.rate}%</div>
                <div style={{ fontSize:12, color:C.txS, marginTop:1 }}>보고율</div>
              </div>
            </div>

            <div style={{ fontSize:12, color:C.txL, marginBottom:14 }}>
              <span style={{ fontWeight:600, color: isTotal ? C.pri : C.txH }}>{sysNm}</span>
              &nbsp;·&nbsp;{col}&nbsp;·&nbsp;기준일: {baseDate}
            </div>

            {/* 자원 목록 테이블 */}
            <div style={{ marginBottom:0 }}>
              {/* 테이블 헤더 행 */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                paddingBottom:8, marginBottom:0 }}>
                <span style={{ fontSize:12, fontWeight:600, color:C.txH }}>자원 목록</span>
                {cell.hasReport && (
                  <Button primary onClick={()=>dlSingle(sysNm,col)}
                    style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
                    📥 전체 PDF 다운로드
                  </Button>
                )}
              </div>
              <div style={{ overflowX:"auto", border:`1px solid ${C.brd}`, borderRadius:8, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr>
                    <th style={{ ...thC, textAlign:"left", minWidth:120 }}>자원명</th>
                    <th style={thC}>보고주기</th>
                    <th style={thC}>점검일자</th>
                    <th style={thC}>보고서제출일</th>
                    <th style={thC}>점검자</th>
                    <th style={{ ...thC, color:"#19973C" }}>정상</th>
                    <th style={{ ...thC, color:"#E24949" }}>비정상</th>
                    <th style={thC}>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {[...reported, ...notReported].map((r,i) => (
                    <tr key={r.id||i}
                      style={{ background: r.reported ? (i%2===0?"#fff":"#FAFBFC") : "#FAFBFC" }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.secL}
                      onMouseLeave={e=>e.currentTarget.style.background=r.reported?(i%2===0?"#fff":"#FAFBFC"):"#FAFBFC"}>
                      {/* 자원명 */}
                      <td style={{ ...tdC("left"), fontWeight:600, color:C.txH }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:7, height:7, borderRadius:"50%", flexShrink:0,
                            background: r.reported ? "#19973C" : C.brd }} />
                          <div style={{ minWidth:0 }}>
                            <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:110 }}>{r.nm}</div>
                            {isTotal && <div style={{ fontSize:12, color:C.txL, fontWeight:400 }}>{r.sysNm}</div>}
                          </div>
                        </div>
                      </td>
                      {/* 보고주기 */}
                      <td style={tdC()}>
                        {(() => {
                          const fv = r.resFreq || (freq==="전체" ? "매월" : freq);
                          const fc = FREQ_COLOR[fv] || "#F36D00";
                          return <span style={{ padding:"2px 8px", borderRadius:8, fontSize:12, fontWeight:600,
                            background:fc+"1A", color:fc }}>{fv}</span>;
                        })()}
                      </td>
                      {/* 점검일자 */}
                      <td style={{ ...tdC(), color: r.inspDt ? C.txt : C.txX }}>
                        {r.inspDt || "—"}
                      </td>
                      {/* 보고서제출일 */}
                      <td style={{ ...tdC(), color: r.reportDt ? C.txt : C.txX }}>
                        {r.reportDt || "—"}
                      </td>
                      {/* 점검자 */}
                      <td style={tdC()}>{r.reported ? r.inspector : <span style={{color:C.txX}}>—</span>}</td>
                      {/* 정상 */}
                      <td style={tdC()}>
                        {r.reported
                          ? <span style={{ fontWeight:700, color:"#19973C" }}>{r.normalCnt}</span>
                          : <span style={{color:C.txX}}>—</span>}
                      </td>
                      {/* 비정상 */}
                      <td style={tdC()}>
                        {r.reported
                          ? <span style={{ fontWeight:700, color: r.abnCnt>0?"#E24949":C.txL }}>{r.abnCnt}</span>
                          : <span style={{color:C.txX}}>—</span>}
                      </td>
                      {/* PDF */}
                      <td style={tdC()}>
                        {r.reported ? (
                          <Button xs ghost onClick={()=>showToast(`${r.nm} 보고서 다운로드가 시작되었습니다.`)}
                            style={{ display:"inline-flex", alignItems:"center", gap:3 }}>
                            📥 PDF
                          </Button>
                        ) : (
                          <span style={{ fontSize:12, color:C.txX, background:"#F3F4F6",
                            padding:"3px 8px", borderRadius:4 }}>미보고</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>

            </div>{/* /바디 */}

            {/* 푸터 */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button onClick={()=>setPanelInfo(null)}>닫기</Button>
              </div>
            </div>
          </SidePanel>
        );
      })()}

      {toastMsg && (
        <div style={{ position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)",
          zIndex:99999, padding:"12px 28px", borderRadius:8, fontSize:15, fontWeight:600,
          color:"#fff", background:toastMsg.ok?"#16a34a":"#dc2626",
          boxShadow:"0 4px 20px rgba(0,0,0,.18)",
          display:"flex", alignItems:"center", gap:8, animation:"toastIn .3s ease" }}>
          <span>{toastMsg.ok?"✓":"✕"}</span>{toastMsg.msg}
        </div>
      )}
    </div>
  );
};


/* ── 공지사항 ── */

interface ManagerReportViewPageProps {}

export default function ManagerReportViewPage() { return <MgrInspReport />; }
