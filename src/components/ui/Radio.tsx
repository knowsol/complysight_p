'use client';

import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import MuiRadio from '@mui/material/Radio';

import { C } from '@/lib/theme/colors';

export interface RadioProps {
  options?: [string, string][];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export const Radio = ({ options = [['Y', '사용'], ['N', '미사용']], value, onChange, disabled }: RadioProps) => (
  <RadioGroup row value={value} onChange={(event) => onChange(event.target.value)}>
    {options.map(([v, l]) => (
      <FormControlLabel
        key={v}
        value={v}
        disabled={disabled}
        control={<MuiRadio size="small" sx={{ color: C.brdD, '&.Mui-checked': { color: C.sec } }} />}
        label={l}
        sx={{ mr: 2, '.MuiFormControlLabel-label': { fontSize: 15, color: disabled ? C.txL : C.txH } }}
      />
    ))}
  </RadioGroup>
);
