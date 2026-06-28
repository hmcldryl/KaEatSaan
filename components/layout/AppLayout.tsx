'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import TopAppBar from './TopAppBar';
import BottomNavBar from './BottomNavBar';
import FiltersModal from '@/components/filters/FiltersModal';
import AuthProvider from '@/components/auth/AuthProvider';
import { useUIStore } from '@/lib/store/uiStore';
import { useGeolocation } from '@/hooks/useGeolocation';

const FOOD_EMOJIS = ['🍜', '🍔', '🍕', '🌮', '🍣', '🍗', '🥘', '🍲', '🍱', '🍤'];

interface Particle {
  id: number;
  emoji: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
}

function FloatingEmojis() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    let idCounter = 0;

    const newParticle = (): Particle => ({
      id: idCounter++,
      emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
      left: `${Math.random() * 100}%`,
      size: Math.floor(Math.random() * 20) + 24,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    });

    setParticles(Array.from({ length: 12 }, newParticle));

    const timer = setInterval(() => {
      setParticles(prev => [...prev.slice(-18), newParticle()]);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
      {particles.map(p => (
        <span
          key={p.id}
          className="floating-food-emoji"
          style={{
            left: p.left,
            fontSize: p.size,
            '--drift-duration': `${p.duration}s`,
            animationDelay: `-${p.delay}s`,
          } as React.CSSProperties}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { filtersModalOpen, setFiltersModalOpen } = useUIStore();
  const pathname = usePathname();
  const isHome = pathname === '/';

  useGeolocation(true);

  return (
    <AuthProvider>
      {isHome ? (
        <Box sx={{ position: 'relative', height: '100dvh', overflow: 'hidden', background: 'linear-gradient(175deg, #FF6B35 0%, #C94D15 100%)' }}>
          <FloatingEmojis />
          <Box sx={{ position: 'relative', zIndex: 20, height: '100%', overflow: 'hidden' }}>
            {children}
          </Box>
          <BottomNavBar />
          <FiltersModal open={filtersModalOpen} onClose={() => setFiltersModalOpen(false)} />
        </Box>
      ) : (
        <Box sx={{ minHeight: '100vh', paddingTop: '64px', paddingBottom: '80px', backgroundColor: '#FAF9F7' }}>
          <TopAppBar />
          {children}
          <BottomNavBar />
          <FiltersModal open={filtersModalOpen} onClose={() => setFiltersModalOpen(false)} />
        </Box>
      )}
    </AuthProvider>
  );
}
