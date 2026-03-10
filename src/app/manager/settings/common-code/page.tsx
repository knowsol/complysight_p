// @ts-nocheck
'use client';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FormRow, PanelDeleteBtn, SecTitle } from '@/components/ui/FormRow';
import { FInput, FTextarea } from '@/components/ui/Input';
import { PH } from '@/components/ui/PageHeader';
import { Radio } from '@/components/ui/Radio';
import { YnBadge } from '@/components/ui/Badge';
import { SidePanel } from '@/components/ui/SidePanel';
import { Tbl } from '@/components/ui/Table';
import { C } from '@/lib/theme/colors';
import { fInput } from '@/lib/theme/styles';

type UseYn = 'Y' | 'N';

interface CodeGroup {
  id: string;
  nm: string;
  desc: string;
  useYn: UseYn;
  regDt: string;
  cnt: number;
}

interface CodeItem {
  id: string;
  grpId: string;
  cd: string;
  nm: string;
  desc: string;
  sort: number;
  useYn: UseYn;
  regDt: string;
}

const TODAY = '2026-02-24';

const INITIAL_CODES: Record<string, CodeItem[]> = {
  GRP001: [
    { id: 'C001001', grpId: 'GRP001', cd: 'HW', nm: '하드웨어', desc: '물리 서버 및 장비', sort: 1, useYn: 'Y', regDt: '2026-01-10' },
    { id: 'C001002', grpId: 'GRP001', cd: 'SW', nm: '소프트웨어', desc: 'OS, 미들웨어, 애플리케이션', sort: 2, useYn: 'Y', regDt: '2026-01-10' },
    { id: 'C001003', grpId: 'GRP001', cd: 'NW', nm: '네트워크', desc: '스위치, 라우터, 방화벽', sort: 3, useYn: 'Y', regDt: '2026-01-10' },
    { id: 'C001004', grpId: 'GRP001', cd: 'SEC', nm: '보안', desc: '보안 장비 및 솔루션', sort: 4, useYn: 'Y', regDt: '2026-01-10' },
  ],
  GRP002: [
    { id: 'C002001', grpId: 'GRP002', cd: 'REQ', nm: '요청', desc: '점검 요청 상태', sort: 1, useYn: 'Y', regDt: '2026-01-10' },
    { id: 'C002002', grpId: 'GRP002', cd: 'ING', nm: '진행', desc: '점검 진행 상태', sort: 2, useYn: 'Y', regDt: '2026-01-10' },
    { id: 'C002003', grpId: 'GRP002', cd: 'DLY', nm: '지연', desc: '기한 초과 지연', sort: 3, useYn: 'Y', regDt: '2026-01-10' },
    { id: 'C002004', grpId: 'GRP002', cd: 'DONE', nm: '완료', desc: '점검 완료 상태', sort: 4, useYn: 'Y', regDt: '2026-01-10' },
  ],
  GRP003: [
    { id: 'C003001', grpId: 'GRP003', cd: 'OK', nm: '정상', desc: '정상 판정', sort: 1, useYn: 'Y', regDt: '2026-01-10' },
    { id: 'C003002', grpId: 'GRP003', cd: 'WARN', nm: '경고', desc: '주의 필요 상태', sort: 2, useYn: 'Y', regDt: '2026-01-10' },
    { id: 'C003003', grpId: 'GRP003', cd: 'NG', nm: '비정상', desc: '비정상 판정', sort: 3, useYn: 'Y', regDt: '2026-01-10' },
  ],
  GRP004: [
    { id: 'C004001', grpId: 'GRP004', cd: 'SYS', nm: '시스템 관리자', desc: '전체 권한', sort: 1, useYn: 'Y', regDt: '2026-01-10' },
    { id: 'C004002', grpId: 'GRP004', cd: 'ORG', nm: '기관 관리자', desc: '기관 범위 권한', sort: 2, useYn: 'Y', regDt: '2026-01-10' },
    { id: 'C004003', grpId: 'GRP004', cd: 'MNT', nm: '유지보수 총괄', desc: '점검 운영 권한', sort: 3, useYn: 'Y', regDt: '2026-01-10' },
    { id: 'C004004', grpId: 'GRP004', cd: 'USR', nm: '사용자', desc: '점검 수행 권한', sort: 4, useYn: 'Y', regDt: '2026-01-10' },
  ],
  GRP005: [
    { id: 'C005001', grpId: 'GRP005', cd: 'REG', nm: '정기점검', desc: '정기 점검 유형', sort: 1, useYn: 'Y', regDt: '2026-01-11' },
    { id: 'C005002', grpId: 'GRP005', cd: 'SPC', nm: '특별점검', desc: '특별 점검 유형', sort: 2, useYn: 'Y', regDt: '2026-01-11' },
  ],
  GRP006: [
    { id: 'C006001', grpId: 'GRP006', cd: 'SEC', nm: '보안', desc: '보안 이벤트 기반 특별점검', sort: 1, useYn: 'Y', regDt: '2026-01-11' },
    { id: 'C006002', grpId: 'GRP006', cd: 'FAIL', nm: '장애', desc: '장애 발생 기반 특별점검', sort: 2, useYn: 'Y', regDt: '2026-01-11' },
    { id: 'C006003', grpId: 'GRP006', cd: 'AUDIT', nm: '감사', desc: '감사 대응 특별점검', sort: 3, useYn: 'Y', regDt: '2026-01-11' },
  ],
  GRP007: [
    { id: 'C007001', grpId: 'GRP007', cd: 'DAY', nm: '매일', desc: '일 단위 반복', sort: 1, useYn: 'Y', regDt: '2026-01-12' },
    { id: 'C007002', grpId: 'GRP007', cd: 'WEEK', nm: '매주', desc: '주 단위 반복', sort: 2, useYn: 'Y', regDt: '2026-01-12' },
    { id: 'C007003', grpId: 'GRP007', cd: 'MONTH', nm: '매월', desc: '월 단위 반복', sort: 3, useYn: 'Y', regDt: '2026-01-12' },
  ],
  GRP008: [
    { id: 'C008001', grpId: 'GRP008', cd: 'MAIL', nm: '이메일', desc: '이메일 알림', sort: 1, useYn: 'Y', regDt: '2026-01-15' },
    { id: 'C008002', grpId: 'GRP008', cd: 'SMS', nm: 'SMS', desc: '문자 알림', sort: 2, useYn: 'Y', regDt: '2026-01-15' },
    { id: 'C008003', grpId: 'GRP008', cd: 'PUSH', nm: '푸시', desc: '앱 푸시 알림', sort: 3, useYn: 'Y', regDt: '2026-01-15' },
  ],
  GRP009: [
    { id: 'C009001', grpId: 'GRP009', cd: 'PDF', nm: 'PDF', desc: '문서 파일', sort: 1, useYn: 'Y', regDt: '2026-01-20' },
    { id: 'C009002', grpId: 'GRP009', cd: 'XLSX', nm: '엑셀', desc: '엑셀 파일', sort: 2, useYn: 'Y', regDt: '2026-01-20' },
    { id: 'C009003', grpId: 'GRP009', cd: 'CSV', nm: 'CSV', desc: '텍스트 기반 데이터 파일', sort: 3, useYn: 'N', regDt: '2026-01-20' },
  ],
  GRP010: [
    { id: 'C010001', grpId: 'GRP010', cd: 'INT', nm: '내부시스템', desc: '사내 운영 시스템', sort: 1, useYn: 'Y', regDt: '2026-01-20' },
    { id: 'C010002', grpId: 'GRP010', cd: 'EXT', nm: '대외시스템', desc: '외부 연계 시스템', sort: 2, useYn: 'Y', regDt: '2026-01-20' },
    { id: 'C010003', grpId: 'GRP010', cd: 'HYB', nm: '하이브리드', desc: '내외부 혼합 시스템', sort: 3, useYn: 'Y', regDt: '2026-01-20' },
  ],
};

