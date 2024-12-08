'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config';
import DashboardDrawer from '../components/DashboardDrawer';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <main className="flex-1">
      <DashboardDrawer>{children}</DashboardDrawer>
    </main>
  );
}
