'use client';

import { useEffect, useState } from 'react';
import { colors } from '@/lib/theme/colors';
import { SearchBtn, RefreshBtn } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import { FormInput } from '@/components/ui/FormField';
import type { ReactNode } from 'react';

const LABEL_STYLE = {
  fontSize: 11,
  fontWeight: 600,
  color: colors.textSecondary,
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
  placeholder?: string;
  fields?: SearchField[];
  onSearch?: (fieldVals: Record<string, string>, keyword: string) => void;
  value?: string;
  onChange?: (val: string) => void;
  onReset?: () => void;
  children?: ReactNode;
  onSearchClick?: () => void;
}

export function SearchBar({ placeholder = '검색어를 입력하세요', fields, onSearch, value, onChange, onReset, children, onSearchClick }: SearchBarProps) {
  const [searchKeyword, setSearchKeyword] = useState(value ?? '');
  const [fieldVals, setFieldVals] = useState<Record<string, string>>({});

  useEffect(() => {
    if (value !== undefined) setSearchKeyword(value);
  }, [value]);

  const reset = () => {
    setSearchKeyword('');
    setFieldVals({});
    onReset?.();
    onSearch?.({}, '');
  };

  const search = () => onSearch?.(fieldVals, searchKeyword);
  const handleChange = (val: string) => {
    setSearchKeyword(val);
    onChange?.(val);
  };

  return (
    <div
      style={{
        width: '100%',
        border: `1px solid ${colors.border}`,
        background: colors.background,
        borderRadius: 6,
        padding: '16px 12px',
        display: 'flex',
        gap: 24,
        marginTop: 0,
        marginBottom: 31,
        alignItems: 'stretch',
      }}
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {children ? (
          children
        ) : (
          <>
            {fields?.map((f, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', minWidth: 120 }}>
                <span style={{ ...LABEL_STYLE }}>
                  {f.label}
                  {f.required && <span style={{ color: colors.red, marginLeft: 2 }}>*</span>}
                </span>
                {f.type === 'select' ? (
                  <SelectField
                    value={fieldVals[f.key] || ''}
                    onChange={(e) => setFieldVals((p) => ({ ...p, [f.key]: e.target.value }))}
                    style={{
                      padding: '6px 12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: 4,
                      fontSize: 15,
                      background: '#fff',
                      color: colors.text,
                      minWidth: 120,
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
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
                    style={{
                      padding: '6px 12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: 4,
                      fontSize: 15,
                      outline: 'none',
                      color: colors.text,
                      background: '#fff',
                      minWidth: 120,
                      fontFamily: 'inherit',
                    }}
                  />
                )}
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 120 }}>
              <span style={{ ...LABEL_STYLE }}>검색</span>
              <FormInput
                value={searchKeyword}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder={placeholder}
                style={{
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 4,
                  fontSize: 15,
                  outline: 'none',
                  color: colors.text,
                  background: '#fff',
                  minWidth: 120,
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexShrink: 0, alignSelf: 'stretch' }}>
        <SearchBtn onClick={onSearchClick || search} />
        <RefreshBtn onClick={reset} />
      </div>
    </div>
  );
}

/** Legacy alias kept for backward compatibility */
export const SB = SearchBar;
