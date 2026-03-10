// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { C } from '@/lib/theme/colors';


const MgrCategory = () => {
  const initTree = [
    { id: "c1", nm: "서버", children: [
      { id: "c1-1", nm: "CPU", children: [{ id: "c1-1-1", nm: "사용률" }, { id: "c1-1-2", nm: "코어별" }, { id: "c1-1-3", nm: "대기 큐" }] },
      { id: "c1-2", nm: "메모리", children: [{ id: "c1-2-1", nm: "사용률" }, { id: "c1-2-2", nm: "SWAP" }, { id: "c1-2-3", nm: "캐시" }] },
      { id: "c1-3", nm: "디스크", children: [{ id: "c1-3-1", nm: "사용률" }, { id: "c1-3-2", nm: "I/O" }, { id: "c1-3-3", nm: "inode" }, { id: "c1-3-4", nm: "파일시스템" }] },
      { id: "c1-4", nm: "프로세스", children: [{ id: "c1-4-1", nm: "구동상태" }, { id: "c1-4-2", nm: "좀비" }, { id: "c1-4-3", nm: "한계" }] },
      { id: "c1-5", nm: "서비스", children: [{ id: "c1-5-1", nm: "포트" }, { id: "c1-5-2", nm: "SSH" }, { id: "c1-5-3", nm: "NTP" }, { id: "c1-5-4", nm: "DNS" }] },
      { id: "c1-6", nm: "OS", children: [{ id: "c1-6-1", nm: "커널" }, { id: "c1-6-2", nm: "Uptime" }, { id: "c1-6-3", nm: "시간" }] },
      { id: "c1-7", nm: "로그", children: [{ id: "c1-7-1", nm: "에러" }, { id: "c1-7-2", nm: "용량" }, { id: "c1-7-3", nm: "감사" }, { id: "c1-7-4", nm: "로테이션" }] },
    ]},
    { id: "c2", nm: "보안", children: [
      { id: "c2-1", nm: "패치", children: [{ id: "c2-1-1", nm: "상태" }, { id: "c2-1-2", nm: "긴급" }] },
      { id: "c2-2", nm: "접근통제", children: [{ id: "c2-2-1", nm: "방화벽" }, { id: "c2-2-2", nm: "포트" }, { id: "c2-2-3", nm: "원격접속" }, { id: "c2-2-4", nm: "암호화" }, { id: "c2-2-5", nm: "IPS/IDS" }] },
      { id: "c2-3", nm: "계정관리", children: [{ id: "c2-3-1", nm: "패스워드" }, { id: "c2-3-2", nm: "잠김정책" }, { id: "c2-3-3", nm: "세션" }, { id: "c2-3-4", nm: "불필요계정" }, { id: "c2-3-5", nm: "권한" }] },
      { id: "c2-4", nm: "인증서", children: [{ id: "c2-4-1", nm: "만료" }, { id: "c2-4-2", nm: "SSL" }] },
    ]},
    { id: "c3", nm: "네트워크", children: [
      { id: "c3-1", nm: "인터페이스", children: [{ id: "c3-1-1", nm: "상태" }, { id: "c3-1-2", nm: "트래픽" }, { id: "c3-1-3", nm: "대역폭" }] },
      { id: "c3-2", nm: "품질", children: [{ id: "c3-2-1", nm: "패킷손실" }, { id: "c3-2-2", nm: "지연시간" }] },
      { id: "c3-3", nm: "설정", children: [{ id: "c3-3-1", nm: "ARP" }, { id: "c3-3-2", nm: "라우팅" }, { id: "c3-3-3", nm: "VLAN" }] },
    ]},
    { id: "c4", nm: "WEB", children: [
      { id: "c4-1", nm: "응답", children: [{ id: "c4-1-1", nm: "응답코드" }, { id: "c4-1-2", nm: "응답시간" }, { id: "c4-1-3", nm: "정적리소스" }] },
      { id: "c4-2", nm: "프로세스", children: [{ id: "c4-2-1", nm: "상태" }, { id: "c4-2-2", nm: "커넥션" }, { id: "c4-2-3", nm: "쓰레드" }] },
      { id: "c4-3", nm: "로그", children: [{ id: "c4-3-1", nm: "에러" }, { id: "c4-3-2", nm: "접근" }] },
    ]},
    { id: "c5", nm: "WAS", children: [
      { id: "c5-1", nm: "리소스", children: [{ id: "c5-1-1", nm: "프로세스" }, { id: "c5-1-2", nm: "힙메모리" }, { id: "c5-1-3", nm: "쓰레드" }, { id: "c5-1-4", nm: "GC" }] },
      { id: "c5-2", nm: "커넥션", children: [{ id: "c5-2-1", nm: "JDBC" }, { id: "c5-2-2", nm: "세션" }] },
      { id: "c5-3", nm: "로그/배포", children: [{ id: "c5-3-1", nm: "에러" }, { id: "c5-3-2", nm: "배포" }] },
    ]},
    { id: "c6", nm: "DBMS", children: [
      { id: "c6-1", nm: "상태", children: [{ id: "c6-1-1", nm: "서비스" }, { id: "c6-1-2", nm: "커넥션" }, { id: "c6-1-3", nm: "복제" }] },
      { id: "c6-2", nm: "저장소", children: [{ id: "c6-2-1", nm: "테이블스페이스" }, { id: "c6-2-2", nm: "아카이브" }] },
      { id: "c6-3", nm: "성능", children: [{ id: "c6-3-1", nm: "슬로우쿼리" }, { id: "c6-3-2", nm: "데드락" }, { id: "c6-3-3", nm: "Lock" }, { id: "c6-3-4", nm: "인덱스" }] },
      { id: "c6-4", nm: "로그", children: [{ id: "c6-4-1", nm: "에러" }] },
    ]},
    { id: "c7", nm: "운영", children: [
      { id: "c7-1", nm: "백업", children: [{ id: "c7-1-1", nm: "상태" }, { id: "c7-1-2", nm: "전체" }, { id: "c7-1-3", nm: "증분" }, { id: "c7-1-4", nm: "용량" }, { id: "c7-1-5", nm: "복원" }] },
      { id: "c7-2", nm: "이중화", children: [{ id: "c7-2-1", nm: "상태" }, { id: "c7-2-2", nm: "절체" }, { id: "c7-2-3", nm: "클러스터" }, { id: "c7-2-4", nm: "Heartbeat" }] },
      { id: "c7-3", nm: "성능", children: [{ id: "c7-3-1", nm: "TPS" }, { id: "c7-3-2", nm: "응답시간" }, { id: "c7-3-3", nm: "동시접속" }, { id: "c7-3-4", nm: "부하테스트" }] },
    ]},
    { id: "c8", nm: "하드웨어", children: [
      { id: "c8-1", nm: "전원", children: [{ id: "c8-1-1", nm: "PSU" }, { id: "c8-1-2", nm: "UPS" }] },
      { id: "c8-2", nm: "냉각", children: [{ id: "c8-2-1", nm: "온도" }, { id: "c8-2-2", nm: "팬" }] },
      { id: "c8-3", nm: "스토리지", children: [{ id: "c8-3-1", nm: "RAID" }, { id: "c8-3-2", nm: "SMART" }] },
    ]},
  ];

  const [tree,      setTree]      = useState(initTree);
  const [sel1,      setSel1]      = useState(null);
  const [sel2,      setSel2]      = useState(null);
  const [sel3,      setSel3]      = useState(null);
  const [editId,    setEditId]    = useState(null);
  const [editNm,    setEditNm]    = useState("");
  const [addDepth,  setAddDepth]  = useState(null);
  const [addNm,     setAddNm]     = useState("");
  const [sortMode,  setSortMode]  = useState(false);
  const [sortSaved, setSortSaved] = useState(false);
  const [overItem,  setOverItem]  = useState(null); // { depth, id }
  const dragRef = React.useRef(null); // { depth, id }

  const depth2 = sel1 ? (tree.find(c => c.id === sel1)?.children || []) : [];
  const depth3 = sel2 ? (depth2.find(c => c.id === sel2)?.children || []) : [];

  const genId = (prefix) => prefix + "-" + Date.now();

  const startAdd = (depth) => { setAddDepth(depth); setAddNm(""); };
  const cancelAdd = () => { setAddDepth(null); setAddNm(""); };
  const commitAdd = () => {
    if (!addNm.trim()) { cancelAdd(); return; }
    const nm = addNm.trim();
    if (addDepth === 1) setTree(p => [...p, { id: genId("c"), nm, children: [] }]);
    if (addDepth === 2 && sel1) setTree(p => p.map(c => c.id === sel1 ? { ...c, children: [...c.children, { id: genId("c2"), nm, children: [] }] } : c));
    if (addDepth === 3 && sel1 && sel2) setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === sel2 ? { ...c2, children: [...c2.children, { id: genId("c3"), nm }] } : c2) } : c1));
    cancelAdd();
  };

  const delCat1 = (id) => { setTree(p => p.filter(c => c.id !== id)); if (sel1 === id) { setSel1(null); setSel2(null); setSel3(null); } };
  const delCat2 = (id) => { setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.filter(c2 => c2.id !== id) } : c1)); if (sel2 === id) { setSel2(null); setSel3(null); } };
  const delCat3 = (id) => { setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === sel2 ? { ...c2, children: c2.children.filter(c3 => c3.id !== id) } : c2) } : c1)); if (sel3 === id) setSel3(null); };

  const startEdit = (id, nm) => { setEditId(id); setEditNm(nm); };
  const saveEdit = (depth) => {
    if (!editNm.trim()) { setEditId(null); return; }
    if (depth === 1) setTree(p => p.map(c => c.id === editId ? { ...c, nm: editNm.trim() } : c));
    if (depth === 2) setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === editId ? { ...c2, nm: editNm.trim() } : c2) } : c1));
    if (depth === 3) setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === sel2 ? { ...c2, children: c2.children.map(c3 => c3.id === editId ? { ...c3, nm: editNm.trim() } : c3) } : c2) } : c1));
    setEditId(null);
  };

  /* ── 순서변경 저장 ── */
  const saveSort = () => { setSortMode(false); setSortSaved(true); setTimeout(() => setSortSaved(false), 2200); };
  const cancelSort = () => { setSortMode(false); setTree(initTree); };

  /* ── 드래그&드롭: useRef로 dragIdx 추적, setOverItem으로 over 하이라이트 ── */
  const onDragStart = (depth, id) => { dragRef.current = { depth, id }; };
  const onDragOver  = (e, depth, id) => {
    e.preventDefault();
    if (!dragRef.current || dragRef.current.depth !== depth) return;
    setOverItem({ depth, id });
  };
  const onDragEnd   = () => { setOverItem(null); dragRef.current = null; };
  const onDrop      = (e, depth, targetId) => {
    e.preventDefault();
    const drag = dragRef.current;
    if (!drag || drag.depth !== depth || drag.id === targetId) { onDragEnd(); return; }
    const reorder = (arr) => {
      const from = arr.findIndex(x => x.id === drag.id);
      const to   = arr.findIndex(x => x.id === targetId);
      if (from < 0 || to < 0) return arr;
      const next = [...arr];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    };
    if (depth === 1) setTree(p => reorder(p));
    if (depth === 2) setTree(p => p.map(c => c.id === sel1 ? { ...c, children: reorder(c.children) } : c));
    if (depth === 3) setTree(p => p.map(c1 => c1.id === sel1
      ? { ...c1, children: c1.children.map(c2 => c2.id === sel2 ? { ...c2, children: reorder(c2.children) } : c2) }
      : c1));
    onDragEnd();
  };

  const colHeader = (label, count, onAdd) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `2px solid ${C.brd}`, background: "#F9FAFC" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.txt }}>{label} <span style={{ fontWeight: 400, fontSize: 12, color: C.txL }}>({count})</span></div>
      {sortMode
        ? <span style={{ fontSize: 12, color: C.pri, background: "#EEF2FF", padding: "2px 8px", borderRadius: 8, border: `1px solid ${C.priL}` }}>드래그로 순서 변경</span>
        : <span onClick={onAdd} style={{ cursor: "pointer", fontSize: 18, color: C.pri, fontWeight: 700, lineHeight: 1 }} title={`${label} 추가`}>+</span>
      }
    </div>
  );

  const catRow = (item, isActive, onSelect, onDel, depth) => {
    const isOver = sortMode && overItem?.depth === depth && overItem?.id === item.id;
    const isDrag = sortMode && dragRef.current?.depth === depth && dragRef.current?.id === item.id;
    return (
      <div
        key={item.id}
        draggable={sortMode}
        onDragStart={sortMode ? () => onDragStart(depth, item.id) : undefined}
        onDragOver={sortMode  ? (e) => onDragOver(e, depth, item.id) : undefined}
        onDrop={sortMode      ? (e) => onDrop(e, depth, item.id) : undefined}
        onDragEnd={sortMode   ? onDragEnd : undefined}
        onClick={() => !sortMode && editId !== item.id && onSelect(item.id)}
        style={{
          display: "flex", alignItems: "center", padding: "9px 14px",
          cursor: sortMode ? "grab" : "pointer",
          background: isOver ? "#EEF2FF" : isActive ? C.priL : "",
          borderBottom: `1px solid ${C.brd}`,
          borderTop: isOver ? `2px solid ${C.pri}` : "2px solid transparent",
          opacity: isDrag ? 0.4 : 1,
          transition: "background .12s, opacity .12s",
          userSelect: "none",
        }}
        onMouseEnter={e => { if (!isActive && !sortMode) e.currentTarget.style.background = "#F9FAFC"; }}
        onMouseLeave={e => { if (!isActive && !sortMode) e.currentTarget.style.background = ""; }}
      >
        {sortMode && (
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginRight: 8, flexShrink: 0, opacity: 0.4 }}>
            <rect x="1" y="1.5" width="10" height="1.5" rx="0.75" fill={C.txS}/>
            <rect x="1" y="5"   width="10" height="1.5" rx="0.75" fill={C.txS}/>
            <rect x="1" y="8.5" width="10" height="1.5" rx="0.75" fill={C.txS}/>
          </svg>
        )}
        {editId === item.id ? (
          <FormInput
            autoFocus
            value={editNm}
            onChange={e => setEditNm(e.target.value)}
            onBlur={() => saveEdit(depth)}
            onKeyDown={e => { if (e.key === "Enter") saveEdit(depth); if (e.key === "Escape") setEditId(null); }}
            onClick={e => e.stopPropagation()}
            style={{ flex: 1, padding: "2px 6px", border: `1px solid ${C.pri}`, borderRadius: 4, fontSize: 12, outline: "none" }}
          />
        ) : (
          <span style={{ flex: 1, fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? C.priD : C.txt }}>{item.nm}</span>
        )}
        {!sortMode && item.children && <span style={{ fontSize: 12, color: C.txL, marginRight: 6 }}>{item.children.length}</span>}
        {!sortMode && editId !== item.id && <>
          <span onClick={e => { e.stopPropagation(); startEdit(item.id, item.nm); }} style={{ cursor: "pointer", fontSize: 12, color: C.txL, marginRight: 6, padding: "0 2px" }} title="수정"><Icon n="edit" s={13} c={C.txL} /></span>
          <span onClick={e => { e.stopPropagation(); onDel(item.id); }} style={{ cursor: "pointer", fontSize: 15, color: C.red, fontWeight: 600 }} title="삭제">×</span>
        </>}
      </div>
    );
  };

  const addInputRow = (depth) => addDepth === depth && (
    <div style={{ display: "flex", alignItems: "center", padding: "6px 14px", borderBottom: `1px solid ${C.brd}`, background: "#f0fdf4" }}>
      <FormInput
        autoFocus
        value={addNm}
        onChange={e => setAddNm(e.target.value)}
        onBlur={commitAdd}
        onKeyDown={e => { if (e.key === "Enter") commitAdd(); if (e.key === "Escape") cancelAdd(); }}
        placeholder="이름 입력 후 Enter"
        style={{ flex: 1, padding: "4px 8px", border: `1px solid ${C.pri}`, borderRadius: 4, fontSize: 12, outline: "none" }}
      />
      <span onClick={cancelAdd} style={{ cursor: "pointer", marginLeft: 8, fontSize: 12, color: C.txL }}>취소</span>
    </div>
  );

  return (
    <div>
      <PageHeader title="카테고리 관리" bc="홈 > 환경설정 > 카테고리 관리" />
      {/* 그리드 툴바 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: 8, gap: 8 }}>
        {sortSaved && (
          <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            저장되었습니다
          </span>
        )}
        {sortMode ? (
          <>
            <Button sm onClick={cancelSort}>취소</Button>
            <Button sm primary onClick={saveSort} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              저장
            </Button>
          </>
        ) : (
          <Button sm onClick={() => { setSortMode(true); setSortSaved(false); }} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            순서변경
          </Button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        border: `1px solid ${sortMode ? C.pri : C.brd}`, borderRadius: 8, overflow: "hidden", minHeight: 400,
        boxShadow: sortMode ? `0 0 0 3px ${C.priL}` : "none", transition: "box-shadow .2s, border-color .2s" }}>
        {/* 1Depth 대분류 */}
        <div style={{ borderRight: `1px solid ${C.brd}` }}>
          {colHeader("1 Depth 대분류", tree.length, () => startAdd(1))}
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {tree.map(c => catRow(c, sel1 === c.id, (id) => { setSel1(id); setSel2(null); setSel3(null); }, delCat1, 1))}
            {!sortMode && addInputRow(1)}
            {tree.length === 0 && addDepth !== 1 && <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>대분류가 없습니다.<br/>+ 버튼으로 추가하세요.</div>}
          </div>
        </div>
        {/* 2Depth 중분류 */}
        <div style={{ borderRight: `1px solid ${C.brd}` }}>
          {colHeader("2 Depth 중분류", depth2.length, () => sel1 && startAdd(2))}
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {sel1 ? depth2.map(c => catRow(c, sel2 === c.id, (id) => { setSel2(id); setSel3(null); }, delCat2, 2)) : <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>대분류를 선택하세요</div>}
            {!sortMode && sel1 && addInputRow(2)}
            {sel1 && depth2.length === 0 && addDepth !== 2 && <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>중분류가 없습니다.<br/>+ 버튼으로 추가하세요.</div>}
          </div>
        </div>
        {/* 3Depth 소분류 */}
        <div>
          {colHeader("3 Depth 소분류", depth3.length, () => sel2 && startAdd(3))}
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {sel2 ? depth3.map(c => catRow(c, sel3 === c.id, setSel3, delCat3, 3)) : <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>중분류를 선택하세요</div>}
            {!sortMode && sel2 && addInputRow(3)}
            {sel2 && depth3.length === 0 && addDepth !== 3 && <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>소분류가 없습니다.<br/>+ 버튼으로 추가하세요.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ManagerSettingsCategoryPageProps {}

export default function ManagerSettingsCategoryPage() { return <MgrCategory />; }
