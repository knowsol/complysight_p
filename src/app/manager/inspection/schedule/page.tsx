// @ts-nocheck
'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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

  return (
    <Box>
      <PH title="점검스케줄" bc="홈 > 점검현황 > 점검스케줄" />
      <SB ph="스케줄명, 시스템명, 점검표명 검색" onSearch={doSearch} onReset={doReset}>
        <Stack direction="column" spacing={0.5} sx={{ minWidth: "fit-content" }}>
          <Box component="span" sx={{ ...LABEL_STYLE_SM }}>키워드</Box>
          <FInput
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            onKeyDown={e => e.key === "Enter" && doSearch()}
            placeholder="스케줄명, 시스템명, 점검표명"
            style={{ ...fInput, minWidth: 200 }}
          />
        </Stack>
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
          <Box sx={{ marginBottom: "20px" }}>
            <Stack direction="row" alignItems="center" spacing={0.75}
              sx={{ fontSize: 11, fontWeight: 600, color: C.txS, marginBottom: "8px" }}>
              <Ic n="clock" s={13} c={C.txS} />
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.txS }}>현재 등록된 배치 현황</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 400, color: C.txL }}>— 사용 중인 스케줄 {allSch.length}개</Typography>
            </Stack>
            {/* 타임라인 바 */}
            <Box sx={{ background: "#F8FAFC", border: `1px solid ${C.brd}`, borderRadius: "8px", padding: "12px 14px" }}>
              {/* 시간축 */}
              <Box sx={{ display: "flex", position: "relative", height: 28, marginBottom: "6px" }}>
                {Array.from({ length: 24 }, (_, h) => (
                  <Box key={h} sx={{ flex: 1, position: "relative" }}>
                    {h % 3 === 0 && (
                      <Box component="span" sx={{
                        position: "absolute", left: 0, top: 0, fontSize: 9, color: C.txL,
                        transform: "translateX(-50%)", whiteSpace: "nowrap",
                      }}>
                        {String(h).padStart(2,"0")}:00
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
              {/* 배치 블록 */}
              <Box sx={{ display: "flex", position: "relative", height: 22, background: "#EEF0F5", borderRadius: "4px", overflow: "visible" }}>
                {allSch.map((s, i) => {
                  const [hh, mm] = s.batchStartTime.split(":").map(Number);
                  const startPct = ((hh * 60 + mm) / 1440) * 100;
                  const widthPct = Math.max((s.batchMin / 1440) * 100, 0.8);
                  const col = FREQ_COL[s.freq] || C.pri;
                  return (
                    <Box key={s.id} title={`${s.nm}\n${s.batchStartTime} ~ +${s.batchMin}분 (${s.freq})`}
                      sx={{
                        position: "absolute", left: `${startPct}%`, width: `${widthPct}%`, minWidth: 4,
                        height: "100%", borderRadius: "3px", background: col, opacity: 0.82,
                        cursor: "default", transition: "opacity .15s",
                        '&:hover': { opacity: 1 },
                      }}
                    />
                  );
                })}
              </Box>
              {/* 혼잡 시간대 요약 */}
              {busyHours.length > 0 && (
                <Box sx={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {busyHours.map(slot => (
                    <Stack key={slot.h} direction="row" alignItems="center" spacing={0.5}
                      sx={{ padding: "3px 8px", borderRadius: "5px", background: "#fff", border: `1px solid ${C.brd}` }}>
                      <Typography sx={{ fontWeight: 700, color: C.txH, fontFamily: "inherit", fontSize: 12 }}>{slot.hh}시</Typography>
                      <Typography sx={{ color: C.txL, fontSize: 12 }}>·</Typography>
                      <Typography sx={{ color: C.txS, fontSize: 12 }}>{slot.items.length}건</Typography>
                      <Stack direction="row" spacing={0.25} sx={{ marginLeft: "2px" }}>
                        {slot.items.slice(0,3).map(s => (
                          <Box key={s.id} component="span" sx={{
                            width: 6, height: 6, borderRadius: "2px",
                            background: FREQ_COL[s.freq] || C.pri, display: "inline-block",
                          }} />
                        ))}
                        {slot.items.length > 3 && (
                          <Typography sx={{ fontSize: 12, color: C.txL }}>+{slot.items.length-3}</Typography>
                        )}
                      </Stack>
                    </Stack>
                  ))}
                  {(() => {
                    const peakSlot = busyHours.reduce((a,b) => a.items.length >= b.items.length ? a : b);
                    return peakSlot.items.length >= 2 ? (
                      <Stack direction="row" alignItems="center" spacing={0.5}
                        sx={{ padding: "3px 8px", borderRadius: "5px", background: "#FEF3C7", border: "1px solid #F59E0B", fontSize: 12, color: "#92400E" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <Typography sx={{ fontSize: 12, color: "#92400E" }}>
                          <b>{peakSlot.hh}시</b> 집중 ({peakSlot.items.length}건) — 시간대 분산을 권장합니다
                        </Typography>
                      </Stack>
                    ) : null;
                  })()}
                </Box>
              )}
            </Box>
          </Box>
        );
      })()}

      {filtered.length === 0 ? (
        <Stack direction="column" alignItems="center" justifyContent="center"
          sx={{ padding: "60px 0", color: C.txL, gap: "10px" }}>
          <Box component="span" sx={{ fontSize: 32 }}>🗓️</Box>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.txS }}>검색 결과가 없습니다</Typography>
          <Typography sx={{ fontSize: 12 }}>
            <Box component="span" sx={{ fontWeight: 600, color: C.txt }}>"{appliedQ}"</Box>에 해당하는 스케줄이 없습니다.
          </Typography>
          <Button onClick={doReset}
            sx={{
              marginTop: "4px", padding: "6px 16px", borderRadius: "6px",
              border: `1px solid ${C.brd}`, background: "#fff", color: C.txS,
              fontSize: 12, cursor: "pointer", textTransform: "none",
              '&:hover': { background: "#f5f5f5" },
            }}>
            🔄 초기화
          </Button>
        </Stack>
      ) : (
        <Tbl secTitle="점검스케줄 목록" secCount={filtered.length} secButtons={<SecBtnP onClick={() => setShowAdd(true)}>+ 스케줄 추가</SecBtnP>} onRow={row => setSelItem(row)} cols={[
          { t: "상태", k: "useYn", w: 80, r: v => <YnBadge v={v} /> },
          { t: "스케줄명", k: "nm", mw: 200, align: "left", r: v => (
            <Box component="span" sx={{ fontWeight: 600, color: C.pri }}>{v}</Box>
          )},
          { t: "실행주기", k: "freq", w: 90, r: v => {
            const map = { "매일":"#0C8CE9","매주":"#19973C","매월":"#F36D00","분기":"#7C3AED","반기":"#E24949","연간":"#333333","상시":"#0891B2" };
            const color = map[v] || C.txS;
            return (
              <Box component="span" sx={{
                display: "inline-block", padding: "2px 12px", borderRadius: "10px",
                fontSize: 12, fontWeight: 700, background: color+"1A", color,
              }}>{v}</Box>
            );
          }},
          { t: "배치시작시간", k: "batchStartTime", w: 100 },
          { t: "예상소요시간", k: "batchMin", w: 90, r: v => `${v}분` },
          { t: "자원수", k: "resCnt", w: 70 },
          { t: "다음 수행", k: "next" },
        ]} data={filtered} />
      )}
      <SchedulePanel open={showAdd} onClose={() => setShowAdd(false)} item={null} onAdd={handleAdd} />
      <SchedulePanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} onDelete={handleDelete} onUpdate={handleUpdate} />
    </Box>
  );
};

interface ManagerInspectionSchedulePageProps {
  toast?: (message: string, success?: boolean) => void;
}

export default function ManagerInspectionSchedulePage() { return <MgrInspSch />; }
