import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { motion } from 'framer-motion';
import { t } from '../i18n';

export default function RoleSelect() {
  const { setRole, lang } = useApp();
  const nav = useNavigate();

  const select = (r: 'customer' | 'business') => {
    setRole(r);
    if (r === 'customer') nav('/customer/auth');
    else nav('/barber/auth');
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Animated Blobs */}
        <motion.div
          animate={{
            x: ['0px', '30px', '-20px', '0px'],
            y: ['0px', '-50px', '20px', '0px'],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full mix-blend-screen filter blur-[120px]"
          style={{ background: 'var(--color-accent)', opacity: 0.1 }}
        />
        <motion.div
          animate={{
            x: ['0px', '30px', '-20px', '0px'],
            y: ['0px', '-50px', '20px', '0px'],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] rounded-full mix-blend-screen filter blur-[100px]"
          style={{ background: 'var(--color-primary)', opacity: 0.08 }}
        />
        <motion.div
          animate={{
            x: ['0px', '30px', '-20px', '0px'],
            y: ['0px', '-50px', '20px', '0px'],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-[-10%] left-[15%] w-[45%] h-[45%] rounded-full mix-blend-screen filter blur-[140px]"
          style={{ background: 'var(--color-secondary)', opacity: 0.1 }}
        />

        {/* Floating Glass Orbs */}
        <motion.div
          animate={{
            y: ['0px', '-20px', '0px'],
            rotate: ['0deg', '10deg', '0deg'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] left-[25%] w-64 h-64 rounded-full backdrop-blur-3xl"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-card)', opacity: 0.2 }}
        />
        <motion.div
          animate={{
            y: ['0px', '-20px', '0px'],
            rotate: ['0deg', '5deg', '0deg'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: -5 }}
          className="absolute bottom-[20%] right-[20%] w-96 h-96 rounded-full backdrop-blur-2xl"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-card)', opacity: 0.1 }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md">
        <div className="flex justify-between items-center px-8 py-8 w-full max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => nav('/')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
              border: '1.5px solid rgba(139, 92, 246, 0.3)',
              color: 'var(--color-text)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
            }}
          >
            <span className="text-lg">←</span>
            <span>{t('back', lang)}</span>
          </motion.button>
          
          <div className="text-2xl font-bold tracking-[-0.04em] text-text" style={{ fontFamily: 'var(--font-space)' }}>
            Line Free India
          </div>
          
          {/* Empty div for spacing */}
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-12">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 space-y-4"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold opacity-80" style={{ color: 'var(--color-accent)' }}>
            {t('theFutureOfBusiness', lang)}
          </span>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-[-0.05em] text-text leading-tight" style={{ fontFamily: 'var(--font-space)', textShadow: '0 0 30px rgba(0, 0, 0, 0.05)' }}>
            {t('chooseYourPath', lang)}
          </h1>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl mx-auto">
          {/* Customer Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="group relative glass-panel rounded-lg p-12 flex flex-col justify-between min-h-[460px] transition-all duration-700 cursor-pointer hover:border-primary/40"
            onClick={() => select('customer')}
          >
            <div className="space-y-8">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl transition-all duration-500 shadow-inner" style={{ background: 'var(--color-card-2)' }}>
                <span style={{ filter: 'drop-shadow(0 0 10px var(--color-accent))' }}>👤</span>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-space)', color: 'var(--color-text)' }}>
                  {t('customer', lang)}
                </h2>
                <p className="text-xl leading-relaxed max-w-xs" style={{ color: 'var(--color-text-dim)' }}>
                  {t('customerDesc', lang)}
                </p>
              </div>
            </div>
            <div className="mt-12">
              <button className="w-full py-5 px-8 rounded-full border font-semibold transition-all duration-300 flex items-center justify-center gap-3 group/btn hover:bg-text hover:text-bg" style={{ background: 'var(--color-card-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                {t('startWaitingSmart', lang)}
                <span className="transition-transform group-hover/btn:translate-x-2">→</span>
              </button>
            </div>
            <div className="absolute -z-10 top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg" style={{ background: 'linear-gradient(to bottom right, var(--color-accent), transparent)', opacity: 0.05 }} />
          </motion.div>

          {/* Business Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            className="group relative glass-panel rounded-lg p-12 flex flex-col justify-between min-h-[460px] transition-all duration-700 cursor-pointer hover:border-primary/40"
            onClick={() => select('business')}
          >
            <div className="space-y-8">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl transition-all duration-500 shadow-inner" style={{ background: 'var(--color-card-2)' }}>
                <span style={{ filter: 'drop-shadow(0 0 10px var(--color-primary))' }}>🏪</span>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-space)', color: 'var(--color-text)' }}>
                  {t('business', lang)}
                </h2>
                <p className="text-xl leading-relaxed max-w-xs" style={{ color: 'var(--color-text-dim)' }}>
                  {t('businessDesc', lang)}
                </p>
              </div>
            </div>
            <div className="mt-12">
              <button className="w-full py-5 px-8 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-3 group/btn hover:shadow-2xl btn-primary">
                {t('registerYourBusiness', lang)}
                <span className="transition-transform group-hover/btn:translate-x-2">🚀</span>
              </button>
            </div>
            <div className="absolute -z-10 top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg" style={{ background: 'linear-gradient(to bottom right, var(--color-primary), transparent)', opacity: 0.05 }} />
          </motion.div>
        </div>

        {/* Bottom Context Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-28 flex flex-col items-center max-w-5xl w-full"
        >
          <div className="w-full space-y-10">
            <h3 className="text-2xl font-semibold text-center text-text" style={{ fontFamily: 'var(--font-space)' }}>
              {t('engineeredForExcellence', lang)}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '⚡', text: t('realtimeTracking', lang) },
                { icon: '📊', text: t('deepAnalytics', lang) },
                { icon: '🛡️', text: t('enterpriseSecurity', lang) },
                { icon: '📍', text: t('precisionGeofencing', lang) },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-start gap-4 p-6 glass-panel rounded-xl"
                >
                  <span className="text-3xl" style={{ filter: `drop-shadow(0 0 8px var(--color-accent))` }}>{item.icon}</span>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-8 mt-24 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <div className="text-lg font-bold text-text" style={{ fontFamily: 'var(--font-space)' }}>
              Line Free India
            </div>
            <p className="text-sm font-medium text-text-dim/60">
              © 2026 Line Free India. All architectural rights reserved.
            </p>
          </div>
          <div className="flex gap-10 text-[10px] tracking-[0.2em] uppercase text-text-dim/50">
            <a href="#" className="hover:text-text transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-text transition-colors duration-300">Terms</a>
            <a href="#" className="hover:text-text transition-colors duration-300">Security</a>
            <a href="#" className="hover:text-text transition-colors duration-300">Enterprise</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
