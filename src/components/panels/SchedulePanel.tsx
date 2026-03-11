'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal, UnsavedConfirm } from '@/components/ui/ConfirmModal';
import { DatePicker } from '@/components/ui/DatePicker';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { FormInput, FormSelect } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { Toggle } from '@/components/ui/Toggle';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/lib/theme/colors';
import { CL_INIT } from '@/data/checklists';
import { RES } from '@/data/resources';
import { SYS } from '@/data/manager';
import type { Schedule } from '@/types/schedule';

interface SchedulePanelProps {
  open: boolean;
  onClose: () => void;
  item: Schedule | null;
  onAdd?: (form: Schedule & Record<string, unknown>) => void;
  onUpdate?: (form: Schedule & Record<string, unknown>) => void;
  onDelete?: (item: Schedule) => void;
}

const FREQ_OPTS = ['상시', '매일', '매주', '매월', '분기', '반기', '연간'];
const FREQ_COLOR: Record<string, string> = {
  상시: '#0891B2',
  매일: '#0C8CE9',
  매주: '#19973C',
  매월: '#F36D00',
  분기: '#7C3AED',
  반기: '#E24949',
  연간: '#333333',
};

const emptyForm = {
  nm: '',
  st: '사용',
  clId: '',
  sysId: '',
  resources: [] as number[],
  _resCat: '',
  _resSmall: '',
  _resSearch: '',
  freq: '매일',
  batchStartTime: '06:00',
  batchMin: 30,
  rptDdlnHr: 24,
  startDt: new Date().toISOString().slice(0, 10),
  lastRunDt: '',
  nextRunDt: '',
};

