/**
 * CategoryPill Component
 * 
 * Individual category button for the Discovery Portal.
 * Features premium styling, animations, and accessibility support.
 */

import { motion } from 'framer-motion';
import { BusinessCategoryInfo } from '../store/AppContext';
import { pillVariants } from '../utils/animations';
import { getGlassClasses } from '../utils/glassMorphism';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CategoryPillProps {
  category: BusinessCategoryInfo;
  isActive: boolean;
  onClick: () => void;
}

export default function CategoryPill({ category, isActive, onClick }: CategoryPillProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.button
      onClick={onClick}
      variants={pillVariants}
      whileHover={prefersReducedMotion ? undefined : "hover"}
      whileTap={prefersReducedMotion ? undefined : "tap"}
      className={`
        px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest 
        whitespace-nowrap transition-all border flex items-center gap-2
        ${isActive 
          ? 'bg-primary border-transparent text-white shadow-lg shadow-primary/30' 
          : `${getGlassClasses('card')} text-text-dim hover:border-white/10`
        }
      `}
      aria-label={`Filter by ${category.label}`}
      aria-pressed={isActive}
      role="button"
      tabIndex={0}
    >
      <span className="text-base">{category.icon}</span>
      <span>{category.label}</span>
    </motion.button>
  );
}
