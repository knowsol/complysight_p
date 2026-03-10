'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal, UnsavedConfirm } from '@/components/ui/ConfirmModal';
import { DatePicker } from '@/components/ui/DatePicker';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { FormInput, FormTextarea, RoSelect } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { C } from '@/lib/theme/colors';
import { SC } from '@/lib/theme/status-colors';
import { useEditPanel } from '@/lib/hooks/use-edit-panel';
import { fSelect } from '@/lib/theme/styles';
import { RES } from '@/data/resources';
import { USERS } from '@/data/users';
import type { SpecialInspection } from '@/types/inspection';

interface SpecialPanelProps {
  open: boolean;
  onClose: () => void;
  item: SpecialInspection | null;
  canReport?: boolean;
  onSave?: (item: SpecialInspection & Record<string, unknown>) => void;
  onDelete?: (item: SpecialInspection) => void;
}

const SPEC_KINDS = ['오프라인점검', '이중화점검', '성능점검', '업무집중기간점검'];

const todayStr = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const lastDayOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
};

const emptyForm = {
  title: '',
  kind: '오프라인점검',
  insp: '',
  due: lastDayOfMonth(),
  purpose: '',
  content: '',
  planFile: null as File | { name: string; size?: number | null } | null,
  reportFile: null as File | { name: string; size?: number | null } | null,
  execDt: '',
  submitDt: '',
  resultContent: '',
  resources: [] as number[],
  registrant: '',
  regDt: '',
};

