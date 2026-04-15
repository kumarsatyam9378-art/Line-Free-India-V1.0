import { motion, HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ANIMATION_DURATIONS, ANIMATION_SCALES, ANIMATION_TRANSLATIONS, OPACITY_VALUES } from '../config/animations';
import { cn } from '../utils/cn';
import { spin } from '../utils/animationVariants';

/**
 * GradientButton Component
 * 
 * Premium button component with gradient backgrounds and smooth animations.
 * 
 * Features:
 * - Gradient backgrounds with multiple color variants
 * - Smooth hover animations (lift, scale, glow)
 * - Click feedback animation
 * - Loading state with spinner
 * - Disabled state
 * - Multiple sizes (sm, md, lg)
 * - Icon support
 * - Full width option
 * - Accessibility support (respects prefers-reduced-motion)
 */

export interface GradientButtonProps extends Omit<HTMLMotionProps<'button'>, 'onClick'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const variantStyles = {
  primary: {
    gradient: 'linear-gradient(135deg, #00f0ff 0%, #0ea5e9 100%)',
    glow: '0 8px 32px rgba(0, 240, 255, 0.3)',
    glowHover: '0 12px 40px rgba(0, 240, 255, 0.4)',
  },
  secondary: {
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    glow: '0 8px 32px rgba(139, 92, 246, 0.3)',
    glowHover: '0 12px 40px rgba(139, 92, 246, 0.4)',
  },
  accent: {
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
    glow: '0 8px 32px rgba(244, 63, 94, 0.3)',
    glowHover: '0 12px 40px rgba(244, 63, 94, 0.4)',
  },
  danger: {
    gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    glow: '0 8px 32px rgba(220, 38, 38, 0.3)',
    glowHover: '0 12px 40px rgba(220, 38, 38, 0.4)',
  },
};

const sizeStyles = {
  sm: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    iconSize: 'w-4 h-4',
  },
  md: {
    padding: 'px-6 py-3',
    text: 'text-base',
    iconSize: 'w-5 h-5',
  },
  lg: {
    padding: 'px-8 py-4',
    text: 'text-lg',
    iconSize: 'w-6 h-6',
  },
};

export default function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  icon,
  fullWidth = false,
  className,
  ...motionProps
}: GradientButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const styles = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const isDisabled = disabled || loading;

  // Animation variants
  const hoverAnimation = !shouldReduceMotion && !isDisabled ? {
    y: ANIMATION_TRANSLATIONS.buttonHoverUp,
    scale: ANIMATION_SCALES.buttonHover,
  } : {};

  const tapAnimation = !shouldReduceMotion && !isDisabled ? {
    scale: ANIMATION_SCALES.active,
  } : {};

  return (
    <motion.button
      initial={false}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      transition={{
        duration: ANIMATION_DURATIONS.fast / 1000,
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className={cn(
        'relative font-semibold rounded-xl overflow-hidden',
        'transition-all duration-300',
        'focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-transparent',
        sizeStyle.padding,
        sizeStyle.text,
        fullWidth && 'w-full',
        isDisabled && 'cursor-not-allowed',
        !isDisabled && 'cursor-pointer',
        className
      )}
      style={{
        background: styles.gradient,
        boxShadow: isDisabled ? 'none' : styles.glow,
        opacity: isDisabled ? OPACITY_VALUES.disabled : 1,
        willChange: !shouldReduceMotion && !isDisabled ? 'transform' : 'auto',
      }}
      {...motionProps}
    >
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <motion.div
            variants={spin}
            animate="animate"
            className={cn('border-2 border-white border-t-transparent rounded-full', sizeStyle.iconSize)}
          />
        ) : icon ? (
          <span className={sizeStyle.iconSize}>{icon}</span>
        ) : null}
        {children}
      </span>

      {/* Hover glow effect */}
      {!isDisabled && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: ANIMATION_DURATIONS.fast / 1000 }}
          style={{
            boxShadow: styles.glowHover,
          }}
        />
      )}

      {/* Shimmer effect overlay */}
      {!isDisabled && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{
            x: '200%',
            transition: {
              duration: 2,
              ease: 'linear',
            },
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }}
        />
      )}
    </motion.button>
  );
}

/**
 * GradientIconButton Component
 * 
 * Icon-only variant of GradientButton for compact UI elements
 */
export function GradientIconButton({
  icon,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className,
  ...motionProps
}: Omit<GradientButtonProps, 'children'> & { icon: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const hoverAnimation = !shouldReduceMotion && !isDisabled ? {
    scale: ANIMATION_SCALES.iconHover,
  } : {};

  const tapAnimation = !shouldReduceMotion && !isDisabled ? {
    scale: ANIMATION_SCALES.active,
  } : {};

  return (
    <motion.button
      initial={false}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      transition={{
        duration: ANIMATION_DURATIONS.fast / 1000,
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className={cn(
        'relative rounded-xl overflow-hidden',
        'transition-all duration-300',
        'focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-transparent',
        sizeClasses[size],
        isDisabled && 'cursor-not-allowed',
        !isDisabled && 'cursor-pointer',
        className
      )}
      style={{
        background: styles.gradient,
        boxShadow: isDisabled ? 'none' : styles.glow,
        opacity: isDisabled ? OPACITY_VALUES.disabled : 1,
        willChange: !shouldReduceMotion && !isDisabled ? 'transform' : 'auto',
      }}
      {...motionProps}
    >
      <span className={cn('relative z-10 flex items-center justify-center', iconSizes[size])}>
        {loading ? (
          <motion.div
            variants={spin}
            animate="animate"
            className={cn('border-2 border-white border-t-transparent rounded-full', iconSizes[size])}
          />
        ) : (
          icon
        )}
      </span>

      {/* Hover glow effect */}
      {!isDisabled && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: ANIMATION_DURATIONS.fast / 1000 }}
          style={{
            boxShadow: styles.glowHover,
          }}
        />
      )}
    </motion.button>
  );
}
