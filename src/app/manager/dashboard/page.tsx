// @ts-nocheck
'use client';

import { useRouter } from 'next/navigation';
import { useDI } from '@/contexts/DIContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Badge, YnBadge } from '@/components/ui/Badge';
import { C } from '@/lib/theme/colors';
import { SC } from '@/lib/theme/status-colors';
import { SYS } from '@/data/manager';
import { RES } from '@/data/resources';
import { NT } from '@/data/notices';
import { _mids } from '@/data/systems';
import { ROUTES } from '@/lib/constants/routes';

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
        /* 상태 등급 */
        const grade = rate === 100 ? "정상" : rate >= 80 ? "경미" : rate >= 50 ? "경고" : rate >= 1 ? "지연" : "장애";
        const gradeColor = { 정상: "#19973C", 경미: "#0C8CE9", 경고: "#F36D00", 지연: "#E24949", 장애: "#7C3AED" };
        const gradeBg = { 정상: "#E8F5EC", 경미: "#E6F3FA", 경고: "#FFF3E6", 지연: "#FDE8E8", 장애: "#EDE9FE" };
        return { mid, total, doneCount, rate, grade, gradeColor: gradeColor[grade], gradeBg: gradeBg[grade] };
      });
      if (rows.length > 0) result.push({ sys, rows });
    });
    return result;
  })();

  return <div>
    <PageHeader title="대시보드" bc="홈 > 대시보드" />
    <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
      <StatCard label="전체 정보시스템" value={SYS.length} color={C.pri} icon="server" onClick={()=>nav&&nav("mr")} />
      <StatCard label="전체 자원" value={RES.length} color={C.sec} icon="db" onClick={()=>nav&&nav("mr")} />
      <StatCard label="오늘 보고 예정" value={(cnt.s||0) + (cnt.p||0)} color="#F36D00" icon="cal" onClick={()=>nav&&nav("mis")} />
      <StatCard label="보고 지연" value={cnt.d} color={C.red} icon="alert" onClick={()=>nav&&nav("mis")} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Card title="오늘의 보고 현황">
        <div style={{ display: "flex", gap: 14 }}>
          {[["예정", cnt.s, "요청"], ["진행", cnt.p, null], ["지연", cnt.d, "지연"], ["완료", cnt.c, "완료"]].map(([label, v, st]) => (
            <div key={label} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 44, fontWeight: 700, color: st ? SC[st].t : C.pri }}>{v}</div>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: st ? SC[st].b : C.priL, color: st ? SC[st].t : C.pri, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── 최근 공지사항: 항목 클릭 시 공지사항 페이지로 이동 ── */}
      <Card title="최근 공지사항">
        {NT.slice(0, 3).map(n => (
          <div key={n.id}
            onClick={() => nav && nav("mbn")}
            style={{ padding: "7px 0", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", cursor: "pointer", transition: "background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.priL}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontSize: 14 }}>{n.title}</span>
            <span style={{ fontSize: 14, color: C.txL, flexShrink: 0, marginLeft: 8 }}>{n.dt}</span>
          </div>
        ))}
      </Card>

      {/* ── 점검 상태 보고: 정보시스템 + 자원 세부분류별 ── */}
      <Card title="보고 상태 보고" style={{ gridColumn: "span 2" }}>
        {/* 범례 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
          {[["100%","#19973C"],["80-99%","#0C8CE9"],["50-79%","#F36D00"],["1-49%","#E24949"],["0%","#7C3AED"]].map(([label, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: color }} />
              <span style={{ fontSize: 12, fontWeight: 600, color }}>{label}</span>
            </div>
          ))}
        </div>
        {/* 테이블 */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.bg }}>
                <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: C.txS, borderBottom: `1px solid ${C.brd}`, whiteSpace: "nowrap", width: 140 }}>정보시스템</th>
                {_mids.map(mid => (
                  <th key={mid} style={{ padding: "8px 8px", textAlign: "center", fontWeight: 600, color: C.txS, borderBottom: `1px solid ${C.brd}`, whiteSpace: "nowrap", minWidth: 64 }}>{mid}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inspStatusData.map(({ sys, rows }, si) => {
                const midMap = {};
                rows.forEach(r => { midMap[r.mid] = r; });
                return (
                  <tr key={sys.id} style={{ borderBottom: `1px solid ${C.brd}`, background: si % 2 === 0 ? "#fff" : "#FAFBFC" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: C.txH, whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 12 }}>{sys.nm}</div>
                      <div style={{ fontSize: 12, color: C.txL, marginTop: 1 }}>{sys.type} · {sys.org}</div>
                    </td>
                    {_mids.map(mid => {
                      const cell = midMap[mid];
                      if (!cell) return (
                        <td key={mid} style={{ padding: "8px 8px", textAlign: "center" }}>
                          <span style={{ fontSize: 12, color: C.txX }}>—</span>
                        </td>
                      );
                      return (
                        <td key={mid} style={{ padding: "6px 8px", textAlign: "center" }}>
                            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: cell.gradeColor, background: cell.gradeBg, padding: "2px 7px", borderRadius: 10, whiteSpace: "nowrap" }}>
                              {cell.rate}%
                            </span>
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

      {/* ── 자원유형별 / 자동vs육안 / 최근 점검 이력 — 3칼럼 ── */}
      <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

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
          return <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.map(d => <div key={d.t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 52, fontSize: 12, fontWeight: 500, textAlign: "right", flexShrink: 0, color: C.txS }}>{d.t}</span>
              <div style={{ flex: 1, display: "flex", height: 18, borderRadius: 3, overflow: "hidden", background: "#F9FAFC" }}>
                {d.ok > 0 && <div title={`정상 ${d.ok}`} style={{ width: `${(d.ok / max) * 100}%`, background: "#479559" }} />}
                {d.ng > 0 && <div title={`비정상 ${d.ng}`} style={{ width: `${(d.ng / max) * 100}%`, background: "#f2c67d" }} />}
                {d.none > 0 && <div title={`미점검 ${d.none}`} style={{ width: `${(d.none / max) * 100}%`, background: "#BDC3C7" }} />}
              </div>
              <span style={{ fontSize: 12, color: C.txL, width: 22, flexShrink: 0 }}>{d.total}</span>
            </div>)}
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: C.txS, marginTop: 4, paddingLeft: 60 }}>
              {[["정상","#479559"],["비정상","#f2c67d"],["미점검","#BDC3C7"]].map(([l, c]) => <span key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}</span>)}
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
          return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx={cx} cy={cy} r={r} fill="#EEEEEE" />
              <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} Z`} fill={C.pri} />
              <circle cx={cx} cy={cy} r={32} fill="#fff" />
              <text x={cx} y={cy - 3} textAnchor="middle" style={{ fontSize: 18, fontWeight: 600, fill: C.txt }}>{total}</text>
              <text x={cx} y={cy + 11} textAnchor="middle" style={{ fontSize: 12, fill: C.txL }}>전체 점검</text>
            </svg>
            <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, justifyContent: "center" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: C.pri }} /><span style={{ fontSize: 12, fontWeight: 600 }}>자동점검</span></div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.pri }}>{auto}%</div>
                <div style={{ fontSize: 12, color: C.txL }}>{Math.round(di.length * auto / 100)}건</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, justifyContent: "center" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#EEEEEE" }} /><span style={{ fontSize: 12, fontWeight: 600 }}>육안점검</span></div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.txS }}>{manual}%</div>
                <div style={{ fontSize: 12, color: C.txL }}>{Math.round(di.length * manual / 100)}건</div>
              </div>
            </div>
          </div>;
        })()}
      </Card>

      {/* ── 최근 점검 이력 (명칭 변경, 상태 "완료", 점검표 명칭 노출) ── */}
      <Card title="최근 보고 이력" extra={<span style={{ fontSize: 12, color: C.txL }}>최근 24시간</span>}>
        {(() => {
          const logs = [
            { id: 1, t: "09:15", res: "CRM-DB-01", clNm: "DBMS 상태점검표" },
            { id: 2, t: "08:42", res: "SEC-NET-03", clNm: "네트워크 상태점검표" },
            { id: 3, t: "07:30", res: "MAIL-WAS-02", clNm: "WAS 상태점검표" },
            { id: 4, t: "어제 22:10", res: "FIN-SVR-04", clNm: "서버 상태점검표" },
            { id: 5, t: "어제 18:35", res: "GW-WEB-01", clNm: "서비스 유효성 점검표" },
          ];
          return <div style={{ position: "relative", paddingLeft: 16 }}>
            <div style={{ position: "absolute", left: 5, top: 4, bottom: 4, width: 2, background: C.brd }} />
            {logs.map((l, i) => (
              <div key={l.id} style={{ position: "relative", paddingLeft: 14, paddingBottom: i < logs.length - 1 ? 10 : 0 }}>
                <div style={{ position: "absolute", left: -13, top: 3, width: 8, height: 8, borderRadius: 4, background: SC["완료"].t, border: "2px solid #fff" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: C.txL, minWidth: 50 }}>{l.t}</span>
                  <Badge status="완료" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.txt }}>{l.res}</span>
                </div>
                <div style={{ fontSize: 12, color: C.txS, marginTop: 1 }}>{l.clNm}</div>
              </div>
            ))}
          </div>;
        })()}
      </Card>

      </div>

      {/* ── 관리자 전용: 시스템 운영 현황 ── */}
      <Card title="시스템 운영 현황" style={{ gridColumn: "span 2" }} extra={<span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#dbeafe", color: "#1d4ed8", fontWeight: 600 }}>관리자 전용</span>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {/* 라이선스 현황 */}
          <div style={{ padding: 16, borderRadius: 8, background: "#fefce8", border: "1px solid #fef08a" }}>
            <div style={{ fontSize: 12, color: "#854d0e", fontWeight: 600, marginBottom: 8 }}>라이선스 현황</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.txS }}>정보시스템</span><span style={{ fontSize: 12, fontWeight: 600 }}>{SYS.filter(s => s.id !== "SHARED").length} / 15</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: C.txS }}>자원</span><span style={{ fontSize: 12, fontWeight: 600 }}>{RES.length} / 500</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "#EEEEEE", overflow: "hidden" }}>
              <div style={{ width: `${(RES.length / 500) * 100}%`, height: "100%", borderRadius: 3, background: RES.length > 450 ? C.red : RES.length > 350 ? "#f59e0b" : "#22c55e" }} />
            </div>
            <div style={{ fontSize: 12, color: C.txL, marginTop: 4 }}>만료일: 2026-12-31</div>
          </div>
          {/* 코어 연동 상태 */}
          <div style={{ padding: 16, borderRadius: 8, background: C.priL, border: `1px solid ${C.pri}30` }}>
            <div style={{ fontSize: 12, color: "#1e40af", fontWeight: 600, marginBottom: 8 }}>코어 연동 상태</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: "#22c55e", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>정상 운영 중</span>
            </div>
            <div style={{ fontSize: 12, color: C.txL }}>마지막 통신: 09:15:32</div>
            <div style={{ fontSize: 12, color: C.txL }}>평균 응답: 124ms</div>
          </div>
          {/* 점검 실행 현황 (명칭 변경) */}
          <div style={{ padding: 16, borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <div style={{ fontSize: 12, color: "#166534", fontWeight: 600, marginBottom: 8 }}>자동점검 실행 현황</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.txS }}>오늘 실행</span><span style={{ fontSize: 12, fontWeight: 700 }}>24회</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.txS }}>성공</span><span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>23회</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: C.txS }}>실패</span><span style={{ fontSize: 12, fontWeight: 700, color: C.red }}>1회</span>
            </div>
          </div>
          {/* 최근 점검 결과 (명칭 변경) */}
          <div style={{ padding: 16, borderRadius: 8, background: "#faf5ff", border: "1px solid #e9d5ff" }}>
            <div style={{ fontSize: 12, color: "#6b21a8", fontWeight: 600, marginBottom: 8 }}>자동점검 실행 결과</div>
            {[{ t: "09:00", s: true, n: "CRM 서버 일간점검" }, { t: "08:00", s: true, n: "WEB 서비스 일간점검" }, { t: "07:00", s: false, n: "SEC 보안 점검" }, { t: "06:00", s: true, n: "HR 서버 일간점검" }].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: b.s ? "#22c55e" : "#ef4444" }} />
                <span style={{ color: C.txL, minWidth: 36 }}>{b.t}</span>
                <span style={{ color: C.txS }}>{b.n}</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      </Card>

      {/* ── 정보시스템별 자원 현황 ── */}
      <Card title="정보시스템별 자원 현황" style={{ gridColumn: "span 2" }}>
        <DataTable cols={[{ t: "시스템명", k: "nm" }, { t: "유형", k: "type" }, { t: "관리주체", k: "org" }, { t: "자원수", k: "res" }, { t: "구성원수", k: "mem" }, { t: "상태", k: "useYn", r: v => <YnBadge v={v} /> }]} data={SYS} noPaging />
      </Card>
    </div>
  </div>;
};

interface ManagerDashboardPageProps {}

export default function ManagerDashboardPage() { const router = useRouter();
const nav = (key: keyof typeof ROUTES) => router.push(ROUTES[key]);
return <MgrDash nav={nav} />; }
