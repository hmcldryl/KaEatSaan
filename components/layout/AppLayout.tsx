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
        // For initial batch: spread across screen using random fraction of duration
        // For new particles: start from bottom (delay=0)
        delay: spread ? Math.random() * duration * 0.9 : 0,
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
      {/* Outer wrapper — white/beige on desktop, transparent on mobile */}
      <Box
        sx={{
          width: '100vw',
          height: '100dvh',
          bgcolor: { xs: 'transparent', sm: '#FAF9F7' },
          display: { xs: 'block', sm: 'flex' },
          alignItems: { sm: 'center' },
          justifyContent: { sm: 'center' },
        }}
      >
        {/* Phone frame container */}
        <Box
          sx={{
            width: { xs: '100%', sm: '390px' },
            height: { xs: '100dvh', sm: 'min(844px, 95dvh)' },
            overflow: 'hidden',
            borderRadius: { sm: '48px' },
            // Dark phone bezel on desktop; creates stacking context so
            // position:fixed children (TopAppBar, BottomNavBar) are
            // contained within this frame rather than the viewport
            boxShadow: { sm: '0 0 0 10px #1a1a2e, 0 40px 80px rgba(0,0,0,0.28)' },
            position: 'relative',
            transform: 'translateZ(0)',
          }}
        >
          {isHome ? (
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                overflow: 'hidden',
                background: 'linear-gradient(175deg, #FF6B35 0%, #C94D15 100%)',
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
      </Box>
    </AuthProvider>
  );
}