const GROUP_META = [
  { id: 'GRP001', nm: '자원유형', desc: '자원 대분류 및 유형 코드', useYn: 'Y', regDt: '2026-01-10' },
  { id: 'GRP002', nm: '점검상태', desc: '점검 진행 상태 코드', useYn: 'Y', regDt: '2026-01-10' },
  { id: 'GRP003', nm: '점검결과', desc: '점검 결과 판정 코드', useYn: 'Y', regDt: '2026-01-10' },
  { id: 'GRP004', nm: '사용자역할', desc: '시스템 권한 유형 코드', useYn: 'Y', regDt: '2026-01-10' },
  { id: 'GRP005', nm: '점검유형', desc: '점검 유형 분류 코드', useYn: 'Y', regDt: '2026-01-11' },
  { id: 'GRP006', nm: '특별점검종류', desc: '특별점검 세부 종류 코드', useYn: 'Y', regDt: '2026-01-11' },
  { id: 'GRP007', nm: '정기점검주기', desc: '정기점검 반복 주기 코드', useYn: 'Y', regDt: '2026-01-12' },
  { id: 'GRP008', nm: '알림유형', desc: '발송 알림 종류 코드', useYn: 'Y', regDt: '2026-01-15' },
  { id: 'GRP009', nm: '파일유형', desc: '첨부 파일 형식 코드', useYn: 'N', regDt: '2026-01-20' },
  { id: 'GRP010', nm: '시스템유형', desc: '정보시스템 유형 분류 코드', useYn: 'Y', regDt: '2026-01-20' },
];

