import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, Lang } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSelect() {
  const { setLang, user, role } = useApp();
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

  const select = (l: Lang) => {
    setLang(l);
    setToast(l === 'en' ? '✅ English Selected' : '✅ हिंदी चयनित');
    setTimeout(() => nav('/role'), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)' }}>
      {/* Ultra Premium Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs */}
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
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, #A855F7, #3B82F6)' }}
        />

        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 rounded-full bg-white/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
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
          {/* Ultra Premium Brand Header */}
          <div className="w-full mb-12 sm:mb-16 lg:mb-20 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto mb-8 rounded-[2rem] flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #06B6D4)',
                  boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4), 0 0 80px rgba(236, 72, 153, 0.3)'
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl"
                >
                  ⚡
                </motion.div>
                {/* Rotating Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-[2rem] border-4 border-white/20"
                  style={{ borderTopColor: 'rgba(255,255,255,0.6)' }}
                />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tighter mb-4 sm:mb-6 relative px-2"
              style={{ fontFamily: 'var(--font-space)' }}
            >
              <span className="text-white">Line Free </span>
              <span
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #06B6D4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.5))'
                }}
              >
                India
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto font-medium leading-relaxed text-white/70 px-4"
            >
              Select your preferred language to begin your seamless journey through premium services.
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="w-32 h-1 mx-auto mt-8 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #8B5CF6, #EC4899, transparent)'
              }}
            />
          </div>

          {/* Ultra Premium Language Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full px-2 sm:px-0">
            {/* English Card */}
            <motion.button
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              onClick={() => select('en')}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex flex-col items-start p-6 sm:p-8 md:p-10 lg:p-12 rounded-[2rem] text-left overflow-hidden transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 20px 60px rgba(59, 130, 246, 0.2), 0 0 80px rgba(139, 92, 246, 0.1) inset',
              }}
            >
              {/* Animated Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-[2rem] blur-2xl"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.4), transparent 70%)' }}
              />

              {/* Shimmer Effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/2"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transform: 'skewX(-20deg)'
                }}
              />

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center text-3xl relative z-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))',
                  border: '2px solid rgba(59, 130, 246, 0.5)',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
                }}
              >
                🇬🇧
              </motion.div>

              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 relative z-10"
                style={{
                  fontFamily: 'var(--font-space)',
                  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                English
              </h2>
              <p className="mb-6 sm:mb-8 text-white/60 relative z-10 text-sm sm:text-base md:text-lg">
                Continue with the global business standard interface.
              </p>
              <motion.div
                className="flex items-center font-black text-base sm:text-lg group-hover:translate-x-3 transition-transform relative z-10"
                style={{ color: '#3B82F6' }}
              >
                <span>Select English</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-3 text-2xl"
                >
                  →
                </motion.span>
              </motion.div>

              {/* Hover Glow Border */}
              <motion.div
                className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.4) inset',
                  border: '2px solid rgba(59, 130, 246, 0.6)'
                }}
              />
            </motion.button>

            {/* Hindi Card */}
            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              onClick={() => select('hi')}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex flex-col items-start p-6 sm:p-8 md:p-10 lg:p-12 rounded-[2rem] text-left overflow-hidden transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(239, 68, 68, 0.1))',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '2px solid rgba(236, 72, 153, 0.3)',
                boxShadow: '0 20px 60px rgba(236, 72, 153, 0.2), 0 0 80px rgba(239, 68, 68, 0.1) inset',
              }}
            >
              {/* Animated Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 rounded-[2rem] blur-2xl"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.4), transparent 70%)' }}
              />

              {/* Shimmer Effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.5 }}
                className="absolute inset-0 w-1/2"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transform: 'skewX(-20deg)'
                }}
              />

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center text-3xl relative z-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(239, 68, 68, 0.3))',
                  border: '2px solid rgba(236, 72, 153, 0.5)',
                  boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)'
                }}
              >
                🇮🇳
              </motion.div>

              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 relative z-10"
                style={{
                  fontFamily: 'var(--font-space)',
                  background: 'linear-gradient(135deg, #EC4899, #EF4444)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                हिंदी
              </h2>
              <p className="mb-6 sm:mb-8 text-white/60 relative z-10 text-sm sm:text-base md:text-lg">
                अपनी मातृभाषा में डिजिटल सेवाओं का अनुभव करें।
              </p>
              <motion.div
                className="flex items-center font-black text-base sm:text-lg group-hover:translate-x-3 transition-transform relative z-10"
                style={{ color: '#EC4899' }}
              >
                <span>हिंदी चुनें</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-3 text-2xl"
                >
                  →
                </motion.span>
              </motion.div>

              {/* Hover Glow Border */}
              <motion.div
                className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: '0 0 40px rgba(236, 72, 153, 0.6), 0 0 80px rgba(239, 68, 68, 0.4) inset',
                  border: '2px solid rgba(236, 72, 153, 0.6)'
                }}
              />
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Premium Footer */}
      <footer
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 flex flex-col md:flex-row justify-between items-center text-xs tracking-[0.2em] uppercase font-bold relative z-10"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-4 md:mb-0"
        >
          © 2026 LINE FREE INDIA
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex space-x-8"
        >
          <a href="#" className="transition-all hover:text-white hover:scale-110">Privacy</a>
          <a href="#" className="transition-all hover:text-white hover:scale-110">Terms</a>
          <a href="#" className="transition-all hover:text-white hover:scale-110">Accessibility</a>
        </motion.div>
      </footer>

      {/* Ultra Premium Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 15 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-10 py-5 font-black text-lg flex items-center gap-4 z-50 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: 'white',
              borderRadius: '2rem',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.5), 0 0 80px rgba(5, 150, 105, 0.3) inset',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            {/* Shimmer */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-1/2"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transform: 'skewX(-20deg)'
              }}
            />
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-2xl relative z-10"
            >
              ✅
            </motion.span>
            <span className="relative z-10">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
