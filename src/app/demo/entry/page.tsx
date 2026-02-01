'use client';

import { useDemoAuth } from '@/contexts/DemoAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DemoDashboard from '@/app/demo/page';

export default function DemoPage() {
  const { user, loading } = useDemoAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // User is logged in, show dashboard
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading demo...</p>
        </div>
      </div>
    );
  }

  return <DemoDashboard />;
}
