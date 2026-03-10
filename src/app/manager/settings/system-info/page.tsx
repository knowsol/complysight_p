// @ts-nocheck
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { C } from '@/lib/theme/colors';
import { mockSystemInfo as SYS_INFO } from '@/data/common';


const MgrSysInfo = () => {
  const [q, setQ] = useState("");
  const filtered = SYS_INFO.filter(r => !q || r.k.toLowerCase().includes(q.toLowerCase()) || r.v.toLowerCase().includes(q.toLowerCase()));
  return <div>
    <PageHeader title="시스템정보" bc="홈 > 환경설정 > 시스템정보" />
    <DataTable secTitle="시스템 속성 정보" secCount={filtered.length} cols={[
      { t: "KEY", k: "k", align: "left" },
      { t: "VALUE", k: "v", align: "left" },
    ]} data={filtered} pageSize={25} noPaging />
  </div>;
};

interface ManagerSettingsSystemInfoPageProps {}

export default function ManagerSettingsSystemInfoPage() { return <MgrSysInfo />; }
