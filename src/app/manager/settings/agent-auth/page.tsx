// @ts-nocheck
'use client';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { Badge, YnBadge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FormRow, PanelDeleteBtn, SecTitle } from '@/components/ui/FormRow';
import { FInput, FSelect } from '@/components/ui/Input';
import { PH } from '@/components/ui/PageHeader';
import { Radio } from '@/components/ui/Radio';
import { SidePanel } from '@/components/ui/SidePanel';
import { Tbl } from '@/components/ui/Table';
import { RES } from '@/data/resources';
import { _mids, _sIds, _sysMap } from '@/data/systems';
import { C } from '@/lib/theme/colors';
import { fInput } from '@/lib/theme/styles';

const AGENT_TYPES = [
  { cd: 'SSH', nm: 'SSH Agent', icon: 'SSH', desc: 'SSH 프로토콜 기반', forMid: ['서버', 'WAS'] },
  { cd: 'SNMP', nm: 'SNMP Agent', icon: 'SNMP', desc: 'SNMP 프로토콜 기반', forMid: ['네트워크', '보안', '스토리지'] },
  { cd: 'WEB', nm: 'Web Agent', icon: 'WEB', desc: 'HTTP/HTTPS 기반', forMid: ['WEB', 'WAS', '서비스'] },
  { cd: 'DB', nm: 'DB Agent', icon: 'DB', desc: '데이터베이스 접속 기반', forMid: ['DBMS'] },
  { cd: 'LOCAL', nm: 'Local Agent', icon: 'LOCAL', desc: '로컬 설치형', forMid: ['서버', '백업', '스토리지', '유효성'] },
];

const INIT_AUTH = (() => {
  const data = {};
  const sample = RES.slice(0, 36);

  sample.forEach((resource, index) => {
    const forTypes = AGENT_TYPES.filter((agent) => agent.forMid.includes(resource.mid));
    if (!forTypes.length) return;

    data[resource.id] = forTypes.map((agent, agentIndex) => ({
      id: `${resource.id}_${agent.cd}`,
      resId: resource.id,
      agentType: agent.cd,
      host: resource.ip,
      port: agent.cd === 'SSH' ? 22 : agent.cd === 'SNMP' ? 161 : agent.cd === 'WEB' ? 8080 : agent.cd === 'DB' ? 3306 : 0,
      authId: ['SSH', 'DB', 'LOCAL'].includes(agent.cd) ? `svc_${resource.nm.toLowerCase().replace(/-/g, '_')}` : '',
      authPw: ['SSH', 'DB', 'LOCAL'].includes(agent.cd) ? '●●●●●●●●' : '',
      snmpVer: agent.cd === 'SNMP' ? 'v2c' : '',
      community: agent.cd === 'SNMP' ? 'public' : '',
      timeout: 10,
      retryCount: 3,
      useYn: (index + agentIndex) % 7 === 0 ? 'N' : 'Y',
      testResult: (index + agentIndex) % 5 === 0 ? '실패' : (index + agentIndex) % 3 === 0 ? '미확인' : '성공',
      testDt: (index + agentIndex) % 3 === 0 ? '' : `2026-02-${String(22 + (index % 3)).padStart(2, '0')} ${String(9 + agentIndex).padStart(2, '0')}:${String((index * 3) % 60).padStart(2, '0')}`,
      regDt: '2026-01-10',
    }));
  });

  return data;
})();

const SYS_LIST = [{ id: '전체', nm: '전체' }, ..._sIds.map((id) => ({ id, nm: _sysMap[id] }))];
const MID_LIST = ['전체', ..._mids];
const PAGE_SIZE = 15;

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

const getAgentMeta = (agentType: string) => AGENT_TYPES.find((agent) => agent.cd === agentType);

