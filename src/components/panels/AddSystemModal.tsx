'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { Icon } from '@/components/ui/Icon';
import { C } from '@/lib/theme/colors';
import { USERS } from '@/data/users';
import type { System } from '@/types/system';

export interface AddSystemForm {
  systemNm: string;
  systemId: string;
  useYn: 'Y' | 'N';
  systemType: string;
  mgmtOrg: string;
  systemDesc: string;
  operStartDt: string;
  operEndDt: string;
  managerNm: string;
  managerPhone: string;
  contractInfo: string;
  memo: string;
  members: string[];
}

interface AddSystemModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (form: AddSystemForm) => void;
  systems?: System[];
}

const SYSTEM_TYPE_OPTIONS = ['업무', '서비스', '솔루션', '보안', '분석', '기타'];
const DEFAULT_MGMT_ORG_OPTIONS = ['내부', '외부(업체)', 'IT운영팀', '경영지원팀', '정보보안팀'];

const createSystemId = (systems: System[]) => {
  const maxId = systems.reduce((maxValue, system) => {
    const digits = system.id.replace(/[^0-9]/g, '');
    const parsed = digits ? Number.parseInt(digits, 10) : 0;
    if (Number.isNaN(parsed)) return maxValue;
    return parsed > maxValue ? parsed : maxValue;
  }, 0);

  return `SYS${String(maxId + 1).padStart(3, '0')}`;
};

const createEmptyForm = (systems: System[]): AddSystemForm => ({
  systemNm: '',
  systemId: createSystemId(systems),
  useYn: 'Y',
  systemType: '',
  mgmtOrg: '',
  systemDesc: '',
  operStartDt: '',
  operEndDt: '',
  managerNm: '',
  managerPhone: '',
  contractInfo: '',
  memo: '',
  members: [],
});

