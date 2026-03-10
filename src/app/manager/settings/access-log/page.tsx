// @ts-nocheck
'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PH } from '@/components/ui/PageHeader';
import { Tbl } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { SB } from '@/components/ui/SearchBar';
import { Btn } from '@/components/ui/Button';
import { FInput, FSelect } from '@/components/ui/Input';
import { DateRangePicker } from '@/components/ui/DatePicker';
import { C } from '@/lib/theme/colors';
import { LABEL_STYLE_SM, fInput, fSelect } from '@/lib/theme/styles';


const MgrAccessLog = () => {

  /* ── 샘플 데이터 ── */
  const INIT_LOGS = [
    { id:"LOG0001", userNm:"홍길동",  userId:"admin",     ip:"192.168.1.10",  menu:"대시보드",     action:"등록", url:"/dashboard",          dt:"2026-02-24 09:12:33", loginDt:"2026-02-24 09:10:00", result:"성공", note:"" },
    { id:"LOG0002", userNm:"김영희",  userId:"jdoe",      ip:"192.168.1.22",  menu:"자원관리",     action:"수정", url:"/resource",           dt:"2026-02-24 09:15:01", loginDt:"2026-02-24 09:14:00", result:"성공", note:"" },
    { id:"LOG0003", userNm:"이철수",  userId:"sysmgr",    ip:"10.0.0.5",      menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 09:20:45", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0004", userNm:"박민준",  userId:"inspector", ip:"192.168.2.100", menu:"점검현황",     action:"다운로드", url:"/inspect/status",     dt:"2026-02-24 10:03:17", loginDt:"2026-02-24 09:58:00", result:"성공", note:"" },
    { id:"LOG0005", userNm:"김영희",  userId:"jdoe",      ip:"192.168.1.22",  menu:"점검스케줄",   action:"로그인", url:"/inspect/schedule",   dt:"2026-02-24 10:44:59", loginDt:"2026-02-24 09:14:00", result:"성공", note:"" },
    { id:"LOG0006", userNm:"이철수",  userId:"sysmgr",    ip:"10.0.0.5",      menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 10:45:03", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0007", userNm:"이철수",  userId:"sysmgr",    ip:"10.0.0.5",      menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 10:45:21", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0008", userNm:"홍길동",  userId:"admin",     ip:"192.168.1.10",  menu:"사용자관리",   action:"수정", url:"/settings/users",     dt:"2026-02-24 11:08:42", loginDt:"2026-02-24 09:10:00", result:"성공", note:"" },
    { id:"LOG0009", userNm:"박민준",  userId:"inspector", ip:"192.168.2.100", menu:"보고이력",     action:"다운로드", url:"/inspect/history",    dt:"2026-02-24 12:30:00", loginDt:"2026-02-24 09:58:00", result:"성공", note:"" },
    { id:"LOG0010", userNm:"최유지",  userId:"maint01",   ip:"172.16.0.8",    menu:"점검표",       action:"등록", url:"/settings/checklist", dt:"2026-02-24 13:01:55", loginDt:"2026-02-24 12:59:00", result:"성공", note:"" },
    { id:"LOG0011", userNm:"김영희",  userId:"jdoe",      ip:"192.168.1.22",  menu:"자원관리",     action:"수정", url:"/resource",           dt:"2026-02-24 14:22:10", loginDt:"2026-02-24 09:14:00", result:"성공", note:"" },
    { id:"LOG0012", userNm:"—",       userId:"unknown",   ip:"203.0.113.42",  menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 14:33:07", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0013", userNm:"—",       userId:"unknown",   ip:"203.0.113.42",  menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 14:33:19", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0014", userNm:"—",       userId:"unknown",   ip:"203.0.113.42",  menu:"로그인",       action:"로그인", url:"/login",              dt:"2026-02-24 14:33:31", loginDt:"—",                   result:"실패", note:"" },
    { id:"LOG0015", userNm:"최유지",  userId:"maint01",   ip:"172.16.0.8",    menu:"점검현황",     action:"수정", url:"/inspect/status",     dt:"2026-02-24 15:10:44", loginDt:"2026-02-24 12:59:00", result:"성공", note:"" },
    { id:"LOG0016", userNm:"홍길동",  userId:"admin",     ip:"192.168.1.10",  menu:"대시보드",     action:"등록", url:"/dashboard",          dt:"2026-02-23 08:55:12", loginDt:"2026-02-23 08:53:00", result:"성공", note:"" },
    { id:"LOG0017", userNm:"박민준",  userId:"inspector", ip:"192.168.2.100", menu:"일상점검",     action:"등록", url:"/inspect/daily",      dt:"2026-02-23 09:40:38", loginDt:"2026-02-23 09:38:00", result:"성공", note:"" },
    { id:"LOG0018", userNm:"이철수",  userId:"sysmgr",    ip:"10.0.0.5",      menu:"자원관리",     action:"다운로드", url:"/resource",           dt:"2026-02-23 11:20:05", loginDt:"2026-02-23 11:18:00", result:"성공", note:"" },
    { id:"LOG0019", userNm:"김영희",  userId:"jdoe",      ip:"192.168.1.22",  menu:"점검보고서",   action:"다운로드", url:"/inspect/report",     dt:"2026-02-22 09:05:50", loginDt:"2026-02-22 09:04:00", result:"성공", note:"" },
    { id:"LOG0020", userNm:"홍길동",  userId:"admin",     ip:"192.168.1.10",  menu:"권한관리",     action:"수정", url:"/settings/permission",dt:"2026-02-22 16:30:00", loginDt:"2026-02-22 08:40:00", result:"성공", note:"" },
  ];

  const TODAY    = "2026-02-24";
  const PAGE_SZ  = 10;

  const [logs]        = useState(INIT_LOGS);
  const [keyword,  setKeyword]  = useState("");
  const [actionFilter, setActionFilter] = useState("전체");
  const [dateFrom, setDateFrom] = useState("2026-02-22");
  const [dateTo,   setDateTo]   = useState(TODAY);
  const [result,   setResult]   = useState("전체");   // 전체 | 성공 | 실패
  const [path,     setPath]     = useState("전체");   // 전체 | 웹 | 모바일
  const [page,     setPage]     = useState(1);
  const [applied,  setApplied]  = useState({ keyword:"", actionFilter:"전체", dateFrom:"2026-02-22", dateTo:TODAY, result:"전체", path:"전체" });
  const [selLog,   setSelLog]   = useState(null);

  /* ── 필터 적용 ── */
  const filtered = logs.filter(l => {
    if (applied.actionFilter !== "전체" && l.action !== applied.actionFilter) return false;
    const kw = applied.keyword.trim().toLowerCase();
    if (kw && !l.userId.toLowerCase().includes(kw) && !l.userNm.includes(kw) && !l.ip.includes(kw)) return false;
    if (applied.result !== "전체" && l.result !== applied.result) return false;
    if (applied.path   !== "전체" && l.path   !== applied.path)   return false;
    if (applied.dateFrom && l.dt.slice(0, 10) < applied.dateFrom) return false;
    if (applied.dateTo   && l.dt.slice(0, 10) > applied.dateTo)   return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SZ));
  const paged = filtered.slice((page - 1) * PAGE_SZ, page * PAGE_SZ);

  const search = () => { setApplied({ keyword, actionFilter, dateFrom, dateTo, result, path }); setPage(1); };
  const reset  = () => { setKeyword(""); setDateFrom("2026-02-22"); setDateTo(TODAY); setResult("전체"); setPath("전체"); setActionFilter("전체"); setApplied({ keyword:"", actionFilter:"전체", dateFrom:"2026-02-22", dateTo:TODAY, result:"전체", path:"전체" }); setPage(1); };

  /* ── 결과 배지 ── */


  return (
    <Box>
      <PH title="접속로그" bc="홈 > 로그정보 > 접속로그" />

      <Box>

        {/* ── 검색 영역 (searchform) ── */}
        <SB onSearch={search} onReset={reset}>
          <Stack direction="column" sx={{ gap: 0.5, minWidth: "fit-content" }}>
            <Typography sx={{ ...LABEL_STYLE_SM }}>행동유형</Typography>
            <FSelect value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={{...fSelect, width:"auto"}}>
              {["전체", "등록", "수정", "삭제", "다운로드", "로그인"].map(v => <option key={v}>{v}</option>)}
            </FSelect>
          </Stack>
          <Stack direction="column" sx={{ gap: 0.5, minWidth: "fit-content" }}>
            <Typography sx={{ ...LABEL_STYLE_SM }}>기간</Typography>
            <DateRangePicker from={dateFrom} to={dateTo} onFromChange={setDateFrom} onToChange={setDateTo} />
          </Stack>
          <Stack direction="column" sx={{ gap: 0.5, minWidth: "fit-content" }}>
            <Typography sx={{ ...LABEL_STYLE_SM }}>사용자/IP</Typography>
            <FInput value={keyword} onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="사용자 ID, 이름, IP"
              style={{...fInput, minWidth:120}} />
          </Stack>
        </SB>

        {/* ── 그리드 ── */}
        <Box>
          <Tbl
            secTitle="접속 이력"
            secCount={filtered.length}
            secButtons={<Btn onClick={()=>{}}>📥 엑셀 다운로드</Btn>}
            data={filtered}
            cols={[
              { t:"No.",      k:"id",       w:60,  r:(_,l,i)=><Typography component="span" sx={{color:C.txL}}>{filtered.length - i}</Typography> },
              { t:"행동유형",  k:"action",   w:70,  r:(v)=><Badge status={v}/> },
              { t:"이름",     k:"userNm",   w:90 },
              { t:"아이디",   k:"userId",   w:110, r:(v)=><Typography component="span" sx={{color:C.txS,fontFamily:"inherit"}}>{v}</Typography> },
              { t:"IP",       k:"ip",       w:130, r:(v)=><Typography component="span" sx={{fontFamily:"inherit"}}>{v}</Typography> },
              { t:"메뉴",     k:"menu",     w:110 },
              { t:"URL",      k:"url",      w:180, align:"left", r:(v)=><Typography component="span" sx={{color:C.txS,fontFamily:"inherit"}}>{v}</Typography> },
              { t:"일시",     k:"dt",       w:155, r:(v)=><Typography component="span" sx={{fontFamily:"inherit"}}>{v}</Typography> },
              { t:"로그인일시", k:"loginDt", w:155, r:(v)=><Typography component="span" sx={{color:C.txS,fontFamily:"inherit"}}>{v}</Typography> },
              { t:"비고",     k:"note",     w:120, align:"left", r:(v)=><Typography component="span" sx={{color:v?C.txt:C.txL}}>{v||"—"}</Typography> },
            ]}
          />
        </Box>
      </Box>

      {/* ══ 상세 패널 ══ */}
    </Box>
  );
};

interface ManagerSettingsAccessLogPageProps {}

export default function ManagerSettingsAccessLogPage() { return <MgrAccessLog />; }
