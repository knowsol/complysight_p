// @ts-nocheck
'use client';

import { useState } from 'react';
import { PH } from '@/components/ui/PageHeader';
import { Tbl } from '@/components/ui/Table';
import { SB } from '@/components/ui/SearchBar';
import { SecBtnP } from '@/components/ui/Button';
import { C } from '@/lib/theme/colors';
import { NT } from '@/data/notices';
import { NoticePanel } from '@/components/panels';


const MgrNotice = ({ readOnly, onBannerOn, onBannerOff }) => {
  const [items,   setItems]   = useState(NT);
  const [showAdd, setShowAdd] = useState(false);
  const [selItem, setSelItem] = useState(null);
  const [kw,      setKw]      = useState("");
  const [applied, setApplied] = useState("");

  const doSearch = (_, v) => setApplied(v ?? kw);
  const doReset  = ()     => { setKw(""); setApplied(""); };

  const handleSaveNotice = (saved) => {
    const exists = items.some(n => n.id === saved.id);
    const base = exists
      ? items.map(n => n.id === saved.id ? { ...n, ...saved } : n)
      : [{ ...saved }, ...items];
    const updated = saved.banner === "Y"
      ? base.map(n => ({ ...n, banner: n.id === saved.id ? "Y" : "N" }))
      : base.map(n => n.id === saved.id ? { ...n, banner: "N" } : n);
    setItems(updated);
    if (saved.banner === "Y") onBannerOn?.({ id: saved.id, title: saved.title });
    else onBannerOff?.();
    setSelItem(null);
    setShowAdd(false);
  };

  const handleDeleteNotice = (target) => {
    const next = items.filter(n => n.id !== target.id);
    setItems(next);
    if (target.banner === "Y") onBannerOff?.();
    setSelItem(null);
    setShowAdd(false);
  };

  const filtered = items.filter(x =>
    !applied.trim() || x.title.toLowerCase().includes(applied.trim().toLowerCase())
  );

  const listCols = readOnly
    ? [
        { t: "No", k: "id", w: 60, r: (v, row) => filtered.length - filtered.indexOf(row) },
        { t: "제목", k: "title", mw: 300, align: "left", r: v => <span style={{ fontWeight: 600, color: C.pri }}>{v}</span> },
        { t: "등록자", k: "user" },
        { t: "등록일", k: "dt" },
        { t: "조회수", k: "views" },
      ]
    : [
        { t: "No", k: "id", w: 70, r: (v, row) => filtered.length - filtered.indexOf(row) },
        { t: "제목", k: "title", mw: 300, align: "left", r: v => <span style={{ fontWeight: 600, color: C.pri }}>{v}</span> },
        { t: "배너공지", k: "banner", w: 90, r: v => v === "Y"
          ? <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#EEF4FF", color: C.pri, border: `1px solid ${C.pri}44` }}>ON</span>
          : <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 10, background: "#F3F4F6", color: C.txL }}>OFF</span>
        },
        { t: "조회수", k: "views" }, { t: "작성자", k: "user" }, { t: "등록일", k: "dt" },
      ];

  return <div>
    <PH title="공지사항" bc="홈 > 게시판 > 공지사항" />
    <SB ph="제목으로 검색" value={kw} onChange={setKw} onSearch={doSearch} onReset={doReset} />
    <Tbl secTitle="공지사항 목록" secCount={filtered.length}
      secButtons={!readOnly && <SecBtnP onClick={() => setShowAdd(true)}>+ 공지사항 등록</SecBtnP>}
      onRow={row => setSelItem(row)} cols={listCols} data={filtered} />
    {!readOnly && <NoticePanel open={showAdd} onClose={() => setShowAdd(false)} item={null} onSave={handleSaveNotice} onDelete={handleDeleteNotice} />}
    <NoticePanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} viewOnly={readOnly} onSave={handleSaveNotice} onDelete={handleDeleteNotice} />
  </div>;
};

/* ── 자료실 ── */
const LIB = [
  { id: 1, title: "2026년 정기점검 보고서 양식", views: 89, user: "김시스템", dt: "2026-01-08", file: "정기점검_보고서_양식_v2.xlsx" },
  { id: 2, title: "자원 등록 가이드 문서", views: 124, user: "김시스템", dt: "2026-01-12", file: "자원등록_가이드_v1.2.pdf" },
  { id: 3, title: "점검표 작성 매뉴얼", views: 76, user: "이기관", dt: "2026-01-18", file: "점검표_작성_매뉴얼.pdf" },
  { id: 4, title: "보안점검 체크리스트 (2026)", views: 158, user: "김시스템", dt: "2026-01-22", file: "보안점검_체크리스트_2026.xlsx" },
  { id: 5, title: "COMPLYSIGHT 사용자 매뉴얼 v2.0", views: 203, user: "김시스템", dt: "2026-01-28", file: "COMPLYSIGHT_사용자매뉴얼_v2.0.pdf" },
  { id: 6, title: "자동점검 설정 가이드", views: 67, user: "박유지보수", dt: "2026-02-01", file: "자동점검_설정가이드.pdf" },
  { id: 7, title: "네트워크 장비 점검 양식", views: 45, user: "김시스템", dt: "2026-02-05", file: "네트워크_점검양식.docx" },
  { id: 8, title: "이중화 점검 절차서", views: 91, user: "이기관", dt: "2026-02-07", file: "이중화_점검절차서_v1.1.pdf" },
  { id: 9, title: "업무집중기간 점검 계획서 템플릿", views: 38, user: "이기관", dt: "2026-02-09", file: "업무집중기간_점검계획서.docx" },
  { id: 10, title: "라이선스 관리 정책 문서", views: 52, user: "김시스템", dt: "2026-02-10", file: "라이선스_관리정책.pdf" },
];

interface ManagerBoardPageProps {
  readOnly?: boolean;
  onBannerOn?: (item: unknown) => void;
  onBannerOff?: () => void;
}

export default function ManagerBoardPage() { return <MgrNotice />; }