export function AddSystemModal({ open, onClose, onSubmit, systems = [] }: AddSystemModalProps) {
  const [form, setForm] = useState<AddSystemForm>(() => createEmptyForm(systems));
  const [errors, setErrors] = useState<Partial<Record<'systemNm' | 'systemType', string>>>({});
  const [memberSearch, setMemberSearch] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm(createEmptyForm(systems));
    setErrors({});
    setMemberSearch('');
  }, [open, systems]);

  const mgmtOrgOptions = useMemo(
    () =>
      Array.from(
        new Set(
          [...DEFAULT_MGMT_ORG_OPTIONS, ...systems.map((system) => system.org).filter(Boolean)] as string[],
        ),
      ),
    [systems],
  );

  const setField = (key: keyof AddSystemForm, value: AddSystemForm[keyof AddSystemForm]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'systemNm' || key === 'systemType') {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const toggleMember = (userId: string) => {
    setField(
      'members',
      form.members.includes(userId)
        ? form.members.filter((memberId) => memberId !== userId)
        : [...form.members, userId],
    );
  };

  const validate = () => {
    const nextErrors: Partial<Record<'systemNm' | 'systemType', string>> = {};
    if (!form.systemNm.trim()) nextErrors.systemNm = '정보시스템 명은 필수입니다.';
    if (!form.systemType) nextErrors.systemType = '시스템 유형을 선택해주세요.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit?.(form);
    onClose();
  };

  const filteredUsers = USERS.filter((user) => {
    if (user.useYn !== 'Y') return false;
    const query = memberSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      user.userNm.toLowerCase().includes(query) ||
      user.userId.toLowerCase().includes(query) ||
      user.userRole.toLowerCase().includes(query)
    );
  });

  return (
    <SidePanel open={open} onClose={onClose} title="정보시스템 추가" width={620} noScroll>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ marginBottom: 20 }}>
          <SectionTitle label="기본 정보" primary />
          <FormRow label="사용상태">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                onClick={() => setField('useYn', form.useYn === 'Y' ? 'N' : 'Y')}
                style={{
                  position: 'relative',
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  cursor: 'pointer',
                  background: form.useYn === 'Y' ? C.pri : '#D1D5DB',
                  transition: 'background .2s',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: form.useYn === 'Y' ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                    transition: 'left .2s',
                  }}
                />
              </div>
              <span style={{ fontSize: 13, color: form.useYn === 'Y' ? C.pri : C.txL, fontWeight: 500 }}>
                {form.useYn === 'Y' ? '사용' : '미사용'}
              </span>
            </div>
          </FormRow>

          <FormRow label="정보시스템 명" required>
            <FormInput
              value={form.systemNm}
              onChange={(event) => setField('systemNm', event.target.value)}
              placeholder="정보시스템 명을 입력하세요"
              maxLength={100}
              style={errors.systemNm ? { borderColor: C.red } : undefined}
            />
            {errors.systemNm ? <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.systemNm}</span> : null}
          </FormRow>

          <div style={{ display: 'flex', gap: 12 }}>
            <FormRow label="시스템 ID" style={{ flex: 1 }}>
              <div style={{ position: 'relative' }}>
                <FormInput
                  value={form.systemId}
                  readOnly
                  style={{ background: '#F9FAFC', color: C.txS, pointerEvents: 'none', paddingRight: 64 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 11,
                    color: C.txS,
                    fontWeight: 600,
                    background: C.bgSec,
                    padding: '2px 7px',
                    borderRadius: 3,
                    pointerEvents: 'none',
                  }}
                >
                  자동생성
                </span>
              </div>
            </FormRow>
            <FormRow label="시스템 유형" required style={{ flex: 1 }}>
              <FormSelect
                value={form.systemType}
                onChange={(event) => setField('systemType', event.target.value)}
                style={errors.systemType ? { borderColor: C.red } : undefined}
              >
                <option value="">선택하세요</option>
                {SYSTEM_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </FormSelect>
              {errors.systemType ? <span style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{errors.systemType}</span> : null}
            </FormRow>
            <FormRow label="관리주체" style={{ flex: 1 }}>
              <FormSelect value={form.mgmtOrg} onChange={(event) => setField('mgmtOrg', event.target.value)}>
                <option value="">선택하세요</option>
                {mgmtOrgOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </FormSelect>
            </FormRow>
          </div>

          <FormRow label="시스템 설명">
            <FormTextarea
              value={form.systemDesc}
              onChange={(event) => setField('systemDesc', event.target.value)}
              placeholder="시스템에 대한 설명을 입력하세요"
              maxLength={1000}
            />
          </FormRow>
        </div>

        <div style={{ marginBottom: 20 }}>
          <SectionTitle label="운영 정보" />
          <div style={{ display: 'flex', gap: 12 }}>
            <FormRow label="운영시작일" style={{ flex: 1 }}>
              <DatePicker value={form.operStartDt} onChange={(value) => setField('operStartDt', value)} />
            </FormRow>
            <FormRow label="종료예정일" style={{ flex: 1 }}>
              <DatePicker value={form.operEndDt} onChange={(value) => setField('operEndDt', value)} />
            </FormRow>
            <div style={{ flex: 1 }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <FormRow label="담당자" style={{ flex: 1 }}>
              <FormInput
                value={form.managerNm}
                onChange={(event) => setField('managerNm', event.target.value)}
                placeholder="담당자 이름"
                maxLength={50}
              />
            </FormRow>
            <FormRow label="담당자 연락처" style={{ flex: 1 }}>
              <FormInput
                value={form.managerPhone}
                onChange={(event) => setField('managerPhone', event.target.value)}
                placeholder="010-0000-0000"
                maxLength={20}
              />
            </FormRow>
            <div style={{ flex: 1 }} />
          </div>
          <FormRow label="계약정보">
            <FormTextarea
              value={form.contractInfo}
              onChange={(event) => setField('contractInfo', event.target.value)}
              placeholder="유지보수 계약 정보를 입력하세요"
              maxLength={500}
            />
          </FormRow>
          <FormRow label="비고">
            <FormTextarea
              value={form.memo}
              onChange={(event) => setField('memo', event.target.value)}
              placeholder="기타 메모 정보"
              maxLength={500}
            />
          </FormRow>
        </div>

        <div style={{ marginBottom: 20 }}>
          <SectionTitle label="구성원" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8, minHeight: 32 }}>
            {form.members.map((userId) => {
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
                    fontWeight: 500,
                  }}
                >
                  {user.userNm}
                  <span style={{ fontSize: 12, color: C.txL }}>({user.userRole})</span>
                  <span
                    onClick={() => toggleMember(userId)}
                    style={{ cursor: 'pointer', marginLeft: 2, fontSize: 15, lineHeight: 1, color: C.txL }}
                  >
                    ×
                  </span>
                </span>
              );
            })}
            {form.members.length === 0 ? (
              <span style={{ fontSize: 12, color: C.txL, lineHeight: '32px' }}>구성원이 없습니다. 아래에서 추가하세요.</span>
            ) : null}
          </div>

          <div style={{ position: 'relative', marginBottom: 6 }}>
            <FormInput
              value={memberSearch}
              onChange={(event) => setMemberSearch(event.target.value)}
              placeholder="이름, 아이디, 역할로 검색..."
              style={{ paddingLeft: 30, paddingRight: memberSearch ? 26 : undefined, fontSize: 14, marginBottom: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                left: 9,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              <Icon n="search" s={14} c={C.txL} />
            </span>
            {memberSearch ? (
              <span
                onClick={() => setMemberSearch('')}
                style={{
                  position: 'absolute',
                  right: 9,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: C.txL,
                  fontSize: 15,
                  lineHeight: 1,
                }}
              >
                ×
              </span>
            ) : null}
          </div>

          <div style={{ border: `1px solid ${C.brd}`, borderRadius: 6, maxHeight: 180, overflowY: 'auto' }}>
            {filteredUsers.length === 0 ? (
              <div style={{ padding: '14px', textAlign: 'center', fontSize: 12, color: C.txL }}>
                {memberSearch.trim() ? `"${memberSearch}" 검색 결과가 없습니다.` : '사용자가 없습니다.'}
              </div>
            ) : (
              filteredUsers.map((user) => {
                const checked = form.members.includes(user.userId);
                return (
                  <div
                    key={user.userId}
                    onClick={() => toggleMember(user.userId)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      cursor: 'pointer',
                      background: checked ? C.priL : '#fff',
                      borderBottom: `1px solid ${C.brd}`,
                    }}
                    onMouseEnter={(event) => {
                      if (!checked) event.currentTarget.style.background = '#F9FAFC';
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.background = checked ? C.priL : '#fff';
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        border: `2px solid ${checked ? C.pri : C.brd}`,
                        background: checked ? C.pri : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {checked ? (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                    </div>
                    <span style={{ fontSize: 13, color: checked ? C.pri : C.txt, fontWeight: checked ? 600 : 400, flex: 1 }}>
                      {user.userNm}
                    </span>
                    <span style={{ fontSize: 12, color: C.txL }}>{user.userId}</span>
                    <span
                      style={{
                        fontSize: 12,
                        color: C.txS,
                        background: '#F0F0F0',
                        padding: '1px 6px',
                        borderRadius: 8,
                      }}
                    >
                      {user.userRole}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <div style={{ fontSize: 12, color: C.txL, marginTop: 6 }}>{form.members.length}명 선택됨</div>
        </div>
      </div>

      <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.brd}`, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <Button onClick={onClose}>취소</Button>
        <div style={{ flex: 1 }} />
        <Button variant="primary" onClick={handleSubmit}>
          등록
        </Button>
      </div>
    </SidePanel>
  );
}
