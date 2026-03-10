// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { SidePanel } from '@/components/ui/SidePanel';
import { FormRow, SecTitle } from '@/components/ui/FormRow';
import { FInput, FTextarea, RoSelect } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';
import { Btn } from '@/components/ui/Button';
import { ConfirmModal, UnsavedConfirm } from '@/components/ui/ConfirmModal';
import { C } from '@/lib/theme/colors';
import { fSelect } from '@/lib/theme/styles';
import { USERS, RES } from '@/data';
import { useEditPanel } from '@/lib/hooks/use-edit-panel';

export function StlSpecialPanel({ open, onClose, item, onSave, toast }) {
  const { editMode, confirmOpen, handleDiscard, handleSaveConfirm, setConfirmOpen } = useEditPanel(open, onClose);
  const isComp = item?.st === '완료';

  const SPEC_KINDS = ['오프라인점검', '이중화점검', '성능점검', '업무집중기간점검'];

  const lastDayOfMonth = () => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth() + 1, 0).toISOString().slice(0, 10);
  };

  const emptyForm = {
    title: '', kind: '오프라인점검', insp: '', due: lastDayOfMonth(),
    purpose: '', content: '',
    planFile: null,
    execDt: '', submitDt: '', resultContent: '',
    resources: [],
    registrant: '', regDt: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [inspSearch, setInspSearch] = useState('');
  const [submitConfirm, setSubmitConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const todayStr = () => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (open && item) {
      setForm({
        title: item.title || '',
        kind: item.kind || '오프라인점검',
        insp: item.insp || '',
        due: item.due || lastDayOfMonth(),
        purpose: item.purpose || '',
        content: item.content || '',
        planFile: item.planFile ? { name: '점검계획서.pdf', size: null } : null,
        execDt: item.execDt || '',
        submitDt: item.submitDt || '',
        resultContent: item.resultContent || '',
        reportFile: item.resultFile ? { name: '점검보고서.pdf', size: null } : null,
        resources: Array.isArray(item.resources) ? item.resources.map((nm) => RES.find((r) => r.nm === nm)?.id).filter(Boolean) : [],
        registrant: item.regUser || '',
        regDt: item.reg || '',
      });
    }
    if (open && !item) {
      setForm({ ...emptyForm, due: lastDayOfMonth(), registrant: USERS[0]?.userNm || '관리자', regDt: todayStr() });
      setInspSearch('');
    }
  }, [open, item]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const isNew = !item;

  const handlePlanFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('파일 용량은 10MB를 초과할 수 없습니다.'); e.target.value = ''; return; }
    set('planFile', file);
    e.target.value = '';
  };

  return (
    <>
      <UnsavedConfirm open={confirmOpen} onDiscard={handleDiscard} onSave={handleSaveConfirm} />
      <ConfirmModal
        open={submitConfirm}
        title="보고 제출"
        msg="특별점검 결과를 제출합니다. 제출 후에는 수정할 수 없습니다. 계속하시겠습니까?"
        okLabel="제출"
        danger={false}
        onCancel={() => setSubmitConfirm(false)}
        onOk={() => {
          const nowStr = (() => {
            const n = new Date();
            const pad = (v) => String(v).padStart(2, '0');
            return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())} ${pad(n.getHours())}:${pad(n.getMinutes())}`;
          })();
          if (onSave) onSave({ ...form, id: item?.id, regUser: form.registrant, reg: form.regDt, st: '완료', submitDt: nowStr });
          if (toast) toast('보고가 제출되었습니다.', 'success');
          setSubmitConfirm(false);
          onClose();
        }}
      />
      <SidePanel open={open} onClose={() => { if (editMode) setConfirmOpen(true); else onClose(); }} title={isNew ? '특별점검 등록' : '특별점검 상세'} width={580} noScroll>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {(isNew || editMode) ? (
            <div style={{ border: `1px solid ${C.brd}`, borderRadius: 10, padding: '16px 18px', marginBottom: 18, background: '#fff' }}>
              <SecTitle label="점검계획" primary style={{ marginBottom: 12 }} />
              <FormRow label="점검 제목" required>
                <FInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="특별점검 제목을 입력하세요" maxLength={100} />
              </FormRow>
              <div style={{ display: 'flex', gap: 12 }}>
                <FormRow label="점검 종류" required style={{ flex: 1 }}>
                  <RoSelect style={{ ...fSelect }} value={form.kind} onChange={(e) => set('kind', e.target.value)}>
                    {SPEC_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                  </RoSelect>
                </FormRow>
                <FormRow label="등록자" style={{ flex: 1 }}>
                  <FInput style={{ background: '#F9FAFC', pointerEvents: 'none' }} value={form.registrant} readOnly />
                </FormRow>
                <FormRow label="등록일" style={{ flex: 1 }}>
                  <FInput style={{ background: '#F9FAFC', pointerEvents: 'none' }} value={form.regDt} readOnly />
                </FormRow>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <FormRow label="점검자" required style={{ flex: 1, position: 'relative' }}>
                  <div style={{ position: 'relative' }}>
                    <FInput value={inspSearch || form.insp} onChange={(e) => { setInspSearch(e.target.value); if (!e.target.value) set('insp', ''); }} onFocus={() => { if (form.insp) setInspSearch(form.insp); }} placeholder="이름 또는 아이디 검색" style={{ paddingRight: 28 }} />
                    {(inspSearch || form.insp) && <span onClick={() => { set('insp', ''); setInspSearch(''); }} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: C.txL, fontSize: 16, lineHeight: 1 }}>×</span>}
                    {inspSearch && (() => {
                      const q = inspSearch.trim().toLowerCase();
                      const filteredU = USERS.filter((u) => u.useYn === 'Y' && (u.userNm.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q)));
                      if (!filteredU.length) return <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200, background: '#fff', border: `1px solid ${C.brd}`, borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,.1)', fontSize: 12, padding: '8px 12px', color: C.txL }}>검색 결과가 없습니다.</div>;
                      return <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200, background: '#fff', border: `1px solid ${C.brd}`, borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,.1)', maxHeight: 180, overflowY: 'auto' }}>
                        {filteredU.map((u) => <div key={u.userId} onMouseDown={(e) => { e.preventDefault(); set('insp', u.userNm); setInspSearch(''); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', borderBottom: `1px solid ${C.brd}` }} onMouseEnter={(e) => { e.currentTarget.style.background = C.priL; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}><span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: C.txt }}>{u.userNm}</span><span style={{ fontSize: 11, color: C.txL }}>{u.userId}</span><span style={{ fontSize: 11, color: C.txS, background: '#F0F0F0', padding: '1px 6px', borderRadius: 8 }}>{u.userRole}</span></div>)}
                      </div>;
                    })()}
                  </div>
                </FormRow>
                <FormRow label="점검기한" required style={{ flex: 1 }}>
                  <DatePicker value={form.due} onChange={(v) => set('due', v)} />
                </FormRow>
                <div style={{ flex: 1 }} />
              </div>
              <FormRow label="점검 목적">
                <FTextarea value={form.purpose} onChange={(e) => set('purpose', e.target.value)} placeholder="점검의 목적을 입력하세요" maxLength={500} />
              </FormRow>
              <FormRow label="점검 내용">
                <FTextarea value={form.content} onChange={(e) => set('content', e.target.value)} placeholder="점검 내용을 입력하세요" maxLength={500} />
              </FormRow>
              <FormRow label="점검계획서 첨부">
                {form.planFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: `1px solid ${C.brd}`, borderRadius: 6, background: '#F9FAFC' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    <span style={{ flex: 1, fontSize: 12, color: C.txt, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.planFile.name}{form.planFile.size && <span style={{ fontSize: 12, color: C.txL, marginLeft: 6 }}>({(form.planFile.size / 1024 / 1024).toFixed(1)} MB)</span>}</span>
                    <span onClick={() => set('planFile', null)} style={{ cursor: 'pointer', color: C.txL, fontSize: 18, lineHeight: 1, flexShrink: 0 }} title="파일 제거">×</span>
                  </div>
                ) : (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: `2px dashed ${C.brd}`, borderRadius: 6, cursor: 'pointer', transition: 'all .15s', background: '#fff' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.pri; e.currentTarget.style.background = C.priL + '44'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.brd; e.currentTarget.style.background = '#fff'; }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                    <span style={{ fontSize: 12, color: C.txL }}>파일을 선택하거나 드래그하세요</span>
                    <span style={{ fontSize: 12, color: C.txL, marginLeft: 'auto' }}>최대 10MB</span>
                    <FInput type="file" style={{ display: 'none' }} onChange={handlePlanFile} />
                  </label>
                )}
              </FormRow>
            </div>
          ) : (
            <div style={{ border: `1px solid ${C.brd}`, borderRadius: 10, padding: '14px 16px', marginBottom: 18, background: '#fff', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 12, right: 14, fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 10, background: 'rgba(234,145,91,0.12)', color: '#c97640', border: '1px solid rgba(234,145,91,0.25)' }}>{form.kind}</span>
              <div style={{ fontSize: 12, color: C.txL, marginBottom: 4 }}>점검 계획</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.txH, marginBottom: 4, paddingRight: 120 }}>{form.title || '—'}</div>
              <div style={{ fontSize: 12, color: C.txL, marginBottom: 12 }}>{[form.kind, form.registrant].filter(Boolean).join(' · ')}</div>
            </div>
          )}

          {!isNew && (
            <div style={{ marginTop: 20, borderRadius: 10, border: isComp ? '2px dashed #19973C' : `2px dashed ${C.sec}`, background: '#fff', padding: '16px 18px' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <FormRow label="보고자" style={{ flex: 1 }}><FInput style={{ background: '#F9FAFC', pointerEvents: 'none' }} value={form.insp || '—'} readOnly /></FormRow>
                <FormRow label="수행일자" required={!isComp} style={{ flex: 1 }}><DatePicker value={form.execDt} onChange={(v) => set('execDt', v)} readOnly={isComp} /></FormRow>
                <FormRow label="제출일시" style={{ flex: 1 }}><FInput value={isComp ? (form.submitDt || '—') : ''} readOnly style={{ background: '#F9FAFC', color: C.txL, pointerEvents: 'none' }} /></FormRow>
              </div>
              <FormRow label="결과요약">
                <FTextarea style={{ background: '#fff', ...(isComp ? { color: C.txt, pointerEvents: 'none', resize: 'none' } : {}) }} value={form.resultContent} onChange={(e) => set('resultContent', e.target.value)} placeholder={isComp ? '' : '점검 결과를 요약하여 입력하세요'} readOnly={isComp} maxLength={1000} />
              </FormRow>
            </div>
          )}
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Btn onClick={onClose}>닫기</Btn>
            <div style={{ flex: 1 }} />
            {!isComp && <Btn primary onClick={() => {
              const e = {};
              if (!form.execDt) e.execDt = '수행일자를 입력하세요.';
              if (!form.resultContent.trim()) e.resultContent = '결과요약을 입력하세요.';
              if (Object.keys(e).length > 0) { setErrors(e); return; }
              setErrors({});
              setSubmitConfirm(true);
            }}>보고 제출</Btn>}
          </div>
        </div>
      </SidePanel>
    </>
  );
}
