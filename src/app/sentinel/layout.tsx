'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Header, Sidebar } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { MENU_ITEMS } from '@/lib/constants/menu';
import { ROUTES } from '@/lib/constants/routes';
import { colors } from '@/lib/theme/colors';
import { PRETENDARD_FONT } from '@/lib/theme/styles';

export default function SentinelLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, switchSite, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: colors.background, fontFamily: PRETENDARD_FONT }}>
      <Header
        user={user}
        site="s"
        siteName="Sentinel"
        onSiteSwitch={() => {
          switchSite();
          router.push(ROUTES.md);
        }}
        onLogout={() => {
          logout();
          router.push(ROUTES.login);
        }}
        onPwChange={() => {
          return;
        }}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0, background: colors.background, paddingTop: 67 }}>
        <Sidebar
          menuItems={MENU_ITEMS.s}
          site="s"
          collapsed={collapsed}
          onToggle={() => {
            setCollapsed((prev) => !prev);
          }}
        />
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: colors.white,
            borderRadius: '20px 0 0 0',
            padding: '38px 40px 0 40px',
            overflowY: 'auto',
            minHeight: 0,
            minWidth: 0,
            marginLeft: 30,
            scrollbarGutter: 'stable',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
