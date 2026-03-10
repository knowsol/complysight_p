'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal, UnsavedConfirm } from '@/components/ui/ConfirmModal';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { FormInput, FormSelect, FormTextarea, RoSelect } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { Icon } from '@/components/ui/Icon';
import { C } from '@/lib/theme/colors';
import { PRETENDARD_FONT, fSelect } from '@/lib/theme/styles';
import { RES } from '@/data/resources';
import { SYS } from '@/data/manager';
import type { Checklist } from '@/types/checklist';

interface ChecklistPanelProps {
  open: boolean;
  onClose: () => void;
  item: Checklist | null;
  linkedResIds?: number[];
  initialTab?: 'info' | 'res';
  isJustCreated?: boolean;
  resLinkMap?: Record<string, number>;
  onSaved?: (checklist: Checklist & Record<string, unknown>) => void;
  onDeleted?: (id: number) => void;
  onLinkChange?: (resId: number, link: boolean) => void;
}

interface ChecklistPoolItem {
  code: string;
  nm: string;
  method: '자동' | '육안';
  std: string;
  unit: string;
  cat1: string;
  cat2: string;
  cat3: string;
}

interface ChecklistItemState {
  id: number;
  code: string;
  nm: string;
  method: '자동' | '육안';
  std: string;
  unit: string;
}

const emptyForm = {
  st: 'Y',
  nm: '',
  clId: '',
  inspType: '일상점검',
  inspKind: '',
  exposedRes: [] as string[],
  linkedSch: 0,
  linkedRes: 0,
  registrant: '',
  regDt: '',
  purpose: '',
  memo: '',
};

const VC_POOL: ChecklistPoolItem[] = [
  { code: 'CHK-CPU-001', nm: 'CPU 사용률', method: '자동', std: '< 80%', unit: '%', cat1: '서버', cat2: 'CPU', cat3: '사용률' },
  { code: 'CHK-MEM-001', nm: '메모리 사용률', method: '자동', std: '< 85%', unit: '%', cat1: '서버', cat2: '메모리', cat3: '사용률' },
  { code: 'CHK-DISK-001', nm: '디스크 사용률', method: '자동', std: '< 90%', unit: '%', cat1: '서버', cat2: '디스크', cat3: '사용률' },
  { code: 'CHK-LOG-001', nm: '로그 에러 확인', method: '육안', std: '0건', unit: '건', cat1: '서버', cat2: '로그', cat3: '에러' },
  { code: 'CHK-WEB-001', nm: 'WEB 서비스 응답 코드', method: '자동', std: '200', unit: '', cat1: 'WEB', cat2: '응답', cat3: '응답코드' },
  { code: 'CHK-WEB-003', nm: 'WEB 에러 로그 확인', method: '육안', std: '0건', unit: '건', cat1: 'WEB', cat2: '로그', cat3: '에러' },
  { code: 'CHK-WAS-001', nm: 'WAS 프로세스 상태', method: '자동', std: 'Running', unit: '', cat1: 'WAS', cat2: '리소스', cat3: '프로세스' },
  { code: 'CHK-WAS-006', nm: 'WAS 에러 로그 확인', method: '육안', std: '0건', unit: '건', cat1: 'WAS', cat2: '로그', cat3: '에러' },
  { code: 'CHK-DB-001', nm: 'DB 서비스 상태', method: '자동', std: 'Running', unit: '', cat1: 'DBMS', cat2: '상태', cat3: '서비스' },
  { code: 'CHK-DB-006', nm: 'DB 에러 로그 확인', method: '육안', std: '0건', unit: '건', cat1: 'DBMS', cat2: '로그', cat3: '에러' },
  { code: 'CHK-NET-001', nm: '네트워크 인터페이스 상태', method: '자동', std: 'UP', unit: '', cat1: '네트워크', cat2: '인터페이스', cat3: '상태' },
  { code: 'CHK-NET-007', nm: 'VLAN 설정 확인', method: '육안', std: '정상', unit: '', cat1: '네트워크', cat2: '설정', cat3: 'VLAN' },
  { code: 'CHK-SEC-001', nm: '방화벽 룰 점검', method: '육안', std: '정상', unit: '', cat1: '보안', cat2: '접근통제', cat3: '방화벽' },
  { code: 'CHK-CERT-001', nm: '인증서 만료 확인', method: '자동', std: '> 30일', unit: '일', cat1: '보안', cat2: '인증서', cat3: '만료' },
  { code: 'CHK-BAK-001', nm: '백업 상태 확인', method: '육안', std: '정상', unit: '', cat1: '백업', cat2: '백업', cat3: '상태' },
  { code: 'CHK-BAK-002', nm: '전체 백업 수행 확인', method: '자동', std: '성공', unit: '', cat1: '백업', cat2: '백업', cat3: '수행' },
  { code: 'CHK-SVC-001', nm: '서비스 포트 확인', method: '자동', std: 'OPEN', unit: '', cat1: '서비스', cat2: '포트', cat3: '상태' },
  { code: 'CHK-SVC-004', nm: 'DNS 응답 확인', method: '자동', std: '정상', unit: '', cat1: '서비스', cat2: '네트워크', cat3: 'DNS' },
];

