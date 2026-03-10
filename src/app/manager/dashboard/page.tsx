// @ts-nocheck
'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';

import { Badge, YnBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PH } from '@/components/ui/PageHeader';
import { Stat } from '@/components/ui/Stat';
import { Tbl } from '@/components/ui/Table';
import { useDI } from '@/contexts/DIContext';
import { NT } from '@/data/notices';
import { RES } from '@/data/resources';
import { SYS } from '@/data/manager';
import { _mids } from '@/data/systems';
import { ROUTES } from '@/lib/constants/routes';
import { C } from '@/lib/theme/colors';
import { SC } from '@/lib/theme/status-colors';

const MgrDash = ({ nav }) => {
  const { di } = useDI();
  const cnt = {
    s: di.filter((x) => x.st === '요청').length,
    p: di.filter((x) => x.st === '중단').length,
    d: di.filter((x) => x.st === '지연').length,
    c: di.filter((x) => x.st === '완료').length,
  };

  const inspStatusData = (() => {
    const result = [];
    SYS.forEach((sys) => {
      const sysRes = RES.filter((r) => r.sysId === sys.id);
      const midGroups = {};
      sysRes.forEach((r) => {
        if (!midGroups[r.mid]) midGroups[r.mid] = [];
        midGroups[r.mid].push(r);
      });
      const rows = Object.entries(midGroups).map(([mid, resources]) => {
        const total = resources.length;
        const doneCount = resources.filter((r, i) => ((r.id * 17 + i * 7) % 100) < 72).length;
        const rate = total > 0 ? Math.round((doneCount / total) * 100) : 0;
        const grade = rate === 100 ? '정상' : rate >= 80 ? '경미' : rate >= 50 ? '경고' : rate >= 1 ? '지연' : '장애';
        const gradeColor = { 정상: '#19973C', 경미: '#0C8CE9', 경고: '#F36D00', 지연: '#E24949', 장애: '#7C3AED' };
        const gradeBg = { 정상: '#E8F5EC', 경미: '#E6F3FA', 경고: '#FFF3E6', 지연: '#FDE8E8', 장애: '#EDE9FE' };
        return { mid, total, doneCount, rate, grade, gradeColor: gradeColor[grade], gradeBg: gradeBg[grade] };
      });
      if (rows.length > 0) result.push({ sys, rows });
    });
    return result;
  })();

  return (
    <Box>
      <PH title="대시보드" bc="홈 > 대시보드" />
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
        <Stat label="전체 정보시스템" value={SYS.length} color={C.pri} icon="server" onClick={() => nav && nav('mr')} />
        <Stat label="전체 자원" value={RES.length} color={C.sec} icon="db" onClick={() => nav && nav('mr')} />
        <Stat label="오늘 보고 예정" value={(cnt.s || 0) + (cnt.p || 0)} color="#F36D00" icon="cal" onClick={() => nav && nav('mis')} />
        <Stat label="보고 지연" value={cnt.d} color={C.red} icon="alert" onClick={() => nav && nav('mis')} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 1.75 }}>
        <Card title="오늘의 보고 현황">
          <Box sx={{ display: 'flex', gap: 1.75 }}>
            {[['예정', cnt.s, '요청'], ['진행', cnt.p, null], ['지연', cnt.d, '지연'], ['완료', cnt.c, '완료']].map(([label, v, st]) => (
              <Box key={label} sx={{ textAlign: 'center', flex: 1 }}>
                <Typography sx={{ fontSize: 44, fontWeight: 700, color: st ? SC[st].t : C.pri }}>{v}</Typography>
                <Paper elevation={0} sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', px: 1.25, py: 0.25, borderRadius: 1.25, fontSize: 12, fontWeight: 600, bgcolor: st ? SC[st].b : C.priL, color: st ? SC[st].t : C.pri, mt: 0.5 }}>
                  {label}
                </Paper>
              </Box>
            ))}
          </Box>
        </Card>

        <Card title="최근 공지사항">
          {NT.slice(0, 3).map((n) => (
            <Box
              key={n.id}
              onClick={() => nav && nav('mbn')}
              sx={{
                py: 0.875,
                borderBottom: `1px solid ${C.brd}`,
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'background .15s',
                '&:hover': { bgcolor: C.priL },
              }}
            >
              <Typography sx={{ fontSize: 14 }}>{n.title}</Typography>
              <Typography sx={{ fontSize: 14, color: C.txL, flexShrink: 0, ml: 1 }}>{n.dt}</Typography>
            </Box>
          ))}
        </Card>

        <Card title="보고 상태 보고" style={{ gridColumn: 'span 2' }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 1.75, flexWrap: 'wrap' }}>
            {[['100%', '#19973C'], ['80-99%', '#0C8CE9'], ['50-79%', '#F36D00'], ['1-49%', '#E24949'], ['0%', '#7C3AED']].map(([label, color]) => (
              <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: color }} />
                <Typography sx={{ fontSize: 12, fontWeight: 600, color }}>{label}</Typography>
              </Box>
            ))}
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: C.bg }}>
                <TableCell sx={{ textAlign: 'left', fontWeight: 600, color: C.txS, width: 140 }}>정보시스템</TableCell>
                {_mids.map((mid) => (
                  <TableCell key={mid} sx={{ textAlign: 'center', fontWeight: 600, color: C.txS, minWidth: 64 }}>{mid}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {inspStatusData.map(({ sys, rows }, si) => {
                const midMap = {};
                rows.forEach((r) => {
                  midMap[r.mid] = r;
                });
                return (
                  <TableRow key={sys.id} sx={{ bgcolor: si % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.txH }}>{sys.nm}</Typography>
                      <Typography sx={{ fontSize: 12, color: C.txL, mt: 0.125 }}>{sys.type} · {sys.org}</Typography>
                    </TableCell>
                    {_mids.map((mid) => {
                      const cell = midMap[mid];
                      if (!cell) {
                        return (
                          <TableCell key={mid} sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontSize: 12, color: C.txX }}>—</Typography>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={mid} sx={{ textAlign: 'center' }}>
                          <Paper elevation={0} sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, px: 0.875, py: 0.25, borderRadius: 1.25, bgcolor: cell.gradeBg, color: cell.gradeColor }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{cell.rate}%</Typography>
                          </Paper>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        <Box sx={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1fr 1fr 1fr' }, gap: 1.75 }}>
          <Card title="자원 유형별 보고 현황">
            {(() => {
              const types = ['서버', 'WEB', 'WAS', 'DBMS', '네트워크', '보안', '스토리지', '백업', '서비스', '유효성'];
              const data = types
                .map((t) => {
                  const total = RES.filter((r) => r.mid === t).length;
                  const h = (t.charCodeAt(0) * 7 + t.length * 13) % 100;
                  const ok = Math.round(total * (0.5 + (h % 40) / 100));
                  const ng = Math.round(total * ((h % 15) / 100));
                  const none = Math.max(0, total - ok - ng);
                  return { t, ok, ng, none, total };
                })
                .filter((d) => d.total > 0);
              const max = Math.max(...data.map((d) => d.total), 1);
              return (
                <Stack spacing={1}>
                  {data.map((d) => (
                    <Box key={d.t} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ width: 52, fontSize: 12, fontWeight: 500, textAlign: 'right', flexShrink: 0, color: C.txS }}>{d.t}</Typography>
                      <Box sx={{ flex: 1, display: 'flex', height: 18, borderRadius: 0.5, overflow: 'hidden', bgcolor: '#F9FAFC' }}>
                        {d.ok > 0 && <Box title={`정상 ${d.ok}`} sx={{ width: `${(d.ok / max) * 100}%`, bgcolor: '#479559' }} />}
                        {d.ng > 0 && <Box title={`비정상 ${d.ng}`} sx={{ width: `${(d.ng / max) * 100}%`, bgcolor: '#f2c67d' }} />}
                        {d.none > 0 && <Box title={`미점검 ${d.none}`} sx={{ width: `${(d.none / max) * 100}%`, bgcolor: '#BDC3C7' }} />}
                      </Box>
                      <Typography sx={{ fontSize: 12, color: C.txL, width: 22, flexShrink: 0 }}>{d.total}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', gap: 1.5, fontSize: 12, color: C.txS, mt: 0.5, pl: '60px' }}>
                    {[['정상', '#479559'], ['비정상', '#f2c67d'], ['미점검', '#BDC3C7']].map(([l, c]) => (
                      <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: 0.375 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: 0.25, bgcolor: c }} />
                        <Typography sx={{ fontSize: 12 }}>{l}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Stack>
              );
            })()}
          </Card>

          <Card title="자동점검 vs 육안점검 비율">
            {(() => {
              const auto = 68;
              const manual = 32;
              const total = auto + manual;
              const r = 56;
              const cx = 70;
              const cy = 70;
              const autoAngle = (auto / total) * 360;
              const toRad = (a) => ((a - 90) * Math.PI) / 180;
              const x1 = cx + r * Math.cos(toRad(0));
              const y1 = cy + r * Math.sin(toRad(0));
              const x2 = cx + r * Math.cos(toRad(autoAngle));
              const y2 = cy + r * Math.sin(toRad(autoAngle));
              const lg = autoAngle > 180 ? 1 : 0;
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx={cx} cy={cy} r={r} fill="#EEEEEE" />
                    <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} Z`} fill={C.pri} />
                    <circle cx={cx} cy={cy} r={32} fill="#fff" />
                    <text x={cx} y={cy - 3} textAnchor="middle" style={{ fontSize: 18, fontWeight: 600, fill: C.txt }}>{total}</text>
                    <text x={cx} y={cy + 11} textAnchor="middle" style={{ fontSize: 12, fill: C.txL }}>전체 점검</text>
                  </svg>
                  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625, mb: 0.375, justifyContent: 'center' }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: 0.25, bgcolor: C.pri }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>자동점검</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 20, fontWeight: 700, color: C.pri }}>{auto}%</Typography>
                      <Typography sx={{ fontSize: 12, color: C.txL }}>{Math.round((di.length * auto) / 100)}건</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625, mb: 0.375, justifyContent: 'center' }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: 0.25, bgcolor: '#EEEEEE' }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>육안점검</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 20, fontWeight: 700, color: C.txS }}>{manual}%</Typography>
                      <Typography sx={{ fontSize: 12, color: C.txL }}>{Math.round((di.length * manual) / 100)}건</Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })()}
          </Card>

          <Card title="최근 보고 이력" extra={<Typography sx={{ fontSize: 12, color: C.txL }}>최근 24시간</Typography>}>
            {(() => {
              const logs = [
                { id: 1, t: '09:15', res: 'CRM-DB-01', clNm: 'DBMS 상태점검표' },
                { id: 2, t: '08:42', res: 'SEC-NET-03', clNm: '네트워크 상태점검표' },
                { id: 3, t: '07:30', res: 'MAIL-WAS-02', clNm: 'WAS 상태점검표' },
                { id: 4, t: '어제 22:10', res: 'FIN-SVR-04', clNm: '서버 상태점검표' },
                { id: 5, t: '어제 18:35', res: 'GW-WEB-01', clNm: '서비스 유효성 점검표' },
              ];
              return (
                <Box sx={{ position: 'relative', pl: 2 }}>
                  <Box sx={{ position: 'absolute', left: 5, top: 4, bottom: 4, width: 2, bgcolor: C.brd }} />
                  {logs.map((l, i) => (
                    <Box key={l.id} sx={{ position: 'relative', pl: 1.75, pb: i < logs.length - 1 ? 1.25 : 0 }}>
                      <Box sx={{ position: 'absolute', left: -13, top: 3, width: 8, height: 8, borderRadius: 4, bgcolor: SC['완료'].t, border: '2px solid #fff' }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontSize: 12, color: C.txL, minWidth: 50 }}>{l.t}</Typography>
                        <Badge status="완료" />
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.txt }}>{l.res}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, color: C.txS, mt: 0.125 }}>{l.clNm}</Typography>
                    </Box>
                  ))}
                </Box>
              );
            })()}
          </Card>
        </Box>

        <Card
          title="시스템 운영 현황"
          style={{ gridColumn: 'span 2' }}
          extra={
            <Paper elevation={0} sx={{ px: 1, py: 0.25, borderRadius: 0.75, bgcolor: '#dbeafe', color: '#1d4ed8', fontSize: 12, fontWeight: 600 }}>
              관리자 전용
            </Paper>
          }
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 1.75 }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 1, bgcolor: '#fefce8', border: '1px solid #fef08a' }}>
              <Typography sx={{ fontSize: 12, color: '#854d0e', fontWeight: 600, mb: 1 }}>라이선스 현황</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: C.txS }}>정보시스템</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{SYS.filter((s) => s.id !== 'SHARED').length} / 15</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography sx={{ fontSize: 12, color: C.txS }}>자원</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{RES.length} / 500</Typography>
              </Box>
              <Box sx={{ height: 6, borderRadius: 0.5, bgcolor: '#EEEEEE', overflow: 'hidden' }}>
                <Box sx={{ width: `${(RES.length / 500) * 100}%`, height: '100%', borderRadius: 0.5, bgcolor: RES.length > 450 ? C.red : RES.length > 350 ? '#f59e0b' : '#22c55e' }} />
              </Box>
              <Typography sx={{ fontSize: 12, color: C.txL, mt: 0.5 }}>만료일: 2026-12-31</Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 1, bgcolor: C.priL, border: `1px solid ${C.pri}30` }}>
              <Typography sx={{ fontSize: 12, color: '#1e40af', fontWeight: 600, mb: 1 }}>코어 연동 상태</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#22c55e', animation: 'pulse 2s infinite' }} />
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>정상 운영 중</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: C.txL }}>마지막 통신: 09:15:32</Typography>
              <Typography sx={{ fontSize: 12, color: C.txL }}>평균 응답: 124ms</Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 1, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <Typography sx={{ fontSize: 12, color: '#166534', fontWeight: 600, mb: 1 }}>자동점검 실행 현황</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: C.txS }}>오늘 실행</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>24회</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: C.txS }}>성공</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>23회</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 12, color: C.txS }}>실패</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: C.red }}>1회</Typography>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 1, bgcolor: '#faf5ff', border: '1px solid #e9d5ff' }}>
              <Typography sx={{ fontSize: 12, color: '#6b21a8', fontWeight: 600, mb: 1 }}>자동점검 실행 결과</Typography>
              {[{ t: '09:00', s: true, n: 'CRM 서버 일간점검' }, { t: '08:00', s: true, n: 'WEB 서비스 일간점검' }, { t: '07:00', s: false, n: 'SEC 보안 점검' }, { t: '06:00', s: true, n: 'HR 서버 일간점검' }].map((b, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5, fontSize: 12 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: b.s ? '#22c55e' : '#ef4444' }} />
                  <Typography sx={{ color: C.txL, minWidth: 36, fontSize: 12 }}>{b.t}</Typography>
                  <Typography sx={{ color: C.txS, fontSize: 12 }}>{b.n}</Typography>
                </Box>
              ))}
            </Paper>
          </Box>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
        </Card>

        <Card title="정보시스템별 자원 현황" style={{ gridColumn: 'span 2' }}>
          <Tbl
            cols={[
              { t: '시스템명', k: 'nm' },
              { t: '유형', k: 'type' },
              { t: '관리주체', k: 'org' },
              { t: '자원수', k: 'res' },
              { t: '구성원수', k: 'mem' },
              { t: '상태', k: 'useYn', r: (v) => <YnBadge v={v} /> },
            ]}
            data={SYS}
            noPaging
          />
        </Card>
      </Box>
    </Box>
  );
};

interface ManagerDashboardPageProps {}

export default function ManagerDashboardPage() {
  const router = useRouter();
  const nav = (key: keyof typeof ROUTES) => router.push(ROUTES[key]);
  return <MgrDash nav={nav} />;
}
