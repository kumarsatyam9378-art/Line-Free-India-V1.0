import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { triggerHaptic } from '../utils/haptics';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_BUSINESS_NICHE_ROWS } from '../config/businessRegistry.data';
import { FaSearch, FaMagic, FaHeart, FaMapMarkerAlt, FaStar, FaFire, FaCrown, FaBolt } from 'react-icons/fa';
import { useResponsive } from '../hooks/useResponsive';

export default function CustomerHome() {
  const { user, customerProfile, allSalons, isFavorite, toggleFavorite } = useApp();
  const nav = useNavigate();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [greeting, setGreeting] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good Morning');
    else if (h < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const filteredSalons = useMemo(() => {
    let list = [...allSalons];
    
    // 1. Category Filtering
    if (activeCategory !== 'all') {
      const niche = ALL_BUSINESS_NICHE_ROWS.find(n => n.id === activeCategory);
      if (niche) {
        // Match via template type (e.g. 'men_salon') OR the raw businessType matching the niche id
        list = list.filter(b => 
          b.businessType === niche.template || 
          b.businessType === activeCategory ||
          b.businessType === niche.id
        );
      } else {
        // Direct category match
        list = list.filter(b => b.businessType === activeCategory);
      }
    }

    // 2. Search Query Filtering
    if (searchQuery) {
      list = list.filter(b =>
        b.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.businessType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 3. Advanced Sorting (Trends)
    list.sort((a, b) => {
      // Prioritize Open status
      if (a.isOpen && !b.isOpen) return -1;
      if (!a.isOpen && b.isOpen) return 1;

      // Prioritize Popularity (Rating * Count)
      const aScore = (a.rating || 0) * (a.totalReviews || 0);
      const bScore = (b.rating || 0) * (b.totalReviews || 0);
      if (bScore !== aScore) return bScore - aScore;

      // Fallback: Newest first
      return ((b.createdAt as number) || 0) - ((a.createdAt as number) || 0);
    });

    return list;
  }, [allSalons, activeCategory, searchQuery]);

  // Responsive sizing
  const headerPadding = isMobile ? 'px-6 pt-14 pb-6' : isTablet ? 'px-8 pt-16 pb-8' : 'px-10 pt-20 pb-10';
  const titleSize = isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-6xl';
  const avatarSize = isMobile ? 'w-14 h-14' : isTablet ? 'w-16 h-16' : 'w-20 h-20';
  const contentPadding = isMobile ? 'px-5' : isTablet ? 'px-8' : 'px-10';
  const cardSize = isMobile ? 'w-20 h-24' : isTablet ? 'w-24 h-28' : 'w-28 h-32';

  return (
    <ResponsiveContainer variant="customer">
      <div className="h-full flex flex-col font-sans selection:bg-primary/30 relative overflow-hidden bg-black">
        {/* 🌟 BLACK & YELLOW ANIMATED BACKGROUND */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Yellow Gradient Orbs on Black */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              rotate: [0, 180, 360],
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-30%] right-[-20%] w-[80%] h-[80%] rounded-full blur-[180px]"
            style={{ background: 'radial-gradient(circle, #FFD700, #FFA500, #FF8C00)' }}
          />
          <motion.div
            animate={{
              scale: [1.4, 1, 1.4],
              rotate: [360, 180, 0],
              opacity: [0.12, 0.25, 0.12]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-30%] left-[-20%] w-[70%] h-[70%] rounded-full blur-[160px]"
            style={{ background: 'radial-gradient(circle, #FFFF00, #FFD700, #FFA500)' }}
          />
          <motion.div
            animate={{
              x: [0, 150, 0],
              y: [0, -150, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[40%] w-[60%] h-[60%] rounded-full blur-[140px]"
            style={{ background: 'radial-gradient(circle, #F59E0B, #FBBF24, #FCD34D)' }}
          />

          {/* Golden Floating Particles */}
          {[...Array(50)].map((_, i) => {
            const yellowShades = ['#FFD700', '#FFA500', '#FFFF00', '#F59E0B', '#FBBF24'];
            const randomYellow = yellowShades[Math.floor(Math.random() * yellowShades.length)];
            return (
              <motion.div
                key={i}
                animate={{
                  y: [0, -200, 0],
                  x: [0, Math.random() * 100 - 50, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                }}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${2 + Math.random() * 4}px`,
                  height: `${2 + Math.random() * 4}px`,
                  background: randomYellow,
                  boxShadow: `0 0 15px ${randomYellow}`
                }}
              />
            );
          })}

          {/* Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,215,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        {/* ── Ultra Premium Fixed Header ── */}
        <div className={`${headerPadding} sticky top-0 z-30 backdrop-blur-2xl border-b border-white/10 flex-shrink-0 relative overflow-hidden`}
          style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.85), rgba(30, 15, 45, 0.85))',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Header Shimmer Effect */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-1/2"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
              transform: 'skewX(-20deg)'
            }}
          />

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="space-y-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/50"
                >
                  <FaBolt className="text-white text-sm" />
                </motion.div>
                <div>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] block">{greeting}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                    <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">Live Now</span>
                  </div>
                </div>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className={`${titleSize} font-black tracking-tighter relative`}
                style={{
                  background: 'linear-gradient(135deg, #ffffff, #8B5CF6, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))'
                }}
              >
                {customerProfile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Explorer'}
              </motion.h1>
            </div>
            <motion.button 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => nav('/customer/profile')}
              className={`${avatarSize} rounded-[2rem] p-[3px] relative overflow-hidden`}
              style={{ 
                minHeight: '44px', 
                minWidth: '44px',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #06B6D4)',
                boxShadow: '0 10px 40px rgba(139, 92, 246, 0.5)'
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              <div className="w-full h-full rounded-[1.7rem] bg-[#0a0a0b] flex items-center justify-center overflow-hidden relative z-10">
                {(customerProfile?.photoURL || user?.photoURL)
                  ? <img src={customerProfile?.photoURL || user?.photoURL || ''} className="w-full h-full object-cover" alt="" />
                  : <span className="text-3xl">⚡</span>}
              </div>
            </motion.button>
          </div>

          {/* 💎 Ultra Premium Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            {/* Glow Effect */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.98, 1.02, 0.98]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"
            />
            
            <div className="relative rounded-[2rem] overflow-hidden border-2 border-white/10 group-focus-within:border-primary/50 transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                backdropFilter: 'blur(40px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Shimmer Effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/2"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                  transform: 'skewX(-20deg)'
                }}
              />

              <div className="flex items-center px-6 py-5 relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaSearch className="text-primary text-xl pointer-events-none drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                </motion.div>
                <input
                  type="text"
                  placeholder="Discover premium excellence..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-1 px-5 text-base font-bold text-white outline-none placeholder:text-white/30"
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-primary/60 text-[10px] font-black tracking-wider uppercase"
                >
                  ⌘K
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-40">
        {/* 📡 Live Pulse Feed (Following) */}
        {customerProfile?.following && customerProfile.following.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-6 my-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] shadow-inner border border-primary/20">📡</div>
              <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-text-dim">Pulse Feed: Following</h2>
            </div>
            <div className="flex flex-col gap-2">
              {allSalons.filter(s => customerProfile.following?.includes(s.uid) && s.announcement).map((followed, fi) => (
                <motion.button 
                  key={followed.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: fi * 0.1 }}
                  onClick={() => nav(`/customer/salon/${followed.uid}`)}
                  className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-xl p-3 flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                    <img src={followed.photoURL} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[9px] font-black text-text uppercase tracking-widest truncate mb-0.5">{followed.businessName}</p>
                    <p className="text-[10px] text-text-dim truncate italic opacity-60">"{followed.announcement}"</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        <div className="space-y-10 pt-4">
          {/* 🚀 Ultra Premium Discovery Section */}
          <section className={`${contentPadding} spatial-perspective`}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline justify-between mb-8 px-1"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/50"
                >
                  <FaFire className="text-white text-lg" />
                </motion.div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider">Discovery Portal</h2>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Explore Premium Services</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => nav('/customer/search')} 
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/50 border border-white/20"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                View All →
              </motion.button>
            </motion.div>
            
            <div className={`flex gap-6 overflow-x-auto pb-8 custom-scrollbar no-scrollbar -mx-${isMobile ? '5' : isTablet ? '8' : '10'} px-${isMobile ? '5' : isTablet ? '8' : '10'}`} style={{ touchAction: 'pan-x' }}>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -12, scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => { triggerHaptic('light'); setActiveCategory('all'); }}
                className="flex-shrink-0 w-28 flex flex-col items-center gap-4"
              >
                <div className={`w-28 h-32 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all duration-500 relative overflow-hidden ${
                  activeCategory === 'all' 
                    ? 'border-2 border-primary shadow-[0_0_40px_rgba(139,92,246,0.6)]' 
                    : 'border-2 border-white/10 hover:border-white/30'
                }`}
                  style={{
                    background: activeCategory === 'all'
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(40px)',
                    boxShadow: activeCategory === 'all' 
                      ? '0 20px 60px rgba(139, 92, 246, 0.4), inset 0 0 40px rgba(139, 92, 246, 0.2)'
                      : '0 10px 30px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {/* Animated Background */}
                  {activeCategory === 'all' && (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 blur-2xl"
                      />
                    </>
                  )}
                  
                  <motion.div
                    animate={activeCategory === 'all' ? { scale: [1, 1.2, 1], rotate: [0, 360, 0] } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`text-5xl relative z-10 ${activeCategory === 'all' ? 'drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]' : ''}`}
                  >
                    <FaMagic className={activeCategory === 'all' ? 'text-primary' : 'text-white/40'} />
                  </motion.div>
                  <span className={`text-[10px] font-black uppercase tracking-widest text-center px-2 relative z-10 ${
                    activeCategory === 'all' ? 'text-primary' : 'text-white/40'
                  }`}>
                    Trending
                  </span>
                </div>
              </motion.button>

              {ALL_BUSINESS_NICHE_ROWS.map((niche, i) => {
                const isActive = activeCategory === niche.id;
                return (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -12, scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    key={niche.id}
                    onClick={() => { triggerHaptic('light'); setActiveCategory(niche.id); }}
                    className="flex-shrink-0 w-28 flex flex-col items-center gap-4"
                  >
                    <div className={`w-28 h-32 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all duration-500 relative overflow-hidden ${
                      isActive 
                        ? 'border-2 border-primary shadow-[0_0_40px_rgba(139,92,246,0.6)]' 
                        : 'border-2 border-white/10 hover:border-white/30'
                    }`}
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        backdropFilter: 'blur(40px)',
                        boxShadow: isActive 
                          ? '0 20px 60px rgba(139, 92, 246, 0.4), inset 0 0 40px rgba(139, 92, 246, 0.2)'
                          : '0 10px 30px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {/* Animated Background */}
                      {isActive && (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 blur-2xl"
                          />
                        </>
                      )}
                      
                      <motion.div
                        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`text-5xl relative z-10 ${isActive ? 'drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]' : ''}`}
                      >
                        <span className={isActive ? 'text-primary' : 'text-white/40'}>{niche.icon}</span>
                      </motion.div>
                      <span className={`text-[10px] font-black uppercase tracking-widest text-center truncate w-full px-2 relative z-10 ${
                        isActive ? 'text-primary' : 'text-white/40'
                      }`}>
                        {niche.label.split('/')[0]}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>



          {/* 🏢 Ultra Premium Business Catalog */}
          <section className={contentPadding}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/50"
                >
                  <FaCrown className="text-white text-lg" />
                </motion.div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-white">
                    {searchQuery ? 'Search Results' : 'Premium Partners'}
                  </h2>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                    {filteredSalons.length} Elite Businesses
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredSalons.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-24 text-center rounded-[3rem] relative overflow-hidden border-2 border-white/10"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                      backdropFilter: 'blur(40px)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FaMagic className="text-6xl mx-auto mb-6 text-primary opacity-30 drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]" />
                    </motion.div>
                    <p className="font-black text-white text-2xl mb-2">No Results Found</p>
                    <p className="text-xs text-white/40 tracking-widest uppercase font-black">Try adjusting your filters</p>
                  </motion.div>
                ) : (
                  filteredSalons.map((business, i) => {
                    const imageSize = isMobile ? 'w-28 h-28' : isTablet ? 'w-32 h-32' : 'w-36 h-36';
                    
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.05 }}
                        key={business.uid}
                        onClick={() => nav(`/customer/salon/${business.uid}`)}
                        className="group relative p-6 flex gap-6 cursor-pointer rounded-[3rem] border-2 border-white/10 hover:border-primary/50 transition-all duration-500 overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
                          backdropFilter: 'blur(40px)',
                          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.05)'
                        }}
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        {/* Animated Background Effects */}
                        <motion.div
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 w-1/2"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
                            transform: 'skewX(-20deg)'
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1), transparent 70%)'
                          }}
                        />

                        {/* Business Image */}
                        <div className={`${imageSize} rounded-[2.5rem] flex-shrink-0 overflow-hidden relative border-2 border-white/20 shadow-2xl`}
                          style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
                            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
                          }}
                        >
                          {business.bannerImageURL
                            ? <img 
                                src={business.bannerImageURL} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                                alt=""
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-5xl opacity-30">✨</div>';
                                  }
                                }}
                              />
                            : <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">✨</div>}
                          
                          {/* Rating Badge */}
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent"
                          >
                            <div className="px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center justify-center gap-2 text-yellow-400 border border-yellow-400/30"
                              style={{
                                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(234, 179, 8, 0.1))',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)'
                              }}
                            >
                              <FaStar className="text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" />
                              {business.rating || 4.9}
                            </div>
                          </motion.div>
                        </div>

                        {/* Business Info */}
                        <div className="flex-1 flex flex-col justify-center min-w-0 relative z-10">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-black text-white ${isMobile ? 'text-lg' : 'text-xl'} leading-tight tracking-tight group-hover:text-primary transition-colors mb-2 uppercase`}
                                style={{
                                  textShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                                }}
                              >
                                {business.businessName}
                              </h3>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-wider mb-3">
                                <FaMapMarkerAlt className="text-primary" />
                                <span className="truncate">{business.location || 'Universal Platform'}</span>
                              </div>
                            </div>
                            
                            {/* Favorite Button */}
                            <motion.button
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={e => { e.stopPropagation(); toggleFavorite(business.uid); }}
                              className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-white/20 transition-all"
                              style={{
                                minHeight: '44px',
                                minWidth: '44px',
                                background: isFavorite(business.uid)
                                  ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(239, 68, 68, 0.3))'
                                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                                backdropFilter: 'blur(20px)',
                                boxShadow: isFavorite(business.uid) 
                                  ? '0 0 20px rgba(236, 72, 153, 0.5)' 
                                  : '0 5px 15px rgba(0, 0, 0, 0.2)'
                              }}
                            >
                              <span className="text-2xl">{isFavorite(business.uid) ? '❤️' : '🤍'}</span>
                            </motion.button>
                          </div>
                          
                          {/* Status & Price Tags */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest ${
                                business.isOpen 
                                  ? 'border-green-400/30 text-green-400' 
                                  : 'border-white/10 text-white/30'
                              }`}
                              style={{
                                background: business.isOpen
                                  ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.2))'
                                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                                backdropFilter: 'blur(20px)',
                                boxShadow: business.isOpen 
                                  ? '0 0 20px rgba(74, 222, 128, 0.3)' 
                                  : 'none'
                              }}
                            >
                              <motion.div 
                                animate={business.isOpen ? { scale: [1, 1.3, 1] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`w-2 h-2 rounded-full ${
                                  business.isOpen 
                                    ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' 
                                    : 'bg-white/20'
                                }`} 
                              />
                              {business.isOpen ? 'Live Now' : 'Offline'}
                            </motion.div>
                            
                            {business.services?.length > 0 && (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="px-4 py-2 rounded-xl border-2 border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
                                  backdropFilter: 'blur(20px)',
                                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                                }}
                              >
                                From ₹{Math.min(...business.services.map((s: any) => s.price))}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
      <BottomNav />
    </div>
  </ResponsiveContainer>
  );
}
