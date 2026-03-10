// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/Input';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { Radio } from '@/components/ui/Radio';
import { C } from '@/lib/theme/colors';
import { fInput } from '@/lib/theme/styles';


const MgrSysProfile = () => {
  const [form, setForm] = useState({
    orgName: "한국정보보호산업협회", phone: "02-1234-5678",
    siteName: "COMPLYSIGHT", siteShort: "CS",
    url: "https://complysight.example.com", accessIp: "192.168.1.0/24, 10.0.0.0/8",
    workStart: "09:00", workEnd: "18:00",
    timezone: "Asia/Seoul", language: "ko",
    mfaEnabled: "N",
    logoAlt: "COMPLYSIGHT 로고",
  });
  const [saveOk, setSaveOk] = useState(false);
  const sf = (k, v) => { setForm(p => ({ ...p, [k]: v })); setSaveOk(false); };
  const handleSave = () => { setSaveOk(true); setTimeout(() => setSaveOk(false), 2500); };



  return <div>
    <PageHeader title="시스템 프로필" bc="홈 > 환경설정 > 시스템 프로필" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

      {/* 왼쪽: 입력 폼 */}
      <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, padding: "28px 32px" }}>
        <SectionTitle label="기관 정보" primary />
        <FormRow label="기관명" required>
          <FormInput value={form.orgName} onChange={e => sf("orgName", e.target.value)} placeholder="기관명을 입력하세요" style={fInput} />
        </FormRow>
        <FormRow label="전화번호">
          <FormInput value={form.phone} onChange={e => sf("phone", e.target.value)} placeholder="02-0000-0000" style={fInput} />
        </FormRow>

        <div style={{ borderTop: `1px solid ${C.brd}`, margin: "20px 0" }} />
        <SectionTitle label="사이트 정보" />
        <FormRow label="사이트 명" required>
          <FormInput value={form.siteName} onChange={e => sf("siteName", e.target.value)} placeholder="사이트 명칭" style={fInput} />
        </FormRow>
        <FormRow label="사이트 약칭명" desc="사이드바, 헤더 등에 노출되는 짧은 명칭입니다.">
          <FormInput value={form.siteShort} onChange={e => sf("siteShort", e.target.value)} placeholder="약칭 (최대 10자)" style={fInput} maxLength={10} />
        </FormRow>
        <FormRow label="URL" desc="외부에서 접속 가능한 서비스 URL을 입력하세요.">
          <FormInput value={form.url} onChange={e => sf("url", e.target.value)} placeholder="https://" style={fInput} />
        </FormRow>

        <div style={{ borderTop: `1px solid ${C.brd}`, margin: "20px 0" }} />
        <SectionTitle label="운영 설정" />
        <FormRow label="추가인증 사용여부" desc="로그인 시 OTP 등 추가인증을 적용합니다.">
          <Radio value={form.mfaEnabled} onChange={v => sf("mfaEnabled", v)} />
        </FormRow>

        <div style={{ borderTop: `1px solid ${C.brd}`, margin: "20px 0" }} />
        <SectionTitle label="로고 설정" />
        <FormRow label="로고 이미지">
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:120, height:48, border:`2px dashed ${C.brd}`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:"#F9FAFC", flexShrink:0 }}>
              <span style={{ fontSize:12, color:C.txL }}>미리보기</span>
            </div>
            <div>
              <label style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"6px 14px", border:`1px solid ${C.brd}`, borderRadius:5, fontSize:12, color:C.txS, cursor:"pointer", background:"#fff" }}>
                📎 파일 선택
                <FormInput type="file" accept="image/*" style={{ display:"none" }} />
              </label>
              <div style={{ fontSize:12, color:C.txL, marginTop:4 }}>PNG, JPG, SVG (최대 2MB)</div>
            </div>
          </div>
        </FormRow>
        <FormRow label="로고 이미지 대체텍스트" desc="이미지 로딩 실패 시 표시되는 텍스트입니다.">
          <FormInput value={form.logoAlt} onChange={e => sf("logoAlt", e.target.value)} placeholder="로고 alt 텍스트" style={fInput} />
        </FormRow>

        {saveOk && (
            <div style={{ padding:"10px 14px", borderRadius:8, background:"#f0fdf4", border:"1px solid #bbf7d0", fontSize:12, color:"#16a34a", marginBottom:12 }}>
            ✓ 설정이 저장되었습니다.
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:12, borderTop:`1px solid ${C.brd}` }}>
          <Button primary onClick={handleSave}>저장</Button>
        </div>
      </div>

      {/* 오른쪽: 현재 설정 요약 */}
      <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, padding: "22px 22px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.txt, marginBottom: 16 }}>현재 설정 요약</div>
        {[
          ["기관명", form.orgName],
          ["전화번호", form.phone],
          ["사이트 명", form.siteName],
          ["약칭", form.siteShort],
          ["URL", form.url],
          ["추가인증", form.mfaEnabled === "Y" ? "사용" : "미사용"],
          ["로고 alt", form.logoAlt],
        ].map(([k, v]) => (
            <div key={k} style={{ display:"flex", gap:8, marginBottom:8, fontSize:12 }}>
            <span style={{ color:C.txS, minWidth:70, flexShrink:0 }}>{k}</span>
            <span style={{ color:C.txt, wordBreak:"break-all" }}>{v || "—"}</span>
          </div>
        ))}
      </div>

    </div>
  </div>;
};

interface ManagerSettingsProfilePageProps {}

export default function ManagerSettingsProfilePage() { return <MgrSysProfile />; }
