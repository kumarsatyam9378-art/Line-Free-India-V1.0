/**
 * Animation Utility Functions
 * 
 * Centralized animation configurations and Framer Motion variants
 * for consistent animations throughout the application.
 */

import { Variants } from 'framer-motion';

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================

export const ANIMATION_CONFIG = {
  durations: {
    micro: 0.15,      // 150ms - Micro-interactions
    fast: 0.2,        // 200ms - Button feedback
    normal: 0.3,      // 300ms - Standard transitions
    slow: 0.4,        // 400ms - Page transitions
    decorative: 0.6,  // 600ms - Decorative animations
  },
  
  easing: {
    standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
    decelerate: [0, 0, 0.2, 1] as [number, number, number, number],
    accelerate: [0.4, 0, 1, 1] as [number, number, number, number],
    sharp: [0.4, 0, 0.6, 1] as [number, number, number, number],
  },
  
  stagger: {
    delay: 0.06, // 60ms between staggered elements
  },
};

// ============================================================================
// FRAMER MOTION VARIANTS
// ============================================================================

/**
 * Fade In Up Animation
 * Element fades in while moving up from below
 */
export const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: ANIMATION_CONFIG.durations.fast,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
};

/**
 * Fade In Down Animation
 * Element fades in while moving down from above
 */
export const fadeInDown: Variants = {
  initial: { 
    opacity: 0, 
    y: -20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: ANIMATION_CONFIG.durations.fast,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
};

/**
 * Scale In Animation
 * Element scales up from 95% to 100% with fade
 */
export const scaleIn: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: ANIMATION_CONFIG.durations.fast,
      ease: ANIMATION_CONFIG.easing.decelerate,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: ANIMATION_CONFIG.durations.micro,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
};

/**
 * Slide In Right Animation
 * Element slides in from the right
 */
export const slideInRight: Variants = {
  initial: { 
    x: '100%',
    opacity: 0,
  },
  animate: { 
    x: 0,
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
  exit: { 
    x: '100%',
    opacity: 0,
    transition: {
      duration: ANIMATION_CONFIG.durations.fast,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
};

/**
 * Slide In Left Animation
 * Element slides in from the left
 */
export const slideInLeft: Variants = {
  initial: { 
    x: '-100%',
    opacity: 0,
  },
  animate: { 
    x: 0,
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
  exit: { 
    x: '-100%',
    opacity: 0,
    transition: {
      duration: ANIMATION_CONFIG.durations.fast,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
};

/**
 * Fade In Animation
 * Simple fade in/out
 */
export const fadeIn: Variants = {
  initial: { 
    opacity: 0 
  },
  animate: { 
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: ANIMATION_CONFIG.durations.fast,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
};

/**
 * Stagger Container
 * Container for staggered children animations
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.delay,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.delay / 2,
      staggerDirection: -1,
    },
  },
};

/**
 * Stagger Item
 * Child element for staggered animations
 */
export const staggerItem: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: ANIMATION_CONFIG.durations.fast,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
};

/**
 * Rotate In Animation
 * Element rotates in with fade
 */
export const rotateIn: Variants = {
  initial: { 
    opacity: 0, 
    rotate: -180,
    scale: 0.5,
  },
  animate: { 
    opacity: 1, 
    rotate: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_CONFIG.durations.slow,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
  exit: { 
    opacity: 0, 
    rotate: 180,
    scale: 0.5,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
};

/**
 * Bounce In Animation
 * Element bounces in with spring physics
 */
export const bounceIn: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.3 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.3,
    transition: {
      duration: ANIMATION_CONFIG.durations.fast,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a custom stagger delay
 */
export const createStaggerDelay = (index: number, baseDelay: number = ANIMATION_CONFIG.stagger.delay) => {
  return index * baseDelay;
};

/**
 * Get animation duration in milliseconds
 */
export const getAnimationDuration = (type: keyof typeof ANIMATION_CONFIG.durations): number => {
  return ANIMATION_CONFIG.durations[type] * 1000;
};

/**
 * Create a custom fade in up variant with custom values
 */
export const createFadeInUp = (distance: number = 20, duration: number = ANIMATION_CONFIG.durations.normal): Variants => ({
  initial: { opacity: 0, y: distance },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
  exit: { 
    opacity: 0, 
    y: -distance,
    transition: {
      duration: duration * 0.7,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
});

/**
 * Create a custom scale variant
 */
export const createScale = (from: number = 0.95, to: number = 1, duration: number = ANIMATION_CONFIG.durations.fast): Variants => ({
  initial: { opacity: 0, scale: from },
  animate: { 
    opacity: 1, 
    scale: to,
    transition: {
      duration,
      ease: ANIMATION_CONFIG.easing.decelerate,
    },
  },
  exit: { 
    opacity: 0, 
    scale: from,
    transition: {
      duration: duration * 0.7,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
});

export default {
  fadeInUp,
  fadeInDown,
  scaleIn,
  slideInRight,
  slideInLeft,
  fadeIn,
  staggerContainer,
  staggerItem,
  rotateIn,
  bounceIn,
  ANIMATION_CONFIG,
  createStaggerDelay,
  getAnimationDuration,
  createFadeInUp,
  createScale,
};
