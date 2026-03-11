// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/Input';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { Radio } from '@/components/ui/Radio';
import { fInput } from '@/lib/theme/styles';
import css from './page.module.css';


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
    <PageHeader title="시스템 프로필" breadcrumb="홈 > 환경설정 > 시스템 프로필" />
    <div className={css.grid}>

      {/* 왼쪽: 입력 폼 */}
      <div className={css.formCard}>
        <SectionTitle label="기관 정보" primary />
        <FormRow label="기관명" required>
          <FormInput value={form.orgName} onChange={e => sf("orgName", e.target.value)} placeholder="기관명을 입력하세요" style={fInput} />
        </FormRow>
        <FormRow label="전화번호">
          <FormInput value={form.phone} onChange={e => sf("phone", e.target.value)} placeholder="02-0000-0000" style={fInput} />
        </FormRow>

        <div className={css.divider} />
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

        <div className={css.divider} />
        <SectionTitle label="운영 설정" />
        <FormRow label="추가인증 사용여부" desc="로그인 시 OTP 등 추가인증을 적용합니다.">
          <Radio value={form.mfaEnabled} onChange={v => sf("mfaEnabled", v)} />
        </FormRow>

        <div className={css.divider} />
        <SectionTitle label="로고 설정" />
          <FormRow label="로고 이미지">
          <div className={css.logoRow}>
            <div className={css.logoPreview}>
              <span className={css.logoPreviewText}>미리보기</span>
            </div>
            <div>
              <label className={css.fileLabel}>
                📎 파일 선택
                <FormInput type="file" accept="image/*" className={css.hiddenFileInput} />
              </label>
              <div className={css.fileHint}>PNG, JPG, SVG (최대 2MB)</div>
            </div>
          </div>
        </FormRow>
        <FormRow label="로고 이미지 대체텍스트" desc="이미지 로딩 실패 시 표시되는 텍스트입니다.">
          <FormInput value={form.logoAlt} onChange={e => sf("logoAlt", e.target.value)} placeholder="로고 alt 텍스트" style={fInput} />
        </FormRow>

        {saveOk && (
            <div className={css.successMsg}>
            ✓ 설정이 저장되었습니다.
          </div>
        )}

        <div className={css.footerBar}>
          <Button primary onClick={handleSave}>저장</Button>
        </div>
      </div>

      {/* 오른쪽: 현재 설정 요약 */}
      <div className={css.summaryCard}>
        <div className={css.summaryTitle}>현재 설정 요약</div>
        {[
          ["기관명", form.orgName],
          ["전화번호", form.phone],
          ["사이트 명", form.siteName],
          ["약칭", form.siteShort],
          ["URL", form.url],
          ["추가인증", form.mfaEnabled === "Y" ? "사용" : "미사용"],
          ["로고 alt", form.logoAlt],
        ].map(([k, v]) => (
            <div key={k} className={css.kvRow}>
            <span className={css.kvLabel}>{k}</span>
            <span className={css.kvValue}>{v || "—"}</span>
          </div>
        ))}
      </div>

    </div>
  </div>;
};

interface ManagerSettingsProfilePageProps {}

export default function ManagerSettingsProfilePage() { return <MgrSysProfile />; }
