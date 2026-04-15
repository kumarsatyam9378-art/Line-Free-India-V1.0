import { motion, HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ANIMATION_DURATIONS, ANIMATION_SCALES, ANIMATION_TRANSLATIONS, BLUR_VALUES } from '../config/animations';
import { cn } from '../utils/cn';

/**
 * GlassCard Component
 * 
 * A reusable card component with glass-morphism effect and smooth hover animations.
 * 
 * Features:
 * - Glass-morphism effect with backdrop blur
 * - Smooth hover animations (lift and scale)
 * - Click feedback animation
 * - Multiple variants (default, strong, subtle)
 * - Accessibility support (respects prefers-reduced-motion)
 * - Customizable via className prop
 */

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'onClick'> {
  children: React.ReactNode;
  variant?: 'default' | 'strong' | 'subtle';
  hover?: boolean; // Enable hover animations
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  default: {
    backdrop: BLUR_VALUES.glass,
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    shadowHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  strong: {
    backdrop: BLUR_VALUES.glassStrong,
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    shadowHover: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  subtle: {
    backdrop: BLUR_VALUES.glass,
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    shadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};

export default function GlassCard({
  children,
  variant = 'default',
  hover = true,
  onClick,
  className,
  ...motionProps
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const styles = variantStyles[variant];
  const isInteractive = !!onClick;

  // Animation variants
  const hoverAnimation = hover && !shouldReduceMotion ? {
    y: ANIMATION_TRANSLATIONS.cardHoverUp,
    scale: ANIMATION_SCALES.cardHover,
  } : {};

  const tapAnimation = !shouldReduceMotion ? {
    scale: ANIMATION_SCALES.active,
  } : {};

  return (
    <motion.div
      initial={false}
      whileHover={hover ? hoverAnimation : undefined}
      whileTap={isInteractive ? tapAnimation : undefined}
      onClick={onClick}
      transition={{
        duration: ANIMATION_DURATIONS.normal / 1000,
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        isInteractive && 'cursor-pointer',
        className
      )}
      style={{
        backdropFilter: `blur(${styles.backdrop}px)`,
        WebkitBackdropFilter: `blur(${styles.backdrop}px)`,
        background: styles.background,
        border: styles.border,
        boxShadow: styles.shadow,
        willChange: hover && !shouldReduceMotion ? 'transform' : 'auto',
      }}
      {...motionProps}
    >
      {children}
      
      {/* Hover shadow effect */}
      {hover && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: ANIMATION_DURATIONS.normal / 1000 }}
          style={{
            boxShadow: styles.shadowHover,
          }}
        />
      )}
    </motion.div>
  );
}

/**
 * GlassCardHeader Component
 * 
 * Optional header component for GlassCard with consistent styling
 */
export function GlassCardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-6 py-4 border-b border-white/10', className)}>
      {children}
    </div>
  );
}

/**
 * GlassCardContent Component
 * 
 * Optional content component for GlassCard with consistent padding
 */
export function GlassCardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

/**
 * GlassCardFooter Component
 * 
 * Optional footer component for GlassCard with consistent styling
 */
export function GlassCardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-6 py-4 border-t border-white/10', className)}>
      {children}
    </div>
  );
}
