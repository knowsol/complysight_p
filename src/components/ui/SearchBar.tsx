'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { RefreshBtn, SearchBtn } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/SelectField';
import { C } from '@/lib/theme/colors';

const LABEL_STYLE = {
  fontSize: 11,
  fontWeight: 600,
  color: C.txS,
  marginBottom: 4,
  display: 'flex',
  alignItems: 'center',
  lineHeight: 1.4,
  minHeight: 18,
};

export interface SearchField {
  label: string;
  key: string;
  type?: 'select' | 'input';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface SearchBarProps {
  ph?: string;
  fields?: SearchField[];
  onSearch?: (fieldVals: Record<string, string>, keyword: string) => void;
  value?: string;
  onChange?: (val: string) => void;
  onReset?: () => void;
  children?: ReactNode;
  onSearchClick?: () => void;
}

export function SearchBar({ ph = '검색어를 입력하세요', fields, onSearch, value, onChange, onReset, children, onSearchClick }: SearchBarProps) {
  const [v, setV] = useState(value ?? '');
  const [fieldVals, setFieldVals] = useState<Record<string, string>>({});

  useEffect(() => {
    if (value !== undefined) setV(value);
  }, [value]);

  const reset = () => {
    setV('');
    setFieldVals({});
    onReset?.();
    onSearch?.({}, '');
  };

  const search = () => onSearch?.(fieldVals, v);
  const handleChange = (val: string) => {
    setV(val);
    onChange?.(val);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        border: `1px solid ${C.brd}`,
        bgcolor: C.bg,
        borderRadius: 1,
        p: '16px 12px',
        display: 'flex',
        gap: 3,
        mt: 0,
        mb: '31px',
        alignItems: 'stretch',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {children ? (
          children
        ) : (
          <>
            {fields?.map((f, i) => (
              <Box key={i} sx={{ display: 'flex', flexDirection: 'column', minWidth: 120 }}>
                <Typography component="span" sx={LABEL_STYLE}>
                  {f.label}
                  {f.required && <Box component="span" sx={{ color: C.red, ml: 0.25 }}>*</Box>}
                </Typography>
                {f.type === 'select' ? (
                  <SelectField
                    value={fieldVals[f.key] || ''}
                    onChange={(e) => setFieldVals((p) => ({ ...p, [f.key]: e.target.value }))}
                    style={{ padding: '6px 12px', fontSize: 15, minWidth: 120 }}
                  >
                    <option value="">전체</option>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </SelectField>
                ) : (
                  <FormInput
                    value={fieldVals[f.key] || ''}
                    onChange={(e) => setFieldVals((p) => ({ ...p, [f.key]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && search()}
                    placeholder={f.placeholder || ''}
                    style={{ padding: '6px 12px', fontSize: 15, minWidth: 120 }}
                  />
                )}
              </Box>
            ))}

            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 120 }}>
              <Typography component="span" sx={LABEL_STYLE}>검색</Typography>
              <FormInput
                value={v}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder={ph}
                style={{ padding: '6px 12px', fontSize: 15, minWidth: 120 }}
              />
            </Box>
          </>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1, ml: 'auto', flexShrink: 0, alignSelf: 'stretch' }}>
        <SearchBtn onClick={onSearchClick || search} />
        <RefreshBtn onClick={reset} />
      </Box>
    </Paper>
  );
}

export const SB = SearchBar;
