import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, getCategoryInfo, BUSINESS_CATEGORIES } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { motion } from 'framer-motion';
import { triggerHaptic } from '../utils/haptics';

export default function CustomerHome() {
  const { 
    allSalons, 
    customerProfile, 
    isFavorite, 
    getUserLocation,
    t 
  } = useApp();
  const nav = useNavigate();
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [nearbyBusinesses, setNearbyBusinesses] = useState<any[]>([]);

  // Haversine formula for distance calculation
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  useEffect(() => {
    getUserLocation().then(loc => { 
      if(loc) {
        setUserLoc(loc);
        calculateNearbyBusinesses(loc);
      }
    });
  }, []);

  const calculateNearbyBusinesses = (loc: {lat: number, lng: number}) => {
    const businessesWithDistance = allSalons
      .filter(s => s.lat && s.lng)
      .map(s => ({
        ...s,
        distance: getDistanceKm(loc.lat, loc.lng, s.lat!, s.lng!)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
    
    setNearbyBusinesses(businessesWithDistance);
  };

  const getFilteredBusinesses = () => {
    let filtered = nearbyBusinesses;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.businessType === selectedCategory);
    }
    return filtered;
  };

  const filteredBusinesses = getFilteredBusinesses();

  return (
    <ResponsiveContainer variant="customer">
      <div className="h-full flex flex-col font-sans relative overflow-hidden bg-bg">
        {/* Header */}
        <div className="z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-2xl safe-top">
          <div className="p-6 pb-4">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-between items-center mb-6"
            >
              <div>
                <h1 className="text-3xl font-black text-text">
                  {t('home')} 👋
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim mt-1">
                  {customerProfile?.name || 'Welcome'}
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => nav('/customer/rewards')}
                  className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-xl relative"
                >
                  🎁
                  {(customerProfile?.loyaltyPoints || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full text-[8px] font-black text-white flex items-center justify-center">
                      {customerProfile?.loyaltyPoints}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => nav('/customer/notifications')}
                  className="w-12 h-12 rounded-2xl bg-card border border-white/5 flex items-center justify-center text-xl"
                >
                  🔔
                </button>
              </div>
            </motion.div>

            {/* Loyalty Points Card */}
            {(customerProfile?.loyaltyPoints || 0) > 0 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => nav('/customer/rewards')}
                className="mb-6 p-5 rounded-3xl bg-gradient-to-br from-gold/20 to-primary/10 border border-gold/30 cursor-pointer active:scale-95 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold/70">Your Rewards</p>
                    <p className="text-3xl font-black text-gold mt-1">{customerProfile?.loyaltyPoints} Points</p>
                    <p className="text-xs text-text-dim mt-1">Tap to redeem rewards</p>
                  </div>
                  <div className="text-5xl">🏆</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 pb-32">
            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              <button 
                onClick={() => nav('/customer/search')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-white/5 active:scale-95 transition-all"
              >
                <span className="text-2xl">🔍</span>
                <span className="text-[9px] font-bold text-text-dim">Search</span>
              </button>
              <button 
                onClick={() => nav('/customer/tokens')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-white/5 active:scale-95 transition-all"
              >
                <span className="text-2xl">🎫</span>
                <span className="text-[9px] font-bold text-text-dim">Activity</span>
              </button>
              <button 
                onClick={() => nav('/customer/hairstyles')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-white/5 active:scale-95 transition-all"
              >
                <span className="text-2xl">✨</span>
                <span className="text-[9px] font-bold text-text-dim">Explore</span>
              </button>
              <button 
                onClick={() => nav('/customer/profile')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-white/5 active:scale-95 transition-all"
              >
                <span className="text-2xl">👤</span>
                <span className="text-[9px] font-bold text-text-dim">Profile</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h2 className="text-lg font-black text-text mb-4">Choose Category</h2>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                    selectedCategory === 'all'
                      ? 'bg-primary border-transparent text-white shadow-lg'
                      : 'bg-card border-white/5 text-text-dim'
                  }`}
                >
                  🎯 All
                </button>
                {BUSINESS_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                      selectedCategory === cat.id
                        ? 'bg-primary border-transparent text-white shadow-lg'
                        : 'bg-card border-white/5 text-text-dim'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nearby Businesses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-text">
                  📍 Nearby Businesses
                </h2>
                {userLoc && (
                  <button 
                    onClick={() => getUserLocation().then(loc => loc && calculateNearbyBusinesses(loc))}
                    className="text-xs font-bold text-primary"
                  >
                    Refresh
                  </button>
                )}
              </div>

              {!userLoc ? (
                <div className="text-center py-12 bg-card/30 rounded-3xl border border-white/5">
                  <span className="text-5xl block mb-4">📍</span>
                  <p className="text-text-dim mb-4">Enable location to see nearby businesses</p>
                  <button 
                    onClick={() => getUserLocation().then(loc => loc && calculateNearbyBusinesses(loc))}
                    className="px-6 py-3 rounded-2xl bg-primary text-white font-bold"
                  >
                    Enable Location
                  </button>
                </div>
              ) : filteredBusinesses.length === 0 ? (
                <div className="text-center py-12 bg-card/30 rounded-3xl border border-white/5">
                  <span className="text-5xl block mb-4">🔍</span>
                  <p className="text-text-dim">No businesses found in this category</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBusinesses.map((business: any) => {
                    const catInfo = getCategoryInfo(business.businessType);
                    return (
                      <motion.button
                        key={business.uid}
                        onClick={() => nav(`/customer/salon/${business.uid}`)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full p-5 rounded-3xl bg-card border border-white/5 text-left flex items-start gap-4 hover:border-primary/40 transition-all active:scale-[0.98] shadow-xl"
                      >
                        <div className="w-20 h-20 rounded-2xl bg-card-2 flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/10">
                          {business.bannerImageURL ? (
                            <img src={business.bannerImageURL} className="w-full h-full object-cover" alt="" />
                          ) : <span className="text-3xl">{catInfo.icon}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-text truncate">{business.businessName}</p>
                          <p className="text-[10px] font-black text-primary/70 uppercase tracking-widest mb-2">{catInfo.label}</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1 text-[10px] font-black text-gold">
                              ⭐ {business.rating || 'New'}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black text-text-dim">
                              📍 {business.distance?.toFixed(1)} km
                            </div>
                            {business.isOpen && (
                              <div className="flex items-center gap-1 text-[10px] font-black text-success">
                                🟢 Open
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="self-center">
                          <div className="w-8 h-8 rounded-xl bg-card-2 border border-white/5 flex items-center justify-center text-text-dim">›</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Favorites Section */}
            {allSalons.filter(s => isFavorite(s.uid)).length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-black text-text mb-4">❤️ Your Favorites</h2>
                <div className="space-y-4">
                  {allSalons.filter(s => isFavorite(s.uid)).slice(0, 3).map(business => {
                    const catInfo = getCategoryInfo(business.businessType);
                    return (
                      <button
                        key={business.uid}
                        onClick={() => nav(`/customer/salon/${business.uid}`)}
                        className="w-full p-4 rounded-2xl bg-card border border-white/5 text-left flex items-center gap-3 active:scale-95 transition-all"
                      >
                        <div className="w-14 h-14 rounded-xl bg-card-2 flex items-center justify-center overflow-hidden">
                          {business.bannerImageURL ? (
                            <img src={business.bannerImageURL} className="w-full h-full object-cover" alt="" />
                          ) : <span className="text-2xl">{catInfo.icon}</span>}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-text">{business.businessName}</p>
                          <p className="text-xs text-text-dim">{catInfo.label}</p>
                        </div>
                        <span className="text-xl">›</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </ResponsiveContainer>
  );
}
