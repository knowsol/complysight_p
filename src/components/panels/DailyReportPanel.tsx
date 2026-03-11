'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/FormRow';
import { SidePanel } from '@/components/ui/SidePanel';
import { colors } from '@/lib/theme/colors';
import { PRETENDARD_FONT } from '@/lib/theme/styles';
import type { DailyInspection } from '@/types/inspection';

interface DailyResultRow {
  id: number;
  nm: string;
  method: '자동' | '육안';
  std: string;
  val: string;
  result: '정상' | '비정상';
  errCode: string | null;
}

interface DailyReportPanelProps {
  open: boolean;
  onClose: () => void;
  item: DailyInspection | null;
}

const ERR_DETAIL_MAP: Record<string, { code: string; level: string; msg: string; cause: string; action: string }> = {
  'ERR-LOG-0023': {
    code: 'ERR-LOG-0023',
    level: 'ERROR',
    msg: 'Application exception: NullPointerException at line 342',
    cause: '로그 수집 중 애플리케이션 예외 발생',
    action: '해당 서비스 재시작 및 스택 트레이스 확인 필요',
  },
  'ERR-CPU-0011': {
    code: 'ERR-CPU-0011',
    level: 'WARNING',
    msg: 'CPU usage exceeded threshold: 91.2% (threshold: 80%)',
    cause: '배치 작업 집중으로 인한 CPU 부하 급증',
    action: '배치 스케줄 분산 또는 리소스 증설 검토',
  },
  'ERR-PORT-0004': {
    code: 'ERR-PORT-0004',
    level: 'CRITICAL',
    msg: 'Service port 8080 unreachable - connection refused',
    cause: 'WAS 프로세스 비정상 종료',
    action: '서비스 프로세스 재시작 및 원인 로그 확인',
  },
};

const LEVEL_STYLE: Record<string, [string, string]> = {
  CRITICAL: ['#7F1D1D', '#FEF2F2'],
  ERROR: ['#dc2626', '#FFF8F8'],
  WARNING: ['#D97706', '#FFFBEB'],
};

const REPORT_COLOR: Record<string, string> = {
  상시: '#0891B2',
  일일: '#0C8CE9',
  매일: '#0C8CE9',
  주간: '#19973C',
  매주: '#19973C',
  월간: '#F36D00',
  매월: '#F36D00',
  분기: '#7C3AED',
  반기: '#E24949',
  연간: '#333333',
};

const buildInspectionRows = (item: DailyInspection | null): DailyResultRow[] => {
  if (!item) return [];
  return [
    { id: 1, nm: 'CPU 사용률', method: '자동', std: '< 80%', val: '72%', result: '정상', errCode: null },
    { id: 2, nm: '메모리 사용률', method: '자동', std: '< 85%', val: '68%', result: '정상', errCode: null },
    { id: 3, nm: '디스크 사용률', method: '자동', std: '< 90%', val: '54%', result: '정상', errCode: null },
    { id: 4, nm: '서비스 포트 확인', method: '자동', std: 'OPEN', val: 'OPEN', result: '정상', errCode: null },
    { id: 5, nm: '로그 에러 확인', method: '자동', std: '0건', val: '3건', result: '비정상', errCode: 'ERR-LOG-0023' },
    { id: 6, nm: '보안패치 상태', method: '자동', std: '최신', val: '최신', result: '정상', errCode: null },
    { id: 7, nm: '서버 외관 상태', method: '육안', std: '이상없음', val: '이상없음', result: '정상', errCode: null },
    { id: 8, nm: '케이블 연결 상태', method: '육안', std: '정상연결', val: '정상연결', result: '정상', errCode: null },
    { id: 9, nm: 'LED 표시등 확인', method: '육안', std: 'Green', val: 'Yellow', result: '비정상', errCode: null },
  ];
};

