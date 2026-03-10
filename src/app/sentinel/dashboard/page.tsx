'use client';

import Box from '@mui/material/Box';

import { PH } from '@/components/ui/PageHeader';
import { Stat } from '@/components/ui/Stat';
import { Tbl } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { useDI } from '@/contexts/DIContext';
import { C } from '@/lib/theme/colors';

export default function SentinelDashboardPage() {
  const { di } = useDI();
  const cnt = {
    p: di.filter((x) => x.st === '중단').length,
    d: di.filter((x) => x.st === '지연').length,
    c: di.filter((x) => x.st === '완료').length,
  };

  return (
    <Box>
      <PH title="대시보드" bc="홈 > 대시보드" />
      <Box sx={{ display: 'flex', gap: 1.75, mb: 2.25, flexWrap: 'wrap' }}>
        <Stat label="오늘 점검" value={cnt.p + cnt.d + cnt.c} color={C.sec} icon="cal" />
        <Stat label="진행 중" value={cnt.p} color={C.pri} icon="check" />
        <Stat label="지연" value={cnt.d} color={C.red} icon="alert" />
        <Stat label="완료" value={cnt.c} color={C.purp} icon="check" />
      </Box>
      <Tbl
        secTitle="나의 점검 현황"
        secCount={di.length}
        data={di}
        cols={[
          { t: '자원', k: 'resNm' },
          { t: '점검표', k: 'clNm' },
          { t: '예정일', k: 'due' },
          { t: '상태', k: 'st', r: (v) => <Badge status={String(v)} /> },
        ]}
      />
    </Box>
  );
}
