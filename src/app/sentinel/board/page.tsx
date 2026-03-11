'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { DataTable } from '@/components/ui/DataTable';
import { NT } from '@/data/notices';
import { NoticePanel } from '@/components/panels';
import type { Notice } from '@/types/notice';

export default function SentinelBoardPage() {
  const [selected, setSelected] = useState<Notice | null>(null);

  return (
    <div>
      <PageHeader title="게시판" breadcrumb="홈 > 게시판" />
      <SearchBar placeholder="제목으로 검색" />
      <DataTable
        sectionTitle="공지사항 목록"
        sectionCount={NT.length}
        data={NT}
        onRow={(row) => setSelected(row as Notice)}
        cols={[
          { title: 'No', fieldKey: 'id', width: 60 },
          { title: '제목', fieldKey: 'title', align: 'left', minWidth: 280 },
          { title: '등록자', fieldKey: 'user' },
          { title: '등록일', fieldKey: 'dt' },
          { title: '조회수', fieldKey: 'views' },
        ]}
      />
      <NoticePanel open={Boolean(selected)} onClose={() => setSelected(null)} item={selected} viewOnly />
    </div>
  );
}