export function SpecialPanel({ open, onClose, item, onSave, onDelete }: SpecialPanelProps) {
  const { editMode, confirmOpen, startEdit, handleSave, setConfirmOpen } = useEditPanel(open, onClose);
  const [form, setForm] = useState({ ...emptyForm });
  const [inspSearch, setInspSearch] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const isNew = !item;
  const isCompleted = item?.st === '완료';
  const readOnly = !!item && !editMode;
  const roStyle: React.CSSProperties = readOnly ? { background: '#F9FAFC', color: C.txt, pointerEvents: 'none' } : {};
  const roSelectStyle: React.CSSProperties = readOnly ? { background: '#F9FAFC', color: C.txt, pointerEvents: 'none', appearance: 'none', backgroundImage: 'none', cursor: 'default' } : {};

  const resetForm = (source: SpecialInspection | null) => {
    if (!source) {
      setForm({
        ...emptyForm,
        due: lastDayOfMonth(),
        registrant: USERS[0]?.userNm || '관리자',
        regDt: todayStr(),
      });
      setInspSearch('');
      setErrors({});
      return;
    }

    const record = source as Record<string, unknown>;
    setForm({
      title: source.title || '',
      kind: source.kind || '오프라인점검',
      insp: source.insp || '',
      due: source.due || lastDayOfMonth(),
      purpose: source.purpose || '',
      content: source.content || '',
      planFile: source.planFile ? { name: '점검계획서.pdf', size: null } : null,
      reportFile: source.resultFile ? { name: '점검결과보고서.pdf', size: null } : null,
      execDt: source.execDt || '',
      submitDt: source.submitDt || '',
      resultContent: source.resultContent || '',
      resources: Array.isArray(source.resources) ? source.resources.map((name) => RES.find((res) => res.nm === name)?.id).filter(Boolean) as number[] : [],
      registrant: source.regUser || '',
      regDt: source.reg || '',
      reporter: String(record.reporter || ''),
    } as typeof emptyForm & Record<string, unknown>);
    setInspSearch('');
    setErrors({});
  };

  useEffect(() => {
    if (!open) return;
    resetForm(item);
    setDeleteConfirm(false);
  }, [open, item]);

  const setField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const filteredUsers = useMemo(() => {
    const q = inspSearch.trim().toLowerCase();
    if (!q) return [];
    return USERS.filter((user) => user.useYn === 'Y' && (user.userNm.toLowerCase().includes(q) || user.userId.toLowerCase().includes(q)));
  }, [inspSearch]);

  const selectedResources = RES.filter((res) => form.resources.includes(res.id));

  const pickFile = (key: 'planFile' | 'reportFile', file: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 용량은 10MB를 초과할 수 없습니다.');
      return;
    }
    setField(key, file);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = '점검 제목을 입력하세요.';
    if (!form.kind) nextErrors.kind = '점검 종류를 선택하세요.';
    if (!form.insp.trim()) nextErrors.insp = '점검자를 선택하세요.';
    if (!form.due) nextErrors.due = '점검기한을 선택하세요.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveCurrent = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      id: item?.id,
      regUser: form.registrant,
      reg: form.regDt,
      st: item?.st || '요청',
      resources: form.resources.map((id) => RES.find((res) => res.id === id)?.nm).filter(Boolean),
      planFile: !!form.planFile,
      resultFile: !!form.reportFile,
    };
    onSave?.(payload as unknown as SpecialInspection & Record<string, unknown>);
    handleSave();
    if (!isNew) onClose();
  };

  const handleCancel = () => {
    if (isNew || editMode) {
      setConfirmOpen(true);
      return;
    }
    onClose();
  };

  const renderResourceSelector = () => {
    if (readOnly) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {selectedResources.length === 0 ? <span style={{ fontSize: 12, color: C.txL }}>선택된 자원이 없습니다.</span> : null}
          {selectedResources.map((res) => (
            <span key={res.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 12, background: C.priL, color: C.pri, fontSize: 12, fontWeight: 600 }}>
              {res.nm}
              <span style={{ fontWeight: 400, color: C.txS }}>{res.mid}</span>
            </span>
          ))}
        </div>
      );
    }

    const available = RES.filter((res) => res.st !== '미사용' && !form.resources.includes(res.id));

    return (
      <>
        {selectedResources.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {selectedResources.map((res) => (
              <span key={res.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 12, background: C.priL, color: C.pri, fontSize: 12, fontWeight: 600 }}>
                {res.nm}
                <span style={{ fontWeight: 400, color: C.txS }}>{res.mid}</span>
                <span onClick={() => setField('resources', form.resources.filter((id) => id !== res.id))} style={{ cursor: 'pointer', fontSize: 13, lineHeight: 1 }}>
                  ×
                </span>
              </span>
            ))}
          </div>
        ) : null}
        <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ maxHeight: 180, overflowY: 'auto' }}>
            {available.length === 0 ? <div style={{ padding: 14, textAlign: 'center', fontSize: 12, color: C.txL }}>추가 가능한 자원이 없습니다.</div> : null}
            {available.map((res) => (
              <div
                key={res.id}
                onClick={() => setField('resources', [...form.resources, res.id])}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: `1px solid ${C.brd}`, cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0fdf4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <span style={{ color: C.pri, fontWeight: 700, fontSize: 15 }}>+</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.txt }}>{res.nm}</div>
                  <div style={{ fontSize: 12, color: C.txL }}>{[res.sysNm, res.mid, res.ip || '—'].join(' · ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderResultCard = () => {
    const hasResult = isCompleted;
    if (!item || editMode) return null;

    return (
      <div style={{ border: '2px dashed #19973C', borderRadius: 10, marginTop: 20, background: '#fff', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.txH }}>점검 결과</span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 10, background: SC[item.st]?.b || 'rgba(140,147,157,0.12)', color: SC[item.st]?.t || '#6B7280', border: `1px solid ${(SC[item.st]?.t || '#6B7280')}33` }}>
            {item.st || '—'}
          </span>
        </div>
        <div style={{ borderTop: `1px solid ${C.brd}`, marginBottom: 0 }} />

        {hasResult ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.txH, margin: '12px 0 10px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{form.resultContent || '—'}</div>
            <div style={{ paddingTop: 10, borderTop: `1px solid ${C.brd}`, display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
              {[
                ['보고자', String((form as Record<string, unknown>).reporter || form.insp || '—')],
                ['수행일자', form.execDt || '—'],
                ['제출일시', form.submitDt && form.submitDt !== '-' ? form.submitDt : '—'],
              ].map(([label, value]) => (
                <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 12, color: C.txL }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.txt }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.brd}` }}>
              <div style={{ fontSize: 11, color: C.txL, marginBottom: 6 }}>점검보고서 첨부파일</div>
              {form.reportFile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', border: `1px solid ${C.brd}`, borderRadius: 6, background: '#F9FAFC' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span style={{ flex: 1, fontSize: 12, color: C.txt, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.reportFile.name}</span>
                  <span style={{ fontSize: 12, color: C.pri, cursor: 'pointer', fontWeight: 600, padding: '2px 8px', border: `1px solid ${C.pri}`, borderRadius: 4 }}>다운로드</span>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: C.txL }}>첨부파일 없음</div>
              )}
            </div>
          </>
        ) : (
          <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 13, color: C.txL }}>보고된 결과가 없습니다.</div>
        )}
      </div>
    );
  };

  return (
    <>
      <UnsavedConfirm
        open={confirmOpen}
        onDiscard={() => {
          setConfirmOpen(false);
          resetForm(item);
          handleSave();
          if (!isNew) onClose();
        }}
        onSave={() => {
          setConfirmOpen(false);
          saveCurrent();
        }}
      />
      <ConfirmModal
        open={deleteConfirm}
        title="특별점검 삭제"
        msg="선택한 특별점검을 삭제하시겠습니까?"
        onOk={() => {
          if (item) onDelete?.(item);
          setDeleteConfirm(false);
        }}
        onCancel={() => setDeleteConfirm(false)}
      />

      <SidePanel
        open={open}
        onClose={handleCancel}
        onOverlayClick={handleCancel}
        title={isNew ? '특별점검 등록' : '특별점검 상세'}
        width={580}
        noScroll
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <SectionTitle label="점검계획" primary />

          <FormRow label="점검 제목" required>
            <FormInput value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="특별점검 제목을 입력하세요" readOnly={readOnly} style={errors.title ? { ...roStyle, borderColor: C.red } : roStyle} />
            {errors.title ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.title}</div> : null}
          </FormRow>

          <div style={{ display: 'flex', gap: 12 }}>
            <FormRow label="점검 종류" required style={{ flex: 1 }}>
              <RoSelect readOnly={readOnly} style={{ ...fSelect, ...roSelectStyle }} value={form.kind} onChange={(e) => setField('kind', e.target.value)}>
                {SPEC_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </RoSelect>
              {errors.kind ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.kind}</div> : null}
            </FormRow>
            <FormRow label="등록자" style={{ flex: 1 }}>
              <FormInput value={form.registrant} readOnly style={{ background: '#F9FAFC', pointerEvents: 'none' }} />
            </FormRow>
            <FormRow label="등록일" style={{ flex: 1 }}>
              <FormInput value={form.regDt} readOnly style={{ background: '#F9FAFC', pointerEvents: 'none' }} />
            </FormRow>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <FormRow label="점검기한" required style={{ flex: 1 }}>
              <DatePicker value={form.due} onChange={(value) => setField('due', value)} readOnly={readOnly} />
              {errors.due ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.due}</div> : null}
            </FormRow>
            <FormRow label="점검자" required style={{ flex: 2, position: 'relative' }}>
              {readOnly ? (
                <FormInput value={form.insp} readOnly style={roStyle} />
              ) : (
                <div style={{ position: 'relative' }}>
                  <FormInput
                    value={inspSearch || form.insp}
                    onChange={(e) => {
                      setInspSearch(e.target.value);
                      if (!e.target.value) setField('insp', '');
                    }}
                    onFocus={() => {
                      if (form.insp) setInspSearch(form.insp);
                    }}
                    placeholder="이름 또는 아이디 검색"
                    style={errors.insp ? { paddingRight: 28, borderColor: C.red } : { paddingRight: 28 }}
                  />
                  {inspSearch || form.insp ? (
                    <span onClick={() => { setField('insp', ''); setInspSearch(''); }} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: C.txL, fontSize: 16, lineHeight: 1 }}>
                      ×
                    </span>
                  ) : null}
                  {inspSearch ? (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200, background: '#fff', border: `1px solid ${C.brd}`, borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,.1)', maxHeight: 180, overflowY: 'auto' }}>
                      {filteredUsers.length === 0 ? <div style={{ padding: '8px 12px', fontSize: 12, color: C.txL }}>검색 결과가 없습니다.</div> : null}
                      {filteredUsers.map((user) => (
                        <div
                          key={user.userId}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setField('insp', user.userNm);
                            setInspSearch('');
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', borderBottom: `1px solid ${C.brd}` }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = C.priL;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff';
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: C.txt }}>{user.userNm}</span>
                          <span style={{ fontSize: 11, color: C.txL }}>{user.userId}</span>
                          <span style={{ fontSize: 11, color: C.txS, background: '#F0F0F0', padding: '1px 6px', borderRadius: 8 }}>{user.userRole}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
              {errors.insp ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.insp}</div> : null}
            </FormRow>
          </div>

          <FormRow label="대상 자원">{renderResourceSelector()}</FormRow>

          <FormRow label="점검계획서">
            {form.planFile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: `1px solid ${C.brd}`, borderRadius: 6, background: '#F9FAFC' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span style={{ flex: 1, fontSize: 12, color: C.txt, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {form.planFile.name}
                  {'size' in form.planFile && form.planFile.size ? <span style={{ fontSize: 12, color: C.txL, marginLeft: 6 }}>({(form.planFile.size / 1024 / 1024).toFixed(1)} MB)</span> : null}
                </span>
                {readOnly ? <span style={{ fontSize: 12, color: C.pri, cursor: 'pointer', fontWeight: 600, padding: '2px 8px', border: `1px solid ${C.pri}`, borderRadius: 4 }}>다운로드</span> : <span onClick={() => setField('planFile', null)} style={{ cursor: 'pointer', color: C.txL, fontSize: 18, lineHeight: 1 }}>×</span>}
              </div>
            ) : !readOnly ? (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: `2px dashed ${C.brd}`, borderRadius: 6, cursor: 'pointer', transition: 'all .15s', background: '#fff' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span style={{ fontSize: 12, color: C.txL }}>파일을 선택하거나 드래그하세요</span>
                <span style={{ fontSize: 12, color: C.txL, marginLeft: 'auto' }}>최대 10MB</span>
                <FormInput type="file" style={{ display: 'none' }} onChange={(e) => { pickFile('planFile', e.target.files?.[0] || null); e.target.value = ''; }} />
              </label>
            ) : (
              <div style={{ padding: '8px 12px', border: `1px solid ${C.brd}`, borderRadius: 6, background: '#F9FAFC', fontSize: 12, color: C.txL }}>첨부파일 없음</div>
            )}
          </FormRow>

          <FormRow label="점검 목적">
            <FormTextarea value={form.purpose} onChange={(e) => setField('purpose', e.target.value)} placeholder="점검의 목적을 입력하세요" readOnly={readOnly} style={readOnly ? { ...roStyle, resize: 'none' } : undefined} maxLength={500} />
          </FormRow>

          <FormRow label="점검 내용">
            <FormTextarea value={form.content} onChange={(e) => setField('content', e.target.value)} placeholder="점검 내용을 입력하세요" readOnly={readOnly} style={readOnly ? { ...roStyle, resize: 'none' } : undefined} maxLength={500} />
          </FormRow>

          {renderResultCard()}
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
          {!isNew && !editMode && isCompleted ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: '8px 12px', borderRadius: 6, background: '#F0FDF4', border: '1px solid #bbf7d0' }}>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="10" cy="10" r="8" />
                <path d="M10 6v4M10 14h.01" />
              </svg>
              <span style={{ fontSize: 12, color: '#15803d' }}>점검 보고가 완료된 점검은 수정 및 삭제가 불가능합니다.</span>
            </div>
          ) : null}

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isNew || editMode ? (
              <>
                <Button
                  onClick={() => {
                    resetForm(item);
                    handleSave();
                    if (!isNew) onClose();
                  }}
                >
                  취소
                </Button>
                <div style={{ flex: 1 }} />
                <Button primary onClick={saveCurrent}>
                  {isNew ? '등록' : '저장'}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onClose}>닫기</Button>
                <div style={{ flex: 1 }} />
                <Button danger disabled={isCompleted} onClick={() => !isCompleted && setDeleteConfirm(true)} style={{ opacity: isCompleted ? 0.4 : 1, cursor: isCompleted ? 'not-allowed' : 'pointer' }}>
                  삭제
                </Button>
                <Button success style={{ marginLeft: 8, opacity: isCompleted ? 0.4 : 1, cursor: isCompleted ? 'not-allowed' : 'pointer' }} onClick={() => !isCompleted && startEdit()}>
                  수정
                </Button>
              </>
            )}
          </div>
        </div>
      </SidePanel>
    </>
  );
}
