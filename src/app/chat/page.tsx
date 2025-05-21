'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatCanvasUI from '@/components/ChatCanvasUI';

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  return (
    <div className="relative min-h-screen">
      <ChatCanvasUI />
    </div>
  );
} 