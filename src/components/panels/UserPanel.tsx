'use client';

import { useEffect, useRef, useState } from 'react';
import { SYS } from '@/data/manager';
import { Button } from '@/components/ui/Button';
import { ConfirmModal, UnsavedConfirm } from '@/components/ui/ConfirmModal';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { Toggle } from '@/components/ui/Toggle';
import { colors } from '@/lib/theme/colors';
import type { User, UserGroup, UserRole } from '@/types/user';

type UserPanelUser = User & {
  memo?: string;
  systems?: string[];
};

export interface UserPanelSubmitMeta {
  originalUserId?: string;
  resetPassword?: boolean;
}

interface UserPanelProps {
  open: boolean;
  onClose: () => void;
  user: UserPanelUser | null;
  groups?: UserGroup[];
  existingUserIds?: string[];
  onSubmit?: (payload: UserPanelUser & { password?: string }, meta: UserPanelSubmitMeta) => void;
  onDelete?: (user: UserPanelUser) => void;
}

interface UserPanelForm {
  st: 'Y' | 'N';
  userId: string;
  userNm: string;
  email: string;
  password: string;
  role: UserRole;
  isAdmin: 'Y' | 'N';
  adminAuth: string;
  sntlAuth: string;
  systems: string[];
  groupId: string;
  phone: string;
  memo: string;
}

interface AccessCardProps {
  label: string;
  value: string;
  accent?: string;
}

const ROLE_OPTIONS: UserRole[] = ['시스템관리자', '기관관리자', '유지보수총괄', '사용자'];
const ADMIN_AUTH_OPTIONS = ['시스템관리자', '기관관리자', '유지보수총괄', '사용자'];
const SENTINEL_AUTH_OPTIONS = ['전체', '읽기', '없음'];

const emptyForm: UserPanelForm = {
  st: 'Y',
  userId: '',
  userNm: '',
  email: '',
  password: '',
  role: '사용자',
  isAdmin: 'N',
  adminAuth: '사용자',
  sntlAuth: '없음',
  systems: [],
  groupId: '',
  phone: '',
  memo: '',
};

const readonlyStyle = { background: '#F9FAFC', color: colors.text };
const readonlyTextareaStyle = { ...readonlyStyle, resize: 'none' as const };

const applyRolePreset = (role: UserRole) => {
  if (role === '시스템관리자') {
    return { isAdmin: 'Y' as const, adminAuth: '시스템관리자', sntlAuth: '전체' };
  }

  if (role === '기관관리자') {
    return { isAdmin: 'Y' as const, adminAuth: '기관관리자', sntlAuth: '읽기' };
  }

  if (role === '유지보수총괄') {
    return { isAdmin: 'N' as const, adminAuth: '유지보수총괄', sntlAuth: '없음' };
  }

  return { isAdmin: 'N' as const, adminAuth: '사용자', sntlAuth: '없음' };
};

const toForm = (user: UserPanelUser | null): UserPanelForm => ({
  st: user?.useYn || 'Y',
  userId: user?.userId || '',
  userNm: user?.userNm || '',
  email: user?.email || '',
  password: '',
  role: user?.userRole || '사용자',
  isAdmin: user?.isAdmin || 'N',
  adminAuth: user?.adminAuth || '사용자',
  sntlAuth: user?.sntlAuth || '없음',
  systems: Array.isArray(user?.systems) ? [...user.systems] : [],
  groupId: user?.groupId || '',
  phone: user?.phone || '',
  memo: user?.memo || '',
});

const renderError = (message?: string) =>
  message ? <div style={{ fontSize: 11, color: colors.red, marginTop: 4 }}>{message}</div> : null;

const AccessCard = ({ label, value, accent }: AccessCardProps) => (
  <div
    style={{
      padding: '14px 16px',
      borderRadius: 8,
      border: `1px solid ${colors.border}`,
      background: '#fff',
    }}
  >
    <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 15, fontWeight: 700, color: accent || colors.textHeading }}>{value}</div>
  </div>
);

