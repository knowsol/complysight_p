'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants/routes';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, site } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.login);
      return;
    }

    router.replace(site === 'm' ? ROUTES.md : ROUTES.sd);
  }, [isAuthenticated, router, site]);

  return null;
}
