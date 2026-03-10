'use client';

import Box from '@mui/material/Box';
import MuiPagination from '@mui/material/Pagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';

import { C } from '@/lib/theme/colors';

export interface TableColumn<T extends object> {
  t: React.ReactNode;
  k: keyof T & string;
  align?: 'left' | 'center' | 'right';
  w?: number | string;
  mw?: number | string;
  r?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface TblProps<T extends object> {
  cols: TableColumn<T>[];
  data: T[];
  onRow?: (row: T) => void;
  pageSize?: number;
  noPaging?: boolean;
  secTitle?: string;
  secCount?: number;
  secButtons?: React.ReactNode;
  rowStyle?: (row: T) => React.CSSProperties;
}

export interface GuiPagProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const Tbl = <T extends object>({ cols, data, onRow, pageSize = 10, noPaging, secTitle, secCount, secButtons, rowStyle }: TblProps<T>) => {
  const [pg, setPg] = useState(1);
  const total = data.length;
  const maxPg = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPg(1);
  }, [data.length]);

  const rows = noPaging ? data : data.slice((pg - 1) * pageSize, pg * pageSize);

  return (
    <Box>
      {(secTitle || secButtons || secCount != null) && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, borderBottom: `1px solid ${C.brdD}`, mb: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            {secTitle && <Typography sx={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{secTitle}</Typography>}
            {secCount != null && <Typography sx={{ fontSize: 12, color: C.txL }}>{secCount}건</Typography>}
          </Box>
          {secButtons && <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>{secButtons}</Box>}
        </Box>
      )}

      <TableContainer sx={{ overflowX: 'auto', borderBottom: `1px solid ${C.brd}` }}>
        <Table size="small" sx={{ minWidth: '100%', width: 'max-content' }}>
          <TableHead sx={{ borderTop: `1px solid ${C.txH}` }}>
            <TableRow>
              {cols.map((c, i) => (
                <TableCell
                  key={i}
                  align={c.align || 'center'}
                  sx={{
                    py: 1.125,
                    px: 1.5,
                    color: C.txL,
                    fontSize: 14,
                    fontWeight: 400,
                    whiteSpace: 'nowrap',
                    ...(c.w ? { width: c.w } : {}),
                    ...(c.mw ? { minWidth: c.mw } : {}),
                  }}
                >
                  {c.t}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={cols.length} sx={{ py: 7, textAlign: 'center' }}>
                  <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 1.25 }}>
                    <Box sx={{ fontSize: 44, lineHeight: 1 }}>🔍</Box>
                    <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.txH, mt: 0.25 }}>검색 결과가 없습니다</Typography>
                    <Typography sx={{ fontSize: 13, color: C.txL }}>다른 검색어나 필터 조건을 사용해 보세요.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r, ri) => (
                <TableRow
                  key={ri}
                  hover={!!onRow}
                  onClick={() => onRow?.(r)}
                  style={rowStyle ? rowStyle(r) : undefined}
                  sx={{
                    cursor: onRow ? 'pointer' : 'default',
                    '&:hover': onRow ? { backgroundColor: 'rgba(69,124,225,0.08)' } : undefined,
                  }}
                >
                  {cols.map((c, ci) => (
                    <TableCell
                      key={ci}
                      align={c.align || 'center'}
                      sx={{
                        py: 1.375,
                        px: 1.5,
                        color: C.txt,
                        fontSize: 14,
                        verticalAlign: 'middle',
                        whiteSpace: 'nowrap',
                        lineHeight: '24px',
                        ...(c.w ? { width: c.w } : {}),
                        ...(c.mw ? { minWidth: c.mw } : {}),
                      }}
                    >
                      {c.r ? c.r(r[c.k], r) : ((r[c.k] ?? '—') as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!noPaging && total > pageSize && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
          <MuiPagination
            count={maxPg}
            page={pg}
            color="primary"
            size="small"
            onChange={(_event, page) => setPg(page)}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export const GuiPag = ({ page, totalPages, setPage }: GuiPagProps) => {
  if (totalPages <= 1) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
      <MuiPagination count={totalPages} page={page} color="primary" size="small" onChange={(_event, value) => setPage(value)} showFirstButton showLastButton />
    </Box>
  );
};
