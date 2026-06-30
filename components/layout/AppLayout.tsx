'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import TopAppBar from './TopAppBar';
import BottomNavBar from './BottomNavBar';
import FiltersModal from '@/components/filters/FiltersModal';
import AuthProvider from '@/components/auth/AuthProvider';
import { useUIStore } from '@/lib/store/uiStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useUserProfileStore } from '@/lib/store/userProfileStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { initCursorTracker } from '@/lib/cursorTracker';
import XPFloatingNotifications from '@/components/layout/XPFloatingNotifications';

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
        size: Math.floor(Math.random() * 30) + 36,
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
      <AnimatePresence>
        {particles.map(p => (
          <motion.span
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const filtersModalOpen = useUIStore((s) => s.filtersModalOpen);
  const setFiltersModalOpen = useUIStore((s) => s.setFiltersModalOpen);
  const user = useAuthStore((s) => s.user);
  const listenProfile = useUserProfileStore((s) => s.listen);
  const stopListeningProfile = useUserProfileStore((s) => s.stopListening);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useGeolocation(true);

  useEffect(() => initCursorTracker(), []);

  useEffect(() => {
    if (!user) return;
    const unsub = listenProfile(user.uid);
    return () => { stopListeningProfile(user.uid); unsub(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

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
              paddingTop: { xs: '56px', sm: '64px' },
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
        <XPFloatingNotifications />
      </Box>
    </AuthProvider>
  );
}
