import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface PageTransitionProps {
  children: ReactNode;
  mode?: 'fade' | 'slide' | 'scale' | 'fade-slide';
  duration?: number;
}

/**
 * Page Transition Wrapper Component
 * 
 * Provides smooth transitions between page navigations
 * 
 * Features:
 * - Multiple transition modes (fade, slide, scale, fade-slide)
 * - Customizable duration
 * - Respects prefers-reduced-motion
 * - Works with React Router
 * 
 * @example
 * ```tsx
 * <PageTransition mode="fade-slide" duration={0.3}>
 *   <Routes>
 *     <Route path="/" element={<Home />} />
 *     <Route path="/about" element={<About />} />
 *   </Routes>
 * </PageTransition>
 * ```
 */
export function PageTransition({
  children,
  mode = 'fade-slide',
  duration = 0.3,
}: PageTransitionProps) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  // Transition variants
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { x: 20, opacity: 1 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -20, opacity: 1 },
    },
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.05, opacity: 0 },
    },
    'fade-slide': {
      initial: { x: 20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -20, opacity: 0 },
    },
  };

  const selectedVariant = variants[mode];

  // If reduced motion is preferred, use instant transitions
  if (prefersReducedMotion) {
    return <div key={location.pathname}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={selectedVariant.initial}
        animate={selectedVariant.animate}
        exit={selectedVariant.exit}
        transition={{
          duration: duration,
          ease: [0.4, 0, 0.2, 1], // Custom easing curve
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Route Transition Component
 * 
 * For individual route transitions with custom animations
 * 
 * @example
 * ```tsx
 * <RouteTransition>
 *   <HomePage />
 * </RouteTransition>
 * ```
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Modal Transition Component
 * 
 * For modal/dialog transitions with backdrop
 * 
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {isOpen && (
 *     <ModalTransition onClose={handleClose}>
 *       <ModalContent />
 *     </ModalTransition>
 *   )}
 * </AnimatePresence>
 * ```
 */
export function ModalTransition({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </>
  );
}

/**
 * Drawer Transition Component
 * 
 * For side drawer/sheet transitions
 * 
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {isOpen && (
 *     <DrawerTransition side="right" onClose={handleClose}>
 *       <DrawerContent />
 *     </DrawerTransition>
 *   )}
 * </AnimatePresence>
 * ```
 */
export function DrawerTransition({
  children,
  side = 'right',
  onClose,
}: {
  children: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  onClose?: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  const slideVariants = {
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    top: { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
    bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
  };

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <motion.div
        initial={prefersReducedMotion ? undefined : slideVariants[side].initial}
        animate={prefersReducedMotion ? undefined : slideVariants[side].animate}
        exit={prefersReducedMotion ? undefined : slideVariants[side].exit}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className={`fixed ${positionClasses[side]} z-50 bg-[var(--color-bg-primary)] shadow-2xl`}
      >
        {children}
      </motion.div>
    </>
  );
}

export default PageTransition;
