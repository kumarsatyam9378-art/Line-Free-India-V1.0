import { useEffect } from 'react';
import { BusinessCategory } from '../store/AppContext';
import { DESIGN_TOKENS } from '../config/designTokens';

export function useTheme(category?: BusinessCategory) {
  useEffect(() => {
    const validCategory = category || 'other';
    const tokens = DESIGN_TOKENS[validCategory] || DESIGN_TOKENS.other;

    const root = document.documentElement;
    
    // Apply font (with fallback)
    if (tokens?.fontFamily) {
      root.style.setProperty('--font-sans', tokens.fontFamily);
    }
    
    // Apply unified dark-mode-first color palette
    root.style.setProperty('--color-primary', tokens?.colors?.primary || '#10B981');
    root.style.setProperty('--color-primary-dark', tokens?.colors?.primaryDark || '#059669');
    root.style.setProperty('--color-primary-light', tokens?.colors?.primaryLight || '#34D399');
    root.style.setProperty('--color-accent', tokens?.colors?.accent || '#F59E0B');
    root.style.setProperty('--color-bg', tokens?.colors?.backgroundBase || '#0A0A0F');
    root.style.setProperty('--color-card', tokens?.colors?.cardPrimary || '#1A1A2E');
    root.style.setProperty('--color-card-2', tokens?.colors?.cardSecondary || '#16213E');
    root.style.setProperty('--color-text', tokens?.colors?.textBase || '#FFFFFF');
    root.style.setProperty('--color-text-dim', tokens?.colors?.textMuted || '#9CA3AF');
    root.style.setProperty('--color-border', 'rgba(255,255,255,0.1)');

    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute('content', tokens?.colors?.backgroundBase || '#0A0A0F');

  }, [category]);
}