export function DailyReportPanel({ open, onClose, item }: DailyReportPanelProps) {
  const [showPreview, setShowPreview] = useState(false);
  const inspItems = useMemo(() => buildInspectionRows(item), [item]);
  const normalCnt = inspItems.filter((row) => row.result === '정상').length;
  const abnCnt = inspItems.filter((row) => row.result === '비정상').length;
  const autoItems = inspItems.filter((row) => row.method === '자동');
  const eyeItems = inspItems.filter((row) => row.method === '육안');
  const eyeItemPhotos = ((item as Record<string, unknown> | null)?.eyeItemPhotos || {}) as Record<string, { id: number; label: string; color: string }[]>;
  const rptType = item?.rptType || item?.freq || '일일';
  const rptColor = REPORT_COLOR[rptType] || '#333333';

  const handleDownload = () => {
    if (typeof window === 'undefined') return;
    const previewHtml = document.getElementById('report-preview-content')?.innerHTML || '<p>미리보기를 먼저 열어주세요.</p>';
    const popup = window.open('', '_blank');
    if (!popup) return;
    popup.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>점검보고서_${item?.resNm || 'report'}</title><style>body{font-family:${PRETENDARD_FONT};margin:20px;}table{border-collapse:collapse;width:100%;}*{box-sizing:border-box;}</style></head><body>${previewHtml}</body></html>`,
    );
    popup.document.close();
    window.setTimeout(() => popup.print(), 300);
  };

  const ReportPreview = () => {
    const groups = inspItems.reduce<Record<string, DailyResultRow[]>>((acc, row) => {
      const key = row.method === '육안' ? '육안점검' : '자동점검';
      acc[key] ||= [];
      acc[key].push(row);
      return acc;
    }, {});
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
    const thLt = (extra: React.CSSProperties = {}): React.CSSProperties => ({
      padding: '6px 10px',
      border: '1px solid #333',
      background: '#c8d8e8',
      color: '#1a3a5c',
      fontSize: 12,
      fontWeight: 700,
      ...extra,
    });
    const td = (extra: React.CSSProperties = {}): React.CSSProperties => ({
      padding: '6px 10px',
      border: '1px solid #aaa',
      fontSize: 12,
      verticalAlign: 'middle',
      ...extra,
    });
    const secH = (extra: React.CSSProperties = {}): React.CSSProperties => ({
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
      <div style={{ fontFamily: PRETENDARD_FONT, background: '#fff', padding: '20px 24px', color: '#111' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 10, color: '#1a3a5c', borderBottom: '3px solid #1a3a5c', paddingBottom: 8, marginBottom: 4 }}>
            일 상 점 검 보 고 서
          </div>
          <div style={{ fontSize: 12, color: '#444', marginTop: 6 }}>
            {item?.clNm} | {item?.execDt?.slice(0, 10)}
          </div>
        </div>

        <div style={secH({ marginBottom: 0 })}>SITE INFORMATION</div>
        <table style={{ ...tbl, marginBottom: 10 }}>
          <tbody>
            <tr>
              <td style={thLt({ width: '18%' })}>정보시스템</td>
              <td style={td({ width: '32%' })}>{item?.sysNm}</td>
              <td style={thLt({ width: '18%' })}>대상자원</td>
              <td style={td({ width: '32%' })}>{item?.resNm}</td>
            </tr>
            <tr>
              <td style={thLt()}>점검자</td>
              <td style={td()}>{item?.insp}</td>
              <td style={thLt()}>점검일시</td>
              <td style={td()}>{item?.execDt}</td>
            </tr>
            <tr>
              <td style={thLt()}>점검표</td>
              <td style={td()}>{item?.clNm}</td>
              <td style={thLt()}>보고일시</td>
              <td style={td()}>{item?.submitDt && item.submitDt !== '-' ? item.submitDt : '—'}</td>
            </tr>
          </tbody>
        </table>

        <div style={secH({ marginBottom: 0 })}>SYSTEM DETAIL CHECK</div>
        {Object.entries(groups).map(([group, rows]) => (
          <div key={group}>
            <table style={tbl}>
              <thead>
                <tr>
                  {['점검 항목', '방식', '기준값', '결과값', '점검결과'].map((label, index) => (
                    <th key={label} style={th({ width: index === 0 ? '28%' : index === 1 ? '10%' : '16%' })}>
                      {label}
                    </th>
                  ))}
                </tr>
                <tr>
                  <td colSpan={5} style={{ padding: '4px 10px', border: '1px solid #aaa', background: '#e8f0f8', color: '#1a3a5c', fontWeight: 700 }}>
                    [{group}]
                  </td>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isAbn = row.result === '비정상';
                  const isEye = row.method === '육안';
                  return (
                    <tr key={row.id} style={{ background: isAbn ? '#FFF0F0' : '#fff' }}>
                      <td style={td({ fontWeight: 600 })}>{row.nm}</td>
                      <td style={td({ textAlign: 'center' })}>
                        <span style={{ padding: '1px 6px', borderRadius: 4, fontWeight: 600, background: isEye ? '#FEF3C7' : '#E0F2FE', color: isEye ? '#92400E' : '#0369A1' }}>
                          {row.method}
                        </span>
                      </td>
                      <td style={td({ textAlign: 'center', fontFamily: 'inherit' })}>{row.std}</td>
                      <td style={td({ textAlign: 'center', fontFamily: 'inherit', color: isAbn ? '#DC2626' : '#111', fontWeight: isAbn ? 700 : 400 })}>{row.val}</td>
                      <td style={td({ textAlign: 'center' })}>
                        {row.method === '자동' ? (
                          <span style={{ fontSize: 12, fontWeight: 700, color: isAbn ? '#DC2626' : '#16a34a' }}>{row.result}</span>
                        ) : (
                          <span style={{ fontSize: 12 }}>
                            {isAbn ? (
                              <span style={{ color: '#DC2626', fontWeight: 700 }}>□ 정상  ☑ 비정상</span>
                            ) : (
                              <span style={{ color: '#16a34a', fontWeight: 700 }}>☑ 정상  □ 비정상</span>
                            )}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        <div style={{ marginTop: 10, border: '1px solid #aaa' }}>
          <div style={{ padding: '5px 10px', background: '#e8f0f8', borderBottom: '1px solid #aaa', fontSize: 12, fontWeight: 700, color: '#1a3a5c' }}>[점검결과 요약]</div>
          <table style={tbl}>
            <tbody>
              <tr>
                <td style={thLt({ width: '18%', textAlign: 'center' })}>전체</td>
                <td style={td({ textAlign: 'center', fontWeight: 700 })}>{inspItems.length}건</td>
                <td style={thLt({ width: '18%', textAlign: 'center' })}>정상</td>
                <td style={td({ textAlign: 'center', fontWeight: 700, color: '#16a34a' })}>{normalCnt}건</td>
                <td style={thLt({ width: '18%', textAlign: 'center' })}>비정상</td>
                <td style={td({ textAlign: 'center', fontWeight: 700, color: abnCnt > 0 ? '#DC2626' : '#111' })}>{abnCnt}건</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 10, border: '1px solid #aaa' }}>
          <div style={{ padding: '5px 10px', background: '#e8f0f8', borderBottom: '1px solid #aaa', fontSize: 12, fontWeight: 700, color: '#1a3a5c' }}>[특이사항]</div>
          <div style={{ padding: '32px 10px 10px', fontSize: 12, color: item?.note ? '#c2410c' : '#aaa', fontStyle: item?.note ? 'normal' : 'italic' }}>{item?.note || '특이사항 없음'}</div>
        </div>

        <div style={{ marginTop: 16, border: '2px solid #1a3a5c', borderRadius: 4 }}>
          <div style={{ padding: '6px 0', background: '#1a3a5c', color: '#fff', textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 4 }}>
            상기와 같이 점검 하였음을 확인 합니다
          </div>
          <table style={tbl}>
            <tbody>
              <tr>
                <td style={td({ width: '15%', background: '#f5f5f5', fontWeight: 700 })}>점검자</td>
                <td style={td({ width: '35%' })}>{item?.insp}</td>
                <td style={td({ width: '15%', background: '#f5f5f5', fontWeight: 700 })}>확인자</td>
                <td style={td({ width: '35%' })}>
                  <span style={{ color: '#aaa' }}>(서명)</span>
                </td>
              </tr>
              <tr>
                <td style={td({ background: '#f5f5f5', fontWeight: 700 })}>소속/성명</td>
                <td style={td()}>    /    </td>
                <td style={td({ background: '#f5f5f5', fontWeight: 700 })}>부서/성명</td>
                <td style={td()}>
                  {'    /    '}
                  <span style={{ color: '#aaa' }}>(인)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!item) {
    return (
      <SidePanel open={open} onClose={onClose} title="점검 상세" width={560} noScroll>
        <div />
      </SidePanel>
    );
  }

  return (
    <SidePanel open={open} onClose={onClose} title="점검 상세" width={showPreview ? 1120 : 560} noScroll>
      <div style={{ display: 'flex', height: '100%' }}>
        {showPreview ? (
          <div style={{ flex: 1, minWidth: 0, borderRight: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px 12px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#FAFBFC' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.textHeading }}>보고서 미리보기</span>
              <span style={{ fontSize: 12, color: colors.textLight, background: '#F0F5FF', padding: '2px 8px', borderRadius: 10, border: `1px solid ${colors.primaryLight}` }}>실시간 반영</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              <div id="report-preview-content" style={{ border: `1px solid ${colors.border}`, borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
                <ReportPreview />
              </div>
            </div>
          </div>
        ) : null}

        <div style={{ flex: '0 0 560px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: '14px 16px', marginBottom: 18, background: '#fff', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 12, right: 14, display: 'inline-block', padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: `${rptColor}1A`, color: rptColor, border: `1px solid ${rptColor}33` }}>
                {rptType}
              </span>
              <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 4 }}>대상 자원</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: colors.textHeading, marginBottom: 4 }}>{item.resNm}</div>
              <div style={{ fontSize: 12, color: colors.textLight }}>
                {[item.mid, String((item as Record<string, unknown>).ip || ''), item.sysNm].filter(Boolean).join(' · ')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', marginTop: 12, paddingTop: 10, borderTop: `1px solid ${colors.border}` }}>
                {[
                  ['점검표', item.clNm],
                  ['점검자', item.insp],
                  ['수행일시', item.execDt],
                  ['제출일시', item.submitDt && item.submitDt !== '-' ? item.submitDt : '-'],
                ].map(([label, value]) => (
                  <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12, color: colors.textLight }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <SectionTitle label="점검결과 요약" style={{ marginBottom: 0 }} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[
                ['정상', normalCnt, '#E8F5EC', '#19973C'],
                ['비정상', abnCnt, abnCnt > 0 ? '#FEF2F2' : '#F3F4F6', abnCnt > 0 ? '#E24949' : colors.textLight],
                ['전체', inspItems.length, colors.primaryLight, colors.primary],
              ].map(([label, value, bg, color]) => (
                <div key={String(label)} style={{ flex: 1, padding: '12px 16px', background: String(bg), borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: String(color) }}>{value}</div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            <SectionTitle label="자동점검" />
            <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 10px', background: '#F8FAFC', borderBottom: `1px solid ${colors.border}` }}>
                {[
                  [`정상 ${autoItems.filter((row) => row.result === '정상').length}건`, '#D1FAE5', '#15803d'],
                  [`비정상 ${autoItems.filter((row) => row.result === '비정상').length}건`, autoItems.some((row) => row.result === '비정상') ? '#FEE2E2' : '#F3F4F6', autoItems.some((row) => row.result === '비정상') ? '#dc2626' : colors.textLight],
                  [`전체 ${autoItems.length}건`, colors.primaryLight, colors.primary],
                ].map(([label, bg, color]) => (
                  <span key={String(label)} style={{ fontSize: 12, padding: '3px 9px', borderRadius: 8, background: String(bg), color: String(color), fontWeight: 700 }}>
                    {label}
                  </span>
                ))}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['점검항목', '기준', '결과값', '판정'].map((label, index) => (
                      <th key={label} style={{ padding: '7px 9px', fontWeight: 600, color: colors.textSecondary, textAlign: index === 0 ? 'left' : 'center', borderBottom: `1px solid ${colors.border}` }}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {autoItems.map((row, index) => {
                    const isAbn = row.result === '비정상';
                    const errDetail = isAbn && row.errCode ? ERR_DETAIL_MAP[row.errCode] : null;
                    const [levelColor, levelBg] = LEVEL_STYLE[errDetail?.level || 'ERROR'] || ['#dc2626', '#FFF8F8'];
                    return (
                      <React.Fragment key={row.id}>
                        <tr style={{ borderBottom: isAbn && errDetail ? 'none' : `1px solid ${colors.border}`, background: isAbn ? '#FFF8F8' : index % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                          <td style={{ padding: '7px 9px', fontWeight: 600, color: colors.textHeading }}>{row.nm}</td>
                          <td style={{ padding: '7px 9px', textAlign: 'center', color: colors.textSecondary, fontFamily: 'inherit' }}>{row.std}</td>
                          <td style={{ padding: '7px 9px', textAlign: 'center', fontFamily: 'inherit', fontWeight: 700, color: isAbn ? '#dc2626' : '#15803d' }}>{row.val}</td>
                          <td style={{ padding: '7px 9px', textAlign: 'center' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 8, background: isAbn ? '#FEE2E2' : '#D1FAE5', color: isAbn ? '#dc2626' : '#15803d' }}>{row.result}</span>
                          </td>
                        </tr>
                        {isAbn && errDetail ? (
                          <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                            <td colSpan={4} style={{ padding: '0 9px 10px 9px', background: '#FFF8F8' }}>
                              <div style={{ borderRadius: 6, border: '1px solid #FECACA', background: levelBg, padding: '10px 12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${levelColor}22`, color: levelColor, border: `1px solid ${levelColor}44` }}>{errDetail.level}</span>
                                  <span style={{ fontFamily: 'inherit', fontWeight: 700, color: levelColor }}>{errDetail.code}</span>
                                </div>
                                <div style={{ fontFamily: 'inherit', color: '#374151', background: 'rgba(0,0,0,.04)', borderRadius: 4, padding: '6px 8px', marginBottom: 8, wordBreak: 'break-all', lineHeight: 1.5 }}>{errDetail.msg}</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  <div style={{ display: 'flex', gap: 6, fontSize: 12 }}>
                                    <span style={{ fontWeight: 700, color: colors.textSecondary, flexShrink: 0, width: 32 }}>원인</span>
                                    <span style={{ color: colors.textSecondary }}>{errDetail.cause}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: 6, fontSize: 12 }}>
                                    <span style={{ fontWeight: 700, color: levelColor, flexShrink: 0, width: 32 }}>조치</span>
                                    <span style={{ color: colors.textHeading, fontWeight: 500 }}>{errDetail.action}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <SectionTitle label="육안점검" />
            <div style={{ marginBottom: 18 }}>
              {eyeItems.map((row) => {
                const isAbn = row.result === '비정상';
                const photos = eyeItemPhotos[`e${row.id - 6}`] || [];
                return (
                  <div key={row.id} style={{ borderRadius: 8, marginBottom: 8, border: `1px solid ${isAbn ? '#fecaca' : row.result === '정상' ? '#bbf7d0' : colors.border}`, background: isAbn ? '#FFF8F8' : row.result === '정상' ? '#F0FDF4' : '#fff', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: colors.text }}>{row.nm}</div>
                        <div style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>기준: {row.std}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 8, background: isAbn ? '#FEE2E2' : '#D1FAE5', color: isAbn ? '#dc2626' : '#15803d' }}>{row.result}</span>
                    </div>
                    {photos.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 14px 12px', borderTop: `1px dashed ${isAbn ? '#fecaca' : '#bbf7d0'}` }}>
                        <div style={{ width: '100%', fontSize: 12, color: colors.textLight, paddingTop: 8, marginBottom: 2 }}>첨부사진</div>
                        {photos.map((photo) => (
                          <div key={photo.id} style={{ width: 80, height: 64, borderRadius: 6, border: `1px solid ${colors.border}`, background: photo.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, flexShrink: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} strokeWidth="1.5">
                              <rect x="3" y="5" width="18" height="14" rx="2" />
                              <circle cx="12" cy="12" r="3.5" />
                              <path d="M9 5l1.5-2h3L15 5" />
                            </svg>
                            <span style={{ fontSize: 12, color: colors.textSecondary, maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px', textAlign: 'center' }}>{photo.label}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <SectionTitle label="특이사항" />
            <div style={{ padding: '10px 12px', border: `1px solid ${colors.border}`, borderRadius: 6, background: '#FAFBFC', fontSize: 12, color: item.note ? '#F36D00' : colors.textLight, minHeight: 56, marginBottom: 20, lineHeight: 1.6 }}>
              {item.note || '특이사항 없음'}
            </div>
          </div>

          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: '12px 24px', borderTop: `1px solid ${colors.border}`, background: '#fff', gap: 6 }}>
            <Button onClick={onClose}>닫기</Button>
            <Button outline onClick={() => setShowPreview((prev) => !prev)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {showPreview ? '미리보기 닫기' : '보고서 미리보기'}
            </Button>
            <div style={{ flex: 1 }} />
            <Button onClick={handleDownload} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              보고서 다운로드
            </Button>
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
