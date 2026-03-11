// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { FormInput, FormSelect } from '@/components/ui/Input';
import { DateRangePicker } from '@/components/ui/DatePicker';
import { colors } from '@/lib/theme/colors';
import { LABEL_STYLE_SM, fInput, fSelect } from '@/lib/theme/styles';
import { SCH } from '@/data/inspections';
import css from './page.module.css';


const MgrErrorLog = () => {
  const PAGE_SZ = 10;

  const ERR_TYPES = ["전체", "시스템 오류", "인증 오류", "DB 오류", "API 오류", "권한 오류"];
  const MODULES   = ["전체", "자원관리", "점검관리", "사용자관리", "인증", "API Gateway", "배치"];

  const TYPE_STYLE = {
    "시스템 오류": { bg: "#fee2e2", c: "#dc2626" },
    "인증 오류":   { bg: "#fef3c7", c: "#d97706" },
    "DB 오류":     { bg: "#ede9fe", c: "#7c3aed" },
    "API 오류":    { bg: "#dbeafe", c: "#1d4ed8" },
    "권한 오류":   { bg: "#f1f5f9", c: "#475569" },
  };

  const INIT_LOGS = [
    { id:"EL001", dt:"2026-02-24 09:03:11", errType:"인증 오류",   module:"인증",        msg:"로그인 시도 횟수 초과 - 계정 잠금 처리",   user:"sysmgr",    reqUrl:"/api/auth/login", detail:"IP 10.0.0.5에서 5회 연속 로그인 실패. 계정 자동 잠금 적용." },
    { id:"EL002", dt:"2026-02-24 09:45:22", errType:"DB 오류",     module:"자원관리",    msg:"DB Connection Pool 한계 도달",             user:"—",         reqUrl:"/api/resource/list", detail:"Connection pool 최대치(50) 도달. 신규 연결 대기 타임아웃 발생." },
    { id:"EL003", dt:"2026-02-24 10:12:05", errType:"API 오류",    module:"API Gateway", msg:"외부 Core API 응답 타임아웃",              user:"—",         reqUrl:"/api/core/inspect",   detail:"Core 서버 응답 30초 초과. 자동점검 항목 3건 실패 처리됨." },
    { id:"EL004", dt:"2026-02-24 11:08:33", errType:"권한 오류",   module:"사용자관리",  msg:"접근 권한 없는 메뉴 직접 접근 시도",      user:"user01",    reqUrl:"/api/admin/users", detail:"일반 사용자가 사용자 관리 API 직접 호출 시도. 403 반환." },
    { id:"EL005", dt:"2026-02-24 12:30:44", errType:"시스템 오류", module:"배치",        msg:"정기점검 배치 실행 실패",                  user:"—",         reqUrl:"/batch/schedule/run",    detail:"스케줄 ID SCH-042 배치 실행 중 NullPointerException 발생." },
    { id:"EL006", dt:"2026-02-24 13:22:17", errType:"DB 오류",     module:"점검관리",    msg:"점검 결과 저장 실패 - 중복 키 오류",      user:"inspector", reqUrl:"/api/inspect/result/save", detail:"동일 점검 건에 대한 중복 제출 시도. UniqueConstraintException." },
    { id:"EL007", dt:"2026-02-24 14:05:59", errType:"API 오류",    module:"API Gateway", msg:"Core API 인증 토큰 만료",                  user:"—",         reqUrl:"/api/core/auto-check",   detail:"Core 연동 토큰 만료로 자동점검 실패. 토큰 재발급 진행 중." },
    { id:"EL008", dt:"2026-02-24 15:44:03", errType:"시스템 오류", module:"자원관리",    msg:"파일 업로드 용량 초과",                    user:"jdoe",      reqUrl:"/api/resource/file/upload", detail:"첨부파일 크기 50MB 초과(실제 87MB). 업로드 차단 처리." },
    { id:"EL009", dt:"2026-02-24 16:18:29", errType:"인증 오류",   module:"인증",        msg:"세션 만료 후 API 접근 시도",               user:"maint01",   reqUrl:"/api/inspect/list", detail:"세션 토큰 만료 후 재요청. 401 반환 및 로그인 페이지 리다이렉트." },
    { id:"EL010", dt:"2026-02-23 09:30:00", errType:"시스템 오류", module:"배치",        msg:"메일 알림 발송 실패",                      user:"—",         reqUrl:"/batch/notify/email",    detail:"SMTP 서버 연결 실패. 점검 지연 알림 12건 미발송 상태." },
    { id:"EL011", dt:"2026-02-23 11:15:42", errType:"DB 오류",     module:"점검관리",    msg:"대용량 점검 이력 조회 타임아웃",           user:"admin",     reqUrl:"/api/inspect/history", detail:"6개월 이상 이력 조회 시 쿼리 30초 초과. 인덱스 추가로 해결." },
    { id:"EL012", dt:"2026-02-22 14:02:55", errType:"권한 오류",   module:"사용자관리",  msg:"타 기관 사용자 정보 조회 시도",            user:"orgadmin",  reqUrl:"/api/admin/users/ORG002", detail:"기관 관리자가 타 기관 사용자 조회 시도. 403 반환." },
  ];

  const [logs,     setLogs]     = useState(INIT_LOGS);
  const [keyword,  setKeyword]  = useState("");
  const [dateFrom, setDateFrom] = useState("2026-02-22");
  const [dateTo,   setDateTo]   = useState("2026-02-24");
  const [errType,  setErrType]  = useState("전체");
  const [module,   setModule]   = useState("전체");
  const [page,     setPage]     = useState(1);
  const [applied,  setApplied]  = useState({ keyword:"", errType:"전체", module:"전체", dateFrom:"2026-02-22", dateTo:"2026-02-24" });
  const [selLog,   setSelLog]   = useState(null);



  const filtered = logs.filter(l => {
    const kw = applied.keyword.trim().toLowerCase();
    if (kw && !l.msg.toLowerCase().includes(kw) && !l.user.toLowerCase().includes(kw) && !l.module.toLowerCase().includes(kw)) return false;
    if (applied.errType  !== "전체" && l.errType !== applied.errType)    return false;
    if (applied.module   !== "전체" && l.module  !== applied.module)     return false;
    if (applied.dateFrom && l.dt.slice(0,10) < applied.dateFrom) return false;
    if (applied.dateTo   && l.dt.slice(0,10) > applied.dateTo)   return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SZ));
  const paged      = filtered.slice((page-1)*PAGE_SZ, page*PAGE_SZ);
  const search = () => { setApplied({ keyword, errType, module, dateFrom, dateTo }); setPage(1); };
  const reset  = () => { setKeyword(""); setDateFrom("2026-02-22"); setDateTo("2026-02-24"); setErrType("전체"); setModule("전체"); setApplied({ keyword:"", errType:"전체", module:"전체", dateFrom:"2026-02-22", dateTo:"2026-02-24" }); setPage(1); };






  return (
    <div>
      <PageHeader title="에러로그" breadcrumb="홈 > 로그정보 > 에러로그" />
      <div>

        {/* ── 검색 영역 (searchform) ── */}
        <SearchBar onSearch={search} onReset={reset}>
          <div className={css.filterCol}>
            <span style={{ ...LABEL_STYLE_SM }}>오류유형</span>
            <FormSelect value={errType} onChange={e=>setErrType(e.target.value)} style={{...fSelect, width:"auto"}}>
              {ERR_TYPES.map(v=><option key={v}>{v}</option>)}
            </FormSelect>
          </div>
          <div className={css.filterCol}>
            <span style={{ ...LABEL_STYLE_SM }}>발생모듈</span>
            <FormSelect value={module} onChange={e=>setModule(e.target.value)} style={{...fSelect, width:"auto"}}>
              {MODULES.map(v=><option key={v}>{v}</option>)}
            </FormSelect>
          </div>
          <div className={css.filterCol}>
            <span style={{ ...LABEL_STYLE_SM }}>기간</span>
            <DateRangePicker from={dateFrom} to={dateTo} onFromChange={setDateFrom} onToChange={setDateTo} />
          </div>
          <div className={css.filterCol}>
            <span style={{ ...LABEL_STYLE_SM }}>키워드</span>
            <FormInput value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}
              placeholder="오류 메시지, 사용자, 모듈" style={{...fInput, minWidth:120}} />
          </div>
        </SearchBar>

        <DataTable
          sectionTitle="에러 이력"
          sectionCount={filtered.length}
          sectionButtons={<Button onClick={()=>{}} style={{marginRight:4}}>📥 엑셀 다운로드</Button>}
          data={filtered}
          cols={[
            { title:"No.",      fieldKey:"id",      width:60,  renderCell:(_,l,i)=><span className={css.rowNum}>{String(filtered.length - i)}</span> },
            { title:"오류유형",  fieldKey:"errType", width:70,  renderCell:(v)=><Badge status={v}/> },
            { title:"발생모듈",  fieldKey:"module",  width:150, align:"left" },
            { title:"오류메시지", fieldKey:"msg",    align:"left",
              renderCell:(v)=><div className={css.msgOverflow}>{v}</div> },
            { title:"사용자",   fieldKey:"user",    width:80 },
            { title:"발생일시",  fieldKey:"dt",      width:150 },
          ]}
        />
      </div>
    </div>
  );
};

interface ManagerSettingsErrorLogPageProps {}

export default function ManagerSettingsErrorLogPage() { return <MgrErrorLog />; }
