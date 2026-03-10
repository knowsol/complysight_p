// @ts-nocheck
'use client';

import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';

import { DatePicker } from '@/components/ui/DatePicker';
import { PH } from '@/components/ui/PageHeader';
import { SidePanel } from '@/components/ui/SidePanel';
import { RES } from '@/data/resources';
import { SYS } from '@/data/manager';
import { USERS } from '@/data/users';
import { C } from '@/lib/theme/colors';

const FREQ_OPTS = ['전체', '상시', '매일', '매주', '매월', '분기', '반기', '연간'];
const FREQ_COLOR = {
  전체: '#555E6C',
  상시: '#0891B2',
  매일: '#0C8CE9',
  매주: '#19973C',
  매월: '#F36D00',
  분기: '#7C3AED',
  반기: '#E24949',
  연간: '#333333',
};
const RES_COLS = ['서버', 'WEB', 'WAS', 'DBMS', '네트워크', '보안', '스토리지', '백업'];

const filterLabelSx = { fontSize: 12, fontWeight: 700, color: C.txS };
const headCellSx = { fontSize: 13, fontWeight: 700, color: C.txS, bgcolor: '#F8FAFC', whiteSpace: 'nowrap' };

const rateColor = (rate: number) => (rate === 100 ? '#19973C' : rate >= 80 ? '#0C8CE9' : rate >= 50 ? '#F36D00' : rate >= 1 ? '#E24949' : '#7C3AED');
const rateBg = (rate: number) => (rate === 100 ? '#E8F5EC' : rate >= 80 ? '#E6F3FA' : rate >= 50 ? '#FFF3E6' : rate >= 1 ? '#FDE8E8' : '#EDE9FE');

