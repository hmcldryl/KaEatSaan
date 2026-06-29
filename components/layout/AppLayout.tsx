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

    const newParticle = (spread = false): Particle => {
      const duration = Math.random() * 10 + 15;
      return {
        id: idCounter++,
        emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
        left: `${Math.random() * 100}%`,
        size: Math.floor(Math.random() * 20) + 24,
        duration,
        delay: spread ? Math.random() * duration * 0.6 : 0,
      };
    };

    setParticles(Array.from({ length: 14 }, () => newParticle(true)));

    const timer = setInterval(() => {
      setParticles(prev => [...prev.slice(-20), newParticle(false)]);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
      {particles.map(p => (
        <span
          key={p.id}
          className="floating-food-emoji"
          style={{
            position: 'absolute',
            display: 'block',
            top: '100vh',
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
      {/* Single full-screen container; transform creates stacking context for fixed children */}
      <Box
        sx={{
          width: '100vw',
          height: '100dvh',
          position: 'relative',
          transform: 'translateZ(0)',
          overflow: 'hidden',
        }}
      >
        {isHome ? (
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              overflow: 'hidden',
              bgcolor: '#FFFFFF',
            }}
          >
            <FloatingEmojis />
            <Box sx={{ position: 'relative', zIndex: 20, height: '100%', overflow: 'hidden' }}>
              {children}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              paddingTop: '64px',
              paddingBottom: '100px',
              bgcolor: '#FAF9F7',
            }}
          >
            <TopAppBar />
            {children}
          </Box>
        )}

        <BottomNavBar />
        <FiltersModal open={filtersModalOpen} onClose={() => setFiltersModalOpen(false)} />
      </Box>
    </AuthProvider>
  );
}
