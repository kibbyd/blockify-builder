'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function useSubscription() {
  const { data: session, status } = useSession();
  const [sub, setSub] = useState({ isActive: false, isTrialing: false, daysLeft: 0, status: null, loading: true });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      setSub({ isActive: false, isTrialing: false, daysLeft: 0, status: null, loading: false });
      return;
    }

    let cancelled = false;

    async function fetchSubscription() {
      try {
        const res = await fetch('/api/auth/subscription');
        if (!res.ok) {
          setSub((s) => ({ ...s, loading: false }));
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setSub({
            isActive: data.isActive,
            isTrialing: data.isTrialing,
            daysLeft: data.daysLeft,
            status: data.status,
            loading: false,
          });
        }
      } catch {
        if (!cancelled) setSub((s) => ({ ...s, loading: false }));
      }
    }

    fetchSubscription();
    return () => { cancelled = true; };
  }, [session, status]);

  return { ...sub, authenticated: !!session, sessionLoading: status === 'loading' };
}
