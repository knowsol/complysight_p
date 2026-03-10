// @ts-nocheck
'use client';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { useState } from 'react';

import { C } from '@/lib/theme/colors';

type InspFilterNode = string | { label: string; value?: string | null };

export interface InspFilterProps {
  menus: { label: string; value?: string | null; sub?: InspFilterNode[] }[];
  sel: string | null;
  sub?: string | null;
  onSelect: (kind: string | null, sub?: string | null) => void;
  data: any[];
  kindKey?: string;
  midKey?: string;
}

export function InspFilter({ menus, sel, sub = null, onSelect, data, kindKey = 'kind', midKey = 'mid' }: InspFilterProps) {
  const [openK, setOpenK] = useState<string | null>(null);

  const getNode = (node: InspFilterNode) => (
    typeof node === 'string'
      ? { label: node, value: node }
      : { label: node.label, value: node.value ?? node.label }
  );

  const dCnt = (k: string | null, s: string | null) => {
    if (!data) return 0;
    return data.filter((x) => {
      if (k && x[kindKey] !== k) return false;
      if (s && x[midKey] !== s) return false;
      return x.st === '지연';
    }).length;
  };

  const badge = (cnt: number) => cnt > 0 ? (
    <Chip
      size="small"
      label={cnt}
      sx={{
        minWidth: 18,
        height: 18,
        borderRadius: 2.25,
        bgcolor: C.red,
        color: '#fff',
        fontSize: 12,
        fontWeight: 700,
        '.MuiChip-label': { px: 0.625 },
      }}
    />
  ) : null;

  return (
    <List sx={{ p: 0 }}>
      {menus.map((m, i) => {
        const parent = getNode(m);
        const hasC = m.sub && m.sub.length > 0;
        const parentActive = sel === parent.value && !sub;
        const childActive = hasC && sel === parent.value && !!sub;
        const isOpen = hasC ? true : (openK === String(parent.value) || childActive);

        return (
          <Box key={i}>
            <ListItemButton
              onClick={() => {
                if (hasC) {
                  onSelect(parent.value, null);
                } else {
                  setOpenK(null);
                  onSelect(parent.value, null);
                }
              }}
              sx={{
                py: 1.125,
                px: 1.75,
                borderRadius: 1,
                mb: 0.25,
                mx: 0.75,
                fontSize: 15,
                fontWeight: parentActive || childActive ? 600 : 500,
                bgcolor: parentActive || childActive ? C.priL : 'transparent',
                color: parentActive || childActive ? C.sec : C.txt,
                '&:hover': { bgcolor: C.secL },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Box component="span">{parent.label}</Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {badge(dCnt(parent.value, null))}
                  {hasC && (isOpen ? <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: C.txL }} /> : <KeyboardArrowRightRoundedIcon sx={{ fontSize: 16, color: C.txL }} />)}
                </Box>
              </Box>
            </ListItemButton>
            {hasC && (
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box sx={{ mb: 0.25 }}>
                  {m.sub.map((s) => {
                    const child = getNode(s);
                    const active = sel === parent.value && sub === child.value;

                    return (
                      <ListItemButton
                        key={`${parent.label}-${child.value ?? child.label}`}
                        onClick={() => onSelect(parent.value, child.value)}
                        sx={{
                          py: 0.75,
                          px: 1.5,
                          pl: 3,
                          borderRadius: 1,
                          mb: 0.125,
                          mx: 0.75,
                          fontSize: 13,
                          fontWeight: active ? 600 : 400,
                          bgcolor: active ? C.priL : 'transparent',
                          color: active ? C.sec : C.txS,
                          '&:hover': { bgcolor: C.secL },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.625 }}>
                            <Box component="span" sx={{ fontSize: 11, color: active ? C.sec : C.txX, lineHeight: 1 }}>─</Box>
                            {child.label}
                          </Box>
                          {badge(dCnt(parent.value, child.value))}
                        </Box>
                      </ListItemButton>
                    );
                  })}
                </Box>
              </Collapse>
            )}
          </Box>
        );
      })}
    </List>
  );
}
