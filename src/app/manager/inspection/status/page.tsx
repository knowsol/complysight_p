// @ts-nocheck
'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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

  return (
    <Box>
      <PH title="점검현황" bc="홈 > 점검현황" />
      <Box sx={{
        background: C.white,
        borderRadius: 2,
        border: `1px solid ${C.brd}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "calc(98vh - 170px)",
        maxHeight: 1500,
      }}>
        {/* 캘린더 네비게이션 */}
        <Stack direction="row" alignItems="center" justifyContent="space-between"
          sx={{ padding: "16px 12px", borderBottom: `1px solid ${C.brd}`, flexShrink: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, position: "relative" }}>
            <Box
              component="span"
              onClick={() => { setPickerYear(viewYear); setShowYMPicker(!showYMPicker); }}
              sx={{
                fontSize: 28, fontWeight: 700, color: C.txH, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 1, userSelect: "none",
                padding: "2px 0", transition: "opacity .2s",
                '&:hover': { opacity: 0.7 },
              }}
            >
              {viewYear}.{viewMonth + 1}
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ marginTop: 2 }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke={C.txL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Box>
            {showYMPicker && (
              <>
                <Box sx={{ position: "fixed", inset: 0, zIndex: 98 }} onClick={() => setShowYMPicker(false)} />
                <Box sx={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 99,
                  background: "#fff", borderRadius: "10px", boxShadow: "0 4px 24px rgba(0,0,0,.14)",
                  border: `1px solid ${C.brd}`, padding: "14px 16px", minWidth: 260,
                }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginBottom: "12px" }}>
                    <Box component="span"
                      onClick={() => setPickerYear(pickerYear - 1)}
                      sx={{ cursor: "pointer", padding: "2px 10px", fontWeight: 700, fontSize: 15, color: C.txS, userSelect: "none" }}>
                      ‹
                    </Box>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: C.txt }}>{pickerYear}년</Typography>
                    <Box component="span"
                      onClick={() => setPickerYear(pickerYear + 1)}
                      sx={{ cursor: "pointer", padding: "2px 10px", fontWeight: 700, fontSize: 15, color: C.txS, userSelect: "none" }}>
                      ›
                    </Box>
                  </Stack>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const isSel = pickerYear === viewYear && i === viewMonth;
                      return (
                        <Box key={i}
                          onClick={() => { setViewYear(pickerYear); setViewMonth(i); setShowYMPicker(false); setSelDay(null); }}
                          sx={{
                            textAlign: "center", padding: "7px 0", borderRadius: "6px",
                            fontSize: 12, fontWeight: 600, cursor: "pointer",
                            background: isSel ? C.pri : "transparent",
                            color: isSel ? "#fff" : C.txt,
                            border: isSel ? `1px solid ${C.pri}` : `1px solid ${C.brd}`,
                            '&:hover': !isSel ? { background: C.priL } : {},
                          }}>
                          {pad(i + 1)}월
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </>
            )}
          </Box>
          {/* 범례 */}
          <Stack direction="row" spacing={1.25} alignItems="center">
            {[{ bg: "#dcfce7", bd: "#16653433", l: "일상점검" }, { bg: "#fff7ed", bd: "#c2410c33", l: "특별점검" }].map(lg =>
              <Stack key={lg.l} direction="row" alignItems="center" spacing={0.5}
                sx={{ fontSize: 12, color: C.txS }}>
                <Box component="span" sx={{ width: 8, height: 8, borderRadius: "2px", background: lg.bg, border: `1px solid ${lg.bd}` }} />
                <Typography sx={{ fontSize: 12, color: C.txS }}>{lg.l}</Typography>
              </Stack>
            )}
          </Stack>
        </Stack>

        {/* 요일 헤더 */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", flexShrink: 0 }}>
          {["일","월","화","수","목","금","토"].map((d, i) => (
            <Box key={d} sx={{
              padding: "10px 12px", fontSize: 12, fontWeight: 600,
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: i === 0 ? "#ef4444" : i === 6 ? C.pri : C.txL,
              borderBottom: `1px solid ${C.brd}`,
            }}>{d}</Box>
          ))}
        </Box>

        {/* 날짜 그리드 - 일요일 시작 */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gridTemplateRows: `repeat(${Math.ceil((firstDay + daysInMonth) / 7)}, 1fr)`,
          flex: 1,
          minHeight: 0,
        }}>
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
                <Box key={idx}
                  onClick={() => isValid && setSelDay(dayNum === selDay ? null : dayNum)}
                  sx={{
                    position: "relative", padding: "8px 12px",
                    borderBottom: isLastRow ? "none" : `1px solid ${C.brd}`,
                    borderRight: dow < 6 ? `1px solid ${C.brd}` : "none",
                    cursor: isValid ? "pointer" : "default",
                    transition: "background .15s",
                    background: isSel ? C.priL : "transparent",
                    '&:hover': isValid && !isSel ? { background: "#FAFAFA" } : {},
                  }}
                >
                  {/* 지연 건이 있으면 오른쪽 상단 빨간 동그라미 */}
                  {isValid && (di.some(x => x.due === ds && x.st === "지연") || SI.some(x => x.due === ds && x.st === "지연")) && (
                    <Box sx={{ position: "absolute", top: 16, right: 10, width: 8, height: 8, borderRadius: "50%", background: C.red }} />
                  )}
                  {isSel && (
                    <Box sx={{ position: "absolute", top: 0, right: 0, width: 3, height: "100%", background: C.pri }} />
                  )}
                  <Typography sx={{
                    fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: "6px",
                    color: !isValid ? C.txX : today ? C.red : dow === 0 ? "#ef4444" : dow === 6 ? C.pri : C.txH,
                  }}>{pad(displayDay)}</Typography>
                  {isValid && (
                    <Stack direction="column" spacing={0.25}>
                      {dailyCnt > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}
                          sx={{ fontSize: 12, color: "#166534", lineHeight: 1.4, fontWeight: 500 }}>
                          <Typography sx={{ fontSize: 12, color: "#166534", fontWeight: 500 }}>일상점검</Typography>
                          <Box component="span" sx={{
                            minWidth: 16, height: 16, borderRadius: "8px", background: "#dcfce7",
                            fontSize: 12, fontWeight: 700, display: "inline-flex",
                            alignItems: "center", justifyContent: "center", padding: "0 5px",
                          }}>{dailyCnt}</Box>
                        </Stack>
                      )}
                      {specCnt > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}
                          sx={{ fontSize: 12, color: "#c2410c", lineHeight: 1.4, fontWeight: 500 }}>
                          <Typography sx={{ fontSize: 12, color: "#c2410c", fontWeight: 500 }}>특별점검</Typography>
                          <Box component="span" sx={{
                            minWidth: 16, height: 16, borderRadius: "8px", background: "#fff7ed",
                            fontSize: 12, fontWeight: 700, display: "inline-flex",
                            alignItems: "center", justifyContent: "center", padding: "0 5px",
                          }}>{specCnt}</Box>
                        </Stack>
                      )}
                    </Stack>
                  )}
                </Box>
              );
            });
          })()}
        </Box>
      </Box>

      <SidePanel open={selDay !== null && dayItems.length > 0} onClose={() => setSelDay(null)}
        title={`${viewYear}년 ${viewMonth + 1}월 ${selDay}일 점검 목록`} width={480}>
        {dayItems.map((it, i) => (
          <Box key={i} sx={{ padding: "12px", marginBottom: "8px", borderRadius: "8px", border: `1px solid ${C.brd}`, background: "#F9FAFC" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: "4px" }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{it.resNm || it.title}</Typography>
              <Badge status={it.st} />
            </Stack>
            <Box sx={{ fontSize: 12, color: C.txS }}>
              <Box component="span" sx={{
                padding: "1px 6px", borderRadius: "3px", marginRight: "6px",
                background: it._type === "일상" ? "#dcfce7" : "#fff7ed",
                color: it._type === "일상" ? "#166534" : "#c2410c", fontSize: 12,
              }}>{it._type}</Box>
              {it.sysNm} · {it.kind || it.clNm} · {it.insp || ""}
            </Box>
          </Box>
        ))}
        {dayItems.length === 0 && (
          <Typography sx={{ textAlign: "center", color: C.txL, fontSize: 12, padding: "32px" }}>
            점검 항목이 없습니다.
          </Typography>
        )}
      </SidePanel>
    </Box>
  );
};

interface ManagerInspectionStatusPageProps {}

export default function ManagerInspectionStatusPage() { return <MgrInspSt />; }