export function UserPanel({ open, onClose, user, groups = [], existingUserIds = [], onSubmit, onDelete }: UserPanelProps) {
  const isNew = !user;
  const [form, setForm] = useState<UserPanelForm>(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [pwResetDone, setPwResetDone] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const initialRef = useRef<UserPanelForm>(emptyForm);

  useEffect(() => {
    if (!open) return;

    const nextForm = toForm(user);
    setForm(nextForm);
    initialRef.current = nextForm;
    setEditMode(false);
    setConfirmOpen(false);
    setDeleteConfirm(false);
    setPwResetDone(false);
    setResetPassword(false);
    setErrors({});
  }, [open, user]);

  const ro = !!user && !editMode;
  const availableSystems = SYS.filter((system) => system.id !== 'SHARED' && !form.systems.includes(system.id));

  const setField = <K extends keyof UserPanelForm>(key: K, value: UserPanelForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const isDirty = () => JSON.stringify(form) !== JSON.stringify(initialRef.current) || resetPassword;

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const trimmedId = form.userId.trim();
    const trimmedName = form.userNm.trim();
    const trimmedEmail = form.email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedId) nextErrors.userId = '사용자 ID를 입력하세요.';
    if (!trimmedName) nextErrors.userNm = '사용자명을 입력하세요.';
    if (!trimmedEmail) nextErrors.email = '이메일을 입력하세요.';
    else if (!emailPattern.test(trimmedEmail)) nextErrors.email = '이메일 형식이 올바르지 않습니다.';
    if (isNew && !form.password.trim()) nextErrors.password = '비밀번호를 입력하세요.';

    const duplicateId = existingUserIds.some((userId) => userId === trimmedId && userId !== user?.userId);
    if (duplicateId) nextErrors.userId = '이미 사용 중인 사용자 ID입니다.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const savePanel = () => {
    if (!validate()) return;

    onSubmit?.(
      {
        ...(user || {}),
        userId: form.userId.trim(),
        userNm: form.userNm.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        groupId: form.groupId || undefined,
        useYn: form.st,
        userRole: form.role,
        isAdmin: form.isAdmin,
        adminAuth: form.adminAuth.trim() || '사용자',
        sntlAuth: form.sntlAuth.trim() || '없음',
        memo: form.memo.trim(),
        systems: [...form.systems],
        pwdErrCnt: user?.pwdErrCnt ?? 0,
        pwdChgDt: user?.pwdChgDt ?? '',
        joinDt: user?.joinDt ?? '',
        lastLoginDt: user?.lastLoginDt || '',
        password: form.password,
      },
      { originalUserId: user?.userId, resetPassword },
    );

    initialRef.current = form;
    setConfirmOpen(false);
    setResetPassword(false);
    setPwResetDone(false);

    if (isNew) {
      onClose();
      return;
    }

    setEditMode(false);
  };

  const discardChanges = () => {
    setConfirmOpen(false);
    setForm(initialRef.current);
    setEditMode(false);
    setResetPassword(false);
    setPwResetDone(false);
    setErrors({});
    onClose();
  };

  const requestClose = () => {
    if (isDirty()) {
      setConfirmOpen(true);
      return;
    }

    onClose();
  };

  const handleCancel = () => {
    if (isDirty()) {
      setConfirmOpen(true);
      return;
    }

    if (isNew) {
      onClose();
      return;
    }

    if (editMode) {
      setForm(initialRef.current);
      setEditMode(false);
      setResetPassword(false);
      setPwResetDone(false);
      setErrors({});
      return;
    }

    onClose();
  };

  const handleRoleChange = (role: UserRole) => {
    setForm((prev) => ({ ...prev, role, ...applyRolePreset(role) }));
    setErrors((prev) => ({ ...prev, role: '', isAdmin: '', adminAuth: '', sntlAuth: '' }));
  };

  const handleAddSystem = (systemId: string) => {
    if (!systemId || form.systems.includes(systemId)) return;
    setField('systems', [...form.systems, systemId]);
  };

  const handleRemoveSystem = (systemId: string) => {
    setField(
      'systems',
      form.systems.filter((entry) => entry !== systemId),
    );
  };

  const handlePasswordReset = () => {
    setResetPassword(true);
    setPwResetDone(true);
    window.setTimeout(() => setPwResetDone(false), 2500);
  };

  const passwordError = renderError(errors.password);
  const passwordResetLabel = resetPassword ? '초기화 예정' : pwResetDone ? '✓ 완료' : '초기화';
  const passwordErrorCount = user?.pwdErrCnt ?? 0;

  return (
    <>
      <SidePanel
        open={open}
        onClose={requestClose}
        onOverlayClick={requestClose}
        title={isNew ? '사용자 등록' : editMode ? '사용자 수정' : '사용자 상세'}
        width={580}
        noScroll
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="계정 정보" />

            <FormRow label="상태">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Toggle on={form.st === 'Y'} onClick={() => !ro && setField('st', form.st === 'Y' ? 'N' : 'Y')} disabled={ro} />
                <span style={{ fontSize: 13, fontWeight: 500, color: form.st === 'Y' ? colors.green : colors.textLight }}>
                  {form.st === 'Y' ? '사용' : '미사용'}
                </span>
              </div>
            </FormRow>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="사용자 ID" required style={{ flex: 1 }}>
                <FormInput
                  value={form.userId}
                  onChange={(event) => setField('userId', event.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  placeholder="영문, 숫자, -, _"
                  readOnly={ro || !isNew}
                  maxLength={20}
                  style={ro || !isNew ? readonlyStyle : errors.userId ? { borderColor: colors.red } : undefined}
                />
                {renderError(errors.userId)}
              </FormRow>

              <FormRow label="비밀번호" required={isNew} style={{ flex: 1 }}>
                {ro ? (
                  <FormInput readOnly value="••••••••••••" style={{ ...readonlyStyle, letterSpacing: 2 }} />
                ) : isNew ? (
                  <>
                    <FormInput
                      type="password"
                      value={form.password}
                      onChange={(event) => setField('password', event.target.value)}
                      placeholder="비밀번호 입력"
                      maxLength={72}
                      style={errors.password ? { borderColor: colors.red } : undefined}
                    />
                    {passwordError}
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FormInput readOnly value="••••••••••••" style={{ ...readonlyStyle, letterSpacing: 2, flex: 1 }} />
                      <Button small success={resetPassword || pwResetDone} outline={!resetPassword && !pwResetDone} onClick={handlePasswordReset}>
                        {passwordResetLabel}
                      </Button>
                    </div>
                    <div style={{ fontSize: 11, color: resetPassword ? colors.green : colors.textLight, marginTop: 4 }}>
                      {resetPassword ? '저장 시 비밀번호 초기화가 반영됩니다.' : '저장 시 비밀번호를 초기화할 수 있습니다.'}
                    </div>
                  </>
                )}
              </FormRow>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="사용자명" required style={{ flex: 1 }}>
                <FormInput
                  value={form.userNm}
                  onChange={(event) => setField('userNm', event.target.value)}
                  placeholder="실명"
                  readOnly={ro}
                  maxLength={50}
                  style={ro ? readonlyStyle : errors.userNm ? { borderColor: colors.red } : undefined}
                />
                {renderError(errors.userNm)}
              </FormRow>

              <FormRow label="이메일" required style={{ flex: 1 }}>
                <FormInput
                  type="email"
                  value={form.email}
                  onChange={(event) => setField('email', event.target.value)}
                  placeholder="user@example.com"
                  readOnly={ro}
                  maxLength={254}
                  style={ro ? readonlyStyle : errors.email ? { borderColor: colors.red } : undefined}
                />
                {renderError(errors.email)}
              </FormRow>

              <FormRow label="연락처" style={{ flex: 1 }}>
                <FormInput
                  value={form.phone}
                  onChange={(event) => setField('phone', event.target.value)}
                  placeholder="010-0000-0000"
                  readOnly={ro}
                  maxLength={20}
                  style={ro ? readonlyStyle : undefined}
                />
              </FormRow>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="그룹" style={{ flex: 1 }}>
                <FormSelect value={form.groupId} onChange={(event) => setField('groupId', event.target.value)} disabled={ro} style={ro ? readonlyStyle : undefined}>
                  <option value="">그룹 없음</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.nm}
                    </option>
                  ))}
                </FormSelect>
              </FormRow>

              <FormRow label="역할" style={{ flex: 1 }}>
                <FormSelect value={form.role} onChange={(event) => handleRoleChange(event.target.value as UserRole)} disabled={ro} style={ro ? readonlyStyle : undefined}>
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </FormSelect>
              </FormRow>

              <FormRow label="관리자 여부" style={{ flex: 1 }}>
                <FormSelect value={form.isAdmin} onChange={(event) => setField('isAdmin', event.target.value as 'Y' | 'N')} disabled={ro} style={ro ? readonlyStyle : undefined}>
                  <option value="Y">Y (관리자)</option>
                  <option value="N">N (일반)</option>
                </FormSelect>
              </FormRow>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="관리자 권한" style={{ flex: 1 }}>
                <FormSelect value={form.adminAuth} onChange={(event) => setField('adminAuth', event.target.value)} disabled={ro} style={ro ? readonlyStyle : undefined}>
                  {ADMIN_AUTH_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
              </FormRow>

              <FormRow label="센티널 권한" style={{ flex: 1 }}>
                <FormSelect value={form.sntlAuth} onChange={(event) => setField('sntlAuth', event.target.value)} disabled={ro} style={ro ? readonlyStyle : undefined}>
                  {SENTINEL_AUTH_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
              </FormRow>
            </div>

            <FormRow label="메모">
              <FormTextarea
                value={form.memo}
                onChange={(event) => setField('memo', event.target.value)}
                placeholder="기타 메모"
                readOnly={ro}
                maxLength={500}
                style={ro ? readonlyTextareaStyle : undefined}
              />
            </FormRow>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="소속 정보시스템" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {form.systems.length === 0 ? <span style={{ fontSize: 12, color: colors.textLight }}>소속 정보시스템이 없습니다.</span> : null}
              {form.systems.map((systemId) => {
                const system = SYS.find((entry) => entry.id === systemId);
                if (!system) return null;

                return (
                  <span
                    key={systemId}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      borderRadius: 14,
                      background: colors.primaryLight,
                      color: colors.primaryDark,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {system.nm}
                    {!ro ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveSystem(systemId)}
                        style={{ border: 'none', background: 'transparent', color: colors.primaryDark, cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}
                      >
                        ×
                      </button>
                    ) : null}
                  </span>
                );
              })}
            </div>

            {!ro ? (
              <FormSelect value="" onChange={(event) => handleAddSystem(event.target.value)} style={{ maxWidth: 280 }}>
                <option value="">+ 정보시스템 추가</option>
                {availableSystems.map((system) => (
                  <option key={system.id} value={system.id}>
                    {system.nm}
                  </option>
                ))}
              </FormSelect>
            ) : null}
          </div>

          {user ? (
            <div style={{ marginBottom: 18 }}>
              <SectionTitle label="접속 정보" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                <AccessCard label="가입일시" value={user.joinDt || '—'} />
                <AccessCard label="마지막 로그인" value={user.lastLoginDt || '—'} />
                <AccessCard label="비밀번호 변경" value={user.pwdChgDt || '—'} />
                <AccessCard
                  label="비밀번호 오류"
                  value={passwordErrorCount ? `${passwordErrorCount}회` : '0회'}
                  accent={passwordErrorCount >= 3 ? colors.red : passwordErrorCount > 0 ? '#D97706' : undefined}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${colors.border}`, flexShrink: 0 }}>
          {(isNew || editMode) ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button onClick={handleCancel}>취소</Button>
              <div style={{ flex: 1 }} />
              <Button primary onClick={savePanel}>
                {isNew ? '등록' : '저장'}
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button onClick={onClose}>닫기</Button>
              <div style={{ flex: 1 }} />
              <Button danger onClick={() => setDeleteConfirm(true)}>
                삭제
              </Button>
              <Button success style={{ marginLeft: 8 }} onClick={() => setEditMode(true)}>
                수정
              </Button>
            </div>
          )}
        </div>
      </SidePanel>

      <UnsavedConfirm open={confirmOpen} onDiscard={discardChanges} onSave={savePanel} />
      <ConfirmModal
        open={deleteConfirm}
        title="사용자 삭제"
        msg="삭제된 사용자는 복구할 수 없습니다. 계속하시겠습니까?"
        onCancel={() => setDeleteConfirm(false)}
        onOk={() => {
          if (!user) return;
          setDeleteConfirm(false);
          onDelete?.(user);
        }}
      />
    </>
  );
}
