'use client';

import { DemoAuthProvider } from '@/contexts/DemoAuthContext';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoAuthProvider>
      {children}
    </DemoAuthProvider>
  );
}
