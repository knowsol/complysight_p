// @ts-nocheck
'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { RoleBadge, YnBadge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme/colors';
import { INIT_USER_GROUPS, USERS } from '@/data/users';
import { GroupMgmtModal, UserPanel } from '@/components/panels';
import css from './page.module.css';

const UNGROUPED_KEY = '__NONE__';

const formatDateTime = (date) => {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const getInitialSystems = (user, index) => {
  const byRole = {
    시스템관리자: ['SYS001', 'SYS007', 'SYS008'],
    기관관리자: ['SYS001', 'SYS003'],
    유지보수총괄: ['SYS003', 'SYS008'],
    사용자: index % 2 === 0 ? ['SYS004'] : ['SYS006'],
  };

  return byRole[user.userRole] ? [...byRole[user.userRole]] : [];
};

const getInitialMemo = (user) => {
  if (user.userRole === '시스템관리자') return '전사 사용자 및 권한 관리 담당';
  if (user.userRole === '기관관리자') return '기관 단위 사용자 승인 및 현황 관리';
  if (user.userRole === '유지보수총괄') return '운영 이슈 및 유지보수 협업 총괄';
  return user.groupId ? `${user.groupId} 그룹 소속 사용자` : '';
};

const initialUsers = USERS.map((user, index) => ({
  ...user,
  memo: getInitialMemo(user),
  systems: getInitialSystems(user, index),
}));

const MgrUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [groups, setGroups] = useState(INIT_USER_GROUPS);
  const [selGroup, setSelGroup] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showGrpMgmt, setShowGrpMgmt] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const selUser = users.find((user) => user.userId === selectedUserId) || null;

  useEffect(() => {
    if (selectedUserId && !selUser) {
      setSelectedUserId(null);
    }
  }, [selectedUserId, selUser]);

  useEffect(() => {
    if (selGroup && selGroup !== UNGROUPED_KEY && !groups.some((group) => group.id === selGroup)) {
      setSelGroup(null);
    }
  }, [groups, selGroup]);

  const countByGroup = (groupId) => users.filter((user) => user.groupId === groupId).length;
  const ungrouped = users.filter((user) => !user.groupId).length;

  const filtered = users.filter((user) => {
    const kw = keyword.trim().toLowerCase();

    if (statusFilter === '사용' && user.useYn !== 'Y') return false;
    if (statusFilter === '미사용' && user.useYn !== 'N') return false;

    if (kw) {
      const matchesName = user.userNm.toLowerCase().includes(kw);
      const matchesId = user.userId.toLowerCase().includes(kw);
      const matchesEmail = (user.email || '').toLowerCase().includes(kw);
      if (!matchesName && !matchesId && !matchesEmail) return false;
    }

    if (selGroup === UNGROUPED_KEY) return !user.groupId;
    if (selGroup) return user.groupId === selGroup;
    return true;
  });

  const selGroupNm = selGroup === UNGROUPED_KEY ? '미지정' : groups.find((group) => group.id === selGroup)?.nm || '전체';

  const groupItemStyle = (active: boolean, extra?: CSSProperties): CSSProperties => ({
    background: active ? colors.primaryLight : 'transparent',
    ...extra,
  });

  const groupNameStyle = (active: boolean): CSSProperties => ({
    fontWeight: active ? 600 : 500,
    color: active ? colors.secondary : colors.text,
  });

  const groupNameSimpleStyle = (active: boolean): CSSProperties => ({
    fontWeight: active ? 600 : 500,
    color: active ? colors.secondary : colors.text,
  });

  const ungroupedNameStyle = (active: boolean): CSSProperties => ({
    fontWeight: active ? 600 : 500,
    color: active ? colors.secondary : colors.textLight,
  });

  const openAddPanel = () => {
    setSelectedUserId(null);
    setShowAdd(true);
  };

  const openDetailPanel = (user) => {
    setShowAdd(false);
    setSelectedUserId(user.userId);
  };

  const handleSaveUser = (payload, meta) => {
    const now = formatDateTime(new Date());
    const normalized = {
      ...payload,
      userId: payload.userId.trim(),
      userNm: payload.userNm.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || undefined,
      groupId: payload.groupId || undefined,
      memo: payload.memo?.trim() || '',
      systems: Array.isArray(payload.systems) ? [...payload.systems] : [],
    };

    if (meta?.originalUserId) {
      setUsers((prev) =>
        prev.map((user) =>
          user.userId === meta.originalUserId
            ? {
                ...user,
                ...normalized,
                pwdChgDt: meta.resetPassword ? now : user.pwdChgDt,
                pwdErrCnt: meta.resetPassword ? 0 : user.pwdErrCnt,
              }
            : user,
        ),
      );
      setSelectedUserId(normalized.userId);
      return;
    }

    const createdUser = {
      ...normalized,
      pwdErrCnt: 0,
      pwdChgDt: now,
      joinDt: now,
      lastLoginDt: '',
    };

    setUsers((prev) => [createdUser, ...prev]);
    setShowAdd(false);
  };

  const handleDeleteUser = (targetUser) => {
    setUsers((prev) => prev.filter((user) => user.userId !== targetUser.userId));
    if (selectedUserId === targetUser.userId) {
      setSelectedUserId(null);
    }
  };

  return (
    <div>
      <PageHeader title="사용자" breadcrumb="홈 > 환경설정 > 사용자 관리 > 사용자" />

      <div className={css.layout}>
        <div className={css.leftPanel}>
          <div className={css.leftHeader}>
            <span className={css.leftTitle}>그룹</span>
          </div>
          <div className={css.listWrap}>
            {(() => {
              const active = selGroup === null;
              return (
                <div
                  onClick={() => setSelGroup(null)}
                  className={css.groupItem}
                  style={groupItemStyle(active, { margin: '0 6px' })}
                  onMouseEnter={(event) => {
                    if (!active) event.currentTarget.style.background = colors.secondaryLight;
                  }}
                  onMouseLeave={(event) => {
                    if (!active) event.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span className={css.groupNameSimple} style={groupNameSimpleStyle(active)}>전체</span>
                  <span className={css.badge}>
                    {users.length}
                  </span>
                </div>
              );
            })()}

            {groups.map((group) => {
              const active = selGroup === group.id;
              const cnt = countByGroup(group.id);

              return (
                <div
                  key={group.id}
                  onClick={() => setSelGroup(group.id)}
                  className={css.groupItem}
                  style={groupItemStyle(active)}
                  onMouseEnter={(event) => {
                    if (!active) event.currentTarget.style.background = colors.secondaryLight;
                  }}
                  onMouseLeave={(event) => {
                    if (!active) event.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span className={css.groupName} style={groupNameStyle(active)}>
                    {group.nm}
                  </span>
                  <span className={css.badgeFlex}>
                    {cnt}
                  </span>
                </div>
              );
            })}

            {ungrouped > 0
              ? (() => {
                  const active = selGroup === UNGROUPED_KEY;
                  return (
                    <div
                      onClick={() => setSelGroup(UNGROUPED_KEY)}
                      className={css.groupItem}
                      style={groupItemStyle(active, { borderTop: `1px dashed ${colors.border}`, marginTop: 4 })}
                      onMouseEnter={(event) => {
                        if (!active) event.currentTarget.style.background = colors.secondaryLight;
                      }}
                      onMouseLeave={(event) => {
                        if (!active) event.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span className={css.ungroupedName} style={ungroupedNameStyle(active)}>미지정</span>
                      <span className={css.badge}>
                        {ungrouped}
                      </span>
                    </div>
                  );
                })()
              : null}
          </div>

          <div className={css.grpMgmtFooter}>
            <Button ghost onClick={() => setShowGrpMgmt(true)} className={css.grpMgmtBtn}>
              사용자 그룹관리
            </Button>
          </div>
        </div>

        <div className={css.rightPanel}>
          <SearchBar
            placeholder="이름, ID, 이메일 검색"
            fields={[{ key: 'status', label: '상태', type: 'select', options: ['사용', '미사용'] }]}
            onSearch={(fields, kw) => {
              setKeyword(kw);
              setStatusFilter(fields.status || '');
            }}
            onReset={() => {
              setKeyword('');
              setStatusFilter('');
            }}
          />

          <DataTable
            sectionTitle={`${selGroupNm} 사용자 목록`}
            sectionCount={filtered.length}
            sectionButtons={<Button variant="primary" onClick={openAddPanel}>+ 사용자 등록</Button>}
            data={filtered}
            onRow={openDetailPanel}
            cols={[
              { title: '상태', fieldKey: 'useYn', width: 100, renderCell: (value) => <YnBadge value={value} /> },
              { title: '사용자 ID', fieldKey: 'userId', minWidth: 150, align: 'left', renderCell: (value) => <span className={css.userIdText}>{value}</span> },
              { title: '이름', fieldKey: 'userNm', minWidth: 150, align: 'left', renderCell: (value) => <span className={css.userNameText}>{value}</span> },
              { title: '이메일', fieldKey: 'email', renderCell: (value) => value || '—' },
              {
                title: '그룹',
                fieldKey: 'groupId',
                width: 110,
                renderCell: (value) => {
                  const group = groups.find((entry) => entry.id === value);
                  return group ? (
                    <span className={css.groupBadge}>
                      {group.nm}
                    </span>
                  ) : (
                    <span className={css.emptyGroup}>—</span>
                  );
                },
              },
              { title: '역할', fieldKey: 'userRole', width: 120, renderCell: (value) => <RoleBadge value={value} /> },
              { title: '마지막 로그인', fieldKey: 'lastLoginDt', width: 150, renderCell: (value) => <span className={css.lastLoginText}>{value || '—'}</span> },
            ]}
          />
        </div>
      </div>

      <GroupMgmtModal open={showGrpMgmt} onClose={() => setShowGrpMgmt(false)} groups={groups} setGroups={setGroups} users={users} />

      <UserPanel
        open={showAdd}
        onClose={() => setShowAdd(false)}
        user={null}
        groups={groups}
        existingUserIds={users.map((user) => user.userId)}
        onSubmit={handleSaveUser}
      />

      <UserPanel
        open={!!selUser}
        onClose={() => setSelectedUserId(null)}
        user={selUser}
        groups={groups}
        existingUserIds={users.map((user) => user.userId)}
        onSubmit={handleSaveUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default function ManagerSettingsUsersPage() {
  return <MgrUsers />;
}
