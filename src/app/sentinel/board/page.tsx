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
      <PageHeader title="게시판" bc="홈 > 게시판" />
      <SearchBar ph="제목으로 검색" />
      <DataTable
        secTitle="공지사항 목록"
        secCount={NT.length}
        data={NT}
        onRow={(row) => setSelected(row as Notice)}
        cols={[
          { t: 'No', k: 'id', w: 60 },
          { t: '제목', k: 'title', align: 'left', mw: 280 },
          { t: '등록자', k: 'user' },
          { t: '등록일', k: 'dt' },
          { t: '조회수', k: 'views' },
        ]}
      />
      <NoticePanel open={Boolean(selected)} onClose={() => setSelected(null)} item={selected} viewOnly />
    </div>
  );
}