const ReportViewScreen = () => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [baseDate, setBaseDate] = useState(todayStr);
  const [freq, setFreq] = useState('전체');
  const [applied, setApplied] = useState({ baseDate: todayStr, freq: '전체' });
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [panelInfo, setPanelInfo] = useState(null);
  const [toastMsg, setToastMsg] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToastMsg({ msg, ok });
  };

  const rows = useMemo(
    () =>
      SYS.map((sys) => {
        const cells = {};
        const sysIdx = SYS.findIndex((item) => item.id === sys.id);

        RES_COLS.forEach((col, colIndex) => {
          const resources = RES.filter((resource) => resource.sysId === sys.id && resource.mid === col);
          if (!resources.length) {
            cells[col] = null;
            return;
          }

          const forceZero = (sysIdx * 3 + colIndex) % 7 === 0;
          const reported = forceZero ? 0 : resources.filter((resource, index) => (resource.id * 13 + index * 7) % 100 < 74).length;
          const hasReport = reported > 0;
          const detail = resources.map((resource, index) => {
            const isReported = !forceZero && (resource.id * 13 + index * 7) % 100 < 74;
            const normalCnt = isReported ? Math.floor((resource.id * 7 + index * 3) % 10 + 3) : 0;
            const abnCnt = isReported ? Math.floor((resource.id * 3 + index * 11) % 4) : 0;
            const freqList = ['상시', '매일', '매주', '매월', '분기', '반기', '연간'];
            const resFreq = freqList[(resource.id + colIndex) % freqList.length];

            return {
              ...resource,
              reported: isReported,
              inspDt: isReported ? `2026-02-${String(((resource.id * 3 + index) % 11) + 1).padStart(2, '0')}` : null,
              reportDt: isReported ? `2026-02-${String(((resource.id * 3 + index) % 11) + 2).padStart(2, '0')}` : null,
              inspector: USERS[(resource.id + index) % USERS.length]?.userNm || '—',
              reportNm: `${col} 상태점검표`,
              normalCnt,
              abnCnt,
              resFreq,
            };
          });

          cells[col] = {
            total: resources.length,
            reported,
            rate: Math.round((reported / resources.length) * 100),
            hasReport,
            resDetail: detail,
          };
        });

        const totalAll = RES_COLS.reduce((sum, col) => sum + (cells[col] ? cells[col].total : 0), 0);
        const reportedAll = RES_COLS.reduce((sum, col) => sum + (cells[col] ? cells[col].reported : 0), 0);
        const overall = totalAll > 0 ? Math.round((reportedAll / totalAll) * 100) : 0;

        return { sys, cells, overall, totalAll, reportedAll };
      }),
    [],
  );

  const filteredRows = useMemo(() => {
    if (applied.freq === '전체') return rows;

    return rows.map((row) => {
      const cells = {};

      Object.entries(row.cells).forEach(([col, cell]) => {
        if (!cell) {
          cells[col] = null;
          return;
        }

        const filtered = cell.resDetail.filter((resource) => resource.resFreq === applied.freq);
        if (!filtered.length) {
          cells[col] = null;
          return;
        }

        const reported = filtered.filter((resource) => resource.reported).length;
        cells[col] = {
          ...cell,
          total: filtered.length,
          reported,
          rate: Math.round((reported / filtered.length) * 100),
          resDetail: filtered,
        };
      });

      const totalAll = RES_COLS.reduce((sum, col) => sum + (cells[col] ? cells[col].total : 0), 0);
      const reportedAll = RES_COLS.reduce((sum, col) => sum + (cells[col] ? cells[col].reported : 0), 0);
      const overall = totalAll > 0 ? Math.round((reportedAll / totalAll) * 100) : 0;

      return { ...row, cells, totalAll, reportedAll, overall };
    });
  }, [applied.freq, rows]);

  const totalRow = useMemo(() => {
    const cells = {};

    RES_COLS.forEach((col) => {
      const allCells = filteredRows.map((row) => row.cells[col]).filter(Boolean);
      if (!allCells.length) {
        cells[col] = null;
        return;
      }

      const total = allCells.reduce((sum, cell) => sum + cell.total, 0);
      const reported = allCells.reduce((sum, cell) => sum + cell.reported, 0);
      const detail = filteredRows.flatMap((row) => row.cells[col]?.resDetail || []);
      cells[col] = {
        total,
        reported,
        rate: Math.round((reported / total) * 100),
        hasReport: reported > 0,
        resDetail: detail,
      };
    });

    const totalAll = filteredRows.reduce((sum, row) => sum + row.totalAll, 0);
    const reportedAll = filteredRows.reduce((sum, row) => sum + row.reportedAll, 0);
    const overall = totalAll > 0 ? Math.round((reportedAll / totalAll) * 100) : 0;

    return { cells, totalAll, reportedAll, overall };
  }, [filteredRows]);

  const allIds = SYS.map((sys) => sys.id);
  const selectedIds = allIds.filter((id) => checked[id]);
  const allChecked = selectedIds.length > 0 && selectedIds.length === allIds.length;

  const toggleAll = () => {
    setChecked(allChecked ? {} : Object.fromEntries(allIds.map((id) => [id, true])));
  };

  const toggleOne = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const dlSingle = (sysNm: string, col?: string) => {
    showToast(`${sysNm}${col ? ` · ${col}` : ''} 점검보고서 다운로드가 시작되었습니다.`);
  };

  const dlBulk = () => {
    if (!selectedIds.length) {
      showToast('다운로드할 정보시스템을 선택하세요.', false);
      return;
    }
    showToast(`${selectedIds.length}개 점검보고서 일괄 다운로드가 시작되었습니다.`);
  };

  const search = () => {
    setApplied({ baseDate, freq });
    setChecked({});
  };

  const reset = () => {
    const resetDate = new Date().toISOString().slice(0, 10);
    setBaseDate(resetDate);
    setFreq('전체');
    setApplied({ baseDate: resetDate, freq: '전체' });
    setChecked({});
  };

  const openPanel = (sys, col, cell) => {
    if (!cell) return;
    setPanelInfo({ sysNm: sys.nm, sysType: sys.type, org: sys.org, col, cell });
  };

  const detailCellSx = (align = 'center') => ({
    fontSize: 12,
    color: C.txt,
    textAlign: align,
    borderBottom: `1px solid ${C.brd}`,
    whiteSpace: 'nowrap',
  });

  return (
    <Box>
      <PH title="점검보고서" bc="홈 > 점검현황 > 점검보고서" />

      <Paper elevation={0} sx={{ border: `1px solid ${C.brd}`, borderRadius: 2, p: 2 }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ xs: 'stretch', lg: 'center' }} justifyContent="space-between">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Box>
              <Typography sx={filterLabelSx}>기준일</Typography>
              <Box sx={{ mt: 0.75 }}>
                <DatePicker value={baseDate} onChange={setBaseDate} style={{ width: 140 }} />
              </Box>
            </Box>

            <Box>
              <Typography sx={filterLabelSx}>보고주기</Typography>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={freq}
                onChange={(_event, value) => value && setFreq(value)}
                sx={{
                  mt: 0.75,
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
                }}
              >
                {FREQ_OPTS.map((option) => (
                  <ToggleButton
                    key={option}
                    value={option}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: `${FREQ_COLOR[option]}1A`,
                        color: FREQ_COLOR[option],
                        borderColor: FREQ_COLOR[option],
                      },
                    }}
                  >
                    {option}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={reset}>
              초기화
            </Button>
            <Button variant="contained" onClick={search} startIcon={<SearchRoundedIcon />}>
              조회
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 1.5,
          border: '1px solid #C7D9F8',
          bgcolor: '#F0F5FF',
          borderRadius: 2,
          px: 2,
          py: 1.25,
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <InfoOutlinedIcon sx={{ fontSize: 18, color: '#4C7EF3' }} />
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#2D5BB9' }}>보고된 자원수 / 전체 자원수</Typography>
          </Stack>
          <Typography sx={{ fontSize: 12, color: '#2D5BB9' }}>셀 클릭 시 자원별 보고서 상세를 확인할 수 있습니다.</Typography>
          <Typography sx={{ fontSize: 12, color: '#2D5BB9' }}>PDF 버튼으로 분류별 개별 다운로드가 가능합니다.</Typography>
        </Stack>
      </Paper>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" sx={{ mt: 2, mb: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="baseline">
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: C.txH }}>점검보고서 목록</Typography>
          <Typography sx={{ fontSize: 12, color: C.txL }}>{filteredRows.length}건</Typography>
          <Typography sx={{ fontSize: 12, color: C.txL }}>기준일 {applied.baseDate}</Typography>
        </Stack>

        <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={dlBulk}>
          선택 항목 다운로드
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: `1px solid ${C.brd}`, borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 1240 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={headCellSx}>
                  <Checkbox checked={allChecked} indeterminate={selectedIds.length > 0 && !allChecked} onChange={toggleAll} size="small" />
                </TableCell>
                <TableCell sx={{ ...headCellSx, minWidth: 180 }}>정보시스템</TableCell>
                <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 90 }}>종합</TableCell>
                {RES_COLS.map((col) => (
                  <TableCell key={col} sx={{ ...headCellSx, textAlign: 'center', minWidth: 104 }}>
                    {col}
                  </TableCell>
                ))}
                <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 110 }}>다운로드</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ bgcolor: '#F0F5FF' }}>
                <TableCell padding="checkbox" />
                <TableCell sx={{ borderBottom: `2px solid ${C.brd}`, whiteSpace: 'nowrap' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.pri }}>전체 자원</Typography>
                  <Typography sx={{ mt: 0.25, fontSize: 12, color: C.txL }}>전체 {SYS.length}개 정보시스템</Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: `2px solid ${C.brd}`, textAlign: 'center' }}>
                  <Chip
                    label={`${totalRow.reportedAll}/${totalRow.totalAll}`}
                    size="small"
                    sx={{ bgcolor: rateBg(totalRow.overall), color: rateColor(totalRow.overall), fontWeight: 700 }}
                  />
                </TableCell>
                {RES_COLS.map((col) => {
                  const cell = totalRow.cells[col];
                  if (!cell) {
                    return (
                      <TableCell key={col} sx={{ borderBottom: `2px solid ${C.brd}`, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: 12, color: C.txL }}>—</Typography>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={col}
                      onClick={() => openPanel({ nm: '전체 자원', type: '전체', org: `${SYS.length}개 시스템` }, col, cell)}
                      sx={{
                        borderBottom: `2px solid ${C.brd}`,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#D8E8FF' },
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: rateColor(cell.rate) }}>
                        {cell.reported}
                        <Box component="span" sx={{ ml: 0.25, fontWeight: 400, color: C.txL }}>
                          /{cell.total}
                        </Box>
                      </Typography>
                    </TableCell>
                  );
                })}
                <TableCell sx={{ borderBottom: `2px solid ${C.brd}`, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, color: C.txL }}>—</Typography>
                </TableCell>
              </TableRow>

              {filteredRows.map(({ sys, cells, overall, totalAll, reportedAll }) => {
                const isChecked = !!checked[sys.id];

                return (
                  <TableRow key={sys.id} sx={{ bgcolor: isChecked ? '#eef4ff' : '#fff', '&:hover': { bgcolor: '#F8FAFC' } }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isChecked}
                        onChange={() => toggleOne(sys.id)}
                        size="small"
                        onClick={(event) => event.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.txH }}>{sys.nm}</Typography>
                      <Typography sx={{ mt: 0.25, fontSize: 12, color: C.txL }}>
                        {sys.type} · {sys.org}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Chip label={`${reportedAll}/${totalAll}`} size="small" sx={{ bgcolor: rateBg(overall), color: rateColor(overall), fontWeight: 700 }} />
                    </TableCell>
                    {RES_COLS.map((col) => {
                      const cell = cells[col];
                      if (!cell) {
                        return (
                          <TableCell key={col} sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontSize: 12, color: C.txL }}>—</Typography>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={col}
                          onClick={() => openPanel(sys, col, cell)}
                          sx={{
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: '#EEF4FF' },
                          }}
                        >
                          <Stack spacing={0.5} alignItems="center">
                            <Typography sx={{ fontSize: 14, fontWeight: 700, color: rateColor(cell.rate) }}>
                              {cell.reported}
                              <Box component="span" sx={{ ml: 0.25, fontWeight: 400, color: C.txL }}>
                                /{cell.total}
                              </Box>
                            </Typography>
                            {cell.hasReport ? (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  dlSingle(sys.nm, col);
                                }}
                              >
                                PDF
                              </Button>
                            ) : (
                              <Typography sx={{ fontSize: 12, color: C.txL }}>미생성</Typography>
                            )}
                          </Stack>
                        </TableCell>
                      );
                    })}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadOutlinedIcon />}
                        onClick={(event) => {
                          event.stopPropagation();
                          dlSingle(sys.nm);
                        }}
                      >
                        전체
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {panelInfo && (() => {
        const { sysNm, org, col, cell } = panelInfo;
        const isTotal = sysNm === '전체 자원';
        const reported = cell.resDetail.filter((resource) => resource.reported);
        const notReported = cell.resDetail.filter((resource) => !resource.reported);
        const detailRows = [...reported, ...notReported];

        return (
          <SidePanel open={!!panelInfo} onClose={() => setPanelInfo(null)} title={`${col} 보고서 상세`} width={720} noScroll>
            <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
              <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1.25, mb: 2 }}>
                  <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: C.priL, px: 2, py: 1.75, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 22, fontWeight: 700, color: C.pri }}>{cell.reported}</Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 12, color: C.txS }}>보고 완료</Typography>
                  </Paper>
                  <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: '#FEF2F2', px: 2, py: 1.75, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 22, fontWeight: 700, color: C.red }}>{cell.total - cell.reported}</Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 12, color: C.txS }}>미보고</Typography>
                  </Paper>
                  <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: rateBg(cell.rate), px: 2, py: 1.75, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 22, fontWeight: 700, color: rateColor(cell.rate) }}>{cell.rate}%</Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 12, color: C.txS }}>보고율</Typography>
                  </Paper>
                </Box>

                <Typography sx={{ mb: 1.75, fontSize: 13, color: C.txS }}>
                  <Box component="span" sx={{ fontWeight: 700, color: isTotal ? C.pri : C.txH }}>
                    {sysNm}
                  </Box>
                  {' · '}
                  {col}
                  {' · '}
                  {org}
                  {' · '}
                  기준일 {applied.baseDate}
                </Typography>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" sx={{ mb: 1.25 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: C.txH }}>자원 목록</Typography>
                  {cell.hasReport && (
                    <Button variant="contained" startIcon={<DownloadOutlinedIcon />} onClick={() => dlSingle(sysNm, col)}>
                      전체 PDF 다운로드
                    </Button>
                  )}
                </Stack>

                <Paper elevation={0} sx={{ border: `1px solid ${C.brd}`, borderRadius: 2, overflow: 'hidden' }}>
                  <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small" sx={{ minWidth: 860 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ ...headCellSx, minWidth: 180 }}>자원명</TableCell>
                          <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 96 }}>보고주기</TableCell>
                          <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 96 }}>점검일자</TableCell>
                          <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 116 }}>제출일</TableCell>
                          <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 96 }}>점검자</TableCell>
                          <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 72 }}>정상</TableCell>
                          <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 72 }}>비정상</TableCell>
                          <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 100 }}>PDF</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailRows.map((resource, index) => {
                          const freqColor = FREQ_COLOR[resource.resFreq] || '#F36D00';
                          return (
                            <TableRow key={resource.id || index} sx={{ bgcolor: resource.reported ? (index % 2 === 0 ? '#fff' : '#FAFBFC') : '#F8FAFC' }}>
                              <TableCell sx={{ ...detailCellSx('left'), minWidth: 180 }}>
                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: resource.reported ? C.green : C.brd, mt: 0.75, flexShrink: 0 }} />
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.txH }} noWrap>
                                      {resource.nm}
                                    </Typography>
                                    {isTotal && (
                                      <Typography sx={{ mt: 0.25, fontSize: 12, color: C.txL }} noWrap>
                                        {resource.sysNm}
                                      </Typography>
                                    )}
                                  </Box>
                                </Stack>
                              </TableCell>
                              <TableCell sx={detailCellSx()}>
                                <Chip label={resource.resFreq} size="small" sx={{ bgcolor: `${freqColor}1A`, color: freqColor, fontWeight: 700 }} />
                              </TableCell>
                              <TableCell sx={detailCellSx()}>{resource.inspDt || '—'}</TableCell>
                              <TableCell sx={detailCellSx()}>{resource.reportDt || '—'}</TableCell>
                              <TableCell sx={detailCellSx()}>{resource.reported ? resource.inspector : '—'}</TableCell>
                              <TableCell sx={detailCellSx()}>
                                {resource.reported ? <Typography sx={{ fontSize: 12, fontWeight: 700, color: C.green }}>{resource.normalCnt}</Typography> : '—'}
                              </TableCell>
                              <TableCell sx={detailCellSx()}>
                                {resource.reported ? <Typography sx={{ fontSize: 12, fontWeight: 700, color: resource.abnCnt > 0 ? C.red : C.txL }}>{resource.abnCnt}</Typography> : '—'}
                              </TableCell>
                              <TableCell sx={detailCellSx()}>
                                {resource.reported ? (
                                  <Button variant="outlined" size="small" onClick={() => showToast(`${resource.nm} 보고서 다운로드가 시작되었습니다.`)}>
                                    PDF
                                  </Button>
                                ) : (
                                  <Typography sx={{ fontSize: 12, color: C.txL }}>미보고</Typography>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>

              <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${C.brd}`, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => setPanelInfo(null)}>
                  닫기
                </Button>
              </Box>
            </Box>
          </SidePanel>
        );
      })()}

      <Snackbar open={!!toastMsg} autoHideDuration={2600} onClose={() => setToastMsg(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToastMsg(null)} severity={toastMsg?.ok ? 'success' : 'error'} variant="filled" sx={{ width: '100%' }}>
          {toastMsg?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default function ManagerReportViewPage() {
  return <ReportViewScreen />;
}