const AgentAuthScreen = () => {
  const [authMap, setAuthMap] = useState(INIT_AUTH);
  const [selRes, setSelRes] = useState(null);
  const [selSys, setSelSys] = useState('전체');
  const [selMid, setSelMid] = useState('전체');
  const [resQ, setResQ] = useState('');
  const [agentQ, setAgentQ] = useState('');
  const [resPage, setResPage] = useState(1);
  const [agentPicker, setAgentPicker] = useState('');

  const [panel, setPanel] = useState(false);
  const [panelForm, setPanelForm] = useState(null);
  const [panelIsNew, setPanelIsNew] = useState(false);
  const [panelErr, setPanelErr] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  const [delTarget, setDelTarget] = useState<string | null>(null);

  const filteredRes = RES.filter((resource) => {
    if (resource.st === '미사용') return false;
    if (selSys !== '전체' && resource.sysId !== selSys) return false;
    if (selMid !== '전체' && resource.mid !== selMid) return false;
    if (resQ && !resource.nm.toLowerCase().includes(resQ.toLowerCase()) && !resource.ip.includes(resQ)) return false;
    return true;
  });

  const totalResPages = Math.max(1, Math.ceil(filteredRes.length / PAGE_SIZE));
  const pagedRes = filteredRes.slice((resPage - 1) * PAGE_SIZE, resPage * PAGE_SIZE);
  const curAuth = selRes ? authMap[selRes.id] || [] : [];
  const filteredAuth = curAuth.filter((auth) => {
    if (!agentQ) return true;
    const meta = getAgentMeta(auth.agentType);
    const q = agentQ.toLowerCase();
    return auth.host.toLowerCase().includes(q) || auth.authId.toLowerCase().includes(q) || auth.agentType.toLowerCase().includes(q) || meta?.nm.toLowerCase().includes(q);
  });
  const availableAgents = selRes ? AGENT_TYPES.filter((agent) => !curAuth.some((item) => item.agentType === agent.cd)) : [];

  useEffect(() => {
    if (resPage > totalResPages) setResPage(totalResPages);
  }, [resPage, totalResPages]);

  const isRecommended = (agentCd: string) => {
    if (!selRes) return false;
    return getAgentMeta(agentCd)?.forMid.includes(selRes.mid) || false;
  };

  const setPanelField = (key: string, value: string | number) => setPanelForm((prev) => ({ ...prev, [key]: value }));

  const openPanel = (auth?: Record<string, unknown> | null, isNew = false, agentType?: string) => {
    if (!selRes) return;

    if (isNew) {
      const meta = getAgentMeta(agentType) || AGENT_TYPES[0];
      setPanelForm({
        id: `${selRes.id}_${meta.cd}_${Date.now()}`,
        resId: selRes.id,
        agentType: meta.cd,
        host: selRes.ip,
        port: meta.cd === 'SSH' ? 22 : meta.cd === 'SNMP' ? 161 : meta.cd === 'WEB' ? 8080 : meta.cd === 'DB' ? 3306 : 0,
        authId: '',
        authPw: '',
        snmpVer: 'v2c',
        community: 'public',
        timeout: 10,
        retryCount: 3,
        useYn: 'Y',
        testResult: '미확인',
        testDt: '',
        regDt: '2026-02-24',
      });
    } else {
      setPanelForm({ ...auth });
    }

    setPanelIsNew(isNew);
    setPanelErr({});
    setShowPw(false);
    setPanel(true);
  };

  const saveAuth = () => {
    if (!selRes || !panelForm) return;

    const nextErrors: Record<string, string> = {};
    if (!panelForm.host.trim()) nextErrors.host = '호스트(IP)를 입력하세요.';
    if (['SSH', 'DB', 'LOCAL'].includes(panelForm.agentType) && !panelForm.authId.trim()) nextErrors.authId = '접속 ID를 입력하세요.';

    setPanelErr(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const current = authMap[selRes.id] || [];
    if (panelIsNew) {
      setAuthMap((prev) => ({ ...prev, [selRes.id]: [...current, panelForm] }));
    } else {
      setAuthMap((prev) => ({
        ...prev,
        [selRes.id]: current.map((item) => (item.id === panelForm.id ? { ...item, ...panelForm } : item)),
      }));
    }

    setAgentPicker('');
    setPanel(false);
  };

  const deleteAuth = (id: string) => {
    if (!selRes) return;
    setAuthMap((prev) => ({
      ...prev,
      [selRes.id]: (prev[selRes.id] || []).filter((auth) => auth.id !== id),
    }));
    setDelTarget(null);
    setPanel(false);
  };

  const handleTest = () => {
    setTestLoading(true);
    setTimeout(() => {
      const ok = Math.random() > 0.3;
      setPanelForm((prev) => ({
        ...prev,
        testResult: ok ? '성공' : '실패',
        testDt: `2026-02-24 ${new Date().toTimeString().slice(0, 8)}`,
      }));
      setTestLoading(false);
    }, 1200);
  };

  const renderAuthFields = () => {
    if (!panelForm) return null;

    return (
      <>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Box sx={{ flex: 1 }}>
            <FormRow label="호스트 (IP)" required>
              <FInput value={panelForm.host} onChange={(event) => setPanelField('host', event.target.value)} placeholder="예) 10.100.1.1" style={fInput} />
              {errorText(panelErr.host)}
            </FormRow>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: 96 } }}>
            <FormRow label="포트">
              <FInput type="number" value={panelForm.port} onChange={(event) => setPanelField('port', parseInt(event.target.value, 10) || 0)} style={fInput} />
            </FormRow>
          </Box>
        </Stack>

        {['SSH', 'DB', 'LOCAL'].includes(panelForm.agentType) && (
          <>
            <FormRow label="접속 ID" required>
              <FInput value={panelForm.authId} onChange={(event) => setPanelField('authId', event.target.value)} placeholder="접속 계정 ID" style={fInput} />
              {errorText(panelErr.authId)}
            </FormRow>

            <FormRow label="접속 PW">
              <Box sx={{ position: 'relative' }}>
                <FInput
                  type={showPw ? 'text' : 'password'}
                  value={panelForm.authPw}
                  onChange={(event) => setPanelField('authPw', event.target.value)}
                  placeholder="접속 비밀번호"
                  style={{ ...fInput, paddingRight: 44 }}
                />
                <IconButton
                  size="small"
                  onClick={() => setShowPw((prev) => !prev)}
                  sx={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', color: C.txL }}
                >
                  {showPw ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                </IconButton>
              </Box>
            </FormRow>
          </>
        )}

        {panelForm.agentType === 'SNMP' && (
          <>
            <FormRow label="SNMP 버전">
              <FSelect value={panelForm.snmpVer} onChange={(event) => setPanelField('snmpVer', event.target.value)} style={fInput}>
                {['v1', 'v2c', 'v3'].map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </FSelect>
            </FormRow>

            <FormRow label="Community">
              <FInput value={panelForm.community} onChange={(event) => setPanelField('community', event.target.value)} placeholder="예) public" style={fInput} />
            </FormRow>
          </>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Box sx={{ flex: 1 }}>
            <FormRow label="타임아웃 (초)">
              <FInput type="number" min={1} max={120} value={panelForm.timeout} onChange={(event) => setPanelField('timeout', parseInt(event.target.value, 10) || 10)} style={fInput} />
            </FormRow>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormRow label="재시도 횟수">
              <FInput type="number" min={0} max={10} value={panelForm.retryCount} onChange={(event) => setPanelField('retryCount', parseInt(event.target.value, 10) || 0)} style={fInput} />
            </FormRow>
          </Box>
        </Stack>

        <FormRow label="사용 여부">
          <Radio value={panelForm.useYn} onChange={(value) => setPanelField('useYn', value)} />
        </FormRow>
      </>
    );
  };

  return (
    <Box>
      <PH title="AGENT 권한관리" bc="홈 > 보안 및 개발 > AGENT 권한관리" />

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
            display: 'flex',
            flexDirection: 'column',
            position: { lg: 'sticky' },
            top: { lg: 0 },
            maxHeight: { lg: 'calc(100vh - 170px)' },
          }}
        >
          <Box sx={{ px: 2, py: 1.75, borderBottom: `1px solid ${C.brd}` }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: C.txH }}>자원 선택</Typography>
          </Box>

          <Stack spacing={1.25} sx={{ px: 1.5, py: 1.5, borderBottom: `1px solid ${C.brd}` }}>
            <FormControl size="small" fullWidth>
              <Select
                value={selSys}
                onChange={(event) => {
                  setSelSys(event.target.value);
                  setResPage(1);
                  setSelRes(null);
                }}
                sx={{ fontSize: 13, bgcolor: '#fff' }}
              >
                {SYS_LIST.map((system) => (
                  <MenuItem key={system.id} value={system.id}>
                    {system.nm}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ToggleButtonGroup
              size="small"
              exclusive
              value={selMid}
              onChange={(_event, value) => {
                if (!value) return;
                setSelMid(value);
                setResPage(1);
                setSelRes(null);
              }}
              sx={{
                flexWrap: 'wrap',
                gap: 0.75,
                '& .MuiToggleButton-root': {
                  borderRadius: 1.25,
                  border: `1px solid ${C.brd}`,
                  px: 1.25,
                  py: 0.5,
                  fontSize: 12,
                  color: C.txS,
                },
                '& .Mui-selected': {
                  bgcolor: C.priL,
                  color: C.pri,
                  borderColor: '#b8d0ff',
                },
              }}
            >
              {MID_LIST.map((mid) => (
                <ToggleButton key={mid} value={mid}>
                  {mid}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <OutlinedInput
              fullWidth
              size="small"
              value={resQ}
              onChange={(event) => {
                setResQ(event.target.value);
                setResPage(1);
              }}
              placeholder="자원명 또는 IP 검색"
              startAdornment={
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 18, color: C.txL }} />
                </InputAdornment>
              }
              sx={searchInputSx}
            />
          </Stack>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
            {pagedRes.length === 0 ? (
              <Stack sx={{ py: 6 }} alignItems="center" spacing={0.75}>
                <Typography sx={{ fontSize: 13, color: C.txL }}>조건에 맞는 자원이 없습니다.</Typography>
              </Stack>
            ) : (
              pagedRes.map((resource) => {
                const selected = selRes?.id === resource.id;
                const authList = authMap[resource.id] || [];
                const hasAny = authList.length > 0;
                const hasFail = authList.some((auth) => auth.testResult === '실패');
                const allOk = hasAny && authList.every((auth) => auth.testResult === '성공' && auth.useYn === 'Y');
                const dotColor = !hasAny ? '#D9DDE3' : hasFail ? C.red : allOk ? C.green : '#F59E0B';

                return (
                  <Paper
                    key={resource.id}
                    elevation={0}
                    sx={{
                      mb: 1,
                      border: `1px solid ${selected ? '#c9dcff' : C.brd}`,
                      borderRadius: 1.5,
                      bgcolor: selected ? C.priL : '#fff',
                      overflow: 'hidden',
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ px: 1.5, py: 1.25, cursor: 'pointer' }}
                      onClick={() => {
                        setSelRes(resource);
                        setPanel(false);
                      }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: dotColor, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: 14, fontWeight: 700, color: selected ? C.pri : C.txH }} noWrap>
                            {resource.nm}
                          </Typography>
                        </Stack>
                        <Typography sx={{ mt: 0.5, fontSize: 12, color: C.txL }}>
                          {resource.mid} · {resource.sysNm}
                        </Typography>
                        <Typography sx={{ mt: 0.125, fontSize: 12, color: C.txS }}>{resource.ip}</Typography>
                      </Box>

                      <Stack alignItems="center" spacing={0.75} sx={{ flexShrink: 0 }}>
                        <Chip label={authList.length} size="small" sx={{ height: 22, bgcolor: '#F8FAFC', color: C.txS }} />
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelRes(resource);
                          }}
                          sx={{ border: `1px solid ${C.brd}`, borderRadius: 1, color: C.txL }}
                        >
                          <MoreVertOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })
            )}
          </Box>

          {totalResPages > 1 && (
            <Box sx={{ px: 1.5, py: 1.25, borderTop: `1px solid ${C.brd}`, display: 'flex', justifyContent: 'center' }}>
              <Pagination count={totalResPages} page={resPage} size="small" color="primary" onChange={(_event, value) => setResPage(value)} />
            </Box>
          )}
        </Paper>

        <Paper elevation={0} sx={{ border: `1px solid ${C.brd}`, borderRadius: 2, overflow: 'hidden' }}>
          {!selRes ? (
            <Stack sx={{ minHeight: 520, px: 3, py: 8 }} alignItems="center" justifyContent="center" spacing={1}>
              <Typography sx={{ fontSize: 38, lineHeight: 1 }}>🔐</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: C.txH }}>자원을 선택하세요</Typography>
              <Typography sx={{ fontSize: 13, color: C.txL }}>왼쪽에서 자원을 선택하면 에이전트 접속 권한과 연결 테스트 상태를 관리할 수 있습니다.</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: C.txH }}>{selRes.nm}</Typography>
                    <Chip label={selRes.mid} size="small" sx={{ bgcolor: C.priL, color: C.pri }} />
                    <Chip label={selRes.sysNm} size="small" sx={{ bgcolor: '#F8FAFC', color: C.txS }} />
                  </Stack>
                  <Typography sx={{ mt: 0.75, fontSize: 13, color: C.txS }}>
                    {selRes.ip} · 사용 중인 에이전트 {curAuth.length}개
                  </Typography>
                </Box>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <Select
                    displayEmpty
                    value={agentPicker}
                    onChange={(event) => {
                      const value = event.target.value;
                      setAgentPicker(value);
                      if (value) openPanel(null, true, value);
                    }}
                    renderValue={(value) => (value ? getAgentMeta(value)?.nm : '+ 에이전트 추가')}
                  >
                    <MenuItem disabled value="">
                      + 에이전트 추가
                    </MenuItem>
                    {availableAgents.map((agent) => (
                      <MenuItem key={agent.cd} value={agent.cd}>
                        {agent.icon} {agent.nm}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  value={agentQ}
                  onChange={(event) => setAgentQ(event.target.value)}
                  placeholder="에이전트, 호스트, 접속 ID 검색"
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ fontSize: 18, color: C.txL }} />
                    </InputAdornment>
                  }
                  sx={{ maxWidth: 360, ...searchInputSx }}
                />
                <Typography sx={{ fontSize: 13, color: C.txS }}>총 {filteredAuth.length}건</Typography>
              </Stack>

              <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Tbl
                  noPaging
                  data={filteredAuth}
                  onRow={(row) => openPanel(row, false)}
                  cols={[
                    {
                      t: '에이전트',
                      k: 'agentType',
                      mw: 150,
                      r: (value) => {
                        const meta = getAgentMeta(value);
                        return <Badge status={value} label={meta ? `${meta.icon} ${meta.nm}` : value} />;
                      },
                    },
                    { t: '호스트', k: 'host', mw: 160, r: (value) => <Typography sx={{ fontSize: 13 }}>{value}</Typography> },
                    { t: '포트', k: 'port', w: 90 },
                    {
                      t: '접속 정보',
                      k: 'id',
                      align: 'left',
                      mw: 180,
                      r: (_value, row) => {
                        const info = row.agentType === 'SNMP' ? `${row.snmpVer} / ${row.community}` : row.authId || '—';
                        return <Typography sx={{ fontSize: 13, color: C.txS }}>{info}</Typography>;
                      },
                    },
                    { t: '타임아웃', k: 'timeout', w: 90, r: (value) => `${value}초` },
                    {
                      t: '연결 테스트',
                      k: 'testResult',
                      mw: 140,
                      r: (value, row) => (
                        <Stack spacing={0.5} alignItems="center">
                          <Badge status={value || '미확인'} />
                          {row.testDt && <Typography sx={{ fontSize: 12, color: C.txL }}>{row.testDt}</Typography>}
                        </Stack>
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

      <SidePanel open={panel} onClose={() => setPanel(false)} title={panelIsNew ? '에이전트 접속 설정 추가' : '에이전트 접속 설정 수정'} width={480} noScroll>
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
            {panelForm && (
              <>
                {!panelIsNew && <PanelDeleteBtn onClick={() => setDelTarget(panelForm.id)} />}

                <SecTitle label="에이전트 정보" primary />
                <Paper elevation={0} sx={{ mb: 2, border: `1px solid ${C.brd}`, borderRadius: 2, bgcolor: '#F8FAFC', px: 2, py: 1.5 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                      <Badge status={panelForm.agentType} label={`${getAgentMeta(panelForm.agentType)?.icon} ${getAgentMeta(panelForm.agentType)?.nm}`} />
                      {isRecommended(panelForm.agentType) && <Chip label="권장 에이전트" size="small" sx={{ bgcolor: '#E8F5EC', color: C.green }} />}
                    </Stack>
                    <Typography sx={{ fontSize: 13, color: C.txS }}>{getAgentMeta(panelForm.agentType)?.desc}</Typography>
                  </Stack>
                </Paper>

                <SecTitle label="접속 정보" primary />
                {renderAuthFields()}

                <Paper elevation={0} sx={{ mt: 1, border: `1px solid ${C.brd}`, borderRadius: 2, bgcolor: '#F8FAFC', px: 2, py: 1.75 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.txH }}>연결 테스트</Typography>
                        <Badge status={panelForm.testResult || '미확인'} />
                      </Stack>
                      {panelForm.testDt && <Typography sx={{ mt: 0.75, fontSize: 12, color: C.txL }}>마지막 테스트: {panelForm.testDt}</Typography>}
                    </Box>

                    <Button variant="outlined" onClick={handleTest} disabled={testLoading} startIcon={testLoading ? <CircularProgress size={14} /> : null}>
                      {testLoading ? '테스트 중...' : '연결 테스트'}
                    </Button>
                  </Stack>
                </Paper>
              </>
            )}
          </Box>

          <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${C.brd}`, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Button variant="outlined" onClick={() => setPanel(false)}>
              취소
            </Button>
            <Button variant="contained" onClick={saveAuth}>
              {panelIsNew ? '등록' : '저장'}
            </Button>
          </Box>
        </Box>
      </SidePanel>

      <ConfirmModal
        open={!!delTarget}
        title="에이전트 설정 삭제"
        msg="선택한 에이전트 접속 설정을 삭제합니다. 계속하시겠습니까?"
        okLabel="삭제"
        onOk={() => delTarget && deleteAuth(delTarget)}
        onCancel={() => setDelTarget(null)}
      />
    </Box>
  );
};

export default function ManagerSettingsAgentAuthPage() {
  return <AgentAuthScreen />;
}