const INITIAL_GROUPS: CodeGroup[] = GROUP_META.map((group) => ({
  ...group,
  cnt: (INITIAL_CODES[group.id] || []).length,
}));

const EMPTY_GROUP = { id: '', nm: '', desc: '', useYn: 'Y' as UseYn };
const EMPTY_CODE = { id: '', cd: '', nm: '', desc: '', sort: 1, useYn: 'Y' as UseYn };

const searchInputSx = {
  bgcolor: '#fff',
  '& .MuiOutlinedInput-input': { px: 1.5, py: 1.125, fontSize: 13 },
};

const errorText = (msg?: string) =>
  msg ? (
    <Typography sx={{ mt: 0.5, fontSize: 12, color: C.red }}>
      {msg}
    </Typography>
  ) : null;

const readOnlyStyle = { background: '#f0f1f3', color: C.txS, pointerEvents: 'none' };

const CommonCodeScreen = () => {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [codes, setCodes] = useState(INITIAL_CODES);
  const [selGrp, setSelGrp] = useState<CodeGroup | null>(INITIAL_GROUPS[0]);
  const [grpQ, setGrpQ] = useState('');
  const [codeQ, setCodeQ] = useState('');

  const [grpPanel, setGrpPanel] = useState(false);
  const [grpForm, setGrpForm] = useState(EMPTY_GROUP);
  const [grpIsNew, setGrpIsNew] = useState(false);
  const [grpErrors, setGrpErrors] = useState<Record<string, string>>({});
  const [grpDel, setGrpDel] = useState<string | null>(null);

  const [codePanel, setCodePanel] = useState(false);
  const [codeForm, setCodeForm] = useState(EMPTY_CODE);
  const [codeIsNew, setCodeIsNew] = useState(false);
  const [codeErrors, setCodeErrors] = useState<Record<string, string>>({});
  const [codeDel, setCodeDel] = useState<string | null>(null);

  const [showUpload, setShowUpload] = useState(false);

  const filteredGroups = groups.filter((group) => !grpQ || group.nm.includes(grpQ) || group.id.includes(grpQ));
  const currentCodes = (codes[selGrp?.id || ''] || [])
    .filter((code) => !codeQ || code.cd.includes(codeQ) || code.nm.includes(codeQ) || code.desc.includes(codeQ))
    .sort((a, b) => a.sort - b.sort);

  const setGroupField = (key: string, value: string) => setGrpForm((prev) => ({ ...prev, [key]: value }));
  const setCodeField = (key: string, value: string | number) => setCodeForm((prev) => ({ ...prev, [key]: value }));

  const openGrpPanel = (group?: CodeGroup | null, isNew = false) => {
    setGrpIsNew(isNew);
    setGrpForm(isNew ? EMPTY_GROUP : { id: group?.id || '', nm: group?.nm || '', desc: group?.desc || '', useYn: group?.useYn || 'Y' });
    setGrpErrors({});
    setGrpPanel(true);
  };

  const openCodePanel = (code?: CodeItem | null, isNew = false) => {
    if (!selGrp) return;
    setCodeIsNew(isNew);
    setCodeForm(
      isNew
        ? { ...EMPTY_CODE, sort: (codes[selGrp.id] || []).length + 1 }
        : { id: code?.id || '', cd: code?.cd || '', nm: code?.nm || '', desc: code?.desc || '', sort: code?.sort || 1, useYn: code?.useYn || 'Y' },
    );
    setCodeErrors({});
    setCodePanel(true);
  };

  const saveGroup = () => {
    const nextErrors: Record<string, string> = {};

    if (!grpForm.id.trim()) nextErrors.id = '그룹 ID를 입력하세요.';
    if (!grpForm.nm.trim()) nextErrors.nm = '그룹명을 입력하세요.';
    if (grpIsNew && groups.some((group) => group.id === grpForm.id.trim())) nextErrors.id = '이미 존재하는 그룹 ID입니다.';

    setGrpErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (grpIsNew) {
      const nextGroup: CodeGroup = {
        id: grpForm.id.trim(),
        nm: grpForm.nm.trim(),
        desc: grpForm.desc.trim(),
        useYn: grpForm.useYn,
        regDt: TODAY,
        cnt: 0,
      };

      setGroups((prev) => [...prev, nextGroup]);
      setCodes((prev) => ({ ...prev, [nextGroup.id]: [] }));
      setSelGrp(nextGroup);
    } else {
      setGroups((prev) =>
        prev.map((group) =>
          group.id === grpForm.id
            ? { ...group, nm: grpForm.nm.trim(), desc: grpForm.desc.trim(), useYn: grpForm.useYn }
            : group,
        ),
      );
      if (selGrp?.id === grpForm.id) {
        setSelGrp((prev) =>
          prev
            ? {
                ...prev,
                nm: grpForm.nm.trim(),
                desc: grpForm.desc.trim(),
                useYn: grpForm.useYn,
              }
            : prev,
        );
      }
    }

    setGrpPanel(false);
  };

  const saveCode = () => {
    if (!selGrp) return;

    const nextErrors: Record<string, string> = {};
    if (!codeForm.cd.trim()) nextErrors.cd = '코드값을 입력하세요.';
    if (!codeForm.nm.trim()) nextErrors.nm = '코드명을 입력하세요.';
    if (codeIsNew && (codes[selGrp.id] || []).some((code) => code.cd === codeForm.cd.trim())) nextErrors.cd = '이미 존재하는 코드값입니다.';

    setCodeErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (codeIsNew) {
      const nextCode: CodeItem = {
        id: `${selGrp.id}_${Date.now()}`,
        grpId: selGrp.id,
        cd: codeForm.cd.trim(),
        nm: codeForm.nm.trim(),
        desc: codeForm.desc.trim(),
        sort: Number(codeForm.sort) || 1,
        useYn: codeForm.useYn,
        regDt: TODAY,
      };

      setCodes((prev) => ({ ...prev, [selGrp.id]: [...(prev[selGrp.id] || []), nextCode] }));
      setGroups((prev) => prev.map((group) => (group.id === selGrp.id ? { ...group, cnt: group.cnt + 1 } : group)));
      setSelGrp((prev) => (prev ? { ...prev, cnt: prev.cnt + 1 } : prev));
    } else {
      setCodes((prev) => ({
        ...prev,
        [selGrp.id]: (prev[selGrp.id] || []).map((code) =>
          code.id === codeForm.id
            ? {
                ...code,
                cd: codeForm.cd.trim(),
                nm: codeForm.nm.trim(),
                desc: codeForm.desc.trim(),
                sort: Number(codeForm.sort) || 1,
                useYn: codeForm.useYn,
              }
            : code,
        ),
      }));
    }

    setCodePanel(false);
  };

  const deleteGroup = (groupId: string) => {
    const nextGroups = groups.filter((group) => group.id !== groupId);
    setGroups(nextGroups);
    setCodes((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
    if (selGrp?.id === groupId) setSelGrp(nextGroups[0] || null);
    setGrpDel(null);
    setGrpPanel(false);
  };

  const deleteCode = (codeId: string) => {
    if (!selGrp) return;
    setCodes((prev) => ({
      ...prev,
      [selGrp.id]: (prev[selGrp.id] || []).filter((code) => code.id !== codeId),
    }));
    setGroups((prev) => prev.map((group) => (group.id === selGrp.id ? { ...group, cnt: Math.max(0, group.cnt - 1) } : group)));
    setSelGrp((prev) => (prev ? { ...prev, cnt: Math.max(0, prev.cnt - 1) } : prev));
    setCodeDel(null);
    setCodePanel(false);
  };

  return (
    <Box>
      <PH title="공통코드" bc="홈 > 환경설정 > 공통코드" />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '320px minmax(0, 1fr)' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${C.brd}`,
            borderRadius: 2,
            overflow: 'hidden',
            position: { lg: 'sticky' },
            top: { lg: 0 },
            maxHeight: { lg: 'calc(100vh - 170px)' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.75, borderBottom: `1px solid ${C.brd}` }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: C.txH }}>코드 그룹</Typography>
            <IconButton size="small" onClick={() => openGrpPanel(null, true)} sx={{ color: C.pri, bgcolor: C.priL, '&:hover': { bgcolor: '#dce9ff' } }}>
              <AddOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box sx={{ p: 1.5, borderBottom: `1px solid ${C.brd}` }}>
            <OutlinedInput
              fullWidth
              size="small"
              value={grpQ}
              onChange={(event) => setGrpQ(event.target.value)}
              placeholder="그룹 ID 또는 그룹명 검색"
              startAdornment={
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 18, color: C.txL }} />
                </InputAdornment>
              }
              sx={searchInputSx}
            />
          </Box>

          <List sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
            {filteredGroups.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ fontSize: 13, color: C.txL }}>검색 결과가 없습니다.</Typography>
              </Box>
            ) : (
              filteredGroups.map((group) => {
                const selected = selGrp?.id === group.id;

                return (
                  <ListItemButton
                    key={group.id}
                    selected={selected}
                    onClick={() => {
                      setSelGrp(group);
                      setCodeQ('');
                      setCodePanel(false);
                    }}
                    onDoubleClick={() => openGrpPanel(group, false)}
                    sx={{
                      mb: 0.75,
                      borderRadius: 1.5,
                      alignItems: 'flex-start',
                      border: `1px solid ${selected ? '#c9dcff' : 'transparent'}`,
                      bgcolor: selected ? C.priL : '#fff',
                      '&.Mui-selected': { bgcolor: C.priL },
                      '&.Mui-selected:hover': { bgcolor: '#e5efff' },
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 700, color: selected ? C.pri : C.txH }}>{group.nm}</Typography>
                          <Typography sx={{ mt: 0.25, fontSize: 12, color: C.txL }}>{group.id}</Typography>
                        </Box>
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
                          {group.useYn === 'N' && <Chip label="미사용" size="small" variant="outlined" sx={{ height: 22, fontSize: 11 }} />}
                          <Chip label={`${group.cnt}`} size="small" sx={{ height: 22, fontSize: 11, bgcolor: C.bgSec, color: C.txS }} />
                        </Stack>
                      </Stack>
                      <Typography sx={{ mt: 1, fontSize: 12, color: C.txS, whiteSpace: 'normal', lineHeight: 1.5 }}>{group.desc}</Typography>
                    </Box>
                  </ListItemButton>
                );
              })
            )}
          </List>

          <Stack direction="row" justifyContent="space-between" sx={{ px: 2, py: 1.25, bgcolor: '#F8FAFC', borderTop: `1px solid ${C.brd}` }}>
            <Typography sx={{ fontSize: 12, color: C.txS }}>전체 {groups.length}개</Typography>
            <Typography sx={{ fontSize: 12, color: C.txS }}>사용 {groups.filter((group) => group.useYn === 'Y').length}개</Typography>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ border: `1px solid ${C.brd}`, borderRadius: 2, overflow: 'hidden' }}>
          {!selGrp ? (
            <Stack sx={{ minHeight: 520, px: 3, py: 8 }} alignItems="center" justifyContent="center" spacing={1}>
              <Typography sx={{ fontSize: 38, lineHeight: 1 }}>☰</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: C.txH }}>그룹을 선택하세요</Typography>
              <Typography sx={{ fontSize: 13, color: C.txL }}>왼쪽 목록에서 코드 그룹을 선택하면 코드 목록과 상세 편집이 열립니다.</Typography>
            </Stack>
          ) : (
            <>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1.25}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
                sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${C.brd}` }}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: C.txH }}>{selGrp.nm}</Typography>
                    <Chip label={selGrp.id} size="small" sx={{ bgcolor: '#F8FAFC', color: C.txS }} />
                    <YnBadge v={selGrp.useYn} />
                  </Stack>
                  <Typography sx={{ mt: 0.75, fontSize: 13, color: C.txS }}>{selGrp.desc}</Typography>
                </Box>

                <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => openGrpPanel(selGrp, false)} sx={{ whiteSpace: 'nowrap' }}>
                  그룹 수정
                </Button>
              </Stack>

              <Stack
                direction={{ xs: 'column', lg: 'row' }}
                spacing={1}
                alignItems={{ xs: 'stretch', lg: 'center' }}
                justifyContent="space-between"
                sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${C.brd}` }}
              >
                <OutlinedInput
                  fullWidth
                  size="small"
                  value={codeQ}
                  onChange={(event) => setCodeQ(event.target.value)}
                  placeholder="코드값 또는 코드명 검색"
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ fontSize: 18, color: C.txL }} />
                    </InputAdornment>
                  }
                  sx={{ maxWidth: 340, ...searchInputSx }}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', lg: 'auto' } }}>
                  <Button variant="outlined" startIcon={<CloudUploadOutlinedIcon />} onClick={() => setShowUpload(true)}>
                    엑셀 업로드
                  </Button>
                  <Button variant="outlined" startIcon={<DownloadOutlinedIcon />}>
                    엑셀 다운로드
                  </Button>
                  <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => openCodePanel(null, true)}>
                    코드 추가
                  </Button>
                </Stack>
              </Stack>

              <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Tbl
                  noPaging
                  data={currentCodes}
                  onRow={(row) => openCodePanel(row, false)}
                  cols={[
                    { t: '순서', k: 'sort', w: 80 },
                    {
                      t: '코드값',
                      k: 'cd',
                      mw: 120,
                      r: (value) => (
                        <Chip
                          label={value}
                          size="small"
                          sx={{ height: 24, borderRadius: 1, bgcolor: C.priL, color: C.pri, fontWeight: 700 }}
                        />
                      ),
                    },
                    {
                      t: '항목',
                      k: 'nm',
                      align: 'left',
                      mw: 140,
                      r: (value) => <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.txH }}>{value}</Typography>,
                    },
                    {
                      t: '설명',
                      k: 'desc',
                      align: 'left',
                      mw: 260,
                      r: (value) => (
                        <Typography sx={{ fontSize: 13, color: C.txS, whiteSpace: 'normal', lineHeight: 1.5 }}>
                          {value || '—'}
                        </Typography>
                      ),
                    },
                    { t: '사용여부', k: 'useYn', r: (value) => <YnBadge v={value} /> },
                    { t: '등록일', k: 'regDt', w: 120 },
                  ]}
                />
              </Box>
            </>
          )}
        </Paper>
      </Box>

      <SidePanel open={grpPanel} onClose={() => setGrpPanel(false)} title={grpIsNew ? '코드 그룹 추가' : '코드 그룹 수정'} width={480} noScroll>
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
            {!grpIsNew && <PanelDeleteBtn onClick={() => setGrpDel(grpForm.id)} />}
            <SecTitle label="그룹 정보" primary />

            <FormRow label="그룹 ID" required>
              <FInput
                value={grpForm.id}
                onChange={(event) => setGroupField('id', event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="예) GRP011"
                maxLength={20}
                readOnly={!grpIsNew}
                style={{ ...fInput, ...(!grpIsNew ? readOnlyStyle : {}) }}
              />
              {errorText(grpErrors.id)}
            </FormRow>

            <FormRow label="그룹명" required>
              <FInput value={grpForm.nm} onChange={(event) => setGroupField('nm', event.target.value)} placeholder="예) 자원유형" maxLength={50} style={fInput} />
              {errorText(grpErrors.nm)}
            </FormRow>

            <FormRow label="설명">
              <FTextarea
                value={grpForm.desc}
                onChange={(event) => setGroupField('desc', event.target.value)}
                placeholder="코드 그룹에 대한 설명을 입력하세요."
                rows={4}
                maxLength={200}
                style={{ ...fInput, resize: 'none', fontFamily: 'inherit', minHeight: 108 }}
              />
            </FormRow>

            <FormRow label="사용여부">
              <Radio value={grpForm.useYn} onChange={(value) => setGroupField('useYn', value)} />
            </FormRow>
          </Box>

          <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${C.brd}`, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Button variant="outlined" onClick={() => setGrpPanel(false)}>
              취소
            </Button>
            <Button variant="contained" onClick={saveGroup}>
              {grpIsNew ? '등록' : '저장'}
            </Button>
          </Box>
        </Box>
      </SidePanel>

      <SidePanel open={codePanel} onClose={() => setCodePanel(false)} title={codeIsNew ? '코드 추가' : '코드 수정'} width={480} noScroll>
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
            {!codeIsNew && <PanelDeleteBtn onClick={() => setCodeDel(codeForm.id)} />}
            <SecTitle label="코드 정보" primary />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Box sx={{ flex: 1 }}>
                <FormRow label="코드값" required>
                  <FInput
                    value={codeForm.cd}
                    onChange={(event) => setCodeField('cd', event.target.value.toUpperCase().replace(/\s/g, ''))}
                    placeholder="예) HW"
                    maxLength={30}
                    readOnly={!codeIsNew}
                    style={{ ...fInput, ...(!codeIsNew ? readOnlyStyle : {}) }}
                  />
                  {errorText(codeErrors.cd)}
                </FormRow>
              </Box>

              <Box sx={{ width: { xs: '100%', sm: 96 } }}>
                <FormRow label="순서">
                  <FInput
                    type="number"
                    min={1}
                    value={codeForm.sort}
                    onChange={(event) => setCodeField('sort', parseInt(event.target.value, 10) || 1)}
                    style={fInput}
                  />
                </FormRow>
              </Box>
            </Stack>

            <FormRow label="코드명" required>
              <FInput value={codeForm.nm} onChange={(event) => setCodeField('nm', event.target.value)} placeholder="예) 하드웨어" maxLength={50} style={fInput} />
              {errorText(codeErrors.nm)}
            </FormRow>

            <FormRow label="설명">
              <FTextarea
                value={codeForm.desc}
                onChange={(event) => setCodeField('desc', event.target.value)}
                placeholder="코드에 대한 설명을 입력하세요."
                rows={4}
                maxLength={200}
                style={{ ...fInput, resize: 'none', fontFamily: 'inherit', minHeight: 108 }}
              />
            </FormRow>

            <FormRow label="사용여부">
              <Radio value={codeForm.useYn} onChange={(value) => setCodeField('useYn', value)} />
            </FormRow>
          </Box>

          <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${C.brd}`, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Button variant="outlined" onClick={() => setCodePanel(false)}>
              취소
            </Button>
            <Button variant="contained" onClick={saveCode}>
              {codeIsNew ? '등록' : '저장'}
            </Button>
          </Box>
        </Box>
      </SidePanel>

      <Dialog open={showUpload} onClose={() => setShowUpload(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>엑셀 업로드</DialogTitle>
        <DialogContent sx={{ pb: 2.5 }}>
          <Typography sx={{ fontSize: 13, color: C.txS }}>
            그룹 ID, 코드값, 코드명, 설명, 정렬순서, 사용여부 순서로 작성된 엑셀 파일을 업로드하면 공통코드를 일괄 등록할 수 있습니다.
          </Typography>
          <Paper
            elevation={0}
            sx={{
              mt: 2.5,
              border: `2px dashed ${C.brd}`,
              borderRadius: 2,
              bgcolor: '#F8FAFC',
              px: 2,
              py: 4.5,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontSize: 28, lineHeight: 1 }}>📂</Typography>
            <Typography sx={{ mt: 1, fontSize: 13, fontWeight: 600, color: C.txH }}>파일을 드래그하거나 클릭하여 선택</Typography>
            <Typography sx={{ mt: 0.5, fontSize: 12, color: C.txL }}>지원 형식: .xlsx, .xls, .csv</Typography>
          </Paper>
          <Divider sx={{ my: 2.5 }} />
          <Typography sx={{ fontSize: 12, color: C.txS }}>
            동일한 그룹 ID와 코드값이 존재하면 업로드 데이터로 덮어씁니다. 등록 전에 반드시 양식을 확인하세요.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowUpload(false)}>취소</Button>
          <Button variant="outlined" startIcon={<DownloadOutlinedIcon />}>
            양식 다운로드
          </Button>
          <Button variant="contained" startIcon={<CloudUploadOutlinedIcon />} onClick={() => setShowUpload(false)}>
            업로드
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmModal
        open={!!grpDel}
        title="그룹 삭제"
        msg={
          <>
            하위 코드 <strong>{(codes[grpDel || ''] || []).length}개</strong>가 함께 삭제됩니다. 삭제 후 복구할 수 없습니다. 계속하시겠습니까?
          </>
        }
        okLabel="삭제"
        onOk={() => grpDel && deleteGroup(grpDel)}
        onCancel={() => setGrpDel(null)}
      />

      <ConfirmModal
        open={!!codeDel}
        title="코드 삭제"
        msg="삭제된 코드는 복구할 수 없습니다. 계속하시겠습니까?"
        okLabel="삭제"
        onOk={() => codeDel && deleteCode(codeDel)}
        onCancel={() => setCodeDel(null)}
      />
    </Box>
  );
};

export default function ManagerSettingsCommonCodePage() {
  return <CommonCodeScreen />;
}
