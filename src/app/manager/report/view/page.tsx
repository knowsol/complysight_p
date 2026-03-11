// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { SidePanel } from '@/components/ui/SidePanel';
import { DatePicker } from '@/components/ui/DatePicker';
import { FreqBadge, RateBadge, InfoBox, SummaryCard, Toast } from '@/components/ui/StyleUtils';
import { colors } from '@/lib/theme/colors';
import { LABEL_STYLE_SM, TH, TD, freqChip, panelBody, panelFooterBar, sectionBar, hoverBg } from '@/lib/theme/styles';
import { FREQ_COLORS, rateColor, rateBg } from '@/lib/theme/status-colors';
import { SYS } from '@/data/manager';
import { RES } from '@/data/resources';
import { USERS } from '@/data/users';
import css from './page.module.css';


const MgrInspReport = () => {
  const FREQ_OPTS  = ["전체","상시","매일","매주","매월","분기","반기","연간"];
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
      <PageHeader title="점검보고서" breadcrumb="홈 > 점검현황 > 점검보고서" />

      {/* ── 검색폼 ── */}
      <SearchBar onSearch={search} onReset={reset}>
        <div className={css.searchField}>
          <span style={{ ...LABEL_STYLE_SM }}>기준일</span>
          <DatePicker value={baseDate} onChange={setBaseDate} style={{ width: 130 }} />
        </div>
        <div className={css.searchField}>
          <span style={{ ...LABEL_STYLE_SM }}>보고주기</span>
          <div className={css.freqOptions}>
            {FREQ_OPTS.map(f => {
              const active=freq===f, color=FREQ_COLORS[f];
              return (
                <span key={f} onClick={()=>setFreq(f)} style={freqChip(active, color)}>
                  {f}
                </span>
              );
            })}
          </div>
        </div>
      </SearchBar>

      {/* ── 테이블 가이드 안내 ── */}
      <div className={css.infoBox}>
        <InfoBox items={[
          { icon: "📊", text: "보고된 자원수 / 전체 자원수" },
          { icon: "🔍", text: "셀 클릭 시 자원별 보고서 상세 확인" },
          { icon: "📄", text: "PDF: 분류별 개별 다운로드" },
        ]} />
      </div>

      {/* ── 섹션 타이틀 ── */}
      <div style={sectionBar}>
        <div className={css.sectionTitle}>
          <span className={css.sectionHeading}>점검보고서 목록</span>
          <span className={css.sectionCount}>{filteredRows.length}건</span>
        </div>
      </div>

      {/* ── 테이블 ── */}
      <div className={css.tableScroll}>
        <table className={css.reportTable}>
          <thead>
            <tr className={css.tableHeadRow}>
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
                <tr className={css.totalRow}>
                  <td style={{...TD({textAlign:"left", borderBottom:`2px solid ${colors.borderDark}` })}}>
                    <div className={css.totalResourceTitle}>전체 자원</div>
                    <div className={css.totalResourceMeta}>전체 {SYS.length}개 정보시스템</div>
                  </td>
                  <td style={{...TD({textAlign:"center", borderBottom:`2px solid ${colors.borderDark}` })}}>
                    <RateBadge rate={overall} reported={reportedAll} total={totalAll} />
                  </td>
                  {RES_COLS.map(col => {
                    const cell = cells[col];
                    if (!cell) return <td key={col} style={{...TD({textAlign:"center", borderBottom:`2px solid ${colors.borderDark}` })}}><span className={css.mutedDash}>—</span></td>;
                    /* 전체자원 클릭용 합산 cell 구성 */
                    const mergedCell = (() => {
                      const allDetail = filteredRows.flatMap(r => r.cells[col]?.resDetail || []);
                      return { ...cell, resDetail: allDetail, hasReport: cell.reported > 0 };
                    })();
                    return (
                      <td key={col} onClick={()=>openPanel({ nm:"전체 자원", type:"전체", org:`${SYS.length}개 시스템` }, col, mergedCell)}
                        style={{...TD({textAlign:"center", borderBottom:`2px solid ${colors.borderDark}`,
                          cursor:"pointer", transition:"background .12s" })}}
                        {...hoverBg("", "#D8E8FF")}>
                        <RateBadge
                          rate={cell.rate}
                          reported={cell.reported}
                          total={cell.total}
                          style={{ background: 'transparent', padding: 0, borderRadius: 0 }}
                        />
                      </td>
                    );
                  })}
                  <td style={{...TD({textAlign:"center", borderBottom:`2px solid ${colors.borderDark}` })}}>
                    <span className={css.sectionCount}>—</span>
                  </td>
                </tr>
              );
            })()}

            {/* 시스템별 행 */}
            {filteredRows.map(({ sys, cells, overall, totalAll, reportedAll }, si) => {
              const isChk = !!checked[sys.id];
              return (
                <tr key={sys.id} style={{ cursor:"pointer", background:isChk?colors.primaryLight+"88":"" }}
                  onMouseEnter={e=>{ if(!isChk) e.currentTarget.style.background=colors.secondaryLight; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=isChk?colors.primaryLight+"88":""; }}>

                  <td style={{...TD({textAlign:"left"})}} >
                    <div className={css.systemName}>{sys.nm}</div>
                    <div className={css.systemMeta}>{sys.type} · {sys.org}</div>
                  </td>

                  <td style={{...TD({textAlign:"center"})}} >
                    <RateBadge rate={overall} reported={reportedAll} total={totalAll} />
                  </td>

                  {RES_COLS.map(col => {
                    const cell = cells[col];
                    if (!cell) return (
                      <td key={col} style={{...TD({textAlign:"center"})}} >
                        <span className={css.mutedDash}>—</span>
                      </td>
                    );
                    return (
                      <td key={col} onClick={()=>openPanel(sys,col,cell)}
                        style={{...TD({textAlign:"center"})}} {...hoverBg("", "#EEF4FF")}>
                        <div className={css.cellColumn}>
                          <RateBadge
                            rate={cell.rate}
                            reported={cell.reported}
                            total={cell.total}
                            style={{ background: 'transparent', padding: 0, borderRadius: 0 }}
                          />
                          {cell.hasReport ? (
                            <Button xs onClick={e=>{e.stopPropagation();dlSingle(sys.nm,col);}}
                              style={{ padding:"3px 7px", gap:3, fontWeight:400 }}>
                              {dlIcon} PDF
                            </Button>
                          ) : (
                            <span className={css.notGenerated}>미생성</span>
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

      <div className={css.tableGuide}>
        <span className={css.tableGuideText}>보고된 자원수 / 전체 자원수 &nbsp;·&nbsp; 셀 클릭 시 자원별 보고서 상세 확인 &nbsp;·&nbsp; PDF: 분류별 개별 다운로드</span>
      </div>

      {/* ── 자원별 보고서 사이드패널 ── */}
      {panelInfo && (() => {
        const { sysNm, col, cell } = panelInfo;
        const isTotal     = sysNm === "전체 자원";
        const reported    = cell.resDetail.filter(r=>r.reported);
        const notReported = cell.resDetail.filter(r=>!r.reported);
        const thC = { padding:"8px 10px", fontSize:12, fontWeight:600, color:colors.textSecondary,
          borderBottom:`2px solid ${colors.borderDark}`, background:colors.background, textAlign:"center", whiteSpace:"nowrap" };
        const tdC = (align="center") => ({ padding:"9px 10px", fontSize:12, color:colors.text,
          borderBottom:`1px solid ${colors.border}`, textAlign:align, verticalAlign:"middle" });
        return (
          <SidePanel open={!!panelInfo} onClose={()=>setPanelInfo(null)}
            title={`${col} 보고서 상세`} width={680} noScroll>
            {/* 바디 */}
            <div style={panelBody}>
            {/* 요약 카드 */}
            <div className={css.panelSummaryRow}>
              <SummaryCard value={cell.reported} label="보고 완료" bg={colors.primaryLight} valueColor={colors.primary} />
              <SummaryCard value={cell.total - cell.reported} label="미보고" bg="#FEF2F2" valueColor="#EF4444" />
              <SummaryCard value={`${cell.rate}%`} label="보고율" bg={rateBg(cell.rate)} valueColor={rateColor(cell.rate)} />
            </div>

            <div className={css.panelSubInfo}>
              <span className={css.panelSubInfoName} style={{ color: isTotal ? colors.primary : colors.textHeading }}>{sysNm}</span>
              &nbsp;·&nbsp;{col}&nbsp;·&nbsp;기준일: {baseDate}
            </div>

            {/* 자원 목록 테이블 */}
            <div className={css.panelTableSection}>
              {/* 테이블 헤더 행 */}
              <div className={css.panelTableHeader}>
                <span className={css.panelTableTitle}>자원 목록</span>
                {cell.hasReport && (
                  <Button primary onClick={()=>dlSingle(sysNm,col)}
                    className={css.panelDownloadButton}>
                    📥 전체 PDF 다운로드
                  </Button>
                )}
              </div>
              <div className={css.panelGridWrap}>
              <table className={css.panelGrid}>
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
                      onMouseEnter={e=>e.currentTarget.style.background=colors.secondaryLight}
                      onMouseLeave={e=>e.currentTarget.style.background=r.reported?(i%2===0?"#fff":"#FAFBFC"):"#FAFBFC"}>
                      {/* 자원명 */}
                      <td style={{ ...tdC("left") }} className={css.panelNameCell}>
                        <div className={css.panelNameRow}>
                          <div className={css.statusDot}
                            style={{ background: r.reported ? "#19973C" : colors.border }} />
                          <div className={css.panelNameTextBox}>
                            <div className={css.panelNameText}>{r.nm}</div>
                            {isTotal && <div className={css.panelSystemName}>{r.sysNm}</div>}
                          </div>
                        </div>
                      </td>
                      {/* 보고주기 */}
                      <td style={tdC()}>
                        {(() => {
                          const fv = r.resFreq || (freq==="전체" ? "매월" : freq);
                          return <FreqBadge freq={fv} />;
                        })()}
                      </td>
                      {/* 점검일자 */}
                      <td style={{ ...tdC(), color: r.inspDt ? colors.text : colors.textMuted }}>
                        {r.inspDt || "—"}
                      </td>
                      {/* 보고서제출일 */}
                      <td style={{ ...tdC(), color: r.reportDt ? colors.text : colors.textMuted }}>
                        {r.reportDt || "—"}
                      </td>
                      {/* 점검자 */}
                      <td style={tdC()}>{r.reported ? r.inspector : <span style={{color:colors.textMuted}}>—</span>}</td>
                      {/* 정상 */}
                      <td style={tdC()}>
                        {r.reported
                          ? <span className={css.normalCount}>{r.normalCnt}</span>
                          : <span style={{color:colors.textMuted}}>—</span>}
                      </td>
                      {/* 비정상 */}
                      <td style={tdC()}>
                        {r.reported
                          ? <span style={{ fontWeight:700, color: r.abnCnt>0?"#E24949":colors.textLight }}>{r.abnCnt}</span>
                          : <span style={{color:colors.textMuted}}>—</span>}
                      </td>
                      {/* PDF */}
                      <td style={tdC()}>
                        {r.reported ? (
                          <Button xs ghost onClick={()=>showToast(`${r.nm} 보고서 다운로드가 시작되었습니다.`)}
                            className={css.pdfButton}>
                            📥 PDF
                          </Button>
                        ) : (
                          <span className={css.unreportedBadge}>미보고</span>
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
            <div style={panelFooterBar}>
              <div className={css.panelFooterLeft}>
                <Button onClick={()=>setPanelInfo(null)}>닫기</Button>
              </div>
            </div>
          </SidePanel>
        );
      })()}

      {toastMsg && <Toast msg={toastMsg.msg} ok={toastMsg.ok} />}
    </div>
  );
};


/* ── 공지사항 ── */

interface ManagerReportViewPageProps {}

export default function ManagerReportViewPage() { return <MgrInspReport />; }
