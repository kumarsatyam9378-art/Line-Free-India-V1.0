import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getGradientPalette, getMobileGradientPalette } from '../config/gradients';
import { isMobileDevice } from '../utils/performanceMonitor';
import { useEffect, useState } from 'react';

/**
 * AnimatedBackground Component
 * 
 * Multi-layer animated gradient background with theme-aware colors
 * and responsive optimization for mobile devices.
 * 
 * Features:
 * - Dynamic gradient orbs with smooth animations
 * - Theme-aware color palettes (light/dark mode)
 * - Mobile optimization (reduced orb count and blur)
 * - Accessibility support (respects prefers-reduced-motion)
 * - Multiple variants for different page types
 */

export interface AnimatedBackgroundProps {
  variant?: 'customer' | 'business' | 'auth' | 'landing' | 'dashboard' | 'default';
  intensity?: number; // 0.1 to 1.0
  speed?: number; // 0.5 to 2.0 multiplier
  orbCount?: number; // 2 to 4
  noiseOverlay?: boolean;
}

export default function AnimatedBackground({ 
  variant = 'default',
  intensity = 1.0,
  speed = 1.0,
  orbCount,
  noiseOverlay = true,
}: AnimatedBackgroundProps) {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Get appropriate gradient palette based on device and theme
  const gradientOrbs = isMobile 
    ? getMobileGradientPalette(variant, theme)
    : getGradientPalette(variant, theme);

  // Limit orb count if specified
  const orbs = orbCount ? gradientOrbs.slice(0, orbCount) : gradientOrbs;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {orbs.map((orb, index) => (
        <motion.div
          key={`gradient-orb-${index}`}
          animate={shouldReduceMotion ? {} : {
            x: orb.animation.x,
            y: orb.animation.y,
            scale: orb.animation.scale,
          }}
          transition={shouldReduceMotion ? { duration: 0.01 } : {
            duration: orb.animation.duration * speed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full"
          style={{
            ...orb.position,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity * intensity,
            mixBlendMode: 'screen',
            willChange: shouldReduceMotion ? 'auto' : 'transform',
          }}
        />
      ))}

      {/* Noise overlay for texture */}
      {noiseOverlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 80%)'
              : 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,255,255,0.5) 80%)',
            opacity: 0.4,
          }}
        />
      )}
    </div>
  );
}
