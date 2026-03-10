// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { useDI } from '@/contexts/DIContext';
import { SidePanel } from '@/components/ui/SidePanel';
import { Button } from '@/components/ui/Button';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/Input';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DatePicker } from '@/components/ui/DatePicker';
import { Icon } from '@/components/ui/Icon';
import { RES, CL_INIT } from '@/data';
import { SYS } from '@/data/systems';
import { C } from '@/lib/theme/colors';
import { PRETENDARD_FONT } from '@/lib/theme/styles';

const setCookie = (name, value, days = 365) => {
  const exp = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${exp};path=/;SameSite=Lax`;
};

const getCookie = (name) => {
  const match = document.cookie.split('; ').find((r) => r.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const COOKIE_SKIP_SUBMIT_CONFIRM = 'cs_skip_submit_confirm';

export function StlDailyPanel({ open, onClose, item, currentUser, toast }) {
  const { addDI, updateDI } = useDI();
  const freeMode = !item;
  const isComp = item?.st === '완료';

  const [step, setStep] = useState(1);
  const [selRes, setSelRes] = useState(null);
  const [resSearch, setResSearch] = useState('');
  const [resSys, setResSys] = useState('');
  const [resCat, setResCat] = useState('');
  const [createdItem, setCreatedItem] = useState(null);

  const RPT_TYPES = [
    { value: '일일', color: '#0C8CE9' },
    { value: '주간', color: '#19973C' },
    { value: '월간', color: '#F36D00' },
    { value: '분기', color: '#7C3AED' },
    { value: '반기', color: '#E24949' },
    { value: '연간', color: '#333333' },
    { value: '상시', color: '#0891B2' },
  ];

  const EYE_ITEMS = [
    { id: 'e1', nm: '서버 외관 상태', std: '이상없음' },
    { id: 'e2', nm: '케이블 연결 상태', std: '정상연결' },
    { id: 'e3', nm: 'LED 표시등 확인', std: 'Green' },
  ];

  const AUTO_ITEMS = [
    { id: 'a1', nm: 'CPU 사용률', std: '< 80%', val: '72%', result: '정상', errCode: null },
    { id: 'a2', nm: '메모리 사용률', std: '< 85%', val: '68%', result: '정상', errCode: null },
    { id: 'a3', nm: '디스크 사용률', std: '< 90%', val: '54%', result: '정상', errCode: null },
    { id: 'a4', nm: '서비스 포트 확인', std: 'OPEN', val: 'OPEN', result: '정상', errCode: null },
    { id: 'a5', nm: '로그 에러 확인', std: '0건', val: '3건', result: '비정상', errCode: 'ERR-LOG-0023', errMsg: 'Application exception: NullPointerException at line 342' },
    { id: 'a6', nm: '보안패치 상태', std: '최신', val: '최신', result: '정상', errCode: null },
  ];

  const ERR_DETAIL = {
    'ERR-LOG-0023': { code: 'ERR-LOG-0023', level: 'ERROR', msg: 'Application exception: NullPointerException at line 342', cause: '로그 수집 중 애플리케이션 예외 발생', action: '해당 서비스 재시작 및 스택 트레이스 확인 필요' },
    'ERR-CPU-0011': { code: 'ERR-CPU-0011', level: 'WARNING', msg: 'CPU usage exceeded threshold: 91.2% (threshold: 80%)', cause: '배치 작업 집중으로 인한 CPU 부하 급증', action: '배치 스케줄 분산 또는 리소스 증설 검토' },
    'ERR-MEM-0007': { code: 'ERR-MEM-0007', level: 'ERROR', msg: 'Memory usage critical: 93.4% — GC overhead limit exceeded', cause: '메모리 누수 또는 힙 설정 부족', action: 'JVM 힙 증설(-Xmx) 또는 메모리 누수 분석 필요' },
    'ERR-DISK-0031': { code: 'ERR-DISK-0031', level: 'WARNING', msg: 'Disk usage exceeded threshold: 92.1% on /data partition', cause: '/data 파티션 로그 파일 과다 누적', action: '오래된 로그 파일 정리 및 logrotate 정책 점검' },
    'ERR-PORT-0004': { code: 'ERR-PORT-0004', level: 'CRITICAL', msg: 'Service port 8080 unreachable — connection refused', cause: 'WAS 프로세스 비정상 종료', action: '서비스 프로세스 재시작 및 원인 로그 확인' },
    'ERR-PATCH-0019': { code: 'ERR-PATCH-0019', level: 'WARNING', msg: '3 security patches pending: CVE-2025-1234, CVE-2025-5678, ...', cause: '보안 패치 미적용 상태', action: '보안 패치 적용 일정 수립 및 긴급 패치 검토' },
  };

  const initEye = () => {
    const hasSaved = item?.eyeRes && item.eyeRes !== '-';
    return Object.fromEntries(EYE_ITEMS.map((e) => [e.id, isComp ? (e.id === 'e3' ? '비정상' : '정상') : hasSaved ? '정상' : '']));
  };

  const [eyeRes, setEyeRes] = useState({});
  const [note, setNote] = useState('');
  const [photos, setPhotos] = useState([]);
  const [eyeItemPhotos, setEyeItemPhotos] = useState({});
  const [rptType, setRptType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoHistory, setAutoHistory] = useState([]);
  const [selAutoId, setSelAutoId] = useState(null);
  const [eyeSnapshot, setEyeSnapshot] = useState(null);
  const [submitConfirm, setSubmitConfirm] = useState(false);
  const [skipCheck, setSkipCheck] = useState(false);

  const buildDummyHistory = (targetItem) => {
    if (!targetItem) return [];
    if (!targetItem.autoRes || targetItem.autoRes === '-') return [];
    const hasExec = targetItem.execDt && targetItem.execDt !== '-';
    if (!hasExec) return [];

    const baseDate = targetItem.execDt;
    const [datePart, timePart] = baseDate.split(' ');
    const [hh, mm] = (timePart || '09:00').split(':');
    const baseH = parseInt(hh, 10);
    const baseM = parseInt(mm, 10);

    const fmt = (h, m, s = 0) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${datePart} ${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    const seed = targetItem.id;
    const pseudo = (n) => ((seed * 9301 + n * 49297 + 233) % 1000) / 1000;

    const ERR_BY_ITEM = {
      CPU: ['ERR-CPU-0011'],
      메모리: ['ERR-MEM-0007'],
      디스크: ['ERR-DISK-0031'],
      포트: ['ERR-PORT-0004'],
      로그: ['ERR-LOG-0023'],
      패치: ['ERR-PATCH-0019'],
    };

    const makeItems = (runIdx) => AUTO_ITEMS.map((a, ai) => {
      const r = pseudo(runIdx * 13 + ai * 7);
      const isAbn = r < 0.18;
      let val = a.val;
      if (a.nm.includes('CPU')) val = isAbn ? `${82 + (Math.floor(r * 100) % 15)}%` : `${40 + (Math.floor(pseudo(runIdx + ai) * 100) % 38)}%`;
      else if (a.nm.includes('메모리')) val = isAbn ? `${87 + (Math.floor(r * 100) % 10)}%` : `${45 + (Math.floor(pseudo(runIdx + ai + 1) * 100) % 38)}%`;
      else if (a.nm.includes('디스크')) val = isAbn ? `${91 + (Math.floor(r * 100) % 8)}%` : `${30 + (Math.floor(pseudo(runIdx + ai + 2) * 100) % 58)}%`;
      else if (a.nm.includes('포트')) val = isAbn ? 'CLOSED' : 'OPEN';
      else if (a.nm.includes('로그')) val = isAbn ? `${2 + (Math.floor(r * 100) % 8)}건` : '0건';
      else if (a.nm.includes('패치')) val = isAbn ? '미적용' : '최신';
      const errKey = Object.keys(ERR_BY_ITEM).find((k) => a.nm.includes(k));
      const errCode = isAbn && errKey ? ERR_BY_ITEM[errKey][0] : null;
      return { ...a, val, result: isAbn ? '비정상' : '정상', errCode };
    });

    if (targetItem.st === '완료') {
      const items = makeItems(0);
      const norm = items.filter((r) => r.result === '정상').length;
      const abn = items.filter((r) => r.result === '비정상').length;
      return [{ id: seed * 1000 + 1, dt: fmt(baseH, baseM, 0), items, norm, abn }];
    }

    const runCount = 2 + (seed % 3);
    return Array.from({ length: runCount }, (_, ri) => {
      const items = makeItems(ri);
      const norm = items.filter((r) => r.result === '정상').length;
      const abn = items.filter((r) => r.result === '비정상').length;
      const mOff = (runCount - 1 - ri) * 8;
      const totalM = baseM - mOff;
      const h = baseH + Math.floor(totalM < 0 ? (totalM - 59) / 60 : Math.floor(totalM / 60));
      const m = ((totalM % 60) + 60) % 60;
      return { id: seed * 1000 + ri + 1, dt: fmt(Math.max(0, h), m, ri * 3), items, norm, abn };
    }).reverse();
  };

  useEffect(() => {
    if (open) {
      if (!item) {
        setStep(1);
        setSelRes(null);
        setResSearch('');
        setResSys('');
        setResCat('');
        setCreatedItem(null);
      }
      setEyeRes(initEye());
      setNote(item?.note || '');
      setPhotos([]);
      setEyeItemPhotos(item?.eyeItemPhotos || {});
      setRptType(isComp ? (item?.rptType || '일일') : '');
      setSubmitted(false);
      setAutoConfirm(false);
      setAutoLoading(false);
      setEyeSnapshot(!!(item?.eyeRes && item.eyeRes !== '-') ? { eyeRes: Object.fromEntries(EYE_ITEMS.map((e) => [e.id, isComp ? (e.id === 'e3' ? '비정상' : '정상') : '정상'])), note: item?.note || '', eyeItemPhotos: item?.eyeItemPhotos || {} } : null);
      const dummyHistory = buildDummyHistory(item);
      setAutoHistory(dummyHistory);
      setSelAutoId(dummyHistory.length > 0 ? dummyHistory[0].id : null);
    }
  }, [open, item]);

  if (!item && !freeMode) return null;

  const eyeDone = EYE_ITEMS.every((e) => eyeRes[e.id]);
  const eyeSaved = eyeSnapshot !== null && JSON.stringify(eyeSnapshot.eyeRes) === JSON.stringify(eyeRes) && eyeSnapshot.note === note && JSON.stringify(eyeSnapshot.eyeItemPhotos) === JSON.stringify(eyeItemPhotos);
  const canSubmit = eyeDone && !!rptType && autoHistory.length > 0 && !isComp;

  const doSubmit = () => {
    if (freeMode) {
      handleFreeSubmit();
    } else {
      updateDI(item.id, { rptType, st: '완료', submitDt: new Date().toISOString().slice(0, 16).replace('T', ' ') });
      onClose();
    }
    toast?.('보고서가 제출되었습니다.');
  };

  const handleSubmitClick = () => {
    if (!canSubmit) return;
    if (getCookie(COOKIE_SKIP_SUBMIT_CONFIRM) === '1') {
      doSubmit();
      return;
    }
    setSkipCheck(false);
    setSubmitConfirm(true);
  };

  const generateAutoResult = () => AUTO_ITEMS.map((autoItem) => {
    const isAbn = Math.random() < 0.2;
    let val = autoItem.val;
    if (isAbn) {
      if (autoItem.nm.includes('CPU')) val = `${Math.floor(82 + Math.random() * 15)}%`;
      else if (autoItem.nm.includes('메모리')) val = `${Math.floor(87 + Math.random() * 10)}%`;
      else if (autoItem.nm.includes('디스크')) val = `${Math.floor(91 + Math.random() * 8)}%`;
      else if (autoItem.nm.includes('포트')) val = 'CLOSED';
      else if (autoItem.nm.includes('로그')) val = `${Math.floor(2 + Math.random() * 10)}건`;
      else if (autoItem.nm.includes('패치')) val = '미적용';
    } else {
      if (autoItem.nm.includes('CPU')) val = `${Math.floor(40 + Math.random() * 38)}%`;
      else if (autoItem.nm.includes('메모리')) val = `${Math.floor(45 + Math.random() * 38)}%`;
      else if (autoItem.nm.includes('디스크')) val = `${Math.floor(30 + Math.random() * 58)}%`;
      else if (autoItem.nm.includes('포트')) val = 'OPEN';
      else if (autoItem.nm.includes('로그')) val = '0건';
      else if (autoItem.nm.includes('패치')) val = '최신';
    }
    return { ...autoItem, val, result: isAbn ? '비정상' : '정상' };
  });

  const handleAutoRun = () => {
    setAutoConfirm(false);
    setAutoLoading(true);
    setTimeout(() => {
      const items = generateAutoResult();
      const norm = items.filter((r) => r.result === '정상').length;
      const abn = items.filter((r) => r.result === '비정상').length;
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const dt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      const newEntry = { id: Date.now(), dt, items, norm, abn };
      setAutoHistory((prev) => {
        const next = [newEntry, ...prev];
        setSelAutoId(newEntry.id);
        return next;
      });
      setAutoLoading(false);
      const autoPatch = { autoRes: abn > 0 ? '비정상' : '정상', normalCnt: norm, abnCnt: abn };
      if (freeMode && createdItem) {
        if (!createdItem._registered) {
          addDI({ ...createdItem, ...autoPatch, _registered: true });
          setCreatedItem((p) => ({ ...p, ...autoPatch, _registered: true }));
        } else {
          updateDI(createdItem.id, autoPatch);
          setCreatedItem((p) => ({ ...p, ...autoPatch }));
        }
      } else if (!freeMode && item) {
        updateDI(item.id, autoPatch);
      }
    }, 2800);
  };

  const pad2 = (n) => String(n).padStart(2, '0');
  const nowFmt = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  };

  const handleFreeCreate = () => {
    const fmt = nowFmt();
    const cl = CL_INIT.find((c) => c.sub === selRes?.mid);
    const newItem = {
      id: Date.now(),
      sysNm: selRes?.sysNm || '-',
      resNm: selRes?.nm,
      mid: selRes?.mid,
      clNm: cl?.nm || '-',
      kind: '상태점검',
      sub: '',
      freq: '-',
      due: fmt.split(' ')[0],
      st: '중단',
      insp: currentUser?.userNm || '-',
      execDt: fmt,
      submitDt: '-',
      rptType: '',
      normalCnt: 0,
      abnCnt: 0,
      note: '',
      autoRes: '-',
      eyeRes: '-',
      summary: '-',
      hasFile: false,
      recheck: 'N',
      memo: '',
      _free: true,
    };
    setCreatedItem(newItem);
    setStep(2);
  };

  const handleFreeSubmit = () => {
    if (!canSubmit || !createdItem) return;
    const patch = { rptType, st: '완료', submitDt: nowFmt() };
    if (!createdItem._registered) {
      addDI({ ...createdItem, ...patch, _registered: true });
    } else {
      updateDI(createdItem.id, patch);
    }
    setStep(3);
  };

  const myUid = currentUser?.userId || '';
  const myRes = RES.filter((r) => r.st !== '미사용' && (r.inspectors || []).includes(myUid));
  const sysRes = resSys ? myRes.filter((r) => r.sysId === resSys) : myRes;
  const cats = Array.from(new Set(sysRes.map((r) => r.mid))).sort();
  const visRes = sysRes.filter((r) => {
    if (resCat && r.mid !== resCat) return false;
    if (resSearch && !r.nm.toLowerCase().includes(resSearch.toLowerCase()) && !(r.ip || '').includes(resSearch)) return false;
    return true;
  });

  const activeItem = freeMode ? createdItem : item;

  const handlePhotoAdd = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotos((p) => [...p, { id: Date.now(), label: file.name, color: '#F0F5FF' }]);
    e.target.value = '';
  };

  const STEPS = [['1', '자원 선택'], ['2', '점검 진행'], ['3', '보고 완료']];
  const curStep = freeMode ? step : (isComp ? 3 : 2);
  const [showPreview, setShowPreview] = useState(false);

  React.useEffect(() => {
    if (!open) setShowPreview(false);
  }, [open]);

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={freeMode ? '점검 수행' : isComp ? '점검 결과 조회' : '점검 보고 작성'}
      width={showPreview ? 1160 : 600}
      noScroll
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {showPreview && (() => {
          const inspItems = item ? [
            { id: 1, nm: 'CPU 사용률', method: '자동', std: '< 80%', val: '72%', result: '정상', errCode: null },
            { id: 2, nm: '메모리 사용률', method: '자동', std: '< 85%', val: '68%', result: '정상', errCode: null },
            { id: 3, nm: '디스크 사용률', method: '자동', std: '< 90%', val: '54%', result: '정상', errCode: null },
            { id: 4, nm: '서비스 포트 확인', method: '자동', std: 'OPEN', val: 'OPEN', result: '정상', errCode: null },
            { id: 5, nm: '로그 에러 확인', method: '자동', std: '0건', val: '3건', result: '비정상', errCode: 'ERR-LOG-0023' },
            { id: 6, nm: '보안패치 상태', method: '자동', std: '최신', val: '최신', result: '정상', errCode: null },
            { id: 7, nm: '서버 외관 상태', method: '육안', std: '이상없음', val: '이상없음', result: '정상', errCode: null },
            { id: 8, nm: '케이블 연결 상태', method: '육안', std: '정상연결', val: '정상연결', result: '정상', errCode: null },
            { id: 9, nm: 'LED 표시등 확인', method: '육안', std: 'Green', val: 'Yellow', result: '비정상', errCode: null },
          ] : [];

          const normalCnt = inspItems.filter((r) => r.result === '정상').length;
          const abnCnt = inspItems.filter((r) => r.result === '비정상').length;
          const groups = inspItems.reduce((acc, r) => {
            const g = r.method === '육안' ? '육안점검' : '자동점검';
            if (!acc[g]) acc[g] = [];
            acc[g].push(r);
            return acc;
          }, {});

          const tbl = { width: '100%', borderCollapse: 'collapse' };
          const th = (ex = {}) => ({ padding: '6px 10px', border: '1px solid #333', background: '#1a3a5c', color: '#fff', fontSize: 12, fontWeight: 700, textAlign: 'center', ...ex });
          const thLt = (ex = {}) => ({ padding: '6px 10px', border: '1px solid #333', background: '#c8d8e8', color: '#1a3a5c', fontSize: 12, fontWeight: 700, ...ex });
          const td = (ex = {}) => ({ padding: '6px 10px', border: '1px solid #aaa', fontSize: 12, verticalAlign: 'middle', ...ex });
          const secH = (ex = {}) => ({ padding: '5px 10px', border: '1px solid #333', background: '#2d5a8e', color: '#fff', fontSize: 12, fontWeight: 700, textAlign: 'center', letterSpacing: 2, ...ex });

          return (
            <div style={{ flex: 1, minWidth: 0, borderRight: `1px solid ${C.brd}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px 12px', borderBottom: `1px solid ${C.brd}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#FAFBFC' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.txH }}>보고서 미리보기</span>
                <span style={{ fontSize: 12, color: C.txL, background: '#F0F5FF', padding: '2px 8px', borderRadius: 10, border: `1px solid ${C.priL}` }}>점검 결과 기준</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                <div style={{ border: `1px solid ${C.brd}`, borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)', fontFamily: PRETENDARD_FONT, background: '#fff', padding: '20px 24px', color: '#111' }}>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 10, color: '#1a3a5c', borderBottom: '3px solid #1a3a5c', paddingBottom: 8, marginBottom: 4 }}>일 상 점 검 보 고 서</div>
                    <div style={{ fontSize: 12, color: '#444', marginTop: 6 }}>{item?.clNm} &nbsp;|&nbsp; {item?.execDt?.slice(0, 10)}</div>
                  </div>
                  <div style={secH({ marginBottom: 0 })}>SITE INFORMATION</div>
                  <table style={{ ...tbl, marginBottom: 10 }}><tbody>
                    <tr><td style={thLt({ width: '18%' })}>정보시스템</td><td style={td({ width: '32%' })}>{item?.sysNm}</td><td style={thLt({ width: '18%' })}>대상자원</td><td style={td({ width: '32%' })}>{item?.resNm}</td></tr>
                    <tr><td style={thLt()}>점검자</td><td style={td()}>{item?.insp}</td><td style={thLt()}>점검일시</td><td style={td()}>{item?.execDt}</td></tr>
                    <tr><td style={thLt()}>점검표</td><td style={td()}>{item?.clNm}</td><td style={thLt()}>보고일시</td><td style={td()}>{item?.submitDt !== '-' ? item?.submitDt : '—'}</td></tr>
                  </tbody></table>
                  <div style={secH({ marginBottom: 0 })}>SYSTEM DETAIL CHECK</div>
                  {Object.entries(groups).map(([grp, rows]) => (
                    <div key={grp}><table style={{ ...tbl }}><thead>
                      <tr>{['점검 항목', '방식', '기준값', '결과값', '점검결과'].map((h, i) => <th key={i} style={th({ width: i === 0 ? '28%' : i === 1 ? '10%' : '16%' })}>{h}</th>)}</tr>
                      <tr><td colSpan={5} style={{ padding: '4px 10px', border: '1px solid #aaa', background: '#e8f0f8', color: '#1a3a5c', fontWeight: 700 }}>[{grp}]</td></tr>
                    </thead><tbody>
                      {rows.map((r) => {
                        const isAbn = r.result === '비정상';
                        const isEye = r.method === '육안';
                        return (
                          <tr key={r.id} style={{ background: isAbn ? '#FFF0F0' : '#fff' }}>
                            <td style={td({ fontWeight: 600 })}>{r.nm}</td>
                            <td style={td({ textAlign: 'center' })}><span style={{ padding: '1px 6px', borderRadius: 4, fontWeight: 600, background: isEye ? '#FEF3C7' : '#E0F2FE', color: isEye ? '#92400E' : '#0369A1' }}>{r.method}</span></td>
                            <td style={td({ textAlign: 'center' })}>{r.std}</td>
                            <td style={td({ textAlign: 'center', color: isAbn ? '#DC2626' : '#111', fontWeight: isAbn ? 700 : 400 })}>{r.val}</td>
                            <td style={td({ textAlign: 'center' })}>
                              {r.method === '자동' ? <span style={{ fontSize: 12, fontWeight: 700, color: isAbn ? '#DC2626' : '#16a34a' }}>{r.result}</span> : isAbn ? <span style={{ color: '#DC2626', fontWeight: 700, fontSize: 12 }}>□ 정상 &nbsp;☑ 비정상</span> : <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 12 }}>☑ 정상 &nbsp;□ 비정상</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody></table></div>
                  ))}
                  <div style={{ marginTop: 10, border: '1px solid #aaa' }}>
                    <div style={{ padding: '5px 10px', background: '#e8f0f8', borderBottom: '1px solid #aaa', fontSize: 12, fontWeight: 700, color: '#1a3a5c' }}>[점검결과 요약]</div>
                    <table style={{ ...tbl }}><tbody><tr>
                      <td style={thLt({ width: '18%', textAlign: 'center' })}>전체</td><td style={td({ textAlign: 'center', fontWeight: 700 })}>{inspItems.length}건</td>
                      <td style={thLt({ width: '18%', textAlign: 'center' })}>정상</td><td style={td({ textAlign: 'center', fontWeight: 700, color: '#16a34a' })}>{normalCnt}건</td>
                      <td style={thLt({ width: '18%', textAlign: 'center' })}>비정상</td><td style={td({ textAlign: 'center', fontWeight: 700, color: abnCnt > 0 ? '#DC2626' : '#111' })}>{abnCnt}건</td>
                    </tr></tbody></table>
                  </div>
                  <div style={{ marginTop: 10, border: '1px solid #aaa' }}>
                    <div style={{ padding: '5px 10px', background: '#e8f0f8', borderBottom: '1px solid #aaa', fontSize: 12, fontWeight: 700, color: '#1a3a5c' }}>[특이사항]</div>
                    <div style={{ padding: '32px 10px 10px', fontSize: 12, color: item?.note ? '#c2410c' : '#aaa', fontStyle: item?.note ? 'normal' : 'italic' }}>{item?.note || '특이사항 없음'}</div>
                  </div>
                  <div style={{ marginTop: 16, border: '2px solid #1a3a5c', borderRadius: 4 }}>
                    <div style={{ padding: '6px 0', background: '#1a3a5c', color: '#fff', textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 4 }}>상기와 같이 점검 하였음을 확인 합니다</div>
                    <table style={{ ...tbl }}><tbody>
                      <tr><td style={td({ width: '15%', background: '#f5f5f5', fontWeight: 700 })}>점검자</td><td style={td({ width: '35%' })}>{item?.insp}</td><td style={td({ width: '15%', background: '#f5f5f5', fontWeight: 700 })}>확인자</td><td style={td({ width: '35%' })}><span style={{ color: '#aaa' }}>(서명)</span></td></tr>
                      <tr><td style={td({ background: '#f5f5f5', fontWeight: 700 })}>소속/성명</td><td style={td()}>&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;</td><td style={td({ background: '#f5f5f5', fontWeight: 700 })}>부서/성명</td><td style={td()}>&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#aaa' }}>(인)</span></td></tr>
                    </tbody></table>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        <div style={{ flex: showPreview ? '0 0 600px' : '1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 22 }}>
              {STEPS.map(([n, l], i) => {
                const done = curStep > i + 1;
                const active = curStep === i + 1;
                const isLast = i === STEPS.length - 1;
                const filled = curStep > i;
                const comp = active && isLast;
                const col = active || done ? (comp ? '#19973C' : C.pri) : C.txL;
                return (
                  <React.Fragment key={n}>
                    {i > 0 && <div style={{ flex: 1, height: 2, minWidth: 8, background: filled ? (comp ? '#19973C' : C.pri) : C.brd, transition: 'background .3s' }} />}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, transition: 'all .3s', background: comp ? '#19973C' : active ? C.pri : done ? C.pri : '#F3F4F6', color: active || done ? '#fff' : C.txL, boxShadow: active ? `0 0 0 3px ${comp ? '#19973C' : C.pri}33` : 'none' }}>
                        {done ? '✓' : n}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: col, whiteSpace: 'nowrap' }}>{l}</span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {freeMode && step === 1 && (
              <>
                <SectionTitle label="대상 자원 선택" />
                <div style={{ fontSize: 12, color: C.txL, marginBottom: 10 }}>
                  점검할 자원을 1개 선택하세요. <span style={{ color: C.pri, fontWeight: 600 }}>{myRes.length}개</span>의 자원이 등록되어 있습니다.
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  <FormSelect value={resSys} onChange={(e) => { setResSys(e.target.value); setResCat(''); }} style={{ padding: '5px 10px', fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 4, background: '#fff', minWidth: 120, outline: 'none' }}>
                    <option value="">전체 시스템</option>
                    {SYS.filter((s) => myRes.some((r) => r.sysId === s.id)).map((s) => <option key={s.id} value={s.id}>{s.nm}</option>)}
                  </FormSelect>
                  <FormSelect value={resCat} onChange={(e) => setResCat(e.target.value)} style={{ padding: '5px 10px', fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 4, background: '#fff', minWidth: 90, outline: 'none' }}>
                    <option value="">전체 분류</option>
                    {cats.map((c) => <option key={c} value={c}>{c}</option>)}
                  </FormSelect>
                  <div style={{ position: 'relative', flex: 1, minWidth: 140 }}>
                    <FormInput value={resSearch} onChange={(e) => setResSearch(e.target.value)} placeholder="자원명 또는 IP 검색" style={{ width: '100%', padding: '5px 10px 5px 28px', fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 4, outline: 'none', boxSizing: 'border-box' }} />
                    <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <Icon n="search" s={12} c={C.txL} />
                    </span>
                    {resSearch && <span onClick={() => setResSearch('')} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 15, color: C.txL }}>×</span>}
                  </div>
                </div>

                {selRes && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 10, borderRadius: 8, border: `1.5px solid ${C.pri}`, background: C.priL + '44' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.pri }}>{selRes.nm}</div>
                      <div style={{ fontSize: 12, color: C.txL }}>{selRes.mid} · {selRes.ip || '—'}</div>
                    </div>
                    <span onClick={() => setSelRes(null)} style={{ cursor: 'pointer', color: C.txL, fontSize: 18 }}>×</span>
                  </div>
                )}

                <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, overflow: 'hidden', maxHeight: 320, overflowY: 'auto' }}>
                  {visRes.length === 0 ? <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: C.txL }}>조건에 맞는 자원이 없습니다.</div> : [...visRes].sort((a, b) => {
                    const aCl = CL_INIT.find((c) => c.sub === a.mid) ? 1 : 0;
                    const bCl = CL_INIT.find((c) => c.sub === b.mid) ? 1 : 0;
                    return bCl - aCl;
                  }).map((r) => {
                    const isSel = selRes?.id === r.id;
                    const cl = CL_INIT.find((c) => c.sub === r.mid);
                    const disabled = !cl;
                    return (
                      <div
                        key={r.id}
                        onClick={() => { if (!disabled) setSelRes(r); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: `1px solid ${C.brd}`, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, background: isSel ? C.priL + '44' : '#fff', borderLeft: isSel ? `3px solid ${C.pri}` : '3px solid transparent', transition: 'background .12s' }}
                        onMouseEnter={(e) => { if (!disabled && !isSel) e.currentTarget.style.background = '#F5F7FF'; }}
                        onMouseLeave={(e) => { if (!disabled && !isSel) e.currentTarget.style.background = '#fff'; }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 12, color: disabled ? C.txL : isSel ? C.pri : C.txt, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.nm}</div>
                          <div style={{ fontSize: 12, color: C.txL, marginTop: 2 }}>{r.mid} · {r.ip || '—'}</div>
                        </div>
                        <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 8, fontWeight: 600, flexShrink: 0, background: cl ? '#dcfce7' : '#F3F4F6', color: cl ? '#166534' : C.txL }}>{cl ? cl.nm : '점검표 없음'}</span>
                        {isSel && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 16, marginTop: 16, borderTop: `1px solid ${C.brd}` }}>
                  <Button onClick={onClose}>취소</Button>
                  <Button primary onClick={() => selRes && handleFreeCreate()} style={{ opacity: selRes ? 1 : 0.4, cursor: selRes ? 'pointer' : 'not-allowed' }}>점검 시작 →</Button>
                </div>
              </>
            )}

            {(!freeMode || step >= 2) && (
              <div style={{ border: `1px solid ${C.brd}`, borderRadius: 10, padding: '14px 16px', marginBottom: 18, background: '#fff', position: 'relative' }}>
                {isComp && rptType && (() => {
                  const RPT_COLOR = { 일일: '#0C8CE9', 주간: '#19973C', 월간: '#F36D00', 분기: '#7C3AED', 반기: '#E24949', 연간: '#333333', 상시: '#0891B2' };
                  const col = RPT_COLOR[rptType] || '#333';
                  return <span style={{ position: 'absolute', top: 12, right: 14, display: 'inline-block', padding: '2px 10px', borderRadius: 10, fontWeight: 700, background: col + '1A', color: col, border: `1px solid ${col}33` }}>{rptType}</span>;
                })()}
                <div style={{ fontSize: 12, color: C.txL, marginBottom: 4 }}>대상 자원</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.txH, marginBottom: 4 }}>{freeMode ? selRes?.nm : activeItem?.resNm}</div>
                <div style={{ fontSize: 12, color: C.txL }}>{[freeMode ? selRes?.mid : activeItem?.mid, freeMode ? selRes?.ip : activeItem?.ip, freeMode ? selRes?.sysNm : activeItem?.sysNm].filter(Boolean).join(' · ')}</div>
                {activeItem?.clNm && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.brd}` }}>
                    {[[ '점검표', activeItem.clNm ], [ '점검자', activeItem.insp ], [ '수행일시', activeItem.execDt ], ...(!freeMode ? [[ '제출일시', activeItem.submitDt && activeItem.submitDt !== '-' ? activeItem.submitDt : '-' ]] : [])].map(([l, v]) => (
                      <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 12, color: C.txL }}>{l}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.txt }}>{v || '—'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(!freeMode || step === 2) && (
              <>
                <ConfirmModal open={autoConfirm} title="자동점검 수행" msg="자동점검을 수행합니다. 계속하시겠습니까?" okLabel="예" danger={false} onOk={handleAutoRun} onCancel={() => setAutoConfirm(false)} />
                {autoLoading && (
                  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', border: '5px solid rgba(255,255,255,.25)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                    <div style={{ color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: 0.5 }}>자동점검 수행 중...</div>
                    <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
                  </div>
                )}

                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <SectionTitle label="자동점검" style={{ marginBottom: 0 }} />
                    {!isComp && autoHistory.length === 0 && (
                      <Button sm outline onClick={() => setAutoConfirm(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                        자동점검 수행
                      </Button>
                    )}
                  </div>

                  {(() => {
                    const sel = autoHistory[0];
                    if (!sel) {
                      return <div style={{ padding: '28px 16px', borderRadius: 8, border: `1.5px dashed ${C.brd}`, textAlign: 'center', color: C.txL, background: '#FAFBFC' }}><div style={{ fontSize: 12, marginBottom: 4 }}>자동점검 수행 버튼을 눌러 점검을 시작하세요.</div></div>;
                    }
                    const { items, norm, abn, dt } = sel;
                    return (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ display: 'flex', gap: 5 }}>
                            {[[`정상 ${norm}건`, '#D1FAE5', '#15803d'], [`비정상 ${abn}건`, abn > 0 ? '#FEE2E2' : '#F3F4F6', abn > 0 ? '#dc2626' : C.txL], [`전체 ${items.length}건`, C.priL, C.pri]].map(([l, bg, tc]) => <span key={l} style={{ fontSize: 12, padding: '3px 9px', borderRadius: 8, background: bg, color: tc, fontWeight: 700 }}>{l}</span>)}
                          </div>
                          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}><span style={{ fontSize: 9, color: C.txL, fontWeight: 500 }}>수행일시</span><span style={{ fontSize: 11, color: C.txS, fontFamily: 'inherit' }}>{dt}</span></span>
                        </div>
                        <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, overflow: 'hidden', marginBottom: isComp ? 0 : 8 }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead><tr style={{ background: '#F8FAFC' }}>{['점검항목', '기준', '결과값', '판정'].map((h, i) => <th key={i} style={{ padding: '7px 9px', fontWeight: 600, color: C.txS, textAlign: i === 0 ? 'left' : 'center', borderBottom: `1px solid ${C.brd}`, fontSize: 12 }}>{h}</th>)}</tr></thead>
                            <tbody>
                              {items.map((r, i) => {
                                const isAbn = r.result === '비정상';
                                const errDet = isAbn && r.errCode ? ERR_DETAIL[r.errCode] : null;
                                const LEVEL_STYLE = { CRITICAL: ['#7F1D1D', '#FEF2F2'], ERROR: ['#dc2626', '#FFF8F8'], WARNING: ['#D97706', '#FFFBEB'] };
                                const [lc, lbg] = LEVEL_STYLE[errDet?.level] || ['#dc2626', '#FFF8F8'];
                                return (
                                  <React.Fragment key={r.id}>
                                    <tr style={{ borderBottom: isAbn && errDet ? 'none' : `1px solid ${C.brd}`, background: isAbn ? '#FFF8F8' : i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                                      <td style={{ padding: '7px 9px', fontWeight: 600, color: C.txH }}>{r.nm}</td>
                                      <td style={{ padding: '7px 9px', textAlign: 'center', color: C.txS, fontFamily: 'inherit' }}>{r.std}</td>
                                      <td style={{ padding: '7px 9px', textAlign: 'center', fontFamily: 'inherit', fontWeight: 700, fontSize: 12, color: isAbn ? '#dc2626' : '#15803d' }}>{r.val}</td>
                                      <td style={{ padding: '7px 9px', textAlign: 'center' }}><span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 8, background: isAbn ? '#FEE2E2' : '#D1FAE5', color: isAbn ? '#dc2626' : '#15803d' }}>{r.result}</span></td>
                                    </tr>
                                    {isAbn && errDet && (
                                      <tr style={{ borderBottom: `1px solid ${C.brd}` }}>
                                        <td colSpan={4} style={{ padding: '0 9px 10px 9px', background: '#FFF8F8' }}>
                                          <div style={{ borderRadius: 6, border: '1px solid #FECACA', background: lbg, padding: '10px 12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><span style={{ fontSize: 12, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: lc + '22', color: lc, border: `1px solid ${lc}44`, letterSpacing: 0.5 }}>{errDet.level}</span><span style={{ fontFamily: 'inherit', fontWeight: 700, color: lc, letterSpacing: 0.5 }}>{errDet.code}</span></div>
                                            <div style={{ fontFamily: 'inherit', color: '#374151', background: 'rgba(0,0,0,.04)', borderRadius: 4, padding: '6px 8px', marginBottom: 8, wordBreak: 'break-all', lineHeight: 1.5 }}>{errDet.msg}</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                              <div style={{ display: 'flex', gap: 6 }}><span style={{ fontWeight: 700, color: C.txS, flexShrink: 0, width: 32 }}>원인</span><span style={{ color: C.txS }}>{errDet.cause}</span></div>
                                              <div style={{ display: 'flex', gap: 6 }}><span style={{ fontWeight: 700, color: lc, flexShrink: 0, width: 32 }}>조치</span><span style={{ color: C.txH, fontWeight: 500 }}>{errDet.action}</span></div>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {!(isComp && (!item.eyeRes || item.eyeRes === '-')) && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
                      <SectionTitle label="육안점검" style={{ marginBottom: 0 }} />
                      {!isComp && (
                        <Button sm success={eyeSaved} outline={!eyeSaved} onClick={() => {
                          const eyeVal = Object.values(eyeRes).some((v) => v === '비정상') ? '비정상' : Object.values(eyeRes).every((v) => v === '정상') ? '정상' : '-';
                          const totalPhotos = Object.values(eyeItemPhotos).flat().length;
                          const eyePatch = { eyeRes: eyeVal, note, hasFile: totalPhotos > 0, eyeItemPhotos };
                          setEyeSnapshot({ eyeRes: { ...eyeRes }, note, eyeItemPhotos: JSON.parse(JSON.stringify(eyeItemPhotos)) });
                          if (freeMode && createdItem) {
                            if (!createdItem._registered) {
                              addDI({ ...createdItem, ...eyePatch, _registered: true });
                              setCreatedItem((p) => ({ ...p, ...eyePatch, _registered: true }));
                            } else {
                              updateDI(createdItem.id, eyePatch);
                              setCreatedItem((p) => ({ ...p, ...eyePatch }));
                            }
                          } else if (!freeMode && item) {
                            updateDI(item.id, eyePatch);
                          }
                        }} style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                          {eyeSaved ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>저장됨</> : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>저장</>}
                        </Button>
                      )}
                    </div>

                    <div style={{ marginBottom: 18, marginTop: 8 }}>
                      {EYE_ITEMS.map((e) => {
                        const val = eyeRes[e.id] || '';
                        const itemPhotos = eyeItemPhotos[e.id] || [];
                        const isAbn = val === '비정상';
                        return (
                          <div key={e.id} style={{ borderRadius: 8, marginBottom: 8, border: `1px solid ${isAbn ? '#fecaca' : val === '정상' ? '#bbf7d0' : C.brd}`, background: isAbn ? '#FFF8F8' : val === '정상' ? '#F0FDF4' : '#fff', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                              <div><div style={{ fontSize: 12, fontWeight: 500, color: C.txt }}>{e.nm}</div><div style={{ fontSize: 12, color: C.txL, marginTop: 2 }}>기준: {e.std}</div></div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  {['정상', '비정상'].map((r) => {
                                    const active = val === r;
                                    const col = r === '정상' ? '#19973C' : '#dc2626';
                                    return <button key={r} onClick={() => !isComp && setEyeRes((p) => ({ ...p, [e.id]: r }))} style={{ padding: '4px 14px', fontSize: 12, fontWeight: 600, borderRadius: 4, border: `1.5px solid ${active ? col : C.brd}`, background: active ? col + '1A' : '#fff', color: active ? col : C.txS, cursor: isComp ? 'default' : 'pointer', transition: 'all .15s' }}>{r}</button>;
                                  })}
                                </div>
                                {!isComp && (
                                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 14px', borderRadius: 4, border: `1.5px solid ${itemPhotos.length > 0 ? C.pri : C.brd}`, background: itemPhotos.length > 0 ? C.priL : '#fff', color: itemPhotos.length > 0 ? C.pri : C.txS, fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all .15s', flexShrink: 0 }} onMouseEnter={(ev) => { ev.currentTarget.style.borderColor = C.pri; ev.currentTarget.style.color = C.pri; ev.currentTarget.style.background = C.priL; }} onMouseLeave={(ev) => { if (!itemPhotos.length) { ev.currentTarget.style.borderColor = C.brd; ev.currentTarget.style.color = C.txS; ev.currentTarget.style.background = '#fff'; } }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="12" cy="12" r="3.5" /><path d="M9 5l1.5-2h3L15 5" /></svg>
                                    {itemPhotos.length > 0 ? `${itemPhotos.length}장` : '사진'}
                                    <FormInput type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(ev) => {
                                      const files = Array.from(ev.target.files);
                                      if (!files.length) return;
                                      const newPhotos = files.map((f) => ({ id: Date.now() + Math.random(), label: f.name, color: '#F0F5FF' }));
                                      setEyeItemPhotos((p) => ({ ...p, [e.id]: [...(p[e.id] || []), ...newPhotos] }));
                                      ev.target.value = '';
                                    }} />
                                  </label>
                                )}
                              </div>
                            </div>
                            {itemPhotos.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 14px 12px', borderTop: `1px dashed ${isAbn ? '#fecaca' : '#bbf7d0'}` }}>
                                <div style={{ width: '100%', fontSize: 12, color: C.txL, paddingTop: 8, marginBottom: 2 }}>첨부사진</div>
                                {itemPhotos.map((p) => (
                                  <div key={p.id} style={{ width: 80, height: 64, borderRadius: 6, border: `1px solid ${C.brd}`, background: p.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, position: 'relative', flexShrink: 0 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.txL} strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="12" cy="12" r="3.5" /><path d="M9 5l1.5-2h3L15 5" /></svg>
                                    <span style={{ fontSize: 12, color: C.txS, maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px', textAlign: 'center' }}>{p.label}</span>
                                    {!isComp && <span onClick={() => setEyeItemPhotos((prev) => ({ ...prev, [e.id]: (prev[e.id] || []).filter((x) => x.id !== p.id) }))} style={{ position: 'absolute', top: 2, right: 5, fontSize: 12, color: C.txL, cursor: 'pointer', lineHeight: 1 }}>×</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                <SectionTitle label="특이사항" />
                <FormTextarea style={{ marginBottom: 18, ...(isComp ? { background: '#F9FAFC', pointerEvents: 'none' } : {}) }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="특이사항을 입력하세요 (선택)" readOnly={isComp} maxLength={500} />
              </>
            )}

            {freeMode && step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 0 0 8px #DCFCE744' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#16A34A', marginBottom: 8 }}>점검 완료</div>
                <div style={{ fontSize: 15, color: C.txS, lineHeight: 1.8, marginBottom: 28 }}><span style={{ fontWeight: 600, color: C.txt }}>{selRes?.nm}</span> 점검이 완료되었습니다.<br />보고서가 성공적으로 제출되었습니다.</div>
                <div style={{ width: '100%', background: '#F9FAFC', border: `1px solid ${C.brd}`, borderRadius: 10, padding: '16px 20px', textAlign: 'left', marginBottom: 28 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.txS, marginBottom: 12 }}>점검 요약</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                    {[[ '대상 자원', selRes?.nm ], [ '점검자', currentUser?.userNm ], [ '보고서 유형', rptType ], [ '육안점검', EYE_ITEMS.every((e) => eyeRes[e.id] === '정상') ? '전체 정상' : '일부 비정상' ], [ '특이사항', note || '없음' ]].map(([l, v]) => (
                      <div key={l}><div style={{ fontSize: 12, color: C.txL, marginBottom: 2 }}>{l}</div><div style={{ fontSize: 12, fontWeight: 600, color: C.txt }}>{v}</div></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {freeMode && step === 1 && (
            <div style={{ flexShrink: 0, borderTop: `1px solid ${C.brd}`, padding: '14px 24px', background: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button onClick={onClose}>취소</Button>
              <div style={{ flex: 1 }} />
              <Button primary onClick={() => selRes && handleFreeCreate()} style={{ opacity: selRes ? 1 : 0.4, cursor: selRes ? 'pointer' : 'not-allowed' }}>점검 시작 →</Button>
            </div>
          )}

          {(!freeMode || step === 2) && (
            <div style={{ flexShrink: 0, borderTop: `1px solid ${C.brd}`, padding: '14px 24px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {!isComp && (!autoHistory.length || !eyeDone || !rptType) && (
                <div style={{ fontSize: 12, color: '#ea580c', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 6, background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><path d="M7 1.5A5.5 5.5 0 1 0 7 12.5 5.5 5.5 0 0 0 7 1.5zm.5 8H6.5V6.5h1V9.5zm0-4H6.5v-1h1v1z" fill="#ea580c" /></svg>
                  <span>{!autoHistory.length ? '자동점검을 수행하고 보고할 결과를 선택해야 합니다.' : !eyeDone ? '육안점검 항목을 모두 입력해야 제출 가능합니다.' : '보고서 유형을 선택해야 제출 가능합니다.'}</span>
                </div>
              )}
              {!isComp && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${!rptType ? '#fca5a5' : C.brd}`, background: !rptType ? '#fff8f8' : C.bg, transition: 'all .2s' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: !rptType ? '#dc2626' : C.txS, flexShrink: 0 }}>보고 유형<span style={{ color: '#dc2626', marginLeft: 3 }}>*</span></span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, flex: 1 }}>
                    {RPT_TYPES.map((t) => {
                      const active = rptType === t.value;
                      return <button key={t.value} onClick={() => setRptType(t.value)} style={{ padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: `1.5px solid ${active ? t.color : C.brd}`, background: active ? t.color + '1A' : '#fff', color: active ? t.color : C.txS, cursor: 'pointer', transition: 'all .15s' }}>{t.value}</button>;
                    })}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button onClick={onClose}>{isComp ? '닫기' : '취소'}</Button>
                <Button onClick={() => setShowPreview((p) => !p)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  {showPreview ? '미리보기 닫기' : '보고서 미리보기'}
                </Button>
                <div style={{ flex: 1 }} />
                {!isComp && <Button primary onClick={handleSubmitClick} style={{ opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? 'pointer' : 'not-allowed' }}>{freeMode ? '점검 보고' : '보고 제출'}</Button>}
              </div>
            </div>
          )}

          {freeMode && step === 3 && (
            <div style={{ flexShrink: 0, borderTop: `1px solid ${C.brd}`, padding: '14px 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end' }}>
              <Button primary onClick={onClose} style={{ minWidth: 120, justifyContent: 'center' }}>확인</Button>
            </div>
          )}

          {submitConfirm && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: 380, boxShadow: '0 8px 32px rgba(0,0,0,.2)' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: C.txH, marginBottom: 8 }}>보고서 제출 확인</div>
                <div style={{ marginBottom: 14, fontSize: 15, color: C.txS }}>점검 보고서를 제출하시겠습니까?</div>
                <div style={{ background: '#F9FAFC', border: `1px solid ${C.brd}`, borderRadius: 8, padding: '12px 16px', fontSize: 13, lineHeight: 1.9, marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 8 }}><span style={{ color: C.txL, minWidth: 64 }}>보고 유형</span><span style={{ fontWeight: 700, color: C.txH }}>{rptType}</span></div>
                  <div style={{ display: 'flex', gap: 8 }}><span style={{ color: C.txL, minWidth: 64 }}>육안점검</span><span style={{ fontWeight: 600, color: C.txH }}>{EYE_ITEMS.every((e) => eyeRes[e.id] === '정상') ? '전체 정상' : '일부 비정상'}</span></div>
                  <div style={{ display: 'flex', gap: 8 }}><span style={{ color: C.txL, minWidth: 64 }}>특이사항</span><span style={{ color: C.txS }}>{note || '없음'}</span></div>
                </div>
                <div style={{ fontSize: 12, color: '#ea580c', marginBottom: 18 }}>제출 후에는 수정이 불가합니다.</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, cursor: 'pointer', userSelect: 'none' }} onClick={() => setSkipCheck((p) => !p)}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${skipCheck ? C.sec : C.brdD}`, background: skipCheck ? C.sec : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
                    {skipCheck && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span style={{ fontSize: 13, color: C.txS }}>다음부터 확인하지 않기</span>
                </label>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <Button onClick={() => setSubmitConfirm(false)}>취소</Button>
                  <Button primary onClick={() => { if (skipCheck) setCookie(COOKIE_SKIP_SUBMIT_CONFIRM, '1', 365); setSubmitConfirm(false); doSubmit(); }}>제출</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidePanel>
  );
}
