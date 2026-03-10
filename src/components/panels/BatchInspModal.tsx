// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { Btn } from '@/components/ui/Button';
import { FInput, FSelect } from '@/components/ui/Input';
import { Ic } from '@/components/ui/Icon';
import { C } from '@/lib/theme/colors';
import { RES, CL_INIT } from '@/data';
import { SYS } from '@/data/systems';

const _batchCooldown = new Map();
const BATCH_COOLDOWN_MS = 2 * 60 * 1000;
const BATCH_MAX = 20;

export function BatchInspModal({ open, onClose, currentUser, onSubmit }) {
  const myUid = currentUser?.userId || '';
  const myRes = RES.filter((r) => r.st !== '미사용' && (r.inspectors || []).includes(myUid));
  const [sel, setSel] = useState([]);
  const [resSys, setResSys] = useState('');
  const [resCat, setResCat] = useState('');
  const [resSearch, setResSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [resultCnt, setResultCnt] = useState(0);
  const now = Date.now();

  useEffect(() => {
    if (open) {
      setSel([]);
      setResSys('');
      setResCat('');
      setResSearch('');
      setSubmitting(false);
      setDone(false);
      setResultCnt(0);
    }
  }, [open]);

  const sysRes = resSys ? myRes.filter((r) => r.sysId === resSys) : myRes;
  const cats = Array.from(new Set(sysRes.map((r) => r.mid))).sort();
  const visRes = sysRes.filter((r) => {
    if (resCat && r.mid !== resCat) return false;
    if (resSearch && !r.nm.toLowerCase().includes(resSearch.toLowerCase()) && !(r.ip || '').includes(resSearch)) return false;
    return true;
  });

  const cooldownLeft = (id) => {
    const t = _batchCooldown.get(id);
    if (!t) return 0;
    return Math.max(0, BATCH_COOLDOWN_MS - (now - t));
  };

  const fmtLeft = (ms) => {
    const s = Math.ceil(ms / 1000);
    return s >= 60 ? `${Math.ceil(s / 60)}분 후` : `${s}초 후`;
  };

  const toggle = (r) => {
    if (!CL_INIT.find((c) => c.sub === r.mid)) return;
    if (cooldownLeft(r.id) > 0) return;
    setSel((p) => (p.find((x) => x.id === r.id) ? p.filter((x) => x.id !== r.id) : p.length >= BATCH_MAX ? p : [...p, r]));
  };

  const handleSubmit = () => {
    if (sel.length === 0 || submitting) return;
    setSubmitting(true);
    sel.forEach((r) => _batchCooldown.set(r.id, Date.now()));
    setTimeout(() => {
      onSubmit(sel);
      setResultCnt(sel.length);
      setSubmitting(false);
      setDone(true);
    }, 3500);
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, width: 620, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 16px 48px rgba(0,0,0,.22)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px 14px', borderBottom: `1px solid ${C.brd}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.txH }}>일괄 자동점검 요청</div>
            <div style={{ fontSize: 12, color: C.txL, marginTop: 2 }}>최대 {BATCH_MAX}개 · 자원별 2분 쿨다운</div>
          </div>
          <span onClick={onClose} style={{ cursor: 'pointer', color: C.txL, fontSize: 20, lineHeight: 1 }}>×</span>
        </div>

        {done ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 0 0 8px #DCFCE744' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#16A34A', marginBottom: 8 }}>요청 완료</div>
            <div style={{ fontSize: 15, color: C.txS, lineHeight: 1.8, marginBottom: 28 }}><span style={{ fontWeight: 700, color: C.txt }}>{resultCnt}개</span> 자원에 대한<br />자동점검 결과가 목록에 반영되었습니다.</div>
            <Btn primary onClick={onClose}>확인</Btn>
          </div>
        ) : submitting ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', border: `5px solid ${C.priL}`, borderTopColor: C.pri, animation: 'spin 0.8s linear infinite', marginBottom: 20 }} />
            <style>{'@keyframes spin { to { transform:rotate(360deg); } }'}</style>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.txH, marginBottom: 6 }}>자동점검 요청 중</div>
            <div style={{ fontSize: 12, color: C.txS }}><span style={{ fontWeight: 700, color: C.pri }}>{sel.length}개</span> 자원에 점검을 요청하고 있습니다...</div>
          </div>
        ) : (
          <>
            <div style={{ padding: '12px 20px 8px', borderBottom: `1px solid ${C.brd}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <FSelect value={resSys} onChange={(e) => { setResSys(e.target.value); setResCat(''); }} style={{ padding: '5px 10px', fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 4, background: '#fff', outline: 'none' }}>
                  <option value="">전체 시스템</option>
                  {SYS.filter((s) => myRes.some((r) => r.sysId === s.id)).map((s) => <option key={s.id} value={s.id}>{s.nm}</option>)}
                </FSelect>
                <FSelect value={resCat} onChange={(e) => setResCat(e.target.value)} style={{ padding: '5px 10px', fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 4, background: '#fff', outline: 'none' }}>
                  <option value="">전체 분류</option>
                  {cats.map((c) => <option key={c} value={c}>{c}</option>)}
                </FSelect>
                <div style={{ position: 'relative', flex: 1, minWidth: 140 }}>
                  <FInput value={resSearch} onChange={(e) => setResSearch(e.target.value)} placeholder="자원명 또는 IP 검색" style={{ width: '100%', padding: '5px 10px 5px 28px', fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 4, outline: 'none', boxSizing: 'border-box' }} />
                  <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><Ic n="search" s={12} c={C.txL} /></span>
                  {resSearch && <span onClick={() => setResSearch('')} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 15, color: C.txL }}>×</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: sel.length >= BATCH_MAX ? '#FEF3C7' : C.priL, border: `1px solid ${sel.length >= BATCH_MAX ? '#F59E0B' : C.pri + '44'}` }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: sel.length >= BATCH_MAX ? '#92400E' : C.pri }}>{sel.length} / {BATCH_MAX}</span>
                  {sel.length > 0 && <span onClick={() => setSel([])} style={{ fontSize: 12, color: C.txL, cursor: 'pointer' }}>초기화</span>}
                </div>
              </div>
              {sel.length >= BATCH_MAX && <div style={{ fontSize: 12, color: '#92400E', background: '#FEF3C7', padding: '4px 10px', borderRadius: 4, marginBottom: 4 }}>최대 {BATCH_MAX}개 선택됩니다. 일부 선택을 해제 후 추가 선택하세요.</div>}
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {visRes.length === 0 ? <div style={{ padding: 32, textAlign: 'center', fontSize: 12, color: C.txL }}>조건에 맞는 자원이 없습니다.</div> : [...visRes].sort((a, b) => {
                const aOk = !CL_INIT.find((c) => c.sub === a.mid) ? 1 : 0;
                const bOk = !CL_INIT.find((c) => c.sub === b.mid) ? 1 : 0;
                if (aOk !== bOk) return aOk - bOk;
                const aCD = _batchCooldown.get(a.id) ? 1 : 0;
                const bCD = _batchCooldown.get(b.id) ? 1 : 0;
                return aCD - bCD;
              }).map((r) => {
                const isSel = sel.find((x) => x.id === r.id);
                const cdLeft = cooldownLeft(r.id);
                const noCl = !CL_INIT.find((c) => c.sub === r.mid);
                const disabled = noCl || cdLeft > 0 || (!isSel && sel.length >= BATCH_MAX);
                return (
                  <div key={r.id} onClick={() => toggle(r)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: `1px solid ${C.brd}`, cursor: disabled ? 'not-allowed' : 'pointer', opacity: cdLeft > 0 ? 0.5 : 1, background: isSel ? C.priL + '55' : '#fff', borderLeft: isSel ? `3px solid ${C.pri}` : '3px solid transparent', transition: 'background .1s' }} onMouseEnter={(e) => { if (!disabled && !isSel) e.currentTarget.style.background = '#F5F7FF'; }} onMouseLeave={(e) => { if (!disabled && !isSel) e.currentTarget.style.background = '#fff'; }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, border: `2px solid ${isSel ? C.pri : C.brd}`, background: isSel ? C.pri : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isSel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 12, color: disabled ? C.txL : C.txt, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.nm}</div>
                      <div style={{ fontSize: 12, color: C.txL, marginTop: 1 }}>{r.mid} · {r.ip || '—'} · {r.sysNm || SYS.find((s) => s.id === r.sysId)?.nm}</div>
                    </div>
                    {cdLeft > 0 ? <span style={{ fontSize: 12, color: '#92400E', background: '#FEF3C7', padding: '2px 8px', borderRadius: 8, fontWeight: 600, flexShrink: 0 }}>{fmtLeft(cdLeft)} 가능</span> : <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 8, fontWeight: 600, flexShrink: 0, background: CL_INIT.find((c) => c.sub === r.mid) ? '#dcfce7' : '#F3F4F6', color: CL_INIT.find((c) => c.sub === r.mid) ? '#166534' : C.txL }}>{CL_INIT.find((c) => c.sub === r.mid)?.nm || '점검표 없음'}</span>}
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.brd}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: C.txL }}>{sel.length > 0 ? <><span style={{ fontWeight: 700, color: C.pri }}>{sel.length}개</span> 자원 선택됨</> : '점검할 자원을 선택하세요'}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn onClick={onClose}>취소</Btn>
                <Btn primary disabled={sel.length === 0} onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                  일괄 점검 요청
                </Btn>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
