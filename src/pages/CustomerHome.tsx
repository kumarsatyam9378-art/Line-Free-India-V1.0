import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, getCategoryInfo, BUSINESS_CATEGORIES } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { getBusinessImageWithFallback } from '../utils/categoryImages';

export default function CustomerHome() {
  const { 
    allSalons, 
    customerProfile, 
    isFavorite, 
    toggleFavorite,
    getUserLocation
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
      .filter(s => s.lat && s.lng && s.lat !== 0 && s.lng !== 0)
      .map(s => ({
        ...s,
        distance: getDistanceKm(loc.lat, loc.lng, s.lat!, s.lng!)
      }))
      .filter(b => b.distance < 50)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 50);
    
    setNearbyBusinesses(businessesWithDistance);
  };

  const getFilteredBusinesses = () => {
    // Show ALL businesses, not just nearby
    let filtered = allSalons;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.businessType === selectedCategory);
    }
    return filtered;
  };

  const filteredBusinesses = getFilteredBusinesses();
  const favoriteBusinesses = allSalons.filter(s => isFavorite(s.uid));

  return (
    <ResponsiveContainer variant="customer">
      <div className="h-full flex flex-col font-sans relative overflow-hidden bg-bg">
        {/* Header - Exactly like reference image */}
        <div className="bg-bg px-4 pt-6 pb-4">
          {/* Greeting with Avatar */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-dim">Good Morning,</p>
              <h1 className="text-2xl font-black text-text flex items-center gap-2">
                {customerProfile?.name || 'Satyam'}
                <span className="px-2 py-0.5 bg-success/20 text-success text-[10px] font-black rounded">🟢 LIVE NOW</span>
              </h1>
            </div>
            {customerProfile?.photoURL && (
              <img 
                src={customerProfile.photoURL} 
                alt="Profile" 
                className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
              />
            )}
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="🔍 Discover premium excellence..."
              className="w-full px-4 py-3 rounded-xl bg-card border border-white/5 text-text placeholder:text-text-dim focus:outline-none focus:border-primary/30"
              readOnly
              onClick={() => nav('/customer/search')}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <button className="text-xs px-2 py-1 rounded bg-card-2 text-text-dim">Shortcut</button>
              <button className="text-xs px-2 py-1 rounded bg-card-2 text-text-dim">Alt</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-bg">
          <div className="px-4 pb-24">
            {/* Discovery Portal - Category Pills */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👑</span>
                  <h2 className="text-sm font-black text-text uppercase">Discovery Portal</h2>
                </div>
                <button className="text-xs font-bold text-primary">VIEW ALL →</button>
              </div>
              <p className="text-[10px] text-text-dim uppercase tracking-wider mb-3">Explore Premium Services</p>
              
              {/* Horizontal Scrolling Categories */}
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-primary border-primary text-white'
                      : 'bg-card border-white/5 text-text-dim'
                  }`}
                >
                  <span className="text-2xl">✨</span>
                  <span className="text-[10px] font-bold uppercase">Trending</span>
                </button>
                {BUSINESS_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                      selectedCategory === cat.value
                        ? 'bg-primary border-primary text-white'
                        : 'bg-card border-white/5 text-text-dim'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-[10px] font-bold uppercase whitespace-nowrap">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Partners Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👑</span>
                    <h2 className="text-sm font-black text-text uppercase">Premium Partners</h2>
                  </div>
                  <p className="text-[10px] text-text-dim uppercase tracking-wider mt-1">
                    {filteredBusinesses.length} Elite Business{filteredBusinesses.length !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>

              {/* Business Cards - With Profile Photo like reference */}
              {filteredBusinesses.length === 0 ? (
                <div className="text-center py-12 bg-card/30 rounded-3xl border border-white/5">
                  <span className="text-5xl block mb-4">🔍</span>
                  <p className="text-text-dim">No businesses found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBusinesses.map(business => {
                    const catInfo = getCategoryInfo(business.businessType);
                    const minPrice = business.services && business.services.length > 0
                      ? Math.min(...business.services.map(s => s.price))
                      : null;
                    const isLive = business.isOpen && !business.isBreak && !business.isStopped;
                    
                    return (
                      <button
                        key={business.uid}
                        onClick={() => nav(`/customer/salon/${business.uid}`)}
                        className="w-full bg-card rounded-3xl border border-white/5 overflow-hidden text-left hover:border-primary/30 transition-all active:scale-[0.98] flex items-center gap-4 p-4"
                      >
                        {/* Profile Photo - Rounded like reference image */}
                        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                          <img 
                            src={getBusinessImageWithFallback(business.photoURL, business.bannerImageURL, business.businessType)} 
                            alt={business.businessName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Business Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-black text-text mb-1 truncate">{business.businessName}</h3>
                          
                          {/* Location */}
                          <div className="flex items-center gap-2 text-xs text-text-dim mb-2">
                            <span>📍</span>
                            <span className="truncate">{business.location || 'SHOP NO 7 BUILDING NAME, GOBINDPUR, GOBINDPUR, JHARKHAND - 828104'}</span>
                          </div>
                          
                          {/* LIVE NOW Badge and Price */}
                          <div className="flex items-center gap-2">
                            {isLive ? (
                              <span className="px-2 py-0.5 rounded bg-success text-white text-[10px] font-black uppercase flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                LIVE NOW
                              </span>
                            ) : business.isBreak ? (
                              <span className="px-2 py-0.5 rounded bg-warning text-white text-[10px] font-black uppercase">
                                🟡 ON BREAK
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-danger text-white text-[10px] font-black uppercase">
                                🔴 CLOSED
                              </span>
                            )}
                            {minPrice && (
                              <span className="text-xs">
                                <span className="text-text-dim font-bold">FROM</span>
                                <span className="text-primary font-black ml-1">₹{minPrice}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Favorite Heart */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(business.uid);
                          }}
                          className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 backdrop-blur flex items-center justify-center text-xl hover:scale-110 transition-transform"
                        >
                          {isFavorite(business.uid) ? '❤️' : '🤍'}
                        </button>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </ResponsiveContainer>
  );
}
