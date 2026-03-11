// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { YnBadge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { FreqBadge, EmptyState } from '@/components/ui/StyleUtils';
import { colors } from '@/lib/theme/colors';
import { FREQ_COLORS } from '@/lib/theme/status-colors';
import { LABEL_STYLE_SM, emptyState, fInput, freqChip } from '@/lib/theme/styles';
import { SYS } from '@/data/manager';
import { SCH } from '@/data/inspections';
import { CL_INIT } from '@/data/checklists';
import { SchedulePanel } from '@/components/panels';
import css from './page.module.css';


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
    <PageHeader title="점검스케줄" breadcrumb="홈 > 점검현황 > 점검스케줄" />
    <SearchBar placeholder="스케줄명, 시스템명, 점검표명 검색" onSearch={doSearch} onReset={doReset}>
      <div className={css.searchWrap}>
        <span style={{ ...LABEL_STYLE_SM }}>키워드</span>
        <FormInput
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && doSearch()}
          placeholder="스케줄명, 시스템명, 점검표명"
          className={css.searchInput}
          style={fInput}
        />
      </div>
    </SearchBar>

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
    return (
      <div className={css.timelineWrap}>
        <div className={css.timelineHeader}>
          <Icon name="clock" size={13} color={colors.textSecondary} />
          현재 등록된 배치 현황
          <span className={css.timelineSubtext}>— 사용 중인 스케줄 {allSch.length}개</span>
        </div>
        {/* 타임라인 바 */}
        <div className={css.timelineBar}>
          {/* 시간축 */}
          <div className={css.timeAxis}>
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className={css.timeAxisCell}>
                {h % 3 === 0 && (
                  <span className={css.timeMarker}>
                    {String(h).padStart(2,"0")}:00
                  </span>
                )}
              </div>
            ))}
          </div>
          {/* 배치 블록 */}
          <div className={css.batchTrack}>
            {allSch.map((s, i) => {
              const [hh, mm] = s.batchStartTime.split(":").map(Number);
              const startPct = ((hh * 60 + mm) / 1440) * 100;
              const widthPct = Math.max((s.batchMin / 1440) * 100, 0.8);
              const col = FREQ_COLORS[s.freq] || colors.primary;
              return (
                <div key={s.id} title={`${s.nm}
  ${s.batchStartTime} ~ +${s.batchMin}분 (${s.freq})`}
                  className={css.batchBlock}
                  style={{ left: `${startPct}%`, width: `${widthPct}%`, background: col }}
                  onMouseEnter={e=>e.currentTarget.style.opacity="1"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="0.82"} />
              );
            })}
          </div>
          {/* 혼잡 시간대 요약 */}
          {busyHours.length > 0 && (
            <div className={css.busyWrap}>
              {busyHours.map(slot => (
                <div key={slot.h} className={css.busyChip}>
                  <span className={css.busyHour}>{slot.hh}시</span>
                  <span className={css.busySep}>·</span>
                  <span className={css.busyCount}>{slot.items.length}건</span>
                  <div className={css.busyDots}>
                    {slot.items.slice(0,3).map(s => (
                      <span key={s.id} className={css.busyDot} style={{ background: FREQ_COLORS[s.freq] || colors.primary }} />
                    ))}
                    {slot.items.length > 3 && <span className={css.busyMore}>+{slot.items.length-3}</span>}
                  </div>
                </div>
              ))}
              {(() => {
                const peakSlot = busyHours.reduce((a,b) => a.items.length >= b.items.length ? a : b);
                return peakSlot.items.length >= 2 ? (
                  <div className={css.peakWarning}>
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
      <EmptyState icon="" style={{ ...emptyState, padding: "60px 0", gap: 10 }}>
        <span className={css.emptyIcon}>🗓️</span>
        <div className={css.emptyTitle}>검색 결과가 없습니다</div>
        <div className={css.emptyDesc}><span className={css.emptyQuery}>"{appliedQ}"</span>에 해당하는 스케줄이 없습니다.</div>
        <button onClick={doReset} className={css.resetBtn}>🔄 초기화</button>
      </EmptyState>
    ) : (
      <DataTable sectionTitle="점검스케줄 목록" sectionCount={filtered.length} sectionButtons={<Button variant="primary" onClick={() => setShowAdd(true)}>+ 스케줄 추가</Button>} onRow={row => setSelItem(row)} cols={[
        { title: "상태", fieldKey: "useYn", width: 80, renderCell: v => <YnBadge value={v} /> },
        { title: "스케줄명", fieldKey: "nm", minWidth: 200, align: "left", renderCell: v => <span className={css.schName}>{v}</span> },
        { title: "실행주기", fieldKey: "freq", width: 90, renderCell: v => <FreqBadge freq={v} style={{ ...freqChip(true, FREQ_COLORS[v] || colors.textSecondary), padding: "2px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700, lineHeight: "normal" }} /> },
        { title: "배치시작시간", fieldKey: "batchStartTime", width: 100 },
        { title: "예상소요시간", fieldKey: "batchMin", width: 90, renderCell: v => `${v}분` },
        { title: "자원수", fieldKey: "resCnt", width: 70 },
        { title: "다음 수행", fieldKey: "next" },
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
