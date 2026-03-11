// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { FormTextarea } from '@/components/ui/Input';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { Radio } from '@/components/ui/Radio';
import { fInput } from '@/lib/theme/styles';
import css from './page.module.css';


const MgrLoginMsg = ({ loginMsg, onSave }) => {
  const MAX_LEN = 500;
  const [form, setForm] = useState({ content: loginMsg || "", useYn: loginMsg ? "Y" : "N" });
  const [errors, setErrors] = useState({});
  const [saveOk, setSaveOk] = useState(false);

  const sf = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    const e = {};
    if (form.useYn === "Y" && !form.content.trim()) e.content = "안내 메시지를 입력하세요.";
    if (form.content.length > MAX_LEN) e.content = MAX_LEN + "자 이내로 입력하세요.";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(form.useYn === "Y" ? form.content : "");
    setSaveOk(true);
    setTimeout(() => setSaveOk(false), 2000);
  };

  const remaining = MAX_LEN - form.content.length;

  return (
    <div>
      <PageHeader title="로그인 안내메시지" breadcrumb="홈 > 환경설정 > 로그인 안내메시지" />
      <div>
        <div className={css.card}>
          <SectionTitle label="안내 메시지 설정" primary />

          <FormRow label="노출 여부">
            <Radio value={form.useYn} onChange={v => sf("useYn", v)} />
            <div className={css.helpText}>"노출" 설정 시 로그인 화면에 즉시 반영됩니다.</div>
          </FormRow>

          <FormRow label="안내 메시지 내용" required={form.useYn === "Y"}>
            <FormTextarea
              value={form.content}
              onChange={e => { sf("content", e.target.value); setErrors(p => ({ ...p, content: "" })); }}
              placeholder={"로그인 화면에 표시할 안내 문구를 입력하세요.\n\n예) 본 시스템은 COMPLYSIGHT 정보시스템 자원 점검 관리 플랫폼입니다."}
              rows={8}
              maxLength={MAX_LEN}
              disabled={form.useYn === "N"}
              style={{ ...fInput, resize: "vertical", fontFamily: "inherit", lineHeight: 1.7, minHeight: 160, opacity: form.useYn === "N" ? 0.5 : 1 }}
            />
            <div className={css.counterRow}>
              <div>{errors.content && <span className={css.errorText}>{errors.content}</span>}</div>
              <span className={remaining < 50 ? css.counterTextWarning : css.counterText}>{form.content.length} / {MAX_LEN}자</span>
            </div>
          </FormRow>

          {/* 미리보기 */}
          {form.useYn === "Y" && form.content.trim() && (
            <div className={css.previewWrap}>
              <div className={css.previewLabel}>미리보기</div>
              <div className={css.previewBox}>
                {form.content}
              </div>
            </div>
          )}

          {saveOk && (
            <div className={css.successMsg}>
              ✓ 저장이 완료되었습니다.
            </div>
          )}

          <div className={css.footerBar}>
            <Button primary onClick={handleSave}>저장</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ManagerSettingsLoginMessagePageProps {
  loginMsg?: string;
  onSave?: (message: string) => void;
}

export default function ManagerSettingsLoginMessagePage() { return <MgrLoginMsg loginMsg={""} onSave={() => undefined} />; }
