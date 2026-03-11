// @ts-nocheck
'use client';

import { useState } from 'react';
import { useDI } from '@/contexts/DIContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { SidePanel } from '@/components/ui/SidePanel';
import { colors } from '@/lib/theme/colors';
import { hoverBg, emptyState } from '@/lib/theme/styles';
import { LegendItem, EmptyState } from '@/components/ui/StyleUtils';
import { SYS } from '@/data/manager';
import { SI } from '@/data/inspections';
import css from './page.module.css';


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

  const monthHover = hoverBg("transparent", colors.primaryLight);
  const dayHover = hoverBg("transparent", "#FAFAFA");

  const monthCellStyle = (isSel: boolean) => ({
    background: isSel ? colors.primary : 'transparent',
    color: isSel ? '#fff' : colors.text,
    border: isSel ? `1px solid ${colors.primary}` : `1px solid ${colors.border}`,
  });

  const legendDotStyle = (bg: string, bd: string) => ({
    background: bg,
    border: `1px solid ${bd}`,
  });

  const dayOfWeekStyle = (i: number) => ({
    color: i === 0 ? '#ef4444' : i === 6 ? colors.primary : colors.textLight,
  });

  const dayCellStyle = (isSel: boolean, isValid: boolean, isLast: boolean, dow: number) => ({
    borderBottom: isLast ? 'none' : `1px solid ${colors.border}`,
    borderRight: dow < 6 ? `1px solid ${colors.border}` : 'none',
    cursor: isValid ? 'pointer' : 'default',
    background: isSel ? colors.primaryLight : 'transparent',
  });

  const dayNumStyle = (isValid: boolean, today: boolean, dow: number) => ({
    color: !isValid ? colors.textMuted : today ? colors.red : dow === 0 ? '#ef4444' : dow === 6 ? colors.primary : colors.textHeading,
  });

  const inspCountStyle = (type: string) => ({
    color: type === '일상' ? '#166534' : '#c2410c',
  });

  const countBadgeStyle = (type: string) => ({
    background: type === '일상' ? '#dcfce7' : '#fff7ed',
  });

  const typeBadgeStyle = (type: string) => ({
    background: type === '일상' ? '#dcfce7' : '#fff7ed',
    color: type === '일상' ? '#166534' : '#c2410c',
  });

  return <div>
    <PageHeader title="점검현황" breadcrumb="홈 > 점검현황" />
    <div className={css.calendarWrap}>
      {/* 캘린더 네비게이션 */}
      <div className={css.calNav}>
        <div className={css.ymWrap}>
          <span onClick={() => { setPickerYear(viewYear); setShowYMPicker(!showYMPicker); }}
            className={css.ymTitle}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            {viewYear}.{viewMonth + 1}
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className={css.ymChevron}><path d="M3 4.5L6 7.5L9 4.5" stroke={colors.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          {showYMPicker && (
            <>
              <div className={css.pickerOverlay} onClick={() => setShowYMPicker(false)} />
              <div className={css.pickerDropdown}>
                <div className={css.pickerNav}>
                  <span onClick={() => setPickerYear(pickerYear - 1)} className={css.pickerArrow}>‹</span>
                  <span className={css.pickerYear}>{pickerYear}년</span>
                  <span onClick={() => setPickerYear(pickerYear + 1)} className={css.pickerArrow}>›</span>
                </div>
                <div className={css.pickerGrid}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const isSel = pickerYear === viewYear && i === viewMonth;
                    return (
                      <div key={i} onClick={() => { setViewYear(pickerYear); setViewMonth(i); setShowYMPicker(false); setSelDay(null); }}
                        className={css.monthCell}
                        style={monthCellStyle(isSel)}
                        onMouseEnter={e => { if (!isSel) monthHover.onMouseEnter(e); }}
                        onMouseLeave={e => { if (!isSel) monthHover.onMouseLeave(e); }}>
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
        <div className={css.legendWrap}>
          {[{ bg: "#dcfce7", bd: "#16653433", l: "일상점검" }, { bg: "#fff7ed", bd: "#c2410c33", l: "특별점검" }].map(lg =>
            <span key={lg.l} className={css.legendItem}>
              <span className={css.legendDot} style={legendDotStyle(lg.bg, lg.bd)} />{lg.l}
            </span>
          )}
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className={css.weekHeader}>
        {["일","월","화","수","목","금","토"].map((d, i) => (
          <div key={d} className={css.dayOfWeek} style={dayOfWeekStyle(i)}>{d}</div>
        ))}
      </div>

      {/* 날짜 그리드 - 일요일 시작 */}
      <div className={css.dayGrid} style={{ gridTemplateRows: `repeat(${Math.ceil((firstDay + daysInMonth) / 7)}, 1fr)` }}>
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
                className={css.dayCell}
                style={dayCellStyle(isSel, isValid, isLastRow, dow)}
                onMouseEnter={e => { if (isValid && !isSel) dayHover.onMouseEnter(e); }}
                onMouseLeave={e => { if (isValid && !isSel) dayHover.onMouseLeave(e); }}
              >
                {/* 지연 건이 있으면 오른쪽 상단 빨간 동그라미 */}
                {isValid && (di.some(x => x.due === ds && x.st === "지연") || SI.some(x => x.due === ds && x.st === "지연")) && (
                  <div className={css.delayDot} />
                )}
                {isSel && (
                  <div className={css.selIndicator} />
                )}
                <div className={css.dayNum} style={dayNumStyle(isValid, today, dow)}>{pad(displayDay)}</div>
                {isValid && (
                  <div className={css.inspGroup}>
                    {dailyCnt > 0 && <div className={css.inspCount} style={inspCountStyle('일상')}>일상점검 <span className={css.countBadge} style={countBadgeStyle('일상')}>{dailyCnt}</span></div>}
                    {specCnt > 0 && <div className={css.inspCount} style={inspCountStyle('특별')}>특별점검 <span className={css.countBadge} style={countBadgeStyle('특별')}>{specCnt}</span></div>}
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
        <div key={i} className={css.panelItem}>
          <div className={css.panelItemHead}>
            <span className={css.panelItemTitle}>{it.resNm || it.title}</span>
            <Badge status={it.st} />
          </div>
          <div className={css.panelItemMeta}>
            <span className={css.typeBadge} style={typeBadgeStyle(it._type)}>{it._type}</span>
            {it.sysNm} · {it.kind || it.clNm} · {it.insp || ""}
          </div>
        </div>
      ))}
      {dayItems.length === 0 && <div style={{ ...emptyState, padding: 32, fontSize: 12 }}>점검 항목이 없습니다.</div>}
    </SidePanel>
  </div>;
};

interface ManagerInspectionStatusPageProps {}

export default function ManagerInspectionStatusPage() { return <MgrInspSt />; }
