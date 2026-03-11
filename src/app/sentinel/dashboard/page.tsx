'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { useDI } from '@/contexts/DIContext';
import { colors } from '@/lib/theme/colors';

export default function SentinelDashboardPage() {
  const { di } = useDI();
  const cnt = {
    p: di.filter((x) => x.st === '중단').length,
    d: di.filter((x) => x.st === '지연').length,
    c: di.filter((x) => x.st === '완료').length,
  };

  return (
    <div>
      <PageHeader title="대시보드" breadcrumb="홈 > 대시보드" />
      <div style={{ display: 'flex', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
        <StatCard label="오늘 점검" value={cnt.p + cnt.d + cnt.c} color={colors.secondary} icon="cal" />
        <StatCard label="진행 중" value={cnt.p} color={colors.primary} icon="check" />
        <StatCard label="지연" value={cnt.d} color={colors.red} icon="alert" />
        <StatCard label="완료" value={cnt.c} color={colors.purple} icon="check" />
      </div>
      <DataTable
        sectionTitle="나의 점검 현황"
        sectionCount={di.length}
        data={di}
        cols={[
          { title: '자원', fieldKey: 'resNm' },
          { title: '점검표', fieldKey: 'clNm' },
          { title: '예정일', fieldKey: 'due' },
          { title: '상태', fieldKey: 'st', renderCell: (v) => <Badge status={String(v)} /> },
        ]}
      />
    </div>
  );
}
