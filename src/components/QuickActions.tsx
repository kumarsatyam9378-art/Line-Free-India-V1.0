import { useNavigate } from 'react-router-dom';
import { useApp, getCategoryInfo } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickActionsProps {
  onClose: () => void;
}

export default function QuickActions({ onClose }: QuickActionsProps) {
  const nav = useNavigate();
  const { businessProfile } = useApp();
  const catType = businessProfile?.businessType || 'men_salon';
  const catInfo = getCategoryInfo(catType);

  const actions = [
    { icon: '📋', label: 'Queue', path: '/barber/customers', color: '#06B6D4' },
    { icon: '📊', label: 'Analytics', path: '/barber/analytics', color: '#8B5CF6' },
    { icon: '💬', label: 'Messages', path: '/barber/messages', color: '#EC4899' },
    { icon: '📢', label: 'WhatsApp CRM', path: '/barber/whatsapp', color: '#10B981' },
    { icon: '🛍️', label: 'Sell Products', path: '/barber/sell-products', color: '#F59E0B' },
    { icon: '📋', label: 'Dashboard', path: '/barber/home', color: '#EF4444' },
    { icon: '🎨', label: 'QR Code', path: '/barber/qr', color: '#A855F7' },
    { icon: '👥', label: 'Staff', path: '/barber/staff', color: '#F43F5E' },
    { icon: '⚙️', label: 'Settings', path: '/barber/profile', color: '#6366F1' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[70]"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={e => e.stopPropagation()}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[460px] p-6 relative overflow-hidden"
          style={{
            borderRadius: '32px',
            background: 'linear-gradient(135deg, rgba(30, 30, 35, 0.98), rgba(18, 18, 22, 0.98))',
            backdropFilter: 'blur(32px)',
            border: '1.5px solid rgba(255,255,255,0.1)',
            boxShadow: '0 -30px 80px rgba(0,0,0,0.7), 0 10px 40px rgba(0,240,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Animated Background Gradient */}
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15), transparent 50%)',
                'radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15), transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent 50%)',
                'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15), transparent 50%)',
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{ borderRadius: '32px' }}
          />
          
          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: '32px' }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
                className="absolute w-1 h-1 rounded-full bg-white/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-10 h-10 flex items-center justify-center rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.2))',
                  border: '1.5px solid rgba(0, 240, 255, 0.3)',
                  boxShadow: '0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(139, 92, 246, 0.2) inset'
                }}
              >
                <span className="text-xl" style={{ filter: 'drop-shadow(0 0 12px rgba(0,240,255,0.6))' }}>⚡</span>
              </motion.div>
              <div>
                <h3 
                  className="text-lg font-black uppercase tracking-[0.15em]"
                  style={{
                    background: 'linear-gradient(135deg, #00F0FF, #8B5CF6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.3))'
                  }}
                >
                  Quick Actions
                </h3>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider mt-0.5">Lightning Fast Access</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center transition-all"
              style={{ 
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
                border: '1.5px solid rgba(255,255,255,0.1)',
                color: '#A1A1AA',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <span className="text-lg font-bold">✕</span>
            </motion.button>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-3 gap-4">
            {actions.map((a, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.7, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 250, damping: 15 }}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => { nav(a.path); onClose(); }}
                className="relative flex flex-col items-center gap-3 p-4 transition-all group overflow-hidden"
                style={{ 
                  borderRadius: '22px',
                  background: `linear-gradient(135deg, ${a.color}15, ${a.color}08)`,
                  border: `1.5px solid ${a.color}30`,
                  boxShadow: `0 8px 24px ${a.color}20, 0 0 0 1px ${a.color}10 inset`
                }}
              >
                {/* Animated Glow Background */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-[22px] blur-xl"
                  style={{ 
                    background: `radial-gradient(circle at 50% 50%, ${a.color}40, transparent 70%)`
                  }}
                />
                
                {/* Shimmer Effect */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                  className="absolute inset-0 w-1/2"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${a.color}30, transparent)`,
                    transform: 'skewX(-20deg)'
                  }}
                />

                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="relative w-14 h-14 flex items-center justify-center text-2xl z-10"
                  style={{ 
                    borderRadius: '18px',
                    background: `linear-gradient(135deg, ${a.color}25, ${a.color}15)`,
                    border: `2px solid ${a.color}40`,
                    boxShadow: `0 4px 16px ${a.color}30, 0 0 20px ${a.color}20 inset`,
                    filter: 'brightness(1.1)'
                  }}
                >
                  {/* Inner Glow */}
                  <div 
                    className="absolute inset-0 rounded-[18px] blur-md"
                    style={{ background: `${a.color}20` }}
                  />
                  <span className="relative z-10 drop-shadow-lg">{a.icon}</span>
                </motion.div>

                {/* Label */}
                <span 
                  className="relative text-[9px] font-black text-center leading-tight uppercase tracking-[0.1em] z-10 transition-all group-hover:scale-105"
                  style={{ 
                    color: a.color,
                    textShadow: `0 0 10px ${a.color}40, 0 2px 4px rgba(0,0,0,0.3)`,
                    filter: 'brightness(1.2)'
                  }}
                >
                  {a.label}
                </span>

                {/* Hover Glow Border */}
                <motion.div
                  className="absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: `0 0 30px ${a.color}60, 0 0 60px ${a.color}30 inset`,
                    border: `2px solid ${a.color}50`
                  }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
