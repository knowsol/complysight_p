// @ts-nocheck
'use client';

import { useState } from 'react';
import { PH } from '@/components/ui/PageHeader';
import { Tbl } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Btn, SecBtnP } from '@/components/ui/Button';
import { FInput } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { FormRow, SecTitle } from '@/components/ui/FormRow';
import { Radio } from '@/components/ui/Radio';
import { C } from '@/lib/theme/colors';
import { fInput } from '@/lib/theme/styles';
import { ConfirmModal } from '@/components/ui/ConfirmModal';


const MgrLicense = () => {

  /* ── 라이선스 코드 → 플랜 매핑 (실제 서버에서 검증) ── */
  const CODE_MAP = {
    "CS-BASIC-2026-AABB": { planId: "PLAN_BASIC", planNm: "Basic",    type: "Basic",    startDt: "2026-03-01", endDt: "2026-12-31", cycle: "연간", autoRenew: false },
    "CS-STD-2026-CCDD":   { planId: "PLAN_STD",   planNm: "Standard", type: "Standard", startDt: "2026-03-01", endDt: "2027-02-28", cycle: "연간", autoRenew: true  },
    "CS-PREM-2026-EEFF":  { planId: "PLAN_PREM",  planNm: "Premium",  type: "Premium",  startDt: "2026-03-01", endDt: "2027-02-28", cycle: "연간", autoRenew: true  },
  };

  const PLAN_FEATURES = {
    "PLAN_BASIC": ["정보시스템 최대 3개", "자원 최대 30개", "일상점검", "공지사항", "기본 대시보드"],
    "PLAN_STD":   ["정보시스템 최대 10개", "자원 최대 100개", "일상점검 + 특별점검", "자동점검 연동", "알림 설정", "점검 이력"],
    "PLAN_PREM":  ["정보시스템 무제한", "자원 무제한", "전체 기능 포함", "API 연동", "전담 기술지원", "SLA 보장"],
  };

  const TODAY = "2026-02-24";

  /* ── 초기 라이선스 목록 ── */
  const INIT_LICENSES = [
    { id: "LIC001", code: "CS-STD-2025-XXXX", planId: "PLAN_STD",   planNm: "Standard", type: "Standard", startDt: "2025-03-01", endDt: "2026-02-28", cycle: "연간", autoRenew: true,  status: "만료 예정", regDt: "2025-03-01" },
    { id: "LIC002", code: "CS-BASIC-2024-YYYY",planId: "PLAN_BASIC", planNm: "Basic",    type: "Basic",    startDt: "2024-03-01", endDt: "2025-02-28", cycle: "연간", autoRenew: false, status: "만료",    regDt: "2024-03-01" },
  ];

  const [licenses,    setLicenses]   = useState(INIT_LICENSES);
  const [panel,       setPanel]      = useState(null);   // null | "add" | "detail"
  const [selLic,      setSelLic]     = useState(null);   // 선택된 라이선스
  const [codeInput,   setCodeInput]  = useState("");     // 라이선스 코드 입력
  const [codeError,   setCodeError]  = useState("");
  const [codePreview, setCodePreview]= useState(null);   // 코드 검증 결과 미리보기
  const [confirmMsg,  setConfirmMsg] = useState(null);
  const [toast,       setToast]      = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  /* ── 만료 30일 이내 ── */
  const isExpiringSoon = (endDt) => {
    const diff = (new Date(endDt) - new Date(TODAY)) / 86400000;
    return diff >= 0 && diff <= 30;
  };

  /* ── 상태 계산 ── */
  const calcStatus = (lic) => {
    if (lic.status === "해지") return "해지";
    if (new Date(lic.endDt) < new Date(TODAY)) return "만료";
    if (isExpiringSoon(lic.endDt)) return "만료 예정";
    return "구독중";
  };

  /* ── 플랜 타입 색 ── */
  const PLAN_COLOR = {
    Basic:    { pri: "#6366f1", light: "#eef2ff" },
    Standard: { pri: C.pri,    light: C.priL      },
    Premium:  { pri: "#0f766e", light: "#f0fdfa"  },
  };

  /* ── 상태 배지 ── */


  /* ── 라이선스 코드 검증 ── */
  const handleCodeCheck = () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) { setCodeError("라이선스 코드를 입력하세요."); setCodePreview(null); return; }
    /* 이미 등록된 코드인지 확인 */
    if (licenses.some(l => l.code.toUpperCase() === code)) {
      setCodeError("이미 등록된 라이선스 코드입니다."); setCodePreview(null); return;
    }
    const found = CODE_MAP[code];
    if (!found) { setCodeError("유효하지 않은 라이선스 코드입니다."); setCodePreview(null); return; }
    setCodeError("");
    setCodePreview({ ...found, code });
  };

  /* ── 라이선스 추가 확정 ── */
  const handleAddLicense = () => {
    if (!codePreview) return;
    const newLic = {
      id: "LIC" + String(licenses.length + 1).padStart(3, "0"),
      ...codePreview,
      status: "구독중",
      regDt: TODAY,
    };
    setLicenses(p => [newLic, ...p]);
    setPanel(null);
    setCodeInput(""); setCodePreview(null); setCodeError("");
    showToast("라이선스가 등록되었습니다.");
  };

  /* ── 자동갱신 변경 ── */
  const handleToggleAutoRenew = (id, val) => {
    setLicenses(p => p.map(l => l.id === id ? { ...l, autoRenew: val } : l));
    showToast("자동 갱신 설정이 변경되었습니다.");
  };

  /* ── 해지 ── */
  const handleCancel = (id) => {
    setConfirmMsg({
      title: "라이선스 해지",
      msg: "라이선스를 해지하면 만료일까지 사용 가능하며 이후 서비스가 중단됩니다. 해지하시겠습니까?",
      onOk: () => {
        setLicenses(p => p.map(l => l.id === id ? { ...l, status: "해지", autoRenew: false } : l));
        setSelLic(prev => prev?.id === id ? { ...prev, status: "해지", autoRenew: false } : prev);
        setConfirmMsg(null);
        showToast("라이선스가 해지되었습니다.");
      },
    });
  };

  /* ── 행 클릭 → 상세 패널 ── */
  const openDetail = (lic) => {
    setSelLic(lic);
    setPanel("detail");
  };

  /* ── 추가 패널 오픈 ── */
  const openAdd = () => {
    setCodeInput(""); setCodePreview(null); setCodeError("");
    setPanel("add");
  };



  /* ── 상세 패널용 현재 라이선스 최신 상태 ── */
  const liveLic = selLic ? (licenses.find(l => l.id === selLic.id) || selLic) : null;
  const liveStatus = liveLic ? calcStatus(liveLic) : "";
  const col = liveLic ? (PLAN_COLOR[liveLic.type] || PLAN_COLOR.Standard) : {};
  const features = liveLic ? (PLAN_FEATURES[liveLic.planId] || []) : [];

  return (
    <div>
      <PH title="라이선스" bc="홈 > 라이선스 > 라이선스" />

      <div>
        <div>

          <Tbl
            secTitle="라이선스 목록"
            secCount={licenses.length}
            secButtons={<SecBtnP onClick={openAdd}>+ 라이선스 추가</SecBtnP>}
            data={licenses}
            onRow={lic=>openDetail(lic)}
            cols={[
              { t:"상태",        k:"id",       w:100, r:(_,lic)=><Badge status={calcStatus(lic)}/> },
              { t:"라이선스 코드", k:"code",   mw:200, align:"left",
                r:(v)=><span style={{fontFamily:"inherit",color:C.txt,fontWeight:600}}>{v}</span> },
              { t:"플랜",        k:"type",     w:110,
                r:(v,lic)=>{ const col=PLAN_COLOR[v]||PLAN_COLOR.Standard;
                  return <span style={{padding:"2px 9px",borderRadius:5,fontSize:12,fontWeight:700,background:col.light,color:col.pri}}>{lic.planNm}</span>;} },
              { t:"결제 주기",   k:"cycle",    w:90 },
              { t:"구독 시작일", k:"startDt",  w:110 },
              { t:"만료일",      k:"endDt",    w:110 },
              { t:"자동갱신",    k:"autoRenew", w:80,
                r:(v)=><span style={{color:v?"#16a34a":C.txL}}>{v?"사용":"미사용"}</span> },
              { t:"등록일",      k:"regDt",    w:100 },
            ]}
          />
        </div>
      </div>
      {/* ══════════════════════════════════════
          사이드 패널: 라이선스 추가
      ══════════════════════════════════════ */}
      <SidePanel open={panel === "add"} onClose={() => setPanel(null)} title="라이선스 추가" width={500} noScroll>
      {/* 바디 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <SecTitle label="라이선스 코드 입력" primary />
        <div style={{ fontSize: 12, color: C.txS, marginBottom: 16, lineHeight: 1.7 }}>
          발급받은 라이선스 코드를 입력하고 [코드 확인] 버튼을 클릭하세요.<br />
          코드 확인 후 라이선스 정보를 검토하고 등록을 진행할 수 있습니다.
        </div>

        <FormRow label="라이선스 코드" required>
          <div style={{ display: "flex", gap: 8 }}>
            <FInput
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(""); setCodePreview(null); }}
              placeholder="예) CS-STD-2026-CCDD"
              style={{ ...fInput, flex: 1, fontFamily:"inherit", letterSpacing: "0.03em" }}
              onKeyDown={e => e.key === "Enter" && handleCodeCheck()}
            />
            <Btn sm primary onClick={handleCodeCheck} style={{ whiteSpace:"nowrap", flexShrink:0 }}>코드 확인</Btn>
          </div>
          {codeError && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{codeError}</div>}
        </FormRow>

        {/* 코드 검증 성공 → 미리보기 */}
        {codePreview && (() => {
          const preCol = PLAN_COLOR[codePreview.type] || PLAN_COLOR.Standard;
          const preFeatures = PLAN_FEATURES[codePreview.planId] || [];
          return (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span>✓</span> 유효한 라이선스 코드입니다.
              </div>

              {/* 플랜 정보 카드 */}
              <div style={{ border: `2px solid ${preCol.pri}`, borderRadius: 10, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ padding: "14px 18px", background: preCol.light, borderBottom: `1px solid ${preCol.pri}33` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: C.txt }}>{codePreview.planNm} 플랜</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: preCol.pri, background: "#fff", padding: "2px 8px", borderRadius: 5 }}>{codePreview.type}</span>
                  </div>
                  <div style={{ color: C.txS, fontFamily:"inherit" }}>{codePreview.code}</div>
                </div>
                <div style={{ padding: "14px 18px" }}>
                  {[
                    ["구독 시작일", codePreview.startDt],
                    ["만료일",      codePreview.endDt],
                    ["결제 주기",   codePreview.cycle],
                    ["자동 갱신",   codePreview.autoRenew ? "사용" : "미사용"],
                  ].map(([label, val], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f3f4f6", fontSize: 12 }}>
                      <span style={{ color: C.txS }}>{label}</span>
                      <span style={{ color: C.txt, fontWeight: 500 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    {preFeatures.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.txS, marginBottom: 5 }}>
                        <span style={{ color: preCol.pri }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </div>{/* /바디 */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn onClick={() => setPanel(null)}>취소</Btn>
          <div style={{ flex: 1 }} />
          <Btn primary onClick={handleAddLicense}>라이선스 등록</Btn>
        </div>
      </div>
      </SidePanel>

      {/* ══════════════════════════════════════
          사이드 패널: 라이선스 상세 / 관리
      ══════════════════════════════════════ */}
      <SidePanel open={panel === "detail" && !!liveLic} onClose={() => setPanel(null)}
        title="라이선스 상세" width={500} noScroll>
        {/* 바디 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {liveLic && (() => {
          const isActive = liveStatus === "구독중" || liveStatus === "만료 예정";
          return (
            <>
              {/* 플랜 헤더 */}
              <div style={{ padding: "16px 18px", background: col.light, borderRadius: 10, marginBottom: 20, border: `1px solid ${col.pri}33` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: col.pri, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{liveLic.type}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.txt }}>{liveLic.planNm} 플랜</div>
                  </div>
                  <Badge status={liveStatus} />
                </div>
                <div style={{ color: C.txS, fontFamily:"inherit", marginBottom: 10 }}>{liveLic.code}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 0", fontSize: 12 }}>
                  {[
                    ["구독 시작일", liveLic.startDt],
                    ["만료일",     liveLic.endDt + (liveStatus === "만료 예정" ? "  ⚠" : "")],
                    ["결제 주기",  liveLic.cycle],
                    ["등록일",     liveLic.regDt],
                  ].map(([label, val], i) => (
                    <div key={i} style={{ paddingRight: 12 }}>
                      <div style={{ color: C.txL, fontSize: 12, marginBottom: 1 }}>{label}</div>
                      <div style={{ color: C.txt, fontWeight: 500 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 이용 내역 */}
              <SecTitle label="이용 내역" primary />
              <div style={{ background: "#f8fafc", borderRadius: 8, border: `1px solid ${C.brd}`, overflow: "hidden", marginBottom: 20 }}>
                {features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < features.length - 1 ? `1px solid ${C.brd}` : "none", fontSize: 12 }}>
                    <span style={{ color: col.pri, fontSize: 12, flexShrink: 0 }}>✓</span>
                    <span style={{ color: C.txt }}>{f}</span>
                    <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, color: "#16a34a", background: "#dcfce7", padding: "1px 7px", borderRadius: 5 }}>이용 가능</span>
                  </div>
                ))}
              </div>

              {/* 관리 설정 — 구독중/만료예정만 */}
              {isActive && (
                <>
                  <SecTitle label="구독 설정" primary />
                  <FormRow label="자동 갱신">
                    <Radio options={[[true,"사용"],[false,"사용 안함"]]} value={liveLic.autoRenew} onChange={v => handleToggleAutoRenew(liveLic.id, v)} />
                    <div style={{ fontSize: 12, color: C.txS, marginTop: 4 }}>자동 갱신 시 만료 전 자동으로 결제됩니다.</div>
                  </FormRow>
                </>
              )}

            </>
          );
        })()}
        </div>{/* /바디 */}

        {/* 푸터 */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {(liveStatus === "구독중" || liveStatus === "만료 예정") && <Btn outlineDanger onClick={() => handleCancel(liveLic?.id)}>라이선스 해지</Btn>}
            <div style={{ flex: 1 }} />
            <Btn primary onClick={() => setPanel(null)}>확인</Btn>
          </div>
        </div>
      </SidePanel>

      {confirmMsg && (
        <ConfirmModal open={!!confirmMsg} title={confirmMsg?.title} msg={confirmMsg?.msg}
          onOk={confirmMsg.onOk} onCancel={() => setConfirmMsg(null)} />
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", background: "#333333", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 12, fontWeight: 500, zIndex: 2000, boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
};

interface ManagerSettingsLicensePageProps {}

export default function ManagerSettingsLicensePage() { return <MgrLicense />; }
