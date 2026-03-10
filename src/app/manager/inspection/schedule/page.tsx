// @ts-nocheck
'use client';

import { useState } from 'react';
import { PH } from '@/components/ui/PageHeader';
import { Tbl } from '@/components/ui/Table';
import { YnBadge } from '@/components/ui/Badge';
import { SB } from '@/components/ui/SearchBar';
import { SecBtnP } from '@/components/ui/Button';
import { FInput } from '@/components/ui/Input';
import { Ic } from '@/components/ui/Icon';
import { C } from '@/lib/theme/colors';
import { LABEL_STYLE_SM, fInput } from '@/lib/theme/styles';
import { SYS } from '@/data/manager';
import { SCH } from '@/data/inspections';
import { CL_INIT } from '@/data/checklists';
import { SchedulePanel } from '@/components/panels';


const MgrInspSch = ({ toast }) => {
  const [schList, setSchList] = useState(SCH);
  const [showAdd, setShowAdd] = useState(false);
  const [selItem, setSelItem] = useState(null);
  const [searchQ,   setSearchQ]   = useState("");
  const [appliedQ,  setAppliedQ]  = useState("");

  const doSearch = () => setAppliedQ(searchQ.trim());
  const doReset  = () => { setSearchQ(""); setAppliedQ(""); };

  const handleDelete = (item) => {
    setSchList(prev => prev.filter(s => s.id !== item.id));
    setSelItem(null);
    toast?.("스케줄이 삭제되었습니다.", false);
  };

  const handleAdd = (form) => {
    const newItem = {
      id:             Date.now(),
      nm:             form.nm,
      sysNm:          SYS.find(s => s.id === form.sysId)?.nm || "",
      clNm:           CL_INIT.find(c => c.id === form.clId)?.nm || "",
      useYn:          form.st === "사용" ? "Y" : "N",
      freq:           form.freq,
      batchStartTime: form.batchStartTime,
      batchMin:       form.batchMin,
      rptDdlnHr:      form.rptDdlnHr,
      resCnt:         form.resources.length,
      next:           "—",
    };
    setSchList(prev => [newItem, ...prev]);
    setShowAdd(false);
    toast?.("스케줄이 등록되었습니다.");
  };

  const handleUpdate = (form) => {
    setSchList(prev => prev.map(s => s.id === selItem?.id ? {
      ...s,
      nm:             form.nm,
      useYn:          form.st === "사용" ? "Y" : "N",
      freq:           form.freq,
      batchStartTime: form.batchStartTime,
      batchMin:       form.batchMin,
      resCnt:         form.resources.length,
    } : s));
    setSelItem(prev => prev ? {
      ...prev,
      nm:             form.nm,
      useYn:          form.st === "사용" ? "Y" : "N",
      freq:           form.freq,
      batchStartTime: form.batchStartTime,
      batchMin:       form.batchMin,
      resCnt:         form.resources.length,
    } : prev);
    toast?.("스케줄이 저장되었습니다.");
  };

  const filtered = appliedQ
    ? schList.filter(r =>
        r.nm?.includes(appliedQ) ||
        r.sysNm?.includes(appliedQ) ||
        r.clNm?.includes(appliedQ)
      )
    : schList;

  return <div>
    <PH title="점검스케줄" bc="홈 > 점검현황 > 점검스케줄" />
    <SB ph="스케줄명, 시스템명, 점검표명 검색" onSearch={doSearch} onReset={doReset}>
      <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:"fit-content" }}>
        <span style={{ ...LABEL_STYLE_SM }}>키워드</span>
        <FInput
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && doSearch()}
          placeholder="스케줄명, 시스템명, 점검표명"
          style={{ ...fInput, minWidth: 200 }}
        />
      </div>
    </SB>

    {/* ── 배치 현황 타임라인 ── */}
    {(() => {
      // SCH에서 사용 중(useYn=Y)이고 배치시작시간이 설정된 항목만 필터링
    const allSch = SCH.filter(s => s.useYn === "Y" && s.batchStartTime);
    // 24시간 슬롯 (00~23시)
    const slots = Array.from({ length: 24 }, (_, h) => {
      const hh = String(h).padStart(2,"0");
      const inSlot = allSch.filter(s => s.batchStartTime.startsWith(hh));
      return { h, hh, items: inSlot };
    });
    const busyHours = slots.filter(s => s.items.length > 0);
    const FREQ_COL = { "매일":"#0C8CE9","매주":"#19973C","매월":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333","상시":"#0891B2" };
    return (
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.txS, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
          <Ic n="clock" s={13} c={C.txS} />
          현재 등록된 배치 현황
          <span style={{ fontSize:11, fontWeight:400, color:C.txL }}>— 사용 중인 스케줄 {allSch.length}개</span>
        </div>
        {/* 타임라인 바 */}
        <div style={{ background:"#F8FAFC", border:`1px solid ${C.brd}`, borderRadius:8, padding:"12px 14px" }}>
          {/* 시간축 */}
          <div style={{ display:"flex", position:"relative", height:28, marginBottom:6 }}>
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} style={{ flex:1, position:"relative" }}>
                {h % 3 === 0 && (
                  <span style={{ position:"absolute", left:0, top:0, fontSize:9, color:C.txL, transform:"translateX(-50%)", whiteSpace:"nowrap" }}>
                    {String(h).padStart(2,"0")}:00
                  </span>
                )}
              </div>
            ))}
          </div>
          {/* 배치 블록 */}
          <div style={{ display:"flex", position:"relative", height:22, background:"#EEF0F5", borderRadius:4, overflow:"visible" }}>
            {allSch.map((s, i) => {
              const [hh, mm] = s.batchStartTime.split(":").map(Number);
              const startPct = ((hh * 60 + mm) / 1440) * 100;
              const widthPct = Math.max((s.batchMin / 1440) * 100, 0.8);
              const col = FREQ_COL[s.freq] || C.pri;
              return (
                <div key={s.id} title={`${s.nm}
  ${s.batchStartTime} ~ +${s.batchMin}분 (${s.freq})`}
                  style={{ position:"absolute", left:`${startPct}%`, width:`${widthPct}%`, minWidth:4,
                    height:"100%", borderRadius:3, background:col, opacity:0.82,
                    cursor:"default", transition:"opacity .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.opacity="1"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="0.82"} />
              );
            })}
          </div>
          {/* 혼잡 시간대 요약 */}
          {busyHours.length > 0 && (
            <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:6 }}>
              {busyHours.map(slot => (
                <div key={slot.h} style={{ display:"flex", alignItems:"center", gap:4,
                  padding:"3px 8px", borderRadius:5, background:"#fff", border:`1px solid ${C.brd}` }}>
                  <span style={{ fontWeight:700, color:C.txH, fontFamily:"inherit", fontSize:12 }}>{slot.hh}시</span>
                  <span style={{ color:C.txL, fontSize:12 }}>·</span>
                  <span style={{ color:C.txS, fontSize:12 }}>{slot.items.length}건</span>
                  <div style={{ display:"flex", gap:2, marginLeft:2 }}>
                    {slot.items.slice(0,3).map(s => (
                      <span key={s.id} style={{ width:6, height:6, borderRadius:2,
                        background: FREQ_COL[s.freq] || C.pri, display:"inline-block" }} />
                    ))}
                    {slot.items.length > 3 && <span style={{ fontSize:12, color:C.txL }}>+{slot.items.length-3}</span>}
                  </div>
                </div>
              ))}
              {(() => {
                const peakSlot = busyHours.reduce((a,b) => a.items.length >= b.items.length ? a : b);
                return peakSlot.items.length >= 2 ? (
                  <div style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 8px",
                    borderRadius:5, background:"#FEF3C7", border:"1px solid #F59E0B", fontSize:12, color:"#92400E" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span><b>{peakSlot.hh}시</b> 집중 ({peakSlot.items.length}건) — 시간대 분산을 권장합니다</span>
                  </div>
                ) : null;
              })()}
          </div>
        )}
      </div>
    </div>
  );
    })()}

    {filtered.length === 0 ? (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:"60px 0", color:C.txL, gap:10 }}>
        <span style={{ fontSize:32 }}>🗓️</span>
        <div style={{ fontSize:15, fontWeight:600, color:C.txS }}>검색 결과가 없습니다</div>
        <div style={{ fontSize:12 }}>
          <span style={{ fontWeight:600, color:C.txt }}>"{appliedQ}"</span>에 해당하는 스케줄이 없습니다.
        </div>
        <button onClick={doReset}
          style={{ marginTop:4, padding:"6px 16px", borderRadius:6, border:`1px solid ${C.brd}`,
            background:"#fff", color:C.txS, fontSize:12, cursor:"pointer" }}>
          🔄 초기화
        </button>
      </div>
    ) : (
      <Tbl secTitle="점검스케줄 목록" secCount={filtered.length} secButtons={<SecBtnP onClick={() => setShowAdd(true)}>+ 스케줄 추가</SecBtnP>} onRow={row => setSelItem(row)} cols={[
        { t: "상태", k: "useYn", w: 80, r: v => <YnBadge v={v} /> },
        { t: "스케줄명", k: "nm", mw: 200, align: "left", r: v => <span style={{ fontWeight: 600, color: C.pri }}>{v}</span> },
        { t: "실행주기", k: "freq", w: 90, r: v => {
          const map = { "매일":"#0C8CE9","매주":"#19973C","매월":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333333","상시":"#0891B2" };
          const color = map[v] || C.txS;
          return <span style={{ display:"inline-block", padding:"2px 12px", borderRadius:10, fontSize:12, fontWeight:700, background:color+"1A", color }}>{v}</span>;
        }},
        { t: "배치시작시간", k: "batchStartTime", w: 100 },
        { t: "예상소요시간", k: "batchMin", w: 90, r: v => `${v}분` },
        { t: "자원수", k: "resCnt", w: 70 },
        { t: "다음 수행", k: "next" },
      ]} data={filtered} />
    )}
    <SchedulePanel open={showAdd} onClose={() => setShowAdd(false)} item={null} onAdd={handleAdd} />
    <SchedulePanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} onDelete={handleDelete} onUpdate={handleUpdate} />
  </div>;
};

interface ManagerInspectionSchedulePageProps {
  toast?: (message: string, success?: boolean) => void;
}

export default function ManagerInspectionSchedulePage() { return <MgrInspSch />; }