export function SchedulePanel({ open, onClose, item, onAdd, onUpdate, onDelete }: SchedulePanelProps) {
  const isNew = !item;
  const [form, setForm] = useState({ ...emptyForm });
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const initialRef = useRef({ ...emptyForm });

  useEffect(() => {
    if (!open) return;
    const loaded = item
      ? (() => {
          const sysId = SYS.find((sys) => sys.nm === item.sysNm)?.id || '';
          const clId = String(CL_INIT.find((cl) => cl.nm === item.clNm)?.id || '');
          const resources = RES.filter((res) => (sysId ? res.sysId === sysId : true))
            .slice(0, item.resCnt || 0)
            .map((res) => res.id);
          return {
            ...emptyForm,
            nm: item.nm || '',
            st: item.useYn === 'N' ? '미사용' : '사용',
            clId,
            sysId,
            resources,
            freq: item.freq || '매일',
            batchStartTime: item.batchStartTime || '06:00',
            batchMin: item.batchMin || 30,
            rptDdlnHr: item.rptDdlnHr ?? 24,
            startDt: (item as unknown as Record<string, string>).startDt || new Date().toISOString().slice(0, 10),
            lastRunDt: (item as unknown as Record<string, string>).last || '',
            nextRunDt: item.next || '',
          };
        })()
      : { ...emptyForm, startDt: new Date().toISOString().slice(0, 10) };

    setForm(loaded);
    initialRef.current = loaded;
    setEditMode(false);
    setConfirmOpen(false);
    setDeleteConfirm(false);
    setErrors({});
  }, [open, item]);

  const ro = !!item && !editMode;

  const setField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const summaryText = (() => {
    if (!form.startDt) return `${form.freq} 배치`;
    const start = new Date(form.startDt);
    if (Number.isNaN(start.getTime())) return `${form.freq} 배치`;
    const month = String(start.getMonth() + 1).padStart(2, '0');
    const day = String(start.getDate()).padStart(2, '0');
    const week = ['일', '월', '화', '수', '목', '금', '토'][start.getDay()];
    if (form.freq === '매주') return `매주 ${week}요일 배치 (${month}/${day} 시작)`;
    if (form.freq === '매월') return `매월 ${start.getDate()}일 배치 (${month}/${day} 시작)`;
    if (form.freq === '분기') return `분기 배치 (${month}/${day} 시작)`;
    if (form.freq === '반기') return `반기 배치 (${month}/${day} 시작)`;
    if (form.freq === '연간') return `매년 ${start.getMonth() + 1}월 ${start.getDate()}일 배치`;
    if (form.freq === '상시') return `상시 배치 (${month}/${day} 시작)`;
    return `매일 배치 (${month}/${day} 시작)`;
  })();

  const selectedChecklist =
    CL_INIT.find((cl) => String(cl.id) === String(form.clId)) ||
    CL_INIT.find((cl) => {
      const first = RES.find((res) => res.id === form.resources[0]);
      return first && cl.sub === first.mid;
    }) ||
    null;

  const resBySystem = form.sysId ? RES.filter((res) => res.sysId === form.sysId) : RES;
  const midOptions = Array.from(new Set(resBySystem.map((res) => res.mid))).sort();
  const smallOptions = Array.from(
    new Set(
      resBySystem
        .filter((res) => (!form._resCat ? true : res.mid === form._resCat))
        .map((res) => res.small)
        .filter(Boolean),
    ),
  ).sort();

  const availableResources = resBySystem.filter((res) => {
    if (form.resources.includes(res.id)) return false;
    if (form._resCat && res.mid !== form._resCat) return false;
    if (form._resSmall && res.small !== form._resSmall) return false;
    if (form._resSearch) {
      const q = form._resSearch.toLowerCase();
      if (!res.nm.toLowerCase().includes(q) && !(res.ip || '').includes(q)) return false;
    }
    return true;
  });

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.nm.trim()) nextErrors.nm = '스케줄 명은 필수입니다.';
    if (!form.startDt) nextErrors.startDt = '시작일은 필수입니다.';
    if (!form.batchStartTime) nextErrors.batchStartTime = '배치시작시간은 필수입니다.';
    if (!form.sysId) nextErrors.sysId = '정보시스템을 선택하세요.';
    if (form.resources.length === 0) nextErrors.resources = '대상 자원을 1개 이상 선택하세요.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const savePanel = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      clId: String(form.clId || selectedChecklist?.id || ''),
      useYn: form.st === '사용' ? 'Y' : 'N',
      resCnt: form.resources.length,
      next: form.nextRunDt || '',
    };
    if (isNew) {
      onAdd?.(payload as unknown as Schedule & Record<string, unknown>);
      onClose();
      return;
    }
    onUpdate?.(payload as unknown as Schedule & Record<string, unknown>);
    initialRef.current = payload;
    setForm(payload);
    setEditMode(false);
  };

  const discardChanges = () => {
    setConfirmOpen(false);
    if (isNew) {
      onClose();
      return;
    }
    setForm(initialRef.current);
    setEditMode(false);
  };

  const requestClose = () => {
    if (isNew || editMode) {
      setConfirmOpen(true);
      return;
    }
    onClose();
  };

  const toggleResource = (resId: number, link: boolean) => {
    const resource = RES.find((entry) => entry.id === resId);
    if (!resource) return;
    const nextResources = link ? [...form.resources, resId] : form.resources.filter((id) => id !== resId);
    const recommendedChecklist = CL_INIT.find((cl) => cl.sub === resource.mid);
    setForm((prev) => ({
      ...prev,
      resources: nextResources,
      clId: link
        ? String(prev.clId || recommendedChecklist?.id || '')
        : nextResources.length === 0
          ? ''
          : prev.clId,
    }));
    setErrors((prev) => ({ ...prev, resources: '' }));
  };

  return (
    <>
      <SidePanel
        open={open}
        onClose={requestClose}
        onOverlayClick={requestClose}
        title={isNew ? '점검스케줄 추가' : '점검스케줄 상세'}
        width={580}
        noScroll
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 6,
              background: `${FREQ_COLOR[form.freq] || colors.primary}0D`,
              border: `1px solid ${(FREQ_COLOR[form.freq] || colors.primary)}33`,
              marginBottom: 16,
            }}
          >
            <Icon name="info" size={13} color={FREQ_COLOR[form.freq] || colors.primary} />
            <span style={{ fontSize: 12, color: FREQ_COLOR[form.freq] || colors.primary, fontWeight: 600 }}>{summaryText}</span>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="스케줄 정보" />

            <FormRow label="사용유무">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Toggle on={form.st === '사용'} onClick={() => !ro && setField('st', form.st === '사용' ? '미사용' : '사용')} disabled={ro} />
                <span style={{ fontSize: 13, fontWeight: 500, color: form.st === '사용' ? colors.primary : colors.textLight }}>{form.st}</span>
              </div>
            </FormRow>

            <FormRow label="스케줄 명" required>
              <FormInput value={form.nm} onChange={(e) => setField('nm', e.target.value)} readOnly={ro} style={errors.nm ? { borderColor: colors.red } : undefined} />
              {errors.nm ? <div style={{ fontSize: 11, color: colors.red, marginTop: 3 }}>{errors.nm}</div> : null}
            </FormRow>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: colors.textSecondary, marginBottom: 6, display: 'block' }}>
                실행주기 <span style={{ color: colors.red }}>*</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {FREQ_OPTS.map((freq) => {
                  const active = form.freq === freq;
                  const color = FREQ_COLOR[freq] || colors.primary;
                  return (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => !ro && setField('freq', freq)}
                      style={{
                        padding: '5px 16px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        border: `1.5px solid ${active ? color : colors.border}`,
                        background: active ? `${color}1A` : '#fff',
                        color: active ? color : colors.textSecondary,
                        cursor: ro ? 'default' : 'pointer',
                      }}
                    >
                      {freq}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="시작일" required style={{ flex: 1 }}>
                <DatePicker value={form.startDt} onChange={(value) => setField('startDt', value)} readOnly={ro} />
                {errors.startDt ? <div style={{ fontSize: 11, color: colors.red, marginTop: 3 }}>{errors.startDt}</div> : null}
              </FormRow>
              <FormRow label="배치시작시간" required style={{ flex: 1 }}>
                <FormInput type="time" value={form.batchStartTime} onChange={(e) => setField('batchStartTime', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="예상소요시간(분)" required style={{ flex: 1 }}>
                <FormInput
                  type="number"
                  min={10}
                  max={300}
                  value={form.batchMin}
                  onChange={(e) => setField('batchMin', Number(e.target.value || 0))}
                  readOnly={ro}
                />
              </FormRow>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="정보시스템" required style={{ flex: 1 }}>
                <FormSelect value={form.sysId} onChange={(e) => setField('sysId', e.target.value)} disabled={ro}>
                  <option value="">선택하세요</option>
                  {SYS.map((sys) => (
                    <option key={sys.id} value={sys.id}>
                      {sys.nm}
                    </option>
                  ))}
                </FormSelect>
                {errors.sysId ? <div style={{ fontSize: 11, color: colors.red, marginTop: 3 }}>{errors.sysId}</div> : null}
              </FormRow>
              <FormRow label="연결 점검표" style={{ flex: 1 }}>
                <div
                  style={{
                    minHeight: 36,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 4,
                    background: '#F9FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: 12,
                    color: selectedChecklist ? colors.text : colors.textLight,
                  }}
                >
                  {selectedChecklist ? `${selectedChecklist.nm} (${selectedChecklist.sub || '공통'})` : '선택된 자원 기준 자동 연결'}
                </div>
              </FormRow>
              <FormRow label="보고기한(시간)" style={{ flex: 1 }}>
                <FormInput
                  type="number"
                  min={1}
                  max={240}
                  value={form.rptDdlnHr}
                  onChange={(e) => setField('rptDdlnHr', Number(e.target.value || 0))}
                  readOnly={ro}
                />
              </FormRow>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="대상 자원 정보" />
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary }}>선택된 자원</div>
                  <span style={{ fontSize: 11, color: colors.textLight }}>{form.resources.length}개</span>
                </div>
                <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, minHeight: 120, overflow: 'hidden', background: '#FAFCFF' }}>
                  {form.resources.length === 0 ? (
                    <div style={{ padding: '26px 12px', textAlign: 'center', fontSize: 12, color: colors.textLight }}>
                      {ro ? '연결된 자원이 없습니다.' : '오른쪽 목록에서 자원을 선택하세요.'}
                    </div>
                  ) : (
                    <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                      {form.resources.map((resId) => {
                        const resource = RES.find((entry) => entry.id === resId);
                        const checklist = resource ? CL_INIT.find((cl) => cl.sub === resource.mid) : null;
                        if (!resource) return null;
                        return (
                          <div
                            key={resId}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '8px 10px',
                              borderBottom: `1px solid ${colors.border}`,
                              fontSize: 12,
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, color: colors.primaryDark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {resource.nm}
                              </div>
                              <div style={{ fontSize: 11, color: colors.textLight, marginTop: 1 }}>
                                {resource.mid} · {resource.small || '—'} · {resource.ip || '—'}
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: 11,
                                padding: '1px 6px',
                                borderRadius: 6,
                                fontWeight: 600,
                                background: checklist ? '#dcfce7' : '#F3F4F6',
                                color: checklist ? '#166534' : colors.textLight,
                              }}
                            >
                              {checklist ? checklist.nm : '—'}
                            </span>
                            {!ro ? (
                              <span
                                onClick={() => toggleResource(resId, false)}
                                style={{ cursor: 'pointer', fontSize: 15, color: colors.textLight, lineHeight: 1 }}
                              >
                                ×
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {errors.resources ? <div style={{ fontSize: 11, color: colors.red, marginTop: 3 }}>{errors.resources}</div> : null}
              </div>

              {!ro ? (
                <div style={{ flex: '0 0 54%', minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 6 }}>자원 검색</div>
                  <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ padding: '7px 8px', background: '#F9FAFC', display: 'flex', gap: 5, borderBottom: `1px solid ${colors.border}` }}>
                      <FormSelect value={form.sysId} onChange={(e) => setField('sysId', e.target.value)} style={{ flex: 1, minWidth: 0, fontSize: 12, padding: '3px 6px' }}>
                        <option value="">정보시스템</option>
                        {SYS.map((sys) => (
                          <option key={sys.id} value={sys.id}>
                            {sys.nm}
                          </option>
                        ))}
                      </FormSelect>
                      <FormSelect value={form._resCat} onChange={(e) => setField('_resCat', e.target.value)} style={{ flex: 1, minWidth: 0, fontSize: 12, padding: '3px 6px' }}>
                        <option value="">중분류</option>
                        {midOptions.map((mid) => (
                          <option key={mid} value={mid}>
                            {mid}
                          </option>
                        ))}
                      </FormSelect>
                      <FormSelect value={form._resSmall} onChange={(e) => setField('_resSmall', e.target.value)} style={{ flex: 1, minWidth: 0, fontSize: 12, padding: '3px 6px' }}>
                        <option value="">소분류</option>
                        {smallOptions.map((small) => (
                          <option key={small} value={small}>
                            {small}
                          </option>
                        ))}
                      </FormSelect>
                    </div>
                    <div style={{ padding: '6px 8px', background: '#F9FAFC', borderBottom: `1px solid ${colors.border}` }}>
                      <div style={{ position: 'relative' }}>
                        <FormInput
                          value={form._resSearch}
                          onChange={(e) => setField('_resSearch', e.target.value)}
                          placeholder="자원명 또는 IP 검색"
                          style={{ width: '100%', padding: '3px 6px 3px 22px', fontSize: 12 }}
                        />
                        <span style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <Icon name="search" size={11} color={colors.textLight} />
                        </span>
                      </div>
                    </div>
                    <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                      {availableResources.length === 0 ? (
                        <div style={{ padding: 18, textAlign: 'center', fontSize: 12, color: colors.textLight }}>추가 가능한 자원이 없습니다.</div>
                      ) : (
                        availableResources.map((resource) => {
                          const checklist = CL_INIT.find((cl) => cl.sub === resource.mid);
                          return (
                            <div
                              key={resource.id}
                              onClick={() => toggleResource(resource.id, true)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '7px 10px',
                                borderBottom: `1px solid ${colors.border}`,
                                cursor: 'pointer',
                                fontSize: 12,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f0fdf4';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#fff';
                              }}
                            >
                              <span style={{ color: colors.primary, fontWeight: 700, fontSize: 14 }}>+</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resource.nm}</div>
                                <div style={{ fontSize: 11, color: colors.textLight, marginTop: 1 }}>
                                  {resource.mid} · {resource.small || '—'} · {resource.ip || '—'}
                                </div>
                              </div>
                              <span
                                style={{
                                  fontSize: 11,
                                  padding: '1px 6px',
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  background: checklist ? '#dcfce7' : '#F3F4F6',
                                  color: checklist ? '#166534' : colors.textLight,
                                }}
                              >
                                {checklist ? checklist.nm : '점검표 없음'}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                    {availableResources.length > 0 ? (
                      <div style={{ padding: '4px 10px', fontSize: 11, color: colors.textLight, textAlign: 'center', background: '#F9FAFC', borderTop: `1px solid ${colors.border}` }}>
                        {availableResources.length}개 추가 가능
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {ro ? (
            <div style={{ marginBottom: 18 }}>
              <SectionTitle label="수행 이력" />
              <div style={{ display: 'flex', gap: 12 }}>
                <FormRow label="마지막 수행 일시" half>
                  <FormInput value={form.lastRunDt || '—'} readOnly style={{ background: '#F9FAFC', pointerEvents: 'none' }} />
                </FormRow>
                <FormRow label="다음 수행 예정일" half>
                  <FormInput value={form.nextRunDt || '—'} readOnly style={{ background: '#F9FAFC', pointerEvents: 'none' }} />
                </FormRow>
              </div>
            </div>
          ) : null}
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${colors.border}`, flexShrink: 0 }}>
          {!isNew && !editMode && form.resources.length > 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 10,
                padding: '8px 12px',
                borderRadius: 6,
                background: '#FFF7ED',
                border: '1px solid #FED7AA',
              }}
            >
              <Icon name="alert" size={13} color="#EA580C" />
              <span style={{ color: '#9A3412', fontSize: 12 }}>연결된 자원이 있어 삭제할 수 없습니다. 자원 연결을 해제한 후 삭제하세요.</span>
            </div>
          ) : null}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isNew || editMode ? (
              <>
                <Button onClick={requestClose}>취소</Button>
                <div style={{ flex: 1 }} />
                <Button primary onClick={savePanel}>{isNew ? '등록' : '저장'}</Button>
              </>
            ) : (
              <>
                <Button onClick={onClose}>닫기</Button>
                <div style={{ flex: 1 }} />
                <Button danger disabled={form.resources.length > 0} onClick={() => form.resources.length === 0 && setDeleteConfirm(true)} style={{ marginRight: 8 }}>
                  삭제
                </Button>
                <Button success onClick={() => setEditMode(true)}>수정</Button>
              </>
            )}
          </div>
        </div>
      </SidePanel>

      <ConfirmModal
        open={deleteConfirm}
        title="스케줄 삭제"
        msg={
          <>
            <strong>{item?.nm}</strong> 스케줄이 영구적으로 삭제됩니다.
          </>
        }
        okLabel="삭제"
        onOk={() => {
          if (item) onDelete?.(item);
          setDeleteConfirm(false);
          onClose();
        }}
        onCancel={() => setDeleteConfirm(false)}
      />
      <UnsavedConfirm open={confirmOpen} onDiscard={discardChanges} onSave={savePanel} />
    </>
  );
}
