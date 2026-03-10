'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal, UnsavedConfirm } from '@/components/ui/ConfirmModal';
import { DatePicker } from '@/components/ui/DatePicker';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { Toggle } from '@/components/ui/Toggle';
import { Icon } from '@/components/ui/Icon';
import { C } from '@/lib/theme/colors';
import { USERS } from '@/data/users';
import type { System } from '@/types/system';

interface SystemDetailPanelProps {
  open: boolean;
  onClose: () => void;
  system: System | null;
  resCount?: number;
  onUpdate?: (form: Partial<System> & Record<string, unknown>) => void;
  onDelete?: (system: System) => void;
}

const emptyForm = {
  systemNm: '',
  systemId: '',
  useYn: 'Y',
  systemType: '',
  mgmtOrg: '',
  systemDesc: '',
  operStartDt: '',
  operEndDt: '',
  managerNm: '',
  managerPhone: '',
  contractInfo: '',
  maintEndDate: '',
  ref1: '',
  ref2: '',
  ref3: '',
  memo: '',
  members: [] as string[],
};

export function SystemDetailPanel({ open, onClose, system, resCount = 0, onUpdate, onDelete }: SystemDetailPanelProps) {
  const [form, setForm] = useState({ ...emptyForm });
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const initialRef = useRef({ ...emptyForm });

  useEffect(() => {
    if (!open || !system) return;
    const loaded = {
      ...emptyForm,
      systemNm: system.nm || '',
      systemId: system.id || '',
      useYn: system.useYn || 'Y',
      systemType: system.type || '',
      mgmtOrg: system.org || '',
      systemDesc: (system as Record<string, string>).systemDesc || '',
      operStartDt: (system as Record<string, string>).operStartDt || '',
      operEndDt: (system as Record<string, string>).operEndDt || '',
      managerNm: (system as Record<string, string>).managerNm || '',
      managerPhone: (system as Record<string, string>).managerPhone || '',
      contractInfo: (system as Record<string, string>).contractInfo || '',
      maintEndDate: system.maintEndDate || '',
      ref1: system.ref1 || '',
      ref2: system.ref2 || '',
      ref3: system.ref3 || '',
      memo: (system as Record<string, string>).memo || '',
      members: ((system as Record<string, string[]>).members || []).slice(),
    };
    setForm(loaded);
    initialRef.current = loaded;
    setEditMode(false);
    setConfirmOpen(false);
    setDeleteConfirm(false);
    setErrors({});
  }, [open, system]);

  const ro = !editMode;
  const isFixed = system?.id === 'SHARED';
  const canDelete = !!system && !isFixed && resCount === 0;

  const setField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.systemNm.trim()) nextErrors.systemNm = '정보시스템 명은 필수입니다.';
    if (!form.systemType) nextErrors.systemType = '시스템 유형을 선택하세요.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const savePanel = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      nm: form.systemNm,
      type: form.systemType,
      org: form.mgmtOrg,
      mem: form.members.length || system?.mem || 0,
    };
    onUpdate?.(payload as unknown as Partial<System> & Record<string, unknown>);
    initialRef.current = payload;
    setForm(payload);
    setEditMode(false);
  };

  const discardChanges = () => {
    setConfirmOpen(false);
    setForm(initialRef.current);
    setEditMode(false);
  };

  const requestClose = () => {
    if (editMode) {
      setConfirmOpen(true);
      return;
    }
    onClose();
  };

  return (
    <>
      <SidePanel open={open} onClose={requestClose} onOverlayClick={requestClose} title="정보시스템 상세" width={620} noScroll>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {system ? (
            <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
              <div style={{ flex: 1, padding: '14px 16px', background: C.priL, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.pri }}>{resCount}</div>
                <div style={{ fontSize: 12, color: C.txS, marginTop: 2 }}>등록 자원</div>
              </div>
              <div style={{ flex: 1, padding: '14px 16px', background: '#F0FDF4', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#16A34A' }}>{form.members.length || system.mem || 0}</div>
                <div style={{ fontSize: 12, color: C.txS, marginTop: 2 }}>구성원</div>
              </div>
            </div>
          ) : null}

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="기본 정보" />
            <FormRow label="사용상태">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Toggle on={form.useYn === 'Y'} onClick={() => !ro && setField('useYn', form.useYn === 'Y' ? 'N' : 'Y')} disabled={ro} />
                <span style={{ fontSize: 13, fontWeight: 500, color: form.useYn === 'Y' ? C.pri : C.txL }}>{form.useYn === 'Y' ? '사용' : '미사용'}</span>
              </div>
            </FormRow>

            <FormRow label="정보시스템 명" required>
              <FormInput value={form.systemNm} onChange={(e) => setField('systemNm', e.target.value)} readOnly={ro} style={errors.systemNm ? { borderColor: C.red } : undefined} />
              {errors.systemNm ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.systemNm}</div> : null}
            </FormRow>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="시스템 ID" style={{ flex: 1 }}>
                <FormInput value={form.systemId} readOnly style={{ background: '#F9FAFC', pointerEvents: 'none' }} />
              </FormRow>
              <FormRow label="시스템 유형" required style={{ flex: 1 }}>
                <FormSelect value={form.systemType} onChange={(e) => setField('systemType', e.target.value)} disabled={ro}>
                  <option value="">선택하세요</option>
                  {['업무', '서비스', '솔루션', '보안', '기타'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
                {errors.systemType ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.systemType}</div> : null}
              </FormRow>
              <FormRow label="관리주체" style={{ flex: 1 }}>
                <FormInput value={form.mgmtOrg} onChange={(e) => setField('mgmtOrg', e.target.value)} readOnly={ro} />
              </FormRow>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="운영 시작일" style={{ flex: 1 }}>
                <DatePicker value={form.operStartDt} onChange={(value) => setField('operStartDt', value)} readOnly={ro} />
              </FormRow>
              <FormRow label="운영 종료일" style={{ flex: 1 }}>
                <DatePicker value={form.operEndDt} onChange={(value) => setField('operEndDt', value)} readOnly={ro} />
              </FormRow>
              <FormRow label="유지보수 종료일" style={{ flex: 1 }}>
                <DatePicker value={form.maintEndDate} onChange={(value) => setField('maintEndDate', value)} readOnly={ro} />
              </FormRow>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="운영 담당" />
            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="담당자" style={{ flex: 1 }}>
                <FormInput value={form.managerNm} onChange={(e) => setField('managerNm', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="연락처" style={{ flex: 1 }}>
                <FormInput value={form.managerPhone} onChange={(e) => setField('managerPhone', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="계약정보" style={{ flex: 1 }}>
                <FormInput value={form.contractInfo} onChange={(e) => setField('contractInfo', e.target.value)} readOnly={ro} />
              </FormRow>
            </div>
            <FormRow label="시스템 설명">
              <FormTextarea value={form.systemDesc} onChange={(e) => setField('systemDesc', e.target.value)} readOnly={ro} style={ro ? { resize: 'none', background: '#F9FAFC' } : undefined} />
            </FormRow>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="참조 정보" />
            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="참조값 1" style={{ flex: 1 }}>
                <FormInput value={form.ref1} onChange={(e) => setField('ref1', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="참조값 2" style={{ flex: 1 }}>
                <FormInput value={form.ref2} onChange={(e) => setField('ref2', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="참조값 3" style={{ flex: 1 }}>
                <FormInput value={form.ref3} onChange={(e) => setField('ref3', e.target.value)} readOnly={ro} />
              </FormRow>
            </div>
            <FormRow label="비고">
              <FormTextarea value={form.memo} onChange={(e) => setField('memo', e.target.value)} readOnly={ro} style={ro ? { resize: 'none', background: '#F9FAFC' } : undefined} />
            </FormRow>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="구성원" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {form.members.length === 0 ? <span style={{ fontSize: 12, color: C.txL }}>구성원이 없습니다.</span> : null}
              {form.members.map((userId: string) => {
                const user = USERS.find((entry) => entry.userId === userId);
                if (!user) return null;
                return (
                  <span
                    key={userId}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '4px 10px',
                      borderRadius: 14,
                      background: C.priL,
                      color: C.priD,
                      fontSize: 12,
                    }}
                  >
                    {user.userNm}
                    {!ro ? (
                      <span onClick={() => setField('members', form.members.filter((id: string) => id !== userId))} style={{ cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>
                        ×
                      </span>
                    ) : null}
                  </span>
                );
              })}
            </div>
            {!ro ? (
              <FormSelect
                value=""
                onChange={(e) => {
                  if (e.target.value && !form.members.includes(e.target.value)) {
                    setField('members', [...form.members, e.target.value]);
                  }
                }}
              >
                <option value="">+ 구성원 추가</option>
                {USERS.filter((user) => user.useYn === 'Y' && !form.members.includes(user.userId)).map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.userNm} ({user.userRole})
                  </option>
                ))}
              </FormSelect>
            ) : null}
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
          {!canDelete ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 10,
                padding: '8px 12px',
                borderRadius: 6,
                background: '#FFF7ED',
                border: '1px solid #FED7AA',
              }}
            >
              <Icon n="alert" s={13} c="#EA580C" />
              <span style={{ color: '#9A3412', fontSize: 12 }}>
                {isFixed ? '공유자원 시스템은 삭제할 수 없습니다.' : '연결된 자원이 있어 삭제할 수 없습니다.'}
              </span>
            </div>
          ) : null}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {editMode ? (
              <>
                <Button onClick={requestClose}>취소</Button>
                <div style={{ flex: 1 }} />
                <Button primary onClick={savePanel}>저장</Button>
              </>
            ) : (
              <>
                <Button onClick={onClose}>닫기</Button>
                <div style={{ flex: 1 }} />
                <Button danger disabled={!canDelete} onClick={() => canDelete && setDeleteConfirm(true)} style={{ marginRight: 8 }}>
                  삭제
                </Button>
                <Button success onClick={() => setEditMode(true)}>수정</Button>
              </>
            )}
          </div>
        </div>
      </SidePanel>

      <ConfirmModal
        open={deleteConfirm}
        title="정보시스템 삭제"
        msg={
          <>
            <strong>{system?.nm}</strong> 정보를 삭제하시겠습니까?
          </>
        }
        okLabel="삭제"
        onOk={() => {
          if (system) onDelete?.(system);
          setDeleteConfirm(false);
          onClose();
        }}
        onCancel={() => setDeleteConfirm(false)}
      />
      <UnsavedConfirm open={confirmOpen} onDiscard={discardChanges} onSave={savePanel} />
    </>
  );
}
