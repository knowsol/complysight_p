// @ts-nocheck
'use client';

import { useState } from 'react';
import { PH } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Button';
import { FTextarea } from '@/components/ui/Input';
import { FormRow, SecTitle } from '@/components/ui/FormRow';
import { Radio } from '@/components/ui/Radio';
import { C } from '@/lib/theme/colors';
import { fInput } from '@/lib/theme/styles';


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
      <PH title="로그인 안내메시지" bc="홈 > 환경설정 > 로그인 안내메시지" />
      <div>
        <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, padding: "28px 32px", maxWidth: 680 }}>
          <SecTitle label="안내 메시지 설정" primary />

          <FormRow label="노출 여부">
            <Radio value={form.useYn} onChange={v => sf("useYn", v)} />
            <div style={{ fontSize: 12, color: C.txS, marginTop: 5 }}>"노출" 설정 시 로그인 화면에 즉시 반영됩니다.</div>
          </FormRow>

          <FormRow label="안내 메시지 내용" required={form.useYn === "Y"}>
            <FTextarea
              value={form.content}
              onChange={e => { sf("content", e.target.value); setErrors(p => ({ ...p, content: "" })); }}
              placeholder={"로그인 화면에 표시할 안내 문구를 입력하세요.\n\n예) 본 시스템은 COMPLYSIGHT 정보시스템 자원 점검 관리 플랫폼입니다."}
              rows={8}
              maxLength={MAX_LEN}
              disabled={form.useYn === "N"}
              style={{ ...fInput, resize: "vertical", fontFamily: "inherit", lineHeight: 1.7, minHeight: 160, opacity: form.useYn === "N" ? 0.5 : 1 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
              <div>{errors.content && <span style={{ fontSize: 12, color: "#ef4444" }}>{errors.content}</span>}</div>
              <span style={{ fontSize: 12, color: remaining < 50 ? "#ef4444" : C.txL }}>{form.content.length} / {MAX_LEN}자</span>
            </div>
          </FormRow>

          {/* 미리보기 */}
          {form.useYn === "Y" && form.content.trim() && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.txS, marginBottom: 8 }}>미리보기</div>
              <div style={{ padding: "14px 18px", borderRadius: 8, background: "#fffbeb", border: "1px solid #fde68a", fontSize: 12, color: "#92400e", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {form.content}
              </div>
            </div>
          )}

          {saveOk && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 12, color: "#16a34a", marginBottom: 16 }}>
              ✓ 저장이 완료되었습니다.
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${C.brd}` }}>
            <Btn primary onClick={handleSave}>저장</Btn>
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
