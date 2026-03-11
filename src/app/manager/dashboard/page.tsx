// @ts-nocheck
'use client';

import { useRouter } from 'next/navigation';
import { useDI } from '@/contexts/DIContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, YnBadge } from '@/components/ui/Badge';
import { colors } from '@/lib/theme/colors';
import { SC, rateColor, rateBg, rateGrade } from '@/lib/theme/status-colors';
import { sectionBar, hoverBg, summaryCard, summaryValue, summaryLabel } from '@/lib/theme/styles';
import { RateBadge, LegendItem, SummaryCard, StatusInfoCard, KeyValueRow, ProgressBar, DotIndicator } from '@/components/ui/StyleUtils';
import { SYS } from '@/data/manager';
import { RES } from '@/data/resources';
import { NT } from '@/data/notices';
import { _mids } from '@/data/systems';
import { ROUTES } from '@/lib/constants/routes';
import css from './page.module.css';

const MgrDash = ({ nav }) => {
  const { di, addDI } = useDI();
  const cnt = { s: di.filter(x => x.st === "요청").length, p: di.filter(x => x.st === "중단").length, d: di.filter(x => x.st === "지연").length, c: di.filter(x => x.st === "완료").length };

  /* ── 점검 상태 보고: 정보시스템 + 자원 세부분류별 완료율 계산 ── */
  const inspStatusData = (() => {
    const result = [];
    SYS.forEach(sys => {
      const sysRes = RES.filter(r => r.sysId === sys.id);
      const midGroups = {};
      sysRes.forEach(r => {
        if (!midGroups[r.mid]) midGroups[r.mid] = [];
        midGroups[r.mid].push(r);
      });
      const rows = Object.entries(midGroups).map(([mid, resources]) => {
        const total = resources.length;
        /* 완료율: resourceId hash 기반 시뮬레이션 */
        const doneCount = resources.filter((r, i) => {
          const h = (r.id * 17 + i * 7) % 100;
          return h < 72;
        }).length;
        const rate = total > 0 ? Math.round((doneCount / total) * 100) : 0;
        return { mid, total, doneCount, rate };
      });
      if (rows.length > 0) result.push({ sys, rows });
    });
    return result;
  })();

  const reportStatusStyle = {
    value: (color: string) => ({ ...summaryValue(color), fontSize: 44, fontWeight: 700 }),
    badge: (bg: string, color: string) => ({
      ...summaryLabel,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px 10px",
      borderRadius: 10,
      fontSize: 12,
      fontWeight: 600,
      background: bg,
      color,
      marginTop: 4,
    }),
  };

  return <div>
    <PageHeader title="대시보드" breadcrumb="홈 > 대시보드" />
    <div className={css.topCardsRow}>
      <StatCard label="전체 정보시스템" value={SYS.length} color={colors.primary} icon="server" onClick={()=>nav&&nav("mr")} />
      <StatCard label="전체 자원" value={RES.length} color={colors.secondary} icon="db" onClick={()=>nav&&nav("mr")} />
      <StatCard label="오늘 보고 예정" value={(cnt.s||0) + (cnt.p||0)} color="#F36D00" icon="cal" onClick={()=>nav&&nav("mis")} />
      <StatCard label="보고 지연" value={cnt.d} color={colors.red} icon="alert" onClick={()=>nav&&nav("mis")} />
    </div>
    <div className={css.mainGrid}>
      <Card title="오늘의 보고 현황">
        <div className={css.reportSummaryRow}>
          {[["예정", cnt.s, "요청"], ["진행", cnt.p, null], ["지연", cnt.d, "지연"], ["완료", cnt.c, "완료"]].map(([label, v, st]) => (
            <div key={label} className={css.reportStatusItem}>
              <div style={reportStatusStyle.value(st ? SC[st].t : colors.primary)}>{v}</div>
              <div style={reportStatusStyle.badge(st ? SC[st].b : colors.primaryLight, st ? SC[st].t : colors.primary)}>{label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── 최근 공지사항: 항목 클릭 시 공지사항 페이지로 이동 ── */}
      <Card title="최근 공지사항">
        {NT.slice(0, 3).map(n => (
          <div key={n.id}
            onClick={() => nav && nav("mbn")}
            className={css.noticeRow}
            {...hoverBg("transparent", colors.primaryLight)}>
            <span className={css.noticeTitle}>{n.title}</span>
            <span className={css.noticeDate}>{n.dt}</span>
          </div>
        ))}
      </Card>

      {/* ── 점검 상태 보고: 정보시스템 + 자원 세부분류별 ── */}
      <div className={css.span2}>
      <Card title="보고 상태 보고">
        {/* 범례 */}
        <div style={{ ...sectionBar, height: "auto", borderBottom: "none", justifyContent: "flex-start", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
          {[["100%","#19973C"],["80-99%","#0C8CE9"],["50-79%","#F36D00"],["1-49%","#E24949"],["0%","#7C3AED"]].map(([label, color]) => (
            <LegendItem key={label} label={label} color={color} />
          ))}
        </div>
        {/* 테이블 */}
        <div className={css.tableScroll}>
          <table className={css.tableBase}>
            <thead>
              <tr className={css.tableHeaderRow}>
                <th className={`${css.thCell} ${css.thCellLeft}`} style={{ minWidth: 140 }}>정보시스템</th>
                {_mids.map(mid => (
                  <th key={mid} className={`${css.thCell} ${css.thCellTight}`}>{mid}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inspStatusData.map(({ sys, rows }, si) => {
                const midMap = {};
                rows.forEach(r => { midMap[r.mid] = r; });
                return (
                  <tr key={sys.id} style={{ borderBottom: `1px solid ${colors.border}`, background: si % 2 === 0 ? "#fff" : "#FAFBFC" }}>
                    <td className={css.sysName}>
                      <div className={css.sysNameMain}>{sys.nm}</div>
                      <div className={css.sysNameMeta}>{sys.type} · {sys.org}</div>
                    </td>
                    {_mids.map(mid => {
                      const cell = midMap[mid];
                      if (!cell) return (
                        <td key={mid} className={`${css.tdCell} ${css.tdCellPadded}`}>
                          <span className={css.emptyCellText}>—</span>
                        </td>
                      );
                      return (
                        <td key={mid} className={css.tdCell} style={{ background: rateBg(cell.rate) }}>
                            <div className={css.rateWrap}>
                            <RateBadge rate={cell.rate} percent title={rateGrade(cell.rate)} style={{ color: rateColor(cell.rate), background: rateBg(cell.rate) }} />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      </div>

      {/* ── 자원유형별 / 자동vs육안 / 최근 점검 이력 — 3칼럼 ── */}
      <div className={css.threeColGrid}>

      {/* ── 자원 유형별 점검 현황 (가로 막대) ── */}
      <Card title="자원 유형별 보고 현황">
        {(() => {
          const types = ["서버","WEB","WAS","DBMS","네트워크","보안","스토리지","백업","서비스","유효성"];
          const data = types.map(t => {
            const total = RES.filter(r => r.mid === t).length;
            const h = (t.charCodeAt(0) * 7 + t.length * 13) % 100;
            const ok = Math.round(total * (0.5 + (h % 40) / 100));
            const ng = Math.round(total * ((h % 15) / 100));
            const none = Math.max(0, total - ok - ng);
            return { t, ok, ng, none, total };
          }).filter(d => d.total > 0);
          const max = Math.max(...data.map(d => d.total), 1);
          return <div className={css.typeChartCol}>
            {data.map(d => <div key={d.t} className={css.typeChartRow}>
              <span className={css.typeName}>{d.t}</span>
              <div className={css.typeBar}>
                {d.ok > 0 && <div title={`정상 ${d.ok}`} style={{ width: `${(d.ok / max) * 100}%`, background: "#479559" }} />}
                {d.ng > 0 && <div title={`비정상 ${d.ng}`} style={{ width: `${(d.ng / max) * 100}%`, background: "#f2c67d" }} />}
                {d.none > 0 && <div title={`미점검 ${d.none}`} style={{ width: `${(d.none / max) * 100}%`, background: "#BDC3C7" }} />}
              </div>
              <span className={css.typeCount}>{d.total}</span>
            </div>)}
            <div className={css.typeLegend}>
              {[["정상","#479559"],["비정상","#f2c67d"],["미점검","#BDC3C7"]].map(([l, c]) => (
                <LegendItem key={l} label={l} color={c} style={{ fontSize: 12 }} />
              ))}
            </div>
          </div>;
        })()}
      </Card>

      {/* ── 자동점검 vs 육안점검 비율 ── */}
      <Card title="자동점검 vs 육안점검 비율">
        {(() => {
          const auto = 68, manual = 32;
          const total = auto + manual;
          const r = 56, cx = 70, cy = 70;
          const autoAngle = (auto / total) * 360;
          const toRad = a => (a - 90) * Math.PI / 180;
          const x1 = cx + r * Math.cos(toRad(0)), y1 = cy + r * Math.sin(toRad(0));
          const x2 = cx + r * Math.cos(toRad(autoAngle)), y2 = cy + r * Math.sin(toRad(autoAngle));
          const lg = autoAngle > 180 ? 1 : 0;
          return <div className={css.donutWrap}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx={cx} cy={cy} r={r} fill="#EEEEEE" />
              <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} Z`} fill={colors.primary} />
              <circle cx={cx} cy={cy} r={32} fill="#fff" />
              <text x={cx} y={cy - 3} textAnchor="middle" style={{ fontSize: 18, fontWeight: 600, fill: colors.text }}>{total}</text>
              <text x={cx} y={cy + 11} textAnchor="middle" style={{ fontSize: 12, fill: colors.textLight }}>전체 점검</text>
            </svg>
            <div className={css.donutLegendRow}>
              <div className={css.donutLegendItem}>
                <div className={css.donutLegendHead}><span style={{ width: 10, height: 10, borderRadius: 2, background: colors.primary }} /><span style={{ fontSize: 12, fontWeight: 600 }}>자동점검</span></div>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>{auto}%</div>
                <div style={{ fontSize: 12, color: colors.textLight }}>{Math.round(di.length * auto / 100)}건</div>
              </div>
              <div className={css.donutLegendItem}>
                <div className={css.donutLegendHead}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#EEEEEE" }} /><span style={{ fontSize: 12, fontWeight: 600 }}>육안점검</span></div>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.textSecondary }}>{manual}%</div>
                <div style={{ fontSize: 12, color: colors.textLight }}>{Math.round(di.length * manual / 100)}건</div>
              </div>
            </div>
          </div>;
        })()}
      </Card>

      {/* ── 최근 점검 이력 (명칭 변경, 상태 "완료", 점검표 명칭 노출) ── */}
      <Card title="최근 보고 이력" extra={<span className={css.recent24}>최근 24시간</span>}>
        {(() => {
          const logs = [
            { id: 1, t: "09:15", res: "CRM-DB-01", clNm: "DBMS 상태점검표" },
            { id: 2, t: "08:42", res: "SEC-NET-03", clNm: "네트워크 상태점검표" },
            { id: 3, t: "07:30", res: "MAIL-WAS-02", clNm: "WAS 상태점검표" },
            { id: 4, t: "어제 22:10", res: "FIN-SVR-04", clNm: "서버 상태점검표" },
            { id: 5, t: "어제 18:35", res: "GW-WEB-01", clNm: "서비스 유효성 점검표" },
          ];
          return <div className={css.timelineWrap}>
            <div className={css.timelineRail} />
            {logs.map((l, i) => (
              <div key={l.id} className={css.timelineItem} style={{ paddingBottom: i < logs.length - 1 ? 10 : 0 }}>
                <DotIndicator color={SC["완료"].t} style={{ position: "absolute", left: -13, top: 3, border: "2px solid #fff" }} />
                <div className={css.timelineMeta}>
                  <span className={css.timelineTime}>{l.t}</span>
                  <Badge status="완료" />
                  <span className={css.timelineResource}>{l.res}</span>
                </div>
                <div className={css.timelineChecklist}>{l.clNm}</div>
              </div>
            ))}
          </div>;
        })()}
      </Card>

      </div>

      {/* ── 관리자 전용: 시스템 운영 현황 ── */}
      <div className={css.span2}>
      <Card title="시스템 운영 현황" extra={<span className={css.adminOnlyBadge}>관리자 전용</span>}>
        <div className={css.adminGrid}>
          {/* 라이선스 현황 */}
          <StatusInfoCard title="라이선스 현황" titleColor="#854d0e" bg="#fefce8" borderColor="#fef08a">
            <KeyValueRow label="정보시스템" value={`${SYS.filter(s => s.id !== "SHARED").length} / 15`} />
            <KeyValueRow label="자원" value={`${RES.length} / 500`} style={{ marginBottom: 6 }} />
            <ProgressBar value={RES.length} max={500} color={RES.length > 450 ? colors.red : RES.length > 350 ? "#f59e0b" : "#22c55e"} />
            <div className={css.licenseExpiry}>만료일: 2026-12-31</div>
          </StatusInfoCard>
          {/* 코어 연동 상태 */}
          <StatusInfoCard title="코어 연동 상태" titleColor="#1e40af" bg={colors.primaryLight} borderColor={`${colors.primary}30`}>
            <div className={css.coreStatusRow}>
              <DotIndicator color="#22c55e" size={10} style={{ animation: "pulse 2s infinite" }} />
              <span className={css.coreStatusText}>정상 운영 중</span>
            </div>
            <div className={css.coreMetaText}>마지막 통신: 09:15:32</div>
            <div className={css.coreMetaText}>평균 응답: 124ms</div>
          </StatusInfoCard>
          {/* 점검 실행 현황 (명칭 변경) */}
          <StatusInfoCard title="자동점검 실행 현황" titleColor="#166534" bg="#f0fdf4" borderColor="#bbf7d0">
            <KeyValueRow label="오늘 실행" value={<span className={css.runCountStrong}>24회</span>} />
            <KeyValueRow label="성공" value={<span className={css.successCountStrong}>23회</span>} />
            <KeyValueRow label="실패" value={<span className={css.failCountStrong}>1회</span>} style={{ marginBottom: 0 }} />
          </StatusInfoCard>
          {/* 최근 점검 결과 (명칭 변경) */}
          <StatusInfoCard title="자동점검 실행 결과" titleColor="#6b21a8" bg="#faf5ff" borderColor="#e9d5ff">
            {[{ t: "09:00", s: true, n: "CRM 서버 일간점검" }, { t: "08:00", s: true, n: "WEB 서비스 일간점검" }, { t: "07:00", s: false, n: "SEC 보안 점검" }, { t: "06:00", s: true, n: "HR 서버 일간점검" }].map((b, i) => (
              <div key={i} className={css.resultItem}>
                <DotIndicator color={b.s ? "#22c55e" : "#ef4444"} size={6} style={{ borderRadius: 3 }} />
                <span className={css.resultTime}>{b.t}</span>
                <span className={css.resultName}>{b.n}</span>
              </div>
            ))}
          </StatusInfoCard>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      </Card>
      </div>

      {/* ── 정보시스템별 자원 현황 ── */}
      <div className={css.span2}>
      <Card title="정보시스템별 자원 현황">
        <DataTable cols={[{ title: "시스템명", fieldKey: "nm" }, { title: "유형", fieldKey: "type" }, { title: "관리주체", fieldKey: "org" }, { title: "자원수", fieldKey: "res" }, { title: "구성원수", fieldKey: "mem" }, { title: "상태", fieldKey: "useYn", renderCell: v => <YnBadge value={v} /> }]} data={SYS} noPaging />
      </Card>
      </div>
    </div>
  </div>;
};

interface ManagerDashboardPageProps {}

export default function ManagerDashboardPage() { const router = useRouter();
const nav = (key: keyof typeof ROUTES) => router.push(ROUTES[key]);
return <MgrDash nav={nav} />; }
