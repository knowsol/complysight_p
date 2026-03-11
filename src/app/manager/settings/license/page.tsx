// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { Radio } from '@/components/ui/Radio';
import { colors } from '@/lib/theme/colors';
import { fInput, panelBody, panelFooterBar, errorText, toastStyle, hoverBg } from '@/lib/theme/styles';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Toast } from '@/components/ui/StyleUtils';
import css from './page.module.css';


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
    Standard: { pri: colors.primary,    light: colors.primaryLight      },
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
      <PageHeader title="라이선스" breadcrumb="홈 > 라이선스 > 라이선스" />

      <div>
        <div>

          <DataTable
            sectionTitle="라이선스 목록"
            sectionCount={licenses.length}
            sectionButtons={<Button variant="primary" onClick={openAdd}>+ 라이선스 추가</Button>}
            data={licenses}
            onRow={lic=>openDetail(lic)}
            cols={[
              { title:"상태",        fieldKey:"id",       width:100, renderCell:(_,lic)=><Badge status={calcStatus(lic)}/> },
              { title:"라이선스 코드", fieldKey:"code",   minWidth:200, align:"left",
                renderCell:(v)=><span className={css.codeMonospace}>{v}</span> },
              { title:"플랜",        fieldKey:"type",     width:110,
                renderCell:(v,lic)=>{ const col=PLAN_COLOR[v]||PLAN_COLOR.Standard;
                  return <span className={css.planBadge} style={{ background: col.light, color: col.pri }}>{lic.planNm}</span>;} },
              { title:"결제 주기",   fieldKey:"cycle",    width:90 },
              { title:"구독 시작일", fieldKey:"startDt",  width:110 },
              { title:"만료일",      fieldKey:"endDt",    width:110 },
              { title:"자동갱신",    fieldKey:"autoRenew", width:80,
                renderCell:(v)=><span style={{ color: v ? "#16a34a" : "var(--color-text-light)" }}>{v?"사용":"미사용"}</span> },
              { title:"등록일",      fieldKey:"regDt",    width:100 },
            ]}
          />
        </div>
      </div>
      {/* ══════════════════════════════════════
          사이드 패널: 라이선스 추가
      ══════════════════════════════════════ */}
      <SidePanel open={panel === "add"} onClose={() => setPanel(null)} title="라이선스 추가" width={500} noScroll>
      {/* 바디 */}
      <div style={panelBody}>
        <SectionTitle label="라이선스 코드 입력" primary />
        <div className={css.guideText}>
          발급받은 라이선스 코드를 입력하고 [코드 확인] 버튼을 클릭하세요.<br />
          코드 확인 후 라이선스 정보를 검토하고 등록을 진행할 수 있습니다.
        </div>

        <FormRow label="라이선스 코드" required>
          <div className={css.codeRow}>
            <FormInput
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(""); setCodePreview(null); }}
              placeholder="예) CS-STD-2026-CCDD"
              style={{ ...fInput, flex: 1, fontFamily:"inherit", letterSpacing: "0.03em" }}
              onKeyDown={e => e.key === "Enter" && handleCodeCheck()}
            />
            <Button sm primary onClick={handleCodeCheck} style={{ whiteSpace:"nowrap", flexShrink:0 }}>코드 확인</Button>
          </div>
          {codeError && <div style={errorText}>{codeError}</div>}
        </FormRow>

        {/* 코드 검증 성공 → 미리보기 */}
        {codePreview && (() => {
          const preCol = PLAN_COLOR[codePreview.type] || PLAN_COLOR.Standard;
          const preFeatures = PLAN_FEATURES[codePreview.planId] || [];
          return (
            <div style={{ marginTop: 4 }}>
              <div className={css.validMsg}>
                <span>✓</span> 유효한 라이선스 코드입니다.
              </div>

              {/* 플랜 정보 카드 */}
              <div className={css.planCard} style={{ borderColor: preCol.pri }}>
                <div className={css.planCardHeader} style={{ background: preCol.light, borderBottomColor: `${preCol.pri}33` }}>
                  <div className={css.planCardHeaderRow}>
                    <span className={css.planName}>{codePreview.planNm} 플랜</span>
                    <span className={css.planTypeBadge} style={{ color: preCol.pri }}>{codePreview.type}</span>
                  </div>
                  <div className={css.planCode}>{codePreview.code}</div>
                </div>
                <div className={css.planCardBody}>
                  {[
                    ["구독 시작일", codePreview.startDt],
                    ["만료일",      codePreview.endDt],
                    ["결제 주기",   codePreview.cycle],
                    ["자동 갱신",   codePreview.autoRenew ? "사용" : "미사용"],
                  ].map(([label, val], i) => (
                    <div key={i} className={css.kvRow}>
                      <span className={css.kvLabel}>{label}</span>
                      <span className={css.kvValue}>{val}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    {preFeatures.map((f, i) => (
                      <div key={i} className={css.featureItem}>
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
      <div style={panelFooterBar}>
        <div className={css.footerRow}>
          <Button onClick={() => setPanel(null)}>취소</Button>
          <div className={css.spacer} />
          <Button primary onClick={handleAddLicense}>라이선스 등록</Button>
        </div>
      </div>
      </SidePanel>

      {/* ══════════════════════════════════════
          사이드 패널: 라이선스 상세 / 관리
      ══════════════════════════════════════ */}
      <SidePanel open={panel === "detail" && !!liveLic} onClose={() => setPanel(null)}
        title="라이선스 상세" width={500} noScroll>
        {/* 바디 */}
        <div style={panelBody}>
        {liveLic && (() => {
          const isActive = liveStatus === "구독중" || liveStatus === "만료 예정";
          return (
            <>
              {/* 플랜 헤더 */}
              <div className={css.detailHeader} style={{ background: col.light, borderColor: `${col.pri}33` }}>
                <div className={css.detailHeaderRow}>
                  <div>
                    <div className={css.typeBadgeUpper} style={{ color: col.pri }}>{liveLic.type}</div>
                    <div className={css.planName}>{liveLic.planNm} 플랜</div>
                  </div>
                  <Badge status={liveStatus} />
                </div>
                <div className={css.planCode} style={{ marginBottom: 10 }}>{liveLic.code}</div>
                <div className={css.detailGrid}>
                  {[
                    ["구독 시작일", liveLic.startDt],
                    ["만료일",     liveLic.endDt + (liveStatus === "만료 예정" ? "  ⚠" : "")],
                    ["결제 주기",  liveLic.cycle],
                    ["등록일",     liveLic.regDt],
                  ].map(([label, val], i) => (
                    <div key={i} className={css.gridCell}>
                      <div className={css.gridCellLabel}>{label}</div>
                      <div className={css.gridCellValue}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 이용 내역 */}
              <SectionTitle label="이용 내역" primary />
              <div className={css.featureList} {...hoverBg("#f8fafc", "#f8fafc")}>
                {features.map((f, i) => (
                  <div key={i} className={css.featureRow} style={{ borderBottom: i === features.length - 1 ? "none" : "1px solid var(--color-border)" }}>
                    <span style={{ color: col.pri, fontSize: 12, flexShrink: 0 }}>✓</span>
                    <span style={{ color: "var(--color-text)" }}>{f}</span>
                    <span className={css.availBadge}>이용 가능</span>
                  </div>
                ))}
              </div>

              {/* 관리 설정 — 구독중/만료예정만 */}
              {isActive && (
                <>
                  <SectionTitle label="구독 설정" primary />
                  <FormRow label="자동 갱신">
                    <Radio options={[[true,"사용"],[false,"사용 안함"]]} value={liveLic.autoRenew} onChange={v => handleToggleAutoRenew(liveLic.id, v)} />
                    <div className={css.subNote}>자동 갱신 시 만료 전 자동으로 결제됩니다.</div>
                  </FormRow>
                </>
              )}

            </>
          );
        })()}
        </div>{/* /바디 */}

        {/* 푸터 */}
        <div style={panelFooterBar}>
          <div className={css.footerRow}>
            {(liveStatus === "구독중" || liveStatus === "만료 예정") && <Button outlineDanger onClick={() => handleCancel(liveLic?.id)}>라이선스 해지</Button>}
            <div className={css.spacer} />
            <Button primary onClick={() => setPanel(null)}>확인</Button>
          </div>
        </div>
      </SidePanel>

      {confirmMsg && (
        <ConfirmModal open={!!confirmMsg} title={confirmMsg?.title} msg={confirmMsg?.msg}
          onOk={confirmMsg.onOk} onCancel={() => setConfirmMsg(null)} />
      )}

      {toast && (
        <div style={{ ...toastStyle(true), background: "#333333", padding: "12px 24px", borderRadius: 10, fontSize: 12, fontWeight: 500, zIndex: 2000, boxShadow: "0 4px 20px rgba(0,0,0,.2)", gap: 0 }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
};

interface ManagerSettingsLicensePageProps {}

export default function ManagerSettingsLicensePage() { return <MgrLicense />; }