const RES_INFO_OPTIONS = [
  '자원명',
  '자원 식별코드',
  '중분류',
  '소분류',
  '상위 자원명',
  '관리주체',
  '운영/개발 구분',
  '도입일',
  '가상화 여부',
  '사용용도',
  '최초 사용용도',
  '이전 사용용도',
  '상세용도',
  '장비 IP',
  '서비스 IP',
  '포트',
  '서비스 URL',
  '설치경로',
  '로그경로',
  'SNMP 계정정보',
  'SNMP 버전',
  'SNMP 인증정보',
  'OS',
  '제조사',
  '모델명',
  '시리얼넘버',
  '메모리 용량(GB)',
  '로컬 디스크 용량(GB)',
  'CPU 모델',
  'CPU 클럭 속도(GHz)',
  'CPU 코어수',
  'CPU 아키텍처',
  '비고',
];

const PRESET_ITEMS: ChecklistItemState[] = [
  { id: 1, code: 'CHK-CPU-001', nm: 'CPU 사용률', method: '자동', std: '< 80%', unit: '%' },
  { id: 2, code: 'CHK-MEM-001', nm: '메모리 사용률', method: '자동', std: '< 85%', unit: '%' },
  { id: 3, code: 'CHK-DISK-001', nm: '디스크 사용률', method: '자동', std: '< 90%', unit: '%' },
  { id: 4, code: 'CHK-LOG-001', nm: '로그 에러 확인', method: '육안', std: '0건', unit: '건' },
];

