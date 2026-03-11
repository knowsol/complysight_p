'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/Input';
import { colors } from '@/lib/theme/colors';
import type { Dispatch, SetStateAction } from 'react';
import type { User, UserGroup } from '@/types/user';

interface GroupMgmtModalProps {
  open: boolean;
  onClose: () => void;
  groups: UserGroup[];
  setGroups: Dispatch<SetStateAction<UserGroup[]>>;
  users: Pick<User, 'groupId'>[];
}

export function GroupMgmtModal({ open, onClose, groups, setGroups, users }: GroupMgmtModalProps) {
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editNm, setEditNm] = useState('');
  const [newNm, setNewNm] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (open) {
      setSearch('');
      setEditId(null);
      setEditNm('');
      setNewNm('');
      setErrMsg('');
    }
  }, [open]);

  const trimmedSearch = search.trim().toLowerCase();
  const usageCountByGroup = users.reduce<Record<string, number>>((acc, user) => {
    if (user.groupId) {
      acc[user.groupId] = (acc[user.groupId] || 0) + 1;
    }
    return acc;
  }, {});

  const filtered = groups.filter((group) => !trimmedSearch || group.nm.toLowerCase().includes(trimmedSearch) || group.id.toLowerCase().includes(trimmedSearch));

  const addGroup = () => {
    const name = newNm.trim();

    if (!name) {
      setErrMsg('그룹명을 입력하세요.');
      return;
    }

    if (groups.some((group) => group.nm === name)) {
      setErrMsg('이미 등록된 그룹명입니다.');
      return;
    }

    const id = `GRP${String(Date.now()).slice(-6)}`;
    const regDt = new Date().toISOString().slice(0, 10);
    setGroups((prev) => [...prev, { id, nm: name, regDt }]);
    setNewNm('');
    setErrMsg('');
  };

  const startEdit = (group: UserGroup) => {
    setEditId(group.id);
    setEditNm(group.nm);
    setErrMsg('');
  };

  const saveEdit = () => {
    const name = editNm.trim();

    if (!editId) return;

    if (!name) {
      setErrMsg('그룹명을 입력하세요.');
      return;
    }

    if (groups.some((group) => group.id !== editId && group.nm === name)) {
      setErrMsg('이미 등록된 그룹명입니다.');
      return;
    }

    setGroups((prev) => prev.map((group) => (group.id === editId ? { ...group, nm: name } : group)));
    setEditId(null);
    setEditNm('');
    setErrMsg('');
  };

  const deleteGroup = (group: UserGroup) => {
    const inUseCount = usageCountByGroup[group.id] || 0;

    if (inUseCount > 0) {
      setErrMsg(`'${group.nm}' 그룹은 사용자 ${inUseCount}명이 사용 중이어서 삭제할 수 없습니다.`);
      return;
    }

    setGroups((prev) => prev.filter((entry) => entry.id !== group.id));
    if (editId === group.id) {
      setEditId(null);
      setEditNm('');
    }
    setErrMsg('');
  };

  return (
    <Modal open={open} onClose={onClose} title="사용자 그룹 관리" width={520}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 440 }}>
        <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>그룹 검색</div>
        <FormInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="그룹명 또는 그룹 ID 검색" style={{ marginBottom: 12 }} />

        {errMsg ? (
          <div style={{ marginBottom: 12, padding: '8px 12px', borderRadius: 6, border: '1px solid #FECACA', background: '#FEF2F2', color: colors.red, fontSize: 12 }}>
            {errMsg}
          </div>
        ) : null}

        <div style={{ flex: 1, overflowY: 'auto', border: `1px solid ${colors.border}`, borderRadius: 8, padding: 10, background: '#FAFBFC' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '44px 0', fontSize: 12, color: colors.textLight }}>
              {search ? '검색 결과가 없습니다.' : '등록된 그룹이 없습니다.'}
            </div>
          ) : (
            filtered.map((group) => {
              const inUseCount = usageCountByGroup[group.id] || 0;
              const isEditing = editId === group.id;

              return (
                <div
                  key={group.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${isEditing ? colors.primary : colors.border}`,
                    background: isEditing ? colors.primaryLight : '#fff',
                    marginBottom: 8,
                  }}
                >
                  {isEditing ? (
                    <>
                      <FormInput
                        value={editNm}
                        onChange={(event) => setEditNm(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') saveEdit();
                        }}
                        autoFocus
                        style={{ flex: 1 }}
                      />
                      <Button xs primary onClick={saveEdit}>
                        저장
                      </Button>
                      <Button
                        xs
                        onClick={() => {
                          setEditId(null);
                          setEditNm('');
                          setErrMsg('');
                        }}
                      >
                        취소
                      </Button>
                    </>
                  ) : (
                    <>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: colors.textHeading, marginBottom: 3 }}>{group.nm}</div>
                        <div style={{ fontSize: 12, color: colors.textLight }}>
                          {group.id} · 등록일 {group.regDt}
                          {inUseCount > 0 ? <span style={{ color: colors.primary, fontWeight: 700, marginLeft: 8 }}>사용자 {inUseCount}명</span> : null}
                        </div>
                      </div>
                      <Button xs outline onClick={() => startEdit(group)}>
                        수정
                      </Button>
                      <Button xs outlineDanger onClick={() => deleteGroup(group)}>
                        삭제
                      </Button>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>신규 그룹 등록</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <FormInput
              value={newNm}
              onChange={(event) => {
                setNewNm(event.target.value);
                setErrMsg('');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') addGroup();
              }}
              placeholder="그룹명 입력"
              maxLength={50}
              style={{ flex: 1 }}
            />
            <Button primary onClick={addGroup}>
              등록
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
