'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal, UnsavedConfirm } from '@/components/ui/ConfirmModal';
import { DateTimePicker } from '@/components/ui/DatePicker';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { FormInput, FormTextarea } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { Toggle } from '@/components/ui/Toggle';
import { colors } from '@/lib/theme/colors';
import { useEditPanel } from '@/lib/hooks/use-edit-panel';
import type { Notice } from '@/types/notice';

interface NoticePanelProps {
  open: boolean;
  onClose: () => void;
  item?: Notice | null;
  viewOnly?: boolean;
  onSave?: (notice: Notice) => void;
  onDelete?: (notice: Notice) => void;
}

const nowDt = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

export function NoticePanel({ open, onClose, item, viewOnly = false, onSave, onDelete }: NoticePanelProps) {
  const isNew = !item;
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    st: '사용',
    title: '',
    content: '',
    scope: '전체',
    banner: 'N',
    startDt: nowDt(),
    endDt: '2050-12-31 23:59',
    registrant: '',
    regDt: '',
    attachFile: null as null | { name: string; size?: number | null },
  });

  const { editMode, confirmOpen, startEdit, handleSave, handleCancel, setConfirmOpen } = useEditPanel(open, onClose);

  useEffect(() => {
    if (!open) return;
    if (item) {
      setForm({
        st: '사용',
        title: item.title,
        content: item.content || '',
        scope: item.scope || '전체',
        banner: item.banner || 'N',
        startDt: `${item.dt} 00:00`,
        endDt: '2050-12-31 23:59',
        registrant: item.user || '관리자',
        regDt: item.dt,
        attachFile: item.file ? { name: item.file, size: null } : null,
      });
      return;
    }
    setForm({
      st: '사용',
      title: '',
      content: '',
      scope: '전체',
      banner: 'N',
      startDt: nowDt(),
      endDt: '2050-12-31 23:59',
      registrant: '관리자',
      regDt: nowDt().slice(0, 10),
      attachFile: null,
    });
  }, [open, item]);

  const ro = !!item && !editMode;

  const setField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveNotice = () => {
    if (!form.title.trim()) return;
    const next: Notice = {
      id: item?.id ?? Date.now(),
      title: form.title.trim(),
      content: form.content,
      user: item?.user || form.registrant || '관리자',
      dt: item?.dt || form.regDt || nowDt().slice(0, 10),
      views: item?.views ?? 0,
      scope: form.scope,
      file: form.attachFile?.name,
      banner: form.banner as 'Y' | 'N',
    };
    onSave?.(next);
    handleSave();
    onClose();
  };

  const attachFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setField('attachFile', { name: file.name, size: file.size });
    }
    event.target.value = '';
  };

  if (viewOnly && item) {
    return (
      <SidePanel open={open} onClose={onClose} title="공지사항 상세" width={580} noScroll>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: '14px 16px', background: '#fff', position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                top: 12,
                right: 14,
                fontSize: 12,
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: 10,
                background: 'rgba(59,130,246,0.10)',
                color: colors.primary,
                border: '1px solid rgba(59,130,246,0.22)',
              }}
            >
              {item.scope || '전체'}
            </span>
            <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 4 }}>공지사항</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.textHeading, paddingRight: 96, lineHeight: 1.4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: colors.textLight, marginTop: 4 }}>
              {[item.user, item.dt].filter(Boolean).join(' · ')}
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 11, color: colors.textLight, marginBottom: 6 }}>내용</div>
              <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{item.content || '—'}</div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 11, color: colors.textLight, marginBottom: 6 }}>첨부파일</div>
              {item.file ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: `1px solid ${colors.border}`, borderRadius: 6, background: '#F9FAFC' }}>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{item.file}</span>
                  <span style={{ fontSize: 12, color: colors.primary, fontWeight: 600 }}>다운로드</span>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: colors.textLight }}>첨부파일 없음</div>
              )}
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${colors.border}`, flexShrink: 0 }}>
          <Button onClick={onClose}>닫기</Button>
        </div>
      </SidePanel>
    );
  }

  return (
    <>
      <SidePanel
        open={open}
        onClose={() => {
          if (editMode || isNew) {
            setConfirmOpen(true);
            return;
          }
          onClose();
        }}
        title={isNew ? '공지사항 등록' : '공지사항 상세'}
        width={580}
        noScroll
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="공지사항 정보" />
            <FormRow label="사용유무">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Toggle on={form.st === '사용'} onClick={() => !ro && setField('st', form.st === '사용' ? '미사용' : '사용')} disabled={ro} />
                <span style={{ fontSize: 13, fontWeight: 500, color: form.st === '사용' ? colors.primary : colors.textLight }}>{form.st}</span>
              </div>
            </FormRow>

            <FormRow label="제목" required>
              <FormInput value={form.title} onChange={(e) => setField('title', e.target.value)} readOnly={ro} />
            </FormRow>

            <FormRow label="내용">
              <FormTextarea
                value={form.content}
                onChange={(e) => setField('content', e.target.value)}
                readOnly={ro}
                style={{ minHeight: 200, ...(ro ? { resize: 'none', background: '#F9FAFC' } : {}) }}
              />
            </FormRow>

            <FormRow label="첨부파일">
              {form.attachFile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: `1px solid ${colors.border}`, borderRadius: 6, background: '#F9FAFC' }}>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{form.attachFile.name}</span>
                  {!ro ? (
                    <span onClick={() => setField('attachFile', null)} style={{ cursor: 'pointer', color: colors.textLight, fontSize: 18, lineHeight: 1 }}>
                      ×
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: colors.primary, fontWeight: 600 }}>다운로드</span>
                  )}
                </div>
              ) : ro ? (
                <div style={{ padding: '8px 12px', border: `1px solid ${colors.border}`, borderRadius: 6, background: '#F9FAFC', fontSize: 12, color: colors.textLight }}>첨부파일 없음</div>
              ) : (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    border: `2px dashed ${colors.border}`,
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: '#fff',
                  }}
                >
                  <span style={{ fontSize: 12, color: colors.textLight }}>파일을 선택하거나 드래그하세요</span>
                  <span style={{ fontSize: 12, color: colors.textLight, marginLeft: 'auto' }}>PDF, DOCX, XLSX, HWP</span>
                  <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.hwp" style={{ display: 'none' }} onChange={attachFile} />
                </label>
              )}
            </FormRow>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="게시 시작일" half>
                <DateTimePicker value={form.startDt} onChange={(value) => setField('startDt', value)} readOnly={ro} />
              </FormRow>
              <FormRow label="게시 종료일" half>
                <DateTimePicker value={form.endDt} onChange={(value) => setField('endDt', value)} readOnly={ro} />
              </FormRow>
            </div>

            <FormRow label="배너공지">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Toggle on={form.banner === 'Y'} onClick={() => !ro && setField('banner', form.banner === 'Y' ? 'N' : 'Y')} disabled={ro} />
                <span style={{ fontSize: 13, fontWeight: 500, color: form.banner === 'Y' ? colors.primary : colors.textLight }}>{form.banner === 'Y' ? '사용' : '미사용'}</span>
              </div>
            </FormRow>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="등록자" style={{ flex: 1 }}>
                <FormInput value={form.registrant} readOnly style={{ background: '#F9FAFC', pointerEvents: 'none' }} />
              </FormRow>
              <FormRow label="등록일" style={{ flex: 1 }}>
                <FormInput value={form.regDt} readOnly style={{ background: '#F9FAFC', pointerEvents: 'none' }} />
              </FormRow>
              <FormRow label="조회수" style={{ flex: 1 }}>
                <FormInput value={String(item?.views ?? 0)} readOnly style={{ background: '#F9FAFC', pointerEvents: 'none' }} />
              </FormRow>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${colors.border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isNew || editMode ? (
              <>
                <Button onClick={handleCancel}>취소</Button>
                <div style={{ flex: 1 }} />
                <Button primary onClick={saveNotice}>{isNew ? '등록' : '저장'}</Button>
              </>
            ) : (
              <>
                <Button onClick={onClose}>닫기</Button>
                <div style={{ flex: 1 }} />
                <Button danger onClick={() => setDeleteConfirm(true)}>삭제</Button>
                <Button success style={{ marginLeft: 8 }} onClick={startEdit}>
                  수정
                </Button>
              </>
            )}
          </div>
        </div>
      </SidePanel>

      <UnsavedConfirm open={confirmOpen} onDiscard={onClose} onSave={saveNotice} />
      <ConfirmModal
        open={deleteConfirm}
        title="공지사항 삭제"
        msg={
          <>
            <strong>{item?.title}</strong> 공지를 삭제하시겠습니까?
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
    </>
  );
}
