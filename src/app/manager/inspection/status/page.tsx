// @ts-nocheck
'use client';

import { useState } from 'react';
import { useDI } from '@/contexts/DIContext';
import { PH } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { SidePanel } from '@/components/ui/SidePanel';
import { C } from '@/lib/theme/colors';
import { SYS } from '@/data/manager';
import { SI } from '@/data/inspections';


const MgrInspSt = () => {
  const { di } = useDI();
  const [selDay, setSelDay] = useState(null);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(1); // 0-indexed, 1=Feb
  const [showYMPicker, setShowYMPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(2026);

  const pad = n => String(n).padStart(2, "0");
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const goMonthPrev = () => { let m = viewMonth - 1, y = viewYear; if (m < 0) { m = 11; y--; } setViewMonth(m); setViewYear(y); setSelDay(null); };
  const goMonthNext = () => { let m = viewMonth + 1, y = viewYear; if (m > 11) { m = 0; y++; } setViewMonth(m); setViewYear(y); setSelDay(null); };

  const allInsp = [...di.map(x => ({...x, _type: "일상"})), ...SI.map(x => ({...x, _type: "특별", resNm: x.title}))];
  const dayItems = selDay
    ? allInsp.filter(x => x.due === `${viewYear}-${pad(viewMonth + 1)}-${pad(selDay)}`)
    : [];

  return <div>
    <PH title="점검현황" bc="홈 > 점검현황" />
    <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.brd}`, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(98vh - 170px)", maxHeight: 1500 }}>
      {/* 캘린더 네비게이션 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 12px", borderBottom: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
          <span onClick={() => { setPickerYear(viewYear); setShowYMPicker(!showYMPicker); }}
            style={{ fontSize: 28, fontWeight: 700, color: C.txH, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, userSelect: "none", padding: "2px 0", transition: "opacity .2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            {viewYear}.{viewMonth + 1}
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ marginTop: 2 }}><path d="M3 4.5L6 7.5L9 4.5" stroke={C.txL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          {showYMPicker && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 98 }} onClick={() => setShowYMPicker(false)} />
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 99,
                background: "#fff", borderRadius: 10, boxShadow: "0 4px 24px rgba(0,0,0,.14)",
                border: `1px solid ${C.brd}`, padding: "14px 16px", minWidth: 260 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span onClick={() => setPickerYear(pickerYear - 1)} style={{ cursor: "pointer", padding: "2px 10px", fontWeight: 700, fontSize: 15, color: C.txS, userSelect: "none" }}>‹</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>{pickerYear}년</span>
                  <span onClick={() => setPickerYear(pickerYear + 1)} style={{ cursor: "pointer", padding: "2px 10px", fontWeight: 700, fontSize: 15, color: C.txS, userSelect: "none" }}>›</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const isSel = pickerYear === viewYear && i === viewMonth;
                    return (
                      <div key={i} onClick={() => { setViewYear(pickerYear); setViewMonth(i); setShowYMPicker(false); setSelDay(null); }}
                        style={{ textAlign: "center", padding: "7px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                          background: isSel ? C.pri : "transparent", color: isSel ? "#fff" : C.txt,
                          border: isSel ? `1px solid ${C.pri}` : `1px solid ${C.brd}` }}
                        onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = C.priL; }}
                        onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                        {pad(i + 1)}월
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
        {/* 범례 */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {[{ bg: "#dcfce7", bd: "#16653433", l: "일상점검" }, { bg: "#fff7ed", bd: "#c2410c33", l: "특별점검" }].map(lg =>
            <span key={lg.l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.txS }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: lg.bg, border: `1px solid ${lg.bd}` }} />{lg.l}
            </span>
          )}
        </div>
      </div>

      {/* 요일 헤더 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", flexShrink: 0 }}>
        {["일","월","화","수","목","금","토"].map((d, i) => (
          <div key={d} style={{ padding: "10px 12px", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            color: i === 0 ? "#ef4444" : i === 6 ? C.pri : C.txL, borderBottom: `1px solid ${C.brd}` }}>{d}</div>
        ))}
      </div>

      {/* 날짜 그리드 - 일요일 시작 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridTemplateRows: `repeat(${Math.ceil((firstDay + daysInMonth) / 7)}, 1fr)`, flex: 1, minHeight: 0 }}>
        {(() => {
          const sunFirst = firstDay;
          const rows = Math.ceil((sunFirst + daysInMonth) / 7) * 7;
          const rowCount = rows / 7;
          const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
          return Array.from({ length: rows }, (_, idx) => {
            const dayNum = idx - sunFirst + 1;
            const isValid = dayNum >= 1 && dayNum <= daysInMonth;
            let displayDay = dayNum;
            if (dayNum < 1) displayDay = prevMonthDays + dayNum;
            else if (dayNum > daysInMonth) displayDay = dayNum - daysInMonth;
            const ds = isValid ? `${viewYear}-${pad(viewMonth + 1)}-${pad(dayNum)}` : "";
            const dailyCnt = isValid ? di.filter(x => x.due === ds).length : 0;
            const specCnt = isValid ? SI.filter(x => x.due === ds).length : 0;
            const today = isValid && viewYear === 2026 && viewMonth === 1 && dayNum === 11;
            const isSel = selDay === dayNum && isValid;
            const dow = idx % 7; // 0=일 1=월 ... 6=토
            const isWeekRow = Math.floor(idx / 7);
            const isLastRow = isWeekRow === Math.ceil(rows / 7) - 1;

            return (
              <div key={idx}
                onClick={() => isValid && setSelDay(dayNum === selDay ? null : dayNum)}
                style={{
                  position: "relative", padding: "8px 12px",
                  borderBottom: isLastRow ? "none" : `1px solid ${C.brd}`,
                  borderRight: dow < 6 ? `1px solid ${C.brd}` : "none",
                  cursor: isValid ? "pointer" : "default",
                  transition: "background .15s",
                  background: isSel ? C.priL : "transparent",
                }}
                onMouseEnter={e => { if (isValid && !isSel) e.currentTarget.style.background = "#FAFAFA"; }}
                onMouseLeave={e => { if (isValid && !isSel) e.currentTarget.style.background = isSel ? C.priL : "transparent"; }}
              >
                {/* 지연 건이 있으면 오른쪽 상단 빨간 동그라미 */}
                {isValid && (di.some(x => x.due === ds && x.st === "지연") || SI.some(x => x.due === ds && x.st === "지연")) && (
                  <div style={{ position: "absolute", top: 16, right: 10, width: 8, height: 8, borderRadius: "50%", background: C.red }} />
                )}
                {isSel && (
                  <div style={{ position: "absolute", top: 0, right: 0, width: 3, height: "100%", background: C.pri }} />
                )}
                <div style={{
                  fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 6,
                  color: !isValid ? C.txX : today ? C.red : dow === 0 ? "#ef4444" : dow === 6 ? C.pri : C.txH,
                }}>{pad(displayDay)}</div>
                {isValid && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {dailyCnt > 0 && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#166534", lineHeight: 1.4, fontWeight: 500 }}>일상점검 <span style={{ minWidth: 16, height: 16, borderRadius: 8, background: "#dcfce7", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{dailyCnt}</span></div>}
                    {specCnt > 0 && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#c2410c", lineHeight: 1.4, fontWeight: 500 }}>특별점검 <span style={{ minWidth: 16, height: 16, borderRadius: 8, background: "#fff7ed", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{specCnt}</span></div>}
                  </div>
                )}
              </div>
            );
          });
        })()}
      </div>
    </div>

    <SidePanel open={selDay !== null && dayItems.length > 0} onClose={() => setSelDay(null)}
      title={`${viewYear}년 ${viewMonth + 1}월 ${selDay}일 점검 목록`} width={480}>
      {dayItems.map((it, i) => (
        <div key={i} style={{ padding: 12, marginBottom: 8, borderRadius: 8, border: `1px solid ${C.brd}`, background: "#F9FAFC" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{it.resNm || it.title}</span>
            <Badge status={it.st} />
          </div>
          <div style={{ fontSize: 12, color: C.txS }}>
            <span style={{ padding: "1px 6px", borderRadius: 3, marginRight: 6,
              background: it._type === "일상" ? "#dcfce7" : "#fff7ed",
              color: it._type === "일상" ? "#166534" : "#c2410c", fontSize: 12 }}>{it._type}</span>
            {it.sysNm} · {it.kind || it.clNm} · {it.insp || ""}
          </div>
        </div>
      ))}
      {dayItems.length === 0 && <div style={{ textAlign: "center", color: C.txL, fontSize: 12, padding: 32 }}>점검 항목이 없습니다.</div>}
    </SidePanel>
  </div>;
};

interface ManagerInspectionStatusPageProps {}

export default function ManagerInspectionStatusPage() { return <MgrInspSt />; }
