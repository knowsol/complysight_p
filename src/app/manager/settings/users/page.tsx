// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PH } from '@/components/ui/PageHeader';
import { Tbl } from '@/components/ui/Table';
import { RoleBadge, YnBadge } from '@/components/ui/Badge';
import { SB } from '@/components/ui/SearchBar';
import { Btn, SecBtnP } from '@/components/ui/Button';
import { C } from '@/lib/theme/colors';
import { INIT_USER_GROUPS, USERS } from '@/data/users';
import { GroupMgmtModal, UserPanel } from '@/components/panels';

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
    <Box>
      <PH title="사용자" bc="홈 > 환경설정 > 사용자 관리 > 사용자" />

      <Stack direction="row" gap="14px" alignItems="start">
        <Box sx={{ width: 240, flexShrink: 0, background: '#fff', border: `1px solid ${C.brd}`, borderRadius: '6px', overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" sx={{ padding: '14px 16px', borderBottom: `1px solid ${C.brd}` }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.txH }}>그룹</Typography>
          </Stack>
          <Box sx={{ padding: '6px 0' }}>
            {(() => {
              const active = selGroup === null;
              return (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() => setSelGroup(null)}
                  sx={{
                    padding: '9px 14px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    margin: '0 6px',
                    background: active ? C.priL : 'transparent',
                    transition: 'all .3s',
                    '&:hover': !active ? { background: C.secL } : {},
                  }}
                >
                  <Typography sx={{ fontSize: 15, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txt }}>전체</Typography>
                  <Box component="span" sx={{ fontSize: 12, fontWeight: 500, background: '#EEEEEE', color: '#929292', borderRadius: 10, padding: '1px 7px', minWidth: 20, textAlign: 'center' }}>
                    {users.length}
                  </Box>
                </Stack>
              );
            })()}

            {groups.map((group) => {
              const active = selGroup === group.id;
              const cnt = countByGroup(group.id);

              return (
                <Stack
                  key={group.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() => setSelGroup(group.id)}
                  sx={{
                    padding: '9px 14px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    margin: '1px 6px',
                    background: active ? C.priL : 'transparent',
                    transition: 'all .3s',
                    '&:hover': !active ? { background: C.secL } : {},
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: active ? 600 : 500,
                      color: active ? C.sec : C.txt,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      marginRight: '6px',
                    }}
                  >
                    {group.nm}
                  </Typography>
                  <Box component="span" sx={{ fontSize: 12, fontWeight: 500, background: '#EEEEEE', color: '#929292', borderRadius: 10, padding: '1px 7px', minWidth: 20, textAlign: 'center', flexShrink: 0 }}>
                    {cnt}
                  </Box>
                </Stack>
              );
            })}

            {ungrouped > 0
              ? (() => {
                  const active = selGroup === UNGROUPED_KEY;
                  return (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      onClick={() => setSelGroup(UNGROUPED_KEY)}
                      sx={{
                        padding: '9px 14px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        margin: '1px 6px',
                        borderTop: `1px dashed ${C.brd}`,
                        marginTop: '4px',
                        background: active ? C.priL : 'transparent',
                        transition: 'all .3s',
                        '&:hover': !active ? { background: C.secL } : {},
                      }}
                    >
                      <Typography sx={{ fontSize: 15, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txL }}>미지정</Typography>
                      <Box component="span" sx={{ fontSize: 12, fontWeight: 500, background: '#EEEEEE', color: '#929292', borderRadius: 10, padding: '1px 7px', minWidth: 20, textAlign: 'center' }}>
                        {ungrouped}
                      </Box>
                    </Stack>
                  );
                })()
              : null}
          </Box>

          <Box sx={{ padding: '10px 12px', borderTop: `1px solid ${C.brd}` }}>
            <Btn ghost onClick={() => setShowGrpMgmt(true)} style={{ width: '100%' }}>
              사용자 그룹관리
            </Btn>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <SB
            ph="이름, ID, 이메일 검색"
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

          <Tbl
            secTitle={`${selGroupNm} 사용자 목록`}
            secCount={filtered.length}
            secButtons={<SecBtnP onClick={openAddPanel}>+ 사용자 등록</SecBtnP>}
            data={filtered}
            onRow={openDetailPanel}
            cols={[
              { t: '상태', k: 'useYn', w: 100, r: (value) => <YnBadge v={value} /> },
              { t: '사용자 ID', k: 'userId', mw: 150, align: 'left', r: (value) => <Box component="span" sx={{ color: C.txS, fontFamily: 'inherit' }}>{value}</Box> },
              { t: '이름', k: 'userNm', mw: 150, align: 'left', r: (value) => <Box component="span" sx={{ color: C.pri }}>{value}</Box> },
              { t: '이메일', k: 'email', r: (value) => value || '—' },
              {
                t: '그룹',
                k: 'groupId',
                w: 110,
                r: (value) => {
                  const group = groups.find((entry) => entry.id === value);
                  return group ? (
                    <Box component="span" sx={{ padding: '2px 9px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: C.priL, color: C.pri, border: `1px solid ${C.priL}` }}>
                      {group.nm}
                    </Box>
                  ) : (
                    <Box component="span" sx={{ color: C.txL }}>—</Box>
                  );
                },
              },
              { t: '역할', k: 'userRole', w: 120, r: (value) => <RoleBadge v={value} /> },
              { t: '마지막 로그인', k: 'lastLoginDt', w: 150, r: (value) => <Box component="span" sx={{ color: C.txL }}>{value || '—'}</Box> },
            ]}
          />
        </Box>
      </Stack>

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
    </Box>
  );
};

export default function ManagerSettingsUsersPage() {
  return <MgrUsers />;
}
