import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { setThemeMode, ThemeMode } from '../hooks/useTheme';
import { t } from '../i18n';

export default function ThemeSelect() {
  const { lang, user, role } = useApp();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (user && role) {
      const homePath = role === 'business' ? '/barber/home' : '/customer/home';
      nav(homePath, { replace: true });
      return;
    }
    setTimeout(() => setShow(true), 300);
  }, [user, role, nav]);

  const select = (mode: ThemeMode) => {
    setThemeMode(mode);
    setToast(mode === 'dark' ? '✅ ' + t('darkMode', lang) : '✅ ' + t('lightMode', lang));
    setTimeout(() => nav('/role'), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)' }}>
      {/* Ultra Premium Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(circle, #8B5CF6, #EC4899, #06B6D4)' }}
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
            opacity: [0.12, 0.22, 0.12]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, #10B981, #F59E0B, #EF4444)' }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:px-8 xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: show ? 1 : 0, y: show ? 0 : 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-7xl mx-auto"
        >
          {/* Brand Header */}
          <div className="w-full mb-12 sm:mb-16 text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-4 text-white"
            >
              {t('chooseTheme', lang)}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-white/70"
            >
              {t('themeDescription', lang)}
            </motion.p>
          </div>

          {/* Theme Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full px-2 sm:px-0">
            {/* Dark Mode Card */}
            <motion.button
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              onClick={() => select('dark')}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex flex-col items-start p-8 md:p-10 lg:p-12 rounded-[2rem] text-left overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                backdropFilter: 'blur(32px)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 20px 60px rgba(59, 130, 246, 0.2)',
              }}
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center text-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))',
                  border: '2px solid rgba(59, 130, 246, 0.5)',
                }}
              >
                🌙
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-black mb-3 text-white">
                {t('darkMode', lang)}
              </h2>
              <p className="mb-8 text-white/60 text-base md:text-lg">
                {t('darkModeDesc', lang)}
              </p>
              <motion.div
                className="flex items-center font-black text-lg group-hover:translate-x-3 transition-transform"
                style={{ color: '#3B82F6' }}
              >
                <span>{t('selectDark', lang)}</span>
                <span className="ml-3 text-2xl">→</span>
              </motion.div>
            </motion.button>

            {/* Light Mode Card */}
            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              onClick={() => select('light')}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex flex-col items-start p-8 md:p-10 lg:p-12 rounded-[2rem] text-left overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
                backdropFilter: 'blur(32px)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                boxShadow: '0 20px 60px rgba(251, 191, 36, 0.2)',
              }}
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center text-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.3))',
                  border: '2px solid rgba(251, 191, 36, 0.5)',
                }}
              >
                ☀️
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-black mb-3 text-white">
                {t('lightMode', lang)}
              </h2>
              <p className="mb-8 text-white/60 text-base md:text-lg">
                {t('lightModeDesc', lang)}
              </p>
              <motion.div
                className="flex items-center font-black text-lg group-hover:translate-x-3 transition-transform"
                style={{ color: '#FBB F24' }}
              >
                <span>{t('selectLight', lang)}</span>
                <span className="ml-3 text-2xl">→</span>
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 15 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-10 py-5 font-black text-lg flex items-center gap-4 z-50"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: 'white',
              borderRadius: '2rem',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.5)',
            }}
          >
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
