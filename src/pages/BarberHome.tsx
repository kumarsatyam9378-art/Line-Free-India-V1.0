import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp, TokenEntry } from '../store/AppContext';
import { getCategoryTheme } from '../config/categoryThemes';
import { useTheme } from '../hooks/useTheme';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../utils/haptics';
import { t } from '../i18n';
import { 
  FaBolt, 
  FaChartBar, 
  FaBell,
  FaPowerOff,
  FaArrowRight,
  FaCoffee,
  FaStopCircle,
  FaPlayCircle,
  FaUsers,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import { FaQrcode } from 'react-icons/fa6';

export default function BarberHome() {
  const { 
    businessProfile, 
    user, 
    signOutUser, 
    toggleSalonOpen, 
    toggleSalonBreak, 
    toggleSalonStop, 
    unreadCount, 
    nextCustomer, 
    loading, 
    theme: globalTheme,
    toggleTheme,
    lang
  } = useApp();
  
  const nav = useNavigate();
  const [todayTokens, setTodayTokens] = useState<TokenEntry[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [breakDuration, setBreakDuration] = useState(15);
  const [customDuration, setCustomDuration] = useState('');
  const [breakStartTime, setBreakStartTime] = useState('');
  const [breakEndTime, setBreakEndTime] = useState('');

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const catType = businessProfile?.businessType || 'mens_salon';
  const theme = getCategoryTheme(catType);

  useTheme(catType);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tokens'), where('salonId', '==', user.uid), where('date', '==', today));
    const unsub = onSnapshot(q, (snap) => {
      const tks = snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry));
      tks.sort((a, b) => a.tokenNumber - b.tokenNumber);
      setTodayTokens(tks);
      setEarnings(tks.filter(t => t.status === 'done').reduce((a, c) => a + (c.totalPrice || 0), 0));
    }, err => console.error('Dashboard tokens:', err));
    return () => unsub();
  }, [user, today]);

  const handleLogout = async () => {
    await signOutUser();
    nav('/', { replace: true });
  };

  const bp = businessProfile;
  
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-6">
       <div className="w-16 h-16 bg-primary rounded-3xl animate-bounce flex items-center justify-center shadow-2xl">
          <span className="text-2xl">✨</span>
       </div>
       <p className="mt-4 text-text-dim font-black uppercase tracking-widest text-[10px]">Syncing Universe...</p>
    </div>
  );

  if (!bp) return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] flex items-center justify-center text-4xl mb-8 shadow-2xl">🚀</div>
      <h2 className="text-3xl font-black text-text mb-4">Start Your Empire</h2>
      <p className="text-text-dim mb-10">Welcome to Line Free India. Setup your profile to start managing your business.</p>
      <button onClick={() => nav('/barber/setup')} className="w-full max-w-xs bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl">Launch Base →</button>
    </div>
  );

  const waitingCount = todayTokens.filter(t => t.status === 'waiting').length;
  const servingToken = todayTokens.find(t => t.status === 'serving');
  
  // Check if everything is active (colorful) or not (dark)
  // Colorful when: business open AND break off (tokens can be paused)
  const isFullyActive = bp.isOpen && !bp.isBreak;

  const handleStartBreak = async () => {
    if (breakStartTime && breakEndTime) {
      // Time-based break
      const now = new Date();
      const [startHour, startMin] = breakStartTime.split(':').map(Number);
      const [endHour, endMin] = breakEndTime.split(':').map(Number);
      
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMin);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMin);
      
      await updateDoc(doc(db, 'barbers', user!.uid), { 
        isBreak: true,
        breakStartTime: start.getTime(),
        breakEndTime: end.getTime()
      });
      showFeedback(`Break: ${breakStartTime} - ${breakEndTime}`);
    } else {
      // Duration-based break
      const duration = breakDuration === 0 ? parseInt(customDuration) : breakDuration;
      await updateDoc(doc(db, 'barbers', user!.uid), { 
        isBreak: true,
        breakStartTime: Date.now(),
        breakEndTime: Date.now() + duration * 60 * 1000
      });
      showFeedback(`Break Started: ${duration} minutes`);
    }
    setShowBreakModal(false);
    setBreakStartTime('');
    setBreakEndTime('');
    setBreakDuration(15);
    setCustomDuration('');
  };

  return (
    <div className={`h-full overflow-y-auto ${isFullyActive ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950' : 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'} text-text pb-32 overflow-x-hidden custom-scrollbar relative`}>
      {/* Ultra Colorful Animated Background - Only when fully active */}
      {isFullyActive && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 blur-[150px]"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-cyan-500 via-green-500 to-yellow-500 blur-[150px]"
          />
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[30%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 blur-[120px]"
          />
        </div>
      )}

      {/* Floating Particles - Only when fully active */}
      {isFullyActive && (
        <div className="fixed inset-0 pointer-events-none -z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              className="absolute w-2 h-2 rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}

      <div className="p-6 pt-14 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">{t('commandCenter', lang)}</span>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-2 h-2 rounded-full ${bp.isOpen ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-red-400 shadow-[0_0_10px_#f87171]'}`} 
              />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
               {bp.businessName}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { toggleTheme(); showFeedback(t('themeChanged', lang)); }} 
              className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center transition-all shadow-md"
            >
              {globalTheme === 'dark' ? <FaSun className="text-white" /> : <FaMoon className="text-white" />}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => nav('/barber/notifications')} 
              className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center transition-all shadow-md"
            >
              <FaBell className="text-white" />
              {unreadCount > 0 && (
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl text-[10px] flex items-center justify-center font-black text-white border-4 border-slate-950 shadow-lg"
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Action Feedback Toast */}
        <AnimatePresence>
           {feedback && (
             <motion.div 
               initial={{ y: -50, opacity: 0, scale: 0.8 }}
               animate={{ y: 0, opacity: 1, scale: 1 }}
               exit={{ y: -50, opacity: 0, scale: 0.8 }}
               className="fixed top-10 left-1/2 -translate-x-1/2 z-[3000] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3 text-white"
             >
                <motion.div 
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-white" 
                /> 
                {feedback}
             </motion.div>
           )}
        </AnimatePresence>

        {/* Status Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 mb-8 border border-white/30 shadow-lg"
        >
          <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">{t('currentStatus', lang)}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{t('business', lang)}</span>
              <span className={`text-sm font-black uppercase tracking-wider ${bp.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                {bp.isOpen ? t('open', lang).toUpperCase() : t('closed', lang).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{t('breakStatus', lang)}</span>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-black uppercase tracking-wider ${bp.isBreak ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {bp.isBreak ? t('on', lang) : t('off', lang)}
                </span>
                {bp.isBreak && (
                  <button 
                    onClick={async () => { 
                      const newTime = (bp.breakStartTime || Date.now()) + 15 * 60 * 1000;
                      await updateDoc(doc(db, 'barbers', user!.uid), { breakStartTime: newTime });
                      showFeedback(t('breakExtended', lang));
                    }}
                    className="px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-xl text-[9px] font-bold text-yellow-400 uppercase tracking-wider hover:bg-yellow-500/30 transition-all"
                  >
                    +15 min
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{t('tokens', lang)}</span>
              <span className={`text-sm font-black uppercase tracking-wider ${bp.isStopped ? 'text-red-400' : 'text-green-400'}`}>
                {bp.isStopped ? t('paused', lang) : t('active', lang)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[3rem] p-8 mb-12 border border-white/30 shadow-lg relative overflow-hidden"
        >
          {/* Animated gradient overlay */}
          <motion.div 
            animate={{ 
              background: [
                'linear-gradient(45deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1))',
                'linear-gradient(90deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))',
                'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(236,72,153,0.1))',
              ]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-0 pointer-events-none"
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md"
                >
                   <FaBolt className="text-white" />
                </motion.div>
                <div>
                   <h3 className="text-sm font-bold text-white uppercase tracking-wide">{t('systemStatus', lang)}</h3>
                   <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider">{t('allSystemsActive', lang)}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[20px] font-black text-white/50 tracking-wider">v4.0</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="flex flex-col gap-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-3xl border border-purple-500/40"
               >
                  <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{t('customersWaiting', lang)}</p>
                  <div className="flex items-baseline gap-2">
                     <motion.span 
                       key={waitingCount}
                       initial={{ scale: 1.5, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className="text-5xl font-black type-elite-display tracking-tighter text-white"
                     >
                       {waitingCount}
                     </motion.span>
                     <span className="text-[11px] font-bold text-white/70 uppercase">{t('inQueue', lang)}</span>
                  </div>
               </motion.div>
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="flex flex-col gap-2 bg-gradient-to-br from-green-500/20 to-cyan-500/20 p-6 rounded-3xl border border-green-500/40"
               >
                  <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{t('todaysRevenue', lang)}</p>
                  <div className="flex items-baseline gap-2">
                     <motion.span 
                       key={earnings}
                       initial={{ scale: 1.5, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className="text-5xl type-elite-display font-black text-white tracking-tighter"
                     >
                       ₹{earnings}
                     </motion.span>
                  </div>
               </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Universal Control Center - Ultra Premium Quick Actions */}
        <div className="space-y-6 mb-10">
           <div className="flex gap-5">
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => { await nextCustomer(); showFeedback(servingToken ? t('serviceCompleted', lang) : t('customerCalled', lang)); }} 
                disabled={!servingToken && waitingCount === 0}
                className="flex-[2] h-28 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-[2rem] font-black text-xl shadow-[0_20px_50px_rgba(168,85,247,0.4)] flex items-center justify-center gap-4 disabled:opacity-30 relative overflow-hidden backdrop-blur-xl border-2 border-white/40 group"
              >
                <motion.div 
                  animate={{ x: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2"
                />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"
                />
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center relative z-10 border border-white/30"
                >
                  {servingToken ? <FaBolt className="text-3xl" /> : <FaArrowRight className="text-3xl" />}
                </motion.div>
                <div className="relative z-10 text-left">
                  <div className="text-2xl font-black uppercase tracking-wider mb-1">
                    {servingToken ? t('complete', lang) : t('callNext', lang)}
                  </div>
                  <div className="text-xs font-bold text-white/80 uppercase tracking-wide">
                    {servingToken ? t('finishService', lang) : t('nextCustomer', lang)}
                  </div>
                </div>
              </motion.button>
              
              <motion.button 
                whileHover={{ y: -5, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => nav('/barber/qr')} 
                className="flex-1 h-28 bg-gradient-to-br from-violet-600 to-fuchsia-700 rounded-[2rem] border-2 border-violet-300/50 backdrop-blur-xl flex flex-col items-center justify-center gap-3 transition-all shadow-[0_20px_50px_rgba(139,92,246,0.4)] relative overflow-hidden group"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                />
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10"
                >
                  <FaQrcode className="text-white text-4xl drop-shadow-lg" />
                </motion.div>
                <span className="text-sm font-black text-white uppercase tracking-wider relative z-10">{t('qrCode', lang)}</span>
              </motion.button>
           </div>

           <div className="grid grid-cols-3 gap-5">
              <motion.button 
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={async () => { await toggleSalonOpen(); showFeedback(bp.isOpen ? t('businessClosed', lang) : t('businessOpened', lang)); }} 
                className={`h-28 rounded-[2rem] border-2 backdrop-blur-xl flex flex-col items-center justify-center gap-3 transition-all shadow-[0_15px_40px] relative overflow-hidden group ${
                  bp.isOpen 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-300/60 shadow-green-500/40' 
                    : 'bg-gradient-to-br from-gray-700 to-gray-900 border-gray-500/60 shadow-gray-900/40'
                }`}
              >
                <motion.div
                  animate={{ rotate: bp.isOpen ? 360 : 0, scale: [1, 1.2, 1] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 180 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10"
                >
                  <FaPowerOff className="text-white text-3xl drop-shadow-lg" />
                </motion.div>
                <span className="text-xs font-black text-white uppercase tracking-wide relative z-10">{bp.isOpen ? t('closed', lang) : t('open', lang)}</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={async () => { 
                  if (bp.isBreak) {
                    await toggleSalonBreak(); 
                    showFeedback(t('breakEnded', lang));
                  } else {
                    setShowBreakModal(true);
                  }
                }} 
                className={`h-28 rounded-[2rem] border-2 backdrop-blur-xl flex flex-col items-center justify-center gap-3 transition-all shadow-[0_15px_40px] relative overflow-hidden group ${
                  bp.isBreak 
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-600 border-yellow-300/60 shadow-yellow-500/40' 
                    : 'bg-gradient-to-br from-gray-700 to-gray-900 border-gray-500/60 shadow-gray-900/40'
                }`}
              >
                <motion.div
                  animate={{ scale: bp.isBreak ? [1, 1.15, 1] : 1, opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <motion.div
                  whileHover={{ scale: 1.2, rotate: -15 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10"
                >
                  <FaCoffee className="text-white text-3xl drop-shadow-lg" />
                </motion.div>
                <span className="text-xs font-black text-white uppercase tracking-wide relative z-10">{bp.isBreak ? t('endBreak', lang) : t('break', lang)}</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={async () => { await toggleSalonStop(); showFeedback(bp.isStopped ? t('tokensResumed', lang) : t('tokensPaused', lang)); }} 
                className={`h-28 rounded-[2rem] border-2 backdrop-blur-xl flex flex-col items-center justify-center gap-3 transition-all shadow-[0_15px_40px] relative overflow-hidden group ${
                  bp.isStopped 
                    ? 'bg-gradient-to-br from-red-500 to-pink-600 border-red-300/60 shadow-red-500/40' 
                    : 'bg-gradient-to-br from-green-500 to-teal-600 border-green-300/60 shadow-green-500/40'
                }`}
              >
                <motion.div
                  animate={{ x: bp.isStopped ? 0 : ['0%', '100%'], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2"
                />
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10"
                >
                  {bp.isStopped ? <FaPlayCircle className="text-white text-3xl drop-shadow-lg" /> : <FaStopCircle className="text-white text-3xl drop-shadow-lg" />}
                </motion.div>
                <span className="text-xs font-black text-white uppercase tracking-wide relative z-10">{bp.isStopped ? t('resume', lang) : t('paused', lang)}</span>
              </motion.button>
           </div>
        </div>

        {/* Business Tools Section */}
        <div className="mb-10">
          <h3 className="text-xs font-bold text-white/60 mb-5 px-1 uppercase tracking-wider">{t('businessTools', lang)}</h3>
          <div className="grid grid-cols-2 gap-5">
             <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { triggerHaptic('medium'); nav('/barber/crm'); }} 
              className="bg-gradient-to-br from-blue-500/90 to-indigo-600/90 p-6 rounded-2xl border border-blue-400/30 backdrop-blur-xl flex flex-col items-center gap-3 transition-all shadow-lg group relative overflow-hidden"
             >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white border border-white/30 relative z-10"
                >
                   <FaUsers className="text-xl" />
                </motion.div>
                <span className="text-[10px] font-bold text-white relative z-10 uppercase tracking-wide">{t('customers', lang)}</span>
             </motion.button>
             <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { triggerHaptic('medium'); nav('/barber/analytics'); }} 
              className="bg-gradient-to-br from-purple-500/90 to-pink-600/90 p-6 rounded-2xl border border-purple-400/30 backdrop-blur-xl flex flex-col items-center gap-3 transition-all shadow-lg group relative overflow-hidden"
             >
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white border border-white/30 relative z-10"
                >
                   <FaChartBar className="text-xl" />
                </motion.div>
                <span className="text-[10px] font-bold text-white relative z-10 uppercase tracking-wide">{t('analytics', lang)}</span>
             </motion.button>
             <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { triggerHaptic('medium'); nav('/barber/whatsapp'); }} 
              className="bg-gradient-to-br from-green-500/90 to-emerald-600/90 p-6 rounded-2xl border border-green-400/30 backdrop-blur-xl flex flex-col items-center gap-3 transition-all shadow-lg group relative overflow-hidden"
             >
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 relative z-10"
                >
                   <span className="text-xl">💬</span>
                </motion.div>
                <span className="text-[10px] font-bold text-white relative z-10 uppercase tracking-wide">{t('whatsapp', lang)}</span>
             </motion.button>
             <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { triggerHaptic('medium'); nav('/barber/sell-products'); }} 
              className="bg-gradient-to-br from-orange-500/90 to-red-600/90 p-6 rounded-2xl border border-orange-400/30 backdrop-blur-xl flex flex-col items-center gap-3 transition-all shadow-lg group relative overflow-hidden"
             >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 relative z-10"
                >
                   <span className="text-xl">🛍️</span>
                </motion.div>
                <span className="text-[10px] font-bold text-white relative z-10 uppercase tracking-wide">Products</span>
             </motion.button>
          </div>
          
          {/* Large Highlighted Business OS Terminal Button */}
          <motion.button 
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { triggerHaptic('medium'); nav('/barber/tools'); }} 
            className="w-full mt-8 p-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl border-2 border-cyan-300/60 backdrop-blur-xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-cyan-500/50 relative overflow-hidden group"
          >
            <motion.div 
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/40 relative z-10"
            >
              <span className="text-3xl">🚀</span>
            </motion.div>
            <div className="relative z-10 text-left">
              <div className="text-xl font-black text-white uppercase tracking-wider mb-1">Business OS</div>
              <div className="text-xs font-bold text-white/80 uppercase tracking-wide">Access All Tools →</div>
            </div>
          </motion.button>
        </div>

        <div className="h-32" />
      </div>

      {/* Break Duration Modal */}
      <AnimatePresence>
        {showBreakModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
            onClick={() => setShowBreakModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 max-w-md w-full border border-white/20 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white mb-6 text-center">Break Duration</h2>
              
              {/* Quick Duration Options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => { setBreakDuration(15); setBreakStartTime(''); setBreakEndTime(''); }}
                  className={`w-full p-4 rounded-2xl font-bold text-white transition-all ${
                    breakDuration === 15 && !breakStartTime 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 scale-105' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  15 Minutes
                </button>
                <button
                  onClick={() => { setBreakDuration(30); setBreakStartTime(''); setBreakEndTime(''); }}
                  className={`w-full p-4 rounded-2xl font-bold text-white transition-all ${
                    breakDuration === 30 && !breakStartTime 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 scale-105' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  30 Minutes
                </button>
                <button
                  onClick={() => { setBreakDuration(60); setBreakStartTime(''); setBreakEndTime(''); }}
                  className={`w-full p-4 rounded-2xl font-bold text-white transition-all ${
                    breakDuration === 60 && !breakStartTime 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 scale-105' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  1 Hour
                </button>
              </div>

              {/* Custom Duration */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">Custom Duration (minutes)</label>
                <input
                  type="number"
                  value={customDuration}
                  onChange={(e) => { setCustomDuration(e.target.value); setBreakDuration(0); setBreakStartTime(''); setBreakEndTime(''); }}
                  placeholder="Enter minutes"
                  className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold placeholder-white/40 focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Time Range */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">Or Set Time Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">From</label>
                    <input
                      type="time"
                      value={breakStartTime}
                      onChange={(e) => { setBreakStartTime(e.target.value); setBreakDuration(0); setCustomDuration(''); }}
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">To</label>
                    <input
                      type="time"
                      value={breakEndTime}
                      onChange={(e) => { setBreakEndTime(e.target.value); setBreakDuration(0); setCustomDuration(''); }}
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBreakModal(false)}
                  className="flex-1 p-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartBreak}
                  disabled={!breakDuration && !customDuration && !breakStartTime && !breakEndTime}
                  className="flex-1 p-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black uppercase tracking-wider hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Break
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