export function ChecklistPanel({
  open,
  onClose,
  item,
  linkedResIds = [],
  initialTab = 'info',
  isJustCreated = false,
  resLinkMap = {},
  onSaved,
  onDeleted,
  onLinkChange,
}: ChecklistPanelProps) {
  const isNew = !item;
  const [form, setForm] = useState({ ...emptyForm });
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [kindChangeConfirm, setKindChangeConfirm] = useState<string | null>(null);
  const [itemFilter, setItemFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'res'>(initialTab);
  const [resSearch, setResSearch] = useState('');
  const [resSys, setResSys] = useState('');
  const [resLarge, setResLarge] = useState('');
  const [resMid, setResMid] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [inspItems, setInspItems] = useState<ChecklistItemState[]>([]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    if (!open) return;
    setEditMode(false);
    setConfirmOpen(false);
    setDeleteConfirm(false);
    setKindChangeConfirm(null);
    setItemFilter('');
    setActiveTab(initialTab);
    setResSearch('');
    setResSys('');
    setResLarge('');
    setResMid('');
    setShowPreview(!item);

    if (item) {
      setForm({
        st: item.useYn || 'Y',
        nm: item.nm,
        clId: String(item.id || ''),
        inspType: item.type || '일상점검',
        inspKind: item.sub || item.kind || '',
        exposedRes: [],
        linkedSch: item.sch || 0,
        linkedRes: linkedResIds.length,
        registrant: item.registrant || '관리자',
        regDt: item.regDt || '2026-01-15 10:00:00',
        purpose: '',
        memo: '',
      });
      setInspItems(PRESET_ITEMS);
      setNextId(PRESET_ITEMS.length + 1);
    } else {
      setForm({
        ...emptyForm,
        registrant: '관리자',
        regDt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      });
      setInspItems([]);
      setNextId(1);
    }
  }, [open, item, initialTab, linkedResIds.length]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, linkedRes: linkedResIds.length }));
  }, [linkedResIds.length]);

  const readOnly = !!item && !editMode;
  const roStyle: React.CSSProperties = readOnly ? { background: '#F9FAFC', color: C.txt, pointerEvents: 'none' } : {};
  const roSelectStyle: React.CSSProperties = readOnly ? { background: '#F9FAFC', color: C.txt, pointerEvents: 'none', appearance: 'none', backgroundImage: 'none', cursor: 'default' } : {};
  const kindOptions = Array.from(new Set(VC_POOL.map((entry) => entry.cat1)));

  const setField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addItem = (code: string) => {
    const entry = VC_POOL.find((poolItem) => poolItem.code === code);
    if (!entry) return;
    setInspItems((prev) => [...prev, { id: nextId, code: entry.code, nm: entry.nm, method: entry.method, std: entry.std, unit: entry.unit }]);
    setNextId((prev) => prev + 1);
  };

  const removeItem = (id: number) => {
    setInspItems((prev) => prev.filter((entry) => entry.id !== id));
  };

  const updateItemStd = (id: number, value: string) => {
    setInspItems((prev) => prev.map((entry) => (entry.id === id ? { ...entry, std: value } : entry)));
  };

  const availableItems = VC_POOL.filter((entry) => !inspItems.some((itemEntry) => itemEntry.code === entry.code) && (!form.inspKind || entry.cat1 === form.inspKind));
  const filteredAvailableItems = itemFilter
    ? availableItems.filter((entry) => entry.nm.toLowerCase().includes(itemFilter.toLowerCase()) || entry.code.toLowerCase().includes(itemFilter.toLowerCase()))
    : availableItems;

  const groupedItems = inspItems.reduce<Record<string, Array<ChecklistItemState & Pick<ChecklistPoolItem, 'cat2' | 'cat3'>>>>((acc, entry) => {
    const meta = VC_POOL.find((poolItem) => poolItem.code === entry.code);
    const cat = meta?.cat1 || '기타';
    acc[cat] ||= [];
    acc[cat].push({ ...entry, cat2: meta?.cat2 || '', cat3: meta?.cat3 || '' });
    return acc;
  }, {});

  const PreviewDoc = () => {
    const today = new Date();
    const tdStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    const tbl: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
    const th = (extra: React.CSSProperties = {}): React.CSSProperties => ({
      padding: '6px 10px',
      border: '1px solid #333',
      background: '#1a3a5c',
      color: '#fff',
      fontSize: 12,
      fontWeight: 700,
      textAlign: 'center',
      ...extra,
    });
    const thLight = (extra: React.CSSProperties = {}): React.CSSProperties => ({
      padding: '6px 10px',
      border: '1px solid #333',
      background: '#c8d8e8',
      color: '#1a3a5c',
      fontSize: 12,
      fontWeight: 700,
      textAlign: 'center',
      ...extra,
    });
    const td = (extra: React.CSSProperties = {}): React.CSSProperties => ({
      padding: '6px 10px',
      border: '1px solid #aaa',
      fontSize: 12,
      verticalAlign: 'middle',
      ...extra,
    });
    const secHdr = (extra: React.CSSProperties = {}): React.CSSProperties => ({
      padding: '5px 10px',
      border: '1px solid #333',
      background: '#2d5a8e',
      color: '#fff',
      fontSize: 12,
      fontWeight: 700,
      textAlign: 'center',
      letterSpacing: 2,
      ...extra,
    });

    return (
      <div style={{ fontFamily: PRETENDARD_FONT, background: '#fff', padding: '20px 24px', minHeight: '100%', color: '#111' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 12, color: '#1a3a5c', borderBottom: '3px solid #1a3a5c', paddingBottom: 8, marginBottom: 4 }}>점 검 표</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: 12, color: '#444' }}>
            <span style={{ width: 12, height: 12, border: '1.5px solid #333', display: 'inline-block', verticalAlign: 'middle' }} />
            <span>
              {form.nm || '(점검표 명 미입력)'} - {form.inspType} / {form.inspKind || '점검종류 미선택'}
            </span>
          </div>
        </div>

        <div style={secHdr({ marginBottom: 0 })}>SITE INFORMATION</div>
        <table style={{ ...tbl, marginBottom: 10 }}>
          <tbody>
            <tr>
              <td style={thLight({ width: '15%', textAlign: 'left' })}>고객사명</td>
              <td style={td({ width: '35%' })}>&nbsp;</td>
              <td style={thLight({ width: '15%', textAlign: 'left' })}>작업일자</td>
              <td style={td({ width: '35%' })}>{tdStr}</td>
            </tr>
            <tr>
              <td style={thLight({ textAlign: 'left' })}>작업구분</td>
              <td style={td()}>주간 / 야간   평일 / 휴일</td>
              <td style={thLight({ textAlign: 'left' })}>작업시간</td>
              <td style={td()}>:     ~     :</td>
            </tr>
          </tbody>
        </table>

        <div style={secHdr({ marginBottom: 0 })}>SYSTEM INFORMATION</div>
        <table style={{ ...tbl, marginBottom: 10 }}>
          <tbody>
            {form.exposedRes.length > 0 ? (
              form.exposedRes
                .map((label, index) => (
                  <tr key={label}>
                    <td style={thLight({ width: '20%', textAlign: 'left' })}>{label}</td>
                    <td style={td()}>&nbsp;</td>
                    {form.exposedRes[index + 1] ? (
                      <>
                        <td style={thLight({ width: '20%', textAlign: 'left' })}>{form.exposedRes[index + 1]}</td>
                        <td style={td()}>&nbsp;</td>
                      </>
                    ) : (
                      <>
                        <td style={{ border: '1px solid #aaa' }} />
                        <td style={{ border: '1px solid #aaa' }} />
                      </>
                    )}
                  </tr>
                ))
                .filter((_, index) => index % 2 === 0)
            ) : (
              <tr>
                <td colSpan={4} style={td({ textAlign: 'center', color: '#aaa' })}>
                  노출 자원정보를 선택하면 여기에 표시됩니다
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={secHdr({ marginBottom: 0 })}>SYSTEM DETAIL CHECK</div>
        {Object.keys(groupedItems).length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#aaa', fontSize: 12, border: '1px solid #aaa' }}>점검항목을 추가하면 여기에 표시됩니다</div>
        ) : (
          Object.entries(groupedItems).map(([cat, rows]) => (
            <div key={cat}>
              <table style={tbl}>
                <thead>
                  <tr>
                    <th style={th({ width: '70%' })}>점검 내용</th>
                    <th style={th({ width: '30%', borderLeft: '2px solid #fff' })}>점검 결과</th>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ padding: '4px 10px', border: '1px solid #aaa', background: '#e8f0f8', color: '#1a3a5c', fontWeight: 700 }}>
                      [{cat}]
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((entry) => (
                    <tr key={entry.id}>
                      <td style={td()}>
                        <div style={{ fontWeight: 600, fontSize: 12 }}>{entry.nm}</div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{entry.code}</div>
                      </td>
                      <td style={td({ textAlign: 'center' })}>
                        {entry.method === '자동' ? <span style={{ fontSize: 12, color: '#aaa' }}>자동 수집</span> : <span style={{ fontSize: 12 }}>□ 정상   □ 비정상</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}

        <div style={{ marginTop: 10, border: '1px solid #aaa' }}>
          <div style={{ padding: '5px 10px', background: '#e8f0f8', borderBottom: '1px solid #aaa', fontSize: 12, fontWeight: 700, color: '#1a3a5c' }}>[특이사항]</div>
          <div style={{ padding: '40px 10px 10px', fontSize: 12, color: '#aaa', fontStyle: 'italic' }}>{form.memo || '점검 중 특이사항을 기재합니다.'}</div>
        </div>
      </div>
    );
  };

  const handleSave = () => {
    if (!form.nm.trim()) {
      alert('점검표 명을 입력하세요.');
      return;
    }
    if (!form.inspKind) {
      alert('점검세부분류를 선택하세요.');
      return;
    }

    const payload = {
      ...(item || {}),
      id: item?.id || Date.now(),
      nm: form.nm.trim(),
      type: form.inspType,
      kind: form.inspKind,
      sub: form.inspKind,
      useYn: form.st as 'Y' | 'N',
      items: inspItems.length,
      sch: form.linkedSch || 0,
      registrant: form.registrant || '관리자',
      regDt: form.regDt || new Date().toISOString().replace('T', ' ').slice(0, 19),
      exposedRes: form.exposedRes,
      purpose: form.purpose,
      memo: form.memo,
    };

    onSaved?.(payload);
    if (isNew) return;
    setEditMode(false);
  };

  const handleCancel = () => {
    if (editMode || isNew) {
      setConfirmOpen(true);
      return;
    }
    onClose();
  };

  const renderEditForm = () => (
    <>
      <FormRow label="사용유무">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            onClick={() => !readOnly && setField('st', form.st === 'Y' ? 'N' : 'Y')}
            style={{ position: 'relative', width: 44, height: 24, borderRadius: 12, cursor: readOnly ? 'default' : 'pointer', opacity: readOnly ? 0.6 : 1, background: form.st === 'Y' ? C.pri : '#D1D5DB', transition: 'background .2s' }}
          >
            <div style={{ position: 'absolute', top: 2, left: form.st === 'Y' ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left .2s' }} />
          </div>
          <span style={{ fontSize: 13, color: form.st === 'Y' ? C.pri : C.txL, fontWeight: 500, opacity: readOnly ? 0.6 : 1 }}>{form.st === 'Y' ? '사용' : '미사용'}</span>
        </div>
      </FormRow>

      <div style={{ marginBottom: 18 }}>
        <SectionTitle label="기본 정보" primary />
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 2 }}>
            <FormRow label="점검표 명" required>
              <FormInput value={form.nm} onChange={(e) => setField('nm', e.target.value)} placeholder="점검표 명" readOnly={readOnly} style={roStyle} maxLength={100} />
            </FormRow>
          </div>
          <div style={{ flex: 1 }}>
            <FormRow label="점검세부분류" required>
              <RoSelect
                readOnly={readOnly}
                style={{ ...fSelect, ...roSelectStyle }}
                value={form.inspKind}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (form.inspKind && nextValue !== form.inspKind && inspItems.length > 0) {
                    setKindChangeConfirm(nextValue);
                  } else {
                    setField('inspKind', nextValue);
                    setItemFilter('');
                  }
                }}
              >
                <option value="">선택하세요</option>
                {kindOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </RoSelect>
            </FormRow>
          </div>
        </div>

        <FormRow label="노출 자원정보">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {RES_INFO_OPTIONS.map((option) => {
              const selected = form.exposedRes.includes(option);
              return (
                <span
                  key={option}
                  onClick={() => !readOnly && setField('exposedRes', selected ? form.exposedRes.filter((entry) => entry !== option) : [...form.exposedRes, option])}
                  style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, border: `1px solid ${selected ? C.pri : C.brd}`, background: selected ? C.priL : '', color: selected ? C.pri : C.txS, cursor: readOnly ? 'default' : 'pointer' }}
                >
                  {option}
                </span>
              );
            })}
          </div>
        </FormRow>
      </div>

      <div style={{ marginBottom: 18 }}>
        <SectionTitle label="점검항목" />
        {!form.inspKind ? <div style={{ padding: 16, textAlign: 'center', color: C.txL, fontSize: 12, background: '#F9FAFC', borderRadius: 6, marginBottom: 8 }}>점검세부분류를 먼저 선택하세요.</div> : null}

        {form.inspKind ? (
          <>
            {!readOnly ? (
              <div style={{ marginBottom: 10 }}>
                <div style={{ position: 'relative', marginBottom: 6 }}>
                  <FormInput value={itemFilter} onChange={(e) => setItemFilter(e.target.value)} placeholder="항목명 또는 검증코드로 검색..." style={{ paddingLeft: 28, fontSize: 14, height: 32 }} />
                  <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Icon n="search" s={13} c={C.txL} />
                  </span>
                  {itemFilter ? (
                    <span onClick={() => setItemFilter('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 15, color: C.txL, lineHeight: 1 }}>
                      ×
                    </span>
                  ) : null}
                </div>

                <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, maxHeight: 200, overflowY: 'auto' }}>
                  {filteredAvailableItems.length === 0 ? <div style={{ padding: 14, textAlign: 'center', fontSize: 12, color: C.txL }}>{availableItems.length === 0 ? '모든 항목이 추가되었습니다.' : `"${itemFilter}" 검색 결과가 없습니다.`}</div> : null}
                  {filteredAvailableItems.map((entry) => (
                    <div
                      key={entry.code}
                      onClick={() => addItem(entry.code)}
                      style={{ padding: '7px 12px', cursor: 'pointer', borderBottom: `1px solid ${C.brd}`, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0fdf4';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '';
                      }}
                    >
                      <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 12, background: entry.method === '자동' ? '#dbeafe' : '#fff7ed', color: entry.method === '자동' ? '#1e40af' : '#c2410c', flexShrink: 0 }}>{entry.method}</span>
                      <span style={{ fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.nm}</span>
                      <span style={{ fontSize: 12, color: C.txL, flexShrink: 0 }}>{entry.code}</span>
                      <span style={{ fontSize: 12, color: C.txS, background: '#F9FAFC', padding: '1px 5px', borderRadius: 8, flexShrink: 0 }}>
                        {entry.cat2}›{entry.cat3}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div style={{ fontSize: 12, fontWeight: 600, color: C.txS, marginBottom: 6 }}>
              선택된 항목 <span style={{ fontWeight: 400, color: C.txL }}>({inspItems.length}개)</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 8 }}>
              <thead>
                <tr style={{ background: '#F9FAFC' }}>
                  {['항목명', '검증코드', '방식', '기준값', '단위', ...(readOnly ? [] : [''])].map((header) => (
                    <th key={header} style={{ padding: '8px 6px', borderBottom: `2px solid ${C.brd}`, textAlign: 'left', fontWeight: 600, color: C.txS }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inspItems.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: `1px solid ${C.brd}` }}>
                    <td style={{ padding: '8px 6px' }}>{entry.nm}</td>
                    <td style={{ color: C.pri }}>{entry.code}</td>
                    <td>
                      <span style={{ padding: '1px 6px', borderRadius: 3, background: entry.method === '자동' ? '#dbeafe' : '#fff7ed', color: entry.method === '자동' ? '#1e40af' : '#c2410c' }}>{entry.method}</span>
                    </td>
                    <td>{readOnly ? <span style={{ color: C.txS }}>{entry.std}</span> : <FormInput value={entry.std} onChange={(e) => updateItemStd(entry.id, e.target.value)} style={{ width: 80, padding: '3px 6px', border: `1px solid ${C.brd}`, borderRadius: 4 }} />}</td>
                    <td style={{ color: C.txS }}>{entry.unit}</td>
                    {!readOnly ? (
                      <td style={{ textAlign: 'center' }}>
                        <span onClick={() => removeItem(entry.id)} style={{ cursor: 'pointer', color: C.red, fontSize: 15, fontWeight: 600 }}>
                          ×
                        </span>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>

            {inspItems.length === 0 ? <div style={{ padding: 16, textAlign: 'center', color: C.txL, fontSize: 12, background: '#F9FAFC', borderRadius: 6 }}>점검항목이 없습니다. 위에서 검색하여 추가하세요.</div> : null}
          </>
        ) : null}
      </div>

      <div style={{ marginBottom: 18 }}>
        <SectionTitle label="관리 정보" />
        <div style={{ display: 'flex', gap: 12 }}>
          <FormRow label="등록자" style={{ flex: 1 }}>
            <FormInput value={form.registrant} readOnly style={{ background: '#F9FAFC', pointerEvents: 'none' }} />
          </FormRow>
          <FormRow label="등록일" style={{ flex: 1 }}>
            <FormInput value={form.regDt} readOnly style={{ background: '#F9FAFC', pointerEvents: 'none' }} />
          </FormRow>
          <div style={{ flex: 1 }} />
        </div>
        {readOnly ? (
          <div style={{ display: 'flex', gap: 12 }}>
            <FormRow label="연결된 자원" style={{ flex: 1 }}>
              <FormInput value={form.linkedRes} readOnly style={roStyle} />
            </FormRow>
            <FormRow label="연결된 정기점검" style={{ flex: 1 }}>
              <FormInput value={form.linkedSch} readOnly style={roStyle} />
            </FormRow>
            <div style={{ flex: 1 }} />
          </div>
        ) : null}
      </div>
    </>
  );

  const renderResourceTab = () => {
    const clSub = item?.sub || form.inspKind || '';
    const clId = item?.id;
    const sysFiltered = RES.filter((res) => {
      if (resSys && res.sysId !== resSys) return false;
      if (resLarge && String((res as Record<string, unknown>).large || '') !== resLarge) return false;
      if (resMid && res.mid !== resMid) return false;
      return true;
    });

    const classify = (res: typeof RES[number]) => {
      if (linkedResIds.includes(res.id)) return 'linked';
      const mapped = resLinkMap[res.id];
      if (mapped && mapped !== clId) return 'other';
      return 'free';
    };

    const baseRes = sysFiltered.filter((res) => {
      if (res.st === '미사용') return false;
      if (resSearch) {
        const q = resSearch.toLowerCase();
        return res.nm.toLowerCase().includes(q) || (res.ip || '').includes(q);
      }
      return true;
    });

    const sorted = [...baseRes].sort((a, b) => {
      const order = { linked: 0, free: 1, other: 2 };
      const stateA = classify(a);
      const stateB = classify(b);
      if (order[stateA] !== order[stateB]) return order[stateA] - order[stateB];
      const matchA = stateA !== 'other' && a.mid === clSub ? 0 : 1;
      const matchB = stateB !== 'other' && b.mid === clSub ? 0 : 1;
      if (matchA !== matchB) return matchA - matchB;
      return a.nm.localeCompare(b.nm);
    });

    const selectableIds = sorted.filter((res) => classify(res) !== 'other').map((res) => res.id);
    const anySelected = selectableIds.some((id) => linkedResIds.includes(id));

    return (
      <div>
        {isJustCreated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>점검표 등록이 완료되었습니다.</div>
              <div style={{ fontSize: 12, color: '#15803d', marginTop: 1 }}>아래에서 이 점검표를 사용할 자원을 연결하세요.</div>
            </div>
          </div>
        ) : null}

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: C.txL }}>
            이 점검표에 연결할 자원을 선택하세요.
            <span style={{ color: C.pri, fontWeight: 600 }}> 현재 {linkedResIds.length}개</span> 연결됨
            {clSub ? <span style={{ color: C.txS }}> · {clSub} 자원 권장</span> : null}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <FormSelect value={resSys} onChange={(e) => setResSys(e.target.value)} style={{ flex: 1, padding: '5px 10px', fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 4, background: '#fff', outline: 'none' }}>
              <option value="">전체 시스템</option>
              {SYS.map((sys) => (
                <option key={sys.id} value={sys.id}>
                  {sys.nm}
                </option>
              ))}
            </FormSelect>
            <FormSelect value={resMid} onChange={(e) => setResMid(e.target.value)} style={{ flex: 1, padding: '5px 10px', fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 4, background: '#fff', outline: 'none' }}>
              <option value="">전체 중분류</option>
              {['서버', 'WEB', 'WAS', 'DBMS', '네트워크', '보안', '스토리지', '백업', '서비스'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
            <FormSelect value={resLarge} onChange={(e) => setResLarge(e.target.value)} style={{ flex: 1, padding: '5px 10px', fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 4, background: '#fff', outline: 'none' }}>
              <option value="">전체 대분류</option>
              {['하드웨어', '소프트웨어'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
          </div>
          <div style={{ position: 'relative' }}>
            <FormInput value={resSearch} onChange={(e) => setResSearch(e.target.value)} placeholder="자원명 또는 IP 검색" style={{ width: '100%', padding: '5px 10px 5px 28px', fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 4, outline: 'none', boxSizing: 'border-box' }} />
            <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <Icon n="search" s={12} c={C.txL} />
            </span>
            {resSearch ? (
              <span onClick={() => setResSearch('')} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 15, color: C.txL }}>
                ×
              </span>
            ) : null}
          </div>
        </div>

        {selectableIds.length > 0 ? (
          <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <Button xs outline onClick={() => selectableIds.forEach((id) => !linkedResIds.includes(id) && onLinkChange?.(id, true))}>
              전체 선택
            </Button>
            <Button xs disabled={!anySelected} onClick={() => selectableIds.forEach((id) => linkedResIds.includes(id) && onLinkChange?.(id, false))}>
              전체 선택 해제
            </Button>
          </div>
        ) : null}

        <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, overflow: 'hidden', maxHeight: 360, overflowY: 'auto' }}>
          {sorted.length === 0 ? <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: C.txL }}>조건에 맞는 자원이 없습니다.</div> : null}
          {sorted.map((res, index) => {
            const state = classify(res);
            const linked = state === 'linked';
            const isOther = state === 'other';
            const isMatch = res.mid === clSub && !isOther;
            const prevOther = index > 0 && classify(sorted[index - 1]) !== 'other' && isOther;
            return (
              <React.Fragment key={res.id}>
                {prevOther ? (
                  <div style={{ padding: '6px 14px', background: '#F9FAFC', borderBottom: `1px solid ${C.brd}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span style={{ fontSize: 12, color: C.txL, fontWeight: 500 }}>다른 점검표가 이미 연결된 자원 (선택 불가)</span>
                  </div>
                ) : null}
                <div
                  onClick={() => !isOther && onLinkChange?.(res.id, !linked)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: `1px solid ${C.brd}`, transition: 'background .12s', cursor: isOther ? 'not-allowed' : 'pointer', background: linked ? '#f0fdf4' : isOther ? '#F9FAFC' : '#fff', borderLeft: linked ? '3px solid #16a34a' : isOther ? `3px solid ${C.brd}` : '3px solid transparent', opacity: isOther ? 0.6 : 1 }}
                  onMouseEnter={(e) => {
                    if (!linked && !isOther) e.currentTarget.style.background = '#F5F7FF';
                  }}
                  onMouseLeave={(e) => {
                    if (!linked && !isOther) e.currentTarget.style.background = '#fff';
                  }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, transition: 'all .15s', border: `2px solid ${linked ? '#16a34a' : C.brd}`, background: linked ? '#16a34a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {linked ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                    {isOther ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <line x1="2" y1="5" x2="8" y2="5" stroke={C.txL} strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    ) : null}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: linked ? '#166534' : isOther ? C.txL : C.txt, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {res.nm}
                      {isMatch ? <span style={{ fontSize: 12, fontWeight: 700, padding: '1px 6px', borderRadius: 8, background: '#dbeafe', color: '#1d4ed8' }}>권장</span> : null}
                    </div>
                    <div style={{ fontSize: 12, color: C.txL, marginTop: 1 }}>
                      {res.sysNm} · {res.mid} · {res.ip || '—'}
                      {isOther ? <span style={{ marginLeft: 6, color: '#f59e0b' }}>· 다른 점검표 연결됨</span> : null}
                    </div>
                  </div>
                  {linked ? <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 8, background: '#dcfce7', color: '#166534', fontWeight: 600, flexShrink: 0 }}>연결됨</span> : null}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <UnsavedConfirm
        open={confirmOpen}
        onDiscard={() => {
          setConfirmOpen(false);
          setEditMode(false);
          onClose();
        }}
        onSave={() => {
          setConfirmOpen(false);
          handleSave();
        }}
      />
      <ConfirmModal
        open={!!kindChangeConfirm}
        title="점검세부분류 변경"
        msg="다른 점검 세부분류를 선택하시는 경우 모든 점검항목이 초기화 됩니다."
        okLabel="확인"
        danger={false}
        onOk={() => {
          setField('inspKind', kindChangeConfirm);
          setInspItems([]);
          setNextId(1);
          setItemFilter('');
          setKindChangeConfirm(null);
        }}
        onCancel={() => setKindChangeConfirm(null)}
      />
      <ConfirmModal
        open={deleteConfirm}
        title="점검표 삭제"
        msg="선택한 점검표를 삭제하시겠습니까?"
        onOk={() => {
          if (item) onDeleted?.(item.id);
          setDeleteConfirm(false);
        }}
        onCancel={() => setDeleteConfirm(false)}
      />

      <SidePanel open={open} onClose={handleCancel} title={isNew ? '점검표 추가' : '점검표 상세'} width={showPreview ? 1220 : 640} noScroll>
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {showPreview ? (
            <div style={{ flex: 1, borderRight: `1px solid ${C.brd}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px 12px', borderBottom: `1px solid ${C.brd}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#FAFBFC' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.txH }}>점검표 미리보기</span>
                <span style={{ fontSize: 12, color: C.txL, background: '#F0F5FF', padding: '2px 8px', borderRadius: 10, border: `1px solid ${C.priL}` }}>실시간 반영</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                <div style={{ border: `1px solid ${C.brd}`, borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
                  <PreviewDoc />
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ flex: '0 0 640px', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {!isNew ? (
                <div style={{ display: 'flex', borderBottom: `2px solid ${C.brd}`, marginBottom: 18, gap: 0 }}>
                  {[
                    ['info', '기본 정보'],
                    ['res', '연결 자원'],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as 'info' | 'res')}
                      style={{ padding: '8px 20px', fontSize: 12, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === key ? `2px solid ${C.pri}` : '2px solid transparent', marginBottom: -2, color: activeTab === key ? C.pri : C.txL }}
                    >
                      {label}
                      {key === 'res' && linkedResIds.length > 0 ? (
                        <span style={{ marginLeft: 6, fontSize: 12, padding: '1px 7px', borderRadius: 10, background: activeTab === key ? C.pri : C.brd, color: activeTab === key ? '#fff' : C.txS }}>{linkedResIds.length}</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}

              {isNew || activeTab === 'info' ? renderEditForm() : null}
              {!isNew && activeTab === 'res' ? renderResourceTab() : null}
            </div>

            <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
              {!isNew && readOnly && linkedResIds.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, padding: '8px 12px', borderRadius: 6, background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="10" cy="10" r="8" />
                    <path d="M10 6v4M10 14h.01" />
                  </svg>
                  <span style={{ color: '#9A3412', fontSize: 12 }}>연결된 자원이 있어 삭제할 수 없습니다. 연결 자원 탭에서 해제한 후 삭제하세요.</span>
                </div>
              ) : null}

              <div style={{ display: 'flex', alignItems: 'center' }}>
                {activeTab === 'info' ? (
                  isNew || editMode ? (
                    <>
                      <Button onClick={handleCancel}>취소</Button>
                      <Button primary onClick={() => setShowPreview((prev) => !prev)} style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                        {showPreview ? '미리보기 닫기' : '점검표 미리보기'}
                      </Button>
                      <div style={{ flex: 1 }} />
                      <Button primary onClick={handleSave}>
                        {isNew ? '등록' : '저장'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={onClose}>닫기</Button>
                      <Button primary onClick={() => setShowPreview((prev) => !prev)} style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                        {showPreview ? '미리보기 닫기' : '점검표 미리보기'}
                      </Button>
                      <div style={{ flex: 1 }} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button danger disabled={linkedResIds.length > 0} onClick={() => linkedResIds.length === 0 && setDeleteConfirm(true)}>
                          삭제
                        </Button>
                        <Button success onClick={() => setEditMode(true)}>
                          수정
                        </Button>
                      </div>
                    </>
                  )
                ) : (
                  <>
                    <Button onClick={onClose}>닫기</Button>
                    <Button primary onClick={() => setShowPreview((prev) => !prev)} style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                      {showPreview ? '미리보기 닫기' : '점검표 미리보기'}
                    </Button>
                    <div style={{ flex: 1 }} />
                    <Button primary onClick={onClose}>
                      저장
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidePanel>
    </>
  );
}
